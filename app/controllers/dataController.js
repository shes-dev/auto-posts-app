const dataController = ({ schema, wait, getHtmlData, isDevMode }) => {
  const setFileData = async ({ attempt = 1, maxAttempts = schema.dataController.maxAttempts }) => {
    let fileData = null;
    if (attempt > maxAttempts) return;
    fileData = await getHtmlData();
    const htmlData = JSON.parse(fileData);
    if (!htmlData || !htmlData.length) {
      attempt++;
      console.log({
        msg: `no html data. Trying again, attempt ${attempt}/${maxAttempts}`,
      });
      await wait({ schema });
      await setFileData({ attempt });
    } else {
      return fileData;
    }
  };

  return { setFileData };
};
module.exports = dataController;