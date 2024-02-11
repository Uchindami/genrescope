import NotFoundPage from "./pages/NotFoundPage";
import RelicProject from "./pages/RelicProject";
import { Home, LandingPage, } from "./pages";
import { Route, Routes } from "react-router-dom";
import React from "react";

function App() {
    return (
        <Routes>
            <Route path="/" element={(<LandingPage />)} />
            <Route path="/home" element={(<Home />)} />
            <Route path="*" element={(<NotFoundPage />)} />
            <Route path="/relic" element={(<RelicProject />)} />
        </Routes>
    );
}

export default App;
