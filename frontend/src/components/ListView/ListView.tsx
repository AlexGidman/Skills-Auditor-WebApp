import React from "react";
import cx from "classnames";
import { Select, SelectOption } from "../Select/Select";
import styles from "./ListView.module.css";

interface Props extends React.ComponentProps<"select"> {
    options: SelectOption[];
    labelText: string;
    totalVisibleItems?: number;
}

export const ListView = ({
    options,
    totalVisibleItems = 5,
    labelText,
    className,
    children,
    ...rest
}: Props) => {
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
