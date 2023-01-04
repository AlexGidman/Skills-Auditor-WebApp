import React from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./TextInput.module.css";
import cx from "classnames";

import { hyphenate } from "../../utility/helper";

export const TextInput = ({ labelText, className, children, ...rest }) => {
    const id = `${hyphenate(labelText)}-${uuidv4()}`;

    return (
        <div className={cx(styles.component, className)}>
            <label htmlFor={id} className={styles.label}>
                {labelText}:
            </label>
            <input
                id={id}
                minLength={0}
                maxLength={100}
                pattern="[a-zA-ZÀ-ȕ-]+$"
                {...rest}
                className={styles.input}
            />
        </div>
    );
};
