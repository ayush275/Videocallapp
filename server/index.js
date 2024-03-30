const { Server } = require("socket.io");
const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());



//app.listen(3008, '192.168.10.135', function () {
//    console.log('Listening to port:  ' + 3008);
//});


//app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', function (req, res) {
//    res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});
const io = new Server(5001, {
    cors: true,
    
});

console.log('Listening to port:  ' + 5001);
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
      const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
      io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:needed", ({ to, offer }) => {
    console.log("peer:needed", offer);
    io.to(to).emit("peer:needed", { from: socket.id, offer });
  });

 
  socket.on("peer:done", ({ to, ans }) => {
    console.log("peer:done", ans);
    io.to(to).emit("peer:final", { from: socket.id, ans });
  });
});
