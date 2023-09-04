import Header, {Hero} from "../components/Header";
import Slideshow from "../components/Slideshow";
import React from "react";
import SimpleFooter from "../components/Footer";

const Home = () => {

    return (
        <main className="place-content-center min-h-screen overflow-hidden bg-grid-slate-400/[0.05] bg-bottom border-b
        border-slate-100/5 bg-primary-body text-headings-mid">
            <Header title={"Genrescope"}/>
            <Hero/>
            <Slideshow/>
            <SimpleFooter/>
        </main>
    );
};

export default Home;
