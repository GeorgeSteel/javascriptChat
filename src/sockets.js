module.exports = function (io){
    let users = {};
    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            console.log(data);
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        socket.on('send message', (data, cb) => {
            var msg = data.trim();

            if (msg.substr(0,3) === '/p ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substr(0, index);
                    var msg = msg.substr(index + 1);
                    if (name in users) {
                        users[name].emit('private', {
                            msg,
                            nick: socket.nickname
                        });
                    }else{
                        cb('Error! Please enter a valid user');
                    }
                }else{
                    cb('Error! Please enter your message');
                }
            } else {
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }            
        });
        
        socket.on('disconnect', function (data){
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        

        function updateNicknames() {            
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}