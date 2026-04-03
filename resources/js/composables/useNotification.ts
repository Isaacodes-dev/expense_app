import { ref } from 'vue';
import { defineStore } from 'pinia';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
}

let nextId = 0;

export const useNotificationStore = defineStore('notifications', () => {
    const items = ref<Notification[]>([]);

    function add(notification: Omit<Notification, 'id'>) {
        const id = nextId++;
        const duration = notification.duration ?? 4000;

        items.value.push({ ...notification, id });

        if (duration > 0) {
            setTimeout(() => remove(id), duration);
        }
    }

    function remove(id: number) {
        items.value = items.value.filter((n) => n.id !== id);
    }

    function success(title: string, message?: string) {
        add({ type: 'success', title, message });
    }

    function error(title: string, message?: string) {
        add({ type: 'error', title, message, duration: 6000 });
    }

    function info(title: string, message?: string) {
        add({ type: 'info', title, message });
    }

    return { items, add, remove, success, error, info };
});
