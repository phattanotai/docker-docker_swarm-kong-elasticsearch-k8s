const controller = require("../controllers/withdraw.controller");
module.exports = (app) => {
  app.post("/renderDdlStatus", controller.renderDdlParameter);
  app.post("/searchWithdraw", controller.searchWithdraw);
  app.post("/searchUsername", controller.searchUsername);
  app.post("/addWithdraw", controller.addWithdraw);
  app.post("/findWallet", controller.findWallet);
  app.post("/approveWithdraw", controller.approveWithdraw);
  app.post("/rejectWithdraw", controller.rejectWithdraw);
  app.post("/searchUserEvent", controller.searchUserEvent);
};
