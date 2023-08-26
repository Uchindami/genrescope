import axios from "axios";


const getAccessToken = async (code) => {
    try {
        const response = await axios.get("/callback", {
            params: {
                code: code,
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const getTopGenres = async (accessToken) => {
    const endpoint = 'https://api.spotify.com/v1/me/top/artists';
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.get(endpoint, { headers });
        return response.data.items.reduce((acc, artist) => {
            acc.push(...artist.genres);
            return acc;
        }, []);
    } catch (error) {
        throw new Error('Error fetching top genres');
    }
};

const getUserProfile = async (accessToken) => {
    const endpoint = 'https://api.spotify.com/v1/me';
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.get(endpoint, { headers });
        return {
            email: response.data.email,
            imageUrl: response.data.images.length > 0 ? response.data.images[0].url : null,
        };
    } catch (error) {
        throw new Error('Error fetching user profile');
    }
};

const spotifyService ={
    getAccessToken,
    getTopGenres,
    getUserProfile,
}

export default spotifyService;