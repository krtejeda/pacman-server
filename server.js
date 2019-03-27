const express = require('express');
const socketIO = require('socket.io');
const app = express();

const http = require('http');

const server = http.Server(app);
let port = process.env.PORT || 3000;

server.listen(port, (err) => {
    if (err) throw err
    console.log('listening on port:', port)
});

const io = socketIO(server);

app.use(express.static("server"));

io.on('connection', (socket) => {
    console.log("Client Connected:", socket.id);
    socket.on("init_player", () => {
        io.emit("draw_player", socket.id);
    });
    socket.on('up', () => {
        io.emit('go_up', socket.id);
    });
    socket.on('down', () => {
        io.emit('go_down', socket.id);
    });
    socket.on('left', () => {
        io.emit('go_left', socket.id);
    });
    socket.on('right', () => {
        io.emit('go_right', socket.id);
    });
    socket.on('disconnect', () => {
        console.log('Client Disconnected:', socket.id);
        io.emit('delete_player', socket.id);
    });
})