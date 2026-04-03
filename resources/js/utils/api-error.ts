import type { AxiosError } from 'axios';

export interface ApiValidationError {
    message: string;
    errors?: Record<string, string[]>;
}

export function isAxiosError(error: unknown): error is AxiosError<ApiValidationError> {
    return (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as AxiosError).isAxiosError === true
    );
}

export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred.'): string {
    if (isAxiosError(error)) {
        return error.response?.data?.message || fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

export function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
    if (isAxiosError(error)) {
        return error.response?.data?.errors;
    }

    return undefined;
}
