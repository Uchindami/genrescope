import { Route, Routes } from "react-router-dom";
import React from "react";
import { Home, LandingPage, } from "./pages";


const AppRoutes = () => {

    // <Routes>
    //     <Route path="/home" element={(<Home />)}/>
    // </Routes>       <Routes>
    //     <Route path="/" element={(<LandingPage/>)}/>
    // </Routes>
    <Routes>
        <Route path="/" element={(<LandingPage/>)}/>
        <Route path="/home" element={(<Home />)}/>
    </Routes>

}

export default AppRoutes;