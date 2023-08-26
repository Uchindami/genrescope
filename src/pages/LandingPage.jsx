import React from "react";
import queryString from "query-string";

const LandingPage = () => {
    const clientId ="48afadbf377241ca8ce9e904a37fc73e";
    const redirectUri = "http://localhost:3000/home";
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
        <div>
            <a href={AUTH_URL}>Authorize Spotify</a>
        </div>
    );
};


export default LandingPage;
