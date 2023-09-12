import { createClient } from '@sanity/client';

if (typeof import.meta.env.PUBLIC_SANITY_API_CLIENT_TOKEN !== 'string') {
    throw new Error('SANITY_API_CLIENT_TOKEN is not set');
}

export const readOnlySanityClient = createClient({
    projectId: 'l2awlkjo',
    dataset: 'production',
    apiVersion: '2023-02-08',
    useCdn: false,
    token: import.meta.env.PUBLIC_SANITY_API_CLIENT_TOKEN,
});

export interface Event {
    _id: string;
    name: string;
    href: string;
    date: string | Date;
    type: string; // "Workshop" | "Tour" | "Experience"
    from?: string; // Date string
    to?: string; // Date string
}
