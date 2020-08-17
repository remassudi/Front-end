import React from "react";
import { Link } from "react-router-dom";
import { NavbarBrand, Navbar, Container } from "reactstrap";
import AppConfig from '../../constants/AppConfig';

class LoginNav extends React.Component {

  render() {
    return (
        <>
          <header>
            <Navbar className="navbar-main navbar-transparent mt-2">
              <Container>
                <NavbarBrand className="mr-lg-5 fontLale navBrand" to="/home" tag={Link}>
                  {AppConfig.app_name}
                </NavbarBrand>
              </Container>
            </Navbar>
          </header>
        </>
    );
  }
}

export default LoginNav;
