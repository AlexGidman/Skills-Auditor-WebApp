import React from "react";

import styles from "./Homepage.module.css";

export const Homepage = () => {
    return (
        <>
            <header className={styles.header}>
                <h1>Welcome to Skills Auditor!</h1>
            </header>
            <section className={styles.welcomeMessage}>
                Click on navigation options to view details, add skills, and optimise your team
            </section>
        </>
    );
};
