import React from "react";
import queryString from "query-string";
import {Hero, Nav} from "../components/Header";
import {Button} from "@material-tailwind/react";
import SimpleFooter from "../components/Footer";

const LandingPage = () => {
    const clientId = "48afadbf377241ca8ce9e904a37fc73e";
    const redirectUri = "https://genrescope.onrender.com/home";
    const scopes = [
        'ugc-image-upload',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'streaming',
        'app-remote-control',
        'user-read-email',
        'user-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-modify-private',
        'user-library-modify',
        'user-library-read',
        'user-top-read',
        'user-read-playback-position',
        'user-read-recently-played',
        'user-follow-read',
        'user-follow-modify'
    ];

    const AUTH_URL = `https://accounts.spotify.com/authorize?${queryString.stringify({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes.join(" "),
    })}`;


    return (
        <main className="bg-primary-body h-screen w-full text-headings-mid">
            <div className="px-4 sm:px-6 flex-col items-center md:px-8">
                <Nav title={"Genrescope"}/>
                <Hero/>
                <div className={"pt-5 grid place-content-center"}>
                    <Button className={"bg-accent self-center"}>
                        <a href={AUTH_URL}>Authorize Spotify</a>
                    </Button>
                </div>
                <SimpleFooter/>
            </div>
        </main>
    );
};


export default LandingPage;
