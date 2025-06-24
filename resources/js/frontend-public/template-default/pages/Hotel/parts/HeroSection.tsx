import { useTranslation } from 'react-i18next';
import { MapPin, Star, Award, Clock } from "lucide-react";

export default function HeroSection() {
    const { t: __ } = useTranslation(['static-text']);

    return (
        <div className="relative h-[60vh] sm:h-[70vh] lg:h-screen">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
            <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                alt={__('Grand Palace Hotel')}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white max-w-4xl">
                    <div className="animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            {__('Grand Palace Hotel')}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 lg:mb-8 font-light">{__('hotel.subtitle')}</p>
                        <div className="flex items-center justify-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                            <MapPin className="h-4 w-4 lg:h-6 lg:w-6 text-blue-300" />
                            <span className="text-sm sm:text-base lg:text-xl">{__('hotel.location')}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-6 lg:mb-8">
                            {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="h-4 w-4 lg:h-6 lg:w-6 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 lg:ml-3 text-sm lg:text-lg">4.8 (1,247 reviews)</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
                            <div className="flex items-center space-x-2">
                                <Award className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400" />
                                <span>{__('hotel.awards.luxuryHotel')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-300" />
                                <span>{__('hotel.awards.concierge')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
