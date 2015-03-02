var sticks = require('../controllerConfiguration/sticks'),
  chalk = require('chalk');

function Stick(opts) {
  this.reference = (opts && opts.reference) || 'LEFT';
  this.controller = (opts && opts.controller) || null;
  this.isLinux = (opts && opts.isLinux) || false;

  if (this.reference == 'RIGHT') {
    this.HIDCoordinates = sticks.rightStickCoordinates;
  }else{
    this.HIDCoordinates = sticks.leftStickCoordinates;
  }
}

Stick.prototype.fireStickEvents =  function (data) {

  if(this.controller && data){
    this._emitStickEvents(data);
  }else{
    console.log(chalk.red('Error:'), 'Stick: Stick.controller or data were not setted');
  }
}

/**
* @private
*/
Stick.prototype._emitStickEvents = function (data) {
  var xbox = this.controller,
    position, btnRef;

  if(this.isLinux){
    position = this._getLinuxAxisPosition(data);
  }else{
    position = this._getDirectionalPosition(data);
  }

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

/**
 * @private
*/
Stick.prototype._getDirectionalPosition = function (data) {

  return {
      x: data[this.HIDCoordinates.x],
      y: data[this.HIDCoordinates.y]
  };
}

/**
 * private
*/
Stick.prototype._getLinuxAxisPosition = function (data) {
  var reduceData = 128 - (Math.floor(data.value / 256) * -1),
    x, y;

  if (this.HIDCoordinates.axisX == data.number) {
    x = reduceData;
  }else if(this.HIDCoordinates.axisY == data.number){
    y = reduceData;
  }

  return {
    x: (x || x == 0) ? x : 'none',
    y: (y || y == 0) ? y : 'none'
  };
}

module.exports = Stick;
