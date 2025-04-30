import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyAccount() {
  const [wvList, setWvList] = useState([]);
  const [prList, setPrList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await axios.post('/userinfo');
      setWvList(response.data.Widevine_Devices || []);
      setPrList(response.data.Playready_Devices || []);
      setUsername(response.data.Username || '');
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

  return (
    <div id="myaccount" className="flex flex-row w-full min-h-full overflow-y-auto p-4">
      <div className="flex flex-col w-full min-h-full lg:flex-row">
        {/* Left Panel */}
        <div className="border-2 border-yellow-500/50 lg:h-full lg:w-96 w-full rounded-2xl p-4 flex flex-col items-center overflow-y-auto">
          <h1 className="text-2xl font-bold text-white border-b-2 border-white p-2 w-full text-center mb-2">
            {username ? `${username}` : 'My Account'}
          </h1>
          <button
            onClick={handleLogout}
            className="mt-auto w-full h-12 bg-yellow-500/50 rounded-2xl text-2xl text-white"
          >
            Log out
          </button>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col grow lg:ml-2 mt-2 lg:mt-0">
          {/* Widevine Section */}
          <div className="border-2 border-yellow-500/50 flex flex-col w-full min-h-1/2 text-center rounded-2xl lg:p-4 p-2 overflow-y-auto">
            <h1 className="text-2xl font-bold text-white border-b-2 border-white p-2">Widevine CDMs</h1>
            <div className="flex flex-col w-full grow p-2 bg-white/5 rounded-2xl mt-2 text-white text-left">
              {wvList.length === 0 ? (
                <div className="text-white text-center font-bold">No Widevine CDMs uploaded.</div>
              ) : (
                wvList.map((filename, i) => (
                  <div
                    key={i}
                    className={`text-center font-bold text-white p-2 rounded ${
                      i % 2 === 0 ? 'bg-black/30' : 'bg-black/60'
                    }`}
                  >
                    {filename}
                  </div>
                ))
              )}
            </div>
            <label className="bg-yellow-500 text-white w-full h-16 mt-4 rounded-2xl flex items-center justify-center cursor-pointer">
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
            <h1 className="text-2xl font-bold text-white border-b-2 border-white p-2">Playready CDMs</h1>
            <div className="flex flex-col w-full bg-white/5 grow rounded-2xl mt-2 text-white text-left p-2">
              {prList.length === 0 ? (
                <div className="text-white text-center font-bold">No Playready CDMs uploaded.</div>
              ) : (
                prList.map((filename, i) => (
                  <div
                    key={i}
                    className={`text-center font-bold text-white p-2 rounded ${
                      i % 2 === 0 ? 'bg-black/30' : 'bg-black/60'
                    }`}
                  >
                    {filename}
                  </div>
                ))
              )}
            </div>
            <label className="bg-yellow-500 text-white w-full h-16 mt-4 rounded-2xl flex items-center justify-center cursor-pointer">
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
    </div>
  );
}

export default MyAccount;
