import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import Currency from './model/currency';
import { User } from './model/user';
import { Tenant } from './model/Tenants';
import Rank from './model/tenant/rank';
import Sector from './model/tenant/sector';

export interface Auth {
    user: User;
    rank: Rank;
    sector: Sector;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface InertiaMiddlewareProps {
    tenantId?: string;
    tenant: Tenant;
    locale: string;
    currencies: Array<Currency>;
    default_currency: string;
    default_currency_id: string;
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
