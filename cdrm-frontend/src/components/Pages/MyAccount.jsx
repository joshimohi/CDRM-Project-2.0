import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyAccount() {
  const [wvList, setWvList] = useState([]);
  const [prList, setPrList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await axios.post('/userinfo');
      setWvList(response.data.Widevine_Devices || []);
      setPrList(response.data.Playready_Devices || []);
      setUsername(response.data.Styled_Username || '');
      setApiKey(response.data.API_Key || '');
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Handle file upload
  const handleUpload = async (event, cdmType) => {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop();
    if ((cdmType === 'PR' && extension !== 'prd') || (cdmType === 'WV' && extension !== 'wvd')) {
      alert(`Please upload a .${cdmType === 'PR' ? 'prd' : 'wvd'} file.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post(`/upload/${cdmType}`, formData);
      await fetchUserInfo(); // Refresh list after upload
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed!');
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (passwordError || password === '') {
      alert('Please enter a valid password.');
      return;
    }

    try {
      const response = await axios.post('/user/change_password', {
        new_password: password
      });

      if (response.data.message === 'True') {
        alert('Password changed successfully.');
        setPassword('');
      } else {
        alert('Failed to change password.');
      }
    } catch (error) {
      if (error.response && error.response.data?.message === 'Invalid password format') {
        alert('Password format is invalid. Please try again.');
      } else {
        alert('Error occurred while changing password.');
      }
    }
  };

  // Handle change API key
  const handleChangeApiKey = async () => {
    if (apiKeyError || newApiKey === '') {
      alert('Please enter a valid API key.');
      return;
    }

    try {
      const response = await axios.post('/user/change_api_key', {
        new_api_key: newApiKey,
      });
      if (response.data.message === 'True') {
        alert('API key changed successfully.');
        setApiKey(newApiKey);
        setNewApiKey('');
      } else {
        alert('Failed to change API key.');
      }
    } catch (error) {
      alert('Error occurred while changing API key.');
      console.error(error);
    }
  };

  return (
    <div id="myaccount" className="flex flex-col lg:flex-row gap-4 w-full min-h-full overflow-y-auto p-4">
      <div className="flex-col w-full min-h-164 lg:h-full lg:w-96 border-2 border-yellow-500/50 rounded-2xl p-4 flex items-center overflow-y-auto">
        <h1 className="text-2xl font-bold text-white border-b-2 border-white p-2 w-full text-center mb-2">
          {username ? `${username}` : 'My Account'}
        </h1>

        {/* API Key Section */}
        <div className="w-full flex flex-col items-center">
          <label htmlFor="apiKey" className="text-white font-semibold mb-1">API Key</label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            readOnly
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600 text-center"
          />

          {/* New API Key Section */}
          <label htmlFor="newApiKey" className="text-white font-semibold mt-4 mb-1">New API Key</label>
          <input
            id="newApiKey"
            type="text"
            value={newApiKey}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[^\s]+$/.test(value); // No spaces
              if (!isValid) {
                setApiKeyError('API key must not contain spaces.');
              } else {
                setApiKeyError('');
              }
              setNewApiKey(value);
            }}
            placeholder="Enter new API key"
            className="w-full p-2 mb-1 rounded bg-gray-800 text-white border border-gray-600 text-center"
          />
          {apiKeyError && <p className="text-red-500 text-sm mb-3">{apiKeyError}</p>}
          <button
            className="w-full h-12 bg-yellow-500/50 rounded-2xl text-2xl text-white"
            onClick={handleChangeApiKey}
          >
            Change API Key
          </button>

          {/* Change Password Section */}
          <label htmlFor="password" className="text-white font-semibold mt-4 mb-1">Change Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(value);
              if (!isValid) {
                setPasswordError('Password must not contain spaces or invalid characters.');
              } else {
                setPasswordError('');
              }
              setPassword(value);
            }}
            placeholder="New Password"
            className="w-full p-2 mb-1 rounded bg-gray-800 text-white border border-gray-600 text-center"
          />
          {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
          <button
            className="w-full h-12 bg-yellow-500/50 rounded-2xl text-2xl text-white"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto w-full h-12 bg-yellow-500/50 rounded-2xl text-2xl text-white"
        >
          Log out
        </button>
      </div>

      <div className="flex flex-col w-full lg:ml-2 mt-2 lg:mt-0">
        {/* Widevine Section */}
        <div className="border-2 border-yellow-500/50 flex flex-col w-full min-h-1/2 text-center rounded-2xl lg:p-4 p-2 overflow-y-auto">
          <h1 className="bg-black text-2xl font-bold text-white border-b-2 border-white p-2">Widevine CDMs</h1>
          <div className="flex flex-col w-full grow p-2 bg-white/5 rounded-2xl mt-2 text-white text-left">
            {wvList.length === 0 ? (
              <div className="text-white text-center font-bold">No Widevine CDMs uploaded.</div>
            ) : (
              wvList.map((filename, i) => (
                <div
                  key={i}
                  className={`text-center font-bold text-white p-2 rounded ${i % 2 === 0 ? 'bg-black/30' : 'bg-black/60'}`}
                >
                  {filename}
                </div>
              ))
            )}
          </div>
          <label className="bg-yellow-500 text-white w-full min-h-16 lg:min-h-16 mt-4 rounded-2xl flex items-center justify-center cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload CDM'}
            <input
              type="file"
              accept=".wvd"
              hidden
              onChange={(e) => handleUpload(e, 'WV')}
            />
          </label>
        </div>

        {/* Playready Section */}
        <div className="border-2 border-yellow-500/50 flex flex-col w-full min-h-1/2 text-center rounded-2xl p-2 mt-2 lg:mt-2 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white border-b-2 border-white p-2 bg-black">Playready CDMs</h1>
          <div className="flex flex-col w-full bg-white/5 grow rounded-2xl mt-2 text-white text-left p-2">
            {prList.length === 0 ? (
              <div className="text-white text-center font-bold">No Playready CDMs uploaded.</div>
            ) : (
              prList.map((filename, i) => (
                <div
                  key={i}
                  className={`text-center font-bold text-white p-2 rounded ${i % 2 === 0 ? 'bg-black/30' : 'bg-black/60'}`}
                >
                  {filename}
                </div>
              ))
            )}
          </div>
          <label className="bg-yellow-500 text-white w-full min-h-16 lg:min-h-16 mt-4 rounded-2xl flex items-center justify-center cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload CDM'}
            <input
              type="file"
              accept=".prd"
              hidden
              onChange={(e) => handleUpload(e, 'PR')}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
