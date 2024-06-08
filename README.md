# Chat Application using Web Sockets

### Prerequisites:
- Node.js
- npm
- socket.io
____

### INSTALL INSTRUCTIONS: 

Install the socket.io module using the following command in the terminal:
```bash
npm install socket.io 
```
____

### LAUNCH INSTRUCTIONS:

1. Open terminal
2. Navigate to the directory containing the server.js file
3. Run the following command in the terminal: 

```bash
node server.js
```

- Expected Terminal Output:
Server Running at port 3000  CNTL-C to quit
To Test:
Open several browsers to: http://localhost:3000/chatClient.html

____

### USAGE INSTRUCTIONS:

1. To test the application open several browser instances (preferably 2+) at the address:
http://localhost:3000/chatClient.html

2. To enable chat messaging between the browser instances, enter a username and click the "Connect As" button.
On each of your browser instances.

3. Once Connected you may send a message regualrly in the 'send a message' text area and click the 'Send' 
button to send the message to all clients. The message will be displayed as dialogue in the chat window on 
all instances, where it is in black text on the local browser instance which sent the message and will be 
in black text on all other browser instances/clients.

4. To send a private message to a specific client in the 'send a message' text area, enter the following format:
<username>:<message>
Where <username> is the username of the client you wish to send a private message to and <message> 
is the message you wish to send.

5. To send a private message to multiple clients in the 'send a message' text area, enter the following format:
<username1>,<username2>,<username3>:<message>
Where <username1>,<username2>,<username3> are the usernames of the clients you wish to send a private message 
to and <message> is the message you wish to send.
*All private messages are displayed in red text on the local browser instance which sent the message and will 
be in red text on all other browser instances/clients.

6. TO clear the chat dialogue on a specific client click the clear button on that client.

____

### Install Dev Dependencies:

1.  Install the project dependencies using the following command in the terminal:
```bash
npm install
```

