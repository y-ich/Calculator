describe "textBuffer", ->
  it "should have defalut value of '0'", ->
    expect(textBuffer.val()).toEqual '0'

  describe "after setting", ->
    beforeEach ->
      textBuffer.val('test')

    it "should return a value set", ->
      expect(textBuffer.val()).toEqual 'test'

    it "should update a view", ->
      expect($('#view').text()).toEqual 'test'

  describe "from default", ->
    beforeEach ->
      textBuffer.val('0')
      
    it "should return added string", ->
      expect(textBuffer.add('foo')).toEqual '0foo'

    describe "toggleSign", ->
      it "should return toggled sign", ->
        expect(textBuffer.toggleSign()).toEqual '-0'

      it "should return same value by doubly toggle", ->
        textBuffer.toggleSign()
        expect(textBuffer.toggleSign()).toEqual '0'