const getUniqueValsArr = ({ val }) => {
  return [...new Set(val)];
};

const filterOutUndefinedInArr = ({ val }) => {
  return val.filter((value) => value !== undefined);
};

// Export the utility functions
module.exports = {
  getUniqueValsArr, filterOutUndefinedInArr
};
