import * as dotenv from "dotenv";
dotenv.config();

// load some environment config
const config = {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3001,
    bot: process.env.TELEGRAM_BOT || '',
}
export default config;
