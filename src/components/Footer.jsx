import Flag from "../assets/images/malawi.png"
import React from "react";


export function SimpleFooter() {
    return (
        <footer className="absolute bottom-0 flex w-screen m-1 p-2 items-center pr-1.5 justify-between">
            <div className="flex justify-around items-center font-colfaxAIRegular">
                <img
                    src={Flag}
                    className={"m-1"}
                    alt={"Malawian Flag"}
                    width={20}
                    height={20}/>
                <span>
        </span>
            </div>
            <div className="flex">
                <a
                    href="https://uchindami.github.io/"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="">About</span>
                </a>
                <a
                    href="https://twitter.com"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="">Twitter</span>
                </a>
                <a
                    href="https://www.linkedin.com/in/manfred-chirambo/"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="">LinkedIn</span>
                </a>
            </div>
        </footer>
    )
}

export default SimpleFooter