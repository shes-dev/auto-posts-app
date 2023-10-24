const puppeteer = require('puppeteer');
const schema = require('../models/schema.kle.json');
const util = require('util');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { getTimestamp } = require('../utils/date');
const { wait } = require('../utils/timing');
const isDevMode = process.env.NODE_ENV === 'dev';

// dependency injection
const envService = require('./envService')({ dotenv, path, schema, isDevMode });
const logService = require('./logService')({ schema, fs, path, isDevMode });
const chromeService = require('./chromeService')({ schema, axios, isDevMode });
const slackService = require('./slackService')({ schema, axios, isDevMode });
const clickController = require('../controllers/clickController')({ schema, chromeService, envService, wait, puppeteer, isDevMode });
const dataController = require('../controllers/dataController')({ schema, wait, getHtmlData: clickController.getHtmlData, isDevMode });

const appService = () => {
  const main = async () => {
    const timestamp = getTimestamp();
    const logStream = logService.setupLogstream({ timestamp });
    let fileData = await dataController.setFileData({});
    // comment out the next line for slack integration
    // await slackService.sendMessage({ msg: 'Posts successful' });
    logService.closeLogstream({ logStream });
    console.log('Main function completed.');
    // comment out the next line for slack integration
    // await slackService.sendMessage({ msg: 'Main function completed' });
    exit();
  };

  const exit = () => {
    console.log('Exiting the application.');
    process.exit(0);
  };

  return { main };
};

module.exports = appService;
