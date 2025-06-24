import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
    className?: string;
    mobile?: boolean;
}

function LanguageSelector({ className = "", mobile = false }: LanguageSelectorProps) {
    const { locale } = usePage<InertiaMiddlewareProps>().props;
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/');
        pathParts[1] = lng;
        url.pathname = pathParts.join('/');

        i18n.changeLanguage(lng);

        const currentScrollPosition = window.scrollY;
        router.visit(url.toString(), {
            preserveScroll: true,
            onSuccess: () => window.scrollTo(0, currentScrollPosition),
        });
    };

    return (
        <Select value={locale} onValueChange={changeLanguage}>
            <SelectTrigger className={mobile ? "w-20" : "w-16 border-0 bg-transparent text-sm lg:w-20"}>
                <Globe className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pt">PT</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default LanguageSelector;
