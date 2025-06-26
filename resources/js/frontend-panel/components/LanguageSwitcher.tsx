import { useTranslation } from 'react-i18next';
import i18n from '@/js/shared/lang/i18n';
import React from 'react';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { setLocaleCookie } from '@/js/shared/cookies/localeCookie';

interface Language {
    code: string;
    name: string;
    flag: string;
}

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '/assets/images/us.svg' },
    { code: 'pt', name: 'Português', flag: '/assets/images/pt.svg' },
    { code: 'es', name: 'Español', flag: '/assets/images/es.svg' },
    { code: 'fr', name: 'Français', flag: '/assets/images/fr.svg' },
];

const LanguageSwitcher: React.FC = () => {
    const { t: __ } = useTranslation(['static-text']);
    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const handleChange = (lng: string) => {
        // Update user language via API or Inertia POST (you may need to implement this endpoint)
        router.post('/panel/user/language', { language: lng }, {
            preserveScroll: true,
            onSuccess: () => {
                i18n.changeLanguage(lng);
            }
        });
        setLocaleCookie(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                        src={currentLang.flag}
                        alt={currentLang.code}
                        className="h-4 w-4 rounded-sm"
                    />
                    <span className="text-sm">{currentLang.name}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[120px]">
                {LANGUAGES.map(lang => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleChange(lang.code)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <img
                            src={lang.flag}
                            alt={lang.code}
                            className="h-4 w-4 rounded-sm"
                        />
                        <span className="text-sm">{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
