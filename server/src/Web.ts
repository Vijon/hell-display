import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as Socket from "socket.io";
import * as Rx from "rxjs";

var server, io, stream, spreaded;
var users = 0;

export const createServer = ( config ) => {
    if (config.ssl.key) {
        const options = {
            key: fs.readFileSync(config.ssl.key),
            cert: fs.readFileSync(config.ssl.cert)
        };
        server = https.createServer(options);
    } else {
        server = http.createServer();
    }
    return server;
}

export const start = ( config ) => {
    server = createServer( config );
    
    io = Socket(server);
    stream = new Rx.Subject();
    spreaded = Rx.Observable
    .zip(
        stream,
        Rx.Observable.interval( 5000 )
    );

    io.on('connection', function(client){
        client.on('event', onEvent);
        client.on('disconnect', onDisconnect);
        users++;
        message('users:online');
    });
    server.listen(config.port.socket);
    console.log(`socket listening on ${config.port.socket}`);

    spreaded.subscribe(
        ( [ data, i ]) => {
            const msg = data['msg'];
            io.emit('broadcast', msg);
            console.log('broadcast', msg, i)
        }
    );
}

export const broadcast = ( msg, user ) => {
    return new Promise( resolve => {
        stream.next( { msg, user } ); 
        // console.log('received', msg, user)
        resolve();
    });
}

export const message = (key) => {
    return new Promise( resolve => {
        switch (key) {
            case 'users:online':
                io.emit('users:online', users);
            break;
        }
        resolve();
    });
}

export const httpServer = () => {
    return server;
}

const onEvent = (data) => {
    console.log('event', data)
}

const onDisconnect = () => {
    users--;
    message('users:online');
}