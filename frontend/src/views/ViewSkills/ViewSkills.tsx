import React, { useState, useEffect } from "react";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { Button } from "../../components/Button/Button";
import { getSelectOptionsFromArray, useAPI, useIsAdminOrManager } from "../../utility/helper";
import { getAllSkills, deleteSkill } from "../../utility/apiRequests";
import styles from "./ViewSkills.module.css";
import { ListView } from "../../components/ListView/ListView";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Skill } from "../../utility/types";
import { AppOutletContext } from "../AppWrapper/AppWrapper";

export const ViewSkills = () => {
    useIsAdminOrManager();
    const { setShowToast } = useOutletContext<AppOutletContext>();

    const navigate = useNavigate();
    const [selectedSkill, setSelectedSkill] = useState<string>();
    const [refresh, setRefresh] = useState(false);

    const { data, loading, error } = useAPI<Skill[]>(getAllSkills);
    const {
        data: deleteSkillData,
        loading: deleteSkillLoading,
        error: deleteSkillError,
        callback: executeDeleteSkill,
    } = useAPI(deleteSkill, [selectedSkill], true);

    useEffect(() => {
        if (refresh && !deleteSkillLoading) {
            setRefresh(false);
            deleteSkillError && setShowToast({ error: "Failed to delete skill" });
            deleteSkillData && navigate(0);
        }
    }, [deleteSkillLoading, deleteSkillData, deleteSkillError, navigate, refresh, setShowToast]);

    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    if (data) {
        const sortedSkills = data.sort((a, b) => a.name.localeCompare(b.name));
        return (
            <>
                <header>
                    <h1>View Skills</h1>
                </header>
                <section>
                    <ListView
                        className={styles.listview}
                        options={getSelectOptionsFromArray(
                            sortedSkills.map((skill) => {
                                return skill.id;
                            }),
                            sortedSkills.map((skill) => {
                                return `${skill.name} - ${skill.category.name}`;
                            }),
                        )}
                        value={selectedSkill}
                        labelText="Select a skill"
                        onChange={(e) => {
                            setSelectedSkill(e.target.value);
                        }}
                    />
                    <div className={styles.buttonWrapper}>
                        <LinkButton
                            className={styles.button}
                            disabled={!selectedSkill}
                            name="Edit skill"
                            path={`/edit/skill/${selectedSkill}`}
                        />
                        <Button
                            className={styles.button}
                            loading={loading || deleteSkillLoading}
                            disabled={!selectedSkill}
                            onClick={(e) => {
                                e.preventDefault();
                                executeDeleteSkill();
                                setRefresh(true);
                            }}
                        >
                            Delete Skill
                        </Button>
                    </div>
                </section>
            </>
        );
    }
    return null;
};
