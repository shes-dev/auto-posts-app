const clickController = ({ schema, envService, chromeService, wait, puppeteer, isDevMode }) => {
  const getHtmlData = async () => {
    const createUrlTestArr = ({ dataUrnValues }) => {
      const urlTestArr = [];
      dataUrnValues.forEach((dataUrn) => {
        const url = `https://www.linkedin.com/feed/update/${dataUrn}/`;
        urlTestArr.push(url);
      });
      return urlTestArr;
    };

    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
      }
    };

    const getRandomItem = ({ arr, count = 1 }) => {
      const shuffledArr = [...arr]; // Clone the original array
      shuffleArray(shuffledArr); // Shuffle the cloned array
      return shuffledArr.slice(0, count); // Return the first `count` elements
    };

    const getPageResults = async ({ page, selector, attribute }) => {
      await wait({ schema });
      await wait({ schema });
      const dataUrnValues = await page.evaluate(
        (selector, attribute) => {
          const dataUrnElements = document.querySelectorAll(selector);
          const urnValues = [];

          dataUrnElements.forEach((element) => {
            const dataUrn = element.getAttribute(attribute);
            if (dataUrn) {
              urnValues.push(dataUrn);
            }
          });

          return urnValues;
        },
        selector,
        attribute
      );
      return dataUrnValues;
    };

    const postToProfile = async ({ profileUrl, urlText, page }) => {
      await wait({ schema });
      await page.goto(profileUrl);
      await wait({ schema });

      // Locate the element to click by its CSS selector
      const createPostButton = await page.$('a#navigation-create-post-Create-a-post');

      if (createPostButton) {
        // Click the element
        await createPostButton.click();

        // Wait for navigation or other actions if needed
        // For example, you can use await page.waitForNavigation()

        console.log('Clicked on "Create a post" button.');

        // Wait
        await wait({ schema });
        await wait({ schema });

        // Select the contenteditable element by its CSS selector
        const textEditor = await page.$('div.ql-editor[contenteditable="true"]');

        if (textEditor) {
          // Use the evaluate function to set the innerHTML of the contenteditable element
          await page.evaluate(
            (element, text) => {
              element.innerHTML = text;
            },
            textEditor,
            urlText
          ); // Replace 'Your text goes here' with the desired text

          console.log('Url text entered into the contenteditable element.\n', urlText);
          await wait({ schema });
          // Click the "Post" button
          const postButton = await page.$('button.share-actions__primary-action');
          if (postButton) {
            await postButton.click();
            return Promise.resolve();
          } else {
            console.error('Button with class "share-actions__primary-action" not found.');
            return Promise.reject();
          }
        } else {
          console.error('Element not found.');
          return Promise.reject();
        }
      } else {
        console.error('Element not found.');
        return Promise.reject();
      }
    };

    const postToPage = async ({ urlText, page, pageUrl }) => {
      await wait({ schema });
      await page.goto(pageUrl);
      await wait({ schema });

      // Locate the element to click by its CSS selector
      const createPostButton = await page.$('button.artdeco-button.org-organizational-page-admin-navigation__cta');

      if (createPostButton) {
        // Click the element
        await createPostButton.click();
        console.log('Clicked on "Create a post" button.');
        await wait({ schema });

        const postElement = await page.$('a[data-test-org-menu-item="POSTS"]');
        if (postElement) {
          await postElement.click();
          console.log('Clicked on "Post" button.');
        } else {
          console.error('Post Button Element not found.');
        }

        await wait({ schema });

        // Select the contenteditable element by its CSS selector
        const textEditor = await page.$('div.ql-editor[contenteditable="true"]');

        if (textEditor) {
          // Use the evaluate function to set the innerHTML of the contenteditable element
          await page.evaluate(
            (element, text) => {
              element.innerHTML = text;
            },
            textEditor,
            urlText
          ); // Replace 'Your text goes here' with the desired text

          console.log('Url text entered into the contenteditable element.\n', urlText);
          await wait({ schema });
          // Click the "Post" button
          const postButton = await page.$('button.share-actions__primary-action');
          if (postButton) {
            await postButton.click();
            await wait({ schema });
            return Promise.resolve();
          } else {
            console.error('Button with class "share-actions__primary-action" not found.');
            await wait({ schema });
            return Promise.reject();
          }
        } else {
          console.error('Element not found.');
          return Promise.reject();
        }
      } else {
        console.error('Element not found.');
        return Promise.reject();
      }
    };

    const postToPages = async ({ page, urlText, pageUrls }) => {
      await pageUrls.reduce(async (accumulatorPromise, pageUrl, index) => {
        await accumulatorPromise; // Wait for the previous iteration to complete
        console.log({ msg: 'opened new tab' });

        const dataUrnValuesPart = await postToPage({ urlText, page, pageUrl });
        await wait({ schema });
        await wait({ schema });
        console.log(`Data-urn page values${index + 1}:`, dataUrnValuesPart);

        return dataUrnValuesPart;
      }, Promise.resolve());
    };

    const getDataFromPages = async ({ page, url, urls, dataUrnValues }) => {
      await urls.reduce(async (accumulatorPromise, url, index) => {
        await accumulatorPromise; // Wait for the previous iteration to complete

        console.log({ msg: 'opened new tab' });
        await page.goto(url, { waitUntil: 'load' });

        const dataUrnValuesPart = await getPageResults({ page, selector: 'div[data-urn]', attribute: 'data-urn' });
        console.log(`Data-urn values${index + 1}:`, dataUrnValuesPart);
        dataUrnValues.push(...dataUrnValuesPart);
        return dataUrnValuesPart;
      }, Promise.resolve());
    };

    const getUrlToPost = async ({ page, urlText, dataUrnValues }) => {
      if (!dataUrnValues || !dataUrnValues.length) return console.log({ msg: 'no data-urn values' });
      tablesResponse = dataUrnValues;
      const urlTestArr = createUrlTestArr({ dataUrnValues });
      const urlTextAsArr = getRandomItem({ arr: urlTestArr });
      urlText = urlTextAsArr[0];
      console.log({ msg: `urlText: ${urlText}` });
      return urlText;
    };

    const selectAndClick = async ({ selector }) => {
      try {
        // Find the button by its role attribute
        const button = await page.waitForSelector(selector, { visible: true });
        // Click the button
        button && (await button.click());
        console.log(`Element with selector:${selector} clicked successfully!`);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const autoScroll = async ({ page, times }) => {
      let counter = 0;
      console.log('autoScrolling...');
      await page.evaluate(
        async (times, counter) => {
          await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
              console.log('scrolling...');
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              counter++;
              if (counter === times || totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 3000);
          });
        },
        times,
        counter
      );
    };

    const { timeout } = schema;
    let currentURL;
    const { webSocketDebuggerUrl: wsChromeEndpointurl } = await chromeService.getWebSocketDebuggerUrl({ msg: 'Getting WebSocketDebuggerUrl' });
    let tableHtmlResponse = [],
      tablesResponse = [],
      browser,
      page,
      urlText;

    try {
      // Launch a new browser window
      browser = await puppeteer.connect({ browserWSEndpoint: wsChromeEndpointurl, timeout });

      // Open a new blank tab
      page = await browser.newPage({ timeout });
      page.setDefaultNavigationTimeout(60000);

      const {
        clickController: { profileUrl, urls, pageUrls },
      } = schema;

      // Go to linkedin page
      let dataUrnValues = [];
      // await getDataFromPages({ page, url: profileUrl, urls, dataUrnValues });
      const url = 'https://twitter.com/qatarairways';
      await page.goto(url, { waitUntil: 'load' });

      await autoScroll({ page, times: 10 });
      //make sure this works. scroll-reply-repeatedly
      await selectAndClick({ selector: '[data-testid="reply"]' });

      let postsDivs = await getPageResults({ page, selector: 'div[data-testid="cellInnerDiv"]', attribute: 'style' });
      console.log({ msg: `postsDivs: ${postsDivs}` });
      await wait({ schema });

      await autoScroll({ page, times: 10 });
      postsDivs = await getPageResults({ page, selector: 'div[data-testid="cellInnerDiv"]', attribute: 'style' });
      console.log({ msg: `postsDivs: ${postsDivs}` });
      await wait({ schema });

      urlText = await getUrlToPost({ page, urlText, dataUrnValues });
      await postToProfile({ profileUrl, urlText, page });
      await wait({ schema });
      await wait({ schema });
      await postToPages({ page, urlText, pageUrls });
    } catch (error) {
      console.log({ msg: error });
    } finally {
      await wait({ schema });
      await page.close();
      await browser.disconnect(); // Disconnect Puppeteer from the browser without closing it
      return JSON.stringify(tablesResponse);
    }
  };

  /**
   * This function will click on an element on the page
   * @param {string} selector the selector of the element to click on: #div, .class, etc.
   * @param {object} page the page object
   */
  const clickOnElement = async ({ page, selector, iframe = false }) => {
    let element;
    let tableHtml = [];
    if (selector.waitBefore) {
      await wait({ schema });
    }
    if (iframe) {
      const { iframeContainerSelector, iframeSelector } = iframe;
      // Wait for the div element to appear
      await page.waitForSelector(iframeContainerSelector);
      // Wait for the iframe to be added within the div
      const iframeElement = await page.waitForSelector(iframeSelector);
      // Get the iframe's content frame
      const frame = await iframeElement.contentFrame();
      // Wait for the selector to appear
      element = await frame.waitForSelector(selector.value);
    } else {
      element = await page.waitForSelector(selector.value);
      // element = await page.$(selector.value);
    }
    if (!element) return console.log({ msg: `element ${selector.logMsg} was not found` });
    // Generate a random delay between 1 and 3 seconds
    await wait({ schema });
    console.log({ msg: `clicking on ${selector.logMsg}` });
    // Click on the element if exists
    if (element) {
      await element.click();
    }
    return tableHtml;
  };

  return { clickOnElement, getHtmlData };
};
module.exports = clickController;
