Xbox Controller Interface
====================

Simple interface to Xbox controller using Node.js

## Installing

```bash
npm install xbox-controller-node
```

If you have problems with the instalation of the `node-hid` these links can be usefull:

- Prerequisites of node-hid [node-hid prerequisites](https://github.com/node-hid/node-hid#prerequisites)
- node-gyp wiki documentation for windows [node-gyp wiki](https://github.com/TooTallNate/node-gyp/wiki/Visual-Studio-2010-Setup)

## Usage

See the complete API [Xbox Controller API](https://github.com/mapaiva/xbox-controller-node/wiki)

``` javascript
var xbox = require('xbox-controller-node');

xbox.on('a', function () {
  console.log('[A] button press');
});

xbox.on('start', function () {
  console.log('[Start] button press');
});

xbox.on('left', function () {
  console.log('[LEFT] button press');
});

xbox.on('upright', function () {
  console.log('[UPRIGHT] buttons combination press');
});

xbox.on('leftstickpress', function () {
  console.log('[LEFTSTICK] button press');
});
```

## Configuration

If the button commands coming wrong you can configure your own controller interface.

``` javascript
var xbox = require('xbox-controller-node');

xbox.configure();
```

This will launch a server page on browser to you configure your controller. The page will be available on `http://localhost:3000`.

## Just the first step

Yes. The triggers and the sticks buttons are not mapped :(. For this... contributions and improvements are very welcome. Thanks for see this.

  Based on [node-xbox-controller](https://github.com/andrew/node-xbox-controller)
