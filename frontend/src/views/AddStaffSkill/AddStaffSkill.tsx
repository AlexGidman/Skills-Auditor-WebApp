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
import { DirectReport, Skill, SKILL_LEVELS } from "../../utility/types";

export const AddStaffSkill = () => {
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
        if (userId) {
            if (
                !!directReportsError ||
                (!!directReportsData &&
                    !directReportsData.filter((directReport) => {
                        return directReport.report.id === userId; // TODO: check this isn't broken by type string vs number
                    }))
            ) {
                setShowToast({
                    error: "You are not authorised to edit this users skills",
                });
                navigate("/");
            }
        }
    }, [currentUser.id, directReportsData, directReportsError, navigate, setShowToast, userId]);

    const { data, loading, error } = useAPI<Skill[]>(getAllSkills);

    if (loading || directReportsLoading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;

    const sortedSkills = data ? data.sort((a, b) => a.name.localeCompare(b.name)) : null;
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

interface FormProps {
    data: Skill[] | null;
    userId: string;
}

const Form = ({ data, userId }: FormProps) => {
    // @ts-ignore TODO fix type for AppOutletContext here
    const [, setShowToast] = useOutletContext();
    const [skillLevelValue, setskillLevelValue] = useState<string>();
    const [inputValues, setInputValues] = useImmer({
        userId: userId,
        skillId: data ? data[0].id : null,
        skillLevel: convertSkillLevelName(SKILL_LEVELS[0]),
        notes: "",
        expiryDate: "",
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
        setFormChanged(inputValues.notes !== "" || inputValues.expiryDate !== "");
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
                    value={inputValues.skillId || undefined}
                    onChange={(event) => {
                        setInputValues((draft) => {
                            draft.skillId = event.target.value;
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
                        draft.skillLevel = value;
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
                value={inputValues.expiryDate}
                name="expiryDate"
                onChange={(event) => {
                    setInputValues((draft) => {
                        draft.expiryDate = event.target.value;
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
