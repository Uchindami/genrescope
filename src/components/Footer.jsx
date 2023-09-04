import { Typography } from "@material-tailwind/react";
import Flag from "../images/malawi.png"
export function SimpleFooter() {
    return (
        <footer className=" border shadow-2xl flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12
         py-6 text-center md:justify-between text-headings-mid">
            <Typography className="font-normal">
                &copy; 2023 Uchindami
            </Typography>
            Made With 💙 From
            <Typography className="font-normal">
                <img
                    className="h-5 w-5"
                    src={Flag}
                    alt="nature image"
                />

            </Typography>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="https://uchindami.github.io/"
                        color="gray"
                        className="font-normal transition-colors hover:text-purple-200 focus:text-deep-purple-700"
                    >
                            About Us
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="gray"
                        className="font-normal transition-colors hover:text-purple-200 focus:text-deep-purple-700"
                    >
                        License
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="https://github.com/Uchindami/"
                        color="gray"
                        className="font-normal transition-colors hover:text-purple-200 focus:text-deep-purple-700"
                    >
                        Contribute
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="https://uchindami.github.io/"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-purple-200 focus:text-deep-purple-700"
                    >
                        Contact Us
                    </Typography>
                </li>
            </ul>
        </footer>
    );
}

export default SimpleFooter