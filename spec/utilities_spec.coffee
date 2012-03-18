describe "utilities", ->
  describe "reverse", ->
    it "should reverse string", ->
      expect(reverse 'test').toEqual('tset')

  describe "split", ->
    it "should split string every n length", ->
      expect(split 3, '1234567').toEqual(['123', '456', '7'])

  describe "loggamma", ->
    it "should return", ->
      expect(loggamma(3.5)).toEqual(1.2009736023470845)

  describe "trigonometric", ->
    it "should return", ->
      expect(functions.sin(0)).toEqual(0)

    it "should return", ->
      expect(functions.sin(90)).toEqual(1)

    it "should return", ->
      expect(functions.cos(0)).toEqual(1)

    it "should return", ->
      expect(functions.cos(90)).toEqual(0)

    it "should return", ->
      expect(functions.tan(0)).toEqual(0)

    it "should return", ->
      expect(isNaN(functions.tan(90))).toEqual(true)

    describe "radian", ->
      beforeEach ->
        window.angleUnit = 'Rad'

      afterEach ->
        window.angleUnit = 'Deg'

      it "should return", ->
        expect(functions.sin(Math.PI/2)).toEqual(1)

      it "should return", ->
        expect(functions.cos(Math.PI/2)).toEqual(0)

      it "should return", ->
        expect(isNaN(functions.tan(Math.PI/2))).toEqual(true)

