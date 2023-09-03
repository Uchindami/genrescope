import {Route, Routes} from "react-router-dom";
import React from "react";
import {Home, LandingPage} from "./pages";


const AppRoutes = () => {

    const code = new URLSearchParams(window.location.search).get("code")

    return code ?(
        <Routes>
            <Route path="/home" element={(<Home />)}/>
        </Routes>
    ) : (
        <Routes>
            <Route path="/" element={(<LandingPage/>)}/>
        </Routes>
    )
}

export default AppRoutes;