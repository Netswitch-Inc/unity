/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line jsx-a11y/alt-text

import React, { useEffect,  useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import UserProfile from './tabs/Profile';
import ChangePassword from './tabs/ChangePassword';
import { Col, Row} from "react-bootstrap";
import { Card, CardBody, CardText } from "reactstrap";
import { onImageSrcError } from "utility/Utils";

// ** Constant
import { profileItem, hostRestApiUrl } from "utility/reduxConstant";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";
import { useSelector } from 'react-redux';
import Phone from 'assets/img/call.svg'
import Mail from 'assets/img/mail.svg'
import User from 'assets/img/users.svg'
import Key from 'assets/img/key.svg'
const Auth = () => {
  const [activeTab, setActiveTab] = useState('1');
  const store = useSelector((state) => state.login);
  const [user, setUser] = useState(profileItem);
  
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : "?";
  };

  useEffect(()=>{
    if (store.profile) {
      setUser(store.profile);
    }
  },[store.profile])

  return (
    <div className="content profile-management">
      
      <Row>
      <Col md="4" className="">
            <Card className="card-user mb-0 main-profile-card">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className='profile-name-img'>
                    <a href="#pablo" onClick={(event) => event.preventDefault()}>
                      {user?.image ? (
                        <img
                          alt="Profile"
                          className="avatar"
                          src={`${hostRestApiUrl}/${user?.image}`}
                          onError={(currentTarget) =>
                            onImageSrcError(currentTarget, defaultAvatar)
                          }
                        />
                      ) : (
                        <div className="avatar-text">
                          <div className='avatar-border'>
                            <div className='avatar'>{getInitials()}</div>
                          </div>
                        </div>
                      )}
                      <h4 className="title mt-2">{`${user?.first_name} ${user?.last_name}`}</h4>
                      <div className="username-profile">
                      <h4>{user?.role_id?.name}</h4>
                      </div>
                    </a>
                  </div>
                  <p className="description">
                    <img 
                      src={Mail}
                      height={18}
                      className='mr-2' />{user?.email}</p>
                  {user?.phone && (
                    <p className="description">
                      <img 
                      src={Phone}
                      height={18} 
                      className='mr-1'/> {user?.phone || ""}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
      </Col>
      <TabContent activeTab={activeTab} className='col-md-8'>
      <Nav tabs className='mb-4'>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            <img 
              src={User}
              height={17}
              className='mr-2' />
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            <img 
              src={Key}
              height={17}
              className='mr-2' />
            Change Password
          </NavLink>
        </NavItem>
      </Nav>
        <TabPane tabId="1">
          <UserProfile />
        </TabPane>

        <TabPane tabId="2">
          <ChangePassword />
        </TabPane>
      </TabContent>
      </Row>
    </div>
  );
};

export default Auth;
