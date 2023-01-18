import React, { useState, useEffect } from "react";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { TextInput } from "../../components/TextInput/TextInput";
import { Select } from "../../components/Select/Select";
import { Button } from "../../components/Button/Button";

import { useAPI, useIsAdminOrManager, getSelectOptionsFromArray } from "../../utility/helper";
import { getAllCategories, getSkill, updateSkill } from "../../utility/apiRequests";
import styles from "./EditSkill.module.css";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Category, Skill } from "../../utility/types";
import { AppOutletContext } from "../AppWrapper/AppWrapper";

export const EditSkill = () => {
    useIsAdminOrManager();
    const { skillId } = useParams();

    const { data, loading, error } = useAPI<Skill>(getSkill, [skillId]);
    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    if (data) {
        return (
            <>
                <header>
                    <h1>Edit Skill</h1>
                </header>
                <section>
                    <Form data={data} />
                </section>
            </>
        );
    }
    return null;
};

interface FormProps {
    data: Skill;
}

const Form = ({ data }: FormProps) => {
    const navigate = useNavigate();
    const { data: categoryData } = useAPI<Category[]>(getAllCategories);
    const { setShowToast } = useOutletContext<AppOutletContext>();

    const [skillDescription, setSkillDescription] = useState(data.name);
    const [skillCategoryId, setSkillCategoryId] = useState(data.category.id);

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        error,
        loading,
        callback: updateSkillInfo,
    } = useAPI(updateSkill, [data.id, skillDescription, skillCategoryId], true);

    useEffect(() => {
        setFormChanged(skillDescription !== data.name || skillCategoryId !== data.category.id);
    }, [data, skillDescription, skillCategoryId]);

    useEffect(() => {
        if (navigateBack && !loading) {
            error
                ? setShowToast({ error: "Failed to update skill" })
                : setShowToast({ success: "Successfully updated skill" });
            navigate(-1);
        }
    }, [navigateBack, loading, error, setShowToast, navigate]);

    return (
        <form className={styles.form}>
            <TextInput
                labelText="Skill description"
                className={styles.item}
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
            />
            {!!categoryData && (
                <Select
                    className={styles.item}
                    labelText="Skill category"
                    options={getSelectOptionsFromArray(
                        categoryData.map((category) => {
                            return category.id;
                        }),
                        categoryData.map((category) => {
                            return category.name;
                        }),
                    )}
                    value={skillCategoryId}
                    onChange={(e) => {
                        setSkillCategoryId(e.target.value);
                    }}
                />
            )}
            <Button
                className={styles.button}
                loading={loading}
                disabled={!formChanged}
                onClick={(e) => {
                    e.preventDefault();
                    updateSkillInfo();
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
