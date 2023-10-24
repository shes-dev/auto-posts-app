const AppService = require('./app/services/appService')();

(async function start() {
  try {
    await AppService.main();
  } catch (error) {
    console.error('Error running main function:', error);
    process.exit(1);
  }
})();






