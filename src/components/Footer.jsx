import { Typography } from "@material-tailwind/react";
import Flag from "../images/malawi.png"
export function SimpleFooter() {
    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
            <Typography color="blue-gray" className="font-normal">
                &copy; 2023 Uchindami
            </Typography>
            <Typography color="blue-gray" className="font-normal">
               Made With 💙 From {Flag}
            </Typography>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="https://uchindami.github.io/"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                            About Us
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        License
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="https://github.com/Uchindami/"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        Contribute
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="https://uchindami.github.io/"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        Contact Us
                    </Typography>
                </li>
            </ul>
        </footer>
    );
}

export default SimpleFooter