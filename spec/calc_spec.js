(function() {

  describe("textBuffer", function() {
    it("should have defalut value of '0'", function() {
      return expect(textBuffer.val()).toEqual('0');
    });
    describe("after setting", function() {
      beforeEach(function() {
        return textBuffer.val('test');
      });
      it("should return a value set", function() {
        return expect(textBuffer.val()).toEqual('test');
      });
      return it("should update a view", function() {
        return expect($('#view').text()).toEqual('test');
      });
    });
    return describe("from default", function() {
      beforeEach(function() {
        return textBuffer.val('0');
      });
      it("should return added string", function() {
        return expect(textBuffer.add('foo')).toEqual('0foo');
      });
      return describe("toggleSign", function() {
        it("should return toggled sign", function() {
          return expect(textBuffer.toggleSign()).toEqual('-0');
        });
        return it("should return same value by doubly toggle", function() {
          textBuffer.toggleSign();
          return expect(textBuffer.toggleSign()).toEqual('0');
        });
      });
    });
  });

}).call(this);
