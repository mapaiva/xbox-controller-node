var HID = require('node-hid'),
  util = require('util'),
  events = require('events'),
  chalk = require('chalk'),
  config = require('../lib/config'),
  buttons;

function XboxController(opts){
  this.HIDController = null;
  this.HIDProduct = (opts && opts.product) || 'controller';
  this.HIDConfig = (opts && opts.config);

  this.getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.getController = function () {
  HID.devices().forEach(function(d){
    var product = (typeof d === 'object' && d.product) || '';

    if(product.toLowerCase().indexOf(this.HIDProduct.toLowerCase()) !== -1){

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
    var controlButton = (this.HIDConfig && data[this.HIDConfig.controlBtnsBlock]) || data[10],
      directionalButton = (this.HIDConfig && data[this.HIDConfig.directionalBtnsBlock]) || data[11];

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

XboxController.prototype.CreateController = function (HIDInfo) {
 if(!HIDInfo || !HIDInfo.product){
   console.log(chalk.yellow('Warn:'), '"HIDInfo.product" not found. Assuming pattern "controller"');
 }

 if(!HIDInfo || !HIDInfo.config){
   console.log(chalk.yellow('Warn:'), '"HIDInfo.config" not found. Assuming patterns "{controlBtnsBlock : 10, directionalBtnsBlock: 11}"');
 }

 return new XboxController(HIDInfo);
}

/**
  * Utility methods to configure your own HIDcontroller
  */

XboxController.prototype.listHIDDevices = function () {
  console.log(HID.devices());
}

XboxController.prototype.analyzeHIDData = function () {
  if(this.HIDController){
    this.HIDController.on('data', function (data) {
      console.log(data);
    });
  }
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

module.exports = new XboxController();
