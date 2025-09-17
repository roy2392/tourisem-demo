// Israeli Tourism Knowledge Base for RAG System
const TOURISM_KNOWLEDGE_BASE = {
    // Major Cities and Attractions
    cities: {
        jerusalem: {
            name: "ירושלים",
            attractions: [
                {
                    name: "הכותל המערבי",
                    hours: "פתוח 24 שעות",
                    description: "אתר קדוש יהודי, שרידי בית המקדש השני",
                    address: "הכותל המערבי, העיר העתיקה, ירושלים",
                    free: true
                },
                {
                    name: "יד ושם",
                    hours: "ראשון-רביעי 8:30-17:00, חמישי 8:30-20:00, שישי 8:30-14:00",
                    description: "מוזיאון זיכרון השואה הרשמי של ישראל",
                    address: "הר הזיכרון, ירושלים",
                    free: true
                },
                {
                    name: "מוזיאון ישראל",
                    hours: "ראשון שלישי רביעי שבת 10:00-17:00, שני 16:00-21:00, חמישי 10:00-21:00",
                    description: "מוזיאון הארכיאולוגיה והאמנות הגדול בישראל",
                    address: "דרך רופין 11, ירושלים",
                    ticket: "58 שקל למבוגרים"
                },
                {
                    name: "העיר העתיקה",
                    hours: "פתוח תמיד, חנויות 9:00-18:00",
                    description: "ארבעת הרבעים הקדושים עם אתרים היסטוריים",
                    address: "העיר העתיקה, ירושלים",
                    free: true
                },
                {
                    name: "הר ציון",
                    hours: "יומי 8:00-17:00",
                    description: "קבר המלך דוד וחדר הסעודה האחרונה",
                    address: "הר ציון, ירושלים",
                    free: true
                }
            ]
        },
        telaviv: {
            name: "תל אביב",
            attractions: [
                {
                    name: "חופי תל אביב",
                    hours: "פתוח 24 שעות, מציל 7:00-19:00",
                    description: "14 ק\"מ של חופי ים תיכון עם פעילויות ספורט ימיים",
                    address: "טיילת תל אביב",
                    free: true
                },
                {
                    name: "נמל יפו העתיקה",
                    hours: "פתוח 24 שעות, גלריות 10:00-18:00",
                    description: "נמל עתיק בן 4000 שנה עם גלריות אמנות ומסעדות",
                    address: "נמל יפו, תל אביב",
                    free: true
                },
                {
                    name: "שוק הכרמל",
                    hours: "ראשון-חמישי 8:00-17:00, שישי 8:00-15:00",
                    description: "השוק הכי צבעוני בתל אביב עם פירות וירקות טריים",
                    address: "שוק הכרמל, תל אביב",
                    free: true
                },
                {
                    name: "רחוב רוטשילד",
                    hours: "פתוח תמיד",
                    description: "שדרה מרכזית עם ארכיטקטורת באוהאוס ובתי קפה",
                    address: "שדרות רוטשילד, תל אביב",
                    free: true
                },
                {
                    name: "מוזיאון תל אביב לאמנות",
                    hours: "שני רביעי שישי שבת 10:00-18:00, שלישי חמישי 10:00-21:00",
                    description: "מוזיאון אמנות מודרנית וקלאסית",
                    address: "שד' שאול המלך 27, תל אביב",
                    ticket: "50 שקל למבוגרים"
                }
            ]
        },
        haifa: {
            name: "חיפה",
            attractions: [
                {
                    name: "גני הבהאים",
                    hours: "יומי 9:00-17:00",
                    description: "19 טרסות מעוצבות על הר הכרמל, אתר מורשת עולמי",
                    address: "הר הכרמל, חיפה",
                    free: true
                },
                {
                    name: "הרי הכרמל",
                    hours: "יומי",
                    description: "שמורת טבע עם שבילי הליכה ונופים מרהיבים",
                    address: "הר הכרמל, חיפה",
                    free: true
                }
            ]
        },
        eilat: {
            name: "אילת",
            attractions: [
                {
                    name: "שמורת אלמוגים",
                    hours: "יומי 8:30-16:00",
                    description: "שמורת טבע ימית עם אלמוגים צבעוניים ודגים טרופיים",
                    address: "חוף אלמוגים, אילת",
                    ticket: "35 שקל למבוגרים"
                },
                {
                    name: "חוף הצפון",
                    hours: "פתוח 24 שעות",
                    description: "חוף שקט עם מים צלולים לשנורקלינג וצלילה",
                    address: "חוף הצפון, אילת",
                    free: true
                }
            ]
        }
    },

    // Natural Attractions
    nature: {
        deadsea: {
            name: "ים המלח",
            hours: "יומי 8:00-17:00 (חורף), 8:00-19:00 (קיץ)",
            description: "הנקודה הנמוכה ביותר על פני האדמה עם בוץ טיפולי",
            address: "ים המלח, ישראל",
            activities: ["רחצה במים מלוחים", "טיפולי בוץ", "ספא טבעי"]
        },
        masada: {
            name: "מצדה",
            hours: "קיץ 5:00-17:00, חורף 8:00-16:00",
            description: "מבצר עתיק על צוק במדבר יהודה, אתר מורשת עולמי",
            address: "מצדה, מדבר יהודה",
            ticket: "31 שקל למבוגרים + רכבל 74 שקל"
        },
        galilee: {
            name: "הגליל",
            hours: "יומי",
            description: "אזור הררי עם נופים ירוקים, אגם כנרת ואתרים נוצריים",
            address: "צפון ישראל",
            activities: ["טיולי טבע", "אתרים נוצריים", "כנרת"]
        }
    },

    // Food and Culture
    food: {
        traditional: [
            "חומוס ופלאפל - מאכלים מקומיים מפורסמים",
            "שקשוקה - ביצים ברוטב עגבניות",
            "בורקס - מאפה במילוי גבינה או תפוחי אדמה",
            "מלאוח - לחם יהודי תימני",
            "סביח - פיתה עם חצילים קשים וביצים"
        ],
        markets: [
            "שוק מחנה יהודה ירושלים - שני עד חמישי 8:00-19:00, שישי 8:00-15:00",
            "שוק הכרמל תל אביב - ראשון עד חמישי 8:00-17:00, שישי 8:00-15:00",
            "שוק הצפון תל אביב - יומי 8:00-20:00"
        ]
    },

    // Transportation
    transportation: {
        buses: "אוטובוסים - אגד ודן, כרטיס יומי 26 שקל",
        trains: "רכבת ישראל - חיפה לתל אביב 20 שקל",
        taxis: "מוניות ו-גט - 12 שקל התחלה + 2.33 שקל לק\"מ",
        sherut: "שירות - מוניות שיתוף קווי"
    },

    // Practical Information
    practical: {
        currency: "שקל חדש (ILS)",
        language: "עברית וערבית, רוב הישראלים דוברי אנגלית",
        tipping: "10-15% במסעדות ובתי קפה",
        emergency: "משטרה 100, מכבי אש 102, מגן דוד אדום 101",
        weather: "אקלים ים תיכוני - קיץ חם ויבש, חורף מתון וגשום"
    }
};

// RAG Search Function
function searchKnowledgeBase(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    const hebrewQuery = query;

    // Search in cities
    Object.values(TOURISM_KNOWLEDGE_BASE.cities).forEach(city => {
        if (city.name.includes(hebrewQuery) || queryLower.includes(city.name)) {
            results.push({
                type: 'city',
                data: city,
                relevance: 1.0
            });
        }

        city.attractions.forEach(attraction => {
            if (attraction.name.includes(hebrewQuery) ||
                attraction.description.includes(hebrewQuery) ||
                queryLower.includes('hours') || queryLower.includes('שעות')) {
                results.push({
                    type: 'attraction',
                    data: attraction,
                    city: city.name,
                    relevance: 0.9
                });
            }
        });
    });

    // Search in nature sites
    Object.values(TOURISM_KNOWLEDGE_BASE.nature).forEach(site => {
        if (site.name.includes(hebrewQuery) || site.description.includes(hebrewQuery)) {
            results.push({
                type: 'nature',
                data: site,
                relevance: 0.8
            });
        }
    });

    // Search in food information
    if (queryLower.includes('food') || queryLower.includes('אוכל') ||
        queryLower.includes('מסעדה') || queryLower.includes('שוק')) {
        results.push({
            type: 'food',
            data: TOURISM_KNOWLEDGE_BASE.food,
            relevance: 0.7
        });
    }

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TOURISM_KNOWLEDGE_BASE, searchKnowledgeBase };
}