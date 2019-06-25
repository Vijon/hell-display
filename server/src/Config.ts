import * as dotenv from "dotenv";
dotenv.config();

// load some environment config
const config = {
    host: process.env.HOST || 'localhost',
    port: {
        web: process.env.PORT_WEB || 3002,
        socket: process.env.PORT_SOCKET || 3001,
    },
    bot: process.env.TELEGRAM_BOT || '',
    ssl: {
        key: process.env.SSL_KEY || null,
        cert: process.env.SSL_CERT || null
    },
    push: {
        web: {
            mail: process.env.WEB_PUSH_MAIL || 'info@vijon.it',
            publicKey: process.env.WEB_PUSH_PUBLIC_VAPID_KEY || null,
            privateKey: process.env.WEB_PUSH_PRIVATE_VAPID_KEY || null
        }
    }
}
export default config;
