import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/js/frontend-panel/components/ui/dialog';

interface DefaultDialogTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode; // required for accessibility
  description?: React.ReactNode;
  widthClass?: string; // e.g. 'sm:max-w-[500px]' or 'max-w-lg'
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function DefaultDialogTemplate({
  open,
  onOpenChange,
  title,
  description,
  widthClass = 'sm:max-w-[500px] w-full',
  header,
  children,
  footer,
  className = '',
}: DefaultDialogTemplateProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col ${widthClass} ${className}`}
        style={{ maxHeight: '90vh', minWidth: '320px' }}
      >
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {header && <DialogHeader>{header}</DialogHeader>}
        <div className="overflow-y-auto flex-1 px-1" style={{ maxHeight: '60vh' }}>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
