// Import the React features we need
import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // This file styles your component

function App() {
  // State for the list of posts
  const [posts, setPosts] = useState([]);
  
  // State for the new post form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // --- Reusable Function to Fetch Posts ---
  // We use useCallback to prevent it from being redefined on every render
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data); // Update the posts list
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []); // Empty dependency array means this function is created once

  // --- useEffect: Fetch posts on initial load ---
  useEffect(() => {
    fetchPosts(); // Call the function to run the fetch
  }, [fetchPosts]); // Run this effect when fetchPosts function is available

  // --- Function to Handle Form Submission ---
  const handleSubmit = async (e) => {
    // Prevent the default browser form submission (which causes a page reload)
    e.preventDefault(); 
    
    console.log("Submitting new post:", { title, content });

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we are sending JSON
        },
        // Convert the form data from a JS object to a JSON string
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If successful:
      setTitle('');     // Clear the title input
      setContent('');   // Clear the content input
      fetchPosts();     // Re-fetch the posts to show the new one

    } catch (error) {
      console.error('Failed to submit post:', error);
    }
  };

  // --- This is the HTML (JSX) that gets rendered ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>My AI Blog</h1>
      </header>
      
      <main>
        {/* --- NEW POST FORM --- */}
        <section className="form-container">
          <h2>Create a New Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>
            <button type="submit">Create Post</button>
          </form>
        </section>

        {/* --- EXISTING POSTS LIST --- */}
        <section className="posts-container">
          <h2>Latest Posts</h2>
          {posts.length > 0 ? (
            posts.map(post => (
              <article key={post.id} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
              </article>
            ))
          ) : (
            <p>No posts yet. Be the first!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;