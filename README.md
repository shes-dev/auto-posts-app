# linkedin app installation steps
Must Do:
* create a shortcut to launch Chrome in debugger mode:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222"
(edit path as needed)
* launch chrome and login to linkedin.
* create an empty .env file on root for envService.
* update linkedin\app\models\schema.kle.json:
 - profileUrl - your linkedin profile url to post in 
 - pageUrls - your linkedin pages url to post in
 - urls - the POSTS page urls of the profiles to post from. (NOT THE PROFILE PAGE URL ITSELF)
* run "npm install"
* run "npm run start-ps-prod"

Can Do:
* update path to setup a cronjob or a windows task to run bash file linkedin\files\scripts\linkedinScript.sh.
* update slack hook link in linkedin\app\models\schema.kle.json and comment out lines in 
 linkedin\app\services\appService.js for Slack integration.