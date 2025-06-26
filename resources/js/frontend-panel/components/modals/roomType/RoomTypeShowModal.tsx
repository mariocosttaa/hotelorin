import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/js/frontend-panel/components/ui/dialog';
import { Badge } from '@/js/frontend-panel/components/ui/badge';
import { Button } from '@/js/frontend-panel/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/js/frontend-panel/components/ui/alert-dialog';
import { Edit, Trash2, ChevronLeft, ChevronRight, Tv } from 'lucide-react';
import RoomType from '@/js/shared/types/model/tenant/roomType';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { useTranslation } from 'react-i18next';

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

    // Precompute route URLs
    const editUrl = roomType && tenantId
        ? route('panel-room-type-edit', { tenantId, roomTypeIdHashed: roomType.id })
        : undefined;

    // Precompute delete handler
    const handleDelete = React.useCallback(() => {
        if (onDelete && roomType) onDelete(roomType.id);
    }, [onDelete, roomType]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background text-foreground p-0">
                {roomType ? (
                    <>
                        <DialogHeader className="p-6 pb-4 border-b border-border">
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                {getLocalized(roomType, 'name')}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1">
                                {getLocalized(roomType, 'description')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)] overflow-hidden">
                            {/* Image Gallery Section */}
                            <div className="lg:w-1/2 w-full">
                                <div className="relative h-64 lg:h-full bg-muted">
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
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                                        onClick={() => setMainImageIdx((mainImageIdx - 1 + galleries.length) % galleries.length)}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                                        onClick={() => setMainImageIdx((mainImageIdx + 1) % galleries.length)}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
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
                            <div className="lg:w-1/2 w-full p-6 overflow-y-auto">
                                <div className="space-y-6">
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

                        {/* Actions Footer */}
                        <div className="flex justify-end gap-2 p-4 border-t border-border bg-background">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            {tenantId && editUrl && (
                                <Button variant="default" asChild>
                                    <Link href={editUrl}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Room Type
                                    </Link>
                                </Button>
                            )}
                            {onDelete && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {isDeleting ? 'Deleting...' : 'Delete Room Type'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Room Type</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{getLocalized(roomType, 'name')}"? This action cannot be undone and will also delete all associated amenities and gallery images.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-muted-foreground">No room type selected.</div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RoomTypeShowModal;
