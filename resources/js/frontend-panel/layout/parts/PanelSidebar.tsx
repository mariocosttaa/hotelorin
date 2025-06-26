/**
 * Fixed sidebar with better responsive behavior
 */

import { useDarkMode } from '@/js/shared/context/DarkModeContext';
import { routeLang } from '@/js/shared/helpers/routeLang';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { router, usePage } from '@inertiajs/react';
import { Bed, ChevronDown, Home, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { cn } from '../../lib/utils';
import type { SidebarItem } from '../../types';

interface SidebarProps {
    isOpen: boolean;
    isMobile?: boolean;
    onClose?: () => void;
    expandedItems?: Record<string, boolean>;
    toggleExpanded?: (title: string) => void;
    setSidebarOpen?: (open: boolean) => void;
    activePage: string;
}

export default function PanelSidebar({
    isOpen,
    isMobile = false,
    onClose,
    expandedItems = {},
    toggleExpanded = () => {},
    activePage,
}: SidebarProps) {
    const { auth, tenantId } = usePage<InertiaMiddlewareProps>().props;
    const { isDarkMode } = useDarkMode();
    const { t: __ } = useTranslation(['menu', 'static-text']);

    // Menu configuration directly in the component
    const menu_items: SidebarItem[] = tenantId ? [
        {
            key: routeLang('panel-dashboard', { tenantId: tenantId }),
            title: 'Dashboard',
            icon: <Home />,
            url: routeLang('panel-dashboard', { tenantId: tenantId }),
        },
        {
            key: 'rooms-dropdown', // Special key for rooms dropdown
            title: 'Rooms',
            icon: <Bed />,
            items: [
                {
                    title: 'Rooms',
                    url: routeLang('panel-room-index', { tenantId: tenantId }),
                    key: routeLang('panel-room-index', { tenantId: tenantId })
                },
                {
                    title: 'Room Types',
                    url: routeLang('panel-room-type-index', { tenantId: tenantId }),
                    key: routeLang('panel-room-type-index', { tenantId: tenantId })
                },
                {
                    title: 'Create Room',
                    url: routeLang('panel-room-create', { tenantId: tenantId }),
                    key: routeLang('panel-room-create', { tenantId: tenantId })
                },
                {
                    title: 'Create Room Type',
                    url: routeLang('panel-room-type-create', { tenantId: tenantId }),
                    key: routeLang('panel-room-type-create', { tenantId: tenantId })
                },
            ],
        },
    ] : [
        // Menu for PanelIndex page (tenant selection page)
        {
            key: 'panel-index',
            title: 'Hotel Selection',
            icon: <Home />,
            url: routeLang('panel-index'),
        },
    ];

    const sidebarClasses = cn(
        'fixed bottom-4 left-4 top-4 z-50 w-72 transform transition-all duration-500 ease-out',
        isMobile ? 'md:hidden' : 'hidden md:block',
        isOpen ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none -translate-x-full opacity-0',
    );

    const handleNavigation = (url: string) => {
        router.visit(url);
    };

    // Check if a sidebar item or its sub-items are active
    const isItemActive = (item: SidebarItem): boolean => {
        if (item.key === 'rooms-dropdown') {
            return item.items?.some(subItem => subItem.key === activePage) ||
                   activePage.includes('panel-room-edit') ||
                   activePage.includes('panel-room-show');
        }
        return item.key === activePage;
    };

    // Check if a sub-item is active
    const isSubItemActive = (subItem: { key: string; url: string }): boolean => {
        return subItem.key === activePage;
    };

    // Check if dropdown should be expanded
    const shouldExpandDropdown = (item: SidebarItem): boolean => {
        if (item.key === 'rooms-dropdown') {
            return expandedItems[item.title] ||
                   item.items?.some(subItem => subItem.key === activePage) ||
                   activePage.includes('panel-room-edit') ||
                   activePage.includes('panel-room-show');
        }
        return expandedItems[item.title];
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isMobile && isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />}

            <div className={sidebarClasses}>
                <div className="h-full overflow-hidden rounded-3xl border border-border/50 bg-background/80 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30">
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border/30 p-3" style={{ minHeight: '10px' }}>
                            <div className="flex w-full min-w-0 items-center justify-center gap-3">
                                {isDarkMode ? (
                                    <img src="/assets/images/default/hotelorin-logo-dark.svg" alt="Hotelon Logo" className="object-contain" />
                                ) : (
                                    <img src="/assets/images/default/hotelorin-logo-light.svg" alt="Hotelon Logo" className="object-contain" />
                                )}
                            </div>
                        </div>
                        <br />
                        {/* Navigation */}
                        <ScrollArea className="flex-1 px-4">
                            <div className="space-y-2 pb-4">
                                {menu_items.map((item) => (
                                    <SidebarItemComponent
                                        key={item.key}
                                        item={{
                                            ...item,
                                            isActive: isItemActive(item),
                                        }}
                                        isExpanded={shouldExpandDropdown(item)}
                                        onToggle={() => toggleExpanded(item.title)}
                                        onNavigate={handleNavigation}
                                        activePage={activePage}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                        {/* Footer */}
                        <div className="border-t border-border/30 p-4">
                            <div className="space-y-2">
                                <button className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50">
                                    <Settings className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-90" />
                                    <span className="truncate">{__('Settings', { ns: 'menu' })}</span>
                                </button>
                                <button className="flex w-full min-w-0 items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <Avatar className="h-7 w-7 flex-shrink-0 ring-2 ring-[#e2af04]/20">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                            <AvatarFallback className="bg-[#e2af04] text-xs text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="truncate">{auth.user.name}</span>
                                    </div>
                                    <Badge variant="outline" className="flex-shrink-0 border-0 bg-[#e2af04] text-white shadow-sm">
                                        Enterprise
                                    </Badge>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface SidebarItemComponentProps {
    item: SidebarItem & { isActive: boolean };
    isExpanded: boolean;
    onToggle: () => void;
    onNavigate: (url: string) => void;
    activePage: string;
}

function SidebarItemComponent({ item, isExpanded, onToggle, onNavigate, activePage }: SidebarItemComponentProps) {
    const handleClick = () => {
        if (item.items) {
            onToggle();
        } else if (item.url) {
            onNavigate(item.url);
        }
    };

    // Check if a sub-item is active
    const isSubItemActive = (subItem: { key: string; url: string }): boolean => {
        return subItem.key === activePage;
    };

    return (
        <div className="mb-1">
            <button
                className={cn(
                    'group flex w-full min-w-0 items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    item.isActive ? 'bg-[#e2af04]/10 text-[#e2af04] shadow-sm' : 'hover:translate-x-1 hover:bg-muted/50',
                )}
                onClick={handleClick}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className={cn(
                            'flex-shrink-0 transition-colors duration-200',
                            item.isActive ? 'text-[#e2af04]' : 'text-muted-foreground group-hover:text-foreground',
                        )}
                    >
                        {item.icon}
                    </div>
                    <span className="truncate">{item.title}</span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                    {item.items && (
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 transition-transform duration-300',
                                isExpanded ? 'rotate-180' : '',
                                'text-muted-foreground group-hover:text-foreground',
                            )}
                        />
                    )}
                </div>
            </button>

            {item.items && isExpanded && (
                <div className="ml-8 mt-2 space-y-1 border-l-2 border-border/30 pl-4">
                    {item.items.map((subItem) => (
                        <button
                            key={subItem.key}
                            onClick={() => onNavigate(subItem.url)}
                            className={cn(
                                'group flex w-full min-w-0 items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors',
                                isSubItemActive(subItem)
                                    ? 'bg-[#e2af04]/10 text-[#e2af04]'
                                    : 'text-muted-foreground hover:bg-muted/30 group-hover:text-foreground',
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="truncate">{subItem.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
