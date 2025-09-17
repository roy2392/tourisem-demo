class IsraeliTourismChatbot {
    constructor() {
        // Use serverless function instead of direct API call
        this.apiUrl = '/api/gemini';
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.conversationHistory = [];
        this.isProcessing = false;
        this.maxHistoryLength = 6; // Keep last 3 exchanges (6 messages)

        this.initializeEventListeners();
        this.initializeTourismContext();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.messageInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
        });
    }

    initializeTourismContext() {
        this.tourismContext = {
            hebrew: `
אתה עוזר התיירות הרשמי של משרד התיירות הישראלי. ענה בעברית קצר וברור לשאלות תיירות.

חשוב: תמיד ענה בקצרה! מקסימום 2-3 משפטים. מתאים לצ'אט בנייד. אל תשתמש בסימנים מיוחדים כמו # או * או -

תן תשובות קצרות ומעשיות בלי סימנים מיוחדים בהתבסס על המידע שיסופק.
`,
            english: `
You are the official tourism assistant of the Israeli Ministry of Tourism. Answer tourism questions clearly and concisely in English.

Important: Always answer briefly! Maximum 2-3 sentences. Suitable for mobile chat. Don't use special characters like # or * or -

Give short and practical answers without special characters based on the provided information.
`
        };
    }

    detectLanguage(text) {
        // Simple language detection based on character sets
        const hebrewRegex = /[\u0590-\u05FF]/;
        const arabicRegex = /[\u0600-\u06FF]/;

        if (hebrewRegex.test(text)) {
            return 'hebrew';
        } else if (arabicRegex.test(text)) {
            return 'arabic';
        } else {
            return 'english';
        }
    }

    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.toggleSendButton(false);

        this.addUserMessage(message);
        this.messageInput.value = '';
        this.adjustTextareaHeight();
        this.showTypingIndicator();

        try {
            const response = await this.callGeminiAPI(message);
            this.hideTypingIndicator();
            this.addBotMessage(response);
        } catch (error) {
            this.hideTypingIndicator();
            console.error('API Error:', error);

            // Detect language for error messages
            const userLanguage = this.detectLanguage(message);

            let errorMessage;
            if (userLanguage === 'hebrew') {
                errorMessage = 'מצטער, אירעה שגיאה. אנא נסו שוב מאוחר יותר.';
                if (error.message.includes('429')) {
                    errorMessage = 'יותר מדי בקשות. אנא המתינו מספר שניות ונסו שוב.';
                } else if (error.message.includes('403')) {
                    errorMessage = 'שגיאה באישור API. אנא בדקו את המפתח.';
                } else if (error.message.includes('Network')) {
                    errorMessage = 'בעיית חיבור לאינטרנט. אנא בדקו את החיבור ונסו שוב.';
                }
            } else {
                errorMessage = 'Sorry, an error occurred. Please try again later.';
                if (error.message.includes('429')) {
                    errorMessage = 'Too many requests. Please wait a few seconds and try again.';
                } else if (error.message.includes('403')) {
                    errorMessage = 'API authentication error. Please check the key.';
                } else if (error.message.includes('Network')) {
                    errorMessage = 'Internet connection problem. Please check your connection and try again.';
                }
            }

            this.addBotMessage(errorMessage);
        }

        this.isProcessing = false;
        this.toggleSendButton(true);
        this.messageInput.focus();
    }

    addUserMessage(message) {
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Limit history length
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;

        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        // Add to conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Limit history length
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${this.formatBotMessage(message)}
            </div>
        `;

        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    formatBotMessage(message) {
        // Clean the message from special characters
        let cleanMessage = message
            .replace(/[#*\-•]/g, '') // Remove special characters
            .replace(/\n+/g, ' ') // Replace multiple newlines with space
            .trim();

        // Split into paragraphs if message is long
        if (cleanMessage.length > 150) {
            const sentences = cleanMessage.split('. ');
            return sentences.map(sentence => `<p>${this.escapeHtml(sentence.trim())}</p>`).join('');
        }

        return `<p>${this.escapeHtml(cleanMessage)}</p>`;
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    toggleSendButton(enabled) {
        this.sendButton.disabled = !enabled;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatSearchResult(result) {
        if (result.type === 'attraction') {
            const { name, hours, description, address, ticket, free } = result.data;
            let info = `${name}: ${description}. `;
            if (hours) info += `שעות: ${hours}. `;
            if (address) info += `כתובת: ${address}. `;
            if (ticket) info += `כניסה: ${ticket}. `;
            if (free) info += `כניסה חינם. `;
            return info;
        }

        if (result.type === 'nature') {
            const { name, hours, description, address, ticket } = result.data;
            let info = `${name}: ${description}. `;
            if (hours) info += `שעות: ${hours}. `;
            if (address) info += `מיקום: ${address}. `;
            if (ticket) info += `כניסה: ${ticket}. `;
            return info;
        }

        if (result.type === 'city') {
            const city = result.data;
            let info = `${city.name}: `;
            if (city.attractions.length > 0) {
                info += city.attractions.slice(0, 3).map(a => a.name).join(', ');
            }
            return info;
        }

        return '';
    }

    async callGeminiAPI(userMessage) {
        // Detect user's language
        const userLanguage = this.detectLanguage(userMessage);
        const context = userLanguage === 'hebrew' ? this.tourismContext.hebrew : this.tourismContext.english;

        // Use RAG to find relevant information
        let relevantInfo = '';
        if (typeof searchKnowledgeBase !== 'undefined') {
            const searchResults = searchKnowledgeBase(userMessage);
            if (searchResults.length > 0) {
                const topResult = searchResults[0];
                relevantInfo = this.formatSearchResult(topResult);
            }
        }

        // Build conversation context
        let conversationContext = '';
        if (this.conversationHistory.length > 1) {
            if (userLanguage === 'hebrew') {
                conversationContext = '\n\nהקשר השיחה הקודמת:\n';
                const recentHistory = this.conversationHistory.slice(-4); // Last 2 exchanges
                recentHistory.forEach((msg, index) => {
                    const role = msg.role === 'user' ? 'משתמש' : 'עוזר';
                    conversationContext += `${role}: ${msg.content}\n`;
                });
            } else {
                conversationContext = '\n\nPrevious conversation context:\n';
                const recentHistory = this.conversationHistory.slice(-4); // Last 2 exchanges
                recentHistory.forEach((msg, index) => {
                    const role = msg.role === 'user' ? 'User' : 'Assistant';
                    conversationContext += `${role}: ${msg.content}\n`;
                });
            }
        }

        let prompt;
        if (userLanguage === 'hebrew') {
            prompt = `${context}

${relevantInfo ? `מידע רלוונטי: ${relevantInfo}` : ''}

${conversationContext}

שאלה נוכחית: ${userMessage}

חשוב מאוד: ענה רק 1-2 משפטים קצרים בלי סימנים מיוחדים כמו * או # או -. זה צ'אט נייד - תשובה קצרה ומועילה בטקסט רגיל בלבד. קח בחשבון את ההקשר של השיחה הקודמת.`;
        } else {
            prompt = `${context}

${relevantInfo ? `Relevant information: ${relevantInfo}` : ''}

${conversationContext}

Current question: ${userMessage}

Very important: Answer only in 1-2 short sentences without special characters like * or # or -. This is mobile chat - short and helpful answer in plain text only. Take into account the context of the previous conversation.

IMPORTANT: Answer in the same language as the user's question. If the user writes in English, respond in English. If the user writes in Hebrew, respond in Hebrew.`;
        }

        console.log('🔍 API Call Debug:');
        console.log('URL:', this.apiUrl);
        console.log('Prompt length:', prompt.length);

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    maxTokens: 200
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.response) {
                return data.response;
            } else {
                console.error('Invalid API response structure:', data);
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('🚨 Complete API Error:', error);
            console.error('Error type:', typeof error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
}

// Quick message functionality
function sendQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    const chatbot = window.chatbotInstance;

    if (chatbot && !chatbot.isProcessing) {
        messageInput.value = message;
        chatbot.sendMessage();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotInstance = new IsraeliTourismChatbot();

    // Add mobile-specific enhancements
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');

        // Better mobile keyboard handling
        const messageInput = document.getElementById('messageInput');
        const chatContainer = document.querySelector('.chat-container');

        // Handle virtual keyboard appearance
        let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

        const handleViewportChange = () => {
            if (window.visualViewport) {
                const currentHeight = window.visualViewport.height;
                const keyboardHeight = initialViewportHeight - currentHeight;

                if (keyboardHeight > 150) {
                    // Keyboard is open
                    chatContainer.style.maxHeight = `${currentHeight - 120}px`;
                } else {
                    // Keyboard is closed
                    chatContainer.style.maxHeight = '';
                }
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
        }

        // Prevent body scroll when chat is scrolled
        messageInput.addEventListener('focus', () => {
            document.body.style.overflow = 'hidden';
            setTimeout(() => window.chatbotInstance.scrollToBottom(), 300);
        });

        messageInput.addEventListener('blur', () => {
            document.body.style.overflow = '';
        });

        // Touch-friendly quick button handling
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.96)';
            });

            button.addEventListener('touchend', () => {
                button.style.transform = '';
            });
        });
    }

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.chatbotInstance.scrollToBottom();
        }, 500);
    });

    // Service Worker registration for offline support (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(() => console.log('Service Worker registration failed'));
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.chatbotInstance) {
        window.chatbotInstance.messageInput.focus();
    }
});