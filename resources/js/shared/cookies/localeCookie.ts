import Cookies from 'js-cookie';

const isBrowser = typeof window !== 'undefined';

export const setLocaleCookie = (locale: string): void => {
    Cookies.set('locale', locale, { path: '/' });
};

export const getLocaleCookie = (): string | null => {
    return Cookies.get('locale') || null;
};
