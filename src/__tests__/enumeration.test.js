import Foliage   from '../Foliage'
import Immutable from 'immutable'

describe('Foliage', function() {
  let array  = [1, 2, 3, 4 ]
  let object = { a: 1, b: 2, c: 3, d: 4 }
  let map    = Immutable.Map(object)
  let list   = Immutable.List(array)
  let record = Immutable.Record(object)()

  let tests = new Foliage([
    [ 'map',    (i => i + 1) ],
    [ 'reduce', ((a, b) => a + b), 0],
    [ 'filter', (n => (n % 2 === 0)) ],
    [ 'some',   (i => i === 2) ],
    [ 'every',  (i => i < 10) ]
  ])

  tests.forEach(function([method, ...args]) {
    describe(`Foliage::${method}`, function() {

      it ('works arrays', function() {
        let plant    = new Foliage(array)
        let expected = array[method](...args)

        plant[method](...args).should.eql(expected)
      })

      it ('works objects', function() {
        let plant    = new Foliage(object)
        let expected = plant.values()[method](...args)

        plant[method](...args).should.eql(expected)
      })
    })
  })

  // Find must be tested separately because the native implementation is not
  // well supported
  describe('Foliage::find', function() {
    let even = n => (n % 2 === 0)

    it ('returns the first answer of an array filter', function() {
      let plant = new Foliage([ 1, 2, 3, 4])
      plant.find(even).should.eql(plant.filter(even).unshift())
    })

    it ('returns the first answer of an object filter', function() {
      let plant = new Foliage({ a: 1, b: 2, c: 3, d: 4 })
      plant.find(even).should.eql(plant.filter(even).unshift())
    })
  })

  describe('Foliage::first', function() {
    it ('returns the first value in an array', function() {
      let plant = new Foliage([ 1, 2, 3, 4])
      plant.first().should.equal(1)
    })

    it ('returns the first value in an object', function() {
      let plant = new Foliage({ a: 1, b: 2, c: 3, d: 4 })
      plant.first().should.equal(1)
    })
  })

  describe('Foliage::last', function() {
    it ('returns the last value in an array', function() {
      let plant = new Foliage([ 1, 2, 3, 4])
      plant.last().should.equal(4)
    })

    it ('returns the last value of an object', function() {
      let plant = new Foliage({ a: 1, b: 2, c: 3, d: 4 })
      plant.last().should.equal(4)
    })
  })

  describe('Foliage::size', function() {
    it ('returns the last value in an array', function() {
      let plant = new Foliage([ 1, 2, 3, 4])
      plant.size().should.equal(4)
    })

    it ('returns the last value of an object', function() {
      let plant = new Foliage({ a: 1, b: 2, c: 3 })
      plant.size().should.equal(3)
    })
  })

})
