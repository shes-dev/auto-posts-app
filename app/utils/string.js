const capitalizeFirstLetter = ({ str }) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Export the utility functions
module.exports = {
  capitalizeFirstLetter
};
