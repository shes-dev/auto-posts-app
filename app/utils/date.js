
// create timestamp
const getTimestamp = () => {
  const timestamp = new Date();
  const timestampDate = timestamp.getDate();
  const timestampMonth = timestamp.getMonth() + 1;
  const timestampYear = timestamp.getFullYear();
  const timestampHour = timestamp.getHours();
  const timestampMinutes = timestamp.getMinutes();
  const timestampSeconds = timestamp.getSeconds();
  const timestampString = `${timestampDate}-${timestampMonth}-${timestampYear}_${timestampHour}-${timestampMinutes}-${timestampSeconds}`;
  return timestampString;
};

// Export the utility functions
module.exports = {
  getTimestamp
};
