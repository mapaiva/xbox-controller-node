var xbox = require('../lib/xbox-controller');

xbox.on('a', function () {
  console.log('[A] button press');
});

xbox.on('b', function () {
  console.log('[B] button press');
});

xbox.on('y', function () {
  console.log('[Y] button press');
});

xbox.on('x', function () {
  console.log('[X] button press');
});

xbox.on('rb', function () {
  console.log('[RB] button press');
});

xbox.on('lb', function () {
  console.log('[LB] button press');
});

xbox.on('start', function () {
  console.log('[START] button press');
});

xbox.on('back', function () {
  console.log('[BACK] button press');
});

xbox.on('up', function () {
  console.log('[UP] button press');
});

xbox.on('down', function () {
  console.log('[DOWN] button press');
});

xbox.on('left', function () {
  console.log('[LEFT] button press');
});

xbox.on('right', function () {
  console.log('[RIGHT] button press');
});

xbox.on('upright', function () {
  console.log('[UPRIGHT] buttons combination press');
});

xbox.on('upleft', function () {
  console.log('[UPLEFT] buttons combination press');
});

xbox.on('downright', function () {
  console.log('[DOWNRIGHT] buttons combination press');
});

xbox.on('downleft', function () {
  console.log('[DOWNLEFT] buttons combination press');
});

xbox.on('leftstickpress', function () {
  console.log('[LEFTSTICK] button press');
});

xbox.on('rightstickpress', function () {
  console.log('[RIGHTSTICK] button press');
});

xbox.on('a:release', function () {
  console.log('[A] button release');
});

xbox.on('b:release', function () {
  console.log('[B] button release');
});

xbox.on('y:release', function () {
  console.log('[Y] button release');
});

xbox.on('x:release', function () {
  console.log('[X] button release');
});

xbox.on('rb:release', function () {
  console.log('[RB] button release');
});

xbox.on('lb:release', function () {
  console.log('[LB] button release');
});

xbox.on('start:release', function () {
  console.log('[START] button release');
});

xbox.on('back:release', function () {
  console.log('[BACK] button release');
});

xbox.on('up:release', function () {
  console.log('[UP] button release');
});

xbox.on('down:release', function () {
  console.log('[DOWN] button release');
});

xbox.on('left:release', function () {
  console.log('[LEFT] button release');
});

xbox.on('right:release', function () {
  console.log('[RIGHT] button release');
});

xbox.on('upright:release', function () {
  console.log('[UPRIGHT] buttons combination release');
});

xbox.on('upleft:release', function () {
  console.log('[UPLEFT] buttons combination release');
});

xbox.on('downright:release', function () {
  console.log('[DOWNRIGHT] buttons combination release');
});

xbox.on('downleft:release', function () {
  console.log('[DOWNLEFT] buttons combination release');
});

xbox.on('leftstickpress:release', function () {
  console.log('[LEFTSTICK] button release');
});

xbox.on('rightstickpress:release', function () {
  console.log('[RIGHTSTICK] button release');
});

/* Stick events */

xbox.on('leftstickLeft', function () {
  console.log('Moving [LEFTSTICK] LEFT');
});

xbox.on('leftstickRight', function () {
  console.log('Moving [LEFTSTICK] RIGHT');
});

xbox.on('leftstickDown', function () {
  console.log('Moving [LEFTSTICK] DOWN');
});

xbox.on('leftstickUp', function () {
  console.log('Moving [LEFTSTICK] UP');
});

xbox.on('rightstickLeft', function () {
  console.log('Moving [RIGHTSTICK] LEFT');
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

/* Stick release events */

xbox.on('leftstickLeft:release', function () {
  console.log('Released [LEFTSTICK] LEFT');
});

xbox.on('leftstickRight:release', function () {
  console.log('Released [LEFTSTICK] RIGHT');
});

xbox.on('leftstickDown:release', function () {
  console.log('Released [LEFTSTICK] DOWN');
});

xbox.on('leftstickUp:release', function () {
  console.log('Released [LEFTSTICK] UP');
});

xbox.on('rightstickLeft:release', function () {
  console.log('Released [RIGHTSTICK] LEFT');
});

xbox.on('rightstickRight:release', function () {
  console.log('Released [RIGHTSTICK] RIGHT');
});

xbox.on('rightstickDown:release', function () {
  console.log('Released [RIGHTSTICK] DOWN');
});

xbox.on('rightstickUp:release', function () {
  console.log('Released [RIGHTSTICK] UP');
});
