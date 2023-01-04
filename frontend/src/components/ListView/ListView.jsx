import React from "react";
import cx from "classnames";
import { Select } from "../Select/Select";
import styles from "./ListView.module.css";

export const ListView = ({
    options,
    totalVisibleItems = 5,
    labelText,
    className,
    children,
    ...rest
}) => {
    return (
        <Select
            options={options}
            labelText={labelText}
            className={cx(styles.component, className)}
            size={totalVisibleItems}
            {...rest}
        >
            {children}
        </Select>
    );
};
