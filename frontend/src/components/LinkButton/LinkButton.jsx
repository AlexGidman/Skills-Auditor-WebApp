import React from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import styles from "./LinkButton.module.css";

export const LinkButton = ({ path = "/", name = "Link", className, disabled = false, ...rest }) => {
    return (
        <Link
            className={cx(styles.component, className, disabled && styles.disabled)}
            to={path}
            {...rest}
        >
            {name}
        </Link>
    );
};
