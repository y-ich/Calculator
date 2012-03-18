var ac2c, activate, angleUnit, c2ac, clearStack, deactivate, display, functions, gamma, invTrig, isPortrait, latestEval, latestUnary, loggamma, memory, parseEval, priority, reverse, split, stack, tangent, textBuffer, touchEnd, touchStart, trigonometric;

try {
  document.createEvent('TouchEvent');
  touchStart = 'touchstart';
  touchEnd = 'touchend';
} catch (error) {
  touchStart = 'mousedown';
  touchEnd = 'mouseup';
}

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
  var B, N, i, sigma, v, y;
  B = [1, -1 / 2, 1 / 6, 0, -1 / 30, 0, 1 / 42, 0, -1 / 30, 0, 5 / 66, 0, -691 / 2730, 0, 7 / 6, 0, -3617 / 510, 0, 43867 / 798, 0, -174611 / 330];
  N = 10;
  v = 1.0;
  y = x;
  while (y < N) {
    v *= y;
    y++;
  }
  sigma = -Math.log(v) + (y - 0.5) * Math.log(y) - y + 0.5 * Math.log(2 * Math.PI);
  for (i = 2; i <= N; i += 2) {
    sigma += B[i] / (i * (i - 1) * Math.pow(y, i - 1));
  }
  return sigma;
};

gamma = function(x) {
  var result;
  result = Math.exp(loggamma(x));
  if (Math.floor(x) === x) {
    return Math.floor(result);
  } else {
    return result;
  }
};

trigonometric = function(fn) {
  return function(x) {
    return parseFloat(fn(x * (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1)).toFixed(15));
  };
};

invTrig = function(fn) {
  return function(x) {
    return fn(x) / (angleUnit === 'Deg' ? 2 * Math.PI / 360 : 1);
  };
};

tangent = function(x) {
  var result;
  result = Math.tan(x);
  if (Math.abs(result) < 1.5e+16) {
    return result;
  } else {
    return NaN;
  }
};

functions = {
  mr: function() {
    return memory;
  },
  pi: function() {
    return Math.PI;
  },
  random: Math.random,
  percent2number: function(x) {
    return x / 100;
  },
  inverse: function(x) {
    return 1 / x;
  },
  square: function(x) {
    return Math.pow(x, 2);
  },
  cube: function(x) {
    return Math.pow(x, 3);
  },
  power: Math.pow,
  factorial: function(x) {
    return gamma(x + 1);
  },
  root: function(x) {
    return Math.pow(x, 0.5);
  },
  xthroot: function(x, y) {
    return Math.pow(x, 1 / y);
  },
  log: function(x) {
    return Math.log(x);
  },
  log10: function(x) {
    return Math.log(x) / Math.log(10);
  },
  log2: function(x) {
    return Math.log(x) / Math.log(2);
  },
  sin: trigonometric(Math.sin),
  cos: trigonometric(Math.cos),
  tan: trigonometric(tangent),
  sinh: function(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  },
  cosh: function(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  },
  tanh: function(x) {
    return parseFloat((functions.sinh(x) / functions.cosh(x)).toFixed(15));
  },
  exp: Math.exp,
  pow2: function(x) {
    return Math.pow(2, x);
  },
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
  asin: invTrig(Math.asin),
  acos: invTrig(Math.acos),
  atan: invTrig(Math.atan),
  asinh: function(x) {
    return Math.log(x + Math.sqrt(x * x + 1));
  },
  acosh: function(x) {
    return Math.log(x + Math.sqrt(x * x - 1));
  },
  atanh: function(x) {
    return parseFloat((Math.log((1 + x) / (1 - x)) / 2).toFixed(15));
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
    if (digits >= display.maxDigits() || /e/.test(display.text())) return;
    this.added();
    return this.val(this.content === '0' && (str === '0' || !/\./.test(str)) ? str : this.content + str);
  },
  toggleSign: function() {
    return this.val(this.content[0] === '-' ? this.content.slice(1) : '-' + this.content);
  },
  changed: function() {
    display.bywhom = this;
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
    display.bywhom = this;
    return display.update(this.content);
  },
  toggleSign: function() {
    return this.val(-this.val());
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
  if (display.bywhom === textBuffer) {
    return textBuffer.toggleSign();
  } else {
    return display.update(-display.val());
  }
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
  display.bywhom = 'nofix';
  display.update(functions[$(this).data('role')]().toString());
  return textBuffer.clear();
});

$('.unary').bind(touchEnd, function() {
  latestUnary = functions[$(this).data('role')];
  display.bywhom = 'unary';
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
    display.bywhom = 'equal_key';
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

$(window).bind('orientationchange', function() {
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
  bywhom: null,
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
    var $view, decimalStr, expStr, exponential, formatted, fracStr, intStr, tmp, _ref, _ref2, _ref3;
    if (numStr != null) {
      this.content = numStr;
    } else {
      numStr = this.content;
    }
    $view = $('#view');
    formatted = this.content.toString();
    if (/[0-9]/.test(formatted)) {
      if (/e/.test(formatted)) {
        _ref = formatted.split('e'), fracStr = _ref[0], expStr = _ref[1];
        if (fracStr.replace('.', '').length > display.maxSignificants()) {
          formatted = parseFloat(formatted).toExponential(display.maxSignificants());
        }
      } else {
        _ref2 = formatted.split('.'), intStr = _ref2[0], decimalStr = _ref2[1];
        if (formatted[0] === '-') intStr = intStr.slice(1);
        if (intStr.length + (decimalStr != null ? decimalStr : '').length <= this.maxDigits()) {
          tmp = reverse((split(3, reverse(intStr))).join(','));
          if (decimalStr != null) tmp += '.' + decimalStr;
          formatted = (formatted[0] === '-' ? '-' : '') + tmp;
        } else if (parseFloat(formatted) === 0) {
          tmp = intStr;
          if (decimalStr != null) {
            tmp += '.' + decimalStr.slice(0, this.maxDigits() - 1);
          }
          formatted = (formatted[0] === '-' ? '-' : '') + tmp;
        } else {
          exponential = parseFloat(formatted).toExponential();
          _ref3 = exponential.split('e'), fracStr = _ref3[0], expStr = _ref3[1];
          if (fracStr.replace(/[\-\.]/, '').length >= display.maxDigits()) {
            tmp = intStr;
            if (decimalStr != null) {
              tmp += '.' + decimalStr.slice(0, this.maxDigits() - 1);
            }
            formatted = (formatted[0] === '-' ? '-' : '') + tmp;
          } else {
            formatted = exponential;
          }
        }
      }
    }
    $view.css('visibility', 'hidden');
    $view.text(formatted);
    $view.css('font-size', display.fontSize());
    while (!($view[0].offsetWidth <= display.width())) {
      $view.css('font-size', parseInt($view.css('font-size')) - 1 + 'px');
    }
    return $view.css('visibility', '');
  }
};
