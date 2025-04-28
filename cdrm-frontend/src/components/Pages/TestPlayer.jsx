import React, { useState, useEffect, useRef } from 'react';
import shaka from 'shaka-player';
import { Helmet } from 'react-helmet'; // Import Helmet

function TestPlayer() {
  const [mpdUrl, setMpdUrl] = useState(''); // State to hold the MPD URL
  const [kids, setKids] = useState(''); // State to hold KIDs (separated by line breaks)
  const [keys, setKeys] = useState(''); // State to hold Keys (separated by line breaks)
  const [headers, setHeaders] = useState(''); // State to hold request headers

  const videoRef = useRef(null); // Ref for the video element
  const playerRef = useRef(null); // Ref for Shaka Player instance

  // Function to update the MPD URL state
  const handleInputChange = (event) => {
    setMpdUrl(event.target.value);
  };

  // Function to update KIDs and Keys
  const handleKidsChange = (event) => {
    setKids(event.target.value);
  };

  const handleKeysChange = (event) => {
    setKeys(event.target.value);
  };

  const handleHeadersChange = (event) => {
    setHeaders(event.target.value);
  };

  // Function to initialize Shaka Player
  const initializePlayer = () => {
    if (videoRef.current) {
      // Initialize Shaka Player only if it's not already initialized
      if (!playerRef.current) {
        const player = new shaka.Player(videoRef.current);
        playerRef.current = player;

        // Add error listener
        player.addEventListener('error', (event) => {
          console.error('Error code', event.detail.code, 'object', event.detail);
        });
      }
    }
  };

  // Function to handle submit and configure player with DRM keys and headers
  const handleSubmit = () => {
    if (mpdUrl && kids && keys) {
      // Split the KIDs and Keys by new lines
      const kidsArray = kids.split("\n").map((k) => k.trim());
      const keysArray = keys.split("\n").map((k) => k.trim());

      if (kidsArray.length !== keysArray.length) {
        console.error("The number of KIDs and Keys must be the same.");
        return;
      }

      // Initialize Shaka Player only when the submit button is pressed
      const player = new shaka.Player(videoRef.current);

      // Widevine DRM configuration with the provided KIDs and Keys
      const config = {
        drm: {
          clearKeys: {},
        },
      };

      // Map KIDs to Keys
      kidsArray.forEach((kid, index) => {
        config.drm.clearKeys[kid] = keysArray[index];
      });

      console.log("Configuring player with the following DRM config and headers:", config);

      // Configure the player with ClearKey DRM and custom headers
      player.configure(config);

      // Load the video stream with MPD URL
      player.load(mpdUrl).then(() => {
        console.log('Video loaded');
      }).catch((error) => {
        console.error('Error loading the video', error);
      });
    } else {
      console.error('MPD URL, KIDs, and Keys are required.');
    }
  };

  // Load the video stream whenever the MPD URL changes
  useEffect(() => {
    initializePlayer(); // Initialize the player if it's not initialized already
  }, []); // This effect runs only once on mount

  // Helper function to parse headers from the textarea input
  const parseHeaders = (headersText) => {
    const headersArr = headersText.split('\n');
    const headersObj = {};
    headersArr.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        headersObj[key.trim()] = value.trim();
      }
    });
    return headersObj;
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <Helmet>
        <title>Test Player</title>
      </Helmet>
      <div className="w-full flex flex-col">
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          controls
          className="h-96"
        />
        <input
          type="text"
          value={mpdUrl}
          onChange={handleInputChange}
          placeholder="MPD URL"
          className="border-2 border-rose-700/50 mt-2 text-white p-1 rounded transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-700/50 duration-200"
        />
        <textarea
          placeholder="KIDs (one per line)"
          value={kids}
          onChange={handleKidsChange}
          className="border-2 border-rose-700/50 mt-2 text-white p-1 overflow-y-auto rounded transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-700/50 duration-200"
        />
        <textarea
          placeholder="Keys (one per line)"
          value={keys}
          onChange={handleKeysChange}
          className="border-2 border-rose-700/50 mt-2 text-white p-1 overflow-y-auto rounded transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-700/50 duration-200"
        />
        <textarea
          placeholder="Headers (one per line)"
          value={headers}
          onChange={handleHeadersChange}
          className="border-2 border-rose-700/50 mt-2 text-white p-1 overflow-y-auto rounded transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-700/50 duration-200"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default TestPlayer;
