import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet

function Cache() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cacheData, setCacheData] = useState([]);
    const [keyCount, setKeyCount] = useState(0); // New state to store the key count
    const debounceTimeout = useRef(null);

    // Fetch the key count when the component mounts
    useEffect(() => {
        const fetchKeyCount = async () => {
            try {
                const response = await fetch('/api/cache/keycount');
                const data = await response.json();
                setKeyCount(data.count); // Update key count
            } catch (error) {
                console.error('Error fetching key count:', error);
            }
        };

        fetchKeyCount();
    }, []); // Run only once when the component mounts

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query); // Update the search query
    
        // Clear the previous timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set a new timeout to send the API call after 1 second of no typing
        debounceTimeout.current = setTimeout(() => {
            if (query.trim() !== '') {
                sendApiCall(query); // Only call the API if the query is not empty
            } else {
                setCacheData([]); // Clear results if query is empty
            }
        }, 1000); // 1 second delay
    };

    const sendApiCall = (text) => {
        fetch('/api/cache/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text }),
        })
            .then((response) => response.json())
            .then((data) => setCacheData(data)) // Update cache data with the results
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto p-4">
            <Helmet>
                <title>Cache</title>
            </Helmet>
            <div className="flex flex-col lg:flex-row w-full lg:h-12 items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={`Search ${keyCount} keys...`} // Dynamic placeholder
                    className="lg:grow w-full border-2 border-emerald-500/25 rounded-xl h-10 self-center m-2 text-white p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 ease-in-out"
                />
                <a
                    href="/api/cache/download"
                    className="bg-emerald-500/50 rounded-xl text-white text-bold text-xl p-1 lg:w-1/5 lg:h-10 truncate w-full text-center flex items-center justify-center m-2"
                >
                    Download Cache
                </a>
            </div>
            <div className="w-full grow p-4 border-2 border-emerald-500/50 rounded-2xl mt-5 overflow-y-auto">
                <table className="min-w-full text-white">
                    <thead>
                        <tr>
                            <th className="p-2 border border-black">PSSH</th>
                            <th className="p-2 border border-black">KID</th>
                            <th className="p-2 border border-black">Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cacheData.length > 0 ? (
                            cacheData.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2 border border-black">{item.PSSH}</td>
                                    <td className="p-2 border border-black">{item.KID}</td>
                                    <td className="p-2 border border-black">{item.Key}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-2 border border-black text-center">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cache;
