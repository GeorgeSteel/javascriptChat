$(function (){
    const socket = io();
    
    //obtaining DOM objects from the interface
    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');
    
    //obtaining DOM elements from the nicknameForm
    const nickForm = $('#nickform');
    const nickError = $('#nickError');
    const nickName = $('#nickname');

    const users = $('#usernames');

    nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', nickName.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                nickError.html(`
                <div class="alert alert-danger">That username already exists.</div>
                `)
            }
            nickName.val('');
        });
    });

    //events
    messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', messageBox.val(), data => {
            chat.append(`<p class="error">${data}</p>`)
        });
        messageBox.val('');
    });

    socket.on('new message', function (data){
        chat.append('<b>' + data.nick + ':</b> ' + data.msg + '<br>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;            
        }
        users.html(html);
    });

    socket.on('private', data => {
        displayMsg(data);
    });

    socket.on('load old msgs', msgs => {
        for (let i = 0; i < msgs.length; i++) {
            displayMsg(msgs[i]);            
        }
        
    function displayMsg(data) {
        chat.append(`<p class="private"><b>${data.nick}:</b> ${data.msg}</p>`);
    }
    });

})