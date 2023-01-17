import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";

import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/TextInput/TextInput";
import { Select } from "../../components/Select/Select";

import { useAPI, getAssignableSystemRoleOptions } from "../../utility/helper";
import { getUserDetails, getAllDirectReports, updateUserDetails } from "../../utility/apiRequests";
import { DirectReport, jobRoleS, User } from "../../utility/types";
import { getSelectOptionsFromArray, isValidUser } from "../../utility/helper";
import styles from "./EditUserDetails.module.css";

export const EditUserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser, setShowToast] = useOutletContext();

    const {
        data: directReportsData,
        loading: directReportsLoading,
        error: directReportsError,
    } = useAPI<DirectReport[]>(getAllDirectReports, [currentUser.id]);

    useEffect(() => {
        if (userId && currentUser.id.toString() !== userId.toString()) {
            if (
                !!directReportsError ||
                (!!directReportsData &&
                    !directReportsData.filter((directReport) => {
                        return directReport?.report?.id?.toString() === userId.toString();
                    }).length)
            ) {
                setShowToast({
                    error: "You are not authorised to edit this user",
                });
                navigate("/");
            }
        }
    }, [currentUser.id, directReportsData, directReportsError, navigate, setShowToast, userId]);

    const { data, loading, error } = useAPI<User>(getUserDetails, [userId]);
    if (loading || directReportsLoading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    if (data)
        return (
            <>
                <header>
                    <h1>Edit User Details</h1>
                </header>
                <section>
                    <Form data={data} />
                </section>
            </>
        );
    return null;
};

interface FormProps {
    data: User;
}

const Form = ({ data }: FormProps) => {
    const navigate = useNavigate();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser, setShowToast] = useOutletContext();
    const [userDetails, setUserDetails] = useImmer({
        id: data?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        password: "",
        jobRole: data?.jobRole,
        systemRole: data.systemRole,
    });
    const [formChanged, setFormChanged] = useState(false);
    const [formValid, setFormValid] = useState(true);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        error,
        loading,
        callback: updateDetails,
    } = useAPI(updateUserDetails, Object.values(userDetails), true);

    useEffect(() => {
        setFormValid(isValidUser(userDetails));
        setFormChanged(
            userDetails.firstName !== data.firstName ||
                userDetails.lastName !== data.lastName ||
                userDetails.email !== data.email ||
                !!userDetails.password ||
                userDetails.jobRole !== data.jobRole ||
                userDetails.systemRole !== data.systemRole,
        );
    }, [userDetails, data]);

    useEffect(() => {
        if (navigateBack && !loading) {
            error
                ? setShowToast({ error: "Failed to update user" })
                : setShowToast({ success: "Successfully updated user" });
            navigate(-1);
        }
    }, [error, loading, navigate, navigateBack, setShowToast]);

    return (
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
                labelText="New password"
                className={styles.item}
                value={userDetails.password}
                onChange={(event) => {
                    setUserDetails((draft) => {
                        draft.password = event.target.value;
                    });
                }}
                type="password"
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
            <Select
                options={getSelectOptionsFromArray(jobRoleS)}
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
                loading={loading}
                disabled={!formValid || !formChanged}
                onClick={(e) => {
                    e.preventDefault();
                    updateDetails();
                    setNavigateBack(true);
                }}
            >
                Save changes
            </Button>
            <Button
                className={styles.button}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                }}
            >
                Cancel
            </Button>
        </form>
    );
};
