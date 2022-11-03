import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import routes from '../../routes';

function ContentWrapper() {
  return (
    <div className="fixed bottom-4 right-4 top-16 bg-wrapper shadow-default left-72">
      <Suspense>
        <Routes>
          {
            routes.map(route => {
              const { path, Component } = route;
              return <Route path={path} element={<Component />} key={path}></Route>
            })
          }
        </Routes>
      </Suspense>
    </div>
  );
}

export default ContentWrapper;
