/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useRef, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

// ** Reactstrap Imports
import { Nav, Collapse } from "reactstrap";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** Third Party Components
import PropTypes from "prop-types";
import classNames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";

// ** Logo
import sourceLogo from "assets/img/react-logo.png";

const Sidebar = (props) => {
  // ** Hooks
  const sidebarRef = useRef(null);
  const location = useLocation();

  // ** States
  const [state, setState] = useState({});

  useEffect(() => {
    setState(getCollapseStates(props.routes));
  }, [])

  useEffect(() => {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    let ps = null;
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false
      })
    }

    return function cleanup() {
      // we need to destroy the false scrollbar when we navigate
      // to a page that doesn't have this component rendered
      if (navigator.platform.indexOf("Win") > -1) {
        if (ps) { ps.destroy(); }
      }
    }
  })

  // this creates the intial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState
        };
      }

      return null;
    })

    return initialState;
  }

  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }

    return false;
  }

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { rtlActive } = props;
    return routes.map((prop, key) => {
      if (prop.redirect) return null;

      // if sidebar is in collapsed state
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <li
            key={key}
            className={classNames(prop?.customClass || "", {
              active: getCollapseInitialState(prop.views)
            })}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={state[prop.state]}
              onClick={(event) => {
                event.preventDefault();
                // setState({ ...state, ...st });
                setState({ ...st });

              }}
            >
              {prop?.imgIcon ? (<>
                <img alt="" src={prop?.imgIcon} className="sidebar-img-icon" />
                <p>
                  {rtlActive ? prop.rtlName : prop.name}
                </p>
                <b className="caret" />
              </>) : prop?.icon ? (<>
                <i className={prop.icon} />
                <p>
                  {rtlActive ? prop.rtlName : prop.name}
                  <b className="caret" />
                </p>
              </>) : (<>
                <span className="sidebar-mini-icon">
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
                <span className="sidebar-normal">
                  {rtlActive ? prop.rtlName : prop.name}
                  <b className="caret" />
                </span>
              </>)}
            </a>

            <Collapse isOpen={state[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        )
      }

      return (
        <li
          key={key}
          className={classNames(prop?.customClass || "", {
            active: activeRoute(prop.layout + prop.path) === "active"
          })}
        >
          <NavLink
            to={prop.layout + prop.path}
            onClick={props.closeSidebar}
          >
            {prop?.imgIcon ? (<>
              <img alt="" src={prop?.imgIcon} className="sidebar-img-icon" />
              <p>
                {rtlActive ? prop.rtlName : prop.name}
              </p>
            </>) : prop?.icon ? (<>
              <i className={prop.icon} />
              <p>{rtlActive ? prop.rtlName : prop.name}</p>
            </>) : (<>
              <span className="sidebar-mini-icon">
                {rtlActive ? prop.rtlMini : prop.mini}
              </span>
              <span className="sidebar-normal">
                {rtlActive ? prop.rtlName : prop.name}
              </span>
            </>)}
          </NavLink>
        </li>
      )
    })
  }

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  }

  const { activeColor, logo } = props;
  let logoImg = null;
  let logoText = null;
  if (logo !== undefined) {
    if (logo.outterLink !== undefined) {
      logoImg = (
        <a
          rel="noreferrer"
          target="_blank"
          href={logo.outterLink}
          className="simple-text logo-mini"
          onClick={props.closeSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="Logo" onError={(currentTarget) => onImageSrcError(currentTarget, sourceLogo)} />
          </div>
        </a>
      )

      logoText = (
        <a
          rel="noreferrer"
          target="_blank"
          href={logo.outterLink}
          className="simple-text logo-normal"
          onClick={props.closeSidebar}
        >
          {logo.text}
        </a>
      )
    } else {
      logoImg = (
        <NavLink
          to={logo.innerLink}
          className="simple-text logo-mini"
          onClick={props.closeSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </NavLink>
      )

      logoText = (
        <NavLink
          to={logo.innerLink}
          className="simple-text logo-normal"
          onClick={props.closeSidebar}
        >
          {logo.text}
        </NavLink>
      )
    }
  }

  return (
    <div className="sidebar" data={activeColor}>
      <div className="sidebar-wrapper" ref={sidebarRef}>
        {logoImg !== null || logoText !== null ? (
          <div className="logo">
            {logoImg}
            {logoText}
          </div>
        ) : null}
        <Nav className="nav-custom main-sidenav">{createLinks(props.routes)}</Nav>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  activeColor: PropTypes.oneOf(["primary", "blue", "green", "orange", "red"]),
  rtlActive: PropTypes.bool,
  routes: PropTypes.array.isRequired,
  logo: PropTypes.oneOfType([
    PropTypes.shape({
      innerLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    PropTypes.shape({
      outterLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ]),
  // this is used on responsive to close the sidebar on route navigation
  closeSidebar: PropTypes.func
}

export default Sidebar;
