var ac2c, activate, angleUnit, c2ac, clearStack, deactivate, display, functions, gamma, isPortrait, latestEval, latestUnary, loggamma, memory, parseEval, priority, reverse, split, stack, textBuffer, touchEnd, touchStart;

try {
  document.createEvent('TouchEvent');
  touchStart = 'touchstart';
  touchEnd = 'touchend';
} catch (error) {
  touchStart = 'mousedown';
  touchEnd = 'mouseup';
}

functions = {
  mr: function() {
    return memory;
  },
  pi: function() {
    return Math.PI;
  },
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
    var digits;
    digits = this.val().replace(/[\-,\.]/g, '').length;
    if ((this.content === '0' && str === '0') || digits >= display.maxDigits() || /e/.test(display.text())) {
      return;
    }
    this.val(this.content === '0' && !/\./.test(str) ? str : this.content + str);
    return this.added();
  },
  toggleSign: function() {
    return this.val(this.content[0] === '-' ? this.content.slice(1) : '-' + this.content);
  },
  changed: function() {
    return display.update(this.content);
  },
  clear: function() {
    return this.content = '0';
  },
  added: function() {
    return ac2c();
  }
};

latestEval = {
  content: 0,
  val: function(num) {
    if (num != null) {
      this.content = num;
      this.changed();
      return this.content;
    } else {
      return this.content;
    }
  },
  changed: function() {
    return display.update(this.content);
  }
};

stack = [];

priority = {
  '=': 0,
  '(': 0,
  ')': 0,
  'add': 1,
  'sub': 1,
  'mul': 2,
  'div': 2
};

latestUnary = null;

clearStack = function() {
  return stack = [];
};

parseEval = function(operator, operand1) {
  var op, _ref, _ref2;
  switch (operator) {
    case '(':
      return stack.push('(');
    case ')':
      latestEval.val(operand1);
      while (true) {
        op = stack.pop();
        if (!(op != null) || op === '(') return;
        latestEval.val(functions[op](stack.pop(), latestEval.val()));
      }
      break;
    case '=':
      latestUnary = null;
      latestEval.val(operand1);
      while (true) {
        op = stack.pop();
        if (!(op != null)) return;
        if (op !== '(') {
          latestEval.val(functions[op](stack.pop(), latestEval.val()));
          if (latestUnary == null) {
            latestUnary = (function(operator, operand2) {
              return function(x) {
                return functions[operator](x, operand2);
              };
            })(op, operand1);
          }
        }
      }
      break;
    default:
      if (stack.length !== 0 && ((_ref = priority[operator]) != null ? _ref : 3) <= ((_ref2 = priority[stack[stack.length - 1]]) != null ? _ref2 : 3)) {
        latestEval.val(functions[stack.pop()](stack.pop(), operand1));
        return stack.push(latestEval.val(), operator);
      } else {
        return stack.push(operand1, operator);
      }
  }
};

$('.key').each(function() {
  var $this;
  $this = $(this);
  if ($(this).data('role') == null) return $this.data('role', $this.text());
});

$('#clear').bind(touchEnd, function(event) {
  if ($(this).data('role') === 'allclear') {
    latestUnary = null;
    clearStack();
    deactivate($('.binary'));
  } else {
    activate($(".binary[data-role=\"" + stack[stack.length - 1] + "\"]"));
  }
  textBuffer.clear();
  latestEval.val(0);
  return c2ac();
});

$('#pi').bind(touchEnd, function() {
  return ac2c();
});

$('.number').bind(touchEnd, function() {
  return textBuffer.add($(this).data('role').toString());
});

$('.number, #pi').bind(touchEnd, function() {
  return deactivate($('.binary'));
});

$('#period').bind(touchEnd, function() {
  if (!/\./.test(textBuffer.val())) return textBuffer.add($(this).data('role'));
});

$('#plusminus').bind(touchEnd, function() {
  return textBuffer.toggleSign();
});

$('#mc').bind(touchEnd, function() {
  memory = 0;
  return deactivate($('#mr'));
});

$('#mplus').bind(touchEnd, function() {
  textBuffer.clear();
  memory += display.val();
  return activate($('#mr'));
});

$('#mminus').bind(touchEnd, function() {
  textBuffer.clear();
  memory -= display.val();
  return activate($('#mr'));
});

$('.nofix').bind(touchEnd, function() {
  display.update(functions[$(this).data('role')]().toString());
  return textBuffer.clear();
});

$('.unary').bind(touchEnd, function() {
  latestUnary = functions[$(this).data('role')];
  display.update(latestUnary(display.val()).toString());
  return textBuffer.clear();
});

$('.binary').bind(touchEnd, function() {
  deactivate($('.binary'));
  return activate($(this));
});

$('.binary, #parright').bind(touchEnd, function() {
  parseEval($(this).data('role'), display.val());
  return textBuffer.clear();
});

$('#parleft').bind(touchEnd, function() {
  parseEval($(this).data('role'));
  return textBuffer.clear();
});

$('#equal_key').bind(touchEnd, function() {
  if (stack.length !== 0) {
    parseEval($(this).data('role'), display.val());
    return textBuffer.clear();
  } else if (latestUnary != null) {
    return display.update(latestUnary(display.val()).toString());
  }
});

$('#angle_key').bind(touchEnd, function() {
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

$('#second').bind(touchEnd, function() {
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
    $(this).removeClass('pushed');
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

$('.key').bind(touchStart, function() {
  return $(this).addClass('pushed');
});

$('.key:not(#second)').bind(touchEnd, function() {
  return $(this).removeClass('pushed');
});

$('.key').bind('touchcancel', function() {
  return $(this).removeClass('pushed');
});

$('window').bind('orientationchange', function() {
  return display.update();
});

ac2c = function() {
  $('#clear').data('role', 'clear');
  return $('#clear').html($('#clear').html().replace('AC', 'C'));
};

c2ac = function() {
  $('#clear').data('role', 'allclear');
  return $('#clear').html($('#clear').html().replace('>C', '>AC'));
};

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

display = {
  content: '0',
  width: function() {
    if (innerWidth <= 320) {
      if (isPortrait()) {
        return 280;
      } else {
        return 406;
      }
    } else {
      if (isPortrait()) {
        return 671;
      } else {
        return 875;
      }
    }
  },
  fontSize: function() {
    if (innerWidth <= 320) {
      if (isPortrait()) {
        return '78px';
      } else {
        return '50px';
      }
    } else {
      if (isPortrait()) {
        return '182px';
      } else {
        return '108px';
      }
    }
  },
  val: function() {
    return parseFloat(this.content);
  },
  text: function() {
    return $('#view').text();
  },
  maxDigits: function() {
    if (isPortrait()) {
      return 9;
    } else {
      return 16;
    }
  },
  maxSignificants: function() {
    if (isPortrait()) {
      return 8;
    } else {
      return 14;
    }
  },
  update: function(numStr) {
    var $view, decimalStr, expStr, fracStr, intStr, result, _ref, _ref2;
    if (numStr != null) {
      this.content = numStr;
    } else {
      numStr = this.content;
    }
    $view = $('#view');
    numStr = numStr.toString();
    if (/e/.test(numStr)) {
      console.log('pass');
      _ref = numStr.split('e'), fracStr = _ref[0], expStr = _ref[1];
      $view.text(fracStr.replace('.', '').length > display.maxSignificants() ? parseFloat(numStr).toExponential(display.maxSignificants()) : numStr);
    } else {
      _ref2 = numStr.split('.'), intStr = _ref2[0], decimalStr = _ref2[1];
      if (numStr[0] === '-') intStr = intStr.slice(1);
      result = reverse((split(3, reverse(intStr))).join(','));
      if (decimalStr != null) result += '.' + decimalStr;
      $view.text(numStr[0] === '-' ? '-' + result : result);
    }
    $view.css('visibility', 'hidden');
    $view.css('font-size', display.fontSize());
    while (!($view[0].offsetWidth <= display.width())) {
      $view.css('font-size', parseInt($view.css('font-size')) - 1 + 'px');
    }
    return $view.css('visibility', '');
  }
};

isPortrait = function() {
  return (typeof orientation !== "undefined" && orientation !== null ? orientation : 90) % 180 === 0;
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
