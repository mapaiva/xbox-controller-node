var xbox = require('../lib/xbox-controller');
var chalk = require('chalk');

xbox.on('data', function (directionalButton, controlButton) {
  console.log(chalk.blue.bold(directionalButton), ' and ', chalk.blue.bold(controlButton), ' pressed');
});
