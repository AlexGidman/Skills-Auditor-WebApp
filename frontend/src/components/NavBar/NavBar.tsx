import React, { useState } from "react";
import { LinkButton } from "../LinkButton/LinkButton";
import { Button } from "../Button/Button";

import { STAFF_USER, MANAGER_SR, ADMIN } from "../../utility/types";
import { Hamburger, Logo } from "../../icons";

import styles from "./NavBar.module.css";
import cx from "classnames";
import { hyphenate, useLogout } from "../../utility/helper";

const navLinks = [
    {
        name: "Home",
        path: "/",
        auth: [STAFF_USER, MANAGER_SR, ADMIN],
    },
    {
        name: "My Details",
        path: "/mydetails",
        auth: [STAFF_USER, MANAGER_SR, ADMIN],
    },
    {
        name: "My Skills",
        path: "/myskills",
        auth: [STAFF_USER, MANAGER_SR, ADMIN],
    },
    {
        name: "View Staff",
        path: "/viewstaff",
        auth: [MANAGER_SR, ADMIN],
    },
    {
        name: "Add Staff",
        path: "/addstaff",
        auth: [MANAGER_SR, ADMIN],
    },
    {
        name: "View Skills",
        path: "/viewskills",
        auth: [MANAGER_SR, ADMIN],
    },
    {
        name: "Add Skill",
        path: "/addskill",
        auth: [MANAGER_SR, ADMIN],
    },
    {
        name: "View Categories",
        path: "/viewcategories",
        auth: [MANAGER_SR, ADMIN],
    },
];

interface Props extends React.ComponentProps<"nav"> {
    systemRole: string; // TODO: change this type when system role changes
}

export const NavBar = ({ systemRole, className, ...rest }: Props): React.ReactElement => {
    const processLogout = useLogout();

    return (
        <nav className={cx(styles.component, className)} {...rest}>
            <Logo className={styles.logo} aria-hidden />
            <ul>
                {navLinks.map((link, index) => {
                    if (link.auth.includes(systemRole)) {
                        return (
                            <li
                                className={styles.listItem}
                                key={`nav-${hyphenate(link.name)}-${index}`}
                            >
                                <LinkButton
                                    path={link.path}
                                    name={link.name}
                                    className={styles.link}
                                />
                            </li>
                        );
                    }
                    return null;
                })}
                <li className={styles.listItem}>
                    <Button
                        className={styles.signoutButton}
                        name="Sign Out"
                        onClick={() => processLogout()}
                    >
                        Sign out
                    </Button>
                </li>
            </ul>
        </nav>
    );
};

export const HamburgerNavBar = ({ systemRole, className, ...rest }: Props): React.ReactElement => {
    const [menuVisible, setMenuVisible] = useState(false);
    const processLogout = useLogout();

    return (
        <nav className={className} {...rest}>
            <button
                className={cx(styles.button, menuVisible && styles.active)}
                onClick={() => setMenuVisible(!menuVisible)}
                aria-label={"Navigation"}
            >
                <Hamburger className={styles.hamburgerIcon} aria-hidden />
            </button>
            <ul className={cx(styles.hamburgerLinks, menuVisible ? styles.visible : styles.hidden)}>
                {navLinks.map((link, index) => {
                    if (link.auth.includes(systemRole)) {
                        return (
                            <li
                                className={styles.listItem}
                                key={`hamburger-${hyphenate(link.name)}-${index}`}
                            >
                                <LinkButton
                                    path={link.path}
                                    name={link.name}
                                    onClick={() => setMenuVisible(false)}
                                />
                            </li>
                        );
                    }
                    return null;
                })}
                <li className={styles.listItem}>
                    <Button
                        className={styles.signoutButton}
                        name="Sign Out"
                        onClick={() => processLogout()}
                    >
                        Sign out
                    </Button>
                </li>
            </ul>
        </nav>
    );
};
