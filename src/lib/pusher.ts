import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Server Side Instance
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID || 'mock',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'mock',
    secret: process.env.PUSHER_SECRET || 'mock',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    useTLS: true
});

// Client Side Instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || 'mock', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    forceTLS: true
});
