import React, {useEffect, useState} from 'react';
import spotifyService from "../features/spotifyService";
import chatServices from "../features/GPTchatService"
import {Typewriter} from 'react-simple-typewriter'
import {Avatar, Card, CardBody, CardFooter, Chip, Spinner, Typography,} from "@material-tailwind/react";
import hero from "../assets/images/user.png"
import {sampleDiscription, sampleTopGenres, sampleUserProfile} from "../assets/SampleData/userProfile";

const Slideshow = () => {
    const [topGenres, setTopGenres] = useState(null);
    const [personDescription, setPersonDescription] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const code = new URLSearchParams(window.location.search).get("code")

    useEffect(() => {
         //Function to get access, user profile, and top genres
         const getAccessAndData = async () => {
             try {
                 const token = await spotifyService.getAccessToken(code);
                 const profile = await spotifyService.getUserProfile(token);
                 setUserProfile(profile);
                 const genre = await spotifyService.getTopGenres(token);
                 setTopGenres(genre)
                 const person = await chatServices.getDescription(token);
                 setPersonDescription(person)
             } catch (error) {
                 console.error(error);
             }
         }

         getAccessAndData();

/*        Testing Sample Data
        setUserProfile(sampleUserProfile)
        setPersonDescription(sampleDiscription)
        setTopGenres(sampleTopGenres)
        */
    }, []);

    /*  console.log(userProfile)*/

    if (personDescription === null) {
        return (
            <div className={"grid justify-items-center content-center"}>
                <Spinner className="self-center h-12 w-12 "/>
            </div>
        );
    }

    return (

        <div className={" sm:flex justify-around md:flex-row py-5 font-colfaxAIRegular"}>

            <div>
                <Card className="m-6 max-w-md grid justify-items-center">
                    <Avatar
                        alt="avatar"
                        src={
                            userProfile.data.images &&
                            userProfile.data.images.length > 1 &&
                            userProfile.data.images[1].url
                                ? userProfile.data.images[1].url
                                : hero
                        }
                        withBorder={true}
                        className="p-1"
                        size="xl"
                    />
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            {userProfile.data.display_name}
                        </Typography>
                        <Typewriter
                            words={[personDescription]}
                            loop={1}
                            cursor={true}
                            cursorStyle='_'
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />

                    </CardBody>
                    <CardFooter className="pt-0 flex-row">
                        <Chip value={`Spotify ${userProfile.data.product}`}/>
                    </CardFooter>
                </Card>
            </div>

            <div>
                <Card className="m-6 max-w-md  grid">
                    <CardBody>
                        <Typography variant="h5" className="mb-2 text-headings-light">
                            Genre Insight 🔍
                        </Typography>
                        <div className="mt-5 gap-10">
                            <div  >
                                <Chip  className={"p-3 m-1"} value={`Rap ${topGenres.rap} %`}/>
                            </div>
                            <div >
                                <Chip  className={"p-3 m-1"} value={`Pop ${topGenres.pop} %`}/>
                            </div>
                            <div >
                                <Chip  className={"p-3 m-1"} value={`Indie ${topGenres.indie} %`}/>
                            </div>
                            <div >
                                <Chip  className={"p-3 m-1"} value={`Rock ${topGenres.rock} %`}/>
                            </div>
                            <div>
                                <Chip className={"p-3 m-1"} value={`Afro ${topGenres.afro} %`}/>
                            </div>
                        </div>
                        <Typography className={"pt-4"}>
                            Dont argue with the Algorithm, go argue with your ancestors
                        </Typography>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
};

export default Slideshow;
