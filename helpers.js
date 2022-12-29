
module.exports = {
  isValidDuration: (duration) => !isNaN(duration),
  dateToString: (date) => new Date(date || Date.now()).toDateString(),
  roundTimestamp: (dateString) => {
    const date = new Date(dateString || Date.now());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  }
}