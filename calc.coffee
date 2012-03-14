# model

textBuffer = 
  content : '0'
  val : (str) ->
    if str?
      if /\..*\./.test str
        null
      else
        @content = str
        @update()
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

  update : -> # should use observer pattern.
    [intStr, decimalStr] = @content.split('.')
    initial = intStr.length % 3
    initial = 3 if initial == 0
    a = []
    head = 0
    tail = initial
    while tail <= intStr.length
      a.push intStr.slice(head, tail)
      head = tail
      tail += 3
    result = a.join(',')
    result += '.' + decimalStr if decimalStr?
    $('#view').text(result)

mr = 0


# controller

$('.key').each ->
  $this = $(this)
  $this.attr('data-role', $this.text()) unless $(this).attr('data-role')?


$('.key.number').on 'click', -> textBuffer.add $(this).attr('data-role').toString()


$('#period').on 'click', ->
  unless /\./.test textBuffer.val()
    textBuffer.add $(this).attr('data-role')


$('#plusminus').on 'click', -> textBuffer.toggleSign()


$('#mc').on 'click', ->
  mr = 0
  deactivate $('#mr')

$('#mplus').on 'click', ->
  mr += parseFloat textBuffer.val()
  activate $('#mr')

$('#mminus').on 'click', ->
  mr -= parseFloat textBuffer.val()
  activate $('#mr')

activate = ($elem) ->
  active = $elem.children('.active')
  if not active? or active.length == 0 # jqMobi returns undefined when no children.
    console.log 'pass'
    $elem.append $('<div class="active">')

deactivate = ($elem) ->
  $elem.children('.active').remove()

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


