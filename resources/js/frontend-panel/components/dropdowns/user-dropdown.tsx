/**
 * Fixed User Profile Dropdown with working theme submenu
 */

import type { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Globe, HelpCircle, Monitor, Moon, Settings, Shield, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { setLocaleCookie } from '@/js/shared/cookies/localeCookie';

interface UserDropdownProps {
    theme: string;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    onOpenProfile?: () => void;
    onOpenSettings?: () => void;
    onSignOut?: () => void;
}

export function UserDropdown({ theme, setTheme, onOpenProfile, onOpenSettings, onSignOut }: UserDropdownProps) {
    const { auth, locale } = usePage<InertiaMiddlewareProps>().props;
    const { t: __, i18n } = useTranslation(['menu', 'static-text']);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showThemes, setShowThemes] = useState(false);
    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        setShowThemes(false);
    };

    const changeLanguage = (lng: string) => {
        router.post('/panel/user/language', { language: lng }, {
            preserveScroll: true,
            onSuccess: () => {
                i18n.changeLanguage(lng);
                router.reload();
            }
        });
        setLocaleCookie(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-muted/50">
                    <Avatar className="h-9 w-9 ring-2 ring-[#e2af04]/20">
                        <AvatarImage src={'/placeholder.svg'} alt={auth.user.name} />
                        <AvatarFallback className="bg-[#e2af04] text-white">
                            {auth.user.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-72 rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl"
                align="end"
                sideOffset={8}
                forceMount
            >
                <DropdownMenuLabel className="p-4 font-normal">
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-[#e2af04]/20">
                                <AvatarImage src={'/placeholder.svg'} alt={auth.user.name} />
                                <AvatarFallback className="bg-[#e2af04] text-white">
                                    {auth.user.name
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
                                <p className="truncate text-sm font-semibold leading-none">{auth.user.name}</p>
                                <p className="mt-1 truncate text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {__('Since', { ns: 'static-text' })} {new Date(auth.user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                    {__('Rank', { ns: 'static-text' })}
                                </span>
                                <span className="text-xs font-medium text-foreground">
                                    {auth.rank?.name || <span className="text-muted-foreground">—</span>}
                                </span>
                            </div>
                            <div className="h-6 w-px bg-border/40 mx-2" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                    {__('Sector', { ns: 'static-text' })}
                                </span>
                                <span className="text-xs font-medium text-foreground">
                                    {auth.sector?.name || <span className="text-muted-foreground">—</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuGroup className="p-2">
                    <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer rounded-xl">
                        <User className="mr-3 h-4 w-4" />
                        <span>{__('Profile', { ns: 'menu' })}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer rounded-xl">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>{__('Settings', { ns: 'menu' })}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/30" />
                <div className="p-2">
                    <div
                        className="flex cursor-pointer select-none items-center rounded-xl px-4 py-2 hover:bg-muted/50"
                        tabIndex={0}
                        role="button"
                        onClick={() => setShowThemes((v) => !v)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Monitor className="mr-3 h-4 w-4" />
                        <span>{__('Theme', { ns: 'static-text' })}</span>
                        <span className="ml-auto">{showThemes ? '▲' : '▼'}</span>
                    </div>
                    {showThemes && (
                        <div className="mt-2 flex flex-col gap-1 px-2">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleThemeChange('light')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${theme === 'light' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <Sun className="mr-2 h-4 w-4" /> {__('Light', { ns: 'static-text' })}{' '}
                                {theme === 'light' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleThemeChange('dark')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${theme === 'dark' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <Moon className="mr-2 h-4 w-4" /> {__('Dark', { ns: 'static-text' })}{' '}
                                {theme === 'dark' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleThemeChange('system')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${theme === 'system' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <Monitor className="mr-2 h-4 w-4" /> {__('System', { ns: 'static-text' })}{' '}
                                {theme === 'system' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                        </div>
                    )}
                    <div
                        className="flex cursor-pointer select-none items-center rounded-xl px-4 py-2 hover:bg-muted/50"
                        tabIndex={0}
                        role="button"
                        onClick={() => setShowLanguages((v) => !v)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Globe className="mr-3 h-4 w-4" />
                        <span>{__('Language', { ns: 'static-text' })}</span>
                        <span className="ml-auto">{showLanguages ? '▲' : '▼'}</span>
                    </div>
                    {showLanguages && (
                        <div className="mt-2 flex flex-col gap-1 px-2">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => changeLanguage('en')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${locale === 'en' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <img src="/assets/images/us.svg" alt="English" className="mr-2" width={20} /> {__('English', { ns: 'static-text' })}{' '}
                                {locale === 'en' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => changeLanguage('pt')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${locale === 'pt' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <img src="/assets/images/pt.svg" alt="Português" className="mr-2" width={20} />{' '}
                                {__('Portuguese', { ns: 'static-text' })}{' '}
                                {locale === 'pt' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => changeLanguage('es')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${locale === 'es' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <img src="/assets/images/es.svg" alt="Spanish" className="mr-2" width={20} /> {__('Spanish', { ns: 'static-text' })}{' '}
                                {locale === 'es' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => changeLanguage('fr')}
                                className={`flex w-full items-center rounded-lg px-2 py-1 text-left ${locale === 'fr' ? 'bg-[#e2af04]/10 font-bold' : ''}`}
                            >
                                {' '}
                                <img src="/assets/images/fr.svg" alt="French" className="mr-2" width={20} /> {__('French', { ns: 'static-text' })}{' '}
                                {locale === 'fr' && <div className="ml-auto h-2 w-2 rounded-full bg-[#e2af04]" />}{' '}
                            </button>
                        </div>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <div className="p-2">
                    <DropdownMenuItem className="cursor-pointer rounded-xl">
                        <Shield className="mr-3 h-4 w-4" />
                        <span>{__('Privacy & Security', { ns: 'static-text' })}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-xl">
                        <HelpCircle className="mr-3 h-4 w-4" />
                        <span>{__('Help & Support', { ns: 'static-text' })}</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <div className="p-2">
                    <DropdownMenuItem onClick={onSignOut} className="cursor-pointer rounded-xl">
                        <ArrowLeft className="mr-3 h-4 w-4" />
                        <span>{__('Back', { ns: 'menu' })}</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
