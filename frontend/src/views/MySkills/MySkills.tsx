import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { Button } from "../../components/Button/Button";
import {
    getSelectOptionsFromArray,
    useAPI,
    formatDate,
    formatSkillLevel,
} from "../../utility/helper";
import { getAllStaffSkills, deleteStaffSkill } from "../../utility/apiRequests";
import styles from "./MySkills.module.css";
import { ListView } from "../../components/ListView/ListView";
import { StaffSkill } from "../../utility/types";

export const MySkills = () => {
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser] = useOutletContext();
    const { data, loading, error } = useAPI<StaffSkill[]>(getAllStaffSkills, [currentUser.id]);
    if (loading) return <LoadingPlaceholder />;

    const sortedSkills = data
        ? data.sort((a, b) => a.skill.name.localeCompare(b.skill.name))
        : null;
    return (
        <>
            <header>
                <h1>My Skills</h1>
            </header>
            <section>
                <Form data={sortedSkills} dataError={error} />
            </section>
        </>
    );
};

interface FormProps {
    data: StaffSkill[] | null;
    dataError: Error | null;
}

const Form = ({ data, dataError }: FormProps) => {
    const navigate = useNavigate();
    // @ts-ignore TODO fix type for AppOutletContext here
    const [, setShowToast] = useOutletContext();
    const [selectedSkill, setSelectedSkill] = useState(data ? data[0].id : "");
    const [skillLevel, setSkillLevel] = useState(
        data ? formatSkillLevel(data[0].skillLevel) : null,
    );
    const [expiryDate, setExpiryDate] = useState(data ? formatDate(data[0].expiryDate) : null);
    const [skillNotes, setSkillNotes] = useState(data ? data[0].notes : "");

    const [formChanged, setFormChanged] = useState(false);
    const [navigateBack, setNavigateBack] = useState(false);

    const {
        error,
        loading,
        callback: deleteSkill,
    } = useAPI(deleteStaffSkill, [selectedSkill], true);

    useEffect(() => {
        if (navigateBack && !loading) {
            error
                ? setShowToast({ error: "Failed to delete user skill" })
                : setShowToast({ success: "Successfully deleted user skill" });
            navigate(0);
        }
    }, [error, loading, navigate, navigateBack, setShowToast]);

    useEffect(() => {
        setFormChanged(selectedSkill !== undefined);
    }, [selectedSkill]);

    return (
        <form className={styles.form}>
            {data && (
                <>
                    <ListView
                        className={styles.listview}
                        options={getSelectOptionsFromArray(
                            data.map((userSkill) => {
                                return userSkill.id;
                            }),
                            data.map((userSkill) => {
                                return `${userSkill.skill.name} - ${userSkill.skill.category.name}`;
                            }),
                        )}
                        value={selectedSkill}
                        labelText="Select a user skill"
                        onChange={(e) => {
                            let resultArray = data.filter((x) => x.id == e.target.value);
                            setSelectedSkill(e.target.value);
                            setSkillLevel(formatSkillLevel(resultArray[0].skillLevel));
                            setExpiryDate(formatDate(resultArray[0].expiryDate));
                            setSkillNotes(resultArray[0].notes);
                        }}
                    />

                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>Skill Level:</th>
                                <td>{skillLevel}</td>
                            </tr>
                            <tr>
                                <th>Expiry Date:</th>
                                <td>{expiryDate}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className={styles.table}>
                        <tbody>
                            <tr className={styles.rowHeightColSpan}>
                                <td>{skillNotes}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            {dataError && <ErrorMessage error={dataError} />}

            <div className={styles.buttonWrapper}>
                <LinkButton
                    className={styles.button}
                    disabled={!selectedSkill}
                    name="Edit"
                    path={`/edit/staffskill/${selectedSkill}`}
                />
                <Button
                    className={styles.button}
                    loading={loading}
                    disabled={!formChanged || !selectedSkill}
                    onClick={(e) => {
                        e.preventDefault();
                        deleteSkill();
                        setNavigateBack(true);
                    }}
                >
                    Delete
                </Button>
                <LinkButton className={styles.button} name="Add Skill" path={`/addstaffskill`} />
            </div>
        </form>
    );
};
