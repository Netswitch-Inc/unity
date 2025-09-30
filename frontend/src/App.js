// ** React Imports
import React, { useEffect, useLayoutEffect } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAppSettings, cleanGlobalSettingMessage } from "views/global/store";

// ** Custom Components
import AdminLayout from "layouts/Admin/Admin.js";
import LoginForm from "views/login/Login";
import ForgotPassword from "views/forgotpassowrd";
import ResetPassword from "views/forgotpassowrd/Resetpassword";
import CompanyInfoStep from "views/userAssest/step1";
import VarificationCode from "views/userAssest/step2";
import AsessmentReport from "views/userAssest/step3";
import ThankYou from "views/userAssest/step4/index";
//import ThankYou from "views/userAssest/step4/thank-you";

const App = () => {
    // ** Hooks
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.globalSetting);
    const userStore = useSelector((state) => state.login);

    useLayoutEffect(() => {
        dispatch(getAppSettings());
    }, [dispatch])

    useEffect(() => {
        if (store?.actionFlag || store.success || store.error) {
            dispatch(cleanGlobalSettingMessage(null));
        }
    }, [dispatch, store?.actionFlag, store.success, store.error])

    const isAuthenticated = userStore?.authUserItem?._id && userStore?.accessToken;

    return (
        <Routes>
            {!isAuthenticated && (
                <Route path="/" element={(<LoginForm />)} />
            )}

            {!isAuthenticated && (
                <Route path="/forgot-password" element={(<ForgotPassword />)} />
            )}

            {!isAuthenticated && (
                <Route path="/resetpassword/:token" element={(<ResetPassword />)} />
            )}

            <Route path="/assessment-form/:id" element={(<CompanyInfoStep />)} />


            <Route path="/code-verification/:id" element={(<VarificationCode />)} />


            <Route path="/assessment-report/:id" element={(<AsessmentReport />)} />

            <Route path="/thank-you/:id" element={(<ThankYou />)} />
            {isAuthenticated && (
                <Route path="/admin/*" element={(
                    <AdminLayout
                        location={location}
                        navigate={navigate}
                        params={params}
                    />
                )} />
            )}

            {isAuthenticated && (
                <Route path="*" element={(
                    <Navigate to="/admin/dashboard" replace />
                )} />
            )}

            {!isAuthenticated && (
                <Route path="*" element={(<Navigate to="/" replace />)} />
            )}
        </Routes>
    )
}

export default App;
