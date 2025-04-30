import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.message) {
        setStatus(data.message);
      } else if (data.error) {
        setStatus(data.error);
      }
    } catch (err) {
      setStatus('An error occurred while registering.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important to send cookies
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.message) {
        // Successful login - reload the page to trigger Account check
        window.location.reload();
      } else if (data.error) {
        setStatus(data.error);
      }
    } catch (err) {
      setStatus('An error occurred while logging in.');
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-4">
      <div className="flex flex-col w-full h-full lg:w-1/2 lg:h-96 border-2 border-yellow-500/50 rounded-2xl p-4 overflow-x-auto justify-center items-center">
        <div className="flex flex-col w-full">
          <label htmlFor="username" className="text-lg font-bold mb-2 text-white">Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-4 p-2 border border-gray-300 rounded text-white bg-transparent"
          />
          <label htmlFor="password" className="text-lg font-bold mb-2 text-white">Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 p-2 border border-gray-300 rounded text-white bg-transparent"
          />
        </div>
        <div className="flex flex-col lg:flex-row w-8/10 items-center lg:justify-between mt-4">
          <button
            onClick={handleLogin}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4 w-1/3"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4 w-1/3"
          >
            Register
          </button>
        </div>
        {status && (
          <p className="text-sm text-white mt-4 p-4">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
