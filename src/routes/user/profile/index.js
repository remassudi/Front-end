import React from "react";
import {Button, Card, ModalHeader, ModalBody, Modal} from "reactstrap";
import api from '../../../container/Api';
import AppConfig from '../../../constants/AppConfig';
import SiteNav from "../../../components/Navbars/SiteNav";
import dateConverter from '../../../container/dateConverter';
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import SweetAlert from "react-bootstrap-sweetalert";

class Profile extends React.Component {

    state = {
        userData: null,
        shelfList: null,
        favouriteList: null,
        favouriteListID: null,
        followingModal: false,
        followerModal: false,
        userSelf: false,
        followed: false,
        loginAlert: false,
    }

    componentDidMount() {
        this.getUserProfile();

        if (localStorage.getItem("user") != null) {
            if (this.props.match.params.id == JSON.parse(localStorage.getItem("user"))._id) {
                this.setState({userSelf: true});
            }
        }
    }

    getUserProfile() {
        api.get("user/get_userProfile/" + this.props.match.params.id)
            .then((response) => {
                // console.log(response.data);
                let list = response.data.user.shelves;
                let i;
                for (i = 0; i < list.length; i++) {
                    if (list[i].name == "کتاب‌های مورد علاقه") {
                        this.state.favouriteListID = list[i]._id;
                        list.splice(i, 1);
                    }
                }
                this.setState({shelfList: list});
                this.setState({userData: response.data.user});
                this.setState({followed: response.data.followed});
                this.getFavShelf();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getFavShelf() {
        const postData = {
            "shelf_id": this.state.favouriteListID
        };

        api.post("user/get_shelf", postData)
            .then((response) => {
                this.setState({favouriteList: response.data.shelf.books});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    follow() {
        const postData = {
            "following_id": this.props.match.params.id
        };

        api.post("user/follow", postData)
            .then((response) => {
                this.setState({followed: true});
                this.getUserProfile();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    unfollow() {
        const postData = {
            "following_id": this.props.match.params.id
        };

        api.post("user/unfollow", postData)
            .then((response) => {
                this.setState({followed: false});
                this.getUserProfile();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    toggleFollowingModal = () => {
        this.setState({
            followingModal: !this.state.followingModal
        });
    };
    toggleFollowerModal = () => {
        this.setState({
            followerModal: !this.state.followerModal
        });
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
        const isUser = localStorage.getItem("token") != null;
        const {userData, shelfList, favouriteList, followingModal, followerModal, followed, loginAlert} = this.state;

        return (
            <div className="background">
                <SiteNav/>
                <div className="loginPage profilePage profile-page">
                    <div className="container pt-lg-2">
                        <Card className="card-profile shadow">
                            {userData != null ?
                                <div className="px-4">
                                    <Helmet>
                                        <title>{userData.name}{" "}{userData.familyName}</title>
                                        <meta name="description" content="Desktop"/>
                                    </Helmet>

                                    <div className="row justify-content-center">
                                        <div className="col-lg-3 order-lg-2">
                                            <div className="card-profile-image profile-image">
                                                {userData.profileImage != null ?
                                                    <img
                                                        alt="profile image"
                                                        className="rounded-circle "
                                                        src={AppConfig.api_baseURL + userData.profileImage}
                                                    />
                                                    :
                                                    <img
                                                        alt="..."
                                                        className="rounded-circle"
                                                        src={require("../../../assets/img/proj/user-profile-icon.jpg")}
                                                    />
                                                }
                                            </div>
                                        </div>

                                        {isUser ?
                                            <div
                                                className="col-lg-4 card-profile-actions d-flex align-self-lg-center order-lg-1"

                                            >
                                                {this.state.userSelf ?
                                                    <div className="userProfileButton d-flex justify-content-between">
                                                        <Button
                                                            className="fontSahel py-2 editProfA"
                                                            color="success"
                                                            to="/user/edit" tag={Link}
                                                            size="sm"
                                                        >
                                                            ویرایش اطلاعات
                                                        </Button>
                                                    </div>
                                                    :
                                                    <div className="userProfileButton d-flex justify-content-between">
                                                        {followed ?
                                                            <Button
                                                                className="fontSahel py-2"
                                                                color="danger"
                                                                onClick={() => this.unfollow()}
                                                                size="sm"
                                                            >
                                                                لغو دنبال کردن
                                                            </Button>
                                                            :
                                                            <Button
                                                                className="fontSahel py-2"
                                                                color="success"
                                                                onClick={() => this.follow()}
                                                                size="sm"
                                                            >
                                                                دنبال کردن
                                                            </Button>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div
                                                className="col-lg-4 card-profile-actions d-flex align-self-lg-center order-lg-1">
                                                <div className="userProfileButton d-flex justify-content-between">
                                                    <Button
                                                        className="fontSahel py-2"
                                                        color="success"
                                                        onClick={() => this.openAlert("loginAlert")}
                                                        size="sm"
                                                    >
                                                        دنبال کردن
                                                    </Button>
                                                </div>
                                            </div>

                                        }

                                        <div
                                            className="col-lg-4 order-lg-3 card-profile-stats d-flex justify-content-center">
                                            <div onClick={() => this.toggleFollowingModal()} style={{cursor: 'pointer'}}>
                                                <span className="heading fontDigit"> {userData.followings.length} </span>
                                                <span className="description fontSahel">دنبال‌شوندگان</span>
                                            </div>
                                            <div onClick={() => this.toggleFollowerModal()} style={{cursor: 'pointer'}}>
                                                <span className="heading fontDigit"> {userData.followers.length} </span>
                                                <span className="description fontSahel">دنبال‌کنندگان</span>
                                            </div>
                                            <div>
                                                <span className="heading fontDigit"> {userData.reviews.length} </span>
                                                <span className="description fontSahel">نقد‌ها</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row text-center mt-3">
                                        <div className="col-12">
                                            <h3 className="fontSahel name">
                                                {userData.name}
                                                {" "}
                                                {userData.familyName}
                                            </h3>
                                            <div className="h7 mt-4">
                                                {userData.biography}
                                            </div>
                                            {userData.birthDate == null && userData.birthMonth == null && userData.birthYear == null ?
                                                null
                                                :
                                                <div className="bday fontDigit">
                                                    تاریخ تولد:
                                                    {" "}
                                                    {userData.birthDate == null ? '-' : userData.birthDate}
                                                    /
                                                    {userData.birthMonth == null ? '-' : userData.birthMonth}
                                                    /
                                                    {userData.birthYear == null ? '-' : userData.birthYear}
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-5 py-4 border-top text-center">
                                        <div className="justify-content-start row">
                                            <div className="col-lg-12 favBooks">
                                                <p className="fontSahel">
                                                    کتاب‌های مورد علاقه:
                                                </p>

                                                {favouriteList != null && favouriteList.map((favBook, index) => {
                                                    return (
                                                        <a href={`/book/show/${favBook.book._id}`}>
                                                            {favBook.book.bookImage == null ?
                                                                <img className="bookCover"
                                                                     src={require("../../../assets/img/proj/bookCover.png")} alt="bookCover"/>
                                                                :
                                                                <img className="bookCover" alt="bookCover" src={AppConfig.api_baseURL + favBook.book.bookImage}/>
                                                            }
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-4 border-top text-center">
                                        <div className="justify-content-start row">
                                            <div className="col-lg-12 favBooks">
                                                <p className="fontSahel">
                                                    طاقچه‌ها:
                                                </p>

                                                <div className="d-flex justify-content-start bookshelve row">
                                                    {shelfList != null && shelfList.map((shelf, index) => {
                                                        return (
                                                            <div className="col-md-3 col-4 mb-2">
                                                                <a href={`/user/shelves/${shelf._id}`}> {shelf.name} </a>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-4 border-top text-center">
                                        <div className="justify-content-start row">
                                            <div className="col-lg-12 favBooks">
                                                <p className="fontSahel">
                                                    نقدها:
                                                </p>

                                                <div className="d-flex flex-column pr-md-3 pr-0">

                                                    {userData.reviews.map((review, index) => {
                                                        return (
                                                            <div className="d-flex py-5 justify-content-center w-100">
                                                                <divx className="col-2 d-flex flex-column align-items-center reviewProfileBook">
                                                                    <a href={`/book/show/${review.book._id}`}>
                                                                        {review.book.bookImage == null ?
                                                                            <img className="bookCover" alt="bookCover" src={require("../../../assets/img/proj/bookCover.png")}/>
                                                                            :
                                                                            <img className="mb-2" alt="bookCover" src={AppConfig.api_baseURL + review.book.bookImage}/>
                                                                        }
                                                                    </a>
                                                                    <a href={`/book/show/${review.book._id}`}>
                                                                        {review.book.name}
                                                                    </a>
                                                                </divx>
                                                                <div className="d-flex flex-column w-100 col-10">
                                                                    <div className=" d-flex justify-content-between w-100">
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
                    </div>
                </div>

                <Modal isOpen={followingModal} toggle={this.toggleFollowingModal}>
                    <ModalHeader toggle={this.toggleFollowingModal}> فهرست دنبال‌کنندگان </ModalHeader>
                    <ModalBody>
                        <div className="d-flex flex-column">
                            {userData != null && userData.followings != null && userData.followings.map((user, index) => {
                                return (
                                    <div className="d-flex py-2 align-items-center w-100 followers">
                                        <div className="col-2 d-flex">
                                            <a href={`/user/profile/${user._id}`}>
                                                {user.profileImage == null ?
                                                    <img className="reviewIcon mb-2" alt="profile" src={require("../../../assets/img/proj/user-profile-icon.jpg")}/>
                                                    :
                                                    <img className="reviewIcon mb-2" alt="profile" src={AppConfig.api_baseURL + user.profileImage}/>
                                                }
                                            </a>
                                        </div>
                                        <div className="d-flex col-10">
                                            <a href={`/user/profile/${user._id}`}>
                                                {user.name}
                                                {" "}
                                                {user.familyName}
                                            </a>
                                        </div>

                                        <hr/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={followerModal} toggle={this.toggleFollowerModal}>
                    <ModalHeader toggle={this.toggleFollowerModal}> فهرست دنبال‌شوندگان </ModalHeader>
                    <ModalBody>
                        <div className="d-flex flex-column">
                            {userData != null && userData.followers != null && userData.followers.map((user, index) => {
                                return (
                                    <div className="d-flex py-2 align-items-center w-100 followers">
                                        <div className="col-2 d-flex">
                                            <a href={`/user/profile/${user._id}`}>
                                                {user.profileImage == null ?
                                                    <img className="reviewIcon mb-2" alt="profile" src={require("../../../assets/img/proj/user-profile-icon.jpg")}/>
                                                    :
                                                    <img className="reviewIcon mb-2" alt="profile" src={AppConfig.api_baseURL + user.profileImage}/>
                                                }
                                            </a>
                                        </div>
                                        <div className="d-flex col-10">
                                            <a href={`/user/profile/${user._id}`}>
                                                {user.name}
                                                {" "}
                                                {user.familyName}
                                            </a>
                                        </div>
                                        <hr/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                </Modal>

                <SweetAlert
                    focusConfirmBtn={false}
                    warning
                    confirmBtnText="ورود"
                    confirmBtnStyle={{width: '87px'}}
                    cancelBtnText="مشاهده پروفایل"
                    cancelBtnBsStyle='info'
                    showCancel={true}
                    btnSize="sm"
                    show={loginAlert}
                    title="برای این که بتوانید اکانت مورد نظر را دنبال کنید باید ابتدا وارد سایت بشوید"
                    onConfirm={() => this.onGoToLogin()}
                    onClickOutside={() => this.onConfirm('loginAlert')}
                    onCancel={() => this.onConfirm('loginAlert')}
                />
            </div>
        );
    }
}

export default Profile;
