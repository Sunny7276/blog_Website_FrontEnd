import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import './MyPosts.css'

export default function MyPosts() {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`http://localhost:4000/api/blogs/user/${user.userId}`)
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error);
  }, [user, isLoggedIn]);

  const startEdit = (post) => {
    setEditingId(post.blogId);
    setEditData({
      blogTopic: post.blogTopic,
      blogTitle: post.blogTitle,
      blogContent: post.blogContent,
      privacy: post.privacy,
      status: post.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editData.blogTopic || !editData.blogTitle) {
      setError('Topic and Title required');
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogAuthor: user.userId,
          blogTopic: editData.blogTopic,
          blogTitle: editData.blogTitle,
          blogContent: editData.blogContent,
          privacy: editData.privacy,
          status: editData.status,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updatedPosts = posts.map(p =>
        p.blogId === editingId ? { ...p, ...editData } : p
      );
      setPosts(updatedPosts);
      setEditingId(null);
      setEditData({});
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) return <p>Please login to see your posts.</p>;

  return (
    <div>
      <h2>My Posts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.length === 0 && <p>You have no posts.</p>}
      <ul>
        {posts.map(post => (
          <li key={post.blogId} style={{ marginBottom: '1rem' }}>
            {editingId === post.blogId ? (
              <>
                <input
                  type="text"
                  value={editData.blogTopic}
                  onChange={e => setEditData({ ...editData, blogTopic: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.blogTitle}
                  onChange={e => setEditData({ ...editData, blogTitle: e.target.value })}
                />
                <textarea
                  value={editData.blogContent}
                  onChange={e => setEditData({ ...editData, blogContent: e.target.value })}
                />
                <label>
                  Private:
                  <input
                    type="checkbox"
                    checked={editData.privacy}
                    onChange={e => setEditData({ ...editData, privacy: e.target.checked })}
                  />
                </label>
                <label>
                  Active:
                  <input
                    type="checkbox"
                    checked={editData.status}
                    onChange={e => setEditData({ ...editData, status: e.target.checked })}
                  />
                </label>
                <br />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{post.blogTitle}</h3>
                <p><strong>Topic:</strong> {post.blogTopic}</p>
                <p>{post.blogContent}</p>
                <p><strong>Private:</strong> {post.privacy ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {post.status ? 'Active' : 'Deleted'}</p>
                <button onClick={() => startEdit(post)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
