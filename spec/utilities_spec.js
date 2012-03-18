(function() {

  describe("utilities", function() {
    describe("reverse", function() {
      return it("should reverse string", function() {
        return expect(reverse('test')).toEqual('tset');
      });
    });
    describe("split", function() {
      return it("should split string every n length", function() {
        return expect(split(3, '1234567')).toEqual(['123', '456', '7']);
      });
    });
    describe("loggamma", function() {
      return it("should return", function() {
        return expect(loggamma(3.5)).toEqual(1.2009736023470845);
      });
    });
    return describe("trigonometric", function() {
      it("should return", function() {
        return expect(functions.sin(0)).toEqual(0);
      });
      it("should return", function() {
        return expect(functions.sin(90)).toEqual(1);
      });
      it("should return", function() {
        return expect(functions.cos(0)).toEqual(1);
      });
      it("should return", function() {
        return expect(functions.cos(90)).toEqual(0);
      });
      it("should return", function() {
        return expect(functions.tan(0)).toEqual(0);
      });
      it("should return", function() {
        return expect(isNaN(functions.tan(90))).toEqual(true);
      });
      return describe("radian", function() {
        beforeEach(function() {
          return window.angleUnit = 'Rad';
        });
        afterEach(function() {
          return window.angleUnit = 'Deg';
        });
        it("should return", function() {
          return expect(functions.sin(Math.PI / 2)).toEqual(1);
        });
        it("should return", function() {
          return expect(functions.cos(Math.PI / 2)).toEqual(0);
        });
        return it("should return", function() {
          return expect(isNaN(functions.tan(Math.PI / 2))).toEqual(true);
        });
      });
    });
  });

}).call(this);
