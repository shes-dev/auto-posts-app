const chromeService = ({ schema, axios, isDevMode }) => {
  const getWebSocketDebuggerUrl = async ({ msg, logs = false, totals = false }) => {
    console.log({ msg });
    let url = schema.chromeService.wsPath;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: {
        'Content-type': 'application/json'
      }
    };


    const response = await axios.request(config)
      .then((response) => {
        console.log({ msg: response.data });
        return response.data;
      })
      .catch((error) => {
        console.log({ msg: error });
        throw new Error(error);
      });

    return response;

  };

  return { getWebSocketDebuggerUrl };
};
module.exports = chromeService;