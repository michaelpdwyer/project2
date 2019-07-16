var room = 'css';
var socket = io('/tech');
$('form').submit(() => {
  let msg = $('#m').val();
  console.log("sending "+ msg)
  socket.emit('message', { msg, room });
  $('#m').val('');
  return false;
});

socket.on('connect', () => {
      socket.emit('join', { room: room });
})

socket.on('message', (msg) => {
  console.log("Mintewab: "+ msg)
  $('#messages').append($('<li>').text("Username: "+ msg));
})