import hamburger from "./hamburger.svg";
import logo from "./logo.svg";
import meme from "./Meme.gif";

const imagise = (src, alt) => {
    const reactImage = ({ ...rest }) => {
        return <img src={src} alt={alt} {...rest} />;
    };
    return reactImage;
};

export const Hamburger = imagise(hamburger, "menu");
export const Logo = imagise(logo, "logo");
export const Meme = meme;
