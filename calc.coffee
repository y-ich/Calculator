#
# for debugging
#
triggerEvent = 'click'

# functions

functions = 
  mr : -> memory
  pi : Math.PI
  random : Math.random
  percent2number : (n) -> n / 100
  inverse : (n) -> 1 / n
  square : (n) -> Math.pow(n, 2)
  cube : (n) -> Math.pow(n, 3)
  power : Math.pow
  factorial : (n) -> gamma(n + 1)
  root : (n) -> Math.pow(n, 0.5)
  xthroot : (x, y) -> Math.pow(x, 1/y)
  log : (n) -> Math.log(n)
  log10 : (n) -> Math.log(n)/Math.log(10)
  log2 : (n) -> Math.log(n)/Math.log(2)
  sin : (x) -> Math.sin(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  cos : (x) -> Math.cos(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  tan : (x) -> Math.tan(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  sinh : (x) -> (Math.exp(x) - Math.exp(-x)) / 2
  cosh : (x) -> (Math.exp(x) + Math.exp(-x)) / 2
  tanh : (x) -> functions.sinh(x) / functions.cosh(x)
  exp : Math.exp
  enotation : (x, y) -> x * Math.pow(10, y)
  add : (x, y) -> x + y
  sub : (x, y) -> x - y
  mul : (x, y) -> x * y
  div : (x, y) -> x / y
  asin : (x) -> Math.asin(x) / if angleUnit is 'Deg' then 2*Math.PI/360 else 1
  acos : (x) -> Math.scos(x) / if angleUnit is 'Deg' then 2*Math.PI/360 else 1
  atan : (x) -> Math.stan(x) / if angleUnit is 'Deg' then 2*Math.PI/360 else 1
  asinh : (x) -> Math.log(x + Math.sqrt(x * x + 1))
  acosh : (x) -> Math.log(x + Math.sqrt(x * x - 1))
  atanh : (x) -> Math.log((1 + x) / (1 - x)) / 2

# model
memory = 0
angleUnit = 'Deg'

textBuffer = 
  content : '0'
  val : (str) ->
    if str?
      if str is '' or /\..*\./.test str
        null
      else
        @content = str
        @changed()
        @content
    else
        @content

  add : (str) ->
    digits = @val().replace(/[\-,\.]/g, '').length
    if (@content is '0' and str is '0') or digits >= display.maxDigits()
      return 

    @val if @content is '0' and not /\./.test str
        str
      else
        @content + str
    @added()

  toggleSign : ->
    @val if @content[0] is '-'
        @content.slice 1
      else
        '-' + @content

  changed : -> display.update(@content)

  clear : -> @content = '0'

  added : -> ac2c()


latestEval =
  content  : 0
  val : (num) ->
    if num?
      @content = num
      @changed()
      @content
    else
      @content
  changed : -> display.update(@content) 


stack = []

priority =
  '=' : 0
  '(' : 0
  ')' : 0
  'add' : 1
  'sub' : 1
  'mul' : 2
  'div' : 2

latestUnary = null

clearStack = ->
  stack = []

parseEval = (operator, operand1) ->
  switch operator
    when '('
      stack.push('(')
    when ')'
      loop 
        op = stack.pop()
        return if not op? or op is '('
        latestEval.val functions[stack.pop()](stack.pop(), operand1)
    when '='
      latestUnary = null
      loop
        op = stack.pop()
        return if not op?
        unless op is '('
          latestEval.val functions[op](stack.pop(), operand1)
          unless latestUnary?
            latestUnary = ((operator, operand2) -> (x) -> functions[operator](x, operand2))(op, operand1) # currying
    else
      if stack.length isnt 0 and (priority[operator] ? 3) <= (priority[stack[stack.length - 1]] ? 3)
        latestEval.val functions[stack.pop()](stack.pop(), operand1)
        stack.push(latestEval.val(), operator)
      else
        stack.push(operand1, operator)


# controller

# prevent page scroll
# $(document.body).bind 'touchmove', (event) ->
#   event.preventDefault()

triggerEvent = triggerEvent ? 'touchend'


$('.key').each ->
  $this = $(this)
  $this.data('role', $this.text()) unless $(this).data('role')?


$('#clear').bind triggerEvent, (event) ->
  if $(this).data('role') is 'allclear'
    latestUnary = null
    stack = []
  else
    activate $(".binary[data-role=\"#{stack[stack.length - 1]}\"]")

  textBuffer.clear()
  latestEval.val 0
  c2ac()


$('.number').bind triggerEvent, ->
  textBuffer.add $(this).data('role').toString()


$('.number, #pi').bind triggerEvent, ->
  deactivate($('.binary'))


$('#period').bind triggerEvent, ->
  unless /\./.test textBuffer.val()
    textBuffer.add $(this).data('role')


$('#plusminus').bind triggerEvent, ->
  textBuffer.toggleSign()


$('#mc').bind triggerEvent, ->
  memory = 0
  deactivate $('#mr')


$('#mplus').bind triggerEvent, ->
  textBuffer.clear()
  memory += display.val()
  activate $('#mr')


$('#mminus').bind triggerEvent, ->
  textBuffer.clear()
  memory -= display.val()
  activate $('#mr')


$('.nofix').bind triggerEvent, ->
  display.update functions[$(this).data('role')]().toString()
  textBuffer.clear()


$('.unary').bind triggerEvent, ->
  latestUnary = functions[$(this).data('role')]
  display.update latestUnary(display.val()).toString()
  textBuffer.clear()


$('.binary').bind triggerEvent, ->
  deactivate $('.binary')
  activate $(this)


$('.binary, #parright').bind triggerEvent, ->
  parseEval $(this).data('role'), display.val()
  textBuffer.clear()


$('#parleft').bind triggerEvent, ->
  parseEval $(this).data('role')
  textBuffer.clear()


$('#equal_key').bind triggerEvent, ->
  if stack.length isnt 0
    parseEval $(this).data('role'), display.val()
    textBuffer.clear()
  else if latestUnary? 
    display.update latestUnary(display.val()).toString()


$('#angle_key').bind triggerEvent, ->
  $this = $(this)
  if angleUnit is 'Deg'
    angleUnit = 'Rad'
    $this.html $this.html().replace('Rad', 'Deg')
  else
    angleUnit = 'Deg'
    $this.html $this.html().replace('Deg', 'Rad')
  $('#angle').text(angleUnit)


$('#2nd').bind triggerEvent, ->
  if $(this).data('status') is 'off'
    $(this).data 'status', 'on'
    $(this).css 'color', '#de8235'
    $('.key.double').each ->
      $this = $(this)
      switch $this.data('role')
        when 'log'
          $this.data 'role', 'log2'
          $this.html $this.html().replace('ln', 'log<sub>2</sub>')
        when 'exp'
          $this.data 'role', 'pow2'
          $this.html $this.html().replace('e', '2')
        else
          fnname = $this.data('role')
          $this.data 'role', 'a' + fnname
          $this.html $this.html().replace(fnname, fnname + '<sup>-1</sup>')
  else
    $(this).data 'status', 'off'
    $(this).css 'color', ''
    $('.key.double').each ->
      $this = $(this)
      switch $this.data('role')
        when 'log2'
          $this.data 'role', 'log'
          $this.html $this.html().replace('log<sub>2</sub>', 'ln')
        when 'pow2'
          $this.data 'role', 'exp'
          $this.html $this.html().replace('2', 'e')
        else
          fnname = $this.data('role')
          $this.data 'role', fnname.slice(1) # remove 'a' at head
          $this.html $this.html().replace('<sup>-1</sup>', '')

#
# view
#

$('.key').bind 'touchstart', ->
  $(this).addClass 'pushed'


$('.key').bind triggerEvent, ->
  $(this).removeClass 'pushed'


$('.key').bind 'touchcancel', ->
  $(this).removeClass 'pushed'


$('window').bind 'orientationchange', ->


ac2c = ->
  $('#clear').data 'role', 'clear'
  $('#clear').html $('#clear').html().replace('AC', 'C')


c2ac = ->
  $('#clear').data 'role', 'allclear'
  $('#clear').html $('#clear').html().replace('>C', '>AC')


activate = ($elem) ->
  active = $elem.children('.active')
  if not active? or active.length == 0 # jqMobi returns undefined when no children.
    $elem.append $('<div class="active">')


deactivate = ($elem) ->
  $elem.children('.active').remove()


display =
  width : ->
    if innerWidth <= 320
      if isPortrait()
        280
      else
        406
    else
      if isPortrait()
        671
      else
        875
  fontSize : ->
    if innerWidth <= 320
      if isPortrait()
        '78px'
      else
        '50px'
    else
      if isPortrait()
        '182px'
      else
        '108px'
  val : -> parseFloat $('#view').text().replace(',', '')

  maxDigits : -> if isPortrait() then 9 else 16

  update : (numStr) ->
    $view = $('#view')
    numStr = numStr.toString() if typeof numStr is 'number'
    [intStr, decimalStr] = numStr.split('.')
    intStr = intStr.slice(1) if numStr[0] == '-'
    result = reverse (split 3, reverse intStr).join(',')
    result += '.' + decimalStr if decimalStr?
    $view.text if numStr[0] == '-'
        '-' + result
      else
        result
    $view.css 'visibility', 'hidden'
    $view.css 'font-size', display.fontSize()
    until $view[0].offsetWidth <= display.width()
      $view.css 'font-size', parseInt($view.css('font-size')) - 1 + 'px'
    $view.css 'visibility', ''


#
# utilities
#

isPortrait = -> (orientation ? 90) % 180 == 0




reverse = (str) ->
  result = ''
  result += str.charAt(str.length - i) for i in [1..str.length]
  result


split = (n, str) ->
  result = []
  result.push(str.slice(i, i + n)) for i in [0...str.length] by n
  result


# http://www.biwako.shiga-u.ac.jp/sensei/mnaka/ut/funccalc.html
loggamma = (x) ->
  log2pi = Math.log(2 * Math.PI)
  N = 8
  B0 = 1.0
  B1 = (-1.0 / 2.0)
  B2 = ( 1.0 / 6.0)
  B4 = (-1.0 / 30.0)
  B6 = ( 1.0 / 42.0)
  B8 = (-1.0 / 30.0)
  B10 = ( 5.0 / 66.0)
  B12 = (-691.0 / 2730.0)
  B14 = ( 7.0 / 6.0)
  B16 = (-3617.0 / 510.0)
  v = 1.0
  while x < N
    v *= x
    x++
  w = 1 / (x * x)
  tmp = B16 / (16 * 15)
  tmp = tmp * w + B14 / (14 * 13)
  tmp = tmp * w + B12 / (12 * 11)
  tmp = tmp * w + B10 / (10 * 9)
  tmp = tmp * w + B8 / (8 * 7)
  tmp = tmp * w + B6 / (6 * 5)
  tmp = tmp * w + B4 / (4 * 3)
  tmp = tmp * w + B2 / (2 * 1)
  tmp = tmp / x + 0.5 * log2pi - Math.log(v) - x + (x - 0.5) * Math.log(x)
  tmp


gamma = (x) -> Math.exp loggamma x
