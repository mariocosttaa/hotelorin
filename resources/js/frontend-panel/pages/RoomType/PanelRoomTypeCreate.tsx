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
import { Card, CardContent, CardHeader, CardTitle } from "@/js/frontend-panel/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/js/frontend-panel/components/ui/dialog";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useToast } from '@/js/shared/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../hooks/use-theme";
import { X, Plus } from "lucide-react";
import comodite from "@/js/shared/types/model/tenant/comodite";
import ComoditesShowModal from '@/js/frontend-panel/components/modals/comodites/ComoditesShowModal';

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
    });

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
