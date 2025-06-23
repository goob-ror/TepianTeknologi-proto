import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';



createInertiaApp({
    title: (title) => `${title} Tepian Teknologi`,
    resolve: (name) => {
        const fixedName = name.replace(/^Admin\//, 'admin/');
        return resolvePageComponent(`./pages/${fixedName}.tsx`, import.meta.glob('./pages/**/*.tsx'));
      },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
