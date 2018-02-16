import Config from './Config';
import * as request from 'request';
import * as urlParser from "js-video-url-parser";


interface Message {
    id: string;
    text: string;
    date: string;
    url?: string;
    audio?: string;
    image?: string;
    video?: string;
    embed?: string;
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

const parseURL = (url) => {
    let parser = urlParser.parse(url);
    if (parser && parser.mediaType == 'video') {
        // url from video portal
        return {
            text: 'Via che ti faccio partire un video.',
            embed: urlParser.create({
                videoInfo: parser,
                format: 'embed',
                params: {
                    autoplay: true
                }
            })
        }
    }
    // is a link to an image
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        return {
            text: 'Ti meriti proprio una bella immagine. Speriamo non sia roba da galera!',
            image: url
        }
    }
    return {
        url: url,
        text: 'Un link? Chissà cosa sarà!'
    }
}

export const parse = ( msg ) => {
    return new Promise( async (resolve) => {
        const { message_id: id, text, date, entities } = msg;

        let result: Message;
        result = { id, text, date };

        /** PARSING */

        // is a url?
        if (entities) {
            const urls = entities.filter( ({type}) => type == 'url' );
            if (urls.length) {
                let url = text.substring( urls[0].offset, urls[0].length );
                result = Object.assign( {}, result, parseURL(url) );
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
        // is an video
        if (msg.video_note) {
            const { duration, file_id } = msg.video_note;
            let file = await getFile(file_id);
            result.video = file;
            result.text = `Video sicuramente pericoloso di ${duration} secondi. Te l'ho mandato in play, sei contento?`;
        }
        resolve( result );
    });
}