import React from "react";
import GrihaLogo from "../../assets/Griha.png";

const Loading = () => {
  return (
    <div className=" h-[85vh] w-full flex flex-col items-center justify-center">
      <img
        src={GrihaLogo}
        alt="Griha Logo"
        className="w-[100px] md:w-[100px] mr-2 sm:mr-4"
      ></img>
      <p className="text-2xl font-semibold mt-1 text-black">
        Loading
        <span className="text-6xl">
          ...
        </span>
      </p>
    </div>
  );
};

export default Loading;
