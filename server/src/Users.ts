import * as fs from 'fs';
import * as path from 'path';

interface User {
    id: string;
    name: string;
}

const fileRoot = path.resolve(process.cwd(), 'public');
const file = path.join(fileRoot, 'ids.txt');
var users: User[] = [];
var loaded = false;

export const load = () => {
    return new Promise( resolve => {
        if (fs.existsSync(file)) {
            let json = fs.readFileSync( file, {
                encoding: 'utf8',
                flag: 'r+'
            } );
            users = JSON.parse(json);
        }
        loaded = true;
        resolve();
    });
}

export const save = (user: User) => {
    return new Promise( async resolve => {
        if (!loaded) await load();
        if (!users.filter( (u) => { return u.id === user.id; } ).length) {
            users.push( user );
            fs.writeFileSync( file, JSON.stringify(users), {
                mode: 0o777,
                flag: 'w+'
            });
        }
        resolve();
    });
}