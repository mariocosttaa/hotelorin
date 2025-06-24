import PanelDefaultLayout from './PanelDefaultLayout';
import PanelNavbar from './parts/PanelNavbar';
import PanelSidebar from './parts/PanelSidebar';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Tenant } from '@/js/shared/types/model/Tenants';

interface PanelLayoutProps {
    title: string;
    activePage: string;
    children: React.ReactNode;
    tenants?: Tenant[];
    breadcrumbs?: BreadcrumbItem[];
}

export default function PanelLayout({
    title,
    activePage,
    children,
    tenants = [],
    breadcrumbs = [],
}: PanelLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <PanelDefaultLayout>
            <Head title={title} />
            <div className="min-h-screen bg-background">
                <PanelSidebar
                    isOpen={sidebarOpen}
                    activePage={activePage}
                    tenants={tenants}
                    expandedItems={expandedItems}
                    toggleExpanded={toggleExpanded}
                />
                <div className={(sidebarOpen ? "md:pl-80" : "md:pl-4") + " transition-all duration-500"}>
                    <PanelNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="p-8">
                        {breadcrumbs.length > 0 && (
                            <div className="mb-6">
                                <Breadcrumbs title={title} items={breadcrumbs} />
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </div>
        </PanelDefaultLayout>
    );
}
