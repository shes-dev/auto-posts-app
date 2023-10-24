
const getRandomDelay = (min, max, factor = null) => {
  let delayVal = Math.floor(Math.random() * (max - min + 1)) + min;
  delayVal = factor ? delayVal * factor : delayVal;
  return delayVal;
};

const delayExecution = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const wait = async ({ schema }) => {
  const delay = getRandomDelay(schema.getRandom.delayMin, schema.getRandom.delayMax, schema.getRandom.factor);
  await delayExecution(delay);
};

// Export the utility functions
module.exports = {
  wait, delayExecution
};
