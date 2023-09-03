import axios from "axios";
import spotifyService from "./spotifyService";


const getDescription = async (token) => {

    const data = await spotifyService.getTopSongs(token);

    const formattedArray = [];

    for (const artist in data) {
        const songs = data[artist].map((song) => `${song} - ${artist}`);
        formattedArray.push(...songs);
    }

    const songs = formattedArray.join(', ');

    try {
        const response = await axios.get("/generateDescription", {
            params: {
                songs: songs,
            }
        });

        /*console.log(response.data);*/
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const gptServices = {
    getDescription,
}

export default gptServices;