import React from "react";
import { useOutletContext } from "react-router-dom";
import { LinkButton } from "../../components/LinkButton/LinkButton";

import styles from "./MyDetails.module.css";

export const MyDetails = () => {
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
                            <td>{currentUser.forename}</td>
                        </tr>
                        <tr>
                            <th>Last name</th>
                            <td>{currentUser.surname}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{currentUser.email}</td>
                        </tr>
                        <tr>
                            <th>Job role</th>
                            <td>{currentUser.job_role}</td>
                        </tr>
                        <tr>
                            <th>System role</th>
                            <td>{currentUser.system_role}</td>
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
