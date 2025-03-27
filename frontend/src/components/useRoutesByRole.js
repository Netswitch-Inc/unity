// ** React Imports
import { useState, useEffect, useCallback, useLayoutEffect } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAuthRolePermission, cleanAuthMessage } from "views/login/store";

// ** Custom Components
import originalRoutes from '../routes';

const useRoutesByRole = () => {
    const dispatch = useDispatch();
    const loginStore = useSelector((state) => state.login);

    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [error, setError] = useState(false);

    const getUserRole = useCallback(() => {
        dispatch(getAuthRolePermission());
    }, [dispatch])

    useLayoutEffect(() => {
        if (loginStore?.authUserItem) {
            getUserRole();
        }
    }, [getUserRole, loginStore.authUserItem])

    function getFilteredRoutes(permission, routes) {
        const toolsPermission = permission?.toolsPermission || [];
        const filterRoutes = routes.reduce((acc, route) => {
            if (route?.toolId && !toolsPermission.includes(route?.toolId)) {
                return acc
            }

            if (route?.permissionId) {
                if (!permission[route.permissionId]) {
                    return acc
                }

                const viewPermissions = permission[route.permissionId];
                route.views = route.views.filter((view) => {
                    const permission = viewPermissions.find((x) => x.slug === view.permissionId);
                    let flag = false;
                    if (permission?.can_read) { flag = true; }

                    if (view?.toolId) {
                        flag = toolsPermission.includes(view.toolId) || false;
                    }

                    if (view?.toolId && !permission?.can_read) {
                        flag = false;
                    }

                    return flag || false;
                })

                if (route?.views?.length) { acc.push(route) }

                return acc
            }

            acc.push(route)
            return acc
        }, [])

        setFilteredRoutes(filterRoutes)
    }

    useEffect(() => {
        if (loginStore?.actionFlag || loginStore?.success || loginStore?.error) {
            dispatch(cleanAuthMessage());
        }

        if (loginStore?.actionFlag === "AUTH_ROLE_PERMISSION") {
            const permission = loginStore?.authRolePermission;
            getFilteredRoutes(permission, originalRoutes);
        }

        if (loginStore?.error && loginStore?.actionFlag === "AUTH_ROLE_PERMISSION_ERR") {
            setError(true);
        }
    }, [loginStore.actionFlag, loginStore.success, loginStore.error, loginStore.authRolePermission, dispatch])  

    return (
        { error, menuRoutes: filteredRoutes }
    )
}

export default useRoutesByRole;
