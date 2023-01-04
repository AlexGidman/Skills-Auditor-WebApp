import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./views/Homepage/Homepage";
import { Login } from "./views/Login/Login";
import { AppWrapper } from "./views/AppWrapper/AppWrapper";
import { NotFound } from "./views/NotFound/NotFound";
import { MyDetails } from "./views/MyDetails/MyDetails";
import { MySkills } from "./views/MySkills/MySkills";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { EditUserDetails } from "./views/EditUserDetails/EditUserDetails";
import { EditSkill } from "./views/EditSkill/EditSkill";
import { ToastContainer } from "react-toastify";
import { CookiesProvider } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import { AddSkill } from "./views/AddSkill/AddSkill";
import { AddCategory } from "./views/AddCategory/AddCategory";
import { ViewSkills } from "./views/ViewSkills/ViewSkills";
import { AddStaff } from "./views/AddStaff/AddStaff";
import { ViewStaff } from "./views/ViewStaff/ViewStaff";
import { EditStaffSkill } from "./views/EditStaffSkill/EditStaffSkill";
import { AddStaffSkill } from "./views/AddStaffSkill/AddStaffSkill";
import { ViewCategories } from "./views/ViewCategories/ViewCategories";
import { EditCategory } from "./views/EditCategory/EditCategory";

export const App = (props) => {
    return (
        <CookiesProvider>
            <ErrorBoundary>
                <ToastContainer
                    position="bottom-center"
                    theme="colored"
                    autoClose={5000}
                    hideProgressBar={true}
                />
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppWrapper />}>
                            <Route path="/" element={<Homepage />} />
                            <Route path="/mydetails" element={<MyDetails />} />
                            <Route path="/addskill" element={<AddSkill />} />
                            <Route path="/addcategory" element={<AddCategory />} />
                            <Route path="/myskills" element={<MySkills />} />
                            <Route path="/viewskills" element={<ViewSkills />} />
                            <Route path="/viewcategories" element={<ViewCategories />} />
                            <Route path="/addstaff" element={<AddStaff />} />
                            <Route path="/viewstaff" element={<ViewStaff />} />
                            <Route path="/edit/user/:userId" element={<EditUserDetails />} />
                            <Route path="/edit/skill/:skillId" element={<EditSkill />} />
                            <Route path="/edit/category/:categoryId" element={<EditCategory />} />
                            <Route
                                path="/edit/staffskill/:staffSkillId"
                                element={<EditStaffSkill />}
                            />
                            <Route path="/addstaffskill/:userId" element={<AddStaffSkill />} />
                            <Route path="/addstaffskill" element={<AddStaffSkill />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            </ErrorBoundary>
        </CookiesProvider>
    );
};
