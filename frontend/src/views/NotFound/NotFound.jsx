import React from "react";
import styles from "./NotFound.module.css";
import { Logo, Meme } from "../../icons";

export const NotFound = () => {
    console.error("Page not found", 404);
    return (
        <>
            <header className={styles.header}>
                <Logo className={styles.logo} aria-hidden alt="Logo" />
            </header>
            <section>
                <h1 alt="404 error">404 Error, you seem a little lost.</h1>
                <div className={styles.gifHolder}>
                    <img src={Meme} className={styles.gif} alt="The Weekend lost meme" />
                </div>
            </section>
        </>
    );
};
