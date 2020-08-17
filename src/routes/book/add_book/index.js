import React from "react";
import { Button, Card, CardHeader, CardBody, Input } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import api from '../../../container/Api';
import SiteNav from "../../../components/Navbars/SiteNav";
import $ from "jquery";
import AppConfig from "../../../constants/AppConfig";
import {Helmet} from "react-helmet";

class AddBook extends React.Component {

  state = {
    name: '',
    writer: '',
    translator: null,
    publisher: '',
    isbn: '',
    language: '',
    summary: null,
    image: null,
    page: '',
    realName: null,
    nameAlert: false,
    writerAlert: false,
    publisherAlert: false,
    isbnAlert: false,
    languageAlert: false,
    pageAlert: false,
    pageIntAlert: false,
    existAlert: false,
    successAlert: false,
    rotateLoginShow: false,
    enterBtnShow: true,
    newBook: null
  }

  componentDidMount() {
    this.triggerButtonEnter();
  }

  onAddBook() {
    if (this.state.name === '') {
      this.openAlert('nameAlert');
    } else if (this.state.writer === '') {
      this.openAlert('writerAlert');
    } else if (this.state.publisher === '') {
      this.openAlert('publisherAlert');
    } else if (this.state.isbn === '') {
      this.openAlert('isbnAlert');
    } else if (this.state.language === '') {
      this.openAlert('languageAlert');
    } else if (this.state.page === '') {
      this.openAlert('pageAlert');
    } else if (!(/^\d+$/.test(this.state.page))) {
      this.openAlert('pageIntAlert');
    } else {
      this.addBook();
    }
  }

  addBook() {
    this.setState({
      rotateLoginShow: true,
      enterBtnShow: false
    });

    var formdata = new FormData();
    formdata.append("isbn", this.state.isbn);
    formdata.append("name", this.state.name);
    formdata.append("writer", this.state.writer);
    formdata.append("language", this.state.language);
    formdata.append("publisher", this.state.publisher);
    formdata.append("page", this.state.page);
    formdata.append("translator", this.state.translator);
    formdata.append("realName", this.state.realName);
    formdata.append("summary", this.state.summary);
    formdata.append("bookImage", this.state.image);
    
    api.post("book/add_book", formdata)
      .then((response) => {
        // console.log(response.data);
        this.state.newBook = response.data.id;
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
        this.openAlert("successAlert");
      })
      .catch((error) => {
        console.log(error);
        if (error.response !== undefined) {
          if (error.response.data.error == 'book exists') {
            this.openAlert('existAlert');
          }
        }
        
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
      });
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

  openAlert(key) {
    this.setState({ [key]: true });
  }
  onConfirm(key) {
    this.setState({ [key]: false })
  }
  onWatchBook() {
    window.location.href = "/book/show/" + this.state.newBook;
  }
  onAddNewBook() {
    window.location.href = "/book/add_book";
  }

  openFileDialog() {
    this.inputElement.click();
  }
  imageChangeHandler  =  event => { 
    let imageFile = event.target.files[0];
    this.setState({ image: imageFile });
  };

  render() {
    let rotateLogin = this.state.rotateLoginShow ? "rotateLogin" : "rotateLoginHide";
    let enterBtnShow = this.state.enterBtnShow ? "mt-4 fontLale" : "mt-4 fontLale enterBtnHide";
    const { nameAlert, writerAlert, publisherAlert, isbnAlert, languageAlert, existAlert, pageIntAlert, pageAlert, successAlert } = this.state;

    return (
      <div className="background">
        <Helmet>
          <title>{AppConfig.app_title} ثبت کتاب جدید </title>
          <meta name="description" content="Desktop"/>
        </Helmet>

        <SiteNav />

        <div className="loginPage profilePage profile-page">
          <div className="container pt-lg-2">
            <Card className="card-profile shadow">

              <CardHeader className="bg-white header fontLale">
                ثبت کتاب جدید
              </CardHeader>

              <CardBody className="px-md-5 px-0 py-lg-5">
                <div className="row">
                  <div className="col-12 justify-content-center px-md-10 px-1 d-flex addBook">
                    <form>

                      <div className="form-group">
                        <label>نام کتاب*</label>
                        <Input type="text" className="form-control edit-form" invalid={this.state.name==''}
                          onChange={(event) => this.setState({name: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>نام نویسنده*</label>
                        <Input type="text" className="form-control edit-form" invalid={this.state.writer==''}
                          onChange={(event) => this.setState({writer: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>نام مترجم</label>
                        <Input type="text" className="form-control edit-form"
                          onChange={(event) => this.setState({translator: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>نام اصلی کتاب (برای کتاب‌های ترجمه شده)</label>
                        <Input type="text" className="form-control edit-form"
                          onChange={(event) => this.setState({realName: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>نام ناشر*</label>
                        <Input type="text" className="form-control edit-form" invalid={this.state.publisher==''}
                          onChange={(event) => this.setState({publisher: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>شابک (ISBN)*</label>
                        <Input type="text" className="form-control edit-form" invalid={this.state.isbn==''}
                          onChange={(event) => this.setState({isbn: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>تعداد صفحات*</label>
                        <Input type="text" className="form-control edit-form" invalid={this.state.page==''}
                          onChange={(event) => this.setState({page: event.target.value})}/>
                      </div>

                      <div className="form-group">
                        <label>زبان*</label>
                        <div className="d-flex justify-content-start w-100">
                          <select className="custom-select" id="inlineFormCustomSelectPref" style={this.state.language == '' ? {borderColor: '#fb6340'}:{}}
                           onChange={(event) => this.setState({language: event.target.value})}>
                            <option selected disabled>انتخاب کنید</option>
                            <option value="فارسی"> فارسی </option>
                            <option value="انگلیسی">انگلیسی</option>
                            <option value="زبان‌های دیگر">زبان‌های دیگر</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>خلاصه</label>
                        <Input
                          className="form-control edit-form"
                          rows="3"
                          type="textarea"
                          onChange={(event) => this.setState({summary: event.target.value})}
                        />
                      </div>

                      <div className="form-group">
                        <label>تصویر</label>
                        <input type="file" onChange={this.imageChangeHandler} ref={input => this.inputElement = input} style={{display: 'none'}} id="book-image"/>
                        <Button onClick={() => this.openFileDialog()} className="btn-icon btn-3 fontLale mt-2 mr-3" color="success" type="button">
                          <span className="btn-inner--icon ml-1">
                            <i className="fa fa-upload" aria-hidden="true"/>
                          </span>
                          <span className="btn-inner--text"> انتخاب تصویر</span>
                        </Button>
                      </div>

                      <div className="text-center mt-5">
                        <Button id="clickButton" className={enterBtnShow} color="danger" type="button" style={{width: '50%'}}
                          onClick={() => this.onAddBook()}>
                          ثبت
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
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={nameAlert}
          title="نام کتاب را وارد کنید"
          onConfirm={() => this.onConfirm('nameAlert')}
          onClickOutside={() => this.onConfirm('nameAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={writerAlert}
          title="نام نویسنده را وارد کنید"
          onConfirm={() => this.onConfirm('writerAlert')}
          onClickOutside={() => this.onConfirm('writerAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={publisherAlert}
          title="نام ناشر را وارد کنید"
          onConfirm={() => this.onConfirm('publisherAlert')}
          onClickOutside={() => this.onConfirm('publisherAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={isbnAlert}
          title="شابک کتاب را وارد کنید"
          onConfirm={() => this.onConfirm('isbnAlert')}
          onClickOutside={() => this.onConfirm('isbnAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={languageAlert}
          title="زبان کتاب را وارد کنید"
          onConfirm={() => this.onConfirm('languageAlert')}
          onClickOutside={() => this.onConfirm('languageAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={pageAlert}
          title="تعداد صفحات کتاب را وارد کنید"
          onConfirm={() => this.onConfirm('pageAlert')}
          onClickOutside={() => this.onConfirm('pageAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          warning
          btnSize="sm"
          show={pageIntAlert}
          title="تعداد صفحات کتاب باید یک عدد باشد"
          onConfirm={() => this.onConfirm('pageIntAlert')}
          onClickOutside={() => this.onConfirm('pageIntAlert')}
        />

        <SweetAlert
          focusConfirmBtn={false}
          confirmBtnText="متوجه شدم"
          error
          btnSize="sm"
          show={existAlert}
          title="این کتاب در حال حاضر در سایت وجود دارد!"
          onConfirm={() => this.onConfirm('existAlert')}
          onClickOutside={() => this.onConfirm('existAlert')}
        />
        <SweetAlert
          focusConfirmBtn={false}
          success
          confirmBtnText="مشاهده کتاب"
          cancelBtnText="ثبت کتاب جدید"
          cancelBtnBsStyle='info'
          showCancel={true}
          btnSize="sm"
          show={successAlert}
          title="ثبت کتاب با موفقیت انجام شد."
          onConfirm={() => this.onWatchBook()}
          onClickOutside={() => this.onConfirm('successAlert')}
          onCancel={() => this.onAddNewBook()}
      />
        
      </div>
    );
  }
}

export default AddBook;
