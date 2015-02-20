var sticks = require('../controllerConfiguration/sticks'),
  chalk = require('chalk');

function Stick(opts) {
  this.reference = (opts && opts.reference) || 'LEFT';
  this.controller = (opts && opts.controller) || null;
  this.HIDCoordinates = null;

  this.getCoordinates();
}

Stick.prototype.getCoordinates = function () {
  if(this.HIDCoordinates){
    return this.HIDCoordinates;
  }

  if (this.reference == 'RIGHT') {
    this.HIDCoordinates = sticks.rightStickCoordinates;
  }else{
    this.HIDCoordinates = sticks.leftStickCoordinates;
  }

  return this.HIDCoordinates;
}

Stick.prototype.fireStickEvents =  function (data) {
  var xbox = this.controller;

  if(xbox && data){

    this._getDirectionalPosition(data, xbox);
  }else{
    console.log(chalk.red('Error:'), 'Stick: Stick.controller or data were not setted');
  }
}

/**
 * @private
*/
Stick.prototype._getDirectionalPosition = function (data, xbox) {
  var position, btnRef;

  position = {
    x: data[this.HIDCoordinates.x],
    y: data[this.HIDCoordinates.y]
  };

  btnRef = this.reference.toLowerCase();

  xbox.emit(btnRef + 'stickMove', position);

  if(position.x == 255){
    xbox.emit(btnRef + 'stickRight');
  }else{
    xbox.emit(btnRef + 'stickRight:none');
  }

  if(position.x == 0){
    xbox.emit(btnRef + 'stickLeft');
  }else{
    xbox.emit(btnRef + 'stickLeft:none');
  }

  if(position.y == 255){
    xbox.emit(btnRef + 'stickDown');
  }else{
    xbox.emit(btnRef + 'stickDown:none');
  }

  if(position.y == 0){
    xbox.emit(btnRef + 'stickUp');
  }else{
    xbox.emit(btnRef + 'stickUp:none');
  }
}

module.exports = Stick;
