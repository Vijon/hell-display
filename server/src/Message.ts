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

const _ = (text) => {
    let lines = text.split("\n");
    return lines[Math.floor(Math.random()*lines.length)];
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

const TEXT = {
    video: `Via che ti faccio partire un video.
    Un bel video partirà quando meno te lo aspetti.
    Video sicuramente pericoloso. Te l'ho mandato in play, sei contento?
    Una GIF, un minivideo, chissà.
    `,
    image: `Ti meriti proprio una bella immagine. Speriamo non sia roba da galera!
    In arrivo un'immagine
    Ahahaha un'immagine, chissà cos'è!
    Incoming image`,
    link: `Un link? Chissà cosa sarà!
    Ti apro un popup perché sì
    Link incoming`,
    audio: `Qualcuno ha parlato. Sarà sicuramente una cosa interessante.
    Chissà cosa dice il tuo amico`,
};
const fixURL = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    return url;
}
const parseURL = (url) => {
    let parser = urlParser.parse(url);
    if (parser && parser.mediaType == 'video') {
        // url from video portal
        return {
            text: _(TEXT.video),
            embed: urlParser.create({
                videoInfo: parser,
                format: 'embed',
                params: {
                    rel: 0,
                    autoplay: 1
                }
            })
        }
    }
    // is a link to an image
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        return {
            text: _(TEXT.image),
            image: url
        }
    }
    // is a facebook video [TODO: too raw!] 
    if (url.match(/https:\/\/www.facebook.com\/[^\/]*\/videos\/.*$/) != null) {
        return {
            text: _(TEXT.video),
            embed: `https://www.facebook.com/plugins/video.php?href=${url}&show_text=0&height=200&autoplay=1`
        }
    }
    // https://www.facebook.com/interestingengineering/videos/1805472102855819/?hc_ref=ARRptOneuxMq_OoZw2i3vmzJifu9Wbrl5ddjOhBb-BNWF-1PEQzfYsMEBuMxUXfeSYs
    return {
        url: fixURL(url),
        text: _(TEXT.link),
    }
}

export const parse = ( msg ): Promise<Message> => {
    //console.log(msg)
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
            const {  file_id } = msg.voice;
            let file = await getFile(file_id);
            result.audio = file;
            result.text = _(TEXT.audio);
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
            result.text = _(TEXT.image);
        }
        // is an video
        let video;
        if (msg.video_note) {
            video = msg.video_note;
        }
        if (msg.animation) {
            video = msg.animation;
        }
        if (msg.video) {
            video = msg.video;
        }
        if (video) {
            const { file_id } = video;
            let file = await getFile(file_id);
            result.video = file;
            result.text = _(TEXT.video);
        }
        resolve( result );
    });
}