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
	
	var deadZoneRange = 0.75;	// The range from the neutral position in which no input is received
	var minVal = 0;					  // The minimum value of the bits sent through the buffer
	var maxVal = 65536				// The maximum value of the bits sent through the buffer
	
    if(this.isLinux){
		position = this._getLinuxAxisPosition(data);
    }else{
		position = this._getDirectionalPosition(data, minVal, maxVal);
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
	
    if(position.x <= 2 && position.x >= deadZoneRange){
      setLastMoveEvent(btnRef + 'stickRight', position.x, 'x');

      xbox.emit(btnRef + 'stickRight');
    }else{
      xbox.emit(btnRef + 'stickRight:none');
    }

    if(position.x <= -deadZoneRange && position.x >= -2){
      setLastMoveEvent(btnRef + 'stickLeft', position.x, 'x');

      xbox.emit(btnRef + 'stickLeft');
    }else{
      xbox.emit(btnRef + 'stickLeft:none');
    }
	
	if(position.y <= 2 && position.y >= deadZoneRange){
      setLastMoveEvent(btnRef + 'stickDown', position.y, 'y');

      xbox.emit(btnRef + 'stickDown');
    }else{
      xbox.emit(btnRef + 'stickDown:none');
    }

    if(position.y <= -deadZoneRange && position.y >= -2){
      setLastMoveEvent(btnRef + 'stickUp', position.y, 'y');

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
Stick.prototype._getDirectionalPosition = function (data, min, max) {
	// Get input in bytes from the buffer
	var x1 = parseInt(data[this.HIDCoordinates.x]);
	var x2 = parseInt(data[this.HIDCoordinates.x+1]);
	
	// Get value in bits
	var xpos = (x2*256)+x1;
	
	// Make 0 the neutral position
	xpos = xpos - (min+max)/2;
	
	// Get a value between -2 and 2
	xpos = xpos/((min+max)/4);
	
	// Get input in bytes from the buffer
	var y1 = parseInt(data[this.HIDCoordinates.y]);
	var y2 = parseInt(data[this.HIDCoordinates.y+1]);
	
	// Get value in bits
	var ypos = (y2*256)+y1;
	
	// Make 0 the neutral position
	ypos = ypos - (min+max)/2;
	
	// Get a value between -2 and 2
	ypos = ypos/((min+max)/4);
	
	return {
		x: xpos,
		y: ypos
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
