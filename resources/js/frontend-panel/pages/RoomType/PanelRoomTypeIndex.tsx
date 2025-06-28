import React, { useState, memo } from "react";
import PanelLayout from "../../layout/PanelLayout";
import { routeLang, routeLangStatic } from '@/js/shared/helpers/routeLang';
import { usePage, router } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { Link } from '@inertiajs/react';
import { cn } from '@/js/frontend-panel/lib/utils';
import { Plus, Edit, Trash2, Tv, Eye, DollarSign } from "lucide-react";
import RoomType from "@/js/shared/types/model/tenant/roomType";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/js/frontend-panel/components/ui/card";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/js/frontend-panel/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/js/frontend-panel/components/ui/alert-dialog";
import { useToast } from '@/js/shared/hooks/useToast';
import { useTheme } from "../../hooks/use-theme";
import RoomTypeShowModal from '@/js/frontend-panel/components/modals/roomType/RoomTypeShowModal';
import { useTranslation } from 'react-i18next';

interface PanelRoomTypeIndexProps {
    roomTypes: Array<RoomType>;
}

// Helper to strip class, width, and height from SVG string
function stripSvgSize(svg: string) {
    return svg
        .replace(/class="[^"]*"/g, '')
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '');
}

const RoomTypeCard = memo(function RoomTypeCard({ roomType, onShow, tenantId, onDelete }: { roomType: RoomType, onShow: (roomType: RoomType) => void, tenantId?: string, onDelete?: (roomTypeId: string) => void }) {
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onShow(roomType)}>
            <CardHeader className="p-0">
                <div className="relative">
                    {roomType.galleries && roomType.galleries.length > 0 ? (
                        <img
                            src={roomType.galleries[0].src}
                            alt={roomType.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                    ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                            <Tv className="h-12 w-12 text-muted-foreground opacity-30" />
                        </div>
                    )}
                    {/* Gallery count badge */}
                    {roomType.galleries && roomType.galleries.length > 1 && (
                        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-0.5">
                            +{roomType.galleries.length - 1} more
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className="mb-3">
                    <CardTitle className="text-lg mb-1 line-clamp-1">{roomType.name}</CardTitle>
                    {roomType.description && (
                        <CardDescription className="text-sm text-muted-foreground overflow-hidden">
                            {roomType.description.length > 100 ? `${roomType.description.substring(0, 100)}...` : roomType.description}
                        </CardDescription>
                    )}
                </div>

                {/* Prices Section */}
                {roomType.prices && roomType.prices.length > 0 && (
                    <div className="mb-3">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <DollarSign className="w-3 h-3" />
                            Prices
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {roomType.prices.map((price) => (
                                <Badge key={price.currency_code} variant="secondary" className="text-xs">
                                    <span className={price.status ? "" : "line-through opacity-70"}>
                                        {price.price_formatted}
                                    </span>
                                    {!price.status && (
                                        <span className="ml-1 text-xs">(I)</span>
                                    )}
                                    {price.price_ilustrative_formatted && (
                                        <span className="text-muted-foreground ml-1 line-through">
                                            {price.price_ilustrative_formatted}
                                        </span>
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Amenities */}
                {roomType.comodites && roomType.comodites.length > 0 ? (
                    <div className="mb-3">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Amenities
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {roomType.comodites.slice(0, 4).map((roomComodite) => {
                                const comodite = roomComodite.comodite;
                                if (!comodite) return null;
                                return (
                                    <Tooltip key={roomComodite.id}>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1 bg-muted/60 rounded px-2 py-0.5 text-xs">
                                                {comodite.icon ? (
                                                    <span className="h-2.5 w-2.5 mr-1 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: stripSvgSize(comodite.icon) }} />
                                                ) : (
                                                    <span className="h-2.5 w-2.5 mr-1 bg-primary rounded-full"></span>
                                                )}
                                                {comodite.name}
                                                {roomComodite.use_type_comodites_in_room && (
                                                    <span className="text-blue-500 text-xs">(H)</span>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        {comodite.description && (
                                            <TooltipContent>
                                                {comodite.description}
                                                {roomComodite.use_type_comodites_in_room && (
                                                    <div className="mt-1 text-blue-500 text-xs">Can be inherited by rooms</div>
                                                )}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                );
                            })}
                            {roomType.comodites.length > 4 && (
                                <div className="flex items-center gap-1 bg-muted/60 rounded px-2 py-0.5 text-xs">
                                    +{roomType.comodites.length - 4} more
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground mb-3">No amenities</div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); onShow(roomType); }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                    >
                        {tenantId ? (
                            <Link href={routeLang('panel-room-type-edit', { tenantId, roomTypeIdHashed: roomType.id })}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span>
                                <Edit className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Room Type</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{roomType.name}"? This action cannot be undone and will also delete all associated amenities and gallery images.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete && onDelete(roomType.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardFooter>
        </Card>
    );
});

export default function PanelRoomTypeIndex({ roomTypes }: PanelRoomTypeIndexProps) {
    const { tenantId, locale } = usePage<InertiaMiddlewareProps>().props;
    const { i18n } = useTranslation();
    const currentLang = locale || i18n.language || 'en';
    const [showModal, setShowModal] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
    const [deletingRoomType, setDeletingRoomType] = useState<string | null>(null);
    const toast = useToast();
    const isDarkMode = useTheme();

    const handleDeleteRoomType = async (roomTypeId: string) => {
        setDeletingRoomType(roomTypeId);

        const deleteUrl = routeLangStatic('panel-room-type-destroy', {
            tenantId,
            roomTypeIdHashed: roomTypeId
        });

        router.delete(deleteUrl, {
            onSuccess: () => {
                setDeletingRoomType(null);
                setShowModal(false);
                setSelectedRoomType(null);
                toast.success('Room type deleted successfully', isDarkMode.theme === 'dark');
            },
            onError: (errors) => {
                setDeletingRoomType(null);
                if (errors.error) {
                    toast.error(errors.error, isDarkMode.theme === 'dark');
                } else {
                    toast.error('Failed to delete room type', isDarkMode.theme === 'dark');
                }
            }
        });
    };

    const handleViewDetails = (roomType: RoomType) => {
        setSelectedRoomType(roomType);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRoomType(null);
    };

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
        { label: "Room Types", href: tenantId ? routeLang('panel-room-type-index', { tenantId: tenantId }) : '#' },
        { label: "Room Types", active: true }
    ];

    const activePage = tenantId ? routeLang('panel-room-type-index', { tenantId: tenantId }) : '';

    return (
        <PanelLayout
            title="Room Types"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight"></h1>
                        <p className="text-muted-foreground">Manage your room types and their configurations</p>
                    </div>
                    <Link
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                        href={routeLang('panel-room-type-create', { tenantId })}
                    >
                        <Plus className="w-4 h-4" /> Create Room Type
                    </Link>
                </div>

                <div className="w-full border-b mb-4">
                    <div className="flex gap-2">
                        <Link
                            href={routeLang('panel-room-index', { tenantId })}
                            className={cn(
                                'px-4 py-2 border-b-2 font-medium transition-colors',
                                'focus:outline-none',
                                'text-muted-foreground border-transparent',
                                'bg-background',
                                'rounded-t',
                                'cursor-pointer',
                                'hover:text-primary hover:border-primary',
                                'mr-2',
                                'shadow-none',
                            )}
                        >
                            Rooms
                        </Link>
                        <Link
                            href={routeLang('panel-room-type-index', { tenantId })}
                            className={cn(
                                'px-4 py-2 border-b-2 font-medium transition-colors',
                                'focus:outline-none',
                                'text-primary border-primary',
                                'bg-background',
                                'rounded-t',
                                'cursor-pointer',
                                'mr-2',
                                'border-b-2',
                                'border-primary',
                                'text-primary',
                                'shadow-none',
                                'active',
                            )}
                            aria-current="page"
                        >
                            Room Types
                        </Link>
                    </div>
                </div>

                {roomTypes.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Tv className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No room types yet</h3>
                                <p className="text-muted-foreground">Create your first room type to get started</p>
                            </div>
                            <Link
                                href={routeLang('panel-room-type-create', { tenantId })}
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                            >
                                <Plus className="w-4 h-4" /> Create First Room Type
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <TooltipProvider>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roomTypes.map((roomType) => (
                                <div key={roomType.id} className="space-y-3">
                                    <RoomTypeCard
                                        roomType={roomType}
                                        onShow={handleViewDetails}
                                        tenantId={tenantId}
                                        onDelete={handleDeleteRoomType}
                                    />
                                </div>
                            ))}
                        </div>
                    </TooltipProvider>
                )}
            </div>

            {selectedRoomType && (
                <RoomTypeShowModal
                    open={showModal}
                    onClose={handleCloseModal}
                    roomType={selectedRoomType}
                    tenantId={tenantId}
                    onDelete={handleDeleteRoomType}
                    isDeleting={deletingRoomType === selectedRoomType?.id}
                />
            )}
        </PanelLayout>
    );
}
