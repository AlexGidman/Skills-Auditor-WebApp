import React, { useState, useEffect } from "react";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { TextInput } from "../../components/TextInput/TextInput";
import { Button } from "../../components/Button/Button";

import { useAPI, useIsAdminOrManager } from "../../utility/helper";
import { getCategory, updateCategory } from "../../utility/apiRequests";
import styles from "./EditCategory.module.css";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";

export const EditCategory = () => {
    useIsAdminOrManager();
    const { categoryId } = useParams();

    const { data, loading, error } = useAPI(getCategory, [categoryId]);
    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <header>
                <h1>Edit Category</h1>
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
    const [categoryDescription, setCategoryDescription] = useState(data.name);

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        error,
        loading,
        callback: updateCategoryInfo,
    } = useAPI(updateCategory, [data.id, categoryDescription], true);

    useEffect(() => {
        setFormChanged(categoryDescription !== data.name);
    }, [data, categoryDescription]);

    useEffect(() => {
        if (navigateBack && !loading) {
            error
                ? setShowToast({ error: "Failed to update category" })
                : setShowToast({ success: "Successfully updated category" });
            navigate(-1);
        }
    }, [navigateBack, loading, error, setShowToast, navigate]);

    return (
        <form className={styles.form}>
            <TextInput
                labelText="Category description"
                className={styles.item}
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
            />
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.button}
                    loading={loading}
                    disabled={!formChanged}
                    onClick={(e) => {
                        e.preventDefault();
                        updateCategoryInfo();
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
