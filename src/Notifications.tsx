import React from 'react';

import { Notification } from './logic/notification';

import './Notifications.css';

type NotificationsProps = {
    notifications: Notification[] | [],
}

export function Notifications({ notifications }: NotificationsProps) {
    const items = notifications.map(({ id, type, message }) => (
        <li
            key={id}
            className={`notification ${type}`}
        >
            {message}
        </li>
    ));

    if (!notifications.length) return (<></>);

    return (
        <ul className="notifications">
            {items}
        </ul>
    );
}
