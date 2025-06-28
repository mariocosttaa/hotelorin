export default interface Setting {
    // logos and Icons
    id: string;
    logo_light: string;
    logo_dark: string;
    favicon: string;

    // Contact and Social
    email: string;
    address: string;
    phone_code: string;
    phone: string;
    whatsapp_number_code: string;
    whatsapp_number: string;
    facebook: string;
    instagram: string;

    // customization
    template: string;
    theme_color: string;

    // language
    multi_language: boolean;
    default_language: string; // enum: ['pt', 'en', 'es', 'fr']

    // currency
    multi_currency: boolean;
    default_currency_code: string;

    // bookings
    online_booking: boolean;
    online_booking_payment: boolean;
    online_booking_require_payment: boolean;
    online_booking_auto_confirm: boolean;

    // checkIn and checkOut
    default_check_in: string;
    default_check_out: string;

    // Modules
    module_presence_activities: boolean;
}