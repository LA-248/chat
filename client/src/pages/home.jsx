import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';
import { MessageProvider } from '../components/MessageContext.jsx';
import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import MessageInput from '../components/MessageInput.jsx';
import Logout from '../components/UserLogout.jsx';
import DisplayUsername from '../components/DisplayUsername.jsx';
import fetchUsername from '../utils/FetchUsername.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ContactHeader from '../components/ContactHeader.jsx';

export const SocketContext = createContext();

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve account username
    const fetchUser = async () => {
      try {
        const userData = await fetchUsername();
        setUsername(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error.message);
      }
    };
    fetchUser();

    const socketInstance = io('http://localhost:8080', {
      auth: {
        serverOffset: 0,
      },
      // Need to send cookies with the request
      withCredentials: true,
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    // Render child components only if the socket is initialised
    socket && (
      <SocketContext.Provider value={socket}>
        <MessageProvider>
          <div className="main-container">
            <div className="sidebar-container">
              <Sidebar />
              <div className="user-controls">
                <DisplayUsername username={username} />
                <Logout />
                <a
                  href="/"
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '20px',
                    textDecoration: 'none',
                    marginTop:'10px',
                  }}
                >
                  Chats
                </a>
              </div>
            </div>
            <div className="chat-window-container">
              <ContactHeader />
              <Outlet />
              <div className="input-container">
                <MessageInput />
              </div>
            </div>
          </div>
        </MessageProvider>
      </SocketContext.Provider>
    )
  );
}
