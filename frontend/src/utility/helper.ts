import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
    ADMIN,
    BASIC,
    EXPERT,
    HIGH,
    NONE,
    INTERMEDIATE,
    MANAGER_SR,
    systemRoleS,
    TOKEN_COOKIE,
    User,
} from "./types";
import { useCookies } from "react-cookie";
import { AxiosResponse, AxiosError } from "axios";

export const useLogout = () => {
    const [, , removeCookie] = useCookies([TOKEN_COOKIE]); // TODO: Check this works!
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        if (logout) {
            setLogout(false);
            removeCookie(TOKEN_COOKIE);
            navigate("/login");
        }
    }, [logout, navigate, removeCookie]);

    return () => setLogout(true);
};

export const hyphenate = (str: string) => {
    return str.trim().replace(" ", "-");
};

export function useAPI<T>(
    apiCallback: Function,
    varArray: unknown[] = [],
    lazy = false,
    auth = true,
): { data: T | null; loading: boolean; error: Error | null; callback: CallableFunction } {
    const [cookies] = useCookies([TOKEN_COOKIE]); // TODO: Check this works!
    const navigate = useNavigate();

    const [callAPI, setCallAPI] = useState<boolean>(!lazy);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(!lazy);
    const [error, setError] = useState<Error | null>(null);

    const callback = () => {
        setLoading(true);
        setCallAPI(true);
    };

    useEffect(() => {
        if (callAPI) {
            const authHeaders = {
                headers: {
                    authorization: cookies[TOKEN_COOKIE],
                },
            };

            apiCallback
                .apply(null, auth ? [authHeaders, ...varArray] : [...varArray])
                ?.then((response: AxiosResponse) => {
                    setData(response.data);
                })
                .catch((error: AxiosError<{ error: Error }>) => {
                    if (unauthorisedError(error)) {
                        navigate("/login");
                    } else {
                        setError(error?.response?.data?.error || null);
                    }
                })
                .finally(() => {
                    setLoading(false);
                    setCallAPI(false);
                });
        }
    }, [apiCallback, auth, callAPI, cookies, navigate, varArray]);

    return { data, loading, error, callback };
}

export const getSelectOptionsFromArray = (valArray: string[] = [], labelArray: string[] = []) => {
    return valArray.length === labelArray.length
        ? valArray.map((val, i) => {
              return { value: val, label: labelArray[i] };
          })
        : valArray.map((val) => {
              return { value: val, label: val };
          });
};

export const getAssignableSystemRoleOptions = (currentUserSystemRole: string) => {
    // TODO implement proper type for system role
    const systemRolesOptions = getSelectOptionsFromArray(systemRoleS);
    switch (currentUserSystemRole) {
        case ADMIN:
            return systemRolesOptions;
        case MANAGER_SR:
            return systemRolesOptions.filter((option) => {
                return option.label !== ADMIN && option;
            });
        default:
            return systemRolesOptions.filter((option) => {
                return option.label !== ADMIN && option.label !== MANAGER_SR && option;
            });
    }
};

export const isValidString = (val: string, min = 0, max = 100) => {
    return !!val && val.length >= min && val.length <= max;
};

export const isValidEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
};

export const isValidUser = (user: User) => {
    return (
        !!user.firstName &&
        isValidString(user.firstName, 1) &&
        !!user.lastName &&
        isValidString(user.lastName, 1) &&
        !!user.email &&
        isValidEmail(user.email) &&
        (!!user.password ? isValidString(user.password, 10, 16) : true)
    );
};

export const useIsAdminOrManager = () => {
    // @ts-ignore TODO fix type for AppOutletContext here
    const [currentUser, setShowToast] = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (
            currentUser &&
            currentUser.systemRole !== ADMIN &&
            currentUser.systemRole !== MANAGER_SR
        ) {
            setShowToast({ error: "Unauthorised route" });
            navigate("/");
        }
    });
};

const unauthorisedError = (error: AxiosError): boolean => {
    return (
        !!!error?.response?.status ||
        error?.response?.status === 401 ||
        error?.response?.status === 403
    );
};

export const formatDate = (_date: string) => {
    if (!_date || _date === "0000-00-00") return "N/A";
    let newDate = new Date(_date);
    newDate.toLocaleDateString();
    return newDate.toLocaleDateString();
};

export const formatSkillLevel = (_skillLevel: string) => {
    // TODO implement proper type for skill level
    if (_skillLevel === "5") {
        return EXPERT;
    } else if (_skillLevel === "4") {
        return HIGH;
    } else if (_skillLevel === "3") {
        return INTERMEDIATE;
    } else if (_skillLevel === "2") {
        return BASIC;
    } else {
        return NONE;
    }
};

export const convertSkillLevelName = (_skillLevel: string) => {
    // TODO implement proper type for skill level
    if (_skillLevel === "Expert") {
        return "5";
    } else if (_skillLevel === "High") {
        return "4";
    } else if (_skillLevel === "Intermediate") {
        return "3";
    } else if (_skillLevel === "Basic") {
        return "2";
    } else {
        return "1";
    }
};
