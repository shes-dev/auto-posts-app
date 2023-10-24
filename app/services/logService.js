const logService = ({ schema, path, fs, isDevMode }) => {
  const setupLogstream = ({ timestamp }) => {
    // Specify the absolute path to the "downloads" directory
    const logsDir = path.join(__dirname, '../../logs');

    // Create the file name with the timestamp
    let fileNameTxt = `logs_${timestamp}.txt`;
    const logFilePath = path.join(logsDir, fileNameTxt);
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    // Create a reference to the original console.log function
    const originalConsoleLog = console.log;

    // Override the console.log function
    console.log = (...args) => {
      // Convert the log arguments to a string
      const logMessage = args.map(arg => JSON.stringify(arg)).join(' ');

      // Write the log message to the log stream
      logStream.write(logMessage + '\n');

      // Call the original console.log function to display the message in the console
      originalConsoleLog.apply(console, args);
    };
    return logStream;
  };

  const closeLogstream = ({ logStream }) => {
    process.on('exit', () => { logStream.end(); });
  };

  return { setupLogstream, closeLogstream };
};
module.exports = logService;