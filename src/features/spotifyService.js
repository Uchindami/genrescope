import axios from "axios";

const getAccessToken = async (code) => {
    const token = localStorage.getItem('TOKEN');
    const timeSpan = localStorage.getItem('TOKEN_TIME_SPAN');

    if (token && Date.now() - parseInt(timeSpan) < 3600000) {
        return token;
    }

    try {
        const response = await axios.get("/callback", {
            params: {
                code: code,
            }
        });

        localStorage.setItem('TOKEN', response.data);
        localStorage.setItem('TOKEN_TIME_SPAN', Date.now().toString());

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getTopSongs = async (accessToken) => {
    const endpoint = 'https://api.spotify.com/v1/me/top/tracks';
    const timeRange = 'long_term';
    const limit = 30;
    const offset = 0;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const params = {
        time_range: timeRange,
        limit: limit,
        offset: offset,
    };

    try {
        const response = await axios.get(endpoint, {params, headers});

        const tracks = response.data.items;

        const artistMap = {};

        tracks.forEach(track => {
            const artist = track.artists[0].name;
            const trackName = track.name;

            if (!artistMap[artist]) {
                artistMap[artist] = [];
            }

            artistMap[artist].push(trackName);
        });

        /*console.log(artistMap);*/
        return artistMap;

    } catch (error) {
        console.error(error)
        throw new Error('Error fetching most listened-to genres' + error);
    }
};

const countKeywords = (arrays) => {
    const keywords = ["indie", "rap", "hip hop", "pop", "afro", "rock", "jazz"];
    const keywordCountMap = new Map();

    arrays.forEach((array) => {
        array.forEach((item) => {
            const lowerItem = item.toLowerCase();
            keywords.forEach((keyword) => {
                if (lowerItem.includes(keyword)) {
                    if (keywordCountMap.has(keyword)) {
                        keywordCountMap.set(keyword, keywordCountMap.get(keyword) + 1);
                    } else {
                        keywordCountMap.set(keyword, 1);
                    }
                }
            });
        });
    });

    const result = [];
    keywords.forEach((keyword) => {
        if (keywordCountMap.has(keyword)) {
            const keywordCount = keywordCountMap.get(keyword);
            result.push({[keyword]: keywordCount});
        }
    });

    const resultObject = {};

    result.forEach(item => {
        const key = Object.keys(item)[0];
        resultObject[key] = item[key];
    });

    /*console.log(resultObject);*/
    const totalCount = Object.values(resultObject).reduce((acc, count) => acc + count, 0);

    // Calculate percentages for each genre
    const percentages = {};
    for (const genre in resultObject) {
        const count = resultObject[genre];
        const percentage = (count / totalCount) * 100;
        percentages[genre] = percentage.toFixed(2); // Round to 2 decimal places
    }

    return percentages;
};

const getTopGenres = async (accessToken) => {
    const endpoint = 'https://api.spotify.com/v1/me/top/artists';
    const timeRange = 'long_term';
    const limit = 50;
    const offset = 0;

    const params = {
        time_range: timeRange,
        limit: limit,
        offset: offset,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.get(endpoint, {params, headers});
        const artistItems = response.data.items;

        /*console.log(artistItems);*/
        const genresMap = new Map();

        // Iterate through each artist and their genres
        artistItems.forEach((artist) => {
            artist.genres.forEach((genre) => {
                if (genresMap.has(genre)) {
                    genresMap.get(genre).push(genre);
                } else {
                    genresMap.set(genre, [genre]);
                }
            });
        });

        // Convert the genresMap values to arrays
        return countKeywords(Array.from(genresMap.values()))
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
        const response = await axios.get(endpoint, {headers});

        return {
            data: response.data,
            email: response.data.email,
            imageUrl: response.data.images.length > 0 ? response.data.images[0].url : null,
        };
    } catch (error) {
        throw new Error('Error fetching user profile');
    }
};

const spotifyService = {
    getAccessToken,
    getTopGenres,
    getUserProfile,
    getTopSongs,
}

export default spotifyService;