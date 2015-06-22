Xbox Controller Interface
====================

![dependencies](https://david-dm.org/mapaiva/xbox-controller-node.svg)

Simple interface to Xbox controller using Node.js

## Installing

```bash
npm install xbox-controller-node
```

If you have problems with the instalation of the `node-hid` these links can be usefull:

- Prerequisites of node-hid [node-hid prerequisites](https://github.com/node-hid/node-hid#prerequisites)
- node-gyp wiki documentation for windows [node-gyp wiki](https://github.com/TooTallNate/node-gyp/wiki/Visual-Studio-2010-Setup)

### Linux Requirements

#### Ubunto based distributions
- libudev-dev
- libusb-1.0-0-dev

```bash
sudo apt-get install libudev-dev && sudo apt-get install libusb-1.0-0-dev 
```

#### Fedora based distributions
- kernel-modules-extra
- joystick
- libusbx-devel

```bash
sudo yum install kernel-modules-extra
sudo yum install joystick
sudo yum install libusbx-devel
```

## Usage

See the complete API [Xbox Controller API](https://github.com/mapaiva/xbox-controller-node/wiki).

``` javascript
var xbox = require('xbox-controller-node');

xbox.on('a', function () {
  console.log('[A] button press');
});

xbox.on('a:release', function () {
  console.log('[A] button release');
});

xbox.on('start', function () {
  console.log('[Start] button press');
});

xbox.on('left', function () {
  console.log('[LEFT] button press');
});

xbox.on('left:release', function () {
  console.log('[LEFT] button release');
});

xbox.on('upright', function () {
  console.log('[UPRIGHT] buttons combination press');
});

xbox.on('leftstickpress', function () {
  console.log('[LEFTSTICK] button press');
});

//Manage sticks events

xbox.on('leftstickLeft', function () {
  console.log('Moving [LEFTSTICK] LEFT');
});

xbox.on('leftstickLeft:release', function () {
  console.log('Released [LEFTSTICK] LEFT');
});

xbox.on('leftstickRight', function () {
  console.log('Moving [LEFTSTICK] RIGHT');
});

xbox.on('leftstickRight:release', function () {
  console.log('Released [LEFTSTICK] RIGHT');
})

xbox.on('leftstickDown', function () {
  console.log('Moving [LEFTSTICK] DOWN');
});

xbox.on('leftstickUp', function () {
  console.log('Moving [LEFTSTICK] UP');
});

xbox.on('rightstickLeft', function () {
  console.log('Moving [RIGHTSTICK] LEFT');
});

xbox.on('rightstickLeft:release', function () {
  console.log('Released [RIGHTSTICK] LEFT');
});

xbox.on('rightstickRight', function () {
  console.log('Moving [RIGHTSTICK] RIGHT');
});

xbox.on('rightstickDown', function () {
  console.log('Moving [RIGHTSTICK] DOWN');
});

xbox.on('rightstickUp', function () {
  console.log('Moving [RIGHTSTICK] UP');
});
```

You can test the API running:

```bash
npm test
```

## Configuration

If the button commands coming wrong you can configure your own controller interface.

``` javascript
var xbox = require('xbox-controller-node');

xbox.configure();
```

This will launch a server page on browser to you configure your controller. The page will be available on `http://localhost:3000`. See the complete [Configuration Guide](https://github.com/mapaiva/xbox-controller-node/wiki/Configuration-Guide).

## Just the first step

Yes. The triggers are not mapped :(. For this... contributions and improvements are very welcome. Thanks for see this.

## License

Copyright (c) 2015 Matheus Paiva (MIT) The MIT License
