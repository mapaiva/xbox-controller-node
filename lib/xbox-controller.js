var HID = require('node-hid');
var util = require('util');
var events = require('events');
var chalk = require('chalk');
var config = require('../lib/config');
var buttons;

function XboxController(){
  this.HIDController = null;

  this.getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.getController = function () {
  HID.devices().forEach(function(d){
    var product = (typeof d === 'object' && d.product) || '';

    if(product.toLowerCase().indexOf('controller') !== -1){

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

    var controlButton = data[10];
    var directionalButton = data[11];

    this.emit('data', getButton(directionalButton, 'DIRECTIONAL'), getButton(controlButton));
  }.bind(this));
}

XboxController.prototype.configure = function () {
  if(this.HIDController){
    config.start();  
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
