const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/tic_tac_toe_server', { useNewUrlParser: true });
require("./models/user");
require('./passportConfig');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(cookieSession({
    name: 'ttts',
    keys: ['key1', 'key2']
  }))

const isLoggedIn=(req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
  
require('./routes/auth')(app);

////////////////////////////////


io.on('connect',(socket)=>{
    socket.on('join',({name,room},cb)=>{
        socket.join(room);
        socket.emit('message', { user: 'admin', text: `${name}, welcome to room ${room}.`});
        cb();
    });
    // socket.on('sendMessage', (message, cb) => {    
    //     io.to(room).emit('message', { user: name, text: message });
    //     cb();
    //   });
      socket.on('turnPlayed', ({index,by,room}, cb) => {    
        io.to(room).emit('opponentsPlay', { index,by });
        cb();
      });
})

///////////////////////////////


app.get('/logout',(req,res)=>{
    req.session=null;
    req.logout();
    res.redirect('/');
})

app.get('/',isLoggedIn,(req,res)=>{
    res.send('index');

})

server.listen(3001,()=>{
    console.log('Started server on 3001')
})