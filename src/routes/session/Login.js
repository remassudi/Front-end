import React from "react";
import { Button, Card, CardHeader, CardBody } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import api from '../../container/Api';
import AppConfig from '../../constants/AppConfig';
import LoginNav from "../../components/Navbars/LoginNav";
import $ from "jquery";
import {Helmet} from "react-helmet";

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    emailAlert: false,
    passwordAlert: false,
    loginAlert: false,
    rotateLoginShow: false,
    enterBtnShow: true
  }

  componentDidMount() {
    this.triggerButtonEnter();
  }

  onUserLogin() {
    if (this.state.email === '') {
      this.openAlert('emailAlert');
    } else if (this.state.password === '') {
      this.openAlert('passwordAlert');
    } else {
      this.loginUser();
    }
  }

  loginUser() {
    this.setState({
      rotateLoginShow: true,
      enterBtnShow: false
    });

    const postData = {
      "password": this.state.password,
      "email": this.state.email
    };

    api.post("user/login", postData)
        .then((response) => {
          // console.log(response.data);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          if (localStorage.getItem("lastPath") != null && localStorage.getItem("lastPath").toLowerCase() != '/session/login') {
            window.location.href = localStorage.getItem("lastPath");
            localStorage.removeItem("lastPath");
          } else {
            window.location.href = "/home";
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response !== undefined) {
            this.openAlert('loginAlert');
          }
          this.setState({
            rotateLoginShow: false,
            enterBtnShow: true
          });
        });
  }

  openAlert(key) {
    this.setState({[key]: true});
  }

  onConfirm(key) {
    this.setState({[key]: false})
  }

  keyT = 0;
  triggerButtonEnter() {
    let thisComponent = this;
    $(document).keydown(function (e) {
      if (e.which === 13) {
        thisComponent.keyT++;
        if (thisComponent.keyT === 1) {
          $("#clickButton").click();
        }
      }
    });
    $(document).keyup(function (e) {
      if (e.which === 13) {
        thisComponent.keyT = 0;
      }
    });
  }

  render() {
    let rotateLogin = this.state.rotateLoginShow ? "rotateLogin" : "rotateLoginHide";
    let enterBtnShow = this.state.enterBtnShow ? "mt-4 fontLale w-100 mr-0" : "mt-4 fontLale enterBtnHide w-100 mr-0";
    const { emailAlert, passwordAlert, loginAlert } = this.state;

    return (
        <>
          <Helmet>
            <title>{AppConfig.app_title} ورود </title>
            <meta name="description" content="Desktop"/>
          </Helmet>

          <LoginNav/>
          <div className="loginPage loginBackground">
            <div className="container pt-lg-4">
              <div className="row justify-content-center">
                <div className="col-lg-5 mt-5">
                  <Card className="bg-secondary shadow border-0 mt-5">
                    <CardHeader className="bg-white header fontLale">
                      ورود
                    </CardHeader>

                    <CardBody className="px-lg-5 py-lg-5">
                      <form>

                        <div className="form-group">
                          <label>پست الکترونیکی</label>
                          <div className="input-group input_style directionLtr">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="fa fa-envelope" aria-hidden="true"/>
                              </span>
                            </div>
                            <input type="email" className="form-control" placeholder="Email"
                                   onChange={(event) => this.setState({email: event.target.value})}/>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>رمز عبور</label>
                          <div className="input-group input_style directionLtr">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="fa fa-lock" aria-hidden="true"/>
                              </span>
                            </div>
                            <input type="password" className="form-control" placeholder="Password"
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                          </div>
                        </div>

                        <div className="text-center">
                          <Button id="clickButton" className={enterBtnShow} color="danger" type="button"
                                  onClick={() => this.onUserLogin()}>
                            ورود
                          </Button>

                          <div className="loginBox registerLoading">
                            <div className={rotateLogin}>
                              <span className="icon-refresh"/>
                              <span className="icon-refresh"/>
                              <div className="lds-dual-ring"/>
                            </div>
                          </div>
                        </div>
                      </form>

                      <div>
                        <p className="pLink">
                          کاربر جدید هستید؟
                          <a href="/session/register" style={{color: 'danger'}}>
                            عضویت در {AppConfig.app_name}
                          </a>
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <SweetAlert
              focusConfirmBtn={false}
              confirmBtnText="متوجه شدم"
              warning
              btnSize="sm"
              show={emailAlert}
              title="پست الکترونیکی را وارد کنید"
              onConfirm={() => this.onConfirm('emailAlert')}
          />
          <SweetAlert
              focusConfirmBtn={false}
              confirmBtnText="متوجه شدم"
              warning
              btnSize="sm"
              show={passwordAlert}
              title="کلمه عبور را وارد کنید"
              onConfirm={() => this.onConfirm('passwordAlert')}
          />
          <SweetAlert
              focusConfirmBtn={false}
              confirmBtnText="متوجه شدم"
              warning
              btnSize="sm"
              show={loginAlert}
              title="پست الکترونیکی یا رمز عبور نامعتبر می‌باشد"
              onConfirm={() => this.onConfirm('loginAlert')}
          />
        </>
    );
  }
}

export default Login;
