import Config from './Config';
import * as request from 'request';

interface Message {
    id: string;
    text: string;
    date: string;
    url?: string;
    audio?: string;
    image?: string;
}

const getFile = (file_id) => {
    return new Promise<string>( (resolve, reject) => {
        request(`https://api.telegram.org/bot${Config.bot}/getFile?file_id=${file_id}`, (err, response, body) => {
            if (err) reject(err);
            let data = JSON.parse(body);
            let url = `https://api.telegram.org/file/bot${Config.bot}/${data.result.file_path}`;
            response;
            resolve(url);
        });
    });
}

export const parse = ( msg ) => {
    return new Promise( async (resolve) => {
        const { message_id: id, text, date, entities } = msg;

        let result: Message;
        result = { id, text, date }
        console.log(msg)

        /** PARSING */

        // is a url?
        if (entities) {
            const urls = entities.filter( ({type}) => type == 'url' );
            if (urls.length) {
                result.url = text.substring( urls[0].offset, urls[0].length );
                result.text = `Un link?`;
            }
        }
        // is audio?
        if (msg.voice) {
            const { duration, file_id } = msg.voice;
            let file = await getFile(file_id);
            result.audio = file;
            result.text = `Qualcuno ha parlato per ${duration} secondi. Sarà sicuramente una cosa interessante.`;
        }
        // is photo?
        if (msg.photo) {
            var photo;
            msg.photo.forEach( (p) => {
                if (!photo || (p.width > photo.width)) {
                    photo = p;
                }
            })
            const { /*width, height,*/ file_id } = photo;
            let file = await getFile(file_id);
            result.image = file;
            result.text = `Ahahaha un'immagine, chissà cos'è!`;
        }
        resolve( result );
    });
}