import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import secrets from './secrets';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAuth, setAuth] = useState({});

  // determine if user is authenticated or not

  const loadBooks = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/v1/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setBlogs(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('you must be logged in to see blogs');
    }
  };

  const login = async () => {
    // private info gotten from secrets
    const { username, email, password } = secrets;

    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/v1/dj-rest-auth/login/',
        {
          username,
          email,
          password,
        }
      );
      if (data.key) {
        console.log(data.key);
        setAuth(data);
        localStorage.setItem('token', data.key);
        console.log(localStorage.getItem('token'));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/logout/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    localStorage.removeItem('token');
    setAuth(false);
  };

  // list the blog content
  const listBlogs = () => (
    <ul>
      {blogs.map(({ id, body, author }) => {
        return (
          <li key={id}>
            <h3>{body}</h3>
            <h6>written by: {author}</h6>
          </li>
        );
      })}
    </ul>
  );
  return (
    <div className='App'>
      <h1>start cool stuff here</h1>
      <button onClick={loadBooks}>load blogs</button>
      <br />
      {!isAuth ? (
        <button onClick={login}>Login</button>
      ) : (
        <div>
          <h1>Hello user</h1>
          <button onClick={logout}>Logout</button>
          <br />
          {listBlogs()}
        </div>
      )}
    </div>
  );
};

export default App;
