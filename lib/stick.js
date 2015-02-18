var sticks = require('../lib/sticks');

function Stick(reference) {
  this.reference = reference || 'LEFT';
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

Stick.prototype.fireStickEvents =  function (opts) {
  var xbox = opts && opts.xbox,
    data = opts && opts.data,
    position = {};

  if(xbox && data){

    for (cord in this.HIDCoordinates) {
      position[cord] = data[this.HIDCoordinates[cord]];
    }

    xbox.emit(this.reference.toLowerCase() + 'stick', position);
  }else{
    throw 'Stick: The parameters "xbox" and "data" are required';
  }
}

module.exports = Stick;
