import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Sun, Moon, ArrowLeft, LogOut, Clock, Bell } from 'lucide-react';
import { useDarkMode } from '@/js/shared/context/DarkModeContext';
import PanelDefaultLayout from '../../layout/PanelDefaultLayout';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { usePage, router, Head } from '@inertiajs/react';
import type { InertiaMiddlewareProps, InertiaMiddlewareProps as SharedData } from '@/js/shared/types/Inertia-middleware-prop';
import { Tenant } from '@/js/shared/types/model/manager/Tenants';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { useToast } from '@/js/shared/hooks/useToast';
import { useState, useRef } from 'react';
import PanelLoading from './parts/PanelLoading';
import { routeLang } from '@/js/shared/helpers/routeLang';

interface PanelIndexProps {
    tenants?: Tenant[];
}

function PanelIndexContent({ tenants = [] }: PanelIndexProps) {
    const { auth } = usePage<InertiaMiddlewareProps>().props;
    const { t: __ } = useTranslation(['static-text']);
    const { isDarkMode, toggleTheme } = useDarkMode();
    const toast = useToast();
    const [loadingTenant, setLoadingTenant] = useState<Tenant | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isEntering, setIsEntering] = useState(false);
    const [showCoolAnimation, setShowCoolAnimation] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const shouldRedirectRef = useRef(true);

    // Generate routes once at component level to avoid hook violations
    const logoutRoute = routeLang('logout');

    // Create a map of tenant routes upfront
    const tenantRoutes = tenants.reduce((acc, tenant) => {
        acc[tenant.id] = routeLang('panel-dashboard', { tenantId: tenant.id });
        return acc;
    }, {} as Record<string, string>);

    const handleLogout = () => {
        router.post(logoutRoute, {}, {
            onSuccess: () => {
                toast.error(__('Successfully logged out', { ns: 'static-text' }), isDarkMode);
            }
        });
    };

    const handleCardClick = (tenant: Tenant) => {
        setIsEntering(true);
        setShowCoolAnimation(true);

        // Cool animation for 1 second
        setTimeout(() => {
            setShowCoolAnimation(false);
            setIsEntering(false);
            handleAccessDashboard(tenant);
        }, 1000);
    };

    const handleEnterClick = (tenant: Tenant) => {
        handleCardClick(tenant);
    };

    const handleAccessDashboard = (tenant: Tenant) => {
        setLoadingTenant(tenant);
        setLoadingProgress(0);
        shouldRedirectRef.current = true;

        // Get the pre-generated route for this tenant
        const dashboardRoute = tenantRoutes[tenant.id];

        // Animate progress over 4 seconds
        intervalRef.current = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }

                    // Only redirect if user didn't click back
                    if (shouldRedirectRef.current) {
                        router.visit(dashboardRoute, {
                            onError: (errors) => {
                                setLoadingTenant(null);
                                setLoadingProgress(0);
                                if (errors.access) {
                                    toast.error(errors.access, isDarkMode);
                                } else if (errors.permission) {
                                    toast.error(__('You do not have permission to access this hotel', { ns: 'static-text' }), isDarkMode);
                                } else {
                                    toast.error(__('Unable to access hotel dashboard', { ns: 'static-text' }), isDarkMode);
                                }
                            },
                            onSuccess: () => {
                                toast.success(__('Successfully accessed hotel dashboard', { ns: 'static-text' }), isDarkMode);
                            }
                        });
                    }
                    return 100;
                }
                return prev + 2.5; // 100% / 4 seconds = 2.5% per 100ms
            });
        }, 100);
    };

    const handleSkipLoading = () => {
        if (loadingTenant) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            shouldRedirectRef.current = true;

            // Get the pre-generated route for this tenant
            const dashboardRoute = tenantRoutes[loadingTenant.id];

            router.visit(dashboardRoute, {
                onError: (errors) => {
                    setLoadingTenant(null);
                    setLoadingProgress(0);
                    if (errors.access) {
                        toast.error(errors.access, isDarkMode);
                    } else if (errors.permission) {
                        toast.error(__('You do not have permission to access this hotel', { ns: 'static-text' }), isDarkMode);
                    } else {
                        toast.error(__('Unable to access hotel dashboard', { ns: 'static-text' }), isDarkMode);
                    }
                },
                onSuccess: () => {
                    toast.success(__('Successfully accessed hotel dashboard', { ns: 'static-text' }), isDarkMode);
                }
            });
        }
    };

    const handleBackFromLoading = () => {
        shouldRedirectRef.current = false;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setLoadingTenant(null);
        setLoadingProgress(0);
    };

    const handleBackToPublic = () => {
        try {
            window.history.back();
        } catch (error) {
            toast.error(__('Unable to go back', { ns: 'static-text' }), isDarkMode);
        }
    };

    // Função para formatar data de última entrada
    const formatLastEntry = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return `${diffInDays}d ago`;
    };

    // Função para obter ícone baseado no nome do hotel
    const getHotelIcon = (hotelName: string) => {
        const name = hotelName.toLowerCase();
        if (name.includes('palace') || name.includes('grand')) return "👑";
        if (name.includes('resort') || name.includes('ocean')) return "⭐";
        if (name.includes('lodge') || name.includes('mountain')) return "🏠";
        return "🏨";
    };

    // Cool animation overlay
    if (showCoolAnimation) {
        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'}`}>
                <div className="text-center">
                    {/* Animated Hotelorin logo with cool effects */}
                    <div className="mb-8 animate-bounce">
                        {isDarkMode ? (
                            <img src="/assets/images/default/hotelorin-logo-dark.svg" alt="Hotelorin Logo" className="h-32 w-auto" />
                        ) : (
                            <img src="/assets/images/default/hotelorin-logo-light.svg" alt="Hotelorin Logo" className="h-32 w-auto" />
                        )}
                    </div>

                    {/* Animated text */}
                    <h2 className={`text-3xl font-bold mb-4 animate-pulse ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {__('Preparing your experience...', { ns: 'static-text' })}
                    </h2>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-[#e2af04] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-[#e2af04] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-[#e2af04] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading overlay
    if (loadingTenant) {
        return (
            <PanelLoading
                tenant={loadingTenant}
                loadingProgress={loadingProgress}
                onBack={handleBackFromLoading}
                onSkip={handleSkipLoading}
            />
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f8fafc]'}`}>
            {/* Simple Navbar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-[#333]">
                {/* Left: Logo */}
                <div className="flex items-center">
                    {isDarkMode ? (
                        <img src="/assets/images/default/hotelorin-logo-dark.svg" alt="Hotelorin Logo" className="h-8" />
                    ) : (
                        <img src="/assets/images/default/hotelorin-logo-light.svg" alt="Hotelorin Logo" className="h-8" />
                    )}
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {auth.user.name}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                        {isDarkMode ? <Sun className="h-4 w-4 text-[#e2af04]" /> : <Moon className="h-4 w-4 text-[#e2af04]" />}
                    </Button>
                    <LanguageSwitcher />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 h-8"
                    >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">{__('Logout', { ns: 'static-text' })}</span>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                {/* Title Section */}
                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {__('Your Hotels', { ns: 'static-text' })}
                    </h1>
                    <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {__('Select a hotel to access its management dashboard', { ns: 'static-text' })}
                    </p>
                </div>

                {/* Hotels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                    {tenants.map((tenant) => (
                        <Card
                            key={tenant.id}
                            className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                    ? 'bg-white/5 hover:bg-white/10 border-transparent'
                                    : 'bg-white hover:shadow-md border-gray-200'
                            }`}
                            onClick={() => handleCardClick(tenant)}
                        >
                            <CardContent className="p-6">
                                <div className="text-center">
                                    {/* Hotel Icon */}
                                    <div className="text-4xl mb-4">
                                        {getHotelIcon(tenant.name)}
                                    </div>

                                    {/* Hotel Name */}
                                    <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {tenant.name}
                                    </h3>

                                    {/* Status Badge */}
                                    <Badge
                                        variant={tenant.status ? "default" : "secondary"}
                                        className={`mb-3 text-xs ${
                                            tenant.status
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-500 text-white"
                                        }`}
                                    >
                                        {tenant.status ? __('Active', { ns: 'static-text' }) : __('Inactive', { ns: 'static-text' })}
                                    </Badge>

                                    {/* Enter Button */}
                                    <Button
                                        className={`w-full font-medium transition-all duration-300 text-sm py-2 ${
                                            isEntering
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed scale-95'
                                                : 'bg-[#e2af04] text-[#23232b] hover:bg-[#c99c03] hover:scale-105'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEnterClick(tenant);
                                        }}
                                        disabled={isEntering}
                                    >
                                        {isEntering ? __('Entering...', { ns: 'static-text' }) : __('Enter', { ns: 'static-text' })}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Button
                        variant="ghost"
                        onClick={handleBackToPublic}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {__('Back', { ns: 'static-text' })}
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface PanelIndexProps {
    tenants?: Tenant[];
}

export default function PanelIndex({ tenants }: PanelIndexProps) {

    return (
        <PanelDefaultLayout>
            <Head title="Panel" />
            <PanelIndexContent tenants={tenants} />
        </PanelDefaultLayout>
    );
}
