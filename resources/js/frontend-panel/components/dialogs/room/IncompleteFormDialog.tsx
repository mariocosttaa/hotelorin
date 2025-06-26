import React from 'react';
import { Button } from '@/js/frontend-panel/components/ui/button';
import DefaultDialogTemplate from '@/js/frontend-panel/components/dialogs/DefaultDialogTemplate';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface IncompleteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onGoBack: () => void;
  missingFields: {
    names: boolean;
    descriptions: boolean;
    prices: boolean;
    capacity: boolean;
  };
}

export default function IncompleteFormDialog({
  open,
  onOpenChange,
  onContinue,
  onGoBack,
  missingFields,
}: IncompleteFormDialogProps) {
  const hasMissingFields = Object.values(missingFields).some(Boolean);
  const missingCount = Object.values(missingFields).filter(Boolean).length;

  const getMissingFieldsText = () => {
    const fields = [];
    if (missingFields.names) fields.push('room names');
    if (missingFields.descriptions) fields.push('room descriptions');
    if (missingFields.prices) fields.push('pricing information');
    if (missingFields.capacity) fields.push('capacity limits');

    if (fields.length === 1) return fields[0];
    if (fields.length === 2) return `${fields[0]} and ${fields[1]}`;
    if (fields.length === 3) return `${fields[0]}, ${fields[1]}, and ${fields[2]}`;
    return `${fields.slice(0, -1).join(', ')}, and ${fields[fields.length - 1]}`;
  };

  const getSeverityLevel = () => {
    if (missingCount >= 3) return 'high';
    if (missingCount >= 2) return 'medium';
    return 'low';
  };

  const severityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      title: 'Important Information Missing',
      description: 'Your room listing may not be as effective without complete information.',
    },
    medium: {
      icon: Info,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      title: 'Some Information Missing',
      description: 'Consider completing the missing information for better room presentation.',
    },
    low: {
      icon: CheckCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      title: 'Almost Complete!',
      description: 'Just a few details missing to make your room listing perfect.',
    },
  };

  const config = severityConfig[getSeverityLevel()];
  const IconComponent = config.icon;

  const missingRequiredGroups = [missingFields.names, missingFields.descriptions, missingFields.prices].filter(Boolean).length;

  let headerMessage = null;
  let headerColor = config.color;
  let headerBg = config.bgColor;
  let headerIcon = <IconComponent className={`h-6 w-6 ${config.color}`} />;

  if (missingRequiredGroups === 1) {
    // Only one required group is missing: use yellow/warning
    headerColor = 'text-yellow-600 dark:text-yellow-400';
    headerBg = 'bg-yellow-50 dark:bg-yellow-950/20';
    headerIcon = <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
    if (missingFields.names) {
      headerMessage = <div className="font-medium text-sm mb-1 text-yellow-700 dark:text-yellow-300">You must provide at least <b>one name</b> to continue.</div>;
    } else if (missingFields.descriptions) {
      headerMessage = <div className="font-medium text-sm mb-1 text-yellow-700 dark:text-yellow-300">You must provide at least <b>one description</b> to continue.</div>;
    } else if (missingFields.prices) {
      headerMessage = <div className="font-medium text-sm mb-1 text-yellow-700 dark:text-yellow-300">You must provide at least <b>one price</b> (in any currency) to continue.</div>;
    }
  } else if (missingRequiredGroups > 1) {
    // More than one required group is missing: use red/danger
    headerColor = 'text-red-600 dark:text-red-400';
    headerBg = 'bg-red-50 dark:bg-red-950/20';
    headerIcon = <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />;
    headerMessage = (
      <div className="font-medium text-sm mb-1 text-red-700 dark:text-red-300">
        You must provide at least <b>one name</b>, <b>one description</b>, and <b>one price</b> (in any currency) to continue.
      </div>
    );
  } else if (missingCount > 0) {
    // Only optional fields are missing
    headerMessage = (
      <div className={`font-medium text-sm mb-1 ${config.color}`}>
        Some optional information is missing. You can continue, but your listing will be more effective if you complete all fields.
      </div>
    );
  }

  const header = (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${headerBg}`}>
      {headerIcon}
      <div>{headerMessage}</div>
    </div>
  );

  const footer = (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button
        variant="outline"
        onClick={onGoBack}
        className="w-full sm:w-auto"
      >
        Go Back & Complete
      </Button>
      {!missingRequiredGroups && (
        <Button
          onClick={onContinue}
          className="w-full sm:w-auto"
        >
          Continue Anyway
        </Button>
      )}
    </div>
  );

  return (
    <DefaultDialogTemplate
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      description={config.description}
      widthClass="sm:max-w-[540px] w-full"
      header={header}
      footer={footer}
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-3">
            You're missing <strong>{missingCount}</strong> important piece{missingCount !== 1 ? 's' : ''} of information: <strong>{getMissingFieldsText()}</strong>.
          </p>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Why complete information matters:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span><strong>Better visibility:</strong> Complete listings appear higher in search results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span><strong>Guest confidence:</strong> Detailed information helps guests make informed decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span><strong>Professional appearance:</strong> Complete listings look more trustworthy and professional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span><strong>Reduced inquiries:</strong> Clear information reduces guest questions and saves time</span>
              </li>
            </ul>
          </div>
        </div>

        {missingFields.names && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Missing Room Names</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Add names in all languages to help guests find your room in their preferred language.
            </p>
          </div>
        )}

        {missingFields.descriptions && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Missing Descriptions</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Detailed descriptions help guests understand what makes your room special.
            </p>
          </div>
        )}

        {missingFields.prices && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Missing Pricing</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Set at least one currency price to enable bookings and show your room's value.
            </p>
          </div>
        )}

        {missingFields.capacity && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Missing Capacity</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Specify how many guests your room can accommodate to help with booking decisions.
            </p>
          </div>
        )}
      </div>
    </DefaultDialogTemplate>
  );
}
