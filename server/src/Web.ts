import * as http from "http";
import * as Socket from "socket.io";

var server = http.createServer();
var io = Socket(server);
var users = 0;
export const start = ( config ) => {
    io.on('connection', function(client){
        client.on('event', onEvent);
        client.on('disconnect', onDisconnect);
        users++;
        message('users:online');
    });
    server.listen(config.port);
    console.log('connect', config.port)
}

export const broadcast = ( msg, user ) => {
    return new Promise( resolve => {
        io.emit('broadcast', msg);
        console.log('broadcast', msg, user)
        resolve();
    });
}

export const message = (key) => {
    return new Promise( resolve => {
        switch (key) {
            case 'users:online':
                io.emit('users:online', users);
                console.log('users:online', users)
            break;
        }
        resolve();
    });
}

const onEvent = (data) => {
    console.log('event', data)
}

const onDisconnect = () => {
    console.log('disconnect')
    users--;
    message('users:online');
}