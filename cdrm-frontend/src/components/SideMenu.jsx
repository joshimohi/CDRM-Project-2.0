import { NavLink } from 'react-router-dom';
import closeIcon from '../assets/icons/close.svg';
import homeIcon from '../assets/icons/home.svg';
import cacheIcon from '../assets/icons/cache.svg';
import apiIcon from '../assets/icons/api.svg';
import testPlayerIcon from '../assets/icons/testplayer.svg';
import discordIcon from '../assets/icons/discord.svg';
import telegramIcon from '../assets/icons/telegram.svg';
import giteaIcon from '../assets/icons/gitea.svg';

function SideMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <div
        className={`flex flex-col fixed top-0 left-0 w-full h-full bg-black transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
        style={{ transitionDuration: '0.3s' }}
      >
        <div className="flex flex-col bg-gray-950/55 h-full">
          <div className="h-16 w-full border-b-2 border-white/5 flex flex-row">
            <div className="w-1/4 h-full"></div>
            <p className="grow text-white md:text-2xl font-bold text-center flex items-center justify-center p-4">
              CDRM-Project
            </p>
            <div className="w-1/4 h-full">
              <button
                className="w-full h-full flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src={closeIcon} alt="Close" className="w-1/2 h-1/2 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex flex-col p-5 w-full space-y-2 flex-grow">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-row items-center gap-3 p-3 border-l-4 ${
                  isActive
                    ? 'border-l-4 border-l-sky-500/50 bg-black/50 text-white'
                    : 'border-transparent hover:border-l-sky-500/50 hover:bg-white/5 text-white/80'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={homeIcon} alt="Home" className="w-5 h-5" />
              <span className="text-lg">Home</span>
            </NavLink>

            <NavLink
              to="/cache"
              className={({ isActive }) =>
                `flex flex-row items-center gap-3 p-3 border-l-4 ${
                  isActive
                    ? 'border-l-emerald-500/50 bg-black/50 text-white'
                    : 'border-transparent hover:border-l-emerald-500/50 hover:bg-white/5 text-white/80'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={cacheIcon} alt="Cache" className="w-5 h-5" />
              <span className="text-lg">Cache</span>
            </NavLink>

            <NavLink
              to="/api"
              className={({ isActive }) =>
                `flex flex-row items-center gap-3 p-3 border-l-4 ${
                  isActive
                    ? 'border-l-indigo-500/50 bg-black/50 text-white'
                    : 'border-transparent hover:border-l-indigo-500/50 hover:bg-white/5 text-white/80'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={apiIcon} alt="API" className="w-5 h-5" />
              <span className="text-lg">API</span>
            </NavLink>

            <NavLink
              to="/testplayer"
              className={({ isActive }) =>
                `flex flex-row items-center gap-3 p-3 border-l-4 ${
                  isActive
                    ? 'border-l-rose-700/50 bg-black/50 text-white'
                    : 'border-transparent hover:border-l-rose-700/50 hover:bg-white/5 text-white/80'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={testPlayerIcon} alt="Test Player" className="w-5 h-5" />
              <span className="text-lg">Test Player</span>
            </NavLink>
          </div>

          <div className="h-16 self-end w-full flex flex-row bg-black/5">
            <a
              href="https://discord.cdrm-project.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/3 h-full flex items-center justify-center hover:bg-blue-950 group"
            >
              <img
                src={discordIcon}
                alt="Discord"
                className="w-full h-2/3 p-1 cursor-pointer group-hover:animate-bounce"
              />
            </a>
            <a
              href="https://telegram.cdrm-project.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/3 h-full flex items-center justify-center hover:bg-blue-400 group"
            >
              <img
                src={telegramIcon}
                alt="Telegram"
                className="w-full h-2/3 p-1 cursor-pointer group-hover:animate-bounce"
              />
            </a>
            <a
              href="https://cdm-project.com/tpd94/cdrm-project"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/3 h-full flex items-center justify-center hover:bg-green-700 group"
            >
              <img
                src={giteaIcon}
                alt="Gitea"
                className="w-full h-2/3 p-1 cursor-pointer group-hover:animate-bounce"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
