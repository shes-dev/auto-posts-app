
const envService = ({ dotenv, path, schema, isDevMode }) => {
  const loadEnvironmentVariables = () => {
    try {
      const result = dotenv.config({ path: path.join(__dirname, '../../.env') });
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error('Failed to load environment variables:', error);
      throw error;
    }
  };
  loadEnvironmentVariables();
  const get = (key) => {
    return process.env[key];
  };
  return { get };
};

module.exports = envService;
