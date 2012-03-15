(function() {

  describe("textBuffer", function() {
    it("should have defalut value of '0'", function() {
      return expect(textBuffer.val()).toEqual('0');
    });
    describe("after setting", function() {
      var char;
      char = '1';
      beforeEach(function() {
        return textBuffer.val(char);
      });
      it("should return a value set", function() {
        return expect(textBuffer.val()).toEqual(char);
      });
      return it("should update a view", function() {
        return expect($('#view').text()).toEqual(char);
      });
    });
    describe("from default", function() {
      beforeEach(function() {
        return textBuffer.val('0');
      });
      it("should return added string", function() {
        return expect(textBuffer.add('1')).toEqual('1');
      });
      it("should return added string", function() {
        textBuffer.add('1');
        return expect(textBuffer.add('1')).toEqual('11');
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
    return describe("period", function() {
      it("should return added string", function() {
        return expect(textBuffer.add('.')).toEqual('0.');
      });
      return it("should return added string", function() {
        textBuffer.val('0.');
        return expect(textBuffer.add('.')).toEqual(null);
      });
    });
  });

  describe("parseEval", function() {
    describe("normal order", function() {
      it("should stack binary operator", function() {
        parseEval('mul', 2);
        return expect(stack).toEqual([2, 'mul']);
      });
      return it("should eval operator with high priority", function() {
        parseEval('add', 2);
        return expect(stack).toEqual([4, 'add']);
      });
    });
    return describe("mul priority", function() {
      beforeEach(function() {
        return clearStack();
      });
      return it("should stack operator with high priority", function() {
        parseEval('add', 2);
        parseEval('mul', 2);
        return expect(stack).toEqual([2, 'add', 2, 'mul']);
      });
    });
  });

  describe("equal", function() {
    it("should return a result of binary operator");
    it("should close all parentheses");
    it("should repeat the last unary inputted function");
    return it("should repeat the last unary inputted binary operator");
  });

}).call(this);
