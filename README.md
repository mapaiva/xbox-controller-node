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

``` javascript
var xbox = require('xbox-controller-node');

xbox.on('data', function (directionalButton, controlButton) {
  console.log('Directional button:', directionalButton);
  console.log('Control button', controlButton);
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
