import React from "react";
import logo from "@/assets/logo.svg";
import "./index.less";
import {
  Link
} from "react-router-dom";

function HeaderLayout() {
  return (
    <div className="px-4 py-2 h-12 bg-wrapper shadow-default">
      <div className="w-8 h-8">
        <img src={logo} alt="" />
            <Link to="/about">About</Link>
            <Link to="/">Home</Link>
      </div>
    </div>
  );
}

export default HeaderLayout;
