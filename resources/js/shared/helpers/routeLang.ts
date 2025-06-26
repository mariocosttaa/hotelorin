import { route as ziggyRoute } from 'ziggy-js';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';

export function routeLang(name: string, params: Record<string, any> = {}) {
    const { locale: currentLocale } = usePage<InertiaMiddlewareProps>().props;
    const locale = params.locale || currentLocale;
    // Only add locale if it's present
    if (locale) {
        return ziggyRoute(name, { locale, ...params });
    }
    return ziggyRoute(name, { ...params });
}

export function routeLangStatic(name: string, params: Record<string, any> = {}) {
    // Only add locale for public routes
    const isPublicRoute = name.startsWith('public');
    if (isPublicRoute) {
        const locale = params.locale || document.documentElement.lang || 'en';
        return ziggyRoute(name, { locale, ...params });
    }
    // For panel/auth, do not add locale
    return ziggyRoute(name, { ...params });
}
