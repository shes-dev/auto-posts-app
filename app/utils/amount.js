const roundUp = ({ value }) => {
  return Math.ceil(value * 100) / 100;
};

// Export the utility functions
module.exports = {
  roundUp
};
