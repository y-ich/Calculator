# model

textBuffer = 
  content : '0'
  val : (str) ->
    if str?
      @content = str
      $('#view').text(@content) # should use observer pattern.
      str
    else
      if @content is ''
        '0'
      else
        @content
  add : (str) -> @val @content + str
  toggleSign : ->
    @val if @content[0] is '-'
        @content.slice 1
      else
        '-' + @content


# controller

$('.key').each ->
  $this = $(this)
  $this.attr('data-role', $this.text()) unless $(this).attr('data-role')?


$('.key.number').on 'click', ->
  if textBuffer.val() is '0'
    textBuffer.val $(this).attr('data-role')
  else
    textBuffer.add $(this).attr('data-role')


$('#period').on 'click', ->
  unless /\./.test textBuffer.val()
    textBuffer.add $(this).attr('data-role')


$('#plusminus').on 'click', -> textBuffer.toggleSign()


###
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
###

# parser


