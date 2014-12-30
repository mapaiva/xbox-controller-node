module.exports = {
  start: function () {
    var app = require('http').createServer(initServer);
    var io = require('socket.io')(app);
    var fs = require('fs');
    var chalk = require('chalk');
    var controller = require('../lib/xbox-controller');

    function initServer(req, res) {

      fs.readFile(__dirname + '/../web/config.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading game.html. Error: ' + err);
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      });
    }

    function saveControllerConfig(config, socket) {
      var configFolder = __dirname + '/../config';

      fs.mkdir(configFolder, function () {
        console.log(chalk.green('Notice:'), '[config] folder created');

        fs.writeFile(configFolder + '/buttons.json', JSON.stringify(config), function (err) {
          if(err) {
            socket.emit('controllererror', 'Error saving the configurations. See the server log for more details');

            console.log(chalk.red('Error:'), 'Error creating [buttons.json] file. ' + err);
          }else{
            console.log(chalk.green('Notice:'), 'Personal buttons config created');

            socket.emit('configsuccess');
          }
        });
      });
    }

    app.listen(3000, function () {
      console.log('Configuration page running on http://localhost:3000');
    });

    io.on('connection', function (socket) {

      if(!controller.HIDController){
        socket.emit('controllererror', 'Xbox controller not found');
      }else{
        controller.HIDController.on('data', function (data) {
          var directionalButton = data[11];
          var controlButton = data[10];

          socket.emit('controllerdata', directionalButton, controlButton);
        });

        socket.on('config', function (config) {
          saveControllerConfig(config, socket)
        });
      }
    });
  }
};
