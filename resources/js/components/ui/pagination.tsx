import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    current_page: number;
    data: unknown[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface PaginationProps {
    data: PaginationData;
    className?: string;
}

export function Pagination({ data, className = '' }: PaginationProps) {
    if (data.last_page <= 1) {
        return null;
    }

    const renderPageLink = (link: PaginationLink, index: number) => {
        // Handle previous button
        if (link.label.includes('Previous')) {
            return (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                    className="flex items-center gap-1"
                >
                    {link.url ? (
                        <Link href={link.url}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </>
                    )}
                </Button>
            );
        }

        // Handle next button
        if (link.label.includes('Next')) {
            return (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                    className="flex items-center gap-1"
                >
                    {link.url ? (
                        <Link href={link.url}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            );
        }

        // Handle ellipsis
        if (link.label === '...') {
            return (
                <Button key={index} variant="ghost" size="sm" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        }

        // Handle page numbers
        return (
            <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                size="sm"
                disabled={!link.url}
                asChild={!!link.url}
            >
                {link.url ? (
                    <Link href={link.url}>
                        {link.label}
                    </Link>
                ) : (
                    link.label
                )}
            </Button>
        );
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Results info */}
            <div className="text-sm text-gray-600">
                Showing {data.from} to {data.to} of {data.total} results
            </div>

            {/* Pagination links */}
            <div className="flex items-center gap-2">
                {data.links.map((link, index) => renderPageLink(link, index))}
            </div>
        </div>
    );
}
