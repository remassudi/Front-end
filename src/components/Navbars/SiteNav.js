import React from "react";
import { Link } from "react-router-dom";
import {
    NavbarBrand,
    Navbar,
    Nav,
    NavItem,
    NavLink,
    Container,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Button
} from "reactstrap";

import AppConfig from '../../constants/AppConfig';

class SiteNav extends React.Component {

    state = {
        user_id: null,
        user_img: null
    }

    componentDidMount() {
        if (localStorage.getItem("user") != null) {
            let user = JSON.parse(localStorage.getItem("user"));
            this.setState({user_id: user._id});
            this.setState({user_img: user.profileImage});
        }
    }

    logOut() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location = "/session/login";
    }

  render() {
      const isUser = localStorage.getItem("token") != null;

      return (
        <>
            <Navbar className="navbar-main navbar-transparent mt-2">
                <Container>
                    <NavbarBrand className="mr-lg-5 fontLale navBrand" to="/home" tag={Link}>
                        {AppConfig.app_name}
                    </NavbarBrand>

                    {isUser ?
                        <div className="d-flex align-items-center">
                            <NavLink
                                className="timelineNav"
                                to="/user/timeline" tag={Link}
                            >
                                جدید‌ترین‌ها
                            </NavLink>

                            <UncontrolledDropdown nav>
                                <DropdownToggle nav>
                                    {this.state.user_img != null ?
                                        <img
                                            alt="profile image"
                                            className="rounded-circle navPic"
                                            src={AppConfig.api_baseURL + this.state.user_img}
                                        />
                                        :
                                        <span className="nav-link-inner--text navUserIcon">
                                            <i className="fa fa-user-circle-o" aria-hidden="true"/>
                                        </span>
                                    }
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem to={`/user/profile/${this.state.user_id}`} tag={Link}>
                                        پروفایل
                                    </DropdownItem>
                                    <DropdownItem to="/user/edit" tag={Link}>
                                        ویرایش اطلاعات
                                    </DropdownItem>
                                    <DropdownItem to="/user/shelves/all" tag={Link}>
                                        طاقچه‌ها
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.logOut()}>
                                        خروج
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        :
                        <div className="d-flex align-items-center">
                            <NavLink
                                className="timelineNav"
                                to="/session/login" tag={Link}
                            >
                                ورود
                            </NavLink>
                        </div>
                    }

                </Container>
            </Navbar>
        </>
    );
  }
}

export default SiteNav;
