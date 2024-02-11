import Flag from "../assets/images/malawi.png";
import React from "react";
import { ButtonGroup, Button } from "@material-tailwind/react";

export function SimpleFooterHome() {
  return (
    <footer className=" absolute bottom-0 m-1 flex w-screen p-2 items-center pr-1.5 justify-between z-20 ">
      <div className="flex justify-around items-center font-colfaxAIRegular">
        <img
          src={Flag}
          className={"m-1"}
          alt={"Malawian Flag"}
          width={30}
          height={30}
        />
        <span></span>
      </div>
      <ButtonGroup variant="text">
        <Button>
          <a
            href="https://uchindami.github.io/"
            className="ml-6 block text-slate-400  hover:text-slate-500 dark:hover:text-slate-300"
          >
            <span className="">About</span>
          </a>
        </Button>
        <Button>
          <a
            href="https://twitter.com"
            className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
          >
            <span className="">Twitter</span>
          </a>
        </Button>
        <Button>
          <a
            href="https://www.linkedin.com/in/manfred-chirambo/"
            className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
          >
            <span className="">LinkedIn</span>
          </a>
        </Button>
      </ButtonGroup>
    </footer>
  );
}

export default SimpleFooterHome;
