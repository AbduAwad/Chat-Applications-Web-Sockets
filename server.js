
const server = require('http').createServer(handler) // Initialize the server by creating an HTTP server instance with a request handler function.
const io = require('socket.io')(server) // Wrap the HTTP server app in Socket.io capability for real-time communication.
const { info } = require('console'); // Import the 'info' function from the 'console' module, but it's not used in this code.
const fs = require('fs'); // Import the 'fs' module to work with the file system for serving static files.
const { send } = require('process'); // Import the 'send' function from the 'process' module, but it's not used in this code.
const url = require('url'); // Import = 'url' module to parse URL strings.
const PORT = process.argv[2] || process.env.PORT || 3000 // Define a PORT variable that can be set via command-line arguments or environment variables, defaulting to 3000 if not specified.
const ROOT_DIR = 'html' // Define directory from which static files will be served.

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
} // Create a dictionary (object) that maps file extensions to their corresponding MIME types for HTTP responses.

function get_mime(filename) { // function to get the file extension
  for (let ext in MIME_TYPES) { // loop through the MIME_TYPES dictionary
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) { // if the file extension is found
      return MIME_TYPES[ext] // return the MIME type
    }
  }
  return MIME_TYPES['txt'] // if the file extension is not found, return the MIME type for plain text
}

server.listen(PORT) // start http server listening on PORT

function handler(request, response) { // handler for http requests
  //handler for http server requests including static files
  let urlObj = url.parse(request.url, true, false) 
  console.log('\n============================') // log the request to the console
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname // get the file path
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html' // if the file path is empty, set it to index.html

  fs.readFile(filePath, function(err, data) { // read the file
    if (err) { // if there is an error reading the file
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err)) // log the error to the console
      //respond with not found 404 to client
      response.writeHead(404); // write the 404 header
      response.end(JSON.stringify(err)) // end the response
      return // return
    }
    response.writeHead(200, { // write the 200 header
      'Content-Type': get_mime(filePath) // get the MIME type
    })
    response.end(data) // end the response
  })
}
// simultaneous arrays to keep track of registered users
let registeredbyUserName = []; // list of registered users by username
let registeredUsersbySocketId = []; // list of registered users by socket id

//Socket Server
io.on('connection', function(socket) { // event emitted when a client connects

  console.log('client connected', socket.id) // log the connection to the console
  socket.emit('serverSays', 'You are connected to CHAT SERVER') // send a message to the client that they are connected to the server

  socket.on('connectUser', function(username) { // event emitted when a client connects
    registerUser(socket, username) // register the user to the lists of registered users
    console.log('User connected: ' + username); // log the connection to the console
    socket.emit('serverAcknowledgment', 'Server: Successfully connected as ' + username); // send a message to the client through a web socket that they are connected to the server
  });

  socket.on('clientSays', function(data) { // event emitted when a client sends a message
    if (data.includes(":")) { // if the message contains a colon it is a (private message)
      sendPrivateMessage(socket, registeredUsersbySocketId, registeredbyUserName, data);
    } else { // loop through all clients and send the message to all registered users (public message)
      sendPublicMessage(socket, data, registeredUsersbySocketId, registeredbyUserName);
    }
  });

  socket.on('disconnect', function(data) { // event emitted when a client disconnects
    //event emitted when a client disconnects
    removeRegisteredUser(socket.id); // remove the user from the list of registered users
    console.log('client disconnected') // log the disconnection to the console
  })
})
// console log the server port and the url to test the server
console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:${PORT}/chatClient.html`)

// server helper functions and logic: ---------------------------------------------

function registerUser(socket, username) { // function to register users
  socket.username = username; // set the username of the socket
  registeredUsersbySocketId.push(socket.id); // add connected users to the list of registered users
  registeredbyUserName.push(socket.username); // add connected users to the list of registered users
}

function removeRegisteredUser(socketId) { // function to remove users from the list of registered users
  for (let i = 0; i < registeredUsersbySocketId.length; i++) { // loop through the list of registered users
    if (registeredUsersbySocketId[i] === socketId) { // if the user is found
      registeredUsersbySocketId.splice(i, 1); //  remove the user from the list of registered users
      registeredbyUserName.splice(i, 1); // remove the user from the list of registered users
    }
  }
}


function updatePrivMessageList(clientData) { // function to add users to private message list

  let privateUserList =  [] // list of users to send the private message to
  tempUser = '' // temp variable to store the username
 
  for (let i = 0; i < clientData.length; i++) {  // loop through data until we hit ":" and save every word between commas before that as the username
    if (clientData[i] === ",") { // if we hit a comma
      privateUserList.push(tempUser.trim()); // add the username to the list of users to send the private message to
      tempUser = ''; // reset the temp variable
      continue; // continue to the next iteration
    }
    if (clientData[i] === ":") { // if we hit a colon
      privateUserList.push(tempUser.trim()); // add the username to the list of users to send the private message to
      break; // break out of the loop
    }
    tempUser += clientData[i]; // add the character to the temp user variable
  }
  return privateUserList; // return the list of users to send the private message to
}

function sendPrivateMessage(socket, registeredUsersbySocketId, registeredbyUserName, data) { // function to send private messages
  message = data.split(":")[1].trim(); // get the message
  let privUserList = updatePrivMessageList(data); // get the list of users to send the private message to
  for (let i = 0; i < privUserList.length; i++) { // loop through the list of users to send the private message to
    for (let j = 0; j < registeredbyUserName.length; j++) { // loop through the list of registered users
      if (registeredbyUserName[j] === privUserList[i]) { // if the user is registered and is in the list of users to send the private message to
        io.to(registeredUsersbySocketId[j]).emit('serverSays',{data: socket.username + ": " + message, isPrivate: true}); // send the message to the user
      }
    }
  }
  io.to(socket.id).emit('serverSays',{data: socket.username + ": " + message, isPrivate: true});// send the message to the current user as well
}

function sendPublicMessage(socket, data, registeredUsersbySocketId, registeredbyUserName) { // function to send public messages
  for (let i = 0; i < registeredbyUserName.length; i++) { // loop through the list of registered users
    io.to(registeredUsersbySocketId[i]).emit('serverSays', { data :socket.username + ": " + data, isPrivate: false}); // send the message to the user
  }
}