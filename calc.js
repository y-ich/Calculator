var activate, angleUnit, clearStack, deactivate, expression, functions, gamma, lastUnary, loggamma, memory, parseEval, priority, reverse, split, stack, textBuffer, triggerEvent, updateView;

functions = {
  mr: function() {
    return memory;
  },
  pi: Math.PI,
  random: Math.random,
  percent2number: function(n) {
    return n / 100;
  },
  inverse: function(n) {
    return 1 / n;
  },
  square: function(n) {
    return Math.pow(n, 2);
  },
  cube: function(n) {
    return Math.pow(n, 3);
  },
  power: Math.pow,
  factorial: function(n) {
    return gamma(n + 1);
  },
  root: function(n) {
    return Math.pow(n, 0.5);
  },
  xthroot: function(x, y) {
    return Math.pow(x, 1 / y);
  },
  log: function(n) {
    return Math.log(n);
  },
  log10: function(n) {
    return Math.log(n) / Math.log(10);
  },
  log2: function(n) {
    return Math.log(n) / Math.log(2);
  },
  sin: function(x) {
    return Math.sin(x * (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1));
  },
  cos: function(x) {
    return Math.cos(x * (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1));
  },
  tan: function(x) {
    return Math.tan(x * (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1));
  },
  sinh: function(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  },
  cosh: function(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  },
  tanh: function(x) {
    return functions.sinh(x) / functions.cosh(x);
  },
  exp: Math.exp,
  enotation: function(x, y) {
    return x * Math.pow(10, y);
  },
  add: function(x, y) {
    return x + y;
  },
  sub: function(x, y) {
    return x - y;
  },
  mul: function(x, y) {
    return x * y;
  },
  div: function(x, y) {
    return x / y;
  },
  asin: function(x) {
    return Math.asin(x) / (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1);
  },
  acos: function(x) {
    return Math.scos(x) / (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1);
  },
  atan: function(x) {
    return Math.stan(x) / (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1);
  },
  asinh: function(x) {
    return Math.log(x + Math.sqrt(x * x + 1));
  },
  acosh: function(x) {
    return Math.log(x + Math.sqrt(x * x - 1));
  },
  atanh: function(x) {
    return Math.log((1 + x) / (1 - x)) / 2;
  }
};

memory = 0;

angleUnit = 'Deg';

textBuffer = {
  content: '0',
  val: function(str) {
    if (str != null) {
      if (str === '' || /\..*\./.test(str)) {
        return null;
      } else {
        this.content = str;
        this.changed();
        return this.content;
      }
    } else {
      return this.content;
    }
  },
  add: function(str) {
    return this.val(this.content === '0' && !/\./.test(str) ? str : this.content + str);
  },
  toggleSign: function() {
    return this.val(this.content[0] === '-' ? this.content.slice(1) : '-' + this.content);
  },
  changed: function() {
    return updateView(this.content);
  },
  clear: function() {
    return this.content = '0';
  }
};

stack = [];

expression = [];

priority = {
  '=': 0,
  '(': 0,
  ')': 0,
  'add': 1,
  'sub': 1,
  'mul': 2,
  'div': 2
};

lastUnary = null;

clearStack = function() {
  return stack = [];
};

parseEval = function(operator, operand1) {
  var lastEval, op, _ref, _ref2;
  switch (operator) {
    case '(':
      return stack.push('(');
    case ')':
      while (true) {
        op = stack.pop();
        if (!(op != null) || op === '(') return;
        lastEval = functions[stack.pop()](stack.pop(), operand1);
        updateView(lastEval);
      }
      break;
    case '=':
      lastUnary = null;
      while (true) {
        op = stack.pop();
        if (!(op != null)) return;
        if (op !== '(') {
          lastEval = functions[op](stack.pop(), operand1);
          if (lastUnary == null) {
            lastUnary = (function(operator, operand2) {
              return function(x) {
                return functions[operator](x, operand2);
              };
            })(op, operand1);
            updateView(lastEval);
          }
        }
      }
      break;
    default:
      if (stack.length !== 0 && ((_ref = priority[operator]) != null ? _ref : 3) <= ((_ref2 = priority[stack[stack.length - 1]]) != null ? _ref2 : 3)) {
        lastEval = functions[stack.pop()](stack.pop(), operand1);
        updateView(lastEval);
        return stack.push(lastEval, operator);
      } else {
        return stack.push(operand1, operator);
      }
  }
};

triggerEvent = 'touchend';

$('.key').each(function() {
  var $this;
  $this = $(this);
  if ($(this).data('role') == null) return $this.data('role', $this.text());
});

$('#clear').bind('touchend', function(event) {
  var entrance;
  textBuffer.clear();
  expression = [];
  entrance = [];
  return $('#view').text('0');
});

$('.key.number').bind('touchend', function() {
  return textBuffer.add($(this).data('role').toString());
});

$('#period').bind('touchend', function() {
  if (!/\./.test(textBuffer.val())) return textBuffer.add($(this).data('role'));
});

$('#plusminus').bind('touchend', function() {
  return textBuffer.toggleSign();
});

$('#mc').bind('touchend', function() {
  memory = 0;
  return deactivate($('#mr'));
});

$('#mplus').bind('touchend', function() {
  textBuffer.clear();
  memory += parseFloat(textBuffer.val());
  return activate($('#mr'));
});

$('#mminus').bind('touchend', function() {
  textBuffer.clear();
  memory -= parseFloat(textBuffer.val());
  return activate($('#mr'));
});

$('.nofix').bind('touchend', function() {
  updateView(functions[$(this).data('role')]().toString());
  return textBuffer.clear();
});

$('.unary').bind('touchend', function() {
  lastUnary = functions[$(this).data('role')];
  updateView(lastUnary(parseFloat($('#view').text().replace(',', ''))).toString());
  return textBuffer.clear();
});

$('.binary, #parright').bind('touchend', function() {
  parseEval($(this).data('role'), parseFloat($('#view').text().replace(',', '')));
  return textBuffer.clear();
});

$('#parleft').bind('touchend', function() {
  parseEval($(this).data('role'));
  return textBuffer.clear();
});

$('#equal_key').bind('touchend', function() {
  if (stack.length !== 0) {
    parseEval($(this).data('role'), parseFloat($('#view').text().replace(',', '')));
    return textBuffer.clear();
  } else if (lastUnary != null) {
    return updateView(lastUnary(parseFloat($('#view').text().replace(',', ''))).toString());
  }
});

$('#angle_key').bind('touchend', function() {
  var $this;
  $this = $(this);
  if (angleUnit === 'Deg') {
    angleUnit = 'Rad';
    $this.html($this.html().replace('Rad', 'Deg'));
  } else {
    angleUnit = 'Deg';
    $this.html($this.html().replace('Deg', 'Rad'));
  }
  return $('#angle').text(angleUnit);
});

$('#2nd').bind('touchend', function() {
  if ($(this).data('status') === 'off') {
    $(this).data('status', 'on');
    $(this).css('color', '#de8235');
    return $('.key.double').each(function() {
      var $this, fnname;
      $this = $(this);
      switch ($this.data('role')) {
        case 'log':
          $this.data('role', 'log2');
          return $this.html($this.html().replace('ln', 'log<sub>2</sub>'));
        case 'exp':
          $this.data('role', 'pow2');
          return $this.html($this.html().replace('e', '2'));
        default:
          fnname = $this.data('role');
          $this.data('role', 'a' + fnname);
          return $this.html($this.html().replace(fnname, fnname + '<sup>-1</sup>'));
      }
    });
  } else {
    $(this).data('status', 'off');
    $(this).css('color', '');
    return $('.key.double').each(function() {
      var $this, fnname;
      $this = $(this);
      switch ($this.data('role')) {
        case 'log2':
          $this.data('role', 'log');
          return $this.html($this.html().replace('log<sub>2</sub>', 'ln'));
        case 'pow2':
          $this.data('role', 'exp');
          return $this.html($this.html().replace('2', 'e'));
        default:
          fnname = $this.data('role');
          $this.data('role', fnname.slice(1));
          return $this.html($this.html().replace('<sup>-1</sup>', ''));
      }
    });
  }
});

$('.key').bind('touchstart', function() {
  return $(this).addClass('pushed');
});

$('.key').bind('touchend', function() {
  return $(this).removeClass('pushed');
});

$('.key').bind('touchcancel', function() {
  return $(this).removeClass('pushed');
});

activate = function($elem) {
  var active;
  active = $elem.children('.active');
  if (!(active != null) || active.length === 0) {
    return $elem.append($('<div class="active">'));
  }
};

deactivate = function($elem) {
  return $elem.children('.active').remove();
};

updateView = function(numStr) {
  var decimalStr, intStr, result, _ref;
  if (typeof numStr === 'number') numStr = numStr.toString();
  _ref = numStr.split('.'), intStr = _ref[0], decimalStr = _ref[1];
  if (numStr[0] === '-') intStr = intStr.slice(1);
  result = reverse((split(3, reverse(intStr))).join(','));
  if (decimalStr != null) result += '.' + decimalStr;
  return $('#view').text(numStr[0] === '-' ? '-' + result : result);
};

reverse = function(str) {
  var i, result, _ref;
  result = '';
  for (i = 1, _ref = str.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
    result += str.charAt(str.length - i);
  }
  return result;
};

split = function(n, str) {
  var i, result, _ref;
  result = [];
  for (i = 0, _ref = str.length; 0 <= _ref ? i < _ref : i > _ref; i += n) {
    result.push(str.slice(i, i + n));
  }
  return result;
};

loggamma = function(x) {
  var B0, B1, B10, B12, B14, B16, B2, B4, B6, B8, N, log2pi, tmp, v, w;
  log2pi = Math.log(2 * Math.PI);
  N = 8;
  B0 = 1.0;
  B1 = -1.0 / 2.0;
  B2 = 1.0 / 6.0;
  B4 = -1.0 / 30.0;
  B6 = 1.0 / 42.0;
  B8 = -1.0 / 30.0;
  B10 = 5.0 / 66.0;
  B12 = -691.0 / 2730.0;
  B14 = 7.0 / 6.0;
  B16 = -3617.0 / 510.0;
  v = 1.0;
  while (x < N) {
    v *= x;
    x++;
  }
  w = 1 / (x * x);
  tmp = B16 / (16 * 15);
  tmp = tmp * w + B14 / (14 * 13);
  tmp = tmp * w + B12 / (12 * 11);
  tmp = tmp * w + B10 / (10 * 9);
  tmp = tmp * w + B8 / (8 * 7);
  tmp = tmp * w + B6 / (6 * 5);
  tmp = tmp * w + B4 / (4 * 3);
  tmp = tmp * w + B2 / (2 * 1);
  tmp = tmp / x + 0.5 * log2pi - Math.log(v) - x + (x - 0.5) * Math.log(x);
  return tmp;
};

gamma = function(x) {
  return Math.exp(loggamma(x));
};
