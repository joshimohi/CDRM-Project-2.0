import { useState } from "react";
import Home from "./components/Pages/HomePage";
import Cache from "./components/Pages/Cache";
import API from "./components/Pages/API";
import TestPlayer from "./components/Pages/TestPlayer";
import NavBar from "./components/NavBar";
import NavBarMain from "./components/NavBarMain";
import SideMenu from "./components/SideMenu"; // Add this import
import Account from "./components/Pages/Account";
import { Routes, Route } from "react-router-dom";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if the menu is open

  return (
    <div id="appcontainer" className="flex flex-row w-full h-full bg-black">
      {/* The SideMenu should be visible when isMenuOpen is true */}
      <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div id="navbarcontainer" className="hidden lg:flex lg:w-2xs bg-gray-950/55 border-r border-white/5 shrink-0">
        <NavBar />
      </div>

      <div id="maincontainer" className="w-full lg:w-5/6 bg-gray-950/50 flex flex-col grow">
        <div id="navbarmaincontainer" className="w-full lg:hidden h-16 bg-gray-950/10 border-b border-white/5  sticky top-0 z-10">
          <NavBarMain setIsMenuOpen={setIsMenuOpen} />
        </div>

        <div id="maincontentcontainer" className="w-full grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cache" element={<Cache />} />
            <Route path="/api" element={<API />} />
            <Route path="/testplayer" element={<TestPlayer />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
