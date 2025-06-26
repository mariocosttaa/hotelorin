import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/js/frontend-panel/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/js/frontend-panel/components/ui/card';
import { Checkbox } from '@/js/frontend-panel/components/ui/checkbox';
import { Button } from '@/js/frontend-panel/components/ui/button';
import { X } from 'lucide-react';

interface Comodite {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

interface ComoditesShowModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    comodites: Comodite[];
    selectedComodites: string[];
    onToggle: (comoditeId: string) => void;
    onDone: () => void;
}

export default function ComoditesShowModal({ open, onOpenChange, comodites, selectedComodites, onToggle, onDone }: ComoditesShowModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background text-foreground dark:bg-[#18181b] dark:text-white">
                <DialogHeader>
                    <DialogTitle>Select Amenities</DialogTitle>
                    <DialogDescription>Select amenities for the room or room type</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {comodites.map((comodite) => {
                        const isSelected = selectedComodites.includes(comodite.id);
                        return (
                            <Card
                                key={comodite.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    isSelected ? 'border-primary bg-primary/5' : 'hover:border-border'
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggle(comodite.id);
                                }}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onToggle(comodite.id);
                                            }}
                                            className="flex-shrink-0"
                                        />
                                        <div
                                            className="w-8 h-8 flex items-center justify-center"
                                            dangerouslySetInnerHTML={{ __html: comodite.icon || '' }}
                                        />
                                        <CardTitle className="text-base">{comodite.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground">
                                        {comodite.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={onDone}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
