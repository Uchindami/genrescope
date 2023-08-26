import {useEffect, useState} from "react";
import axios from "axios";
import spotifyService from "../features/spotify/spotifyService"

const Home = ({code}) => {
    const [data, setData] = useState(null);
    const [topGenres, setTopGenres] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    let tkn = null;

    useEffect(() => {
        const getAccessToken = async () => {
            try {
               const response =await axios.get("/callback", {
                    params: {
                        code: code,
                    }
                });
               setData(response.data)
                tkn = response.data
            } catch (error) {
                console.error(error);
            }
        }
        getAccessToken().then(r =>
            spotifyService.getTopGenres(tkn)
                .then(genres => {
                    const genreCounts = genres.reduce((acc, genre) => {
                        acc[genre] = (acc[genre] || 0) + 1;
                        return acc;
                    }, {});

                    const totalGenres = genres.length;

                    const sortedGenresWithPercentages = Object.keys(genreCounts).map(genre => ({
                        name: genre,
                        count: genreCounts[genre],
                        percentage: (genreCounts[genre] / totalGenres) * 100,
                    })).sort((a, b) => b.count - a.count);

                    setTopGenres(sortedGenresWithPercentages);
                    spotifyService.getUserProfile(tkn)
                        .then(profile => {
                            setUserProfile(profile);
                        })
                        .catch(error => {
                            console.error('Error fetching user profile:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        );


    }, []);

    if (data === null) {
        return (
            <div>
                <p>.........Loading.........</p>
            </div>
        );
    }

    return (
        <div>
            {userProfile ? (
                <div>
                    <h2>Your Profile</h2>
                    <p>Email: {userProfile.email}</p>
                    {userProfile.imageUrl && <img src={userProfile.imageUrl} alt="Profile" />}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}

            {topGenres.length > 0 ? (
                <div>
                    <h2>Your Top Genres</h2>
                    <ul>
                        {topGenres.map((genre, index) => (
                            <li key={index}>
                                {genre.name} - {genre.count} tracks - {genre.percentage.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading top genres...</p>
            )}
        </div>
    );
};

export default Home;
