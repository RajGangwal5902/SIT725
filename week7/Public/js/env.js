    let socket = io();
    socket.on('number', (msg) => {
        console.log('Random Data Number: ' + msg * msg);
    })