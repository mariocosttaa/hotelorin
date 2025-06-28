import RoomImportModal from '@/js/frontend-panel/components/modals/room/RoomImportModal';
import IncompleteFormDialog from '@/js/frontend-panel/components/dialogs/room/IncompleteFormDialog';
import { Button } from '@/js/frontend-panel/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/js/frontend-panel/components/ui/card';
import { FileUpload } from '@/js/frontend-panel/components/ui/file-upload';
import { Input } from '@/js/frontend-panel/components/ui/input';
import { Label } from '@/js/frontend-panel/components/ui/label';
import { Switch } from '@/js/frontend-panel/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/js/frontend-panel/components/ui/tabs';
import { Textarea } from '@/js/frontend-panel/components/ui/textarea';
import { routeLang } from '@/js/shared/helpers/routeLang';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import RoomType from '@/js/shared/types/model/tenant/roomType';
import { usePage, useForm } from '@inertiajs/react';
import { CircleDollarSign, Coins, DollarSign, Download, Euro, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import PanelLayout from '../../layout/PanelLayout';
import ComoditesShowModal from '@/js/frontend-panel/components/modals/comodites/ComoditesShowModal';
import React from 'react';
import { useToast } from '@/js/shared/hooks/useToast';
import { useTheme } from '../../hooks/use-theme';
import { CurrencyInput } from '@/js/shared/components/form/CurrencyInput';
import RequiredInput from '@/js/frontend-panel/components/ui/form/RequiredInput';

interface PanelRoomCreateProps {
    roomTypes: RoomType[];
    comodites: { id: string; name: string; description?: string; icon?: string }[];
    defaultLanguage: string;
}

export default function PanelRoomCreate({ roomTypes, comodites = [], defaultLanguage = 'pt' }: PanelRoomCreateProps) {
    const { tenantId } = usePage<InertiaMiddlewareProps>().props;
    const storeUrl = routeLang('panel-room-store', { tenantId });
    const toast = useToast();
    const { theme } = useTheme();
    const [galleryFiles, setGalleryFiles] = useState<(File | { src: string; imported: true; id?: string; type?: string })[]>([]);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [selectedComodites, setSelectedComodites] = useState<string[]>([]);
    const [comoditeModalOpen, setComoditeModalOpen] = useState(false);
    const [incompleteFormDialogOpen, setIncompleteFormDialogOpen] = useState(false);

    // Form state for names/descriptions
    const [names, setNames] = useState({ pt: '', en: '', es: '', fr: '' });
    const [descriptions, setDescriptions] = useState({ pt: '', en: '', es: '', fr: '' });
    const [roomNumber, setRoomNumber] = useState('');
    const [maxAdults, setMaxAdults] = useState('');
    const [maxChildren, setMaxChildren] = useState('');
    const [maxInfants, setMaxInfants] = useState('');
    const [maxPets, setMaxPets] = useState('');

    const { data, setData, post, processing, errors: rawErrors } = useForm<{
        room_type_id: string;
        number: number | string;
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
        gallery: (File | { src: string; imported: true; id?: string; type?: string })[];
        gallery_imported: string[];
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
    }>({
        room_type_id: '',
        number: '',
        overview_name_pt: '',
        overview_name_en: '',
        overview_name_es: '',
        overview_name_fr: '',
        overview_description_pt: '',
        overview_description_en: '',
        overview_description_es: '',
        overview_description_fr: '',
        max_adults: '',
        max_children: '',
        max_infants: '',
        max_pets: '',
        gallery: [],
        gallery_imported: [],
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
    const errors = rawErrors as Record<string, string>;

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

    // Sync local state to form data
    React.useEffect(() => {
        setData('room_type_id', data.room_type_id);
        setData('number', roomNumber ? parseInt(roomNumber) : '');
        setData('overview_name_pt', names.pt);
        setData('overview_name_en', names.en);
        setData('overview_name_es', names.es);
        setData('overview_name_fr', names.fr);
        setData('overview_description_pt', descriptions.pt);
        setData('overview_description_en', descriptions.en);
        setData('overview_description_es', descriptions.es);
        setData('overview_description_fr', descriptions.fr);
        setData('max_adults', maxAdults);
        setData('max_children', maxChildren);
        setData('max_infants', maxInfants);
        setData('max_pets', maxPets);
        setData('gallery', galleryFiles.filter(f => f instanceof File) as File[]);
        setData('gallery_imported', galleryFiles.filter(f => !(f instanceof File)).map(f => (f as any).src) as string[]);
        setData('comodites', selectedComodites as string[]);
    }, [names, descriptions, roomNumber, maxAdults, maxChildren, maxInfants, maxPets, galleryFiles, selectedComodites, setData]);

    const getInputClassName = (fieldName: string) => {
        const hasError = errors[fieldName];
        const baseClasses = "w-full";
        if (hasError) {
            return `${baseClasses} border-destructive focus:border-destructive focus:ring-destructive`;
        }
        return baseClasses;
    };

    // Check for incomplete form fields
    const checkIncompleteFields = () => {
        const hasRoomType = data.room_type_id && data.room_type_id.trim() !== '';
        const hasRoomNumber = roomNumber && roomNumber.trim() !== '';
        const hasNames = Object.values(names).some(name => name.trim() !== '');
        const hasDescriptions = Object.values(descriptions).some(desc => desc.trim() !== '');
        const hasPrices = [
            data.price_usd, data.price_usd_ilustrative,
            data.price_eur, data.price_eur_ilustrative,
            data.price_aoa, data.price_aoa_ilustrative,
            data.price_brl, data.price_brl_ilustrative
        ].some(price => price && price.trim() !== '');
        const hasCapacity = [maxAdults, maxChildren, maxInfants, maxPets].some(cap => cap && cap.trim() !== '');

        return {
            number: !hasRoomNumber,
            names: !hasRoomType && !hasNames,
            descriptions: !hasRoomType && !hasDescriptions,
            prices: !hasPrices,
            capacity: !hasCapacity
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const missingFields = checkIncompleteFields();
        const hasMissingFields = Object.values(missingFields).some(Boolean);

        if (hasMissingFields) {
            setIncompleteFormDialogOpen(true);
            return;
        }

        submitForm();
    };

    const submitForm = () => {
        post(storeUrl, {
            preserveScroll: true,
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    if (errors[key]) {
                        toast.error(errors[key], theme === 'dark', 10000);
                    }
                });
            },
            onSuccess: () => {
                toast.success('Room created successfully!', theme === 'dark');
            }
        });
    };

    const handleContinueAnyway = () => {
        setIncompleteFormDialogOpen(false);
        submitForm();
    };

    const handleGoBackAndComplete = () => {
        setIncompleteFormDialogOpen(false);
        // Focus on the first missing field
        const missingFields = checkIncompleteFields();
        if (missingFields.number) {
            // Focus on room number input
            const numberInput = document.getElementById('room_number');
            if (numberInput) numberInput.focus();
        } else if (missingFields.names) {
            // Focus on first name input - use default language
            const nameInput = document.getElementById(`name_${defaultLanguage}`);
            if (nameInput) nameInput.focus();
        } else if (missingFields.descriptions) {
            // Focus on first description input - use default language
            const descInput = document.getElementById(`desc_${defaultLanguage}`);
            if (descInput) descInput.focus();
        } else if (missingFields.capacity) {
            // Focus on max adults input
            const capacityInput = document.getElementById('max_adults');
            if (capacityInput) capacityInput.focus();
        } else if (missingFields.prices) {
            // Focus on first price input
            const priceInput = document.querySelector('[data-currency="USD"]') as HTMLElement;
            if (priceInput) priceInput.focus();
        }
    };

    const handleImportRoomType = (roomType: RoomType) => {
        setGalleryLoading(true);
        setTimeout(() => {
            setGalleryLoading(false);
        }, 1000);

        setNames({
            pt: roomType.name_pt || '',
            en: roomType.name_en || '',
            es: roomType.name_es || '',
            fr: roomType.name_fr || '',
        });

        setDescriptions({
            pt: roomType.description_pt || '',
            en: roomType.description_en || '',
            es: roomType.description_es || '',
            fr: roomType.description_fr || '',
        });

        // Set the imported RoomType ID in the form state
        setData('room_type_id', roomType.id);

        // Set default capacity limits since RoomType doesn't have these properties
        setMaxAdults('2');
        setMaxChildren('2');
        setMaxInfants('1');
        setMaxPets('0');

        // Set a default room number (can be changed by user)
        setRoomNumber('');

        // Import prices from roomType.prices
        if (roomType.prices && Array.isArray(roomType.prices)) {
            // Filter only type-specific prices that can be inherited
            const typePrices = roomType.prices.filter(p => p.use_type_price_in_room);

            // Set USD prices
            const usdPrice = typePrices.find(p => p.currency_code === 'usd');
            if (usdPrice) {
                setData('price_usd', usdPrice.price?.toString() || '');
                setData('price_usd_ilustrative', usdPrice.price_ilustrative?.toString() || '');
                setData('price_usd_status', usdPrice.status || false);
            } else {
                setData('price_usd', '');
                setData('price_usd_ilustrative', '');
                setData('price_usd_status', false);
            }

            // Set EUR prices
            const eurPrice = typePrices.find(p => p.currency_code === 'eur');
            if (eurPrice) {
                setData('price_eur', eurPrice.price?.toString() || '');
                setData('price_eur_ilustrative', eurPrice.price_ilustrative?.toString() || '');
                setData('price_eur_status', eurPrice.status || false);
            } else {
                setData('price_eur', '');
                setData('price_eur_ilustrative', '');
                setData('price_eur_status', false);
            }

            // Set AOA prices
            const aoaPrice = typePrices.find(p => p.currency_code === 'aoa');
            if (aoaPrice) {
                setData('price_aoa', aoaPrice.price?.toString() || '');
                setData('price_aoa_ilustrative', aoaPrice.price_ilustrative?.toString() || '');
                setData('price_aoa_status', aoaPrice.status || false);
            } else {
                setData('price_aoa', '');
                setData('price_aoa_ilustrative', '');
                setData('price_aoa_status', false);
            }

            // Set BRL prices
            const brlPrice = typePrices.find(p => p.currency_code === 'brl');
            if (brlPrice) {
                setData('price_brl', brlPrice.price?.toString() || '');
                setData('price_brl_ilustrative', brlPrice.price_ilustrative?.toString() || '');
                setData('price_brl_status', brlPrice.status || false);
            } else {
                setData('price_brl', '');
                setData('price_brl_ilustrative', '');
                setData('price_brl_status', false);
            }
        } else {
            // Reset prices to defaults if no prices found
            setData('price_usd', '');
            setData('price_usd_ilustrative', '');
            setData('price_usd_status', false);
            setData('price_eur', '');
            setData('price_eur_ilustrative', '');
            setData('price_eur_status', false);
            setData('price_aoa', '');
            setData('price_aoa_ilustrative', '');
            setData('price_aoa_status', false);
            setData('price_brl', '');
            setData('price_brl_ilustrative', '');
            setData('price_brl_status', false);
        }

        setSelectedRoomType(roomType);

        // Import images from roomType.galleries (array of {src, id, type})
        if (roomType.galleries && Array.isArray(roomType.galleries)) {
            // Filter only type-specific galleries that can be inherited
            const typeGalleries = roomType.galleries.filter(g => g.use_type_gallery_in_room);
            setGalleryFiles(typeGalleries.map(g => ({ src: g.src, imported: true, id: g.id?.toString(), type: g.type })));
        } else {
            setGalleryFiles([]);
        }

        // Import comodites from roomType
        if (roomType.comodites && Array.isArray(roomType.comodites)) {
            // Filter only type-specific comodites that can be inherited
            const typeComodites = roomType.comodites.filter(rc => rc.use_type_comodites_in_room);
            setSelectedComodites(typeComodites.map(rc => rc.comodite?.id).filter((id): id is string => Boolean(id)));
        } else {
            setSelectedComodites([]);
        }
    };

    const handleRemoveImportedType = () => {
        setSelectedRoomType(null);
        setNames({ pt: '', en: '', es: '', fr: '' });
        setDescriptions({ pt: '', en: '', es: '', fr: '' });
        setRoomNumber('');
        setMaxAdults('');
        setMaxChildren('');
        setMaxInfants('');
        setMaxPets('');
        setData('price_usd', '');
        setData('price_usd_ilustrative', '');
        setData('price_usd_status', false);
        setData('price_eur', '');
        setData('price_eur_ilustrative', '');
        setData('price_eur_status', false);
        setData('price_aoa', '');
        setData('price_aoa_ilustrative', '');
        setData('price_aoa_status', false);
        setData('price_brl', '');
        setData('price_brl_ilustrative', '');
        setData('price_brl_status', false);
        setGalleryFiles([]);
        setSelectedComodites([]);
        // Clear room_type_id from the form state
        setData('room_type_id', '');
    };

    // Modal for selecting comodites
    const handleComoditeToggle = (id: string) => {
        setSelectedComodites((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    return (
        <PanelLayout
            title="Create Room"
            activePage={tenantId ? routeLang('panel-room-create', { tenantId: tenantId }) : ''}
            breadcrumbs={[
                { label: 'Dashboard', href: tenantId ? routeLang('panel-dashboard', { tenantId: tenantId }) : '#' },
                { label: 'Rooms', href: tenantId ? routeLang('panel-room-index', { tenantId: tenantId }) : '#' },
                { label: 'Create Room', active: true },
            ]}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                {/* Main Form Card */}
                <form onSubmit={handleSubmit}>
                <Card className="overflow-visible">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">New Room Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-8 md:flex-row">
                            {/* Left Sidebar: Gallery & Status */}
                            <div className="flex w-full flex-col gap-8 md:w-1/3">
                                <FileUpload
                                    files={galleryFiles}
                                    onFilesChange={setGalleryFiles}
                                    maxFiles={10}
                                    acceptedExtensions={['image/*', 'video/*']}
                                    maxFileSize={5}
                                    label="Gallery"
                                    loading={galleryLoading}
                                    showPreview={true}
                                    previewSize="md"
                                />
                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <Label htmlFor="status" className="text-base">
                                        Active
                                    </Label>
                                    <Switch id="status" />
                                </div>
                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <Button variant="outline" onClick={() => setComoditeModalOpen(true)} type="button">
                                        Select Amenities
                                    </Button>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {comodites.filter(c => selectedComodites.includes(c.id)).map(c => (
                                            <span key={c.id} className="px-2 py-1 text-xs rounded bg-muted">{c.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Right Main Form */}
                            <div className="flex w-full flex-col gap-8 md:w-2/3">
                                <div className="mb-2 flex flex-col items-end justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="min-w-[160px] gap-2"
                                        onClick={() => setImportModalOpen(true)}
                                        disabled={roomTypes.length === 0}
                                        type="button"
                                    >
                                        <Download className="h-4 w-4" />
                                        Import from Room Type
                                        {roomTypes.length > 0 && (
                                            <span className="ml-1 rounded bg-muted px-2 py-0.5 text-xs">{roomTypes.length}</span>
                                        )}
                                    </Button>
                                    {selectedRoomType && (
                                        <div className="mt-1 flex items-center gap-2 rounded bg-muted px-3 py-1 text-sm">
                                            <span className="font-medium">{selectedRoomType.name}</span>
                                            <Button size="icon" variant="ghost" onClick={handleRemoveImportedType} className="h-6 w-6 p-0" type="button">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </Button>
                                        </div>
                                    )}
                                    <RoomImportModal
                                        open={importModalOpen}
                                        onOpenChange={setImportModalOpen}
                                        roomTypes={roomTypes}
                                        onSelect={handleImportRoomType}
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="mb-2 text-lg font-semibold flex items-center">Room Details <span className="text-red-600 ml-1">*</span></div>
                                    <div className="mb-4">
                                        <RequiredInput label="Room Number" required htmlFor="room_number">
                                            <Input
                                                id="room_number"
                                                type="number"
                                                min="1"
                                                placeholder="e.g., 101, 201, 301"
                                                value={roomNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Only allow positive integers
                                                    if (value === '' || /^\d+$/.test(value)) {
                                                        setRoomNumber(value);
                                                    }
                                                }}
                                                className={getInputClassName('number')}
                                            />
                                        </RequiredInput>
                                        {errors.number && (<p className="text-sm text-destructive mt-1">{errors.number}</p>)}
                                    </div>
                                    <Tabs defaultValue="pt" className="w-full">
                                        <TabsList className="mb-2">
                                            <TabsTrigger value="pt">Portuguese</TabsTrigger>
                                            <TabsTrigger value="en">English</TabsTrigger>
                                            <TabsTrigger value="es">Spanish</TabsTrigger>
                                            <TabsTrigger value="fr">French</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="pt">
                                            <div className="grid grid-cols-1 gap-4">
                                                <RequiredInput label="Name" htmlFor="name_pt">
                                                    <Input
                                                        id="name_pt"
                                                        placeholder="Room name (PT)"
                                                        value={names.pt}
                                                        onChange={(e) => setNames((n) => ({ ...n, pt: e.target.value }))}
                                                        className={getInputClassName('overview_name_pt')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_name_pt && (<p className="text-sm text-destructive mt-1">{errors.overview_name_pt}</p>)}
                                                <RequiredInput label="Description" htmlFor="desc_pt">
                                                    <Textarea
                                                        id="desc_pt"
                                                        placeholder="Room description (PT)"
                                                        value={descriptions.pt}
                                                        onChange={(e) => setDescriptions((d) => ({ ...d, pt: e.target.value }))}
                                                        className={getInputClassName('overview_description_pt')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_description_pt && (<p className="text-sm text-destructive mt-1">{errors.overview_description_pt}</p>)}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="en">
                                            <div className="grid grid-cols-1 gap-4">
                                                <RequiredInput label="Name" htmlFor="name_en">
                                                    <Input
                                                        id="name_en"
                                                        placeholder="Room name (EN)"
                                                        value={names.en}
                                                        onChange={(e) => setNames((n) => ({ ...n, en: e.target.value }))}
                                                        className={getInputClassName('overview_name_en')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_name_en && (<p className="text-sm text-destructive mt-1">{errors.overview_name_en}</p>)}
                                                <RequiredInput label="Description" htmlFor="desc_en">
                                                    <Textarea
                                                        id="desc_en"
                                                        placeholder="Room description (EN)"
                                                        value={descriptions.en}
                                                        onChange={(e) => setDescriptions((d) => ({ ...d, en: e.target.value }))}
                                                        className={getInputClassName('overview_description_en')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_description_en && (<p className="text-sm text-destructive mt-1">{errors.overview_description_en}</p>)}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="es">
                                            <div className="grid grid-cols-1 gap-4">
                                                <RequiredInput label="Name" htmlFor="name_es">
                                                    <Input
                                                        id="name_es"
                                                        placeholder="Room name (ES)"
                                                        value={names.es}
                                                        onChange={(e) => setNames((n) => ({ ...n, es: e.target.value }))}
                                                        className={getInputClassName('overview_name_es')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_name_es && (<p className="text-sm text-destructive mt-1">{errors.overview_name_es}</p>)}
                                                <RequiredInput label="Description" htmlFor="desc_es">
                                                    <Textarea
                                                        id="desc_es"
                                                        placeholder="Room description (ES)"
                                                        value={descriptions.es}
                                                        onChange={(e) => setDescriptions((d) => ({ ...d, es: e.target.value }))}
                                                        className={getInputClassName('overview_description_es')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_description_es && (<p className="text-sm text-destructive mt-1">{errors.overview_description_es}</p>)}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="fr">
                                            <div className="grid grid-cols-1 gap-4">
                                                <RequiredInput label="Name" htmlFor="name_fr">
                                                    <Input
                                                        id="name_fr"
                                                        placeholder="Room name (FR)"
                                                        value={names.fr}
                                                        onChange={(e) => setNames((n) => ({ ...n, fr: e.target.value }))}
                                                        className={getInputClassName('overview_name_fr')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_name_fr && (<p className="text-sm text-destructive mt-1">{errors.overview_name_fr}</p>)}
                                                <RequiredInput label="Description" htmlFor="desc_fr">
                                                    <Textarea
                                                        id="desc_fr"
                                                        placeholder="Room description (FR)"
                                                        value={descriptions.fr}
                                                        onChange={(e) => setDescriptions((d) => ({ ...d, fr: e.target.value }))}
                                                        className={getInputClassName('overview_description_fr')}
                                                    />
                                                </RequiredInput>
                                                {errors.overview_description_fr && (<p className="text-sm text-destructive mt-1">{errors.overview_description_fr}</p>)}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <RequiredInput label="Max Adults" required htmlFor="max_adults">
                                                <Input
                                                    id="max_adults"
                                                    type="number"
                                                    placeholder="2"
                                                    value={maxAdults}
                                                    onChange={(e) => setMaxAdults(e.target.value)}
                                                    className={getInputClassName('max_adults')}
                                                />
                                            </RequiredInput>
                                            {errors.max_adults && (<p className="text-sm text-destructive mt-1">{errors.max_adults}</p>)}
                                        </div>
                                        <div>
                                            <RequiredInput label="Max Children" required htmlFor="max_children">
                                                <Input
                                                    id="max_children"
                                                    type="number"
                                                    placeholder="2"
                                                    value={maxChildren}
                                                    onChange={(e) => setMaxChildren(e.target.value)}
                                                    className={getInputClassName('max_children')}
                                                />
                                            </RequiredInput>
                                            {errors.max_children && (<p className="text-sm text-destructive mt-1">{errors.max_children}</p>)}
                                        </div>
                                        <div>
                                            <RequiredInput label="Max Infants" required htmlFor="max_infants">
                                                <Input
                                                    id="max_infants"
                                                    type="number"
                                                    placeholder="1"
                                                    value={maxInfants}
                                                    onChange={(e) => setMaxInfants(e.target.value)}
                                                    className={getInputClassName('max_infants')}
                                                />
                                            </RequiredInput>
                                            {errors.max_infants && (<p className="text-sm text-destructive mt-1">{errors.max_infants}</p>)}
                                        </div>
                                        <div>
                                            <RequiredInput label="Max Pets" required htmlFor="max_pets">
                                                <Input
                                                    id="max_pets"
                                                    type="number"
                                                    placeholder="0"
                                                    value={maxPets}
                                                    onChange={(e) => setMaxPets(e.target.value)}
                                                    className={getInputClassName('max_pets')}
                                                />
                                            </RequiredInput>
                                            {errors.max_pets && (<p className="text-sm text-destructive mt-1">{errors.max_pets}</p>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Move the price card section here, outside the grid, so it spans full width */}
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
                                {/* Actions at the end */}
                                <div className="mt-8 flex justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                                    <Button variant="default" size="lg" className="flex items-center gap-2" type="submit" disabled={processing}>
                                        <Plus className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Room'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                </form>
                {/* Comodite Selection Modal */}
                <ComoditesShowModal
                    open={comoditeModalOpen}
                    onOpenChange={setComoditeModalOpen}
                    comodites={comodites}
                    selectedComodites={selectedComodites}
                    onToggle={handleComoditeToggle}
                    onDone={() => setComoditeModalOpen(false)}
                />
                {/* Incomplete Form Dialog */}
                <IncompleteFormDialog
                    open={incompleteFormDialogOpen}
                    onOpenChange={setIncompleteFormDialogOpen}
                    onContinue={handleContinueAnyway}
                    onGoBack={handleGoBackAndComplete}
                    missingFields={checkIncompleteFields()}
                />
            </div>
        </PanelLayout>
    );
}
