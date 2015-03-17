var HID = require('node-hid'),
  util = require('util'),
  events = require('events'),
  chalk = require('chalk'),
  config = require('./config'),
  Stick = require('./stick'),
  os = require('os').platform(),
  buttons;

function XboxController(opts){
  this.HIDController = null;
  this.HIDProduct = (opts && opts.product) || 'controller';
  this.HIDConfig = (opts && opts.config) || {};
  this.lastButtonPressed = null;

  var getController = function() {

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

        interpretControllerData();
      }
    }
  }.bind(this);

  var interpretControllerData = function() {
    this.HIDController.on('data', function (data) {
      this.controlButton = data[this.HIDConfig.controlBtnsBlock] || data[10];
      this.directionalButton = data[this.HIDConfig.directionalBtnsBlock] || data[11];

      this.leftStick.fireStickEvents(data);
      this.rightStick.fireStickEvents(data);

      _fireButtonEvents(this.directionalButton, this.controlButton);
    }.bind(this));
  }.bind(this);

  var _fireButtonEvents = function(directionalButton, controlButton) {
    emitButton(directionalButton, 'DIRECTIONAL');

    emitButton(controlButton);
  }.bind(this);

  var emitButton = function(data, typeButton) {
    var buttonRange;

    if(!buttons){
      try{
        buttons = require('../config/buttons.json');
      }catch(err){
        buttons = require('../controllerConfiguration/buttons.json');
      }
    }

    if(typeButton == 'DIRECTIONAL'){
      buttonRange = buttons.directionalButtons;
    }else {
      buttonRange = buttons.controlButtons;
    }

    if (this.lastButtonPressed && (buttonRange[this.lastButtonPressed] && data != buttonRange[this.lastButtonPressed])) {
      this.emit(this.lastButtonPressed + ':release');

      this.lastButtonPressed = null;
    }

    for(var btn in buttonRange){

      if(data == buttonRange[btn]){
        this.lastButtonPressed = btn;

        this.emit(btn);
      }else{
        this.emit(btn + ':none');
      }
    }
  }.bind(this);

  getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.configure = function () {
  if(this.HIDController){

    if (os == 'linux') {
      console.log(chalk.cyan.bold('Relax dude you\'re using linux you don\'t need configure nothing XD'));
    }else {
      config.start(this);
    }
  }
};

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
};

XboxController.prototype.listHIDDevices = function () {
  console.log(HID.devices());
};

module.exports = new XboxController();
