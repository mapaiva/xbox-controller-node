var xbox = require('./xbox-controller')
let buttonTable = ['a', 'b', 'x', 'y', 'lb', 'rb', 'start', 'back', 'leftstickpress', 'rightstickpress']

var joypadStatus = {
  sticks : {
    'leftstick' : {x : 0, y : 0},
    'rightstick' : {x : 0, y : 0},
    'cross' : {x : 0, y : 0},
    'lefttrigger' : {x : 0},
    'righttrigger' : {x : 0},
  },
  buttons : { // 0 = nothing, 1 = press
    'a' : {status : 0},
    'b' : {status : 0},
    'x' : {status : 0},
    'y' : {status : 0},
    'lb' : {status : 0},
    'rb' : {status : 0},
    'start' : {status : 0},
    'back' : {status : 0},
    'leftstickpress': {status : 0},
    'rightstickpress': {status : 0}
  }
}

xbox.on('anyStickMove', function (data) {
  joypadStatus.sticks[data.ref].x = data.position.x !== undefined ? data.position.x : joypadStatus.sticks[data.ref].x;
  joypadStatus.sticks[data.ref].y = data.position.y !== undefined ? data.position.y : joypadStatus.sticks[data.ref].y;
  console.log(joypadStatus);
});

buttonTable.forEach(function (button) {
  xbox.on(button, function () {
    joypadStatus.buttons[button].status = 1
    console.log(joypadStatus)
  }),
  xbox.on(button+':release', function () {
    joypadStatus.buttons[button].status = 0
    console.log(joypadStatus);
  })
})
