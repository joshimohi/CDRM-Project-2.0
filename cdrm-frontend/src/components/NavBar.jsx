import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../assets/icons/home.svg';
import cacheIcon from '../assets/icons/cache.svg';
import apiIcon from '../assets/icons/api.svg';
import testPlayerIcon from '../assets/icons/testplayer.svg';
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
            <div>
                <p className='text-white text-2xl font-bold p-3 text-center mb-5'>
                    <a href='/'>CDRM-Project</a>
                </p>
            </div>

            <div className='overflow-y-auto grow'>
                {/* Static routes */}
                {[{
                    to: '/',
                    label: 'Home',
                    icon: homeIcon,
                    color: 'sky'
                }, {
                    to: '/cache',
                    label: 'Cache',
                    icon: cacheIcon,
                    color: 'emerald'
                }, {
                    to: '/api',
                    label: 'API',
                    icon: apiIcon,
                    color: 'indigo'
                }, {
                    to: '/testplayer',
                    label: 'Test Player',
                    icon: testPlayerIcon,
                    color: 'rose-700'
                }].map(({ to, label, icon, color }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-row p-3 border-l-3 ${
                                isActive
                                    ? `border-l-${color}-500/50 bg-black/50`
                                    : `hover:border-l-${color}-500/50 hover:bg-white/5`
                            }`
                        }
                    >
                        <button className='w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer'>
                            <img src={icon} alt={label} className='w-1/2 cursor-pointer' />
                        </button>
                        <p className='grow text-white md:text-2xl font-bold flex items-center justify-start'>
                            {label}
                        </p>
                    </NavLink>
                ))}
            </div>

            {/* External links */}
            <div className='flex flex-row w-full h-16 self-end bg-black/25'>
                <a
                    href={externalLinks.discord}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-950 group'
                >
                    <img src={discordIcon} alt="Discord" className='w-1/2 group-hover:animate-bounce' />
                </a>
                <a
                    href={externalLinks.telegram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-400 group'
                >
                    <img src={telegramIcon} alt="Telegram" className='w-1/2 group-hover:animate-bounce' />
                </a>
                <a
                    href={externalLinks.gitea}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-1/3 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-green-700 group'
                >
                    <img src={giteaIcon} alt="Gitea" className='w-1/2 group-hover:animate-bounce' />
                </a>
            </div>
        </div>
    );
}

export default NavBar;
