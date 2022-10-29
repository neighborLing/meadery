import React from "react";
import logo from "@/assets/logo.svg";
import "./index.less";

function HeaderLayout() {
  return (
    <div>
      <div className="w-16 h-16">
        <img src={logo} alt="" />
      </div>
    </div>
  );
}

export default HeaderLayout;
