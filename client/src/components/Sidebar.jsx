import { useContext, useEffect, useState } from 'react';
import { MessageContext } from './MessageContext';
import { retrieveUserId } from '../utils/FetchUserId';
import { SocketContext } from '../pages/home';

export default function Sidebar() {
  const [chatList, setChatList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { username, setUsername, setSelectedChat } = useContext(MessageContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    // Retrieve chat list from local storage
    const storedChatList = localStorage.getItem('chat-list');
    if (storedChatList) {
      // Need to parse JSON back to JavaScript object so it can be mapped through
      setChatList(JSON.parse(storedChatList));
    }

    const handleUserId = async () => {
      try {
        // Fetch the user's ID which is used to display their chat list
        const id = await retrieveUserId();
        setUserId(id);
      } catch (err) {
        console.error(err.message);
      }
    };

    handleUserId();
  }, []);

  // 
  useEffect(() => {
    if (socket && userId) {
      socket.emit('authenticate', userId);
    }
  }, [socket, userId]);

  // Add a chat to the user's chat list
  const addChat = async (event) => {
    event.preventDefault();

    try {
      // If there is already an active chat with the user, throw an error
      const exists = chatList.some((chat) => chat.name === username);
      if (exists) {
        throw new Error('You already have an active chat with this user');
      }

      if (username) {
        const response = await fetch('http://localhost:8080/users/chat_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errorMessage);
        }

        const newChatItem = {
          userId: userId,
          id: chatList.length + 1,
          name: username,
          lastMessage: 'Cool!',
          time: '12:30 PM',
        };

        // Update chat list and store it in local storage
        const updatedChatList = chatList.concat(newChatItem);
        setChatList(updatedChatList);
        localStorage.setItem('chat-list', JSON.stringify(updatedChatList));
        setUsername('');
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="sidebar">
      <div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form id="username-form" action="" onSubmit={addChat}>
          <div className="username-input-container">
            <input
              id="username-input"
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setErrorMessage('');
              }}
            />
            <button className="join-room-button" style={{ marginLeft: '10px' }}>
              Start chat
            </button>
          </div>
        </form>
      </div>

      <div className="chat-list">
        {chatList
          .filter((chat) => chat.userId === userId)
          .map((chat) => (
            <div
              className="chat-item"
              key={chat.id}
              onClick={() => setSelectedChat(chat.name)}
            >
              <div className="chat-pic"></div>
              <div className="chat-info">
                <h4 className="chat-name">{chat.name}</h4>
                <p className="chat-last-message">{chat.lastMessage}</p>
              </div>
              <div className="chat-time">{chat.time}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
