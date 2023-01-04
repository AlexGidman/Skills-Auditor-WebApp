import React, { useEffect } from "react";

import styles from "./Login.module.css";
import { Logo } from "../../icons";
import { Button } from "../../components/Button/Button";
import { useAPI } from "../../utility/helper";
import { postLogin, validateToken } from "../../utility/apiRequests";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { TOKEN_COOKIE, TOKEN_LIFE } from "../../utility/types";
import { toast } from "react-toastify";

export const Login = () => {
    const [cookies, setCookie] = useCookies([TOKEN_COOKIE]);
    const navigate = useNavigate();
    const [formData, setData] = useImmer({
        email: "",
        password: "",
    });

    const {
        data: response,
        error,
        loading,
        callback: processLogin,
    } = useAPI(postLogin, Object.values(formData), true, false);

    const {
        data: validTokenData,
        loading: validateLoading,
        error: validateError,
        callback: validateCookie,
    } = useAPI(validateToken, [], true);

    useEffect(() => {
        if (cookies[TOKEN_COOKIE] && !validateLoading && !validTokenData && !validateError) {
            validateCookie();
        }
    }, [cookies]);

    useEffect(() => {
        validateError && setCookie(null);
        validTokenData && navigate("/");
    });

    useEffect(() => {
        if (response) {
            setCookie(TOKEN_COOKIE, response["token"], { path: "/", maxAge: TOKEN_LIFE });
            toast.success("Successfully logged in");
            navigate("/");
        } else if (error) toast.error("Incorrect credentials.");
    }, [response, navigate, error, setCookie]);

    return (
        <>
            <header className={styles.header}>
                <Logo className={styles.logo} aria-hidden alt="Logo" />
            </header>
            <section className={styles.formBox}>
                <form className={styles.form}>
                    <label htmlFor="email" className={styles.label}>
                        Email:
                    </label>
                    <input
                        id="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={(event) => {
                            setData((draft) => {
                                draft.email = event.target.value;
                            });
                        }}
                        placeholder="example@email.com"
                    />
                    <label htmlFor="password" className={styles.label}>
                        Password:
                    </label>
                    <input
                        id="password"
                        className={styles.input}
                        type="password"
                        value={formData.password}
                        onChange={(event) => {
                            setData((draft) => {
                                draft.password = event.target.value;
                            });
                        }}
                    />
                    <div className={styles.holder}>
                        <Button
                            className={styles.button}
                            loading={loading}
                            alt="Login button"
                            onClick={(e) => {
                                e.preventDefault();
                                processLogin();
                            }}
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </section>
        </>
    );
};
