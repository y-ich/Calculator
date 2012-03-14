(function() {
  var activate, deactivate, mr, textBuffer;

  textBuffer = {
    content: '0',
    val: function(str) {
      if (str != null) {
        if (/\..*\./.test(str)) {
          return null;
        } else {
          this.content = str;
          $('#view').text(this.content);
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

}).call(this);
