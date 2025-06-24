import { useTranslation } from 'react-i18next';
import { FormEventHandler, useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useDarkMode } from '@/js/shared/context/DarkModeContext';
import PanelDefaultLayout from '../../layout/PanelDefaultLayout';
import LanguageSelect from './parts/LanguageSelect';
import { useForm } from '@inertiajs/react';
import { routeLang } from '@/js/shared/helpers/routeLang';
import { useToast } from '@/js/shared/hooks/useToast';


type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};


function PanelLoginContent() {
    const { t: __ } = useTranslation(['static-text']);
    const { isDarkMode, toggleTheme } = useDarkMode();
    const toast = useToast();
    const [animateFeatures, setAnimateFeatures] = useState(false);
    const [pulseIndex, setPulseIndex] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    // Trigger initial animations after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateFeatures(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Continuous pulse animation for features
    useEffect(() => {
        const interval = setInterval(() => {
            setPulseIndex((prev) => (prev + 1) % 4);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    let loginPost = routeLang('auth-lang-login');

    const handleLogin: FormEventHandler = (e) => {
        e.preventDefault();
        post(loginPost, {
            onFinish: () => {
                reset('password');
            },
            onError: (errors) => {
                // Mostrar erros via toast
                if (errors.email) {
                    toast.error(errors.email);
                }
                if (errors.password) {
                    toast.error(errors.password);
                }
                if (errors.throttle) {
                    toast.error(__('Too many login attempts. Please try again later.', { ns: 'static-text' }));
                }
                if (errors.credentials) {
                    toast.error(__('Invalid email or password.', { ns: 'static-text' }));
                }
                // Erro genérico se não houver erro específico
                if (Object.keys(errors).length === 0) {
                    toast.error(__('An error occurred during login. Please try again.', { ns: 'static-text' }));
                }
            },
            onSuccess: () => {
                toast.success(__('Login successful! Redirecting...', { ns: 'static-text' }));
            }
        });
    };

    // Função para determinar a classe do input baseada no erro
    const getInputClassName = (fieldName: keyof LoginForm) => {
        const hasError = errors[fieldName];
        const baseClasses = `rounded-lg px-4 py-3 border transition-colors duration-200`;

        if (hasError) {
            return `${baseClasses} ${isDarkMode
                ? 'bg-[#18181b] border-red-500 text-white placeholder-red-400 focus:border-red-400 focus:ring-red-400'
                : 'bg-white border-red-500 text-gray-900 placeholder-red-400 focus:border-red-400 focus:ring-red-400'
            }`;
        }

        return `${baseClasses} ${isDarkMode
            ? 'bg-[#18181b] border-[#333] text-white placeholder-gray-500 focus:border-[#e2af04] focus:ring-[#e2af04]'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#e2af04] focus:ring-[#e2af04]'
        }`;
    };

    // Features data with animation delays
    const features = [
        {
            id: 1,
            title: __('Complete reservation management', { ns: 'static-text' }),
            description: __('Control reservations, check-ins, check-outs, and availability in real time.', { ns: 'static-text' }),
            delay: 0
        },
        {
            id: 2,
            title: __('Task automation', { ns: 'static-text' }),
            description: __('Send confirmations, reminders, and reports automatically to guests and staff.', { ns: 'static-text' }),
            delay: 200
        },
        {
            id: 3,
            title: __('Team and service management', { ns: 'static-text' }),
            description: __('Assign tasks, control services, and keep your team organized.', { ns: 'static-text' }),
            delay: 400
        },
        {
            id: 4,
            title: __('Easy and secure access', { ns: 'static-text' }),
            description: __('Manage everything online, securely and accessible from anywhere.', { ns: 'static-text' }),
            delay: 600
        }
    ];

    //login

    return (
        <div className={`min-h-screen flex flex-col md:flex-row items-stretch justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f8fafc]'}`}>
            {/* Left: Login Form */}
            <div className={`flex flex-col justify-center items-center px-8 py-12 md:w-1/2 w-full transition-colors duration-300 ${isDarkMode ? 'bg-[#23232b]' : 'bg-white'} ${!isDarkMode ? 'shadow-xl' : ''}`} style={!isDarkMode ? { zIndex: 1 } : {}}>
                {/* Top left: Back icon */}
                <div className="absolute top-6 left-8 z-10">
                    <button aria-label={__('Back', { ns: 'static-text' })} onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#23232b] transition-colors">
                        <ArrowLeft className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                </div>
                {/* Top right: Language & Dark mode */}
                <div className="absolute top-6 right-8 flex gap-2 z-10">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDarkMode ? <Sun className="h-5 w-5 text-[#e2af04]" /> : <Moon className="h-5 w-5 text-[#e2af04]" />}
                    </Button>
                    <LanguageSelect className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </div>
                {/* Branding */}
                <div className="flex flex-col items-center w-full max-w-sm mt-12 md:mt-0">
                    {isDarkMode ? (
                        <img src="/assets/images/default/hotelorin-logo-dark.svg" alt="Hotelorin Logo" className="h-12 mb-2 object-contain" />
                    ) : (
                        <img src="/assets/images/default/hotelorin-logo-light.svg" alt="Hotelorin Logo" className="h-12 mb-2 object-contain" />
                    )}
                    <h2 className={`text-xl font-semibold mb-1 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{__('Sign In', { ns: 'static-text' })}</h2>
                    <p className={`text-sm mb-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{__('Not Have Account', { ns: 'static-text' })} <span className="font-bold text-[#e2af04] cursor-pointer">{__('Contact us', { ns: 'static-text' })}</span></p>
                    {/* Google login (disabled) */}
                    <button disabled className={
                        `w-full flex items-center justify-center gap-2 rounded-lg py-3 mb-4 cursor-not-allowed transition-colors border ${isDarkMode ? 'bg-[#23232b] border-[#333] text-white' : 'bg-white border-[#e5e7eb] text-gray-900'}`
                    }>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M14.15 10.75c0-.35-.03-.69-.09-1H10v1.9h2.35a1.99 1.99 0 01-.86 1.31v1.09h1.38c.81-.75 1.28-1.87 1.28-3.3z" fill="#4285F4"/><path d="M10 15c1.14 0 2.1-.37 2.8-1l-1.38-1.09c-.38.26-.88.41-1.42.41-1.1 0-2.03-.75-2.36-1.76H6.2v1.1A5 5 0 0010 15z" fill="#34A853"/><path d="M7.64 10.77a2.98 2.98 0 010-1.54v-1.1H6.2A5 5 0 005 10c0 .8.2 1.56.44 2.19l1.2-1.42z" fill="#FBBC05"/><path d="M10 7.92c.63 0 1.2.22 1.65.65l1.24-1.24C11.6 6.37 10.64 6 10 6a5 5 0 00-4.36 2.46l1.2 1.1c.33-1.01 1.26-1.76 2.36-1.76z" fill="#EA4335"/></g></svg>
                        <span className="font-medium">{__('Sign In with', { ns: 'static-text' })} Google</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-[#18181b] text-white font-bold' : 'bg-gray-200 text-gray-700 font-bold'}`}>{__('Unavailable', { ns: 'static-text' })}</span>
                    </button>
                    <div className="w-full flex items-center gap-2 mb-4">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="text-xs text-gray-400">{__('or', { ns: 'static-text' })}</span>
                        <div className="flex-1 h-px bg-gray-700" />
                    </div>
                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{__('Email', { ns: 'static-text' })}</label>
                            <Input
                                id="email"
                                type="email"
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@address.com"
                                className={getInputClassName('email')}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{__('Password', { ns: 'static-text' })}</label>
                            <a href="#" className="text-xs text-gray-400 hover:underline">{__('Forgot Password', { ns: 'static-text' })}</a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Sua Senha de Login"
                            className={getInputClassName('password')}
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                id="keep-signed-in"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="form-checkbox rounded text-[#e2af04] focus:ring-[#e2af04] border-gray-600 bg-[#23232b]"
                            />
                            <label htmlFor="keep-signed-in" className="text-xs text-gray-400">{__('Remember this Device', { ns: 'static-text' })}</label>
                        </div>
                        <Button type="submit" className="w-full rounded-lg bg-[#e2af04] text-[#23232b] font-bold hover:bg-[#c99c03] transition-colors shadow-md py-3 text-base mt-2">
                            {__('Sign In', { ns: 'static-text' })}
                        </Button>
                    </form>
                </div>
            </div>
            {/* Right: System Message and Features */}
            <div className={`flex flex-1 items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#26272b] text-white' : 'bg-[#f1f5f9] text-[#23232b] border-l border-[#e5e7eb]'} px-8 py-12 md:w-1/2 w-full`}>
                <div className="max-w-lg w-full">
                    <h2 className={`text-2xl font-bold mb-4 text-[#e2af04] animate-pulse transition-all duration-700 ${animateFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {__('Manage your hotel easily and efficiently!', { ns: 'static-text' })}
                    </h2>
                    <p className={`mb-8 transition-all duration-700 delay-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} ${animateFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {__('Our system allows you to manage reservations, rooms, guests, and hotel services quickly, with control and automation. Simplify management and focus on what matters: your guests experience.', { ns: 'static-text' })}
                    </p>
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li
                                key={feature.id}
                                className={`flex items-start gap-3 transition-all duration-700 ease-out hover:scale-105 ${
                                    animateFeatures
                                        ? 'opacity-100 translate-x-0'
                                        : 'opacity-0 translate-x-8'
                                }`}
                                style={{
                                    transitionDelay: `${feature.delay}ms`,
                                    transform: animateFeatures ? 'translateX(0)' : 'translateX(2rem)'
                                }}
                            >
                                <span
                                    className={`mt-1 text-[#e2af04] transition-all duration-500 ${
                                        animateFeatures ? 'scale-100' : 'scale-0'
                                    } ${
                                        pulseIndex === index ? 'animate-pulse scale-110' : ''
                                    }`}
                                    style={{
                                        transitionDelay: `${feature.delay + 200}ms`,
                                        animationDuration: '2s',
                                        animationIterationCount: 'infinite'
                                    }}
                                >
                                    ✔
                                </span>
                                <div className={`transition-all duration-500 ${animateFeatures ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${feature.delay + 300}ms` }}>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
                                        pulseIndex === index ? 'animate-pulse' : ''
                                    }`}>
                                        {feature.title}
                                    </span>
                                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm ${
                                        pulseIndex === index ? 'animate-pulse' : ''
                                    }`}>
                                        {feature.description}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Floating elements for continuous animation */}
                    <div className="absolute top-20 right-20 w-4 h-4 bg-[#e2af04] rounded-full animate-bounce opacity-20" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className="absolute bottom-40 right-40 w-3 h-3 bg-[#e2af04] rounded-full animate-bounce opacity-30" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                    <div className="absolute top-40 left-20 w-2 h-2 bg-[#e2af04] rounded-full animate-bounce opacity-25" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>

                    {/* Continuous wave animation */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-1 h-8 bg-[#e2af04] rounded-full animate-pulse opacity-60"
                                    style={{
                                        animationDelay: `${i * 0.2}s`,
                                        animationDuration: '1.5s',
                                        animationIterationCount: 'infinite'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PanelLogin() {
    return (
        <PanelDefaultLayout>
            <PanelLoginContent />
        </PanelDefaultLayout>
    );
}
