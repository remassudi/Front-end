import React from "react";
import api from "../../container/Api";
import SiteNav from "../../components/Navbars/SiteNav";
import { Button, Card, CardHeader, Input } from "reactstrap";
import Pagination from '@material-ui/lab/Pagination';

import AppConfig from "../../constants/AppConfig";
import $ from "jquery";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";

class Home extends React.Component {
    state = {
        name: "",
        writer: "",
        translator: "",
        realName: "",
        publisher: "",
        isbn: "",
        language: "",
        searched: "",
        searchHeader: 'none',
        newBooksHeader: 'block',
        data: null,
        page: 1,
        totalPages: 1,
        lastFunc: 'books'
    }

    componentDidMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        if (params.get('page') != null) {
            this.state.page = parseInt(params.get('page'));
        }
        if (params.get('func') == null) {
            this.getBooks();
        } else if (params.get('func') == "quick") {
            this.state.lastFunc = "quick";
            if (params.get('searched') != null) {
                this.state.searched = params.get('searched');
            }
            this.quickSearch();
        } else {
            this.state.lastFunc = 'advanced';
            if (params.get('isbn') != null) {
                this.state.isbn = params.get('isbn');
            }
            if (params.get('name') != null) {
                this.state.name = params.get('name');
            }
            if (params.get('writer') != null) {
                this.state.writer = params.get('writer');
            }
            if (params.get('publisher') != null) {
                this.state.publisher = params.get('publisher');
            }
            if (params.get('translator') != null) {
                this.state.translator = params.get('translator');
            }
            if (params.get('realName') != null) {
                this.state.realName = params.get('realName');
            }
            if (params.get('language') != null) {
                this.state.language = params.get('language');
            }
            this.advancedSearch();
        }

        this.triggerButtonEnter();
    }

    getBooks() {
        const postData = {
            "page": this.state.page
        };

        window.history.pushState("", "", "?page=" + this.state.page);

        api.post("book/get_books", postData)
            .then((response) => {
                // console.log(response);
                this.setState({data: response.data.doc});
                this.setState({totalPages: Math.ceil(response.data.total/10)});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    quickSearch(fromButton = false) {
        if (fromButton) {
            this.state.lastFunc = 'quick';
            this.state.page = 1;
            this.setState({page: 1});
        }

        const postData = {
            "searched": this.state.searched,
            "page": this.state.page
        };

        console.log(this.state.lastFunc)

        window.history.pushState("", "", "?page=" + this.state.page + '&func=' + this.state.lastFunc + '&searched=' + this.state.searched);

        api.post("book/quick_search", postData)
            .then((response) => {
                // console.log(response.data);
                this.setState({data: response.data.result});
                this.setState({searchHeader: 'block'});
                this.setState({newBooksHeader: 'none'});
                this.setState({totalPages: Math.ceil(response.data.total/10)});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    advancedSearch(fromButton = false) {
        if (fromButton) {
            this.state.lastFunc = 'advanced';
            this.state.page = 1;
            this.setState({page: 1});
        }

        const postData = {
            "ISBN": this.state.isbn,
            "name": this.state.name,
            "writer": this.state.writer,
            "publisher": this.state.publisher,
            "translator": this.state.translator,
            "realName": this.state.realName,
            "language": this.state.language,
            "page": this.state.page
        };

        window.history.pushState("", "", "?page=" + this.state.page + '&func=' + this.state.lastFunc +
            (this.state.isbn !== "" ? "&isbn=" + this.state.isbn : "") +
            (this.state.name !== "" ? "&name=" + this.state.name : "") +
            (this.state.writer !== "" ? "&writer=" + this.state.writer : "") +
            (this.state.publisher !== "" ? "&publisher=" + this.state.publisher : "") +
            (this.state.translator !== "" ? "&translator=" + this.state.translator : "") +
            (this.state.realName !== "" ? "&realName=" + this.state.realName : "") +
            (this.state.language !== "" ? "&language=" + this.state.language : "")
        );

        api.post("book/advanced_search", postData)
            .then((response) => {
                // console.log(response.data);
                this.setState({data: response.data.result});
                this.setState({searchHeader: 'block'});
                this.setState({newBooksHeader: 'none'});
                this.setState({totalPages: Math.ceil(response.data.total/10)});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    openAdvance = () => {
        document.getElementById("advance").classList.remove("d-none");
        document.getElementById("advance").classList.add("d-flex");
        document.getElementById("advanceButt").classList.remove("d-none");
        document.getElementById("advanceButt").classList.add("d-flex");
        document.getElementById("closeAd").classList.remove("d-none");
        document.getElementById("closeAd").classList.add("d-inline");
        document.getElementById("openAd").classList.remove("d-inline");
        document.getElementById("openAd").classList.add("d-none");
    };
    closeAdvance = () => {
        document.getElementById("advance").classList.remove("d-flex");
        document.getElementById("advance").classList.add("d-none");
        document.getElementById("advanceButt").classList.remove("d-flex");
        document.getElementById("advanceButt").classList.add("d-none");
        document.getElementById("openAd").classList.remove("d-none");
        document.getElementById("openAd").classList.add("d-inline");
        document.getElementById("closeAd").classList.remove("d-inline");
        document.getElementById("closeAd").classList.add("d-none");
    };

    handlePagination = (event, value) => {
        this.state.page = value;
        this.setState({page: value});

        if (this.state.lastFunc == 'books') {
            this.getBooks();
        } else if (this.state.lastFunc == 'advanced') {
            this.advancedSearch();
        } else if (this.state.lastFunc == 'quick') {
            this.quickSearch();
        }
    };

    keyT = 0;
    triggerButtonEnter() {
        let thisComponent = this;
        $(document).keydown(function(e){
            if (e.which === 13){
                thisComponent.keyT++;
                if (thisComponent.keyT === 1) {
                    thisComponent.quickSearch(true);
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
        const isUser = localStorage.getItem("token") != null;
        const { data } = this.state;

        return (
            <div className="background">
                <Helmet>
                    <title>{AppConfig.app_name} </title>
                    <meta name="description" content="Desktop"/>
                </Helmet>

                <SiteNav />

                <div className="shelveList loginPage profilePage d-flex justify-content-around home">
                    <div className="row w-100 d-flex justify-content-center">
                        <div className="col-lg-3 pt-lg-2 mb-5">
                            <Card className="card-profile shadow mb-3 py-3 px-4">
                                <Input type="text" className="form-control edit-form searchInput" placeholder="&#xF002; جست‌وجوی سریع"
                                       onChange={(event) => this.setState({searched: event.target.value})}/>
                            </Card>

                            <Card className="card-profile shadow">
                                <div className="px-4">
                                    <div className="fontLale pt-4 d-flex justify-content-between" style={{fontSize: '20px'}}>
                                        <span className="mb-md-0 mb-3">جست‌وجوی پیشرفته</span>
                                        <span id="openAd" className="d-md-none d-inline" onClick={this.openAdvance}>
                                            <i className="fa fa-caret-square-o-down" aria-hidden="true"/>
                                        </span>
                                        <span id="closeAd" className="d-md-none d-none" onClick={this.closeAdvance}>
                                            <i className="fa fa-caret-square-o-up" aria-hidden="true"/>
                                        </span>
                                    </div>

                                    <div id="advance" className="d-md-flex d-none flex-column text-right mt-1 py-4 border-top shelveListName">
                                        <form>

                                            <div className="form-group">
                                                <label>نام کتاب</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.name}
                                                       onChange={(event) => this.setState({name: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>نام نویسنده</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.writer}
                                                       onChange={(event) => this.setState({writer: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>نام مترجم</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.translator}
                                                       onChange={(event) => this.setState({translator: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>نام اصلی کتاب (برای کتاب‌های ترجمه شده)</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.realName}
                                                       onChange={(event) => this.setState({realName: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>نام ناشر</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.publisher}
                                                       onChange={(event) => this.setState({publisher: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>شابک</label>
                                                <Input type="text" className="form-control edit-form"
                                                       value={this.state.isbn}
                                                       onChange={(event) => this.setState({isbn: event.target.value})}/>
                                            </div>

                                            <div className="form-group">
                                                <label>زبان</label>
                                                <div className="d-flex justify-content-start w-100">
                                                    <select className="custom-select"
                                                            value={this.state.language}
                                                            onChange={(event) => this.setState({language: event.target.value})}>
                                                        <option selected disabled value="">انتخاب کنید</option>
                                                        <option value="فارسی"> فارسی</option>
                                                        <option value="انگلیسی">انگلیسی</option>
                                                        <option value="other">زبان‌های دیگر</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </form>
                                    </div>

                                    <div id="advanceButt" className="d-md-flex d-none flex-column text-right py-4 border-top shelveListName">
                                        <Button
                                            className="fontSahel"
                                            color="default"
                                            onClick={() => this.advancedSearch(true)}
                                            size="sm"
                                        >
                                            جست‌وجو
                                        </Button>
                                    </div>
                                </div>

                            </Card>

                            {isUser ?
                                <div className="d-flex w-100 mt-3">
                                    <Button
                                        to="/book/add_book" tag={Link}
                                        className="fontSahel w-100 text-white"
                                        color="warning"
                                        size="lg"
                                    >
                                        اضافه کردن کتاب جدید
                                    </Button>
                                </div>
                                :
                                null
                            }

                        </div>

                        <div className="col-lg-7 pt-lg-2 mb-5">
                            <Card className="card-profile shadow">
                                <CardHeader className="bg-white header fontLale" style={{display: this.state.newBooksHeader}}>
                                    جدیدترین کتاب‌ها
                                </CardHeader>

                                <CardHeader className="bg-white header searchHeader fontLale" style={{display: this.state.searchHeader}}>
                                    نتیجه‌ی جست‌وجوی شما:
                                </CardHeader>
                            </Card>

                            {data != null && data.map((book, index) => {
                                return (
                                    <Card className="card-profile shadow mt-3 p-md-4 p-1">
                                        <div className="row">
                                            <div className="d-flex col-2 align-items-center pr-3">
                                                <a href={`/book/show/${book._id}`}>
                                                    {book.bookImage == null ?
                                                        <img className="bookCover" src={require("../../assets/img/proj/bookCover.png")}/>
                                                        :
                                                        <img className="bookCover" src={AppConfig.api_baseURL + book.bookImage}/>
                                                    }
                                                </a>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center col-7">
                                                <div className="mb-2 font-weight-600 mr-md-0 mr-1">
                                                    <a href={`/book/show/${book._id}`}>
                                                        {book.name}
                                                    </a>
                                                </div>
                                                <div className="text-gray mr-md-0 mr-1">
                                                    {book.writer}
                                                    {book.translator != null ?
                                                        <span>
                                                            {" / مترجم: "}
                                                            {book.translator}
                                                        </span>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                            <div className="d-flex col-3 align-items-center">
                                                {book.publisher}
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}

                            {this.state.totalPages > 1 ?
                                <div className="d-flex justify-content-center mt-3">
                                    <div className="d-flex bg-white justify-content-center py-2 myPagination">
                                        <Pagination count={this.state.totalPages} page={this.state.page} variant="outlined" color="primary"
                                                    hidePrevButton hideNextButton onChange={this.handlePagination}/>
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;