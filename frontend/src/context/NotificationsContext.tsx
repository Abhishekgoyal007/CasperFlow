"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
    id: string;
    type: 'subscription' | 'payment' | 'plan' | 'system';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    forWallet: string; // which wallet should see this
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    getNotificationsForWallet: (wallet: string | null) => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('casperflow_notifications');
        if (stored) {
            try {
                setNotifications(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse notifications');
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('casperflow_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotif: Notification = {
            ...notif,
            id: `notif_${Date.now()}`,
            timestamp: Date.now(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getNotificationsForWallet = (wallet: string | null) => {
        if (!wallet) return [];
        return notifications.filter(n => n.forWallet === wallet || n.forWallet === 'all');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            getNotificationsForWallet
        }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
}
