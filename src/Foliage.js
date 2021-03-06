/**
 * A tree data structure that spawns branches pointing to
 * various locations within itself.
 *
 * @param {Object} state - The initial state of the instance
 */

let Diode    = require('diode')
let setIn    = require('./set')
let removeIn = require('./remove')
let getIn    = require('./get')

const EMPTY = {}
const PATH  = []

function Foliage(state) {
  Diode(this)

  this._path = PATH
  this._root = this
  this.state = EMPTY

  this.commit(state)
}

Foliage.prototype = {
  constructor: Foliage,

  getPath(key) {
    return this._path.concat(key).filter(i => i !== undefined)
  },

  getRoot() {
    return this._root
  },

  commit(next=this.state) {
    let root    = this.getRoot()
    let current = root.state

    if (next == null) {
      next = EMPTY
    }

    if (current !== next) {
      root.state = next
      this.emit(root.state)
    }
  },

  clear() {
    this.commit(null)
  },

  get(key, fallback) {
    return getIn(this.state, this.getPath(key), fallback)
  },

  set(key, value) {
    if (arguments.length === 1) {
      value = arguments[0]
      key   = undefined
    }

    this.commit(setIn(this.state, this.getPath(key), value))
  },

  update(key, obj) {
    if (arguments.length === 1) {
      obj = arguments[0]
      key = undefined
    }

    for (let prop in obj) {
      this.set([ key, prop ], obj[prop])
    }
  },

  remove(key) {
    this.commit(removeIn(this.state, this.getPath(key)))
  },

  refine(key) {
    return Object.create(this, {
      _path : { value: this.getPath(key) }
    })
  },

  keys() {
    return Object.keys(this.valueOf() || {})
  },

  values() {
    // An anonymous function is used here instead of
    // calling `this.get` directly because we have no
    // fallback value.
    return this.keys().map(function(key) {
      return this.get(key)
    }, this)
  },

  valueOf() {
    return getIn(this.state, this.getPath())
  },

  toJSON() {
    return this.valueOf()
  },

  is(branch) {
    return branch.valueOf() == this.valueOf()
  },

  find(fn, scope) {
    return this.filter(fn, scope)[0]
  },

  includes(value) {
    return this.indexOf(value) > -1
  },

  first() {
    return this.values().shift()
  },

  last() {
    return this.values().pop()
  },

  size() {
    return this.values().length
  }

}

// Add collection methods
let methods = [ 'sort', 'map', 'reduce', 'filter', 'forEach', 'some', 'every', 'join', 'indexOf' ]

methods.forEach(function(name) {
  Foliage.prototype[name] = function() {
    return this.values()[name](...arguments)
  }
})

module.exports = Foliage
