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
  console.log('[Start] button press');
});

xbox.on('select', function () {
  console.log('[Select] button press');
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
  console.log('[UPRIGHT] button press');
});

xbox.on('upleft', function () {
  console.log('[UPLEFT] button press');
});

xbox.on('downright', function () {
  console.log('[DOWNRIGHT] button press');
});

xbox.on('downleft', function () {
  console.log('[DOWNLEFT] button press');
});


xbox.on('leftstickpress', function () {
  console.log('[LEFTSTICKPRESS] button press');
});

xbox.on('rightstickpress', function () {
  console.log('[RIGHTSTICKPRESS] button press');
});