import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/js/frontend-panel/components/ui/dialog";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { Card, CardContent } from "@/js/frontend-panel/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/js/frontend-panel/components/ui/tabs";
import { Users, Baby, Dog, DollarSign, Euro, CircleDollarSign, Coins, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Room from "@/js/shared/types/model/tenant/room";
import { cn } from "@/js/frontend-panel/lib/utils";

interface RoomDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room: Room | null;
}

function stripSvgSize(svg: string) {
    return svg
        .replace(/class="[^"]*"/g, '')
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '');
}

export default function RoomDetailsModal({ open, onOpenChange, room }: RoomDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!room) return null;

    const images = room.galleries?.filter(g => g.type === 'image') || [];
    const videos = room.galleries?.filter(g => g.type === 'video') || [];

    const getCurrencyIcon = (currency: string) => {
        switch (currency) {
            case 'USD': return <DollarSign className="h-4 w-4 text-blue-600" />;
            case 'EUR': return <Euro className="h-4 w-4 text-indigo-600" />;
            case 'AOA': return <CircleDollarSign className="h-4 w-4 text-green-600" />;
            case 'BRL': return <Coins className="h-4 w-4 text-yellow-600" />;
            default: return <DollarSign className="h-4 w-4" />;
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>Room #{room.id}</span>
                        <Badge variant="secondary">#{room.id}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Complete details and information for {room.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Gallery and Basic Info */}
                    <div className="space-y-6">
                        {/* Gallery */}
                        {images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Gallery</h3>
                                <div className="relative">
                                    <img
                                        src={images[currentImageIndex]?.src || '/assets/images/products/s1.jpg'}
                                        alt={`${room.name} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                                onClick={prevImage}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                                onClick={nextImage}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                {images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={cn(
                                                            "w-2 h-2 rounded-full transition-colors",
                                                            index === currentImageIndex
                                                                ? "bg-primary"
                                                                : "bg-muted hover:bg-muted-foreground"
                                                        )}
                                                        onClick={() => goToImage(index)}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.src}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={cn(
                                                    "w-16 h-16 object-cover rounded cursor-pointer transition-opacity",
                                                    index === currentImageIndex
                                                        ? "opacity-100 ring-2 ring-primary"
                                                        : "opacity-60 hover:opacity-80"
                                                )}
                                                onClick={() => goToImage(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Videos */}
                        {videos.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Videos</h3>
                                <div className="space-y-4">
                                    {videos.map((video, index) => (
                                        <video
                                            key={index}
                                            src={video.src}
                                            controls
                                            className="w-full rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Room Type Info */}
                        {room.room_type && (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-3">Room Type</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name (PT):</span>
                                            <span>{room.room_type.name_pt || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name (EN):</span>
                                            <span>{room.room_type.name_en || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name (ES):</span>
                                            <span>{room.room_type.name_es || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name (FR):</span>
                                            <span>{room.room_type.name_fr || '-'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        {/* Room Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Room Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-lg">{room.name}</h4>
                                    {room.description && (
                                        <p className="text-muted-foreground mt-1">{room.description}</p>
                                    )}
                                </div>

                                {/* Capacity */}
                                <div className="space-y-2">
                                    <h5 className="font-medium">Capacity</h5>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{room.max_adults} Adults</span>
                                        </div>
                                        {room.max_children > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Baby className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{room.max_children} Children</span>
                                            </div>
                                        )}
                                        {room.max_infants > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Baby className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{room.max_infants} Infants</span>
                                            </div>
                                        )}
                                        {room.max_pets > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Dog className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{room.max_pets} Pets</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comodites */}
                        {room.comodites && room.comodites.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Amenities ({room.comodites.length})</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {room.comodites.map((comodite) => (
                                        <div key={comodite.id} className="flex items-center gap-2 p-2 rounded border">
                                            {comodite.icon && (
                                                <div
                                                    className="w-4 h-4 flex-shrink-0"
                                                    dangerouslySetInnerHTML={{ __html: stripSvgSize(comodite.icon) }}
                                                />
                                            )}
                                            <span className="text-sm">{comodite.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prices */}
                        {room.prices && room.prices.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Pricing</h3>
                                <Tabs defaultValue="active" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="active">Active Prices</TabsTrigger>
                                        <TabsTrigger value="all">All Prices</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="active" className="space-y-2">
                                        {room.prices.filter(p => p.status).map((price) => (
                                            <div key={price.currency_code} className="flex items-center justify-between p-3 rounded border">
                                                <div className="flex items-center gap-2">
                                                    {getCurrencyIcon(price.currency_code.toUpperCase())}
                                                    <span className="font-medium">{price.currency_code.toUpperCase()}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{price.price_formatted}</div>
                                                    {price.price_ilustrative_formatted && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {price.price_ilustrative_formatted} (illustrative)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value="all" className="space-y-2">
                                        {room.prices.map((price) => (
                                            <div key={price.currency_code} className="flex items-center justify-between p-3 rounded border">
                                                <div className="flex items-center gap-2">
                                                    {getCurrencyIcon(price.currency_code.toUpperCase())}
                                                    <span className="font-medium">{price.currency_code.toUpperCase()}</span>
                                                    {!price.status && (
                                                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{price.price_formatted}</div>
                                                    {price.price_ilustrative_formatted && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {price.price_ilustrative_formatted} (illustrative)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button variant="default">
                        Edit Room
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
