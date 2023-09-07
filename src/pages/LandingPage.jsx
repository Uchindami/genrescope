import React from "react";
import queryString from "query-string";
import Header, {Hero} from "../components/Header";
import {Button} from "@material-tailwind/react";
import SimpleFooter from "../components/Footer";

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
        <main className="absolute inset-0 bg-primary-body-light min-h-screen w-full font-colfaxAIBold
         overflow-hidden text-headings-light bg-grid-slate-400/[0.05] ">
            <div className="flex-col items-center px-1 md:px10 lg:px-10 ">
                <Header title={"Genrescope"}/>
                <Hero/>
                <div className={"pt-10 grid place-content-center"}>
                    <Button className={"bg-accent self-center font-colfaxAIRegular text-white"}>
                        <a href={AUTH_URL}>Authorize Spotify</a>
                    </Button>
                </div>
            </div>
            <SimpleFooter/>
        </main>
    );
};


export default LandingPage;
