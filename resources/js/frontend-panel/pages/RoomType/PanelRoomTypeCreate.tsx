import PanelLayout from "../../layout/PanelLayout";
import { routeLang } from '@/js/shared/helpers/routeLang';
import { usePage } from '@inertiajs/react';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import { Input } from "@/js/frontend-panel/components/ui/input";
import { Textarea } from "@/js/frontend-panel/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/js/frontend-panel/components/ui/tabs";
import { Label } from "@/js/frontend-panel/components/ui/label";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { FileUpload } from "@/js/frontend-panel/components/ui/file-upload";
import { Checkbox } from "@/js/frontend-panel/components/ui/checkbox";
import { Switch } from "@/js/frontend-panel/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/js/frontend-panel/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/js/frontend-panel/components/ui/dialog";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useToast } from '@/js/shared/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../hooks/use-theme";
import { X, Plus, CircleDollarSign, Coins, DollarSign, Euro } from "lucide-react";
import comodite from "@/js/shared/types/model/tenant/comodite";
import ComoditesShowModal from '@/js/frontend-panel/components/modals/comodites/ComoditesShowModal';
import { CurrencyInput } from '@/js/shared/components/form/CurrencyInput';
import RequiredInput from '@/js/frontend-panel/components/ui/form/RequiredInput';
import React from 'react';

type ImportedImage = { src: string; imported: true; id?: string; type?: string };

interface PanelRoomTypeCreateProps {
    comodites: Array<comodite>;
}

type RoomTypeForm = {
    name_pt: string;
    name_en: string;
    name_es: string;
    name_fr: string;
    description_pt: string;
    description_en: string;
    description_es: string;
    description_fr: string;
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

export default function PanelRoomTypeCreate({ comodites }: PanelRoomTypeCreateProps) {
    const { t: __ } = useTranslation(['static-text']);
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;
    const isDarkMode = useTheme();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbs = [
        { label: "Dashboard", href: tenantId ? routeLang('panel-dashboard', { tenantId }) : '#' },
        { label: "Room Types", href: tenantId ? routeLang('panel-room-type-index', { tenantId }) : '#' },
        { label: "Create Room Type", active: true }
    ];
    const activePage = tenantId ? routeLang('panel-room-type-create', { tenantId }) : '';

    const { data, setData, post, processing, errors, reset } = useForm<RoomTypeForm>({
        name_pt: '',
        name_en: '',
        name_es: '',
        name_fr: '',
        description_pt: '',
        description_en: '',
        description_es: '',
        description_fr: '',
        gallery: [],
        comodites: [],
        price_usd: '',
        price_usd_ilustrative: '',
        price_usd_status: false,
        price_eur: '',
        price_eur_ilustrative: '',
        price_eur_status: false,
        price_aoa: '',
        price_aoa_ilustrative: '',
        price_aoa_status: false,
        price_brl: '',
        price_brl_ilustrative: '',
        price_brl_status: false,
    });

    // Local state for raw price values (for UI logic) - computed from form data
    const priceUsdRaw = data.price_usd ? (parseInt(data.price_usd) || 0) / 100 : null;
    const priceUsdIlRaw = data.price_usd_ilustrative ? (parseInt(data.price_usd_ilustrative) || 0) / 100 : null;
    const priceEurRaw = data.price_eur ? (parseInt(data.price_eur) || 0) / 100 : null;
    const priceEurIlRaw = data.price_eur_ilustrative ? (parseInt(data.price_eur_ilustrative) || 0) / 100 : null;
    const priceAoaRaw = data.price_aoa ? (parseInt(data.price_aoa) || 0) / 100 : null;
    const priceAoaIlRaw = data.price_aoa_ilustrative ? (parseInt(data.price_aoa_ilustrative) || 0) / 100 : null;
    const priceBrlRaw = data.price_brl ? (parseInt(data.price_brl) || 0) / 100 : null;
    const priceBrlIlRaw = data.price_brl_ilustrative ? (parseInt(data.price_brl_ilustrative) || 0) / 100 : null;

    // Refs to track previous values and prevent infinite loops
    const prevPriceUsd = React.useRef(data.price_usd);
    const prevPriceUsdIl = React.useRef(data.price_usd_ilustrative);
    const prevPriceEur = React.useRef(data.price_eur);
    const prevPriceEurIl = React.useRef(data.price_eur_ilustrative);
    const prevPriceAoa = React.useRef(data.price_aoa);
    const prevPriceAoaIl = React.useRef(data.price_aoa_ilustrative);
    const prevPriceBrl = React.useRef(data.price_brl);
    const prevPriceBrlIl = React.useRef(data.price_brl_ilustrative);

    // Memoized handlers to prevent unnecessary re-renders
    const handleUsdChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceUsd.current !== newValue) {
            prevPriceUsd.current = newValue;
            setData('price_usd', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_usd_status) {
                setData('price_usd_status', true);
            } else if (!rawValue && data.price_usd_status) {
                setData('price_usd_status', false);
            }
        }
    }, [setData, data.price_usd_status]);

    const handleUsdIlChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceUsdIl.current !== newValue) {
            prevPriceUsdIl.current = newValue;
            setData('price_usd_ilustrative', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_usd_status) {
                setData('price_usd_status', true);
            } else if (!rawValue && data.price_usd_status) {
                setData('price_usd_status', false);
            }
        }
    }, [setData, data.price_usd_status]);

    const handleEurChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceEur.current !== newValue) {
            prevPriceEur.current = newValue;
            setData('price_eur', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_eur_status) {
                setData('price_eur_status', true);
            } else if (!rawValue && data.price_eur_status) {
                setData('price_eur_status', false);
            }
        }
    }, [setData, data.price_eur_status]);

    const handleEurIlChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceEurIl.current !== newValue) {
            prevPriceEurIl.current = newValue;
            setData('price_eur_ilustrative', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_eur_status) {
                setData('price_eur_status', true);
            } else if (!rawValue && data.price_eur_status) {
                setData('price_eur_status', false);
            }
        }
    }, [setData, data.price_eur_status]);

    const handleAoaChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceAoa.current !== newValue) {
            prevPriceAoa.current = newValue;
            setData('price_aoa', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_aoa_status) {
                setData('price_aoa_status', true);
            } else if (!rawValue && data.price_aoa_status) {
                setData('price_aoa_status', false);
            }
        }
    }, [setData, data.price_aoa_status]);

    const handleAoaIlChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceAoaIl.current !== newValue) {
            prevPriceAoaIl.current = newValue;
            setData('price_aoa_ilustrative', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_aoa_status) {
                setData('price_aoa_status', true);
            } else if (!rawValue && data.price_aoa_status) {
                setData('price_aoa_status', false);
            }
        }
    }, [setData, data.price_aoa_status]);

    const handleBrlChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceBrl.current !== newValue) {
            prevPriceBrl.current = newValue;
            setData('price_brl', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_brl_status) {
                setData('price_brl_status', true);
            } else if (!rawValue && data.price_brl_status) {
                setData('price_brl_status', false);
            }
        }
    }, [setData, data.price_brl_status]);

    const handleBrlIlChange = React.useCallback((rawValue: number | null, formattedValue: string, formValue: number | string | null) => {
        const newValue = formValue?.toString() || '';
        if (prevPriceBrlIl.current !== newValue) {
            prevPriceBrlIl.current = newValue;
            setData('price_brl_ilustrative', newValue);
            // Only activate status if we have a real value
            if (rawValue && rawValue > 0 && !data.price_brl_status) {
                setData('price_brl_status', true);
            } else if (!rawValue && data.price_brl_status) {
                setData('price_brl_status', false);
            }
        }
    }, [setData, data.price_brl_status]);

    // Clear price handlers
    const clearUsdPrices = () => {
        setData('price_usd', '');
        setData('price_usd_ilustrative', '');
        setData('price_usd_status', false);
        prevPriceUsd.current = '';
        prevPriceUsdIl.current = '';
        // Force re-render by updating refs
        setTimeout(() => {
            prevPriceUsd.current = '';
            prevPriceUsdIl.current = '';
        }, 0);
    };

    const clearEurPrices = () => {
        setData('price_eur', '');
        setData('price_eur_ilustrative', '');
        setData('price_eur_status', false);
        prevPriceEur.current = '';
        prevPriceEurIl.current = '';
        // Force re-render by updating refs
        setTimeout(() => {
            prevPriceEur.current = '';
            prevPriceEurIl.current = '';
        }, 0);
    };

    const clearAoaPrices = () => {
        setData('price_aoa', '');
        setData('price_aoa_ilustrative', '');
        setData('price_aoa_status', false);
        prevPriceAoa.current = '';
        prevPriceAoaIl.current = '';
        // Force re-render by updating refs
        setTimeout(() => {
            prevPriceAoa.current = '';
            prevPriceAoaIl.current = '';
        }, 0);
    };

    const clearBrlPrices = () => {
        setData('price_brl', '');
        setData('price_brl_ilustrative', '');
        setData('price_brl_status', false);
        prevPriceBrl.current = '';
        prevPriceBrlIl.current = '';
        // Force re-render by updating refs
        setTimeout(() => {
            prevPriceBrl.current = '';
            prevPriceBrlIl.current = '';
        }, 0);
    };

    const handleGalleryChange = (files: (File | ImportedImage)[]) => {
        setData('gallery', files.filter((f): f is File => f instanceof File));
    };

    const handleComoditeToggle = (comoditeId: string) => {
        const currentComodites = data.comodites;
        const isSelected = currentComodites.includes(comoditeId);

        if (isSelected) {
            setData('comodites', currentComodites.filter(id => id !== comoditeId));
        } else {
            setData('comodites', [...currentComodites, comoditeId]);
        }
    };

    const removeComodite = (comoditeId: string) => {
        setData('comodites', data.comodites.filter(id => id !== comoditeId));
    };

    const getSelectedComodites = () => {
        return comodites.filter(comodite => data.comodites.includes(comodite.id));
    };

    const submitUrl = routeLang('panel-room-type-store', { tenantId });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(submitUrl, {
            preserveScroll: true, // Preserve scroll position
            onError: (errors) => {
                // Show errors via toast
                Object.keys(errors).forEach(key => {
                    if (errors[key]) {
                        toast.error(errors[key], isDarkMode.theme === 'dark', 10000);
                    }
                });
            },
        });
    };

    // Function to determine input class based on error
    const getInputClassName = (fieldName: keyof RoomTypeForm) => {
        const hasError = errors[fieldName];
        const baseClasses = "w-full";

        if (hasError) {
            return `${baseClasses} border-destructive focus:border-destructive focus:ring-destructive`;
        }

        return baseClasses;
    };

    const handleImportRoomType = (imported: any) => {
        setData({
            name_pt: imported.name_pt || '',
            name_en: imported.name_en || '',
            name_es: imported.name_es || '',
            name_fr: imported.name_fr || '',
            description_pt: imported.description_pt || '',
            description_en: imported.description_en || '',
            description_es: imported.description_es || '',
            description_fr: imported.description_fr || '',
            gallery: [],
            comodites: [],
            price_usd: '',
            price_usd_ilustrative: '',
            price_usd_status: false,
            price_eur: '',
            price_eur_ilustrative: '',
            price_eur_status: false,
            price_aoa: '',
            price_aoa_ilustrative: '',
            price_aoa_status: false,
            price_brl: '',
            price_brl_ilustrative: '',
            price_brl_status: false,
        });
        window.location.reload(); // Reload page after import to reflect language change
    };

    return (
        <PanelLayout
            title="Create Room Type"
            activePage={activePage}
            breadcrumbs={breadcrumbs}
        >
            <div className="max-w-4xl mx-auto mt-8 bg-background border border-border p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Room Type Details</h1>
                <form onSubmit={handleSubmit}>
                    {/* Gallery Upload Section */}
                    <div className="mb-8">
                        <FileUpload
                            files={data.gallery}
                            onFilesChange={handleGalleryChange}
                            maxFiles={10}
                            acceptedExtensions={["image/*", "video/*"]}
                            maxFileSize={5}
                            label="Gallery"
                            showPreview={true}
                            previewSize="md"
                        />
                        {errors.gallery && (
                            <p className="text-sm text-destructive mt-1">{errors.gallery}</p>
                        )}
                    </div>

                    {/* Comodites Selection Section */}
                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-4 block">Amenities</Label>

                        {/* Selected Amenities Display */}
                        <div className="mb-4">
                            {getSelectedComodites().length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {getSelectedComodites().map((comodite) => (
                                        <Badge
                                            key={comodite.id}
                                            variant="secondary"
                                            className="flex items-center gap-2 px-3 py-1"
                                        >
                                            <div
                                                className="w-4 h-4 flex items-center justify-center"
                                                dangerouslySetInnerHTML={{ __html: comodite.icon }}
                                            />
                                            <span>{comodite.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeComodite(comodite.id)}
                                                className="ml-1 hover:text-destructive transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No amenities selected</p>
                            )}
                        </div>

                        {/* Modal Trigger Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Select Amenities
                        </Button>
                        <ComoditesShowModal
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                            comodites={comodites}
                            selectedComodites={data.comodites}
                            onToggle={handleComoditeToggle}
                            onDone={() => setIsModalOpen(false)}
                        />

                        {errors.comodites && (
                            <p className="text-sm text-destructive mt-1">{errors.comodites}</p>
                        )}
                    </div>

                    {/* Multilingual Tabs Section */}
                    <Tabs defaultValue="pt" className="w-full">
                        <TabsList className="mb-2">
                            <TabsTrigger value="pt">Portuguese</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="es">Spanish</TabsTrigger>
                            <TabsTrigger value="fr">French</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pt">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name_pt">Name</Label>
                                    <Input
                                        id="name_pt"
                                        placeholder="Room type name (PT)"
                                        value={data.name_pt}
                                        onChange={e => setData('name_pt', e.target.value)}
                                        className={getInputClassName('name_pt')}
                                    />
                                    {errors.name_pt && (
                                        <p className="text-sm text-destructive mt-1">{errors.name_pt}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description_pt">Description</Label>
                                    <Textarea
                                        id="description_pt"
                                        placeholder="Room type description (PT)"
                                        value={data.description_pt}
                                        onChange={e => setData('description_pt', e.target.value)}
                                        className={getInputClassName('description_pt')}
                                    />
                                    {errors.description_pt && (
                                        <p className="text-sm text-destructive mt-1">{errors.description_pt}</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="en">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name_en">Name</Label>
                                    <Input
                                        id="name_en"
                                        placeholder="Room type name (EN)"
                                        value={data.name_en}
                                        onChange={e => setData('name_en', e.target.value)}
                                        className={getInputClassName('name_en')}
                                    />
                                    {errors.name_en && (
                                        <p className="text-sm text-destructive mt-1">{errors.name_en}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description_en">Description</Label>
                                    <Textarea
                                        id="description_en"
                                        placeholder="Room type description (EN)"
                                        value={data.description_en}
                                        onChange={e => setData('description_en', e.target.value)}
                                        className={getInputClassName('description_en')}
                                    />
                                    {errors.description_en && (
                                        <p className="text-sm text-destructive mt-1">{errors.description_en}</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="es">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name_es">Name</Label>
                                    <Input
                                        id="name_es"
                                        placeholder="Room type name (ES)"
                                        value={data.name_es}
                                        onChange={e => setData('name_es', e.target.value)}
                                        className={getInputClassName('name_es')}
                                    />
                                    {errors.name_es && (
                                        <p className="text-sm text-destructive mt-1">{errors.name_es}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description_es">Description</Label>
                                    <Textarea
                                        id="description_es"
                                        placeholder="Room type description (ES)"
                                        value={data.description_es}
                                        onChange={e => setData('description_es', e.target.value)}
                                        className={getInputClassName('description_es')}
                                    />
                                    {errors.description_es && (
                                        <p className="text-sm text-destructive mt-1">{errors.description_es}</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="fr">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name_fr">Name</Label>
                                    <Input
                                        id="name_fr"
                                        placeholder="Room type name (FR)"
                                        value={data.name_fr}
                                        onChange={e => setData('name_fr', e.target.value)}
                                        className={getInputClassName('name_fr')}
                                    />
                                    {errors.name_fr && (
                                        <p className="text-sm text-destructive mt-1">{errors.name_fr}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description_fr">Description</Label>
                                    <Textarea
                                        id="description_fr"
                                        placeholder="Room type description (FR)"
                                        value={data.description_fr}
                                        onChange={e => setData('description_fr', e.target.value)}
                                        className={getInputClassName('description_fr')}
                                    />
                                    {errors.description_fr && (
                                        <p className="text-sm text-destructive mt-1">{errors.description_fr}</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Prices Section */}
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
                                        <CurrencyInput
                                            currency="USD"
                                            initialValue={priceUsdRaw}
                                            returnType="int"
                                            onValueChange={handleUsdChange}
                                            placeholder="100"
                                            className={getInputClassName('price_usd')}
                                            data-currency="USD"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput
                                            currency="USD"
                                            initialValue={priceUsdIlRaw}
                                            returnType="int"
                                            onValueChange={handleUsdIlChange}
                                            placeholder="120"
                                            className={getInputClassName('price_usd_ilustrative')}
                                            data-currency="USD_IL"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearUsdPrices}
                                        className="h-6 w-6 p-0 mb-1"
                                        type="button"
                                        title="Clear USD prices"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch
                                        checked={data.price_usd_status}
                                        onCheckedChange={v => setData('price_usd_status', v)}
                                    />
                                </div>
                            </div>
                            {errors.price_usd && <p className="text-sm text-destructive mt-1">{errors.price_usd}</p>}
                            {errors.price_usd_ilustrative && <p className="text-sm text-destructive mt-1">{errors.price_usd_ilustrative}</p>}

                            {/* EUR */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <Euro className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">EUR</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput
                                            currency="EUR"
                                            initialValue={priceEurRaw}
                                            returnType="int"
                                            onValueChange={handleEurChange}
                                            placeholder="100"
                                            className={getInputClassName('price_eur')}
                                            data-currency="EUR"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput
                                            currency="EUR"
                                            initialValue={priceEurIlRaw}
                                            returnType="int"
                                            onValueChange={handleEurIlChange}
                                            placeholder="120"
                                            className={getInputClassName('price_eur_ilustrative')}
                                            data-currency="EUR_IL"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearEurPrices}
                                        className="h-6 w-6 p-0 mb-1"
                                        type="button"
                                        title="Clear EUR prices"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch
                                        checked={data.price_eur_status}
                                        onCheckedChange={v => setData('price_eur_status', v)}
                                    />
                                </div>
                            </div>
                            {errors.price_eur && <p className="text-sm text-destructive mt-1">{errors.price_eur}</p>}
                            {errors.price_eur_ilustrative && <p className="text-sm text-destructive mt-1">{errors.price_eur_ilustrative}</p>}

                            {/* AOA */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <CircleDollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">AOA/KZ</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput
                                            currency="AOA"
                                            initialValue={priceAoaRaw}
                                            returnType="int"
                                            onValueChange={handleAoaChange}
                                            placeholder="100"
                                            className={getInputClassName('price_aoa')}
                                            data-currency="AOA"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput
                                            currency="AOA"
                                            initialValue={priceAoaIlRaw}
                                            returnType="int"
                                            onValueChange={handleAoaIlChange}
                                            placeholder="120"
                                            className={getInputClassName('price_aoa_ilustrative')}
                                            data-currency="AOA_IL"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearAoaPrices}
                                        className="h-6 w-6 p-0 mb-1"
                                        type="button"
                                        title="Clear AOA prices"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch
                                        checked={data.price_aoa_status}
                                        onCheckedChange={v => setData('price_aoa_status', v)}
                                    />
                                </div>
                            </div>
                            {errors.price_aoa && <p className="text-sm text-destructive mt-1">{errors.price_aoa}</p>}
                            {errors.price_aoa_ilustrative && <p className="text-sm text-destructive mt-1">{errors.price_aoa_ilustrative}</p>}

                            {/* BRL */}
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-2 p-4 rounded-lg">
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                                    <span className="text-lg font-bold text-foreground dark:text-white">BRL</span>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Real Price">
                                        <CurrencyInput
                                            currency="BRL"
                                            initialValue={priceBrlRaw}
                                            returnType="int"
                                            onValueChange={handleBrlChange}
                                            placeholder="100"
                                            className={getInputClassName('price_brl')}
                                            data-currency="BRL"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col gap-1 w-40">
                                    <RequiredInput label="Illustrative">
                                        <CurrencyInput
                                            currency="BRL"
                                            initialValue={priceBrlIlRaw}
                                            returnType="int"
                                            onValueChange={handleBrlIlChange}
                                            placeholder="120"
                                            className={getInputClassName('price_brl_ilustrative')}
                                            data-currency="BRL_IL"
                                        />
                                    </RequiredInput>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearBrlPrices}
                                        className="h-6 w-6 p-0 mb-1"
                                        type="button"
                                        title="Clear BRL prices"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Label className="text-foreground dark:text-white">Active</Label>
                                    <Switch
                                        checked={data.price_brl_status}
                                        onCheckedChange={v => setData('price_brl_status', v)}
                                    />
                                </div>
                            </div>
                            {errors.price_brl && <p className="text-sm text-destructive mt-1">{errors.price_brl}</p>}
                            {errors.price_brl_ilustrative && <p className="text-sm text-destructive mt-1">{errors.price_brl_ilustrative}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            size="lg"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Save Room Type'}
                        </Button>
                    </div>
                </form>
            </div>
        </PanelLayout>
    );
}
