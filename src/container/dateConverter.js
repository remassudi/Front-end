import moment from "jalali-moment";

var dateConverter = {
  unixConverter: function(unix) {
    return convertUnixTime(unix);
  }
};

function convertUnixTime (unix){
    var date = new Date(parseInt(unix));
    var output = moment.from(date, 'en').locale('fa').format('YYYY/MM/DD');
    return output;
}

export default dateConverter;
