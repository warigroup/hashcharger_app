export const convertDuration = duration => {
    var day = Math.floor(duration/1440);
    var hour = Math.floor((duration-(day*1440))/60);
    var minute = Math.round(duration%60);
    if (day > 0) {
      return (day + " days " + hour + " hours " + minute + " mins");
    } else if (day < 1 && minute > 0) {
      return (hour + " hours " + minute + " mins");
    } else if (day < 1 && minute === 0) {
      return (hour + " hours");
    };
  };