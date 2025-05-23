import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './BlogPost.css'

export default function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userIdParam = user ? `?userId=${user.userId}` : '';
    fetch(`http://localhost:4000/api/blogs/${id}${userIdParam}`)
      .then(res => {
        if (!res.ok) throw new Error('Cannot access this blog');
        return res.json();
      })
      .then(setBlog)
      .catch(err => setErrorMsg(err.message));
  }, [id, user]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/comments/${id}`)
      .then(res => res.json())
      .then(setComments)
      .catch(console.error);
  }, [id]);

  const addComment = () => {
    if (!commentText.trim()) return;

    fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: id, commentContent: commentText }),
    })
      .then(res => res.json())
      .then(() => {
        setCommentText('');
        // reload comments
        return fetch(`http://localhost:4000/api/comments/${id}`);
      })
      .then(res => res.json())
      .then(setComments)
      .catch(console.error);
  };

  if (errorMsg) return <p>{errorMsg}</p>;
  if (!blog) return <p>Loading blog...</p>;

  return (
    <div>
      <h2>{blog.blogTitle}</h2>
      <p><strong>Topic:</strong> {blog.blogTopic}</p>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><strong>Posted on:</strong> {new Date(blog.createdOn).toLocaleString()}</p>
      <div>
        <p>{blog.blogContent}</p>
      </div>
      <hr />
      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      <ul>
        {comments.map(c => (
          <li key={c.commentId}>
            <p>{c.commentContent}</p>
            <small>{new Date(c.commentedOn).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={3}
        placeholder="Write a comment..."
      />
      <br />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}
