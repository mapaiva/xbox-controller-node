var HID = require('node-hid'),
  util = require('util'),
  events = require('events'),
  chalk = require('chalk'),
  config = require('./config'),
  Stick = require('./stick'),
  buttons;

function XboxController(opts){
  this.HIDController = null;
  this.HIDProduct = (opts && opts.product) || 'controller';
  this.HIDConfig = (opts && opts.config) || {};

  this.getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.getController = function () {
  var os = require('os').platform();

  if(os == 'linux'){
    var LinuxConnector = require('./linux-connector');

    this.HIDController = new LinuxConnector({
      controller: this
    });
  }else{
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
      this.leftStick = new Stick({
        controller: this
      });
      this.rightStick = new Stick({
        reference: 'RIGHT',
        controller: this
      });

      this.interpretControllerData();
    }
  }
}

XboxController.prototype.interpretControllerData = function () {
  this.HIDController.on('data', function (data) {
    this.controlButton = data[this.HIDConfig.controlBtnsBlock] || data[10];
    this.directionalButton = data[this.HIDConfig.directionalBtnsBlock] || data[11];

    this.leftStick.fireStickEvents(data);
    this.rightStick.fireStickEvents(data);

    this._fireButtonEvents(this.directionalButton, this.controlButton);
  }.bind(this));
}

XboxController.prototype._fireButtonEvents = function(directionalButton, controlButton) {
  if(directionalButton){
    this.emitButton(directionalButton, 'DIRECTIONAL');
  }

  if(controlButton){
    this.emitButton(controlButton);
  }
}

XboxController.prototype.configure = function () {
  if(this.HIDController){
    config.start(this);
  }
}

XboxController.prototype.CreateController = function (HIDInfo) {
  if(!this.HIDController){
    if(!HIDInfo || !HIDInfo.product){
      console.log(chalk.yellow('Warn:'), '"HIDInfo.product" not found. Assuming pattern "controller"');
    }

    if(!HIDInfo || !HIDInfo.config){
      console.log(chalk.yellow('Warn:'), '"HIDInfo.config" not found. Assuming patterns "{controlBtnsBlock : 10, directionalBtnsBlock: 11}"');
    }

    return new XboxController(HIDInfo);
  }else{
    console.log(chalk.yellow("Warn:"), "Xbox controller is already connected");
  }
}

XboxController.prototype.listHIDDevices = function () {
  console.log(HID.devices());
}

XboxController.prototype.emitButton = function(data, typeButton) {
  var buttonRange;

  if(!buttons){
    try{
      buttons = require('../config/buttons.json');
    }catch(err){
      buttons = require('../controllerConfiguration/buttons.json')
    }
  }

  if(typeButton == 'DIRECTIONAL'){
    buttonRange = buttons.directionalButtons;
  }else {
    buttonRange = buttons.controlButtons;
  }

  for(btn in buttonRange){
    if(data == buttonRange[btn]){
      this.emit(btn);
    }else{
      this.emit(btn + ':none');
    }
  }
}

module.exports = new XboxController();
