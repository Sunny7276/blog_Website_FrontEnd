import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <span className="logo" onClick={() => navigate('/')}>Blog Website</span>
      <div className="buttons">
        <button onClick={() => navigate('/')}>Home</button>
        {isLoggedIn && (
          <>
            <button onClick={() => navigate('/newposts')}>New Post</button>
            <button onClick={() => navigate('/myposts')}>My Posts</button>
            <span className="user-greeting">Hi, {user.userName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
}
