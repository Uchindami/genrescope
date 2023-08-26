const asyncHandler = require("express-async-handler");
const SpotifyWebApi = require('spotify-web-api-node');

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

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000/home',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});


const loginUser = asyncHandler(async (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

const callback = asyncHandler(async (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        /*res.send(`Callback Error: ${error}`);*/
        return;
    }

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        /*console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);*/


        console.log(`Successfully retrieved access token. Expires in ${expires_in} s.`);
        res.send(access_token);

/*        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const access_token = data.body['access_token'];

            console.log('The access token has been refreshed!');
            console.log('access_token:', access_token);
            spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);*/
    } catch (error) {
        console.error('Error getting Tokens:', error);
       /* res.send(`Error getting Tokens: ${error}`);*/
    }
});


const getAccessToken = asyncHandler(async (req, res) => {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const token = data.body['access_token'];
    res.send(token);
});

module.exports = {
    callback,
    loginUser,
    getAccessToken,
}