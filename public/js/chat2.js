
$(document).ready(function(){ 
    $("#message2").keyup(function(event){
        if(event.keyCode == 32){
            $("input").val($("input").val()+' ');
        }; 
        if(event.keyCode == 65){
            $("input").val($("input").val()+'a');
        }; 
        if(event.keyCode == 87){
            $("input").val($("input").val()+'w');
        }; 
        if(event.keyCode == 68){
            $("input").val($("input").val()+'d');
        }; 
        if(event.keyCode == 83){
            $("input").val($("input").val()+'s');
        }; 
    });

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
});

function clientConnect(){
  var room = "chat2";
  var socket = io('/game');

  var message = $("#message2");
  var send_message = $("#send_message2");
  var displayChat = $("#displayChat2");


   send_message.click(function(event){
       event.preventDefault();
     //socket.emit("add_username", {username: "paul" });
     
        socket.emit("send_message", {message: message.val().trim(), username: localStorage.getItem("username"), room: room});
        message.val('');
      });

      socket.on('connect', () => {
        socket.emit('join', { room: "chat2" });
      });

      socket.on("receive_message", (data) =>{
        console.log(data.message)
        displayChat.append("<p class='message'>" +data.username + ": " + data.message +"</p>");
        $("#displayChat2").scrollTop($("#displayChat2")[0].scrollHeight);
    }); 
  };
  
  clientConnect();


  