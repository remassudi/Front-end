import React from "react";
import { Button, Card, CardHeader, CardBody, Input } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import api from '../../../container/Api';
import SiteNav from "../../../components/Navbars/SiteNav";
import $ from "jquery";
import AppConfig from "../../../constants/AppConfig";
import {Helmet} from "react-helmet";

class EditBook extends React.Component {

  state = {
    book: null,
    name: null,
    writer: null,
    translator: null,
    publisher: null,
    language: null,
    summary: null,
    image: null,
    page: null,
    realName: null,
    nameAlert: false,
    writerAlert: false,
    publisherAlert: false,
    languageAlert: false,
    pageAlert: false,
    pageIntAlert: false,
    successAlert: false,
    rotateLoginShow: false,
    enterBtnShow: true
  }

  componentDidMount() {
    this.triggerButtonEnter();
    this.getBook();
  }

  getBook() {
    api.get("book/get_bookInfo/" + this.props.match.params.id)
        .then((response) => {
          // console.log(response.data);
          this.setState({book: response.data.book});
        })
        .catch((error) => {
          console.log(error);
        });
  }

  onEditBook() {
    if (this.state.name === '') {
      this.openAlert('nameAlert');
    } else if (this.state.writer === '') {
      this.openAlert('writerAlert');
    } else if (this.state.publisher === '') {
      this.openAlert('publisherAlert');
    }  else if (this.state.language === '') {
      this.openAlert('languageAlert');
    } else if (this.state.page === '') {
      this.openAlert('pageAlert');
    } else if (this.state.page !== null && !(/^\d+$/.test(this.state.page))) {
      this.openAlert('pageIntAlert');
    } else {
      this.editBook();
    }
  }

  editBook() {
    this.setState({
      rotateLoginShow: true,
      enterBtnShow: false
    });

    let formdata = new FormData();
    formdata.append("book_id", this.props.match.params.id);

    if (this.state.name !== null) {
      formdata.append("name", this.state.name);
    }
    if (this.state.writer !== null) {
      formdata.append("writer", this.state.writer);
    }
    if (this.state.publisher !== null) {
      formdata.append("publisher", this.state.publisher);
    }
    if (this.state.translator !== null) {
      formdata.append("translator", this.state.translator);
    }
    if (this.state.language !== null) {
      formdata.append("language", this.state.language);
    }
    if (this.state.page !== null) {
      formdata.append("page", this.state.page);
    }
    if (this.state.realName !== null) {
      formdata.append("realName", this.state.realName);
    }
    if (this.state.summary !== null) {
      formdata.append("summary", this.state.summary);
    }
    if (this.state.image !== null) {
      formdata.append("bookImage", this.state.image);
    }
    
    api.post("book/edit_book", formdata)
      .then((response) => {
        // console.log(response.data);
        this.setState({
          rotateLoginShow: false,
          enterBtnShow: true
        });
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
    window.location.href = "/book/show/" + this.props.match.params.id;
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
    const { nameAlert, writerAlert, publisherAlert, languageAlert, pageIntAlert, pageAlert, successAlert, book } = this.state;

    return (
      <div className="background">
        <Helmet>
          <title>{AppConfig.app_title} ویرایش اطلاعات کتاب </title>
          <meta name="description" content="Desktop"/>
        </Helmet>

        <SiteNav />

        <div className="loginPage profilePage profile-page">
          <div className="container pt-lg-2">
            {book != null ?
                <Card className="card-profile shadow">

                  <CardHeader className="bg-white header fontLale">
                    ویرایش کتاب {book.name}
                  </CardHeader>

                  <CardBody className="px-md-5 px-0 py-lg-5">
                    <div className="row">
                      <div className="col-12 justify-content-center px-md-10 px-1 d-flex addBook">
                        <form>

                          <div className="form-group">
                            <label>نام کتاب*</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.name} invalid={this.state.name==''}
                                   onChange={(event) => this.setState({name: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>نام نویسنده*</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.writer} invalid={this.state.writer==''}
                                   onChange={(event) => this.setState({writer: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>نام مترجم</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.translator}
                                   onChange={(event) => this.setState({translator: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>نام اصلی کتاب (برای کتاب‌های ترجمه شده)</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.realName}
                                   onChange={(event) => this.setState({realName: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>نام ناشر*</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.publisher} invalid={this.state.publisher==''}
                                   onChange={(event) => this.setState({publisher: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>شابک (ISBN)*</label>
                            <Input type="text" className="form-control edit-form" value={book.ISBN}/>
                          </div>

                          <div className="form-group">
                            <label>تعداد صفحات*</label>
                            <Input type="text" className="form-control edit-form" defaultValue={book.page} invalid={this.state.page==''}
                                   onChange={(event) => this.setState({page: event.target.value})}/>
                          </div>

                          <div className="form-group">
                            <label>زبان*</label>
                            <div className="d-flex justify-content-start w-100">
                              <select className="custom-select" id="inlineFormCustomSelectPref" defaultValue={book.language} style={this.state.language == '' ? {borderColor: '#fb6340'}:{}}
                                      onChange={(event) => this.setState({language: event.target.value})}>
                                <option selected disabled>انتخاب کنید</option>
                                <option value="فارسی"> فارسی </option>
                                <option value="انگلیسی">انگلیسی</option>
                                <option value="other">زبان‌های دیگر</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>خلاصه</label>
                            <Input
                                className="form-control edit-form"
                                rows="3"
                                type="textarea"
                                defaultValue={book.summary}
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
                                    onClick={() => this.onEditBook()}>
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
                :
                null
            }
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
            success
            confirmBtnText="مشاهده کتاب"
            cancelBtnText="ادامه‌ ویرایش"
            cancelBtnBsStyle='info'
            showCancel={true}
            btnSize="sm"
            show={successAlert}
            title="ویرایش کتاب با موفقیت انجام شد."
            onConfirm={() => this.onWatchBook()}
            onClickOutside={() => this.onConfirm('successAlert')}
            onCancel={() => this.onConfirm('successAlert')}
        />
        
      </div>
    );
  }
}

export default EditBook;
