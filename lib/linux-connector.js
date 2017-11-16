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
        reference : 'leftStick',
        controller: this.controller,
        isLinux: true
      });

      this.rightStick = new Stick({
        reference : 'rightStick',
        controller: this.controller,
        isLinux: true
      });
      
      this.leftTrigger = new Stick({
        reference : 'leftTrigger',
        controller: this.controller,
        isLinux: true
      });

      this.rightTrigger = new Stick({
        reference: 'rightTrigger',
        controller: this.controller,
        isLinux: true
      });

      this.cross = new Stick({
        reference : 'cross',
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
          // Xbox
          // axis 0 LS.x left is -32767
          // axis 1 LS.y top is -32767 
          // axis 2 LT.x released is -32767
          // axis 3 RS.x left is -32767
          // axis 4 RS.y top is -32767 
          // axis 5 LT.x released is -32767
          // axis 6 CR.x left is -32767
          // axis 7 CR.y top is -32767 
          // console.log(data.number + ' → ' + data.value);
          
          if(data.number == 0 || data.number == 1) this.leftStick.fireStickEvents(data);
          if(data.number == 2) this.leftTrigger.fireStickEvents(data);
          if(data.number == 3 || data.number == 4) this.rightStick.fireStickEvents(data);
          if(data.number == 5) this.rightTrigger.fireStickEvents(data);
          if(data.number == 6 || data.number == 7) this.cross.fireStickEvents(data);
        }.bind(this));
      }.bind(this);

      interpretJoystickData();
    }
  }.bind(this));
}

module.exports = LinuxConnector;
