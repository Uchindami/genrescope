import React from "react";
import queryString from "query-string";
import Header, {Hero} from "../components/Header";
import {Button} from "@material-tailwind/react";
import SimpleFooterHome from "../components/FooterHome";
import { Link } from "react-router-dom";

const LandingPage = () => {
    const clientId = "48afadbf377241ca8ce9e904a37fc73e";
    const redirectUri= "https://genrescope.onrender.com/home";
    const scopes = [
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-top-read',
        'user-follow-read',
    ];

    const AUTH_URL = `https://accounts.spotify.com/authorize?${queryString.stringify({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes.join(" "),
    })}`;


    return (
        <div className="relative min-h-screen overflow-hidden bg-primary-body-light font-colfaxAIBold text-headings-light bg-grid-slate-400/[0.05]"
        >
            <div className="flex-col items-center px-1 md:px10 lg:px-10 ">
                <Header title={"Genrescope"}/>
                <Hero/>
                <div className={"pt-10 grid place-content-center"}>
                    <Button 
                    variant="gradient" 
                    size="lg" 
                    className={"transition bg-accent self-center font-colfaxAIRegular hover:-translate-y-1 hover:scale-110 text-white"}>
                        <Link to="/relic" className="text-white">Login with Spotify</Link>
                    </Button>
                </div>
            </div>
            <SimpleFooterHome/> 
        </div>
    );
};


export default LandingPage;
