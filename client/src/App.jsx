import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import SignUp from './pages/sign-up.jsx';
import Login from './pages/login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import { ChatView } from './components/ChatView.jsx';

function App() {
  return (
    <Router>
      <div>
        <div>
          <Routes>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />}>
                <Route path="messages/:room" element={<ChatView />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
