declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        readonly VITE_LOCALE?: string;
        readonly VITE_CURRENCY?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}
