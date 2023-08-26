
import {useState} from "react";

const LandingHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle("lock-scroll");
    };

    return (
        <header className="mx-auto flex max-w-[73.375rem] items-center justify-between
        p-5 md:py-[2.9375rem] md:px-8 font-Inter text-gray-100">
            <a
                href="#main"
                className="absolute left-0 z-[100] m-3 -translate-x-[150%] bg-soft-blue p-3 text-white transition
                focus:translate-x-0"
            >
                Skip to main content
            </a>
        </header>
    );
};

export default LandingHeader;