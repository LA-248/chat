import { useContext, useEffect } from 'react';
import { MessageContext } from './message-context';
import socket from './socket';

function MessageList() {
  const { messages, setMessages } = useContext(MessageContext);

  useEffect(() => {
    // Listen for incoming messages from the server and update the messages list
    socket.on('chat-message', (message, serverOffset) => {
      console.log(`Message received: ${message}`);
      setMessages((prevMessages) => prevMessages.concat(message));
      socket.auth.serverOffset = serverOffset;
    });

    return () => {
      socket.off('chat-message');
    };
  }, [setMessages]);

  return (
    <ul id="messages">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

export { MessageList };
