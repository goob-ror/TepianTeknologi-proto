import AppLayout from 'layouts/app/admin-app-sidebar-layout';
import { Head } from '@inertiajs/react';

export default function ViewCategories() {
    return (
        <AppLayout>
            <Head title="View Categories" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">View Categories</h1>
                <p>This is a placeholder page for viewing categories.</p>
            </div>
        </AppLayout>
    );
}
