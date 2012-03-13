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
