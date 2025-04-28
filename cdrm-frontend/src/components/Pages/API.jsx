import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet

const { protocol, hostname, port } = window.location;

let fullHost = `${protocol}//${hostname}`;
if (
  (protocol === 'http:' && port !== '80') ||
  (protocol === 'https:' && port !== '443' && port !== '')
) {
  fullHost += `:${port}`;
}

function API() {
  const [deviceInfo, setDeviceInfo] = useState({
    device_type: '',
    system_id: '',
    security_level: '',
    host: '',
    secret: '',
    device_name: ''
  });

  const [prDeviceInfo, setPrDeviceInfo] = useState({
    security_level: '',
    host: '',
    secret: '',
    device_name: ''
  });

  useEffect(() => {
    // Fetch Widevine info
    fetch('/remotecdm/widevine/deviceinfo')
      .then(response => response.json())
      .then(data => {
        setDeviceInfo({
          device_type: data.device_type,
          system_id: data.system_id,
          security_level: data.security_level,
          host: data.host,
          secret: data.secret,
          device_name: data.device_name
        });
      })
      .catch(error => console.error('Error fetching Widevine info:', error));

    // Fetch PlayReady info
    fetch('/remotecdm/playready/deviceinfo')
      .then(response => response.json())
      .then(data => {
        setPrDeviceInfo({
          security_level: data.security_level,
          host: data.host,
          secret: data.secret,
          device_name: data.device_name
        });
      })
      .catch(error => console.error('Error fetching PlayReady info:', error));
  }, []);

  return (
    <div className="flex flex-col w-full overflow-y-auto p-4 text-white">
      <Helmet>
        <title>API</title>
      </Helmet>
        <details open className='w-full list-none'>
            <summary className='text-2xl'>Sending a decryption request</summary>
            <div className='mt-5 p-5 rounded-lg border-2 border-indigo-500/50'>  
              <pre className='rounded-lg font-mono whitespace-pre-wrap text-white overflow-auto'>
              {`import requests

print(requests.post(
    url='${fullHost}/api/decrypt',
    headers={
        'Content-Type': 'application/json',
    },
    json={
        'pssh': 'AAAAW3Bzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAADsIARIQ62dqu8s0Xpa7z2FmMPGj2hoNd2lkZXZpbmVfdGVzdCIQZmtqM2xqYVNkZmFsa3IzaioCSEQyAA==',
        'licurl': 'https://cwip-shaka-proxy.appspot.com/no_auth',
        'headers': str({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
        })
    }
).json()['message'])`}
              </pre>
            </div>
        </details>
        <details open className='w-full list-none mt-5'>
            <summary className='text-2xl'>Sending a search request</summary>
            <div className='mt-5 border-2 border-indigo-500/50 p-5 rounded-lg'>
            <pre className="rounded-lg font-mono whitespace-pre text-white overflow-x-auto max-w-full p-5">
{`import requests

print(requests.post(
    url='${fullHost}/api/cache/search',
    json={
        'input': 'AAAAW3Bzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAADsIARIQ62dqu8s0Xpa7z2FmMPGj2hoNd2lkZXZpbmVfdGVzdCIQZmtqM2xqYVNkZmFsa3IzaioCSEQyAA=='
    }
).json())`}
</pre>
            </div>
        </details>
        <details open className='w-full list-none mt-5'>
            <summary className='text-2xl'>PyWidevine RemoteCDM info</summary>
            <div className='mt-5 border-2 border-indigo-500/50 p-5 rounded-lg overflow-x-auto'>
                <p>
                    <strong>Device Type:</strong> '{deviceInfo.device_type}'<br />
                    <strong>System ID:</strong> {deviceInfo.system_id}<br />
                    <strong>Security Level:</strong> {deviceInfo.security_level}<br />
                    <strong>Host:</strong> {fullHost}/remotecdm/widevine<br />
                    <strong>Secret:</strong> '{deviceInfo.secret}'<br />
                    <strong>Device Name:</strong> {deviceInfo.device_name}
                </p>
            </div>
        </details>
        <details open className='w-full list-none mt-5'>
            <summary className='text-2xl'>PyPlayready RemoteCDM info</summary>
            <div className='mt-5 border-2 border-indigo-500/50 p-5 rounded-lg overflow-x-auto'>
                <p>
                    <strong>Security Level:</strong> {prDeviceInfo.security_level}<br />
                    <strong>Host:</strong> {fullHost}/remotecdm/playready<br />
                    <strong>Secret:</strong> '{prDeviceInfo.secret}'<br />
                    <strong>Device Name:</strong> {prDeviceInfo.device_name}
                </p>
            </div>
        </details>

    </div>
  );
}

export default API;
