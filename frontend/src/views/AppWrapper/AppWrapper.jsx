import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { NavBar, HamburgerNavBar } from "../../components/NavBar/NavBar";
import { UserPill } from "../../components/UserPill/UserPill";
import { useLogout, useAPI } from "../../utility/helper";
import { getUserFromToken } from "../../utility/apiRequests";
import { TOKEN_COOKIE } from "../../utility/types";
import styles from "./AppWrapper.module.css";

export const AppWrapper = () => {
    const [cookies] = useCookies(TOKEN_COOKIE);
    const processLogout = useLogout();
    const [showToast, setShowToast] = useState();

    const { data: currentUser, error, callback } = useAPI(getUserFromToken, [], true);

    useEffect(() => {
        cookies[TOKEN_COOKIE] && callback();
    }, [cookies]);

    useEffect(() => {
        if (!cookies[TOKEN_COOKIE]) processLogout();
    }, [cookies, processLogout]);

    useEffect(() => {
        if (showToast) {
            showToast.success && toast.success(showToast.success);
            showToast.error && toast.error(showToast.error);
            setShowToast(undefined);
        }
    }, [showToast]);

    if (error) return <ErrorMessage error={error} />;
    if (currentUser)
        return (
            <>
                <header className={styles.header}>
                    <HamburgerNavBar
                        systemRole={currentUser.system_role}
                        className={styles.hamburger}
                    />
                    <UserPill
                        systemRole={currentUser.system_role}
                        email={currentUser.email}
                        className={styles.userPill}
                    />
                </header>
                <NavBar systemRole={currentUser.system_role} className={styles.nav} />
                <div className={styles.content}>
                    <Outlet context={[currentUser, setShowToast]} />
                </div>
            </>
        );
    return <LoadingPlaceholder />;
};
