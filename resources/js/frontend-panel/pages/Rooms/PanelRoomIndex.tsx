import { useEffect, useState } from "react";
import PanelLayout from "../../layout/PanelLayout";
import { routeLang, routeLangStatic } from '@/js/shared/helpers/routeLang';
import { usePage, router, Link } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/js/frontend-panel/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/js/frontend-panel/components/ui/avatar";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/js/frontend-panel/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/js/frontend-panel/components/ui/pagination";
import { Plus, Users, Baby, Dog, DollarSign, Euro, CircleDollarSign, Coins, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from '@/js/frontend-panel/lib/utils';
import Room from '@/js/shared/types/model/tenant/room';
import RoomDetailsModal from '@/js/frontend-panel/components/modals/room/RoomDetailsModal';
import { useToast } from '@/js/shared/hooks/useToast';
import { useTheme } from "../../hooks/use-theme";


interface PanelRoomIndexProps {
    rooms: Room[];
}

// Helper to strip class, width, and height from SVG string
function stripSvgSize(svg: string) {
    return svg
        .replace(/class="[^"]*"/g, '')
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '');
}

export default function PanelRoomIndex({ rooms = [] }: PanelRoomIndexProps) {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletingRoom, setDeletingRoom] = useState<number | null>(null);
    const toast = useToast();
    const isDarkMode = useTheme();

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
        { label: "Rooms", active: true }
    ];

    const activePage = tenantId ? routeLang('panel-room-index', { tenantId: tenantId }) : '';

    // Helper function to get main price (first price from full prices, active or inactive)
    const getMainPrice = (room: Room) => {
        const firstPrice = room.prices?.find(p => p.price > 0);
        if (!firstPrice) return null;

        return {
            currency: firstPrice.currency_code.toUpperCase(),
            price: firstPrice.price,
            priceFormatted: firstPrice.price_formatted,
            priceIlustrative: firstPrice.price_ilustrative_formatted,
            isActive: firstPrice.status,
        };
    };

    const handleViewDetails = (room: Room) => {
        setSelectedRoom(room);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRoom(null);
    };

    const handleDeleteRoom = async (roomId: string) => {
        setDeletingRoom(parseInt(roomId));

        const deleteUrl = routeLangStatic('panel-room-destroy', {
            tenantId,
            roomIdHashed: roomId
        });

        router.delete(deleteUrl, {
            onSuccess: () => {
                setDeletingRoom(null);
                setModalOpen(false);
                setSelectedRoom(null);
                toast.success('Room deleted successfully', isDarkMode.theme === 'dark');
            },
            onError: (errors) => {
                setDeletingRoom(null);
                if (errors.error) {
                    toast.error(errors.error, isDarkMode.theme === 'dark');
                } else {
                    toast.error('Failed to delete room', isDarkMode.theme === 'dark');
                }
            }
        });
    };

    return (
        <PanelLayout
            title="Rooms"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight"></h1>
                        <p className="text-muted-foreground">Manage your hotel rooms and their configurations</p>
                    </div>
                    <Link
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                        href={routeLang('panel-room-create', { tenantId })}
                    >
                        <Plus className="w-4 h-4" /> Create Room
                    </Link>
                </div>

                <div className="w-full border-b mb-4">
                    <div className="flex gap-2">
                        <Link
                            href={routeLang('panel-room-index', { tenantId })}
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
                            Rooms
                        </Link>
                        <Link
                            href={routeLang('panel-room-type-index', { tenantId })}
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
                            Room Types
                        </Link>
                    </div>
                </div>

                {rooms.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No rooms yet</h3>
                                <p className="text-muted-foreground">Create your first room to get started</p>
                            </div>
                            <Link
                                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                                href={routeLang('panel-room-create', { tenantId })}
                            >
                                <Plus className="w-4 h-4" /> Create First Room
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => {
                            const mainPrice = getMainPrice(room);
                            const roomName = room.name;
                            const roomDescription = room.description;
                            const mainImage = room.galleries?.find(g => g.type === 'image')?.src || '/assets/images/products/s1.jpg';

                            return (
                                <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleViewDetails(room)}>
                                    <CardHeader className="p-0">
                                        <div className="relative">
                                            <img
                                                src={mainImage}
                                                alt={roomName}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                                    #{room.id}
                                                </Badge>
                                            </div>
                                            {mainPrice && (
                                                <div className="absolute bottom-2 left-2">
                                                    <Badge variant="default" className="bg-primary/90 backdrop-blur-sm text-primary-foreground">
                                                        <span className={mainPrice.isActive ? "" : "line-through opacity-70"}>
                                                            {mainPrice.priceFormatted}
                                                        </span>
                                                        {!mainPrice.isActive && (
                                                            <span className="ml-1 text-xs">(Inactive)</span>
                                                        )}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        <div className="mb-3">
                                            <CardTitle className="text-lg mb-1">{roomName}</CardTitle>
                                            {roomDescription && (
                                                <CardDescription className="text-sm text-muted-foreground overflow-hidden">
                                                    {roomDescription.length > 100 ? `${roomDescription.substring(0, 100)}...` : roomDescription}
                                                </CardDescription>
                                            )}
                                        </div>

                                        {/* Capacity */}
                                        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{room.max_adults}</span>
                                            </div>
                                            {room.max_children > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Baby className="h-4 w-4" />
                                                    <span>{room.max_children}</span>
                                                </div>
                                            )}
                                            {room.max_infants > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Baby className="h-4 w-4" />
                                                    <span>{room.max_infants}</span>
                                                </div>
                                            )}
                                            {room.max_pets > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Dog className="h-4 w-4" />
                                                    <span>{room.max_pets}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Comodites */}
                                        {room.comodites && room.comodites.length > 0 && (
                                            <div className="mb-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {room.comodites.slice(0, 4).map((comodite) => (
                                                        <div key={comodite.id} className="flex items-center gap-1 bg-muted/60 rounded px-2 py-0.5 text-xs">
                                                            {comodite.comodite?.icon && (
                                                                <span className="h-2.5 w-2.5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: stripSvgSize(comodite.comodite.icon) }} />
                                                            )}
                                                            {comodite.comodite?.name}
                                                            {comodite.use_type_comodites_in_room && (
                                                                <span className="text-blue-500">(T)</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {room.comodites.length > 4 && (
                                                        <div className="flex items-center gap-1 bg-muted/60 rounded px-2 py-0.5 text-xs">
                                                            +{room.comodites.length - 4} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Prices */}
                                        {room.prices && room.prices.length > 0 && (
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium text-muted-foreground">Prices:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {room.prices.map((price) => (
                                                        <Badge key={price.currency_code} variant="secondary" className="text-xs">
                                                            <span className={price.status ? "" : "line-through opacity-70"}>
                                                                {price.price_formatted}
                                                            </span>
                                                            {!price.status && (
                                                                <span className="ml-1 text-xs">(I)</span>
                                                            )}
                                                            {price.use_type_price_in_room && (
                                                                <span className="text-blue-500 ml-1">(T)</span>
                                                            )}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0">
                                        <div className="flex gap-2 w-full">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={e => { e.stopPropagation(); handleViewDetails(room); }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Link
                                                href={routeLang('panel-room-edit', { tenantId, roomIdHashed: room.id })}
                                                className="flex-1"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Button size="sm" variant="default" className="w-full">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" className="flex-1" onClick={e => e.stopPropagation()}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{roomName}"? This action cannot be undone and will also delete all associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteRoom(room.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            disabled={deletingRoom === parseInt(room.id)}
                                                        >
                                                            {deletingRoom === parseInt(room.id) ? 'Deleting...' : 'Delete'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
            {selectedRoom && (
                <RoomDetailsModal
                    room={selectedRoom}
                    open={modalOpen}
                    onOpenChange={handleCloseModal}
                    onDelete={handleDeleteRoom}
                    isDeleting={deletingRoom === parseInt(selectedRoom.id)}
                />
            )}
        </PanelLayout>
    );
}
