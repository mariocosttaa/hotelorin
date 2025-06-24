import { useEffect } from "react";
import PanelLayout from "../../layout/PanelLayout";
import { routeLang } from '@/js/shared/helpers/routeLang';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';

export default function PanelRoomIndex() {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
        { label: "Rooms", active: true }
    ];

    // Ensure tenantId is available before generating the activePage
    const activePage = tenantId ? routeLang('panel-room-index', { tenantId: tenantId }) : '';

    return (
        <PanelLayout
            title="Rooms"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {/* Page content here - title is now in breadcrumbs */}
                </div>
            </div>
        </PanelLayout>
    );
}
