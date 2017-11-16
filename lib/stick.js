var sticks = require('../controllerConfiguration/sticks'),
  chalk = require('chalk');

function Stick(opts) {
  this.reference = (opts && opts.reference) || 'LEFT';
  this.controller = (opts && opts.controller) || null;
  this.isLinux = (opts && opts.isLinux) || false;
  this.lastMoveEvent = null;
  this.HIDCoordinates = sticks[this.reference + 'Coordinates'];
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

    xbox.emit('anyStickMove', {ref:btnRef,position:position})
    xbox.emit(btnRef + 'Move', position);

    if (this.lastMoveEvent) {

      if (this.lastMoveEvent.axis == 'x' && (position.x != 'none' && position.x != this.lastMoveEvent.bufferValue)) {
        xbox.emit(this.lastMoveEvent.name + ':release');

      }else if (this.lastMoveEvent.axis == 'y' && (position.y != 'none' && position.y != this.lastMoveEvent.bufferValue)){
        xbox.emit(this.lastMoveEvent.name + ':release');

        this.lastMoveEvent = null;
      }
    }

    if(position.x == 255){
      setLastMoveEvent(btnRef + 'Right', 255, 'x');

      xbox.emit(btnRef + 'Right');
    }else{
      xbox.emit(btnRef + 'Right:none');
    }

    if(position.x === 0){
      setLastMoveEvent(btnRef + 'Left', 0, 'x');

      xbox.emit(btnRef + 'Left');
    }else{
      xbox.emit(btnRef + 'Left:none');
    }

    if(position.y == 255){
      setLastMoveEvent(btnRef + 'Down', 255, 'y');

      xbox.emit(btnRef + 'Down');
    }else{
      xbox.emit(btnRef + 'Down:none');
    }

    if(position.y === 0){
      setLastMoveEvent(btnRef + 'Up', 0, 'y');

      xbox.emit(btnRef + 'Up');
    }else{
      xbox.emit(btnRef + 'Up:none');
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
  var reduceData = Math.round(data.value / 256),
    x, y;
  if (this.HIDCoordinates.axisX == data.number) {
    x = reduceData;
  }else if(this.HIDCoordinates.axisY == data.number){
    y = reduceData !== 0 ? -1*reduceData : 0;
  }
  
  return {
    x: (x)||x===0 ? x : undefined,
    y: (y)||y===0 ? y : undefined
  };
};

module.exports = Stick;
