import React from "react";
import cx from "classnames";
import styles from "./UserPill.module.css";
import { MANAGER_SR, STAFF_USER, ADMIN } from "../../utility/types";

export const UserPill = ({ email = "No user", systemRole = STAFF_USER, className, ...rest }) => {
    return (
        <div className={cx(styles.component, className)} {...rest}>
            {systemRole === MANAGER_SR && (
                <span
                    role="status"
                    aria-label="You are logged in as a manager"
                    className={styles.manager}
                >
                    MANAGER
                </span>
            )}
            {systemRole === ADMIN && (
                <span
                    role="status"
                    aria-label="You are logged in as an admin"
                    className={styles.admin}
                >
                    ADMIN
                </span>
            )}
            <span role="status" className={styles.pill} aria-label={`${email} is logged in`}>
                {email}
            </span>
        </div>
    );
};
