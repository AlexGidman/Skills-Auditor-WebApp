import React from "react";

import styles from "./Button.module.css";
import cx from "classnames";

export const Button = ({ className, children, loading = false, ...rest }) => {
    const { disabled } = rest;
    return (
        <button
            className={cx(styles.component, className, loading && styles.loading)}
            disabled={loading || disabled}
            {...rest}
        >
            {children}
        </button>
    );
};
