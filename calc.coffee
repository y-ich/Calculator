# functions

fn = 
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
  sin : (x) -> Math.sin(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  cos : (x) -> Math.cos(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  tan : (x) -> Math.tan(x * if angleUnit is 'Deg' then 2*Math.PI/360 else 1)
  sinh : (x) -> (Math.exp(x) - Math.exp(-x)) / 2
  cosh : (x) -> (Math.exp(x) + Math.exp(-x)) / 2
  tanh : (x) -> fn.sinh(x) / fn.cosh(x)
  exp : Math.exp
  enotation : (x, y) -> x * Math.pow(10, y)
  add : (x, y) -> x + y
  sub : (x, y) -> x - y
  mul : (x, y) -> x * y
  div : (x, y) -> x / y

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
    @val if @content is '0' and not /\./.test str
        str
      else
        @content + str

  toggleSign : ->
    @val if @content[0] is '-'
        @content.slice 1
      else
        '-' + @content

  changed : ->　updateView(@content)

  clear : -> @content = '0'


stack = []
expression = []
priority =
  '=' : 0
  '(' : 0
  ')' : 0
  'add' : 1
  'sub' : 1
  'mul' : 2
  'div' : 2

lastUnary = null

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
        lastEval = fn[stack.pop()](stack.pop(), operand1)
        updateView(lastEval)
    when '='
      lastUnary = null
      loop 
        op = stack.pop()
        return if not op?
        unless op is '('
          lastEval = fn[op](stack.pop(), operand1)
          unless lastUnary?
            lastUnary = ((operator, operand2) -> (x) -> fn[operator](x, operand2))(op, operand1) # currying
            updateView(lastEval)
    else
      if stack.length isnt 0 and (priority[operator] ? 3) <= (priority[stack[stack.length - 1]] ? 3)
        lastEval = fn[stack.pop()](stack.pop(), operand1)
        updateView(lastEval)
        stack.push(lastEval, operator)
      else
        stack.push(operand1, operator)


# controller

$('.key').each ->
  $this = $(this)
  $this.data('role', $this.text()) unless $(this).data('role')?


$('#clear').on 'click', ->
  textBuffer.clear()
  expression = []
  entrance = []
  $('#view').text('0')


$('.key.number').on 'click', -> textBuffer.add $(this).data('role').toString()


$('#period').on 'click', ->
  unless /\./.test textBuffer.val()
    textBuffer.add $(this).data('role')


$('#plusminus').on 'click', -> textBuffer.toggleSign()

$('#mc').on 'click', ->
  memory = 0
  deactivate $('#mr')

$('#mplus').on 'click', ->
  textBuffer.clear()
  memory += parseFloat textBuffer.val()
  activate $('#mr')

$('#mminus').on 'click', ->
  textBuffer.clear()
  memory -= parseFloat textBuffer.val()
  activate $('#mr')


$('.nofix').on 'click', ->
  updateView fn[$(this).data('role')]().toString()
  textBuffer.clear()

$('.unary').on 'click', ->
  lastUnary = fn[$(this).data('role')]
  updateView lastUnary(parseFloat $('#view').text().replace(',', '')).toString()
  textBuffer.clear()

$('.binary, #parright').on 'click', ->
  parseEval $(this).data('role'), parseFloat $('#view').text().replace(',', '')
  textBuffer.clear()

$('#parleft').on 'click', ->
  parseEval $(this).data('role')
  textBuffer.clear()

$('#equal_key').on 'click', ->
  if stack.length isnt 0
    parseEval $(this).data('role'), parseFloat $('#view').text().replace(',', '')
    textBuffer.clear()
  else if lastUnary? 
    updateView lastUnary(parseFloat $('#view').text().replace(',', '')).toString()

$('#angle_key').on 'click', ->
  $this = $(this)
  if angleUnit is 'Deg'
    angleUnit = 'Rad'
    $this.html $this.html().replace('Rad', 'Deg')
  else
    angleUnit = 'Deg'
    $this.html $this.html().replace('Deg', 'Rad')
  $('#angle').text(angleUnit)

# view
#

activate = ($elem) ->
  active = $elem.children('.active')
  if not active? or active.length == 0 # jqMobi returns undefined when no children.
    $elem.append $('<div class="active">')

deactivate = ($elem) ->
  $elem.children('.active').remove()


updateView = (numStr) ->
  numStr = numStr.toString() if typeof numStr is 'number'
  [intStr, decimalStr] = numStr.split('.')
  intStr = intStr.slice(1) if numStr[0] == '-'
  result = reverse (split 3, reverse intStr).join(',')
  result += '.' + decimalStr if decimalStr?
  $('#view').text if numStr[0] == '-'
      '-' + result
    else
      result



#
# utilities
#

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
