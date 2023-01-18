import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { Button } from "../../components/Button/Button";

import { ListView } from "../../components/ListView/ListView";
import {
    useAPI,
    useIsAdminOrManager,
    getSelectOptionsFromArray,
    formatSkillLevel,
} from "../../utility/helper";
import {
    getAllDirectReports,
    getAllStaffSkills,
    deleteUser,
    deleteStaffSkill,
} from "../../utility/apiRequests";
import styles from "./ViewStaff.module.css";
import { DirectReport, StaffSkill } from "../../utility/types";
import { AppOutletContext } from "../AppWrapper/AppWrapper";

export const ViewStaff = () => {
    useIsAdminOrManager();
    const { currentUser } = useOutletContext<AppOutletContext>();

    const { data, loading, error } = useAPI<DirectReport[]>(getAllDirectReports, [currentUser.id]);
    if (loading) return <LoadingPlaceholder />;
    if (error) return <ErrorMessage error={error} />;
    if (data) {
        const sortedStaff = data.sort((a, b) =>
            a.report.firstName.localeCompare(b.report.firstName),
        );
        return (
            <>
                <header>
                    <h1>View Staff</h1>
                </header>
                <section>
                    <Form data={sortedStaff} />
                </section>
            </>
        );
    }
    return null;
};

interface FormProps {
    data: DirectReport[];
}

const Form = ({ data }: FormProps) => {
    const [selectedStaff, setSelectedStaff] = useState(data[0]);
    const [staffSkills, setStaffSkills] = useState<StaffSkill[]>([]);
    const [selectedStaffSkill, setSelectedStaffSkill] = useState<StaffSkill>();

    const [refresh, setRefresh] = useState(false);
    const { setShowToast } = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();

    const {
        data: staffSkillData,
        loading: staffSkillsLoading,
        error: staffSkillsError,
        callback: getSkillData,
    } = useAPI<StaffSkill[]>(getAllStaffSkills, [selectedStaff.report.id], true);

    const {
        data: deleteStaffSkillData,
        loading: deleteStaffSkillLoading,
        error: deleteStaffSkillError,
        callback: handleDeleteStaffSkill,
    } = useAPI(deleteStaffSkill, [selectedStaffSkill ? selectedStaffSkill.id : ""], true);

    const {
        data: deleteUserData,
        loading: deleteUserLoading,
        error: deleteUserError,
        callback: handleDeleteUser,
    } = useAPI(deleteUser, [selectedStaff.report.id], true);

    useEffect(() => {
        selectedStaff && getSkillData();
    }, [selectedStaff]);

    useEffect(() => {
        staffSkillData && setStaffSkills(staffSkillData);
    }, [staffSkillData]);

    useEffect(() => {
        staffSkills && setSelectedStaffSkill(staffSkills[0]);
    }, [staffSkills]);

    useEffect(() => {
        if (refresh && !deleteUserLoading && !deleteStaffSkillLoading) {
            setRefresh(false);
            deleteUserError && setShowToast({ error: "Failed to delete user" });
            deleteStaffSkillError && setShowToast({ error: "Failed to delete staff skill" });
            (deleteUserData || deleteStaffSkillData) && navigate(0);
        }
    }, [
        deleteStaffSkillData,
        deleteStaffSkillLoading,
        deleteStaffSkillError,
        deleteUserData,
        deleteUserError,
        deleteUserLoading,
        navigate,
        refresh,
        setShowToast,
    ]);

    return (
        <form className={styles.form}>
            <ListView
                className={styles.listview}
                options={getSelectOptionsFromArray(
                    data.map((staff) => {
                        return staff?.report?.id?.toString() || "";
                    }),
                    data.map((staff) => {
                        return `${staff.report.firstName} ${staff.report.lastName}`;
                    }),
                )}
                value={selectedStaff.report.id}
                labelText="Direct Reports"
                onChange={(e) => {
                    setSelectedStaff(
                        data.filter((staff) => staff?.report?.id?.toString() === e.target.value)[0],
                    );
                    setStaffSkills([]);
                }}
            />
            <div className={styles.flexbox}>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>{selectedStaff.report.email}</td>
                        </tr>
                        <tr>
                            <th>Job role</th>
                            <td>{selectedStaff.report.jobRole}</td>
                        </tr>
                        <tr>
                            <th>System role</th>
                            <td>{selectedStaff.report.systemRole}</td>
                        </tr>
                    </tbody>
                </table>
                {staffSkillsLoading ? (
                    <LoadingPlaceholder />
                ) : staffSkills ? (
                    <ListView
                        className={styles.skillsList}
                        options={
                            staffSkills
                                ? getSelectOptionsFromArray(
                                      staffSkills.map((staffSkill) => {
                                          return staffSkill.id;
                                      }),
                                      staffSkills.map((staffSkill) => {
                                          return `${staffSkill.skill.name} - ${formatSkillLevel(
                                              staffSkill.skillLevel,
                                          )}`;
                                      }),
                                  )
                                : []
                        }
                        value={selectedStaffSkill ? selectedStaffSkill.id : ""}
                        labelText="Skills"
                        onChange={(e) => {
                            setSelectedStaffSkill(
                                staffSkills.filter((skill) => {
                                    return skill.id.toString() === e.target.value;
                                })[0],
                            );
                        }}
                    />
                ) : staffSkillsError ? (
                    <ErrorMessage error={staffSkillsError} />
                ) : null}
            </div>
            <div className={styles.flexbox}>
                <LinkButton
                    className={styles.button}
                    name="Edit User"
                    disabled={!selectedStaff}
                    path={`/edit/user/${selectedStaff?.report?.id || ""}`}
                />
                <Button
                    className={styles.button}
                    disabled={!selectedStaff}
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteUser();
                        setRefresh(true);
                    }}
                >
                    Delete Report
                </Button>
                <LinkButton
                    className={styles.button}
                    name="Add Skill"
                    path={`/addstaffskill/${selectedStaff?.report?.id || ""}`}
                />
                <LinkButton
                    className={styles.button}
                    name="Edit Skill"
                    disabled={!selectedStaffSkill}
                    path={`/edit/staffskill/${selectedStaffSkill?.id || ""}`}
                />
                <Button
                    className={styles.button}
                    disabled={!selectedStaffSkill}
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteStaffSkill();
                        setRefresh(true);
                    }}
                >
                    Delete Skill
                </Button>
            </div>
        </form>
    );
};
