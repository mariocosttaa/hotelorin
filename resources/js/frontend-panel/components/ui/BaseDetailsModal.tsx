import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/js/frontend-panel/components/ui/dialog";
import { Button } from "@/js/frontend-panel/components/ui/button";
import { Badge } from "@/js/frontend-panel/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/js/frontend-panel/components/ui/alert-dialog";
import { Edit, Trash2, X } from "lucide-react";
import { Link } from '@inertiajs/react';
import { ReactNode } from "react";

interface BaseDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    badge?: string;
    closeable?: boolean;
    children: ReactNode;
    footerActions?: {
        edit?: {
            href?: string;
            onClick?: () => void;
            label?: string;
        };
        delete?: {
            onDelete: () => void;
            isDeleting?: boolean;
            label?: string;
            confirmTitle?: string;
            confirmDescription?: string;
        };
        custom?: ReactNode;
    };
}

export default function BaseDetailsModal({
    open,
    onOpenChange,
    title,
    description,
    badge,
    closeable = true,
    children,
    footerActions
}: BaseDetailsModalProps) {
    const handleDelete = () => {
        if (footerActions?.delete?.onDelete) {
            footerActions.delete.onDelete();
            // Close the modal after delete
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={closeable ? onOpenChange : undefined}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>{title}</span>
                        {badge && (
                            <Badge variant="secondary">{badge}</Badge>
                        )}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {children}
                </div>

                {/* Footer Actions */}
                {(footerActions?.edit || footerActions?.delete || footerActions?.custom) && (
                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                        {footerActions.custom}

                        {footerActions.edit && (
                            footerActions.edit.href ? (
                                <Button variant="default" asChild>
                                    <Link href={footerActions.edit.href}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {footerActions.edit.label || 'Edit'}
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    onClick={footerActions.edit.onClick}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {footerActions.edit.label || 'Edit'}
                                </Button>
                            )
                        )}

                        {footerActions.delete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={footerActions.delete.isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {footerActions.delete.isDeleting ? 'Deleting...' : (footerActions.delete.label || 'Delete')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {footerActions.delete.confirmTitle || 'Delete Item'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {footerActions.delete.confirmDescription || 'Are you sure you want to delete this item? This action cannot be undone.'}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            disabled={footerActions.delete.isDeleting}
                                        >
                                            {footerActions.delete.isDeleting ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {closeable && (
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Close
                            </Button>
                        )}
                    </div>
                )}

                {/* Close button if no footer actions */}
                {closeable && !footerActions && (
                    <div className="flex justify-end pt-4 border-t mt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
