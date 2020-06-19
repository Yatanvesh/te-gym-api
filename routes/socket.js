const {CHANNELS} = require('../constants');
const ConnectionModel = require('../models/connection');
const {verify} = require('../auth');

const onConnection = (socket) => {
  socket.on(CHANNELS.STORE_CLIENT_INFO, async (data) => {
    const {authToken} = data;
    if (!authToken) {
      console.log("No auth token provided!");
      return;
    }
    const {userId} = await verify(authToken);

    let connection = await ConnectionModel.create({
      userId,
      socketId:socket.id
    })
    console.log(`New connection ${socket.id} established`)
  });


  socket.on('disconnect', function (data) {
    ConnectionModel.remove(socket.id);
    console.log(`socket ${socket.id} terminated`)
  });
}

module.exports = {
  onConnection
}