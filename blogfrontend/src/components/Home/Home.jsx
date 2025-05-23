import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Public Blogs</h2>
      {blogs.length === 0 && <p>No blogs found</p>}
      <ul>
        {blogs.map(blog => (
          <li key={blog.blogId} style={{ cursor: 'pointer', marginBottom: '1rem' }} onClick={() => navigate(`/blog/${blog.blogId}`)}>
            <h3>{blog.blogTitle}</h3>
            <p><em>Topic:</em> {blog.blogTopic} | <em>Author:</em> {blog.author} | <em>Date:</em> {new Date(blog.createdOn).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
