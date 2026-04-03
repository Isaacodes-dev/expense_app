const LOCALE = import.meta.env.VITE_LOCALE ?? 'en-ZM';
const CURRENCY = import.meta.env.VITE_CURRENCY ?? 'ZMW';

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
    }).format(amount);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString(LOCALE, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
