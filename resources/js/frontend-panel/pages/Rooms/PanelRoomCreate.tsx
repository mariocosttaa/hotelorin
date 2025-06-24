import PanelLayout from "../../layout/PanelLayout";
import { routeLang } from '@/js/shared/helpers/routeLang';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';

export default function PanelRoomCreate() {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
        { label: "Rooms", href: tenantId ? routeLang('panel-room-index', { tenantId: tenantId }) : '#' },
        { label: "Create Room", active: true }
    ];

    // Ensure tenantId is available before generating the activePage
    const activePage = tenantId ? routeLang('panel-room-create', { tenantId: tenantId }) : '';

    return (
        <PanelLayout
            title="Create Room"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="flex flex-col gap-4">
                {/* Create room form content */}
            </div>
        </PanelLayout>
    );
}
