import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/TextInput/TextInput";
import { Select } from "../../components/Select/Select";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { useAPI, getSelectOptionsFromArray } from "../../utility/helper";

import styles from "./AddSkill.module.css";
import { addSkill, getAllCategories } from "../../utility/apiRequests";

export const AddSkill = () => {
    const { data, loading, error } = useAPI(getAllCategories, []);
    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <header className={styles.content}>
                <h1>Add Skill</h1>
            </header>
            <section>
                <Form data={data} />
            </section>
        </>
    );
};

const Form = ({ data }) => {
    const [inputValues, setInputValues] = useImmer({
        name: "",
        category_id: data[0]?.id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const [, setShowToast] = useOutletContext();

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        data: addData,
        error,
        loading,
        callback: executeAddSkill,
    } = useAPI(addSkill, Object.values(inputValues), true);

    useEffect(() => {
        setFormChanged(inputValues.name !== "" || !inputValues.category_id);
    }, [inputValues, data]);

    useEffect(() => {
        if (navigateBack && !loading) {
            addData && setShowToast({ success: "Successfully added skill" });
            error && setShowToast({ error: "Failed to add skill" });
            navigate(-1);
        }
    }, [error, loading, navigate, navigateBack, setShowToast, addData]);

    return (
        <form className={styles.form}>
            <TextInput
                labelText="Enter a skill description"
                className={styles.item}
                value={inputValues.name}
                name="name"
                onChange={handleChange}
                required
            />
            {!!data && (
                <Select
                    options={getSelectOptionsFromArray(
                        data.map((category) => {
                            return category.id;
                        }),
                        data.map((category) => {
                            return category.name;
                        }),
                    )}
                    labelText="Select a skill category"
                    className={styles.item}
                    value={inputValues.category_id}
                    onChange={(event) => {
                        setInputValues((draft) => {
                            draft.category_id = event.target.value;
                        });
                    }}
                    required
                />
            )}

            <LinkButton className={styles.linkButton} name="Add Category" path={`/addcategory`} />
            <Button
                className={styles.button}
                loading={loading}
                disabled={!formChanged}
                onClick={(e) => {
                    e.preventDefault();
                    executeAddSkill();
                    setNavigateBack(true);
                }}
            >
                Add Skill
            </Button>
        </form>
    );
};
