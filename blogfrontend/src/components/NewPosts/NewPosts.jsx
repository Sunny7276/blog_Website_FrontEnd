import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './NewPosts.css'

export default function NewPosts() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [blogTopic, setBlogTopic] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [privacy, setPrivacy] = useState(false); // false = public, true = private
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return <p>You must be logged in to create a post.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blogTopic || !blogTitle) {
      setError('Topic and Title are required');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogAuthor: user.userId,
          blogTopic,
          blogTitle,
          blogContent,
          privacy,
        }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      navigate('/myposts');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Topic:
          <input type="text" value={blogTopic} onChange={(e) => setBlogTopic(e.target.value)} />
        </label>
        <br />
        <label>
          Title:
          <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Content:
          <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
        </label>
        <br />
        <label>
          Private:
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
