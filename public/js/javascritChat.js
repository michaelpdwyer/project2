var room = 'javascript';
var socket = io('/tech');
$('form').submit(() => {
  let msg = $('#m').val();
  socket.emit('message', { msg, room });
  $('#m').val('');
  return false;
});

socket.on('connect', () => {
          socket.emit('join', { room: room });
})

socket.on('message', (msg) => {
  $('#messages').append($('<li>').text("Username: "+ msg));
})