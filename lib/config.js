module.exports = {
  start: function (controller) {
    var app = require('http').createServer(initServer),
      io = require('socket.io')(app),
      fs = require('fs'),
      chalk = require('chalk');

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
          socket.emit('controllerdata', this.directionalButton, this.controlButton);
        }.bind(controller));

        socket.on('config', function (config) {
          saveControllerConfig(config, socket)
        });
      }
    });
  }
};
