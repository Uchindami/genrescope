import Header, {Hero} from "../components/Header";
import Slideshow from "../components/Slideshow";
import React from "react";

const Home = () => {

    return (
        <main className="bg-primary-body-light min-h-screen w-full font-colfaxAIBold
          text-headings-light bg-grid-slate-400/[0.05] md:px-20 lg:px-20">
            <Header title={"Genrescope"}/>
            <Hero/>
            <Slideshow/>
        </main>
    );
};

export default Home;
