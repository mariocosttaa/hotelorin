import PanelLayout from "../../layout/PanelLayout";
import { routeLang, routeLangStatic } from '@/js/shared/helpers/routeLang';
import { usePage, router, useForm } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { Input } from "@/js/frontend-panel/components/ui/input";
import { Textarea } from "@/js/frontend-panel/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/js/frontend-panel/components/ui/tabs";
import { Label } from "@/js/frontend-panel/components/ui/label";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { FileUpload } from "@/js/frontend-panel/components/ui/file-upload";
import { Switch } from "@/js/frontend-panel/components/ui/switch";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { FormEventHandler, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/js/shared/hooks/useToast';
import { useTheme } from "../../hooks/use-theme";
import { X, Plus, Trash2, CircleDollarSign, Coins, DollarSign, Euro } from "lucide-react";
import comodite from "@/js/shared/types/model/tenant/comodite";
import Room from "@/js/shared/types/model/tenant/room";
import ComoditesShowModal from '@/js/frontend-panel/components/modals/comodites/ComoditesShowModal';
import { CurrencyInput } from '@/js/shared/components/form/CurrencyInput';
import RequiredInput from '@/js/frontend-panel/components/ui/form/RequiredInput';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/js/frontend-panel/components/ui/card";

type ImportedImage = { src: string; imported: true; id?: string; type?: string };

interface PanelRoomEditProps {
    room: Room;
    comodites: Array<comodite>;
}

type RoomForm = {
    room_type_id: string;
    number: string;
    overview_name_pt: string;
    overview_name_en: string;
    overview_name_es: string;
    overview_name_fr: string;
    overview_description_pt: string;
    overview_description_en: string;
    overview_description_es: string;
    overview_description_fr: string;
    max_adults: string;
    max_children: string;
    max_infants: string;
    max_pets: string;
    gallery: File[];
    comodites: string[];
    price_usd: string;
    price_usd_ilustrative: string;
    price_usd_status: boolean;
    price_eur: string;
    price_eur_ilustrative: string;
    price_eur_status: boolean;
    price_aoa: string;
    price_aoa_ilustrative: string;
    price_aoa_status: boolean;
    price_brl: string;
    price_brl_ilustrative: string;
    price_brl_status: boolean;
};

export default function PanelRoomEdit({ room, comodites}: PanelRoomEditProps) {
    const { tenantId, setting, locale } = usePage<InertiaMiddlewareProps>().props;
    const { theme } = useTheme();
    const toast = useToast();
    const [isComoditeModalOpen, setIsComoditeModalOpen] = useState(false);
    const [deletingGallery, setDeletingGallery] = useState<string | null>(null);
    const [roomData, setRoomData] = useState(room);

    const [galleryFiles, setGalleryFiles] = useState<(File | ImportedImage)[]>([]);

    // Get default language from setting
    const safeDefaultLanguage = setting.default_language;

    if (!room) {
        return (
            <PanelLayout title="Edit Room" activePage="" breadcrumbs={[]}>
                <div className="max-w-4xl mx-auto mt-8 bg-background border border-border p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center h-32">
                        <div className="text-muted-foreground">Loading room...</div>
                    </div>
                </div>
            </PanelLayout>
        );
    }

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId }) : '#' },
        { label: "Rooms", href: tenantId ? routeLang('panel-room-index', { tenantId }) : '#' },
        { label: "Edit Room", active: true }
    ];

    const activePage = tenantId ? routeLang('panel-room-index', { tenantId }) : '';

    const { data, setData, post, processing, errors } = useForm<RoomForm>({
        room_type_id: room.room_type_id || '',
        number: (room.number || '').toString(),
        overview_name_pt: room.overview_name_pt || '',
        overview_name_en: room.overview_name_en || '',
        overview_name_es: room.overview_name_es || '',
        overview_name_fr: room.overview_name_fr || '',
        overview_description_pt: room.overview_description_pt || '',
        overview_description_en: room.overview_description_en || '',
        overview_description_es: room.overview_description_es || '',
        overview_description_fr: room.overview_description_fr || '',
        max_adults: room.max_adults?.toString() || '',
        max_children: room.max_children?.toString() || '',
        max_infants: room.max_infants?.toString() || '',
        max_pets: room.max_pets?.toString() || '',
        gallery: [],
        comodites: room.comodites?.map(c => c.comodite?.id).filter((id): id is string => !!id) || [],
        price_usd: room.prices?.find(p => p.currency_code.toLowerCase() === 'usd')?.price?.toString() || '',
        price_usd_ilustrative: room.prices?.find(p => p.currency_code.toLowerCase() === 'usd')?.price_ilustrative?.toString() || '',
        price_usd_status: room.prices?.find(p => p.currency_code.toLowerCase() === 'usd')?.status || false,
        price_eur: room.prices?.find(p => p.currency_code.toLowerCase() === 'eur')?.price?.toString() || '',
        price_eur_ilustrative: room.prices?.find(p => p.currency_code.toLowerCase() === 'eur')?.price_ilustrative?.toString() || '',
        price_eur_status: room.prices?.find(p => p.currency_code.toLowerCase() === 'eur')?.status || false,
        price_aoa: room.prices?.find(p => p.currency_code.toLowerCase() === 'aoa')?.price?.toString() || '',
        price_aoa_ilustrative: room.prices?.find(p => p.currency_code.toLowerCase() === 'aoa')?.price_ilustrative?.toString() || '',
        price_aoa_status: room.prices?.find(p => p.currency_code.toLowerCase() === 'aoa')?.status || false,
        price_brl: room.prices?.find(p => p.currency_code.toLowerCase() === 'brl')?.price?.toString() || '',
        price_brl_ilustrative: room.prices?.find(p => p.currency_code.toLowerCase() === 'brl')?.price_ilustrative?.toString() || '',
        price_brl_status: room.prices?.find(p => p.currency_code.toLowerCase() === 'brl')?.status || false,
    });

    useEffect(() => {
        const fileFiles = galleryFiles.filter((f): f is File => f instanceof File);
        setData('gallery', fileFiles);
    }, [galleryFiles, setData]);

    const priceUsdRaw = data.price_usd ? (parseInt(data.price_usd) || 0) / 100 : null;
    const priceUsdIlRaw = data.price_usd_ilustrative ? (parseInt(data.price_usd_ilustrative) || 0) / 100 : null;
    const priceEurRaw = data.price_eur ? (parseInt(data.price_eur) || 0) / 100 : null;
    const priceEurIlRaw = data.price_eur_ilustrative ? (parseInt(data.price_eur_ilustrative) || 0) / 100 : null;
    const priceAoaRaw = data.price_aoa ? (parseInt(data.price_aoa) || 0) / 100 : null;
    const priceAoaIlRaw = data.price_aoa_ilustrative ? (parseInt(data.price_aoa_ilustrative) || 0) / 100 : null;
    const priceBrlRaw = data.price_brl ? (parseInt(data.price_brl) || 0) / 100 : null;
    const priceBrlIlRaw = data.price_brl_ilustrative ? (parseInt(data.price_brl_ilustrative) || 0) / 100 : null;

    const handlePriceChange = useCallback((setter: (key: keyof RoomForm, value: any) => void, priceKey: keyof RoomForm, statusKey: keyof RoomForm, currentStatus: boolean) => (rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        setter(priceKey, newValue);
        if (rawValue && rawValue > 0 && !currentStatus) {
            setter(statusKey, true);
        }
    }, []);

    const handleUsdChange = handlePriceChange(setData, 'price_usd', 'price_usd_status', data.price_usd_status);
    const handleUsdIlChange = handlePriceChange(setData, 'price_usd_ilustrative', 'price_usd_status', data.price_usd_status);
    const handleEurChange = handlePriceChange(setData, 'price_eur', 'price_eur_status', data.price_eur_status);
    const handleEurIlChange = handlePriceChange(setData, 'price_eur_ilustrative', 'price_eur_status', data.price_eur_status);
    const handleAoaChange = handlePriceChange(setData, 'price_aoa', 'price_aoa_status', data.price_aoa_status);
    const handleAoaIlChange = handlePriceChange(setData, 'price_aoa_ilustrative', 'price_aoa_status', data.price_aoa_status);
    const handleBrlChange = handlePriceChange(setData, 'price_brl', 'price_brl_status', data.price_brl_status);
    const handleBrlIlChange = handlePriceChange(setData, 'price_brl_ilustrative', 'price_brl_status', data.price_brl_status);

    const handleGalleryChange = (files: (File | ImportedImage)[]) => {
        setGalleryFiles(files);
    };

    const handleComoditeToggle = (comoditeId: string) => {
        const currentComodites = data.comodites;
        const isSelected = currentComodites.includes(comoditeId);
        setData('comodites', isSelected ? currentComodites.filter(id => id !== comoditeId) : [...currentComodites, comoditeId]);
    };

    const getSelectedComodites = () => {
        return comodites.filter(comodite => data.comodites.includes(comodite.id));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        const submitUrl = routeLang('panel-room-update', { tenantId, roomIdHashed: room.id, locale });
        post(submitUrl, {
            preserveScroll: true,
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error, theme === 'dark'));
            },
        });
    };

    const handleDeleteGallery = async (galleryId: string) => {
        setDeletingGallery(galleryId);
        const deleteUrl = routeLangStatic('panel-room-gallery-destroy', {
            tenantId,
            roomIdHashed: room.id,
            galleryIdHashed: galleryId
        });
        router.delete(deleteUrl, {
            onSuccess: () => {
                setRoomData(prev => ({
                    ...prev,
                    galleries: prev.galleries?.filter(g => g.id !== galleryId) || []
                }));
                toast.success('Image deleted successfully', theme === 'dark');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to delete image', theme === 'dark');
            },
            onFinish: () => setDeletingGallery(null)
        });
    };

    const getInputClassName = (fieldName: keyof RoomForm) => {
        return `w-full ${errors[fieldName] ? 'border-destructive' : ''}`;
    };

    return (
        <PanelLayout
            title="Edit Room"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="max-w-4xl mx-auto mt-8 bg-background border border-border p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Edit Room Details</h1>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="room_type_id" value={data.room_type_id} />
                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-4 block">Gallery</Label>
                        {roomData.galleries && roomData.galleries.length > 0 && (
                            <div className="mb-4">
                                <Label className="text-sm font-medium mb-2 block">Existing Images</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {roomData.galleries.map((gallery) => (
                                        <div key={gallery.id} className="relative group">
                                            <img src={gallery.src} alt="Gallery" className="w-full h-24 object-cover rounded-lg border" />
                                            {gallery.use_type_gallery_in_room && (
                                                <div className="absolute top-1 left-1">
                                                    <Badge variant="secondary" className="text-xs px-1 py-0.5">
                                                        Inherited
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleDeleteGallery(gallery.id)}
                                                    disabled={deletingGallery === gallery.id}
                                                    title={gallery.use_type_gallery_in_room ? "Remove inherited image" : "Delete image"}
                                                >
                                                    {deletingGallery === gallery.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <FileUpload
                            files={galleryFiles}
                            onFilesChange={handleGalleryChange}
                            maxFiles={10 - (roomData.galleries?.length || 0)}
                            acceptedExtensions={["image/*", "video/*"]}
                            maxFileSize={5}
                            label="Add New Images"
                            showPreview={true}
                            previewSize="md"
                        />
                        {errors.gallery && <p className="text-sm text-destructive mt-1">{errors.gallery}</p>}
                    </div>

                    <div className="mb-8">
                        <RequiredInput label="Room Number" required htmlFor="room_number">
                            <Input
                                id="room_number"
                                placeholder="e.g., 101, A1, Suite 1"
                                value={data.number}
                                onChange={e => setData('number', e.target.value)}
                                className={getInputClassName('number')}
                            />
                        </RequiredInput>
                        {errors.number && <p className="text-sm text-destructive mt-1">{errors.number}</p>}
                    </div>

                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-4 block">Amenities</Label>
                        <div className="mb-4">
                            {getSelectedComodites().length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {getSelectedComodites().map((comodite) => {
                                        // Check if this comodite is inherited from room type
                                        const isInherited = room.comodites?.some(c =>
                                            c.comodite?.id === comodite.id && c.use_type_comodites_in_room
                                        );

                                        return (
                                            <Badge
                                                key={comodite.id}
                                                variant="secondary"
                                                className="flex items-center gap-2 px-3 py-1"
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: comodite.icon || '' }} />
                                                <div className="flex flex-col">
                                                    <span>{comodite.name}</span>
                                                    {isInherited && (
                                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                            Inherited
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleComoditeToggle(comodite.id)}
                                                    className="ml-1 hover:text-destructive transition-colors"
                                                    title={isInherited ? "Remove inherited amenity" : "Remove amenity"}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            ) : <p className="text-sm text-muted-foreground">No amenities selected</p>}
                        </div>
                        <Button type="button" variant="outline" className="flex items-center gap-2" onClick={() => setIsComoditeModalOpen(true)}>
                            <Plus className="w-4 h-4" /> Select Amenities
                        </Button>
                        <ComoditesShowModal
                            open={isComoditeModalOpen}
                            onOpenChange={setIsComoditeModalOpen}
                            comodites={comodites}
                            selectedComodites={data.comodites}
                            onToggle={handleComoditeToggle}
                            onDone={() => setIsComoditeModalOpen(false)}
                        />
                        {errors.comodites && <p className="text-sm text-destructive mt-1">{errors.comodites}</p>}
                    </div>

                    <Tabs defaultValue="pt" className="w-full">
                        <TabsList className="mb-2">
                            <TabsTrigger value="pt">Portuguese</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="es">Spanish</TabsTrigger>
                            <TabsTrigger value="fr">French</TabsTrigger>
                        </TabsList>
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <strong>Note:</strong> The default language fields ({safeDefaultLanguage.toUpperCase()}) are required. Other languages are optional.
                            </p>
                        </div>
                        <TabsContent value="pt">
                            <div className="grid grid-cols-1 gap-4">
                                <RequiredInput label="Name" htmlFor="name_pt">
                                    <Input id="name_pt" placeholder="Room name (PT)" value={data.overview_name_pt} onChange={e => setData('overview_name_pt', e.target.value)} className={getInputClassName('overview_name_pt')} />
                                </RequiredInput>
                                {errors.overview_name_pt && <p className="text-sm text-destructive mt-1">{errors.overview_name_pt}</p>}
                                <RequiredInput label="Description" htmlFor="desc_pt">
                                    <Textarea id="desc_pt" placeholder="Room description (PT)" value={data.overview_description_pt} onChange={e => setData('overview_description_pt', e.target.value)} className={getInputClassName('overview_description_pt')} />
                                </RequiredInput>
                                {errors.overview_description_pt && <p className="text-sm text-destructive mt-1">{errors.overview_description_pt}</p>}
                            </div>
                        </TabsContent>
                        {/* Other languages... */}
                    </Tabs>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <RequiredInput label="Max Adults" required htmlFor="max_adults">
                            <Input id="max_adults" type="number" placeholder="2" value={data.max_adults} onChange={e => setData('max_adults', e.target.value)} className={getInputClassName('max_adults')} />
                        </RequiredInput>
                        {errors.max_adults && <p className="text-sm text-destructive mt-1">{errors.max_adults}</p>}
                        <RequiredInput label="Max Children" required htmlFor="max_children">
                            <Input id="max_children" type="number" placeholder="2" value={data.max_children} onChange={e => setData('max_children', e.target.value)} className={getInputClassName('max_children')} />
                        </RequiredInput>
                        {errors.max_children && <p className="text-sm text-destructive mt-1">{errors.max_children}</p>}
                        <RequiredInput label="Max Infants" required htmlFor="max_infants">
                            <Input id="max_infants" type="number" placeholder="1" value={data.max_infants} onChange={e => setData('max_infants', e.target.value)} className={getInputClassName('max_infants')} />
                        </RequiredInput>
                        {errors.max_infants && <p className="text-sm text-destructive mt-1">{errors.max_infants}</p>}
                        <RequiredInput label="Max Pets" required htmlFor="max_pets">
                            <Input id="max_pets" type="number" placeholder="0" value={data.max_pets} onChange={e => setData('max_pets', e.target.value)} className={getInputClassName('max_pets')} />
                        </RequiredInput>
                        {errors.max_pets && <p className="text-sm text-destructive mt-1">{errors.max_pets}</p>}
                    </div>

                    <div className="mt-12">
                        <div className="mb-4 text-2xl font-bold text-foreground dark:text-white flex items-center">Prices <span className="text-red-600 ml-2">*</span></div>
                        <div className="flex flex-col gap-4">
                            {/* USD */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">USD</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput currency="USD" value={priceUsdRaw} returnType="int" onValueChange={handleUsdChange} placeholder="100" className={getInputClassName('price_usd')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput currency="USD" value={priceUsdIlRaw} returnType="int" onValueChange={handleUsdIlChange} placeholder="120" className={getInputClassName('price_usd_ilustrative')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch checked={data.price_usd_status} onCheckedChange={v => setData('price_usd_status', v)} />
                                </div>
                            </div>

                            {/* EUR */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <Euro className="h-6 w-6 text-green-600 dark:text-green-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">EUR</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput currency="EUR" value={priceEurRaw} returnType="int" onValueChange={handleEurChange} placeholder="100" className={getInputClassName('price_eur')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput currency="EUR" value={priceEurIlRaw} returnType="int" onValueChange={handleEurIlChange} placeholder="120" className={getInputClassName('price_eur_ilustrative')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch checked={data.price_eur_status} onCheckedChange={v => setData('price_eur_status', v)} />
                                </div>
                            </div>

                            {/* AOA */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">AOA</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput currency="AOA" value={priceAoaRaw} returnType="int" onValueChange={handleAoaChange} placeholder="100" className={getInputClassName('price_aoa')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput currency="AOA" value={priceAoaIlRaw} returnType="int" onValueChange={handleAoaIlChange} placeholder="120" className={getInputClassName('price_aoa_ilustrative')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch checked={data.price_aoa_status} onCheckedChange={v => setData('price_aoa_status', v)} />
                                </div>
                            </div>

                            {/* BRL */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <CircleDollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">BRL</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput currency="BRL" value={priceBrlRaw} returnType="int" onValueChange={handleBrlChange} placeholder="100" className={getInputClassName('price_brl')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput currency="BRL" value={priceBrlIlRaw} returnType="int" onValueChange={handleBrlIlChange} placeholder="120" className={getInputClassName('price_brl_ilustrative')} />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch checked={data.price_brl_status} onCheckedChange={v => setData('price_brl_status', v)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                        <Button variant="default" size="lg" type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Room'}
                        </Button>
                    </div>
                </form>
            </div>
        </PanelLayout>
    );
}
