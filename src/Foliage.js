/**
 * A tree data structure that spawns branches pointing to
 * various locations within itself.
 *
 * @param {Object} state - The initial state of the instance
 */

let assoc  = require('./assoc')
let dissoc = require('./dissoc')
let getIn  = require('./get')

function Foliage (state) {
  this._path  = []
  this._root  = this
  this._state = state
}

Foliage.prototype = {

  getPath(key) {
    return this._path.concat(key).filter(i => i !== undefined)
  },

  getRoot() {
    return this._root
  },

  getState() {
    return this.getRoot()._state
  },

  commit(state) {
    this.getRoot()._state = state
  },

  get(key, fallback) {
    let value = getIn(this.getState(), this.getPath(key))
    return value === void 0 ? fallback : value
  },

  set(key, value) {
    if (arguments.length === 1) {
      value = arguments[0]
      key   = undefined
    }

    this.commit(assoc(this.getState(), this.getPath(key), value))
  },

  remove(key) {
    this.commit(dissoc(this.getState(), this.getPath(key)))
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
    return getIn(this.getState(), this.getPath())
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
let methods = [ 'sort', 'map', 'reduce', 'filter', 'forEach', 'some', 'every', 'join' ]

methods.forEach(function(name) {
  Foliage.prototype[name] = function() {
    return this.values()[name](...arguments)
  }
})

module.exports = Foliage
