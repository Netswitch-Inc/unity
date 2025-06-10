// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { authUserLogout } from "views/login/store";

// ** Reactstrap Imports
import {
  Nav,
  Row,
  Navbar,
  Button,
  NavLink,
  Container,
  NavbarBrand,
  DropdownMenu,
  DropdownItem,
  NavbarToggler,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown
} from "reactstrap";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Third Party Components
import classNames from "classnames";

// ** Constant
import { hostRestApiUrl, companyAdminRole, superAdminRole } from "utility/reduxConstant";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

function AdminNavbar(props) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const loginStore = useSelector((state) => state.login);

  // ** States
  const [collapseOpen] = useState(false);
  const [color, setcolor] = useState("navbar-transparent");

  useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    }
  })

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  }

  // this function opens and closes the collapse on small devices
  // const toggleCollapse = () => {
  //   if (collapseOpen) {
  //     setcolor("navbar-transparent");
  //   } else {
  //     setcolor("bg-white");
  //   }

  //   setcollapseOpen(!collapseOpen);
  // }

  const handleLogout = () => {
    dispatch(authUserLogout());
    navigate("/");
  }

  const userRoleId = loginStore?.authUserItem?.role_id?._id || loginStore?.authUserItem?.role_id || "";

  return (<>
    <Navbar
      className={classNames("navbar-absolute navbar-fixed", {
        [color]: props.location.pathname.indexOf("full-screen-map") === -1
      })}
      expand="md"
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-minimize d-inline">
            <Button
              color="link"
              id="tooltip209599"
              className="minimize-sidebar btn-just-icon"
              onClick={props.handleMiniClick}
            >
              <i className="sideMenu tim-icons icon-align-center visible-on-sidebar-regular" />
              <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini" />
            </Button>
            <UncontrolledTooltip
              delay={0}
              target="tooltip209599"
              placement="right"
            >
              Sidebar toggle
            </UncontrolledTooltip>
          </div>

          <div
            className={classNames("navbar-toggle d-inline", {
              toggled: props.sidebarOpened
            })}
          >
            <NavbarToggler onClick={props.toggleSidebar}>
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </NavbarToggler>
          </div>
          <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
            {props.brandText}
          </NavbarBrand>
        </div>

        {/* <button
          type="button"
          data-toggle="collapse"
          aria-expanded="false"
          data-target="#navigation"
          className="navbar-toggler"
          aria-label="Toggle navigation"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button> */}

        <div>
          <Row className="ml-auto alert-btn-toggle">
            <div className="button d-sm-block d-none">
              <Button className="btn-simple btn btn-sm borders disabled" color="twitter">
                Alert Level: <strong>Guarded</strong>
              </Button>
            </div>

            <Nav navbar className="borders">
              <UncontrolledDropdown nav>
                <DropdownToggle
                  nav
                  caret
                  color="default"
                  className="pl-0"
                  onClick={(event) => event.preventDefault()}
                >
                  <div className="photo">
                    {loginStore?.authUserItem?.image ? (
                      <img
                        alt="Profile"
                        src={`${hostRestApiUrl}/${loginStore?.authUserItem?.image}`}
                        onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                      />
                    ) : (
                      <img
                        alt="Profile"
                        src={defaultAvatar}
                      />
                    )}
                  </div>

                  <div className="name-arrow">
                    <span className="d-block">{loginStore?.authUserItem?.user_name || ""}</span>
                    <b className="caret d-md-block d-xl-block" />
                  </div>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem
                      className="nav-item"
                      onClick={() => navigate("/admin/profile")}
                    >
                      Profile
                    </DropdownItem>
                  </NavLink>

                  {companyAdminRole === userRoleId ? (
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={() => navigate("/admin/company-profile")}
                      >
                        Location Profile
                      </DropdownItem>
                    </NavLink>
                  ) : null}

                  {superAdminRole === userRoleId && <NavLink tag="li">
                    <DropdownItem
                      className="nav-item"
                      onClick={() => navigate("/admin/global-setting")}
                    >
                      Global Settings
                    </DropdownItem>
                  </NavLink>}

                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <DropdownItem
                      className="nav-item"
                      onClick={() => handleLogout()}
                    >
                      Log out
                    </DropdownItem>
                  </NavLink>
                  <div className="button d-sm-none d-block">
                    <Button className="btn-simple btn btn-sm borders disabled mx-auto" color="twitter">
                      Alert Level: <strong>Guarded</strong>
                    </Button>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-md-none" />
            </Nav>
          </Row>
        </div>
      </Container>
    </Navbar>
  </>)
}

export default AdminNavbar;
