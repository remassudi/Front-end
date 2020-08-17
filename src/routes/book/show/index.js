import React from "react";
import {
    Card,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    ModalHeader,
    ModalBody,
    Input,
    Button,
    Modal,
    ModalFooter
} from "reactstrap";
import Tooltip from '@material-ui/core/Tooltip';
import Rating from '@material-ui/lab/Rating';
import api from '../../../container/Api';
import dateConverter from '../../../container/dateConverter';
import AppConfig from '../../../constants/AppConfig';
import SiteNav from "../../../components/Navbars/SiteNav";
import SweetAlert from "react-bootstrap-sweetalert";
import {Helmet} from "react-helmet";

class ShowBook extends React.Component {

    state = {
        book: null,
        reviews: null,
        bookShelves: null,
        rating: 0,
        shelfList0: null,
        shelfList: null,
        modal: false,
        name: '',
        nameAlert: false,
        titleAlert: false,
        reviewAlert: false,
        loginAlert: false,
        tooltipOpen: false,
        favouriteList: {
            id: null,
            favourite: 0,
            bookShelf: null
        },
        title: '',
        review: '',
        reviewModal: false,
        isUser: localStorage.getItem("token") != null
    }

    componentDidMount() {
        this.getBook();
    }

    getBook() {
        api.get("book/get_book/" + this.props.match.params.id)
            .then((response) => {
                // console.log(response.data);
                this.setState({book: response.data.book});
                this.setState({reviews: response.data.book.reviews});
                this.setState({bookShelves: response.data.shelf});
                if (response.data.rate != null && response.data.rate.length != 0 && response.data.rate[0].rate != null) {
                    this.setState({rating: response.data.rate[0].rate});
                }
                if (this.state.isUser) {
                    this.getShelfList();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getShelfList() {
        api.get("user/get_shelfList")
            .then((response) => {
                this.state.shelfList0 = response.data.shelves.shelves;
                let i;
                let favI = -1;
                for (i = 0; i < this.state.shelfList0.length; i++) {
                    if (this.state.shelfList0[i].name == "کتاب‌های مورد علاقه") {
                        this.isBookInShelf(this.state.shelfList0[i]._id, -1, true);
                        favI = i;
                    } else {
                        this.isBookInShelf(this.state.shelfList0[i]._id, i);
                    }
                }
                this.state.shelfList0.splice(favI, 1);
                this.setState({shelfList: this.state.shelfList0});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    isBookInShelf(id, index, fav = false) {
        let i;
        let shelves = this.state.bookShelves;
        if (fav) {
            let favouriteList = {
                id: id,
                favourite: 0,
                bookShelf: null
            }
            for (i = 0; i < shelves.length; i++) {
                if (shelves[i].shelf._id = id) {
                    favouriteList.favourite = 1;
                    favouriteList.bookShelf = shelves[i]._id;
                    break;
                }
            }
            this.setState({favouriteList: favouriteList});
        } else {
            for (i = 0; i < shelves.length; i++) {
                if (shelves[i].shelf._id == id) {
                    this.state.shelfList0[index].inShelf = true;
                    this.state.shelfList0[index].bookShelfID = shelves[i]._id;
                } else {
                    this.state.shelfList0[index].inShelf = false;
                    this.state.shelfList0[index].bookShelfID = null;
                }
            }
        }
    }

    addToShelf(id, index) {
        const postData = {
            "shelf_id": id,
            "book_id": this.props.match.params.id
        };

        api.post("book/add_book_toShelf", postData)
            .then((response) => {
                if (index == -1) {
                    let favouriteList = {
                        id: this.state.favouriteList.id,
                        favourite: 1,
                        bookShelf: response.data.id
                    }
                    this.setState({favouriteList: favouriteList});
                } else {
                    this.state.shelfList0[index].inShelf = true;
                    this.state.shelfList0[index].bookShelfID = response.data.id;
                    this.setState({shelfList: this.state.shelfList0});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    removeFromShelf(book, shelf, index) {
        const postData = {
            "shelf_id": shelf,
            "book_id": book
        };

        api.post("book/remove_book_fromShelf", postData)
            .then((response) => {
                if (index == -1) {
                    let favouriteList = {
                        id: this.state.favouriteList.id,
                        favourite: 0,
                        bookShelf: null
                    }
                    this.setState({favouriteList: favouriteList});
                } else {
                    this.state.shelfList0[index].inShelf = false;
                    this.state.shelfList0[index].bookShelfID = null;
                    this.setState({shelfList: this.state.shelfList0});
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    createShelf() {
        if (this.state.name == '') {
            this.openAlert('nameAlert');
        } else {
            const postData = {
                "name": this.state.name
            };
            this.setState({name: ''});

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

    addRate(value) {
        const postData = {
            "rate": value,
            "book_id": this.props.match.params.id
        };

        api.post("book/add_rating", postData)
            .then((response) => {
                this.setState({rating: value});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addReview() {
        if (this.state.title == '') {
            this.openAlert('titleAlert');
        } else if (this.state.review == '') {
            this.openAlert('reviewAlert');
        } else {
            const postData = {
                "review": this.state.review,
                "title": this.state.title,
                "book_id": this.props.match.params.id
            };
            this.setState({title: ''});
            this.setState({review: ''});

            api.post("book/add_review", postData)
                .then((response) => {
                    let user = JSON.parse(localStorage.getItem("user"));
                    let reviews = this.state.reviews;
                    let review = {
                        user: {
                            name: user.name,
                            familyName: user.familyName,
                            profileImage: user.profileImage,
                            _id: user._id
                        },
                        title: postData.title,
                        review: postData.review,
                        date: new Date().getTime()
                    }
                    reviews.push(review);
                    this.setState({reviews: reviews});
                    this.toggleReviewModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    goToEdit() {
        window.location.href = "/book/edit/" + this.props.match.params.id;
    }

    toggleModal = () => {
        this.setState({name: ''});
        this.setState({
            modal: !this.state.modal
        });
    };

    toggleReviewModal = () => {
        if (!this.state.isUser) {
            this.openAlert('loginAlert');
        } else {
            this.setState({title: ''});
            this.setState({review: ''});
            this.setState({
                reviewModal: !this.state.reviewModal
            });
        }
    };

    openAlert(key) {
        this.setState({[key]: true});
    }
    onConfirm(key) {
        this.setState({[key]: false})
    }
    onGoToLogin() {
        window.location.href = "/session/login";
    }

    render() {
        const { rating, book, shelfList, modal, nameAlert, favouriteList, reviewModal, titleAlert, reviewAlert, isUser, loginAlert } = this.state;

        return (
            <div className="background">
                <SiteNav/>

                <div className="bookPage profile-page">
                    <div className="container pt-lg-2">
                        <Card className="card-profile shadow">
                            {book != null ?
                                <div className="px-4">
                                    <Helmet>
                                        <title>{book.name}</title>
                                        <meta name="description" content="Desktop"/>
                                    </Helmet>

                                    <div className="row p-4">
                                        <div
                                            className="col-lg-3 d-flex flex-column align-items-center pt-3 pl-2 order-lg-1">
                                            {book.bookImage != null ?
                                                <img
                                                    alt={book.name}
                                                    className="bookCover"
                                                    src={AppConfig.api_baseURL + book.bookImage}
                                                />
                                                :
                                                <img
                                                    alt="..."
                                                    className="bookCover"
                                                    src={require("../../../assets/img/proj/bookCover.png")}
                                                />
                                            }

                                            <div className="d-flex pt-3 justify-content-center">
                                                <span className="fontDigit bookRate">
                                                  {book.computedRating}
                                                </span>

                                                <Rating
                                                    value={book.computedRating}
                                                    precision={0.1}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        {isUser ?
                                            <div className="additionals d-flex flex-column order-lg-3">
                                                <div className="likeRate">
                                                    <Rating
                                                        value={favouriteList.favourite}
                                                        precision={1}
                                                        max={1}
                                                        icon={<i className="fa fa-heart" aria-hidden="true"/>}
                                                        onChange={favouriteList.favourite === 1 ? () => this.removeFromShelf(favouriteList.bookShelf, favouriteList.id, -1) : () => this.addToShelf(favouriteList.id, -1)}
                                                    />

                                                    <UncontrolledDropdown group>
                                                        <DropdownToggle caret color="success">
                                                            اضافه کردن به طاقچه
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {shelfList != null && shelfList.map((shelf, index) => {
                                                                return (
                                                                    <DropdownItem
                                                                        className={shelf.inShelf ? 'inShelf' : null}
                                                                        onClick={shelf.inShelf ? () => this.removeFromShelf(shelf.bookShelfID, shelf._id, index) : () => this.addToShelf(shelf._id, index)}>
                                                                        {shelf.name}
                                                                        {shelf.inShelf ?
                                                                            <i className="fa fa-check-square"
                                                                               aria-hidden="true"/>
                                                                            :
                                                                            null
                                                                        }
                                                                    </DropdownItem>
                                                                )
                                                            })}
                                                            <DropdownItem divider/>
                                                            <DropdownItem onClick={this.toggleModal}>
                                                                اضافه کردن طاقچه
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>

                                                <div className="d-flex justify-content-start mt-3">
                                                    <Rating
                                                        value={rating}
                                                        precision={0.5}
                                                        onChange={(event, newValue) => this.addRate(newValue)}
                                                    />
                                                    <span className="yourRate fontSahel">
                                                  امتیاز شما
                                                </span>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }

                                        <div className="col-lg-9 pr-2 order-lg-2">
                                            <div className="pt-3 pb-2 bookName fontSahel">
                                                {book.name}
                                            </div>
                                            <div className="text-muted authorName fontSahel">
                                                {book.writer}

                                                {book.translator != null && book.translator != '' ?
                                                    <span>{" "}/{" "}مترجم:{" "}{book.translator}</span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="summary">
                                                {book.summary}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 py-4 border-top row">
                                        <div className="col-11 info">
                                            <div>
                                                <span className="infoName">نام اصلی:</span>
                                                {book.realName != null ?
                                                    <span className="infoInfo"> {book.realName} </span>
                                                    :
                                                    <span className="infoInfo"> {book.name} </span>
                                                }
                                            </div>
                                            <div>
                                                <span className="infoName">شابک:</span>
                                                <span className="infoInfo">{book.ISBN}</span>
                                            </div>
                                            <div>
                                                <span className="infoName">زبان:</span>
                                                <span className="infoInfo">{book.language}</span>
                                            </div>
                                            <div>
                                                <span className="infoName">ناشر:</span>
                                                <span className="infoInfo">{book.publisher}</span>
                                            </div>
                                            <div>
                                                <span className="infoName">تعداد صفحات:</span>
                                                <span className="infoInfo fontDigit">{book.page}</span>
                                            </div>
                                        </div>
                                        <div className="col-1 editBookButton">
                                            {isUser ?
                                                <Tooltip title={<span className="editBookTooltip">ویرایش اطلاعات</span>} placement="top">
                                                    <i className="fa fa-pencil-square fa-rotate-270"
                                                       aria-hidden="true" style={{fontSize: '25px'}}
                                                       onClick={() => this.goToEdit()}
                                                    />
                                                </Tooltip>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>

                                    <div className="py-4 border-top">
                                        <div className="justify-content-center row">
                                            <div className="col-lg-11 col-12">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <p className="fontSahel" style={{width: '30%'}}>
                                                        نقدها:
                                                    </p>
                                                    <button className="btn btn-warning fontSahel" onClick={this.toggleReviewModal}>
                                                        نوشتن نقد
                                                    </button>
                                                </div>

                                                <div className="d-flex flex-column pr-md-3 pr-0 bookRevs" id="reviews">

                                                    {book.reviews != null && book.reviews.map((review, index) => {
                                                        return (
                                                            <div className="d-flex py-5 reviewDetail" style={{borderBottom: index == book.reviews.length-1 ? 'none' : '1px solid #cad1d7'}}>
                                                                <div className="col-2 d-flex flex-column align-items-center">
                                                                    <a href={`/user/profile/${review.user._id}`}>
                                                                        {review.user.profileImage != null ?
                                                                            <img className="reviewIcon mb-2" src={AppConfig.api_baseURL + review.user.profileImage}/>
                                                                            :
                                                                            <img className="reviewIcon mb-2" src={require("../../../assets/img/proj/user-profile-icon.jpg")}/>
                                                                        }
                                                                    </a>
                                                                    <div className="d-flex">
                                                                        <a className="reviewProfileName text-center" href={`/user/profile/${review.user._id}`}>
                                                                            {review.user.name}
                                                                            {" "}
                                                                            {review.user.familyName}
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex flex-column w-100 col-10">
                                                                    <div className="d-flex justify-content-between w-100">
                                                                        <span> {review.title} </span>
                                                                        <span className="text-muted reviewDate"> {dateConverter.unixConverter(review.date)} </span>
                                                                    </div>

                                                                    <h6 className="pt-4"> {review.review} </h6>
                                                                </div>

                                                                <hr/>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                :
                                null
                            }
                        </Card>

                        <Modal isOpen={modal} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}> اضافه کردن طاقچه جدید </ModalHeader>
                            <ModalBody>
                                <form>
                                    <div className="form-group">
                                        <label>نام طاقچه*</label>
                                        <Input type="text" className="form-control edit-form"
                                               invalid={this.state.name == ''}
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

                        <Modal isOpen={reviewModal} toggle={this.toggleReviewModal}>
                            <ModalHeader toggle={this.toggleReviewModal}> نوشتن نقد </ModalHeader>
                            <ModalBody>
                                <form>
                                    <div className="form-group">
                                        <label>عنوان*</label>
                                        <Input type="text" className="form-control edit-form"
                                               invalid={this.state.title == ''}
                                               onChange={(event) => this.setState({title: event.target.value})}/>
                                    </div>

                                    <div className="form-group">
                                        <label>متن نقد*</label>
                                        <Input
                                            onChange={(event) => this.setState({review: event.target.value})}
                                            invalid={this.state.review == ''}
                                            className="form-control edit-form"
                                            rows="3"
                                            type="textarea"
                                        />
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" type="button" onClick={() => this.addReview()}>
                                    ثبت نقد
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </div>
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
                <SweetAlert
                    focusConfirmBtn={false}
                    confirmBtnText="متوجه شدم"
                    warning
                    btnSize="sm"
                    show={titleAlert}
                    title="عنوان نقد را وارد کنید"
                    onConfirm={() => this.onConfirm('titleAlert')}
                />
                <SweetAlert
                    focusConfirmBtn={false}
                    confirmBtnText="متوجه شدم"
                    warning
                    btnSize="sm"
                    show={reviewAlert}
                    title="متن نقد را وارد کنید"
                    onConfirm={() => this.onConfirm('reviewAlert')}
                />

                <SweetAlert
                    focusConfirmBtn={false}
                    warning
                    confirmBtnText="ورود"
                    confirmBtnStyle={{width: '87px'}}
                    cancelBtnText="مشاهده کتاب"
                    cancelBtnBsStyle='info'
                    showCancel={true}
                    btnSize="sm"
                    show={loginAlert}
                    title="برای نوشتن نقد باید وارد سایت بشوید"
                    onConfirm={() => this.onGoToLogin()}
                    onClickOutside={() => this.onConfirm('loginAlert')}
                    onCancel={() => this.onConfirm('loginAlert')}
                />
            </div>
        );
    }
}

export default ShowBook;
