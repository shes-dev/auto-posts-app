const isObjEmpty = ({ obj }) => {
  if (Object.keys(obj).length === 0) {
    console.log("The object is empty");
    return true;
  } else {
    console.log("The object is not empty");
    return false;
  }
};


// Export the utility functions
module.exports = {
  isObjEmpty
};
