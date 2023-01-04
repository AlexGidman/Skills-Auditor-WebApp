import React, { useState, useEffect } from "react";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { TextAreaInput } from "../../components/TextAreaInput/TextAreaInput";
import { Select } from "../../components/Select/Select";
import { Button } from "../../components/Button/Button";

import { useAPI, getSelectOptionsFromArray, formatDate } from "../../utility/helper";
import { getStaffSkill, updateStaffSkill, getAllDirectReports } from "../../utility/apiRequests";
import styles from "./EditStaffSkill.module.css";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { SKILL_LEVELS } from "../../utility/types";

export const EditStaffSkill = () => {
    const { staffSkillId } = useParams();
    const [currentUser, setShowToast] = useOutletContext();
    const navigate = useNavigate();

    const { data, loading, error } = useAPI(getStaffSkill, [staffSkillId]);

    const {
        data: directReportsData,
        loading: directReportsLoading,
        error: directReportsError,
    } = useAPI(getAllDirectReports, [currentUser.id]);

    useEffect(() => {
        if (data && currentUser.id !== data.user_id) {
            if (
                !!directReportsError ||
                (!!directReportsData &&
                    !directReportsData.filter((directReport) => {
                        return directReport.report.id.toString() === data.user_id;
                    }))
            ) {
                setShowToast({
                    error: "You are not authorised to edit this user's skills",
                });
                navigate("/");
            }
        }
    }, [currentUser.id, data, directReportsData, directReportsError, navigate, setShowToast]);

    if (loading || directReportsLoading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    return (
        <>
            <header>
                <h1>Edit Staff Skill</h1>
            </header>
            <section>
                <Form data={data} />
            </section>
        </>
    );
};

const Form = ({ data }) => {
    const navigate = useNavigate();
    const [, setShowToast] = useOutletContext();
    const [skillLevel, setSkillLevel] = useState(data.skill_level);
    const [skillNotes, setSkillNotes] = useState(data.notes);

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        error,
        loading,
        callback: updateStaffSkillInfo,
    } = useAPI(updateStaffSkill, [data.id, skillLevel, skillNotes], true);

    useEffect(() => {
        setFormChanged(skillLevel !== data.skill_level || skillNotes !== data.notes);
    }, [data, skillLevel, skillNotes]);

    useEffect(() => {
        if (navigateBack && !loading) {
            error
                ? setShowToast({ error: "Failed to update staff skill" })
                : setShowToast({ success: "Successfully updated staff skill" });
            navigate(-1);
        }
    }, [navigateBack, loading, error, setShowToast, navigate]);

    return (
        <form className={styles.form}>
            <span
                role="status"
                className={styles.item}
                aria-label={
                    data.expiry_date
                        ? `${data.skillID.name} (Expires ${formatDate(data.expiry_date)})`
                        : data.skillID.name
                }
            >
                {data.skillID.name}
                <em>{data.expiry_date ? ` (Expires ${formatDate(data.expiry_date)})` : ""}</em>
            </span>
            <Select
                className={styles.item}
                labelText="Select a level"
                options={getSelectOptionsFromArray([1, 2, 3, 4, 5], SKILL_LEVELS)}
                value={skillLevel}
                onChange={(e) => {
                    setSkillLevel(e.target.value);
                }}
            />
            <TextAreaInput
                labelText="Notes"
                className={styles.item}
                value={skillNotes}
                onChange={(e) => {
                    setSkillNotes(e.target.value);
                }}
            />
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.button}
                    loading={loading}
                    disabled={!formChanged}
                    onClick={(e) => {
                        e.preventDefault();
                        updateStaffSkillInfo();
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
            </div>
        </form>
    );
};
