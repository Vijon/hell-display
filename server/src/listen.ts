import * as TelegramBot from "node-telegram-bot-api";

import Config from './Config';
import * as Web from './Web';
import * as Notification from './Notification';
import * as Users from './Users';
import * as Message from './Message';


/*** BOT */
// create bot client
const bot = new TelegramBot(Config.bot, { polling: true } );
bot.on('message', async (msg) => {
    const { id, first_name: name } = msg.chat;
    let user = await Users.save( { id, name } );
    let message = await Message.parse( msg );
    await Web.broadcast( message, user );
    await Notification.broadcast( {
        title: 'Hell Display',
        body: message.text,
        image: message.image || null,
        icon: 'https://hell.vijon.it/favicon/favicon-96x96.png',
        badge: 'https://hell.vijon.it/favicon/android-icon-36x36.png',
    })
});

/*** WEBSERVER */
Web.start( Config );
Notification.start( Config );