var Joystick = require('joystick'),
  chalk = require('chalk'),
  Stick = require('./stick'),
  MAX_ID_TRIES = 10;

function getJoystick(id, callback) {

  if (id < MAX_ID_TRIES) {
    var xboxJoystick = new Joystick(id, 3500, 350);

    xboxJoystick.on('error', function (err) {
      id++;

      getJoystick(id, callback);
    });

    xboxJoystick.on('ready', function () {
      callback.apply(this, [xboxJoystick]);
    });
  } else {
    callback.apply(this, []);
  }
}

/**
 * Event "xboxButton" only on linux
*/
function LinuxConnector(opts) {
  this.xboxJoystick = getJoystick(0, function (xboxJoystick) {

    if (!xboxJoystick) {
      console.log(chalk.red('Error:'), 'Xbox controller not found');
    } else {
      this.controller = opts && opts.controller;
      this.xboxJoystick = xboxJoystick;

      console.log(chalk.green('Notice:'), 'Xbox controller connected');

      this.leftStick = new Stick({
        controller: this.controller,
        isLinux: true
      });

      this.rightStick = new Stick({
        reference: 'RIGHT',
        controller: this.controller,
        isLinux: true
      });

      this.buttons = require('../controllerConfiguration/buttons');

      var interpretJoystickData = function () {
        var btnsConfig = this.buttons.linuxAdapter;

        this.xboxJoystick.on('button', function (data) {

          for (var btn in btnsConfig) {
            if(data.number == btnsConfig[btn]){
              if(data.value == 1){
                this.controller.emit(btn);
              }else if(data.value === 0){
                this.controller.emit(btn + ':release');
              }else{
                this.controller.emit(btn + ':none');
              }
            }
          }
        }.bind(this));

        this.xboxJoystick.on('axis', function (data) {

          this.leftStick.fireStickEvents(data);
          this.rightStick.fireStickEvents(data);
        }.bind(this));
      }.bind(this);

      interpretJoystickData();
    }
  }.bind(this));
}

module.exports = LinuxConnector;
