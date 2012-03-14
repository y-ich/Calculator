var activate, deactivate, mr, reverse, split, textBuffer, updateView;

textBuffer = {
  content: '0',
  val: function(str) {
    if (str != null) {
      if (/\..*\./.test(str)) {
        return null;
      } else {
        this.content = str;
        this.changed();
        return this.content;
      }
    } else {
      if (this.content === '') {
        return this.content = '0';
      } else {
        return this.content;
      }
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
  }
};

mr = 0;

$('.key').each(function() {
  var $this;
  $this = $(this);
  if ($(this).attr('data-role') == null) {
    return $this.attr('data-role', $this.text());
  }
});

$('.key.number').on('click', function() {
  return textBuffer.add($(this).attr('data-role').toString());
});

$('#period').on('click', function() {
  if (!/\./.test(textBuffer.val())) {
    return textBuffer.add($(this).attr('data-role'));
  }
});

$('#plusminus').on('click', function() {
  return textBuffer.toggleSign();
});

$('#mc').on('click', function() {
  mr = 0;
  return deactivate($('#mr'));
});

$('#mplus').on('click', function() {
  mr += parseFloat(textBuffer.val());
  return activate($('#mr'));
});

$('#mminus').on('click', function() {
  mr -= parseFloat(textBuffer.val());
  return activate($('#mr'));
});

activate = function($elem) {
  var active;
  active = $elem.children('.active');
  if (!(active != null) || active.length === 0) {
    console.log('pass');
    return $elem.append($('<div class="active">'));
  }
};

deactivate = function($elem) {
  return $elem.children('.active').remove();
};

updateView = function(numStr) {
  var decimalStr, intStr, result, _ref;
  _ref = numStr.split('.'), intStr = _ref[0], decimalStr = _ref[1];
  if (numStr[0] === '-') intStr = intStr.slice(1);
  result = reverse((split(3, reverse(intStr))).join(','));
  if (decimalStr != null) result += '.' + decimalStr;
  return $('#view').text(numStr[0] === '-' ? '-' + result : result);
};

/*
percent2number

inverse

square

cube

exp binary

factorial

root

xthroot binary

log10

enotation binary
*/

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
