export type Notification = {
    id: number,
    type: NotificationType,
    message: string,
}
type NotificationType = 'error' | 'warning';
export type NotificationData = Omit<Notification, 'id'>;

let notificationCounter = 0;

export function createNotification({ type, message }: NotificationData): Notification {
    notificationCounter += 1;

    return {
        id: notificationCounter,
        type,
        message,
    };
}
