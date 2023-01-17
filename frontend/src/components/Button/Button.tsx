import React from "react";
import cx from "classnames";
import styles from "./Button.module.css";

interface Props extends React.ComponentProps<"button"> {
    loading?: boolean;
}

export const Button = ({
    className,
    children,
    loading = false,
    ...rest
}: Props): React.ReactElement => {
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
