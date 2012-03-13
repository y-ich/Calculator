var textBuffer;

textBuffer = {
  content: '0',
  val: function(str) {
    if (str != null) {
      this.content = str;
      $('#view').text(this.content);
      return str;
    } else {
      if (this.content === '') {
        return '0';
      } else {
        return this.content;
      }
    }
  },
  add: function(str) {
    return this.val(this.content + str);
  },
  toggleSign: function() {
    return this.val(this.content[0] === '-' ? this.content.slice(1) : '-' + this.content);
  }
};

$('.key').each(function() {
  var $this;
  $this = $(this);
  if ($(this).attr('data-role') == null) {
    return $this.attr('data-role', $this.text());
  }
});

$('.key.number').on('click', function() {
  if (textBuffer.val() === '0') {
    return textBuffer.val($(this).attr('data-role'));
  } else {
    return textBuffer.add($(this).attr('data-role'));
  }
});

$('#period').on('click', function() {
  if (!/\./.test(textBuffer.val())) {
    return textBuffer.add($(this).attr('data-role'));
  }
});

$('#plusminus').on('click', function() {
  return textBuffer.toggleSign();
});

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
