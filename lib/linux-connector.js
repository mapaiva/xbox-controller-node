var joystick = require('joystick'),
  chalk = require('chalk'),
  Stick = require('./stick');

/**
 * Event "xboxButton" only on linux
*/
function LinuxConnector(opts) {
  this.xboxJoystick = new joystick(0, 3500, 350);
  this.controller = opts && opts.controller;

  this.xboxJoystick.on('error', function (err) {
    console.log(chalk.red('Error:'), 'Xbox controller not found');
  });

  if(this.xboxJoystick){
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
}

module.exports = LinuxConnector;
