import { routeLang } from '@/js/shared/helpers/routeLang';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Button from "../../components/ui/Button";
import { Star, Building2, Menu, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import LanguageSelector from "../../components/LanguageSelector";
import CurrencySelector from "../../components/CurrencySelector";
import '@/css/frontend-public/style.css'
import '@/css/tailwind.css'
import { useState } from 'react';

interface PublicNavbarProps {
    active: string;
}

export default function PublicNavbar({ active }: PublicNavbarProps) {
    const { auth, locale } = usePage<InertiaMiddlewareProps>().props;
    const { t: __ } = useTranslation(['static-text']);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation menu items
    const menus = [
        {
            label: __('Home'),
            href: routeLang('public-home'),
            isActive: active === 'home',
        },
        {
            label: __('Rooms'),
            href: '/room-search',
            isActive: active === 'rooms',
        },
        {
            label: __('Amenities'),
            href: '#amenities',
            isActive: active === 'amenities',
        },
        {
            label: __('Contact'),
            href: '#contact',
            isActive: active === 'contact',
        },
    ];

    return (
        <>
            {/* Mobile-First Navigation Header */}
            <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-lg backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between lg:h-20">
                        {/* Logo */}
                        <Link href="/demo-hotel" className="flex items-center space-x-2 lg:space-x-3">
                            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 lg:rounded-xl lg:p-2">
                                <Building2 className="h-6 w-6 text-white lg:h-8 lg:w-8" />
                            </div>
                            <div>
                                <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-lg font-bold text-transparent lg:text-2xl">
                                    {__('Grand Palace Hotel')}
                                </span>
                                <div className="hidden items-center space-x-1 sm:flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 lg:h-3 lg:w-3" />
                                    ))}
                                </div>
                            </div>
                        </Link>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-6 md:flex lg:space-x-8">
                            {menus.map((menu) => (
                                menu.href.startsWith('#') ? (
                                    <a
                                        key={menu.label}
                                        href={menu.href}
                                        className={`text-sm transition-colors lg:text-base ${
                                            menu.isActive
                                                ? 'font-medium text-blue-600'
                                                : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                    >
                                        {menu.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={menu.label}
                                        href={menu.href}
                                        className={`text-sm transition-colors lg:text-base ${
                                            menu.isActive
                                                ? 'font-medium text-blue-600'
                                                : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                    >
                                        {menu.label}
                                    </Link>
                                )
                            ))}

                            {/* Selectors Group */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <CurrencySelector />
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="space-y-4 border-t border-gray-200 bg-white py-4 md:hidden">
                            {menus.map((menu) => (
                                menu.href.startsWith('#') ? (
                                    <a
                                        key={menu.label}
                                        href={menu.href}
                                        className={`block px-4 py-2 ${
                                            menu.isActive
                                                ? 'font-medium text-blue-600'
                                                : 'text-gray-700'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {menu.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={menu.label}
                                        href={menu.href}
                                        className={`block px-4 py-2 ${
                                            menu.isActive
                                                ? 'font-medium text-blue-600'
                                                : 'text-gray-700'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {menu.label}
                                    </Link>
                                )
                            ))}

                            {/* Mobile Selectors Group */}
                            <div className="flex items-center space-x-4 px-4 py-2">
                                <CurrencySelector mobile={true} />
                                <LanguageSelector mobile={true} />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
