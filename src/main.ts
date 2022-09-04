import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
		cors: {
			origin: "*",
		}
	}
);

const sockets: Socket[] = [];

io.on("connection", socket => {
	console.log(`User has connected`);
	sockets.push(socket);
	socket.on("disconnect", reason => {
		console.log(`User has disconnected`);
		sockets.splice(sockets.indexOf(socket), 1);
	});

	socket.on("publish message", args => {
		console.log(`Chat message: ${args}`);
		sockets.forEach(sock => {
			sock.emit("subscribe message", {username: 'Anon', message: args});
		})
	});
});

server.listen(3000, () => {
	console.log(`Listening on port 3000`);
})
