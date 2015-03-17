var sticks = require('../controllerConfiguration/sticks'),
  chalk = require('chalk');

function Stick(opts) {
  this.reference = (opts && opts.reference) || 'LEFT';
  this.controller = (opts && opts.controller) || null;
  this.isLinux = (opts && opts.isLinux) || false;
  this.lastMoveEvent = null;

  if (this.reference == 'RIGHT') {
    this.HIDCoordinates = sticks.rightStickCoordinates;
  }else{
    this.HIDCoordinates = sticks.leftStickCoordinates;
  }
}

Stick.prototype.fireStickEvents =  function (data) {

  var setLastMoveEvent = function (name, bufferValue, axis) {

    this.lastMoveEvent = {
      name: name,
      bufferValue: bufferValue,
      axis: axis
    };
  }.bind(this);

  var _emitStickEvents = function (data) {
    var xbox = this.controller,
      position, btnRef;

    if(this.isLinux){
      position = this._getLinuxAxisPosition(data);
    }else{
      position = this._getDirectionalPosition(data);
    }

    btnRef = this.reference.toLowerCase();

    xbox.emit(btnRef + 'stickMove', position);

    if (this.lastMoveEvent) {

      if (this.lastMoveEvent.axis == 'x' && (position.x != 'none' && position.x != this.lastMoveEvent.bufferValue)) {
        xbox.emit(this.lastMoveEvent.name + ':release');

        this.lastMoveEvent = null;
      }else if (this.lastMoveEvent.axis == 'y' && (position.y != 'none' && position.y != this.lastMoveEvent.bufferValue)){
        xbox.emit(this.lastMoveEvent.name + ':release');

        this.lastMoveEvent = null;
      }
    }

    if(position.x == 255){
      setLastMoveEvent(btnRef + 'stickRight', 255, 'x');

      xbox.emit(btnRef + 'stickRight');
    }else{
      xbox.emit(btnRef + 'stickRight:none');
    }

    if(position.x === 0){
      setLastMoveEvent(btnRef + 'stickLeft', 0, 'x');

      xbox.emit(btnRef + 'stickLeft');
    }else{
      xbox.emit(btnRef + 'stickLeft:none');
    }

    if(position.y == 255){
      setLastMoveEvent(btnRef + 'stickDown', 255, 'y');

      xbox.emit(btnRef + 'stickDown');
    }else{
      xbox.emit(btnRef + 'stickDown:none');
    }

    if(position.y === 0){
      setLastMoveEvent(btnRef + 'stickUp', 0, 'y');

      xbox.emit(btnRef + 'stickUp');
    }else{
      xbox.emit(btnRef + 'stickUp:none');
    }
  }.bind(this);

  if(this.controller && data){
    _emitStickEvents(data);
  }else{
    console.log(chalk.red('Error:'), 'Stick: Stick.controller or data were not setted');
  }
};

/**
 * @private
*/
Stick.prototype._getDirectionalPosition = function (data) {

  return {
      x: data[this.HIDCoordinates.x],
      y: data[this.HIDCoordinates.y]
  };
};

/**
 * @private
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
    x: (x || x === 0) ? x : 'none',
    y: (y || y === 0) ? y : 'none'
  };
};

module.exports = Stick;
