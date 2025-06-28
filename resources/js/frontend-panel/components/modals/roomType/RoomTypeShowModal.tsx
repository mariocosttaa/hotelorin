import * as React from 'react';
import { Badge } from '@/js/frontend-panel/components/ui/badge';
import { ChevronLeft, ChevronRight, Tv, DollarSign } from 'lucide-react';
import RoomType from '@/js/shared/types/model/tenant/roomType';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { useTranslation } from 'react-i18next';
import BaseDetailsModal from '@/js/frontend-panel/components/ui/BaseDetailsModal';
import { routeLang } from '@/js/shared/helpers/routeLang';

// Helper to strip class, width, and height from SVG string
function stripSvgSize(svg: string) {
    return svg
        .replace(/class="[^"]*"/g, '')
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '');
}

interface RoomTypeShowModalProps {
    open: boolean;
    onClose: () => void;
    roomType: RoomType | null;
    tenantId?: string;
    onDelete?: (roomTypeId: string) => void;
    isDeleting?: boolean;
}

const RoomTypeShowModal: React.FC<RoomTypeShowModalProps> = ({
    open,
    onClose,
    roomType,
    tenantId,
    onDelete,
    isDeleting = false
}) => {
    // All hooks must be called before any conditional rendering
    const { locale } = usePage<InertiaMiddlewareProps>().props;
    const { i18n } = useTranslation();
    const currentLang = locale || i18n.language || 'en';
    const [mainImageIdx, setMainImageIdx] = React.useState(0);

    React.useEffect(() => {
        setMainImageIdx(0);
    }, [roomType]);

    const galleries = roomType?.galleries || [];

    // Helper to get localized field
    const getLocalized = (roomType: any, field: string) => (
        roomType?.[`${field}_${currentLang}`] ||
        roomType?.[field] ||
        roomType?.[`${field}_en`] ||
        ''
    );

    const handleDelete = React.useCallback(() => {
        if (onDelete && roomType) {
            onDelete(roomType.id);
            // The modal will be closed by the BaseDetailsModal after delete
        }
    }, [onDelete, roomType]);

    if (!roomType) {
        return (
            <BaseDetailsModal
                open={open}
                onOpenChange={onClose}
                title="No Room Type Selected"
                closeable={true}
            >
                <div className="p-8 text-center text-muted-foreground">
                    No room type selected.
                </div>
            </BaseDetailsModal>
        );
    }

    return (
        <BaseDetailsModal
            open={open}
            onOpenChange={onClose}
            title={getLocalized(roomType, 'name')}
            description={getLocalized(roomType, 'description')}
            footerActions={{
                edit: {
                    href: routeLang('panel-room-type-edit', { tenantId, roomTypeIdHashed: roomType.id }),
                    label: 'Edit Room Type'
                },
                delete: onDelete ? {
                    onDelete: handleDelete,
                    isDeleting,
                    label: 'Delete Room Type',
                    confirmTitle: 'Delete Room Type',
                    confirmDescription: `Are you sure you want to delete "${getLocalized(roomType, 'name')}"? This action cannot be undone and will also delete all associated amenities and gallery images.`
                } : undefined
            }}
        >
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Image Gallery Section */}
                <div className="lg:w-1/2 w-full">
                    <div className="relative h-64 lg:h-80 bg-muted rounded-lg overflow-hidden">
                        {galleries.length > 0 ? (
                            <>
                                <img
                                    src={galleries[mainImageIdx]?.src}
                                    alt={`${roomType.name} - Image ${mainImageIdx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gallery Navigation */}
                                {galleries.length > 1 && (
                                    <>
                                        <button
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background/90 transition-colors"
                                            onClick={() => setMainImageIdx((mainImageIdx - 1 + galleries.length) % galleries.length)}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background/90 transition-colors"
                                            onClick={() => setMainImageIdx((mainImageIdx + 1) % galleries.length)}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                            {galleries.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full transition-colors ${idx === mainImageIdx ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground'}`}
                                                    onClick={() => setMainImageIdx(idx)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Tv className="h-16 w-16 opacity-30" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 w-full">
                    <div className="space-y-6">
                        {/* Prices Section */}
                        {roomType.prices && roomType.prices.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Prices ({roomType.prices.length} total)
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {roomType.prices.map((price) => (
                                        <div key={price.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <Badge variant="outline" className="text-sm">
                                                        {price.currency_code.toUpperCase()}
                                                    </Badge>
                                                    {!price.status && (
                                                        <Badge variant="secondary" className="text-xs ml-1">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={price.status ? "font-medium text-lg" : "font-medium text-lg line-through opacity-70"}>
                                                        {price.price_formatted}
                                                    </div>
                                                    {price.price_ilustrative_formatted && (
                                                        <div className="text-sm text-muted-foreground line-through">
                                                            {price.price_ilustrative_formatted}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {price.currency && (
                                                <div className="text-xs text-muted-foreground">
                                                    {price.currency.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities Section */}
                        {roomType.comodites && roomType.comodites.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Amenities ({roomType.comodites.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {roomType.comodites.map((roomComodite) => {
                                        const comodite = roomComodite.comodite;
                                        if (!comodite) return null;
                                        return (
                                            <div key={roomComodite.id} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {comodite.icon ? (
                                                        <span className="h-5 w-5 text-primary" dangerouslySetInnerHTML={{ __html: stripSvgSize(comodite.icon) }} />
                                                    ) : null}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm mb-1">{comodite.name}</div>
                                                    {comodite.description && (
                                                        <div className="text-xs text-muted-foreground leading-relaxed">
                                                            {comodite.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Gallery Info */}
                        {galleries.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Gallery ({galleries.length} images)
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Click on thumbnails below to view different images of this room type.
                                </p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {galleries.map((gallery, idx) => (
                                        <img
                                            key={gallery.id}
                                            src={gallery.src}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className={`w-16 h-16 rounded border object-cover cursor-pointer transition-opacity ${mainImageIdx === idx ? 'ring-2 ring-primary opacity-100' : 'opacity-60 hover:opacity-80'}`}
                                            onClick={() => setMainImageIdx(idx)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Amenities Message */}
                        {(!roomType.comodites || roomType.comodites.length === 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                                <div className="text-sm">No amenities configured for this room type.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseDetailsModal>
    );
};

export default RoomTypeShowModal;
