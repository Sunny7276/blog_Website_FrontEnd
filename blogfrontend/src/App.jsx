import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import BlogPost from './components/BlogPost/BlogPost';
import NewPosts from './components/NewPosts/NewPosts';
import MyPosts from './components/MyPosts/MyPosts';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/newposts" element={<NewPosts />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
