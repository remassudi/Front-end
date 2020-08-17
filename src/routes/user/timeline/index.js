import React from "react";
import {Card, CardHeader} from "reactstrap";
import Rating from '@material-ui/lab/Rating';
import api from '../../../container/Api';
import AppConfig from '../../../constants/AppConfig';
import dateConverter from '../../../container/dateConverter';
import SiteNav from "../../../components/Navbars/SiteNav";
import Pagination from "@material-ui/lab/Pagination";
import {Helmet} from "react-helmet";

class Timeline extends React.Component {
  state = {
      data: null,
      page: 1,
      totalPages: 1
  }

  componentDidMount() {
      this.getTimeline();
  }

  getTimeline() {
      const postData = {
          "page": this.state.page
      };

      window.history.pushState("", "", "?page=" + this.state.page);

      api.post("user/timeline", postData)
          .then((response) => {
              this.setState({data: response.data.feeds});
              this.setState({totalPages: Math.ceil(response.data.total/10)});
          })
          .catch((error) => {
              console.log(error);
          });
  }

    handlePagination = (event, value) => {
        this.state.page = value;
        this.setState({page: value});
        this.getTimeline();
    };

  render() {
    const { data } = this.state;

    return (
      <div className="background">
          <Helmet>
              <title>{AppConfig.app_title} جدیدترین‌ها </title>
              <meta name="description" content="Desktop"/>
          </Helmet>

        <SiteNav />

        <div className="timeline d-flex justify-content-center">
          <div className="col-md-7 col-12">
            <Card className="card-profile shadow">
              <CardHeader className="bg-white header fontLale">
                جدیدترین‌ها
              </CardHeader>
            </Card>

            {data != null && data.map((dataItem, index) => {
              return (
                  <Card className="card-profile shadow mt-3">
                    <div className="px-2">
                      <div className="d-flex flex-column pr-1 pt-3">

                          {dataItem.kind == "rating" ?
                              <div>
                                  <div className="row mb-1 d-flex justify-content-end pl-4">
                                      <span className="text-muted reviewDate">
                                          {dateConverter.unixConverter(dataItem.rate.date)}
                                      </span>
                                  </div>

                                  <div className="row d-flex">
                                      <div className="col-2 d-flex justify-content-center">
                                          <a href={`/user/profile/${dataItem.rate.user._id}`}>
                                              {dataItem.rate.user.profileImage != null ?
                                                  <img className="reviewIcon" alt="profile" src={AppConfig.api_baseURL + dataItem.rate.user.profileImage}/>
                                                  :
                                                  <img className="reviewIcon" alt="profile" src={require("../../../assets/img/proj/user-profile-icon.jpg")}/>
                                              }
                                          </a>
                                      </div>

                                      <div className="d-flex flex-column w-100 col-10">
                                          <div className="d-flex justify-content-between w-100">
                                              <div className="d-flex flex-column pt-2">
                                                <span style={{fontSize: '15px'}}>
                                                    <a href={`/user/profile/${dataItem.rate.user._id}`}>
                                                        {dataItem.rate.user.name}
                                                        {" "}
                                                        {dataItem.rate.user.familyName}
                                                    </a>
                                                    {" "}
                                                    به کتاب
                                                    {" "}
                                                    <a href={`/book/show/${dataItem.rate.book._id}`}>
                                                          {dataItem.rate.book.name}
                                                    </a>
                                                    {" "}
                                                    امتیاز داد.
                                                </span>
                                                  <div className="d-flex pt-4">
                                                      <span className="fontDigit" style={{paddingTop: '2px'}}>
                                                         {dataItem.rate.rate}
                                                          {" "}
                                                          -
                                                      </span>
                                                      <Rating
                                                          value={dataItem.rate.rate}
                                                          precision={0.1}
                                                          readOnly
                                                      />
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="py-4 border-top text-center mt-3">
                                              <div className="d-flex justify-content-start">
                                                  <a href={`/book/show/${dataItem.rate.book._id}`}>
                                                      {dataItem.rate.book.bookImage == null ?
                                                          <img className="bookCover" alt="bookCover" src={require("../../../assets/img/proj/bookCover.png")}/>
                                                          :
                                                          <img className="bookCover" alt="bookCover" src={AppConfig.api_baseURL + dataItem.rate.book.bookImage}/>
                                                      }
                                                  </a>
                                                  <div className="d-flex flex-column justify-content-between mr-3 py-2"
                                                       style={{textAlign: 'right'}}>
                                                      <a href={`/book/show/${dataItem.rate.book._id}`}>
                                                          {dataItem.rate.book.name}
                                                      </a>

                                                      <div className="d-flex">
                                                          <span className="fontDigit" style={{paddingTop: '2px'}}>
                                                             {dataItem.rate.book.computedRating}
                                                                  {" "}
                                                                  -
                                                          </span>
                                                          <Rating
                                                              value={dataItem.rate.book.computedRating}
                                                              precision={0.1}
                                                              readOnly
                                                          />
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              :
                              <div>
                                  <div className="row mb-1 d-flex justify-content-end pl-4">
                                      <span className="text-muted reviewDate">
                                          {dateConverter.unixConverter(dataItem.review.date)}
                                      </span>
                                  </div>

                                  <div className="row d-flex">
                                      <div className="col-2 d-flex justify-content-center">
                                          <a href={`/user/profile/${dataItem.review.user._id}`}>
                                              {dataItem.review.user.profileImage != null ?
                                                  <img className="reviewIcon" alt="profileImage" src={AppConfig.api_baseURL + dataItem.review.user.profileImage}/>
                                                  :
                                                  <img className="reviewIcon" alt="profileImage" src={require("../../../assets/img/proj/user-profile-icon.jpg")}/>
                                              }
                                          </a>
                                      </div>

                                      <div className="d-flex flex-column w-100 col-10">
                                          <div className="d-flex justify-content-between w-100">
                                              <div className="d-flex flex-column pt-2">
                                                  <span style={{fontSize: '15px'}}>
                                                      <a href={`/user/profile/${dataItem.review.user._id}`}>
                                                        {dataItem.review.user.name}
                                                        {" "}
                                                        {dataItem.review.user.familyName}
                                                      </a>
                                                      {" "}
                                                      کتاب
                                                      {" "}
                                                      {dataItem.review.book.name}
                                                      {" "}
                                                      را نقد کرد
                                                  </span>
                                                  <div className="d-flex flex-column pt-2">
                                                      <div className="pt-4">
                                                          {dataItem.review.title}
                                                      </div>
                                                      <h6 className="pt-1">
                                                          {dataItem.review.review}
                                                      </h6>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="py-4 border-top text-center mt-3">
                                              <div className="d-flex justify-content-start">
                                                  <a href={`/book/show/${dataItem.review.book._id}`}>
                                                      {dataItem.review.book.bookImage == null ?
                                                          <img className="bookCover" alt="bookCover" src={require("../../../assets/img/proj/bookCover.png")}/>
                                                          :
                                                          <img className="bookCover" alt="bookCover" src={AppConfig.api_baseURL + dataItem.review.book.bookImage}/>
                                                      }
                                                  </a>
                                                  <div className="d-flex flex-column justify-content-between mr-3 py-2"
                                                       style={{textAlign: 'right'}}>
                                                      <a href={`/book/show/${dataItem.review.book._id}`}>
                                                          {dataItem.review.book.name}
                                                      </a>

                                                      <div className="d-flex">
                                                          <span className="fontDigit" style={{paddingTop: '2px'}}>
                                                             {dataItem.review.book.computedRating}
                                                              {" "}
                                                              -
                                                          </span>
                                                          <Rating
                                                              value={dataItem.review.book.computedRating}
                                                              precision={0.1}
                                                              readOnly
                                                          />
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          }
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
    );
  }
}

export default Timeline;
