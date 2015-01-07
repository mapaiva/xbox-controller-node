var HID = require('node-hid'),
  util = require('util'),
  events = require('events'),
  chalk = require('chalk'),
  config = require('../lib/config'),
  buttons;

function XboxController(opts){
  this.HIDController = null;
  this.HIDProduct = (opts && opts.product) || 'controller';
  this.HIDConfig = (opts && opts.config) || null;

  this.getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.getController = function () {
  HID.devices().forEach(function(d){
    var product = (typeof d === 'object' && d.product) || '';

    if(product.toLowerCase().indexOf(this.HIDProduct) !== -1){

      this.HIDController = new HID.HID(d.path);
      console.log(chalk.green('Notice:'), 'Xbox controller connected');
    }
  }.bind(this));

  if(!this.HIDController){
    console.log(chalk.red('Error:'), 'Xbox controller not found');
  }else{
    this.interpretControllerData();
  }
}

XboxController.prototype.interpretControllerData = function () {
  this.HIDController.on('data', function (data) {
    var controlButton = (this.HIDConfig && data[this.HIDConfig.controlButtonsBlock]) || data[10],
      directionalButton = (this.HIDConfig && data[this.HIDConfig.directionalButtonsBlock]) || data[11];

    this._fireButtonEvents(directionalButton, controlButton);
  }.bind(this));
}

XboxController.prototype._fireButtonEvents = function(directionalButton, controlButton) {
  if(directionalButton){
    this.emit(getButton(directionalButton, 'DIRECTIONAL'));
  }

  if(controlButton){
    this.emit(getButton(controlButton));
  }
}

XboxController.prototype.configure = function () {
  if(this.HIDController){
    config.start(this);
  }
}

/**
 * Utility methods to configure your own controller
*/
XboxController.prototype.showAllHIDDevices =function () {
  HID.devices().forEach(function (d) {
    console.log(d);
  });
}

function getButton(data, typeButton) {
  var buttonRange;

  if(!buttons){
    try{
      buttons = require('../config/buttons.json');
    }catch(err){
      buttons = require('../lib/buttons.json')
    }
  }

  if(typeButton == 'DIRECTIONAL'){
    buttonRange = buttons.directionalButtons;
  }else {
    buttonRange = buttons.controlButtons;
  }

  for(btn in buttonRange){
    if(data ==  buttonRange[btn]){
      return btn;
    }
  }
}

module.exports = XboxController;
