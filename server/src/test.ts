
import * as https from "https";
import * as fs from "fs";
import * as Socket from "socket.io";


const options = {
    key: fs.readFileSync("/etc/nginx/certs/hell.vijon.it/key.pem"),
    cert: fs.readFileSync("/etc/nginx/certs/hell.vijon.it/cert.pem")
};

const server = https.createServer(options, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`req: ${req.url}`);
    console.log(`req`, req.url)
});
const io = Socket(server);
io.on('connection', function(client){
    console.log('connection', client)
});


server.listen(5001);

console.log('listen 5001')