import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";

import { TextInput } from "../../components/TextInput/TextInput";
import { Select } from "../../components/Select/Select";
import { Button } from "../../components/Button/Button";

import {
    useAPI,
    useIsAdminOrManager,
    getSelectOptionsFromArray,
    getAssignableSystemRoleOptions,
    isValidUser,
} from "../../utility/helper";
import { addUser, addDirectReport } from "../../utility/apiRequests";
import styles from "./AddStaff.module.css";

import { useNavigate, useOutletContext } from "react-router-dom";
import { MIDLEVEL_DEVELOPER, STAFF_USER, JOB_ROLES, User } from "../../utility/types";

export const AddStaff = () => {
    useIsAdminOrManager();
    const navigate = useNavigate();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser, setShowToast] = useOutletContext();
    const [userDetails, setUserDetails] = useImmer<User>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        jobRole: MIDLEVEL_DEVELOPER,
        systemRole: STAFF_USER,
    });
    const [formChanged, setFormChanged] = useState(false);
    const [formValid, setFormValid] = useState(true);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        data: createUserData,
        error: createUserError,
        loading: createUserLoading,
        callback: createUser,
    } = useAPI<User>(addUser, Object.values(userDetails), true);

    const {
        error: createDirectReportError,
        loading: createDirectReportLoading,
        callback: createDirectReport,
    } = useAPI(addDirectReport, [currentUser.id, createUserData ? createUserData?.id : ""], true);

    useEffect(() => {
        // if user created successfully create direct report and navigate
        if (createUserData) {
            createDirectReport();
            setNavigateBack(true);
        }
        // if user create fails, just show a toast error
        if (createUserError) {
            setShowToast({ error: "Failed to create user" });
            navigate("/", { replace: true });
        }
    }, [createUserData, createUserError, navigate, setShowToast]);

    useEffect(() => {
        setFormValid(isValidUser(userDetails) && !!userDetails.password);
        setFormChanged(
            !!userDetails.firstName ||
                !!userDetails.lastName ||
                !!userDetails.email ||
                !!userDetails.password ||
                !!userDetails.jobRole ||
                !!userDetails.systemRole,
        );
    }, [userDetails]);

    useEffect(() => {
        if (navigateBack && !createDirectReportLoading) {
            createDirectReportError
                ? setShowToast({ error: "Failed to add user as direct report" })
                : setShowToast({ success: "Successfully added user as direct report" });
            navigate(-1);
        }
    }, [createDirectReportError, createDirectReportLoading, navigate, navigateBack, setShowToast]);

    return (
        <>
            <header>
                <h1>Add Staff</h1>
            </header>
            <section>
                <form className={styles.form}>
                    <TextInput
                        labelText="First name"
                        className={styles.item}
                        value={userDetails.firstName}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.firstName = event.target.value;
                            });
                        }}
                        required
                    />
                    <TextInput
                        labelText="Last name"
                        className={styles.item}
                        value={userDetails.lastName}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.lastName = event.target.value;
                            });
                        }}
                        required
                    />
                    <TextInput
                        labelText="Password"
                        className={styles.item}
                        value={userDetails.password}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.password = event.target.value;
                            });
                        }}
                        type="password"
                    />
                    <Select
                        options={getSelectOptionsFromArray(JOB_ROLES)}
                        labelText="Job role"
                        className={styles.item}
                        value={userDetails.jobRole}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.jobRole = event.target.value;
                            });
                        }}
                        required
                    />
                    <TextInput
                        labelText="Email"
                        className={styles.item}
                        value={userDetails.email}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.email = event.target.value;
                            });
                        }}
                        required
                        type="email"
                        pattern="\S+@\S+\.\S+"
                    />
                    <Select
                        options={getAssignableSystemRoleOptions(currentUser.systemRole)}
                        labelText="System role"
                        className={styles.item}
                        value={userDetails.systemRole}
                        onChange={(event) => {
                            setUserDetails((draft) => {
                                draft.systemRole = event.target.value;
                            });
                        }}
                        required
                    />
                    <Button
                        className={styles.button}
                        loading={createUserLoading || createDirectReportLoading}
                        disabled={!formValid || !formChanged}
                        onClick={(e) => {
                            e.preventDefault();
                            createUser();
                        }}
                    >
                        Add Staff
                    </Button>
                </form>
            </section>
        </>
    );
};
