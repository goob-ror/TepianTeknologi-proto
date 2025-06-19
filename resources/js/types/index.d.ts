import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavSubItem {
    title: string;
    href: string;
    isActive?: boolean; // Optional: if you want to highlight active sub-items
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    dropdown?: NavSubItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name?: string; // Made optional for safety, populated by accessor
    nama_lengkap?: string; // Database field
    email: string;
    no_hp?: string; // Phone number field
    avatar?: string;
    role: 'admin' | 'user'; // User role from enum
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    nama_kategori: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface Brand {
    id: number;
    nama_brand: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    nama_produk: string;
    deskripsi?: string;
    harga: string;
    stok: number;
    gambar?: string;
    kategori_id: number;
    brand_id: number;
    is_active: boolean;
    is_diskon?: boolean;
    harga_diskon?: string;
    diskon_persen?: number;
    created_at: string;
    updated_at: string;
    category?: Category;
    brand?: Brand;
}
