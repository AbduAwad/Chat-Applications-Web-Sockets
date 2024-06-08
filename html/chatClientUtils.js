// Desc: This file contains the functions that are used by the chatClient.js file

function isLocalUser(user) { // check if the user is the local user
    return localUser == user; // return true if the user is the local user
} // temp username is the username of the local user set in the sendMessage function

function DisplayTextToClient(message) { // display the message to the client, based on the message type

    let msgDiv = document.createElement('div') // create a div for the message
    msgDiv.textContent = message.data // set the text of the div to the message

    if (message.isPrivate) { // if the message is private
        msgDiv.className = 'private' // make it the css for a private message (red)
    } else {  // if the message is not private
        if (isLocalUser(username)) { // if the user is the local user
        msgDiv.className = 'local' // make it the css for a local message (blue)
        } else { // if the user is not the local user
        msgDiv.className = 'other' // make it the css for a remote message (black)
        }
    }
    document.getElementById('messages').appendChild(msgDiv)
}
// function to abstract the code for sending a message
function validateUsername(username) { // check if the username is valid
    if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)){ // check if the username is valid
        return true; // return true if the username is valid
    } 
    return false; // return false if the username is not valid
}