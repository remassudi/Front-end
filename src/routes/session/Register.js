import React from "react";
import {Button, Card, CardHeader, CardBody} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import api from '../../container/Api';
import AppConfig from '../../constants/AppConfig';
import LoginNav from "../../components/Navbars/LoginNav";
import $ from "jquery";
import {Helmet} from "react-helmet";

class Register extends React.Component {

  state = {
    email: '',
    password: '',
    rePassword: '',
    type1: "password",
    type2: "password",
    emailAlert: false,
    passwordAlert: false,
    rePasswordAlert: false,
    samePasswordAlert: false,
    passwordLengthAlert: false,
    existMailAlert: false,
    rotateLoginShow: false,
    enterBtnShow: true
  }

  componentDidMount() {
    this.triggerButtonEnter();
  }

  onUserSignUp() {
    const emailRex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

    if (!emailRex.test(this.state.email)) {
      this.openAlert('emailAlert');
    } else if (this.state.password === '') {
      this.openAlert('passwordAlert');
    } else if (this.state.rePassword === '') {
      this.openAlert('rePasswordAlert');
    } else if (this.state.rePassword !== this.state.password) {
      this.openAlert('samePasswordAlert');
    } else if (this.state.password.length < 6) {
      this.openAlert('passwordLengthAlert');
    } else {
      this.signUp();
    }
  }

  signUp() {
    this.setState({
      rotateLoginShow: true,
      enterBtnShow: false
    });

    const postData = {
      "password": this.state.password,
      "email": this.state.email
    };
    api.post("user/signup", postData)
      .then((response) => {
        // console.log(response.data);
        localStorage.setItem('token', response.data.token);
        window.location.href = "/user/edit";
      })
      .catch((error) => {
        console.log(error);
        if (error.response !== undefined) {
          if (error.response.data.error === "user_exist") {
            this.openAlert('existMailAlert');
          }
        }
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
      });
  }

  showPassword(type) {
    if (type === 1) {
      this.setState({type1: "text"});
    } else if (type === 2) {
      this.setState({type2: "text"});
    }
  }
  hidePassword(type) {
    if (type === 1) {
      this.setState({type1: "password"});
    } else if (type === 2) {
      this.setState({type2: "password"});
    }
  }

  openAlert(key) {
    this.setState({ [key]: true });
  }
  onConfirm(key) {
    this.setState({ [key]: false })
  }

  keyT = 0;
  triggerButtonEnter() {
    let thisComponent = this;
    $(document).keydown(function(e){
      if (e.which === 13){
        thisComponent.keyT++;
        if (thisComponent.keyT === 1) {
          $("#clickButton").click();
        }
      }
    });
    $(document).keyup(function(e){
      if (e.which === 13){
        thisComponent.keyT = 0;
      }
    });
  }

  render() {
    let rotateLogin = this.state.rotateLoginShow ? "rotateLogin" : "rotateLoginHide";
    let enterBtnShow = this.state.enterBtnShow ? "mt-4 fontLale w-100 mr-0" : "mt-4 fontLale enterBtnHide w-100 mr-0";
    const { type1, type2, emailAlert, passwordAlert, rePasswordAlert, samePasswordAlert, passwordLengthAlert, existMailAlert } = this.state;

    return (
        <>
          <Helmet>
            <title>{AppConfig.app_title} ثبت نام </title>
            <meta name="description" content="Desktop"/>
          </Helmet>

          <LoginNav/>
          <div className="loginPage loginBackground">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5 mt-1">
                  <Card className="bg-secondary shadow border-0 mt-5">
                    <CardHeader className="bg-white header fontLale">
                      ثبت نام
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

                            <input type={type1} className="form-control" placeholder="Password"
                            onChange={(event) => this.setState({password: event.target.value})}
                            />

                            <div className="input-group-postpend">
                              <span className="input-group-text">
                                <i className="fa fa-eye" aria-hidden="true" 
                                  onMouseDown={() => this.showPassword(1)}
                                  onMouseUp={() => this.hidePassword(1)}>
                                </i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>تکرار رمز عبور</label>
                          <div className="input-group input_style mb-3 directionLtr">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="fa fa-lock" aria-hidden="true"/>
                              </span>
                            </div>

                            <input type={type2} className="form-control" placeholder="Password"
                            onChange={(event) => this.setState({rePassword: event.target.value})}/>

                            <div className="input-group-postpend">
                              <span className="input-group-text">
                                <i className="fa fa-eye" aria-hidden="true" 
                                  onMouseDown={() => this.showPassword(2)}
                                  onMouseUp={() => this.hidePassword(2)}>
                                </i>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <Button id="clickButton" className={enterBtnShow} color="danger" type="button"
                           onClick={() => this.onUserSignUp()}>
                            ثبت نام
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
                        <p className="pLink"> قبلا در {AppConfig.app_name} عضو شده‌‌اید؟ <a href="/session/login" style={{color: 'primary'}}> وارد شوید </a> </p>
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
            title="پست الکترونیکی نامعتبر است"
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
            show={rePasswordAlert}
            title="تکرار کلمه عبور را وارد کنید"
            onConfirm={() => this.onConfirm('rePasswordAlert')}
          />
          <SweetAlert
            focusConfirmBtn={false}
            confirmBtnText="متوجه شدم"
            warning
            btnSize="sm"
            show={passwordLengthAlert}
            title="کلمه عبور باید بیش از ۶ حرف یا کلمه باشد"
            onConfirm={() => this.onConfirm('passwordLengthAlert')}
          />
          <SweetAlert
            focusConfirmBtn={false}
            confirmBtnText="متوجه شدم"
            warning
            btnSize="sm"
            show={samePasswordAlert}
            title="کلمه عبور و تکرار آن یکسان نمی‌باشند"
            onConfirm={() => this.onConfirm('samePasswordAlert')}
          />
          <SweetAlert
            focusConfirmBtn={false}
            confirmBtnText="متوجه شدم"
            warning
            btnSize="sm"
            show={existMailAlert}
            title="قبلا با این پست الکترونیکی عضو شده‌اید"
            onConfirm={() => this.onConfirm('existMailAlert')}
          />
        </>
    );
  }
}

export default Register;
