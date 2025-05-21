

import { useState, useEffect } from "react";

export const Layout2Strip = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div className="w-30 grid h-65 pb-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 "
      style={{boxShadow :shadow ? "none" : undefined,}}
    >
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
    </div>
  );
};

export const Layout3Strip = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div  style={{boxShadow :shadow ? "none" : undefined,}} className="w-30 grid h-100 pb-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 ">
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
    </div>
  );
};

export const Layout4Strip = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div  style={{boxShadow :shadow ? "none" : undefined,}} className="w-30 grid h-120 pb-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 ">
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2.5 mt-2.5 bg-black rounded-xl"></div>
    </div>
  );
};

export const Layout4Grid = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div  style={{boxShadow :shadow ? "none" : undefined,}} className="w-70 grid grid-cols-2 h-70 pb-8 px-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 ">
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
    </div>
  );
};

export const Layout6Grid = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div  style={{boxShadow :shadow ? "none" : undefined,}} className="w-70 grid grid-cols-2 h-100 pb-8 px-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 ">
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
    </div>
  );
};

export const Layout9Grid = () => {
  const [shadow, setShadow] = useState<boolean | undefined>(true)

  useEffect(() => {
   setTimeout(() => setShadow(false), 1500 )
  },[]) 
  

  return (
    <div  className="grid w-100 grid-cols-3 h-100 pb-8 px-5 bg-white rounded-xl shadow-xl ease-in-out    shadow-pink-400 hover:scale-105 hover:shadow-purple-400 duration-700 "
    style={{boxShadow :shadow ? "none" : undefined,}}
    >
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
      <div className="w-25 h-25 mx-2 mt-5 bg-black rounded-xl"></div>
    </div>
  );
};
