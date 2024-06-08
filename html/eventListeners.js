//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  
    //add listener to buttons
    document.getElementById('send_button').addEventListener('click', sendMessage)
  
    //add keyboard handler for the document as a whole, not separate elements.
    document.addEventListener('keydown', handleKeyDown)
    //document.addEventListener('keyup', handleKeyUp)
  
    // Add an event listener to the "Connect" button
    document.getElementById('connect-button').addEventListener('click', handleConnect);

    // Add an event listener to the "Clear Chat" button
    document.getElementById('clear_button').addEventListener('click', handleClearChat);
})