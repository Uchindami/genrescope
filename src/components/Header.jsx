import React from 'react'
import {ReactComponent as Logo} from '../assets/images/genrescope.svg';


const Header = ({title}) => {
    return (
        <header className="relative">
            <Background/>
            <Nav title={title}/>
        </header>
    )
}

export const Nav = ({title}) => {
    return (
        <div className="relative flex items-center pr-1.5 lg:pt-5 justify-between text-xl z-20 ">
            <div className="flex items-center">
                <span>
                    <Logo width={"70px"} height={"70px"}/>
                </span>
                <span>
                    {title}
                </span>
            </div>
            <div className="flex items-center">
                <a
                    href="https://github.com/Uchindami"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="sr-only">GitHub</span>
                    <svg
                        viewBox="0 0 16 16"
                        className="w-5 h-5"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                </a>
                <a
                    href="https://twitter.com"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="sr-only">Twitter</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        className="w-5 h-5"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814a11.874 11.874 0 0 1-8.62-4.37a4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101a4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732a11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9c0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
                            fill="currentColor"
                        />
                    </svg>
                </a>
                <a
                    href="https://www.linkedin.com/in/manfred-chirambo/"
                    className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                    <span className="sr-only">YouTube</span>
                    <svg
                        type="color-fill-current"
                        className="w-6 h-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <g>
                            <path
                                fillRule="evenodd"
                                d="M8.16 12.676V7.323L12.863 10 8.16 12.676zm10.464-7.037a2.26 2.26 0 00-1.592-1.602C15.628 3.659 10 3.659 10 3.659s-5.628 0-7.032.378a2.261 2.261 0 00-1.591 1.602C1 7.052 1 9.999 1 9.999s0 2.948.377 4.36c.207.78.817 1.394 1.59 1.603 1.405.38 7.033.38 7.033.38s5.628 0 7.032-.38a2.262 2.262 0 001.592-1.602C19 12.947 19 10 19 10s0-2.948-.376-4.361z"
                                clipRule="evenodd"
                            />
                        </g>
                    </svg>
                </a>
            </div>
        </div>
    )
}

export const Hero = () => {
    return (
        <div className="relative pt-20 sm:pt-24 lg:pt-20">
            <h1 className="font-extrabold px-4 text-4xl sm:text-5xl lg:text-6xl text text-center">
                let Genrescope{" "}
                <code className="font-medium ">judge</code>{" "}
                your music.
            </h1>
            <p className="mt-6 text-lg pt-5 text-center">
                <code className="font-medium=">Genrescope blends the genius of{" "}
                    <code className={"text-headings-sm"}>
                        OpenAI(chatGPT-3.5)
                    </code> with you listening data from{" "}
                    <code className={"text-headings-sm"}>
                        Spotify
                    </code>{" "}
                    to describe your personality. Delve into a captivating exploration of your most played songs
                </code>
            </p>
        </div>
    )
}
export const Background = () => {
    return (
        <div
            className=" absolute bg-grid-slate-400/[0.05] bg-bottom border-b border-slate-100/5 bg-primary-body text-headings-mid"
            style={{
                maskImage: "linear-gradient(to bottom, transparent, black)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black)"
            }}
        />
    )
}


export default Header