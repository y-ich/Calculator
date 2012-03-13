# model

textBuffer = 
  content : '0'
  val : (str) ->
    if str?
      if /\..*\./.test str
        null
      else
        @content = str
        $('#view').text(@content) # should use observer pattern.
        @content
    else
      if @content is ''
        @content = '0'
      else
        @content

  add : (str) ->
    @val if @content is '0' and not /\./.test str
        str
      else
        @content + str

  toggleSign : ->
    @val if @content[0] is '-'
        @content.slice 1
      else
        '-' + @content


# controller

$('.key').each ->
  $this = $(this)
  $this.attr('data-role', $this.text()) unless $(this).attr('data-role')?


$('.key.number').on 'click', -> textBuffer.add $(this).attr('data-role').toString()


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


