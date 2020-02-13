import * as webpush from 'web-push';
import * as fs from 'fs';
import * as path from 'path';

import * as Web from './Web'; 

interface Notification {
    title: string;
    body: string;
    icon: string;
    badge: string;
    image: string | null;
}

var server;
export const start = ( config ) => {

    webpush.setVapidDetails(`mailto:${config.push.web.mail}`, config.push.web.publicKey, config.push.web.privateKey);
    
    server = Web.createServer(config);
    server.listen(config.port.web);
    console.log(`notification webhook listening on ${config.port.web}`);
    
    server.on('request', function (req, res) {
        req;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
    });

    server.on('request', function (req, res) {
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data){body += data;});
            req.on('end', function () {
                save( JSON.parse(body) );
                res.end();
            });
        } else if (req.method === 'DELETE') {
            var body = '';
            req.on('data', function (data){body += data;});
            req.on('end', function () {
                remove( JSON.parse(body) );
                res.end();
            });
        } else {  res.end(); }
    });
    
}

const fileRoot = path.resolve(process.cwd(), 'public');
const file = path.join(fileRoot, 'webpush.txt');
var subscriptions: any[] = [];

var loaded = false;

export const load = () => {
    return new Promise( resolve => {
        if (fs.existsSync(file)) {
            let json = fs.readFileSync( file, {
                encoding: 'utf8',
                flag: 'r+'
            } );
            subscriptions = JSON.parse(json);
        }
        loaded = true;
        resolve();
    });
}
export const save = (subscription: any) => {
    return new Promise( async resolve => {
        if (!loaded) await load();
        if (subscriptions.filter( (s) => (s.keys.auth === subscription.keys.auth) ).length === 0) { // already exists
            subscriptions.push( subscription );
            saveFile();
        }
        resolve(subscription);
    });
}
export const remove = (subscription: any) => {
    return new Promise( async resolve => {
        if (!loaded) await load();
        if (true) {
            subscriptions = subscriptions.filter( (s) => (s.keys.auth !== subscription.keys.auth) );
            saveFile();
        }
        resolve(subscription);
    });
}

function saveFile() {
    fs.writeFileSync( file, JSON.stringify(subscriptions), {
        mode: 0o777,
        flag: 'w+'
    });
}

export const broadcast = async (notification: Notification) => {
    if (!loaded) await load();
    subscriptions.forEach( subscription => {
        const payload = JSON.stringify(notification);
        webpush.sendNotification(subscription, payload).catch( () => {} )/*.catch(error => {
            console.error(error.stack);
        });*/
    })
}