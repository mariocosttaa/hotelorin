import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, SkipForward } from 'lucide-react';
import { useDarkMode } from '@/js/shared/context/DarkModeContext';
import { Tenant } from '@/js/shared/types/model/Tenants';

interface PanelLoadingProps {
    tenant: Tenant;
    loadingProgress: number;
    onBack: () => void;
    onSkip: () => void;
}

export default function PanelLoading({ tenant, loadingProgress, onBack, onSkip }: PanelLoadingProps) {
    const { t: __ } = useTranslation(['static-text']);
    const { isDarkMode } = useDarkMode();

    // Função para obter ícone baseado no nome do hotel
    const getHotelIcon = (hotelName: string) => {
        const name = hotelName.toLowerCase();
        if (name.includes('palace') || name.includes('grand')) return "👑";
        if (name.includes('resort') || name.includes('ocean')) return "⭐";
        if (name.includes('lodge') || name.includes('mountain')) return "🏠";
        return "🏨";
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-gray-100/80'} backdrop-blur-sm px-4`}>
            <div className="flex flex-col items-center w-full max-w-xs">

                {/* Hotelorin Logo */}
                <div className="mb-6">
                    {isDarkMode ? (
                        <img src="/assets/images/default/hotelorin-logo-dark.svg" alt="Hotelorin Logo" className="h-12 w-auto" />
                    ) : (
                        <img src="/assets/images/default/hotelorin-logo-light.svg" alt="Hotelorin Logo" className="h-12 w-auto" />
                    )}
                </div>

                {/* Hotel Icon with pulse animation */}
                <div className="text-6xl mb-3 animate-pulse">
                    {getHotelIcon(tenant.name)}
                </div>

                {/* Tenant Name */}
                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {tenant.name}
                </h2>

                {/* Loading text */}
                <p className={`text-base mt-1 mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {__('Accessing hotel dashboard...', { ns: 'static-text' })}
                </p>

                {/* Progress bar & percentage */}
                <div className="w-full space-y-2 mb-8">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#e2af04] transition-all duration-100 ease-out rounded-full"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {Math.round(loadingProgress)}%
                    </p>
                </div>


                {/* Buttons */}
                <div className="flex justify-center items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {__('Back', { ns: 'static-text' })}
                    </Button>

                    <Button
                        variant="default"
                        onClick={onSkip}
                        className="flex items-center gap-2 bg-[#e2af04] text-[#23232b] hover:bg-[#c99c03]"
                    >
                        <SkipForward className="h-4 w-4" />
                        {__('Skip', { ns: 'static-text' })}
                    </Button>
                </div>
            </div>
        </div>
    );
}
