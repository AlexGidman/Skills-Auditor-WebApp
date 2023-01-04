import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/TextInput/TextInput";
import { TextAreaInput } from "../../components/TextAreaInput/TextAreaInput";
import { Select } from "../../components/Select/Select";
import {
    useAPI,
    getSelectOptionsFromArray,
    convertSkillLevelName,
    isValidString,
} from "../../utility/helper";

import styles from "./AddStaffSkill.module.css";
import { getAllSkills, addUserSkill, getAllDirectReports } from "../../utility/apiRequests";
import { SKILL_LEVELS } from "../../utility/types";

export const AddStaffSkill = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [currentUser, setShowToast] = useOutletContext();

    const {
        data: directReportsData,
        loading: directReportsLoading,
        error: directReportsError,
    } = useAPI(getAllDirectReports, [currentUser.id]);

    useEffect(() => {
        if (userId) {
            if (
                !!directReportsError ||
                (!!directReportsData &&
                    !directReportsData.filter((directReport) => {
                        return directReport.report.id == userId;
                    }))
            ) {
                setShowToast({
                    error: "You are not authorised to edit this users skills",
                });
                navigate("/");
            }
        }
    }, [currentUser.id, directReportsData, directReportsError, navigate, setShowToast, userId]);

    const { data, loading, error } = useAPI(getAllSkills);

    if (loading || directReportsLoading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;

    const sortedSkills = data.sort((a, b) => a.name.localeCompare(b.name));
    return (
        <>
            <header className={styles.content}>
                <h1>Add Staff Skill</h1>
            </header>
            <section>
                <Form data={sortedSkills} userId={userId ? parseInt(userId) : currentUser.id} />
            </section>
        </>
    );
};

const Form = ({ data, userId }) => {
    const [, setShowToast] = useOutletContext();
    const [skillLevelValue, setskillLevelValue] = useState();
    const [inputValues, setInputValues] = useImmer({
        user_id: userId,
        skill_id: data ? data[0].id : null,
        skill_level: convertSkillLevelName(SKILL_LEVELS[0]),
        notes: "",
        expiry_date: null,
    });

    const navigate = useNavigate();

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        data: addData,
        error,
        loading,
        callback: executeStaffAddSkill,
    } = useAPI(addUserSkill, Object.values(inputValues), true);

    useEffect(() => {
        setFormChanged(inputValues.notes !== "" || inputValues.expiry_date !== "");
    }, [inputValues, data]);

    useEffect(() => {
        if (navigateBack && !loading) {
            addData && setShowToast({ success: "Successfully added staff skill" });
            error && setShowToast({ error: "Failed to add staff skill" });
            navigate(-1);
        }
    }, [error, loading, navigate, navigateBack, setShowToast, addData]);

    return (
        <form className={styles.form}>
            {!!data && (
                <Select
                    options={getSelectOptionsFromArray(
                        data.map((skill) => {
                            return skill.id;
                        }),
                        data.map((skill) => {
                            return `${skill.name} - ${skill.category.name}`;
                        }),
                    )}
                    labelText="Select a skill"
                    className={styles.item}
                    value={inputValues.skill_id}
                    onChange={(event) => {
                        setInputValues((draft) => {
                            draft.skill_id = event.target.value;
                        });
                    }}
                    required
                />
            )}

            <Select
                options={getSelectOptionsFromArray(SKILL_LEVELS)}
                labelText="Select a level"
                className={styles.item}
                value={skillLevelValue}
                onChange={(event) => {
                    let value = convertSkillLevelName(event.target.value);
                    setskillLevelValue(event.target.value);
                    setInputValues((draft) => {
                        draft.skill_level = value;
                    });
                }}
                required
            />

            <TextAreaInput
                labelText="Notes"
                className={styles.textItem}
                defaultValue={inputValues.notes}
                name="notes"
                onChange={(event) => {
                    setInputValues((draft) => {
                        draft.notes = event.target.value;
                    });
                }}
                required
            />

            <TextInput
                labelText="Expiry date (optional)"
                className={styles.textItem}
                value={inputValues.expiry_date}
                name="expiryDate"
                onChange={(event) => {
                    setInputValues((draft) => {
                        draft.expiry_date = event.target.value;
                    });
                }}
                type="Date"
                role="input"
            />

            <Button
                className={styles.button}
                loading={loading}
                disabled={!formChanged || !isValidString(inputValues.notes, 5, 255)}
                onClick={(e) => {
                    e.preventDefault();
                    executeStaffAddSkill();
                    setNavigateBack(true);
                }}
            >
                Add Staff Skill
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
