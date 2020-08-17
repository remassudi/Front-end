import React from "react";
import {Button, Card, Input} from "reactstrap";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import api from '../../../container/Api';
import AppConfig from '../../../constants/AppConfig';
import SiteNav from "../../../components/Navbars/SiteNav";
import SweetAlert from "react-bootstrap-sweetalert";
import {Helmet} from "react-helmet";

class Shelves extends React.Component {

  state = {
    shelfList: null,
    data: null,
    favouriteList: null,
    currentShelf: "all",
    modal: false,
    name: '',
    nameAlert: false,
    editMode: false,
    userSelf: false
  }

  componentDidMount() {
    this.getShelfList();

    if (this.props.match.params.id == 'all') {
      this.setState({userSelf: true});
    }
  }

  getShelfList() {
    api.get("user/get_shelfList")
        .then((response) => {
          let list = response.data.shelves.shelves;
          let i;
          for (i = 0; i < list.length; i++) {
            if (list[i].name == "کتاب‌های مورد علاقه") {
              this.state.favouriteList = list[i]._id;
              list.splice(i, 1);
            }
          }
          this.setState({shelfList: list});
          this.getShelf(this.props.match.params.id);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  getShelf(id) {
    if (id != this.state.currentShelf) {
      document.getElementById(id).classList.add("activeShelf");
      document.getElementById(this.state.currentShelf).classList.remove("activeShelf");
      this.state.currentShelf = id;
    }

    const postData = {
      "shelf_id": id
    };

    api.post("user/get_shelf", postData)
        .then((response) => {
          if (id == "all") {
            this.setState({data: response.data.shelf});
          } else {
            this.setState({data: response.data.shelf.books});
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }

  deleteBook(id) {
    const postData = {
      "shelf_id": this.state.currentShelf,
      "book_id": id
    };

    api.post("book/remove_book_fromShelf", postData)
        .then((response) => {
          this.getShelf(this.state.currentShelf);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  createShelf() {
    if (this.state.name == '') {
      this.openAlert('nameAlert');
    } else {
      this.setState({name: ''});
      const postData = {
        "name": this.state.name
      };

      api.post("user/create_shelf", postData)
          .then((response) => {
            this.getShelfList();
            this.toggleModal();
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }

  editShelves() {
    let shelves = document.getElementsByClassName("deleteShelf");
    let i;

    if (this.state.editMode) {
      for (i = 0; i < shelves.length; i++) {
        shelves[i].classList.add("d-none");
      }
    } else {
      for (i = 0; i < shelves.length; i++) {
        shelves[i].classList.remove("d-none");
      }
    }
    this.setState({editMode: !this.state.editMode});
  }

  deleteShelf(id) {
    const postData = {
      "shelf_id": id
    };

    api.post("user/remove_shelf", postData)
        .then((response) => {
          this.getShelfList();
        })
        .catch((error) => {
          console.log(error);
        });
  }

  toggleModal = () => {
    this.setState({name: ''});
    this.setState({
      modal: !this.state.modal
    });
  };

  openAlert(key) {
    this.setState({ [key]: true });
  }
  onConfirm(key) {
    this.setState({ [key]: false })
  }

  render() {
    const { data, shelfList, modal, nameAlert, editMode } = this.state;

    return (
      <div className="background">
        <Helmet>
          <title>طاقچه‌ها</title>
          <meta name="description" content="Desktop"/>
        </Helmet>

        <SiteNav />
        <div className="shelveList loginPage profilePage profile-page d-flex justify-content-around">
          
          <div className="row w-100 d-flex justify-content-center">
            <div className="col-lg-3 col-12 pt-lg-2 mb-md-0 mb-3">
              <Card className="card-profile shadow">
                <div className="px-4">
                  <div className="fontLale pt-4" style={{fontSize: '20px'}}>
                    لیست طاقچه‌های کتاب
                  </div>

                  <div className="d-flex flex-column text-right mt-1 py-4 border-top shelveListName pr-3">
                    {this.state.userSelf ?
                        <div className="d-flex justify-content-between align-items-center">
                          <a id="all" onClick={() => this.getShelf('all')} className="activeShelf"> همه </a>
                          <i className="fa fa-pencil text-gray" aria-hidden="true" onClick={() => this.editShelves()}/>
                        </div>
                        :
                        null
                    }

                    {shelfList != null && shelfList.map((shelf, index) => {
                      return (
                          <div className="d-flex justify-content-between align-items-center">
                            <a id={shelf._id} onClick={() => this.getShelf(shelf._id)}> {shelf.name} </a>
                            {shelf.name != 'بعدا می‌خوانم' && shelf.name != 'در حال خواندن' && shelf.name != 'خوانده‌شده' ?
                                <i className={editMode ? 'fa fa-trash-o text-danger deleteShelf':'fa fa-trash-o text-danger deleteShelf d-none'} aria-hidden="true" onClick={() => this.deleteShelf(shelf._id)}/>
                                :
                                null
                            }
                          </div>
                      )
                    })}
                  </div>

                  <div className="d-flex flex-column text-right py-4 border-top shelveListName pr-3">
                    {shelfList != null ?
                        <a id={this.state.favouriteList} onClick={() => this.getShelf(this.state.favouriteList)}> کتاب‌های مورد علاقه </a>
                        :
                        null
                    }
                  </div>

                  <div className="d-flex flex-column text-right py-4 border-top shelveListName">
                    <Button
                        className="fontSahel"
                        color="default"
                        onClick={this.toggleModal}
                        size="sm"
                    >
                      اضافه کردن طاقچه
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-lg-7 col-12 pt-lg-2">
              <Card className="card-profile shadow shelvesCard ml-md-0 ml-3">
                <div className="p-4">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{fontSize: '25px'}}>📚</TableCell>
                        <TableCell> نام کتاب </TableCell>
                        <TableCell> نام نویسنده </TableCell>
                        <TableCell> ناشر </TableCell>
                        <TableCell> زبان </TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data != null && data.map((book, index) => {
                        return (
                            <TableRow id={book._id} hover>
                              <TableCell className="shelfBookImg">
                                {book.book.bookImage != null ?
                                    <img
                                        alt={book.book.name}
                                        className="bookCover"
                                        src={AppConfig.api_baseURL + book.book.bookImage}
                                    />
                                    :
                                    <img
                                        alt="..."
                                        className="bookCover"
                                        src={require("../../../assets/img/proj/bookCover.png")}
                                    />
                                }
                              </TableCell>
                              <TableCell>
                                <a className="font-weight-500" href={`/book/show/${book.book._id}`} target="_blank" style={{color: 'rgba(0, 0, 0, 0.87)'}}>
                                  {book.book.name}
                                </a>
                              </TableCell>
                              <TableCell> {book.book.writer} </TableCell>
                              <TableCell> {book.book.publisher} </TableCell>
                              <TableCell> {book.book.language} </TableCell>
                              <TableCell className="removeBookShelf px-1" onClick={() => this.deleteBook(book._id)}>
                                <button type="button" className="btn btn-outline-danger px-2">
                                  <i className="fa fa-trash-o" aria-hidden="true"/>
                                </button>
                              </TableCell>
                            </TableRow>
                        )
                      })}

                    </TableBody>
                  </Table>
                </div>
              </Card>

            </div>
          </div>

          <Modal isOpen={modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}> اضافه کردن طاقچه جدید </ModalHeader>
            <ModalBody>
              <form>

                <div className="form-group">
                  <label>نام طاقچه*</label>
                  <Input type="text" className="form-control edit-form" invalid={this.state.name==''}
                         onChange={(event) => this.setState({name: event.target.value})}/>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" type="button" onClick={() => this.createShelf()}>
                ایجاد طاقچه
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <SweetAlert
            focusConfirmBtn={false}
            confirmBtnText="متوجه شدم"
            warning
            btnSize="sm"
            show={nameAlert}
            title="نام طاقچه را وارد کنید"
            onConfirm={() => this.onConfirm('nameAlert')}
        />
      </div>
    );
  }
}

export default Shelves;
