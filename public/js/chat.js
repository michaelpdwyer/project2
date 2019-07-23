
$(document).ready(function(){ 
    $("#message").keyup(function(event){
        if(event.keyCode == 32){
            $("input").val($("input").val()+' ');
        }; 
});
});

function clientConnect(){
  var socket = io();

  var message = $("#message");
  var send_message = $("#send_message");
  var displayChat = $("#displayChat");



   send_message.click(function(event){
       event.preventDefault();
     //socket.emit("add_username", {username: "paul" });
        socket.on("receive_message", (data) =>{
            console.log(data)
            displayChat.append("<p class='message'>" +data.username + ":" + data.message +"</p>");
        }); 
        socket.emit("send_message", {message: message.val().trim(), username: localStorage.getItem("username")});
    });
  };
  
  clientConnect();
  

 