// ** React Imports
import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

// ** Store
import { useSelector } from "react-redux";

// ** Core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

// ** Custom Components
import useRoutesByRole from "components/useRoutesByRole";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";

// ** Third Party Components
import PerfectScrollbar from "perfect-scrollbar";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultLogo, defaultCompanyName, defaultCompanyUrl } from "utility/reduxConstant";

var ps;

// const companyUrl = process.env.REACT_APP_COM === "sec" ? process.env.REACT_APP_PRO_SEC_URL : process.env.REACT_APP_PRO_NET_URL;

const Admin = (props) => {
  // ** Hooks
  const location = useLocation();
  const mainPanelRef = useRef(null);
  const { error, menuRoutes } = useRoutesByRole();

  // ** Const
  const companyName = defaultCompanyName || "UnityRi";
  const companyUrl = defaultCompanyUrl || "";

  // ** Store vars
  const store = useSelector((state) => state.login);
  const settingStore = useSelector((state) => state.globalSetting);
  const appSettingItem = settingStore?.appSettingItem || null;

  const [sidebarOpened, setsidebarOpened] = useState(document.documentElement.className.indexOf("nav-open") !== -1)
  const [opacity, setOpacity] = useState(0)
  const [showSnackBar, setshowSnackbar] = useState(false)
  const [SnackMessage] = useState("Unable to connect to the backend server...")

  useEffect(() => {
    let innerMainPanelRef = mainPanelRef;
    if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("Linux") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current);
      mainPanelRef.current &&
        mainPanelRef.current.addEventListener(
          "ps-scroll-y",
          showNavbarButton
        )
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }

    // Specify how to clean up after this effect:
    window.addEventListener("scroll", showNavbarButton);
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("Linux") > -1) {
        if (ps) { ps.destroy(); }
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove(
          "perfect-scrollbar-on"
        );
        innerMainPanelRef.current &&
          innerMainPanelRef.current.removeEventListener(
            "ps-scroll-y",
            showNavbarButton
          )
      }

      window.removeEventListener("scroll", showNavbarButton);
    }
  }, [])

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location])

  const handleMiniClick = () => {
    document.body.classList.toggle("sidebar-mini");
  }

  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  }

  const closeSidebar = () => {
    setsidebarOpened(false);
    document.documentElement.classList.remove("nav-open");
  }

  const showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop > 50)
    ) {
      setOpacity(1);
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop <= 50)
    ) {
      setOpacity(0);
    }
  }

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }

      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.path}
            element={prop.component}
            key={key}
            exact
          />
        )
      } else {
        return null;
      }
    })
  }

  const getBrandText = (routes) => {
    let activeRoute = "Brand";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getBrandText(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        const routePath = routes[i]?.path?.replace("/:id", "");
        if (
          location.pathname.indexOf(
            routes[i].layout + routePath
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }

    return activeRoute;
  }

  useEffect(() => {
    setshowSnackbar(error);
  }, [error]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 5000);
  }, [showSnackBar]);

  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            <ReactSnackBar Icon={(
              <span>{" "}<TiMessages size={25} />{" "}</span>
            )} Show={showSnackBar}>
              {SnackMessage}
            </ReactSnackBar>

            <div className="navbar-minimize-fixed" style={{ opacity: opacity }}>
              <button
                onClick={handleMiniClick}
                className="minimize-sidebar btn btn-link btn-just-icon"
              >
                <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
                <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
              </button>
            </div>

            {store?.sidebarLoading ? (
              <Sidebar
                {...props}
                routes={menuRoutes}
                logo={{
                  imgSrc: appSettingItem?.logo || defaultLogo,
                  outterLink: appSettingItem?.url || companyUrl,
                  text: appSettingItem?.name || companyName
                }}
                activeColor="blue"
                closeSidebar={closeSidebar}
                toggleSidebar={toggleSidebar}
              />
            ) : null}

            <div className="main-panel" ref={mainPanelRef} data={color}>
              <AdminNavbar
                {...props}
                handleMiniClick={handleMiniClick}
                brandText={getBrandText(menuRoutes)}
                sidebarOpened={sidebarOpened}
                toggleSidebar={toggleSidebar}
              />
              <Routes>
                {getRoutes(menuRoutes)}
                <Route
                  path="/"
                  element={(<Navigate to="/admin/dashboard" replace />)}
                />
              </Routes>
              {/* we don't want the Footer to be rendered on map page */}
              {location.pathname === "/admin/maps" ? null : (
                <Footer fluid />
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  )
}

export default Admin;
