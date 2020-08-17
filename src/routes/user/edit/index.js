
import React from "react";
import {Button, Card, CardHeader, CardBody, Input, ModalHeader, ModalBody, Modal, ModalFooter} from "reactstrap";

import api from '../../../container/Api';
import AppConfig from '../../../constants/AppConfig';
import SiteNav from "../../../components/Navbars/SiteNav";
import SweetAlert from "react-bootstrap-sweetalert";
import {Helmet} from "react-helmet";

class Edit extends React.Component {

  state = {
    userInfo: null,
    name: null,
    familyName: '',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
    biography: '',
    profileImage: "../../../assets/img/proj/user-profile-icon.jpg",
    image: null,
    nameAlert: false,
    successAlert: false,
    rotateLoginShow: false,
    enterBtnShow: true,
    modal: false,
    password: '',
    newPassword: '',
    type1: "password",
    type2: "password",
    passwordAlert: false,
    newPasswordAlert: false,
    passwordLengthAlert: false,
    passwordIncorrectAlert: false,
    passSuccessAlert: false
  }

  componentDidMount() {
    this.getUserInfo();
  }

  onEditProfile() {
    if (this.state.name === '' || this.state.name === null) {
      this.openAlert('nameAlert');
    } else {
      this.editProfile();
    }
  }

  editProfile() {
    this.setState({
      rotateLoginShow: true,
      enterBtnShow: false
    });

    var formdata = new FormData();
    formdata.append("name", this.state.name);
    formdata.append("familyName", this.state.familyName);
    formdata.append("birthDate", this.state.birthDate);
    formdata.append("birthMonth", this.state.birthMonth);
    formdata.append("birthYear", this.state.birthYear);
    formdata.append("biography", this.state.biography);
    formdata.append("profileImage", this.state.image);
    
    api.post("user/edit_profile", formdata)
      .then((response) => {
        this.getUserInfo();
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.openAlert("successAlert");
      })
      .catch((error) => {
        console.log(error);
      
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
      });
  }

  onChangePass() {
    if (this.state.password === '') {
      this.openAlert('passwordAlert');
    } else if (this.state.newPassword === '') {
      this.openAlert('rePasswordAlert');
    } else if (this.state.newPassword.length < 6) {
      this.openAlert('passwordLengthAlert');
    } else {
      this.changePass();
    }
  }

  changePass() {
    const postData = {
      "password": this.state.password,
      "newPassword": this.state.newPassword
    };

    api.post("user/change_pass", postData)
        .then((response) => {
          this.toggleModal();
          this.openAlert('passSuccessAlert');
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          if (error.response !== undefined) {
            if (error.response.data.error === "auth failed") {
              this.openAlert('passwordIncorrectAlert');
            }
          }
          this.setState({
            rotateLoginShow: false,
            enterBtnShow: true
          });
        });
  }

  getUserInfo() {
    api.get("user/get_userInfo")
      .then((response) => {
        // console.log(response.data);
        this.setState({userInfo: response.data.user});
        this.setState({name: response.data.user.name});
        if (response.data.user.profileImage != null) {
          this.setState({profileImage: AppConfig.api_baseURL + response.data.user.profileImage});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createDaySelect = () => {   
    let options = [];
    options.push(<option selected disabled>روز</option>);
    for (let i = 1; i < 32; i++) {
      options.push(<option value={i}>{i}</option>);
    }
    return options;
  }

  createYearSelect = () => {   
    let options = [];
    options.push(<option selected disabled>سال</option>);
    for (let i = 1399; i >= 1300; i--) {
      options.push(<option value={i}>{i}</option>);
    }
    return options;
  }

  openFileDialog() {
    this.inputElement.click();
  }
  imageChangeHandler  =  event => { 
    let imageFile = event.target.files[0];
    this.setState({ image: imageFile });
  };

  toggleModal = () => {
    this.setState({password: ''});
    this.setState({newPassword: ''});
    this.setState({
      modal: !this.state.modal
    });
  };

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
  onGoToHome() {
    window.location.href = "/home";
  }

  render() {
    const { userInfo, nameAlert, successAlert, modal, type1, type2, passwordAlert, newPasswordAlert, passwordLengthAlert, passwordIncorrectAlert, passSuccessAlert } = this.state;

    return (
      <div className="background">
        <Helmet>
          <title>{AppConfig.app_title} ویرایش اطلاعات </title>
          <meta name="description" content="Desktop"/>
        </Helmet>

        <SiteNav />
        <div className="loginPage profilePage profile-page">
          <div className="container pt-lg-2">
            <Card className="card-profile shadow">

              <CardHeader className="bg-white header fontLale">
                ویرایش اطلاعات
              </CardHeader>

              <CardBody className="px-lg-5 py-lg-5">
                {userInfo != null ?
                  <div className="row">

                    <div className="col-lg-4 order-lg-2 align-items-center d-flex flex-column">
                      <div className="profile-image">
                        <img
                            alt="profile image"
                            className="rounded-circle"
                            src={this.state.profileImage}
                        />
                      </div>

                      <input type="file" onChange={this.imageChangeHandler} ref={input => this.inputElement = input} style={{display: 'none'}} id="user-image-dialog"/>
                      <Button onClick={() => this.openFileDialog()} className="btn-icon btn-3 fontLale mt-2" color="success" type="button">
                        <span className="btn-inner--icon ml-1">
                          <i class="fa fa-upload" aria-hidden="true"/>
                        </span>
                        <span className="btn-inner--text"> انتخاب تصویر</span>
                      </Button>

                      <Button onClick={this.toggleModal} className="fontLale mt-5 mb-2 w-100" color="primary" type="button">
                        تغییر رمز عبور
                      </Button>
                    </div>

                    <div className="col-lg-8 order-lg-1 justify-content-center d-flex editProf">
                      <form>

                        <div className="form-group">
                          <label>نام</label>
                          <Input value={this.state.name} type="text" className="form-control edit-form" invalid={this.state.name == ''}
                                 onChange={(event) => this.setState({name: event.target.value})}/>
                        </div>

                        <div className="form-group">
                          <label>نام خانوادگی</label>
                          <Input defaultValue={userInfo.familyName} type="text" className="form-control edit-form"
                            onChange={(event) => this.setState({familyName: event.target.value})}/>
                        </div>

                        <div className="form-group">
                          <label>تاریخ تولد</label>
                          <div className="d-flex justify-content-between">
                            <select onChange={(event) => this.setState({birthDate: event.target.value})} defaultValue={userInfo.birthDate}
                            className="custom-select fontDigit" id="inlineFormCustomSelectPref" style={{width: '30%'}}>
                              {this.createDaySelect()}
                            </select>

                            <select onChange={(event) => this.setState({birthMonth: event.target.value})} defaultValue={userInfo.birthMonth} 
                            className="custom-select" id="inlineFormCustomSelectPref" style={{width: '30%'}}>
                              <option selected disabled>ماه</option>

                              <option value="فروردین"> فروردین </option>
                              <option value="اردیبهشت">اردیبهشت</option>
                              <option value="خرداد">خرداد</option>
                              <option value="تیر">تیر</option>
                              <option value="مرداد">مرداد</option>
                              <option value="شهریور">شهریور</option>
                              <option value="مهر">مهر</option>
                              <option value="آبان">آبان</option>
                              <option value="آذر">آذر</option>
                              <option value="دی">دی</option>
                              <option value="بهمن">بهمن</option>
                              <option value="اسفند">اسفند</option>
                            </select>

                            <select onChange={(event) => this.setState({birthYear: event.target.value})} defaultValue={userInfo.birthYear} 
                            className="custom-select fontDigit" id="inlineFormCustomSelectPref" style={{width: '30%'}}>
                              {this.createYearSelect()}
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>توضیحات</label>
                          <Input
                            defaultValue={userInfo.biography} 
                            onChange={(event) => this.setState({biography: event.target.value})}
                            className="form-control edit-form"
                            rows="3"
                            type="textarea"
                          />
                        </div>

                        <div className="text-center mt-5">
                          <Button id="clickButton" color="danger" type="button" className="fontLale px-5"
                          onClick={() => this.onEditProfile()}>
                            ویرایش
                          </Button> 
                        </div>
                      </form>
                    </div>
                  </div>
                  :
                  null
                }
              </CardBody>
            </Card>
          </div>
        </div>

        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}> تغییر رمز عبور </ModalHeader>
          <ModalBody>
            <form>

              <div className="form-group">
                <label>کلمه عبور</label>
                <div className="input-group input_style directionLtr">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-lock" aria-hidden="true"/>
                    </span>
                  </div>

                  <input type={type2} className="form-control" placeholder="Password" invalid={this.state.password == ''}
                         onChange={(event) => this.setState({password: event.target.value})}/>

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

              <div className="form-group">
                <label>کلمه عبور جدید</label>
                <div className="input-group input_style directionLtr">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-lock" aria-hidden="true"/>
                    </span>
                  </div>

                  <input type={type1} className="form-control" placeholder="Password" invalid={this.state.newPassword == ''}
                         onChange={(event) => this.setState({newPassword: event.target.value})}
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
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" type="button" onClick={() => this.onChangePass()}>
              تغییر رمز عبور
            </Button>
          </ModalFooter>
        </Modal>

        <SweetAlert
            focusConfirmBtn={false}
            confirmBtnText="متوجه شدم"
            warning
            btnSize="sm"
            show={nameAlert}
            title="لطفا نام خود را وارد کنید"
            onConfirm={() => this.onConfirm('nameAlert')}
            onClickOutside={() => this.onConfirm('nameAlert')}
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
            show={newPasswordAlert}
            title="کلمه عبور جدید را وارد کنید"
            onConfirm={() => this.onConfirm('newPasswordAlert')}
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
            show={passwordIncorrectAlert}
            title="کلمه عبور وارد شده صحیح نمی‌باشد"
            onConfirm={() => this.onConfirm('passwordIncorrectAlert')}
        />

        <SweetAlert
            focusConfirmBtn={false}
            success
            confirmBtnText="متوجه شدم"
            btnSize="sm"
            show={passSuccessAlert}
            title="کلمه عبور با موفقیت تغییر یافت"
            onConfirm={() => this.onConfirm('passSuccessAlert')}
            onClickOutside={() => this.onConfirm('passSuccessAlert')}
        />


        <SweetAlert
            focusConfirmBtn={false}
            success
            confirmBtnText="مشاهده صفحه اصلی"
            cancelBtnText="ادامه ویرایش اطلاعات"
            cancelBtnBsStyle='info'
            showCancel={true}
            btnSize="sm"
            show={successAlert}
            title="ویرایش اطلاعات با موفقیت انجام شد"
            onConfirm={() => this.onGoToHome()}
            onClickOutside={() => this.onConfirm('successAlert')}
            onCancel={() => this.onConfirm('successAlert')}
        />
      </div>
    );
  }
}

export default Edit;
