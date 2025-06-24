import PanelLayout from "../../layout/PanelLayout";
import { routeLang } from '@/js/shared/helpers/routeLang';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';

export default function PanelRoomShow() {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
        { label: "Rooms", href: tenantId ? routeLang('panel-room-index', { tenantId: tenantId }) : '#' },
        { label: "Room Details", active: true }
    ];

    const activePage = tenantId ? routeLang('panel-room-show', { tenantId: tenantId }) : '';

    return (
        <PanelLayout
            title="Room Details"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Rooms</h1>
                </div>
            </div>
        </PanelLayout>
    );
}
