import PanelLayout from "../../layout/PanelLayout";
import { Tenant } from "@/js/shared/types/model/Tenants";
import { routeLang } from '@/js/shared/helpers/routeLang';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';

interface PanelDashboardProps {
    tenants?: Tenant[];
}

export default function PanelDashboard({ tenants = [] }: PanelDashboardProps) {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;

    const breadcrumbs = [
        { label: "Dashboard", active: true }
    ];

    // Ensure tenantId is available before generating the activePage
    const activePage = tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '';

    return (
        <PanelLayout
            title="Dashboard"
            activePage={activePage}
            tenants={tenants}
            breadcrumbs={breadcrumbs}
        >
            <div>
                {/* Dashboard content here - title is now in breadcrumbs */}
            </div>
        </PanelLayout>
    );
}
