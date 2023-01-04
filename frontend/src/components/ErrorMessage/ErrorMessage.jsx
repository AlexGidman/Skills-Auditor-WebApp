import React from "react";
import cx from "classnames";
import styles from "./ErrorMessage.module.css";

export const ErrorMessage = ({ error, className }) => {
    const errorMessage = error && error.message;
    return (
        <div
            role="alert"
            aria-label={errorMessage || ""}
            className={cx(styles.component, className)}
        >
            <h1>Something went wrong...</h1>
            <p>{errorMessage || ""}</p>
        </div>
    );
};
