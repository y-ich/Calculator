###
# Calculator: Calculator clone for iPad by HTML5
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###

#
# structure
#

# number -> textBuffer -+
#                     latestEval -+-> display -> operand1(binary) -> latestEval
#                                                         ||
#                                                     unary

# events for devices
try
    document.createEvent 'TouchEvent'
    # no exception means touch device
    touchStart = 'touchstart'
    touchEnd = 'touchend'
catch error # non-touch device
    touchStart = 'mousedown'
    touchEnd = 'mouseup'


# key sound
if (AudioContext? or webkitAudioContext?) and not (/\((iPhone|iPad);.*OS (6|7)/.test(navigator.userAgent) and window.navigator.standalone) # iOS 6/7 has fatal bug when using Web Audio API on web clip
    keySound =
        _context: new (AudioContext ? webkitAudioContext)()
        play: if AudioContext?
                ->
                    return unless keySound._buffer?
                    source = keySound._context.createBufferSource()
                    source.buffer = keySound._buffer
                    source.connect keySound._context.destination
                    source.start 0
            else
                ->
                    return unless keySound._buffer?
                    source = keySound._context.createBufferSource()
                    source.start ?= source.noteOn
                    source.buffer = keySound._buffer
                    source.connect keySound._context.destination
                    source.start 0

    keySound._context.decodeAudioData Base64Binary.decodeArrayBuffer("""
                    UklGRiQCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQACAAAAAAAA
                    AAD//wIA/f8FAPr/BQB8ASr/yP6Y/uD+YQO0BVsI6gb1AJ355e+Y6fTojfAa+x8J
                    vBZlHuchSBsbDVz2iN4tzmLKANh28SANsiY2N1w6FC1tERrxftMYwO+9acrB6KcP
                    mTWXTQRTyz4AFpLnu7rHpZCoAMaC9fosnVqibVtkWjymAw7O1ae7nsG0neDrGLlL
                    qGvwZzhC6QHewuiTL4GkkeO8dvbWMTFbDmq/Xkg6Bwem2Ji4WbNAwi3hpAkfMZBK
                    ZU/6PGIYz+0RyNmuY6uYvqTe2QOIKvRDx0tiQskkkALQ4f7I68KzzgrsYQ+yKf45
                    njgDKZYMp+iQyeC1gri1y27s+RHtMFdC5kXsOeohPQi97bnbotRj1grjnPVTCGsW
                    2BluF7cOjgNc9ojqLuSn5RjwC/8xDJwXjxthGTwT/gmn//b4ovap9wD6YPpc+T75
                    ufl6+lD4Af2YBAoRwxt/HfoWgQgP+DXpGuG24TXrG/oqDLgdCSaMIT8RgftY50fe
                    pNva4pbxMgSBFiokyyaNHk0Qiv/H8pzp+uZF6jj1iQJsDhYVRhVWEYcL5wWH/+L4
                    MPSt9CX5Kv/wAxwHlAZ0CScLrwfIAf3/BwD4/wcA+/8AAAMA/f8EAPv/BAD9/wIA
                    AQD9/wMA/f8CAAAA//8BAP////8EAPn/BwD7/w==
                    """)
            , ((buffer) -> keySound._buffer = buffer)
            , -> console.error 'decodeAudioData'
else
    keySound =
      source : new Audio 'sounds/click.wav'
      play : ->
        # At the first click, play sound to start load sound on iOS. Real sound is after 1sec.
        @source.play()
        @timer = setTimeout (=> @source.pause()), 1300
        # change to function to play sound instantly.
        @play = -> setTimeout (-> keySound.aux()), 0
      aux : ->
        clearTimeout @timer
        try # exception for setting currentTime.
          if @source.readyState >= @source.HAVE_METADATA
              @source.currentTime = 0.99
          if @source.readyState >= @source.HAVE_FUTURE_DATA
              @source.play()
              @timer = setTimeout (=> @source.pause()), 300 # you need more than 300ms
        catch e
          console.log e.message

#
# utilities
#

isPortrait = -> innerWidth + 88 <= innerHeight # 88 is a magic number of safari.


reverse = (str) -> str.split('').reverse().join('')


split = (n, str) -> str.slice i, i + n for i in [0...str.length] by n


# http://www.biwako.shiga-u.ac.jp/sensei/mnaka/ut/funccalc.html
loggamma = (x) ->
    B = [
        1
        -1 / 2
        1 / 6
        0
        -1 / 30
        0
        1 / 42
        0
        -1 / 30
        0
        5 / 66
        0
        -691 / 2730
        0
        7 / 6
        0
        -3617 / 510
        0
        43867 / 798
        0
        -174611 / 330
    ]
    N = 10

    v = 1.0
    y = x
    while y < N
        v *= y
        y++

    sigma = -Math.log(v) + (y - 0.5)*Math.log(y) - y + 0.5*Math.log(2*Math.PI)
    sigma += B[i] / (i*(i - 1)*Math.pow(y, i - 1)) for i in [2..N] by 2
    sigma

gamma = (x) ->
    result = Math.exp loggamma x
    if Math.floor(x) is x then Math.floor result else result

trigonometric = (fn) ->
    (x) -> parseFloat fn(x * if angleUnit is 'Deg' then 2*Math.PI / 360 else 1).toFixed(15)
    # rounded in order to sin(90deg) = 0

invTrig = (fn) ->
    (x) -> fn(x) / if angleUnit is 'Deg' then 2*Math.PI / 360 else 1

tangent = (x) ->
    result = Math.tan(x)
    if Math.abs(result) < 1.5e+16 then result else NaN


# calculator functions

functions =
    mr : -> memory
    pi : -> Math.PI
    e : -> Math.E
    random : Math.random
    percent2number : (x) -> x / 100
    inverse : (x) -> 1 / x
    square : (x) -> Math.pow(x, 2)
    cube : (x) -> Math.pow(x, 3)
    power : Math.pow
    factorial : (x) -> gamma(x + 1)
    root : (x) -> Math.pow(x, 0.5)
    cuberoot : (x) -> Math.pow(x, 1 / 3)
    xthroot : (x, y) -> Math.pow(x, 1 / y)
    log : (x) -> Math.log(x)
    log10 : (x) -> Math.log(x) / Math.log(10)
    log2 : (x) -> Math.log(x) / Math.log(2)
    sin : trigonometric Math.sin
    cos : trigonometric Math.cos
    tan : trigonometric tangent
    sinh : (x) -> (Math.exp(x) - Math.exp(-x)) / 2
    cosh : (x) -> (Math.exp(x) + Math.exp(-x)) / 2
    tanh : (x) -> parseFloat (functions.sinh(x) / functions.cosh(x)).toFixed(15)
    exp : Math.exp
    pow2 : (x) -> Math.pow(2, x)
    pow10 : (x) -> Math.pow(10, x)
    enotation : (x, y) -> x*Math.pow(10, y)
    add : (x, y) -> x + y
    sub : (x, y) -> x - y
    mul : (x, y) -> x * y
    div : (x, y) -> x / y
    asin : invTrig Math.asin
    acos : invTrig Math.acos
    atan : invTrig Math.atan
    asinh : (x) -> Math.log(x + Math.sqrt(x*x + 1))
    acosh : (x) -> Math.log(x + Math.sqrt(x*x - 1))
    atanh : (x) -> parseFloat (Math.log((1 + x) / (1 - x)) / 2).toFixed(15)

#
# models
#

memory = 0
# for mc/m+/m-/mr

angleUnit = 'Deg'

textBuffer =
    content : '0' # accessor is val(). Don't access directly.

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
        if digits >= display.maxDigits() or /e/.test display.text()
            return

        @added()
        @val if @content is '0' and (str is '0' or not /\./.test str)
                str
            else
                @content + str

    toggleSign : ->
        @val if @content[0] is '-'
                @content.slice 1
            else
                '-' + @content

    changed : ->
        display.bywhom = this
        display.update(@content)
        saveStatus()
        return

    clear : -> @content = '0'

    added : -> ac2c()


latestEval =
    content    : 0

    val : (num) ->
        if num?
            @content = num
            @changed()
            @content
        else
            @content

    changed : ->
        display.bywhom = this
        display.update(@content)
        saveStatus()
        return

    toggleSign : ->
        @val -@val()


display =
    content : '0'
    bywhom : null

    width : ->
        if innerWidth < 768
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
        if innerWidth < 768
            if isPortrait()
                '78px'
            else
                '50px'
        else
            if isPortrait()
                '182px'
            else
                '108px'

    val : -> parseFloat @content

    text : -> $('#view').text()

    maxDigits : -> if isPortrait() then 9 else 16

    maxSignificants : -> if isPortrait() then 8 else 14

    update : (numStr) ->
        if numStr?
            @content = numStr
            saveStatus()
        else
            numStr = @content

        $view = $('#view')
        formatted = @content.toString() # if typeof numStr is 'number'

        if /[0-9]/.test formatted # if a number, not a error
            if /e/.test formatted # scientific
                [fracStr, expStr] = formatted.split('e')
                if fracStr.replace('.', '').length > display.maxSignificants()
                    formatted = parseFloat(formatted).toExponential(display.maxSignificants())
            else
                [intStr, decimalStr] = formatted.split('.')
                intStr = intStr.slice(1) if formatted[0] == '-'

                if intStr.length + (decimalStr ? '').length <= @maxDigits()
                    tmp = reverse (split 3, reverse intStr).join(',')
                    tmp += '.' + decimalStr if decimalStr?
                    formatted = (if formatted[0] == '-' then '-' else '') + tmp
                else if parseFloat(formatted) is 0
                    tmp = intStr # intStr must be '0'.
                    tmp += '.' + decimalStr.slice(0, @maxDigits() - 1) if decimalStr?
                    formatted = (if formatted[0] == '-' then '-' else '') + tmp
                else
                    exponential = parseFloat(formatted).toExponential()
                    [fracStr, expStr] = exponential.split('e')
                    if fracStr.replace(/[\-\.]/, '').length >= display.maxDigits()
                        tmp = intStr
                        tmp += '.' + decimalStr.slice(0, @maxDigits() - 1) if decimalStr?
                        formatted = (if formatted[0] == '-' then '-' else '') + tmp
                    else
                        formatted = exponential

        $view.css 'visibility', 'hidden'
        $view.text formatted
        $view.css 'font-size', display.fontSize()
        until $view[0].offsetWidth <= display.width()
            $view.css 'font-size', parseInt($view.css('font-size')) - 1 + 'px'
        $view.css 'visibility', ''


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
    saveStatus()

parseEval = (operator, operand1) ->
    switch operator
        when '('
            stack.push('(')
        when ')'
            latestEval.val(operand1)
            loop
                op = stack.pop()
                return if not op? or op is '('
                latestEval.val functions[op](stack.pop(), latestEval.val())
        when '='
            latestUnary = null
            latestEval.val(operand1)
            loop
                op = stack.pop()
                return if not op?
                unless op is '('
                    latestEval.val functions[op](stack.pop(), latestEval.val())
                    unless latestUnary?
                        latestUnary = ((operator, operand2) -> (x) -> functions[operator](x, operand2))(op, operand1) # currying
        else
            if stack.length isnt 0 and (priority[operator] ? 3) <= (priority[stack[stack.length - 1]] ? 3)
                latestEval.val functions[stack.pop()](stack.pop(), operand1)
                stack.push(latestEval.val(), operator)
            else
                stack.push(operand1, operator)
    saveStatus()
    return

CALCULATOR_STATUS = 'calculator-status'
saveStatus = ->
    localStorage[CALCULATOR_STATUS] = JSON.stringify
        memory: memory
        textBuffer: textBuffer.val()
        latestEval: latestEval.val()
        display: display.content
        stack: stack
        angleUnit: angleUnit
        clear: $('#clear').data 'role'
        mr: $('#mr .active').length > 0
    return

restoreStatus = ->
    if localStorage[CALCULATOR_STATUS]?
        status = JSON.parse localStorage[CALCULATOR_STATUS]
        if status.memory?
            memory = status.memory
        if status.textBuffer?
            textBuffer.content = status.textBuffer
        if status.latestEval?
            latestEval.content = status.latestEval
        if status.display?
            display.content = status.display
            display.update()
        if status.stack?
            stack = status.stack
            if stack.length > 0
                activate $(".binary[data-role=\"#{stack[stack.length - 1]}\"]")
        if status.angleUnit?
            angleUnit = status.angleUnit
        $angleKey = $('#angle_key')
        if angleUnit is 'Rad'
            $angleKey.html $angleKey.html().replace('Rad', 'Deg')
        else
            $angleKey.html $angleKey.html().replace('Deg', 'Rad')
        $('#angle').text(angleUnit)
        if status.mr
            activate $('#mr')
        switch status.clear
            when 'clear'
                ac2c()
            when 'allclear'
                c2ac()
        # ac2cやc2acはsaveStatusを呼ぶのでここでコールするのは筋が悪い。エンバグしないためには最後にコールすること
    return


# controller

# prevent page scroll
$(document.body).bind 'touchmove', (event) ->
    event.preventDefault()

$('.key').each ->
    $this = $(this)
    $this.data('role', $this.text()) unless $(this).data('role')?


$('#clear').bind touchEnd, (event) ->
    if $(this).data('role') is 'allclear'
        latestUnary = null
        clearStack()
        deactivate $('.binary')
    else
        activate $(".binary[data-role=\"#{stack[stack.length - 1]}\"]")

    textBuffer.clear()
    latestEval.val 0
    c2ac()


$('#pi').bind touchEnd, -> ac2c()

$('.number').bind touchEnd, ->
    textBuffer.add $(this).data('role').toString()


$('.number, #pi').bind touchEnd, ->
    deactivate($('.binary'))


$('#period').bind touchEnd, ->
    unless /\./.test textBuffer.val()
        textBuffer.add $(this).data('role')


$('#plusminus').bind touchEnd, ->
    if display.bywhom is textBuffer
        textBuffer.toggleSign()
    else
        display.update(-display.val())

$('#mc').bind touchEnd, ->
    memory = 0
    deactivate $('#mr')
    saveStatus()


$('#mplus').bind touchEnd, ->
    textBuffer.clear()
    memory += display.val()
    activate $('#mr')
    saveStatus()


$('#mminus').bind touchEnd, ->
    textBuffer.clear()
    memory -= display.val()
    activate $('#mr')
    saveStatus()


$('.nofix').bind touchEnd, ->
    display.bywhom = 'nofix'
    display.update functions[$(this).data('role')]().toString()
    textBuffer.clear()


$('.unary').bind touchEnd, ->
    latestUnary = functions[$(this).data('role')]
    display.bywhom = 'unary'
    display.update latestUnary(display.val()).toString()
    textBuffer.clear()


$('.binary').bind touchEnd, ->
    deactivate $('.binary')
    activate $(this)


$('.binary, #parright').bind touchEnd, ->
    parseEval $(this).data('role'), display.val()
    textBuffer.clear()


$('#parleft').bind touchEnd, ->
    parseEval $(this).data('role')
    textBuffer.clear()


$('#equal_key').bind touchEnd, ->
    if stack.length isnt 0
        parseEval $(this).data('role'), display.val()
        textBuffer.clear()
    else if latestUnary?
        display.bywhom = 'equal_key'
        display.update latestUnary(display.val()).toString()


$('#angle_key').bind touchEnd, ->
    $this = $(this)
    if angleUnit is 'Deg'
        angleUnit = 'Rad'
        $this.html $this.html().replace('Rad', 'Deg')
    else
        angleUnit = 'Deg'
        $this.html $this.html().replace('Deg', 'Rad')
    $('#angle').text(angleUnit)
    saveStatus()

$('#second').bind touchEnd, ->
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

$('.key').bind touchStart, -> keySound.play()

$(window).bind 'orientationchange', ->
    display.update()


ac2c = ->
    $('#clear').data 'role', 'clear'
    $('#clear').html $('#clear').html().replace(/^AC/, 'C')
    saveStatus()


c2ac = ->
    $('#clear').data 'role', 'allclear'
    $('#clear').html $('#clear').html().replace(/^C/, 'AC')
    saveStatus()


activate = ($elem) ->
    active = $elem.children('.active')
    if not active? or active.length == 0 # jqMobi returns undefined when no children.
        $elem.append $('<div class="active">')


deactivate = ($elem) ->
    $elem.children('.active').remove()


#
# Application cache dispatches
#
applicationCache.addEventListener 'checking', ->
    console.log 'Checking update...'

applicationCache.addEventListener 'noupdate', ->
    console.log 'No update.'

applicationCache.addEventListener 'downloading', ->
    console.log 'Downloading newer version...'

applicationCache.addEventListener 'progress', ->
    console.log '.'

applicationCache.addEventListener 'cached', ->
    console.log 'Cached.'

applicationCache.addEventListener 'updateready', ->
    console.log 'Updateready.'

# applicationCache.addEventListener 'obsolete', ->

applicationCache.addEventListener 'error', ->
    console.log 'applicationCache error'

# initialize
restoreStatus()
