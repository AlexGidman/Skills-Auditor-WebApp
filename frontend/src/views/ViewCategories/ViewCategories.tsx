import React, { useState, useEffect } from "react";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { Button } from "../../components/Button/Button";
import { getSelectOptionsFromArray, useAPI, useIsAdminOrManager } from "../../utility/helper";
import { getAllCategories, deleteCategory } from "../../utility/apiRequests";
import styles from "./ViewCategories.module.css";
import { ListView } from "../../components/ListView/ListView";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Category } from "../../utility/types";

export const ViewCategories = () => {
    useIsAdminOrManager();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [, setShowToast] = useOutletContext();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [refresh, setRefresh] = useState(false);

    const { data, loading, error } = useAPI<Category[]>(getAllCategories);
    const {
        data: deleteCategoryData,
        loading: deleteCategoryLoading,
        error: deleteCategoryError,
        callback: executeDeleteCategory,
    } = useAPI(deleteCategory, [selectedCategory], true);

    useEffect(() => {
        if (refresh && !deleteCategoryLoading) {
            setRefresh(false);
            deleteCategoryError && setShowToast({ error: "Failed to delete category" });
            deleteCategoryData && navigate(0);
        }
    }, [
        deleteCategoryLoading,
        deleteCategoryData,
        deleteCategoryError,
        navigate,
        refresh,
        setShowToast,
    ]);

    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    if (data) {
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        return (
            <>
                <header>
                    <h1>View Categories</h1>
                </header>
                <section>
                    <ListView
                        className={styles.listview}
                        options={getSelectOptionsFromArray(
                            sortedCategories.map((category) => category.id),
                            sortedCategories.map((category) => category.name),
                        )}
                        value={selectedCategory}
                        labelText="Select a category"
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                        }}
                    />
                    <div className={styles.buttonWrapper}>
                        <LinkButton
                            className={styles.button}
                            disabled={!selectedCategory}
                            name="Edit category"
                            path={`/edit/category/${selectedCategory}`}
                        />
                        <Button
                            className={styles.button}
                            loading={loading || deleteCategoryLoading}
                            disabled={!selectedCategory}
                            onClick={(e) => {
                                e.preventDefault();
                                executeDeleteCategory();
                                setRefresh(true);
                            }}
                        >
                            Delete Category
                        </Button>
                    </div>
                </section>
            </>
        );
    }
    return null;
};
