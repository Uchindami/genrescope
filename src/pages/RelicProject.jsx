import React from "react";
import { Link } from "react-router-dom";
import SimpleFooter from "../components/Footer";
import SendMessage from "../components/SendMessage";
import Header from "../components/Header";

const RelicProject = () => {
  return (
    <div className="absolute min-h-screen ">
      <div className="bg-primary-body min-h-screen  font-colfaxAIBold text-headings-light">
        <div className="relative translate-y-6  bg-primary-body-light bg-gradient-to-b from-primary-body-light px-20 z-30">
          <Header />
        </div>

        <div className=" flex items-center ">
          <svg
            fill="currentColor"
            role="img"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full z-10"
          >
            <pattern
              id="CheckerDense-pattern-:Rlhlb9l6:"
              x="0"
              y="0"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="1" height="1" fill="#FFF3E1"></rect>
              <rect x="2" y="2" width="1" height="1" fill="#FFF3E1"></rect>
            </pattern>
            <rect
              width="100%"
              height="100%"
              fill="url(#CheckerDense-pattern-:Rlhlb9l6:)"
            ></rect>
          </svg>
          <div className="bg-white p-5 mx-auto text-center py-20 z-20 m-10 rounded-2xl">
            <h1 className="text-6xl font-semibold">Relic Project</h1>
            <p className="text-xl mt-5">
              Sadly this is now a Relic Project
              <p className="text-accent">(I dont mantain it anymore)</p>. <br />
              Is there anything you can do about it? <br />
              No, not really. <br />
              Is there something I can do about it ?<br />
              Yes <br />
              will I ? <br />
              No <br />
              <SendMessage />
              <Link to="/home" className="text-accent"></Link>
            </p>
          </div>
        </div>
        <div className="relative bg-primary-body-light  z-30">
          <SimpleFooter />
        </div>
      </div>
    </div>
  );
};

export default RelicProject;
