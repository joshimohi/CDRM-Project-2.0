import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../assets/icons/home.svg';
import cacheIcon from '../assets/icons/cache.svg';
import apiIcon from '../assets/icons/api.svg';
import testPlayerIcon from '../assets/icons/testplayer.svg';
import accountIcon from '../assets/icons/account.svg'; 
import discordIcon from '../assets/icons/discord.svg';
import telegramIcon from '../assets/icons/telegram.svg';
import giteaIcon from '../assets/icons/gitea.svg';

function NavBar() {
    const [externalLinks, setExternalLinks] = useState({
        discord: '#',
        telegram: '#',
        gitea: '#',
    });

    useEffect(() => {
        fetch('/api/links')
            .then(response => response.json())
            .then(data => setExternalLinks(data))
            .catch(error => console.error('Error fetching links:', error));
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-white/1">
            {/* Header */}
            <div>
                <p className="text-white text-2xl font-bold p-3 text-center mb-5">
                    <a href="/">CDRM-Project</a><br /><span className="text-sm">Github Edition</span>
                </p>
            </div>

            {/* Scrollable navigation area */}
            <div className="overflow-y-auto grow flex flex-col">
                {/* Main NavLinks */}
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-row p-3 border-l-3 ${
                            isActive
                                ? 'border-l-sky-500/50 bg-black/50'
                                : 'hover:border-l-sky-500/50 hover:bg-white/5'
                        }`
                    }
                >
                    <button className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer">
                        <img src={homeIcon} alt="Home" className="w-1/2 cursor-pointer" />
                    </button>
                    <p className="grow text-white md:text-2xl font-bold flex items-center justify-start">
                        Home
                    </p>
                </NavLink>

                <NavLink
                    to="/cache"
                    className={({ isActive }) =>
                        `flex flex-row p-3 border-l-3 ${
                            isActive
                                ? 'border-l-emerald-500/50 bg-black/50'
                                : 'hover:border-l-emerald-500/50 hover:bg-white/5'
                        }`
                    }
                >
                    <button className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer">
                        <img src={cacheIcon} alt="Cache" className="w-1/2 cursor-pointer" />
                    </button>
                    <p className="grow text-white md:text-2xl font-bold flex items-center justify-start">
                        Cache
                    </p>
                </NavLink>

                <NavLink
                    to="/api"
                    className={({ isActive }) =>
                        `flex flex-row p-3 border-l-3 ${
                            isActive
                                ? 'border-l-indigo-500/50 bg-black/50'
                                : 'hover:border-l-indigo-500/50 hover:bg-white/5'
                        }`
                    }
                >
                    <button className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer">
                        <img src={apiIcon} alt="API" className="w-1/2 cursor-pointer" />
                    </button>
                    <p className="grow text-white md:text-2xl font-bold flex items-center justify-start">
                        API
                    </p>
                </NavLink>

                <NavLink
                    to="/testplayer"
                    className={({ isActive }) =>
                        `flex flex-row p-3 border-l-3 ${
                            isActive
                                ? 'border-l-rose-500/50 bg-black/50'
                                : 'hover:border-l-rose-500/50 hover:bg-white/5'
                        }`
                    }
                >
                    <button className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer">
                        <img src={testPlayerIcon} alt="Test Player" className="w-1/2 cursor-pointer" />
                    </button>
                    <p className="grow text-white md:text-2xl font-bold flex items-center justify-start">
                        Test Player
                    </p>
                </NavLink>

                {/* Account link at bottom of scrollable area */}
                <div className="mt-auto">
                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `flex flex-row p-3 border-l-3 ${
                                isActive
                                    ? 'border-l-yellow-500/50 bg-black/50'
                                    : 'hover:border-l-yellow-500/50 hover:bg-white/5'
                            }`
                        }
                    >
                        <button className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer">
                            <img src={accountIcon} alt="Account" className="w-1/2 cursor-pointer" />
                        </button>
                        <p className="grow text-white md:text-2xl font-bold flex items-center justify-start">
                            My Account
                        </p>
                    </NavLink>
                </div>
            </div>

            {/* External links at very bottom */}
            <div className="flex flex-row w-full h-16 bg-black/25">
                <a
                    href={externalLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-950 group"
                >
                    <img src={discordIcon} alt="Discord" className="w-1/2 group-hover:animate-bounce" />
                </a>
                <a
                    href={externalLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-400 group"
                >
                    <img src={telegramIcon} alt="Telegram" className="w-1/2 group-hover:animate-bounce" />
                </a>
                <a
                    href={externalLinks.gitea}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-green-700 group"
                >
                    <img src={giteaIcon} alt="Gitea" className="w-1/2 group-hover:animate-bounce" />
                </a>
            </div>
        </div>
    );
}

export default NavBar;
