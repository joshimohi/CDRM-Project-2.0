import { useState } from "react";
import hamburgerIcon from "../assets/icons/hamburger.svg";

function NavBarMain({ setIsMenuOpen }) {
  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState); // Toggle the menu state
  };

  return (
    <div className="flex flex-row w-full h-full bg-white/1">
      <button className="w-24 p-4" onClick={handleMenuToggle}>
        <img src={hamburgerIcon} alt="Menu" className="w-full h-full cursor-pointer" />
      </button>
      <p className="grow text-white md:text-2xl font-bold text-center flex flex-col items-center justify-center p-4">
        CDRM-Project<br />
        <span className="text-sm">Github Edition</span>
      </p>
      <div className="w-24 p-4"></div>
    </div>
  );
}

export default NavBarMain;
