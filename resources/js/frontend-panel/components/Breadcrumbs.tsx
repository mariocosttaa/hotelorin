import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  title?: string;
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ title, items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      )}
      <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex items-center">
              {item.href && !item.active ? (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className={item.active ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
