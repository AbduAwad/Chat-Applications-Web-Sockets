//connect to server and retain the socket
//connect to same host that served the document
const socket = io() //by default connects to same server that served the page

let isConnected = false; // boolean to check if the client is connected to the server
let localUser = ''; // the username of the local user

// Set the "Send" button and the message input field to be initially disabled
document.getElementById('send_button').disabled = true;
document.getElementById('msgBox').disabled = true;

function handleConnect() { // the client connecting to the server will be handled here (the connect as button)

  username = document.getElementById('username-input').value.trim(); // get the username from the input field
  const serverAck = document.getElementById('server-acknowledgment'); // get the server acknowledgment element

  if (isConnected) { // if the client is already connected to the server
    serverAck.textContent = 'You are already connected as ' + username; // display a message to the client
    return; // do nothing with the button click
  }

  let isValidUsername = validateUsername(username); // check if the username is valid

  console.log('Sending username: ' + username);

  if (!isValidUsername) { // if the username is not valid
    serverAck.textContent = 'Please use letters and numbers only, starting with a letter.'; // display a message to the client
  } else { // if the username is valid
    socket.emit('connectUser', username); // Send the username to the server

    // Listen for the acknowledgment from the server
    socket.on('serverAcknowledgment', function (acknowledgment) { // receiving an acknowledgment from the server will be handled here
      console.log('RECEIVED: ' + acknowledgment);
      serverAck.textContent = acknowledgment; // display a message to the client
      isConnected = true; // set the client to be connected to the server
      document.getElementById('send_button').disabled = false; // enable the send button
      document.getElementById('msgBox').disabled = false; // enable the message input field
      document.getElementById('connect-button').disabled = true; // disable the connect button
    });
  }
}


socket.on('serverSays', function(message) { // receiving a message from the server will be handled here
  DisplayTextToClient(message); // display the message from the server to the client
  localUser = ''; // reset the local user
})

function sendMessage() { // the client sending a message will be handled here
  let message = document.getElementById('msgBox').value.trim() // get the message from the input field
  if(message === '') { // if the message is empty
    return; // do nothing
  } 
  socket.emit('clientSays', message) // send the message to the server
  document.getElementById('msgBox').value = '' // clear the message input field after sending the message
  localUser = username; // get the username of the local user. as the message is sent, the local user is the sender
}

function handleKeyDown(event) { // the client pressing the enter key will be handled here
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {
    sendMessage() // send the message to the server
    return false //don't propogate event
  }
}

function handleClearChat() {  // the client clearing the chat will be handled here (handle the clear button)
  document.getElementById('messages').innerHTML = ''; // clear the chat dialogue. set the innerHTML to an empty string
}