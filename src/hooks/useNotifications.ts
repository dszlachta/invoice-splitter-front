import { useState } from 'react';

import {
    createNotification,
    Notification,
} from '../logic/notification';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[] | []>([]);

    const addNotification = (notification: Omit<Notification, 'id'>) => setNotifications([
        ...notifications,
        createNotification(notification),
    ]);

    return [
        notifications,
        addNotification,
    ] as const;
}
