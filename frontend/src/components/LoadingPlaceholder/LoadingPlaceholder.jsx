import React from "react";

import styles from "./LoadingPlaceholder.module.css";
import cx from "classnames";

export const LoadingPlaceholder = ({ className, ...rest }) => {
    return (
        <div className={cx(className, styles.ldsRing)} {...rest}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};
