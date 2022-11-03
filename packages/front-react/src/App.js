import React from "react";
import HeaderLayout from "./layouts/HeaderLayout";
import SideBar from "./layouts/SideBar";
import ContentWrapper from "./layouts/ContentWrapper";
import {
  BrowserRouter as Router,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <HeaderLayout />
      <SideBar />
      <ContentWrapper />
    </Router>
  );
}

export default App;
