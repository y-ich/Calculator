describe "textBuffer", ->
  it "should have defalut value of '0'", ->
    expect(textBuffer.val()).toEqual '0'

  describe "after setting", ->
    char = '1'
    beforeEach ->
      textBuffer.val(char)

    it "should return a value set", ->
      expect(textBuffer.val()).toEqual char

    it "should update a view", ->
      expect($('#view').text()).toEqual char

  describe "from default", ->
    beforeEach ->
      textBuffer.val('0')
      
    it "should return added string", ->
      expect(textBuffer.add('1')).toEqual '1'

    it "should return added string", ->
      textBuffer.add('1')
      expect(textBuffer.add('1')).toEqual '11'

    describe "toggleSign", ->
      it "should return toggled sign", ->
        expect(textBuffer.toggleSign()).toEqual '-0'

      it "should return same value by doubly toggle", ->
        textBuffer.toggleSign()
        expect(textBuffer.toggleSign()).toEqual '0'

  describe "period", ->
    it "should return added string", ->
      expect(textBuffer.add('.')).toEqual '0.'

    it "should return added string", ->
      textBuffer.val('0.')
      expect(textBuffer.add('.')).toEqual null


describe "parseEval", ->
    
  describe "normal order", ->
    it "should stack binary operator", ->
      parseEval 'mul', 2
      expect(stack).toEqual([2, 'mul'])

    it "should eval operator with high priority", ->
      parseEval 'add', 2
      expect(stack).toEqual([4, 'add'])

  describe "mul priority", ->
    beforeEach ->
      clearStack()

    it "should stack operator with high priority", ->
      parseEval 'add', 2
      parseEval 'mul', 2
      expect(stack).toEqual([2, 'add', 2, 'mul'])


describe "equal", ->
  it "should return a result of binary operator"
  it "should close all parentheses"
  it "should repeat the last unary inputted function"   
  it "should repeat the last unary inputted binary operator"


