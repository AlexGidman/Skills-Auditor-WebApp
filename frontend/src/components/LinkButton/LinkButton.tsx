import React from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import styles from "./LinkButton.module.css";

interface Props
    extends React.ComponentProps<"a">,
        Pick<React.ComponentProps<"button">, "disabled"> {
    path?: string;
    name?: string;
}

export const LinkButton = ({
    path = "/",
    name = "Link",
    className,
    disabled = false,
}: Props): React.ReactElement => {
    return (
        <Link className={cx(styles.component, className, disabled && styles.disabled)} to={path}>
            {name}
        </Link>
    );
};
