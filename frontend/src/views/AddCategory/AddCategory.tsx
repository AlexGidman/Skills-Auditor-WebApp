import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/TextInput/TextInput";
import { useAPI } from "../../utility/helper";

import styles from "./AddCategory.module.css";
import { addCategory } from "../../utility/apiRequests";
import cx from "classnames";

export const AddCategory = () => {
    return (
        <>
            <header className={styles.content}>
                <h1>Add Category</h1>
            </header>
            <section>
                <Form />
            </section>
        </>
    );
};

const Form = () => {
    const [inputValues, setInputValues] = useImmer({
        name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [, setShowToast] = useOutletContext();

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        data: addData,
        error,
        loading,
        callback: executeAddCategory,
    } = useAPI(addCategory, Object.values(inputValues), true);

    useEffect(() => {
        setFormChanged(inputValues.name !== "" && inputValues.name !== undefined);
    }, [inputValues]);

    useEffect(() => {
        if (navigateBack && !loading) {
            addData && setShowToast({ success: "Successfully added category" });
            error && setShowToast({ error: "Failed to add category" });
            navigate(-1);
        }
    }, [error, loading, navigate, navigateBack, setShowToast, addData]);

    return (
        <form className={styles.form}>
            <TextInput
                labelText="Enter a category name"
                className={cx(styles.textField, styles.content)}
                value={inputValues.name}
                name="name"
                onChange={handleChange}
                required
            />

            <Button
                className={styles.button}
                loading={loading}
                disabled={!formChanged}
                onClick={(e) => {
                    e.preventDefault();
                    executeAddCategory();
                    setNavigateBack(true);
                }}
            >
                Add Category
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
