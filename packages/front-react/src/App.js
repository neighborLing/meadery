import React from "react";
import HeaderLayout from "./layouts/HeaderLayout";
import SideBar from "./layouts/SideBar";
import ContentWrapper from "./layouts/ContentWrapper";

function App() {
  return (
    <div>
      <HeaderLayout />
      <SideBar />
      <ContentWrapper />
    </div>
  );
}

export default App;
