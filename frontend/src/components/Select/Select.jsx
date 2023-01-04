import React from "react";
import { v4 as uuidv4 } from "uuid";
import { hyphenate } from "../../utility/helper";
import styles from "./Select.module.css";
import cx from "classnames";

export const Select = ({ options, labelText = "", className, children, ...rest }) => {
    const id = `${hyphenate(labelText)}-${uuidv4()}`;
    if (!options) {
        options = [{ label: "-", value: "" }];
    }
    return (
        <div className={cx(styles.component, className)}>
            <label htmlFor={id} className={styles.label}>
                {labelText}:
            </label>
            <select className={styles.select} name={labelText} aria-label={labelText} {...rest}>
                {options.map((option) => {
                    return (
                        <option key={`${id}-${option.value}`} value={option.value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
