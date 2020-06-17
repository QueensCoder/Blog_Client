import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import secrets from './secrets';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAuth, setAuth] = useState(false);

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
        setAuth(true);
        localStorage.setItem('token', data.key);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='App'>
      <h1>start cool stuff here</h1>
      <button onClick={loadBooks}>load blogs</button>
      <br />
      {!isAuth ? <button onClick={login}>Login</button> : <div>Hello User</div>}
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
    </div>
  );
};

export default App;
