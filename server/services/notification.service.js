import crypto from 'crypto';

// In-memory store for notifications
const notificationsStore = {};

function generateId() {
    return crypto.randomBytes(8).toString('hex');
}

/**
 * Pre-populate notifications for a user if they don't exist
 * @param {string} userId 
 */
function initNotifications(userId) {
    if (!notificationsStore[userId]) {
        const now = new Date();
        notificationsStore[userId] = [
            {
                id: generateId(),
                userId,
                type: 'safety_alert',
                title: 'High Risk Area Ahead',
                message: 'You are approaching an area with recent reported incidents. Stay vigilant.',
                severity: 'high',
                read: false,
                createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
                location: { lat: 11.0168, lng: 76.9558 }
            },
            {
                id: generateId(),
                userId,
                type: 'weather_warning',
                title: 'Heavy Rain Alert',
                message: 'Expected heavy rainfall in your vicinity for the next 2 hours.',
                severity: 'medium',
                read: false,
                createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
                location: null
            },
            {
                id: generateId(),
                userId,
                type: 'police_advisory',
                title: 'Night Patrols Increased',
                message: 'Local authorities have increased patrols in Peelamedu area.',
                severity: 'low',
                read: true,
                createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
                location: null
            },
            {
                id: generateId(),
                userId,
                type: 'community_report',
                title: 'Report Verified',
                message: 'Your recent community safety report has been verified by moderators.',
                severity: 'low',
                read: true,
                createdAt: new Date(now.getTime() - 240 * 60000).toISOString(),
                location: null
            },
            {
                id: generateId(),
                userId,
                type: 'prediction_update',
                title: 'Weekly Safety Forecast',
                message: 'Safety forecast for your regular commute routes has been updated.',
                severity: 'medium',
                read: false,
                createdAt: new Date(now.getTime() - 1440 * 60000).toISOString(),
                location: null
            }
        ];
    }
}

/**
 * Get notifications for a user
 * @param {string} userId 
 * @returns {Array} Notifications array
 */
export function getNotifications(userId = 'usr_1') {
    initNotifications(userId);
    return notificationsStore[userId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Create a new notification
 * @param {string} userId 
 * @param {string} type 
 * @param {object} data 
 * @returns {object} The created notification
 */
export function createNotification(userId, type, data) {
    initNotifications(userId);
    
    const newNotif = {
        id: generateId(),
        userId,
        type,
        title: data.title || 'Notification',
        message: data.message || '',
        severity: data.severity || 'low',
        read: false,
        createdAt: new Date().toISOString(),
        location: data.location || null
    };

    notificationsStore[userId].push(newNotif);
    return newNotif;
}

/**
 * Mark a notification as read
 * @param {string} notificationId 
 * @returns {boolean} Success status
 */
export function markAsRead(notificationId) {
    for (const userId in notificationsStore) {
        const notif = notificationsStore[userId].find(n => n.id === notificationId);
        if (notif) {
            notif.read = true;
            return true;
        }
    }
    return false;
}
