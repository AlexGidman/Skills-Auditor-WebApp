import React from "react";
const cx = require("classnames");
const styles = require("./Button.module.css");

interface Props extends React.ComponentProps<"button"> {
    loading: boolean;
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
