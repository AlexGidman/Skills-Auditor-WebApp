import React from "react";
import { useOutletContext } from "react-router-dom";
import { LinkButton } from "../../components/LinkButton/LinkButton";

import styles from "./MyDetails.module.css";

export const MyDetails = () => {
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser] = useOutletContext();

    return (
        <>
            <header>
                <h1>My Details</h1>
            </header>
            <section className={styles.section}>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>First name</th>
                            <td>{currentUser.firstName}</td>
                        </tr>
                        <tr>
                            <th>Last name</th>
                            <td>{currentUser.lastName}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{currentUser.email}</td>
                        </tr>
                        <tr>
                            <th>Job role</th>
                            <td>{currentUser.jobRole}</td>
                        </tr>
                        <tr>
                            <th>System role</th>
                            <td>{currentUser.systemRole}</td>
                        </tr>
                    </tbody>
                </table>
                <LinkButton
                    className={styles.button}
                    name="Edit user details"
                    path={`/edit/user/${currentUser.id}`}
                />
            </section>
        </>
    );
};
