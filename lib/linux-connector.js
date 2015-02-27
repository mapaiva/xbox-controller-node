var joystick = require('joystick'),
  chalk = require('chalk');

function LinuxConnector(opts) {
  this.xboxJoystick = new joystick(0, 3500, 350);
  this.controller = opts && opts.controller;

  if(this.xboxJoystick){
    console.log(chalk.green('Notice:'), 'Xbox controller connected');

    this.interpretJoystickData();
  }
}

LinuxConnector.prototype.joystickConfig = [
  {
    name: 'a',
    joystickNumber: 0
  },
  {
    name: 'b',
    joystickNumber: 1
  },
  {
    name: 'x',
    joystickNumber: 2
  },
  {
    name: 'y',
    joystickNumber: 3
  },
  {
    name: 'lb',
    joystickNumber: 4
  },
  {
    name: 'rb',
    joystickNumber: 5
  },
  {
    name: 'back',
    joystickNumber: 6
  },
  {
    name: 'start',
    joystickNumber: 7
  },
  {
    name: 'xboxButton',
    joystickNumber: 8
  },
  {
    name: 'leftstickpress',
    joystickNumber: 9
  },
  {
    name: 'rightstickpress',
    joystickNumber: 10
  },
  {
    name: 'left',
    joystickNumber: 11
  },
  {
    name: 'right',
    joystickNumber: 12
  },
  {
    name: 'up',
    joystickNumber: 13
  },
  {
    name: 'down',
    joystickNumber: 14
  }
];

LinuxConnector.prototype.interpretJoystickData = function () {

  this.xboxJoystick.on('button', function (data) {
    for (var i = 0; i < this.joystickConfig.length; i++) {

      if(data.number == this.joystickConfig[i].joystickNumber){
        if(data.value == 1){
          console.log('Button [' + this.joystickConfig[i].name + '] pressed');
        }else{
          //TODO: none event here
        }
      }
    }
  }.bind(this));

  this.xboxJoystick.on('axis', function (data) {
    //console.log('Axis:', data);
  });
};

module.exports = LinuxConnector;
