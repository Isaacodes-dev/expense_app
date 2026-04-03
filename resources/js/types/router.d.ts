import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        layout?: 'auth' | 'app';
        requiresAuth?: boolean;
        guest?: boolean;
    }
}
