class IsraeliTourismChatbot {
    constructor() {
        this.apiKey = 'AIzaSyAGsn4b0lqdKZ0Vqfs7vf6U4WcZDh4TFFI';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.conversationHistory = [];
        this.isProcessing = false;

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
        this.tourismContext = `
אתה עוזר תיירות ישראלי מומחה ומועיל. אתה עונה בעברית בלבד ומתמחה במידע תיירותי על ישראל.

המידע שלך כולל:

🏛️ אתרים היסטוריים ודתיים:
- ירושלים: הכותל המערבי, הר הבית, כנסיית הקבר, דרך הסבל, מוזיאון ישראל
- נצרת: כנסיית הבשורה, בזיליקת הבשורה
- צפת: העיר העתיקה, בתי כנסת עתיקים, רובע האמנים
- טבריה: קברי צדיקים, חמי טבריה
- מצדה: מבצר הרודוס, תצפית על ים המלח
- קיסריה: תיאטרון רומי, נמל עתיק, אמפיתיאטרון

🌊 אטרקציות טבע וחופים:
- ים המלח: רחצה במים מלוחים, בוץ טיפולי, עין גדי
- אילת: שמורת הטבע התת-ימית, חופי האלמוגים
- חופי תל אביב: חוף פרישמן, חוף גורדון, חוף הילטון
- חופי חיפה: חוף קריות, חוף דדו
- כינרת: חופי מים מתוקים, טיילת טבריה
- מכתש רמון: תצפיות, מסלולי הליכה

🍽️ אוכל וקולינריה:
- פלאפל וחומוס במזרח ירושלים
- שוק מחנה יהודה בירושלים
- שוק הכרמל בתל אביב
- דגים בנמל יפו העתיק
- יינות ברמת הגולן ובכרמים

🎭 אירועים ופסטיבלים:
- פסטיבל ישראל בירושלים (מאי-יוני)
- פסטיवל רד סי ג'אז באילת (אוגוסט)
- לילה לבן בתל אביב (יוני)
- פסטיבל קול המוסיקה בחיפה

🚗 תחבורה ומידע מעשי:
- רכבת ישראל: קווים ראשיים בין ערים
- אוטובוסים: אגד, דן, מטרופולין
- מוניות שירות בין ערים
- השכרת רכב מומלצת לטיולים

📍 ערים מרכזיות:
- ירושלים: בירת ישראל, מרכז דתי והיסטורי
- תל אביב: מרכז כלכלי ותרבותי, חיי לילה
- חיפה: עיר נמל, גנים בהאיים, מרכז טכנולוגי
- אילת: עיר נופש, ים אדום, פעילות ימית

חשוב: תמיד ענה בעברית, היה ידידותי ומועיל, ותן המלצות מעשיות.
`;
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
            this.addBotMessage('מצטער, אירעה שגיאה. אנא נסו שוב מאוחר יותר.');
            console.error('Error:', error);
        }

        this.isProcessing = false;
        this.toggleSendButton(true);
        this.messageInput.focus();
    }

    addUserMessage(message) {
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
        // Convert newlines to paragraphs
        let formatted = message.split('\n').map(line => {
            line = line.trim();
            if (!line) return '';

            // Handle bullet points
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                return `<li>${this.escapeHtml(line.substring(1).trim())}</li>`;
            }

            return `<p>${this.escapeHtml(line)}</p>`;
        });

        // Group consecutive list items
        let result = '';
        let inList = false;

        for (const line of formatted) {
            if (line.startsWith('<li>')) {
                if (!inList) {
                    result += '<ul>';
                    inList = true;
                }
                result += line;
            } else {
                if (inList) {
                    result += '</ul>';
                    inList = false;
                }
                result += line;
            }
        }

        if (inList) {
            result += '</ul>';
        }

        return result;
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

    async callGeminiAPI(userMessage) {
        const prompt = `${this.tourismContext}

שאלה מהמשתמש: ${userMessage}

אנא ענה בעברית בצורה ידידותית ומועילה, תן מידע מפורט ורלוונטי על תיירות בישראל. אם השאלה לא קשורה לתיירות, הפנה בעדינות לנושאי תיירות בישראל.`;

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('API Error:', error);
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