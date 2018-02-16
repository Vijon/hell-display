import * as http from "http";
import * as Socket from "socket.io";
import * as Rx from "rxjs";


const server = http.createServer();
const io = Socket(server);
const stream = new Rx.Subject();
const spreaded = Rx.Observable
.zip(
    stream,
    Rx.Observable.interval( 5000 )
);
var users = 0;
export const start = ( config ) => {
    io.on('connection', function(client){
        client.on('event', onEvent);
        client.on('disconnect', onDisconnect);
        users++;
        message('users:online');
    });
    server.listen(config.port);

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

const onEvent = (data) => {
    console.log('event', data)
}

const onDisconnect = () => {
    users--;
    message('users:online');
}