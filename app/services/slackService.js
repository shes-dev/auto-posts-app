const slackService = ({ schema, axios, isDevMode }) => {
  const sendMessage = async ({ msg }) => {
    let data = JSON.stringify({ text: msg });
    let url = schema.slack.linkedin;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url,
      headers: {
        'Content-type': 'application/json',
      },
      data,
    };

    try {
      const response = await axios.request(config);
      console.log({ msg: response.data });
    } catch (error) {
      console.log({ msg: error });
    }
  };

  return { sendMessage };
};
module.exports = slackService;