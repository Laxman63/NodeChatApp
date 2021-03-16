// installing express in a this file
const express=require('express')
// creating a new express or creating a new instance of application with help of express
// now express is library/ model which proide us many in build and easy route to work with backend;
// without express u will have to parse data and parse their route by ur own.
const app=express()
// path module is the in built core function which is already install and we have to import in our working file
const path=require('path')
// http core module which we hae to import
const http=require('http')
const port = process.env.PORT || 3000
const socketio = require('socket.io')
// for checking weather a user is using any abusive language or not
const filter=require('bad-words')
const server=http.createServer(app);
const io=socketio(server);
const localhost ='http://localhost:3000';
const publicdirpath=path.join(__dirname,'../public')
const { generateMessage,generatelocationmessage}=require('./utils/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')
app.use(express.static(publicdirpath))
//var count=0;
io.on('connection',(socket)=>{
    console.log("socket.io is connected ")

socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})
    if(error){
        return callback(error);
    }
    socket.join(user.room)
    socket.emit('wel', generateMessage('Admin!','Welcome'))
    socket.broadcast.to(user.room).emit('wel', generateMessage('Admin!',`${user.username} has joined!`));
    io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
    })

callback();

})

   /* socket.on('clickedy',()=>{
        count++;
        io.emit('updatecount',count);
    })*/
    socket.on('sendlocationll',(coords,callback)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('locationmessage', generatelocationmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('sendmessage',(message,callback)=>{
        const fil=new filter();
        const user=getUser(socket.id);
        if(fil.isProfane(message)){
            return callback('abusive language are not allowed')
        }
io.to(user.room).emit('wel',generateMessage(user.username,message))
callback()
//console.log(message)
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('wel', generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
       


    })
})

server.listen(port,(req,res)=>{
    console.log('this is laxman kumar');
})