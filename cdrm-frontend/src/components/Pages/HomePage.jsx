import React, { useState, useEffect, useRef } from 'react';
import { readTextFromClipboard } from '../Functions/ParseChallenge';
import { Helmet } from 'react-helmet'; // Import Helmet

function HomePage() {
  const [pssh, setPssh] = useState('');
  const [licurl, setLicurl] = useState('');
  const [proxy, setProxy] = useState('');
  const [headers, setHeaders] = useState('');
  const [cookies, setCookies] = useState('');
  const [data, setData] = useState('');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('default');

  const bottomRef = useRef(null);
  const messageRef = useRef(null); // Reference to result container

  const handleReset = () => {
    if (isVisible) {
      setIsVisible(false);
    }
    setPssh('');
    setLicurl('');
    setProxy('');
    setHeaders('');
    setCookies('');
    setData('');
  };

  const handleSubmitButton = (event) => {
    event.preventDefault();

    fetch('/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pssh: pssh,
        licurl: licurl,
        proxy: proxy,
        headers: headers,
        cookies: cookies,
        data: data,
        device: selectedDevice, // Include selected device in the request
      }),
    })
      .then(response => response.json())
      .then(data => {
        const resultMessage = data['message'].replace(/\n/g, '<br />');
        setMessage(resultMessage);
        setIsVisible(true);
      })
      .catch((error) => {
        console.error('Error during decryption request:', error);
        setMessage('Error: Unable to process request.');
        setIsVisible(true);
      });
  };

  const handleCopy = (event) => {
    event.preventDefault();
    if (messageRef.current) {
      const textToCopy = messageRef.current.innerText; // Grab the plain text (with visual line breaks)
      navigator.clipboard.writeText(textToCopy).catch(err => {
        alert('Failed to copy!');
        console.error(err);
      });
    }
  };

  const handleFetchPaste = () => {
    event.preventDefault();
    readTextFromClipboard().then(() => {
      setPssh(document.getElementById("pssh").value);
      setLicurl(document.getElementById("licurl").value);
      setHeaders(document.getElementById("headers").value);
      setData(document.getElementById("data").value);
    }).catch(err => {
      alert('Failed to paste from fetch!');
    });
  };

  useEffect(() => {
    if (isVisible && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message, isVisible]);

  useEffect(() => {
    fetch('/login/status', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(statusData => {
        if (statusData.message === 'True') {
          return fetch('/userinfo', { method: 'POST' });
        } else {
          throw new Error('Not logged in');
        }
      })
      .then(res => res.json())
      .then(deviceData => {
        const combinedDevices = [
          ...deviceData.Widevine_Devices,
          ...deviceData.Playready_Devices,
        ];

        // Add default devices if logged in
        const allDevices = [
          "CDRM-Project Public Widevine CDM", 
          "CDRM-Project Public PlayReady CDM",
          ...combinedDevices,
        ];

        // Set devices and select a device if logged in
        setDevices(allDevices.length > 0 ? allDevices : []);
        setSelectedDevice(allDevices.length > 0 ? allDevices[0] : 'default');
      })
      .catch(() => {
        // User isn't logged in, set default device to 'default'
        setDevices([]); // Don't display devices list
        setSelectedDevice('default');
      });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full overflow-y-auto p-4 min-h-full">
        <Helmet>
          <title>CDRM-Project</title>
        </Helmet>
        <form className="flex flex-col w-full h-full bg-black/5 p-4 overflow-y-auto">
          <label htmlFor="pssh" className="text-white w-8/10 self-center">PSSH: </label>
          <input
            type="text"
            id="pssh"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl h-10 self-center m-2 text-white p-1"
            value={pssh}
            onChange={(e) => setPssh(e.target.value)}
          />
          <label htmlFor="licurl" className="text-white w-8/10 self-center">License URL: </label>
          <input
            type="text"
            id="licurl"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl h-10 self-center m-2 text-white p-1"
            value={licurl}
            onChange={(e) => setLicurl(e.target.value)}
          />
          <label htmlFor="proxy" className="text-white w-8/10 self-center">Proxy: </label>
          <input
            type="text"
            id="proxy"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl h-10 self-center m-2 text-white p-1"
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
          />
          <label htmlFor="headers" className="text-white w-8/10 self-center">Headers: </label>
          <textarea
            id="headers"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl self-center m-2 text-white p-1 h-48"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />
          <label htmlFor="cookies" className="text-white w-8/10 self-center">Cookies: </label>
          <textarea
            id="cookies"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl self-center m-2 text-white p-1 h-48"
            value={cookies}
            onChange={(e) => setCookies(e.target.value)}
          />
          <label htmlFor="data" className="text-white w-8/10 self-center">Data: </label>
          <textarea
            id="data"
            className="w-8/10 border-2 border-sky-500/25 rounded-xl self-center m-2 text-white p-1 h-48"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          {/* Device Selection Dropdown, only show if logged in */}
          {devices.length > 0 && (
            <>
              <label htmlFor="device" className="text-white w-8/10 self-center">Select Device:</label>
              <select
                id="device"
                className="w-8/10 border-2 border-sky-500/25 rounded-xl h-10 self-center m-2 text-white bg-black p-1"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                {devices.map((device, index) => (
                  <option key={index} value={device}>{device}</option>
                ))}
              </select>
            </>
          )}

          <div className="flex flex-col lg:flex-row w-full self-center mt-5 items-center lg:justify-around lg:items-stretch">
            <button
              type="button"
              className="bg-sky-500/50 rounded-xl text-white text-bold text-xl p-1 lg:w-1/5 lg:h-12 truncate w-1/2"
              onClick={handleSubmitButton}
            >
              Submit
            </button>
            <button onClick={handleFetchPaste} className="bg-yellow-500/50 rounded-xl text-white text-bold text-xl p-1 lg:w-1/5 lg:h-12 truncate mt-5 w-1/2 lg:mt-0">
              Paste from fetch
            </button>
            <button
              type="button"
              className="bg-red-500/50 rounded-xl text-white text-bold text-xl p-1 lg:w-1/5 lg:h-12 truncate mt-5 w-1/2 lg:mt-0"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {isVisible && (
        <div id="main_content" className="flex-col w-full h-full p-10 items-center justify-center self-center">
          <div className="flex flex-col w-full h-full overflow-y-auto items-center">
            <div className='w-8/10 grow p-4 text-white text-bold text-center text-xl md:text-3xl border-2 border-sky-500/25 rounded-xl bg-black/5'>
              <p className="w-full border-b-2 border-white/75 pb-2">Results:</p>
              <p
                className="w-full grow pt-10 break-words overflow-y-auto"
                ref={messageRef}
                dangerouslySetInnerHTML={{ __html: message }}
              />
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full self-center mt-5 items-center lg:justify-around lg:items-stretch">
            <button
              className="bg-green-500/50 rounded-xl text-white text-bold text-xl p-1 lg:w-1/5 lg:h-12 truncate w-1/2"
              onClick={handleCopy}
            >
              Copy Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
