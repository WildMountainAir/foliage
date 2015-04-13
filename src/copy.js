/**
 * Copy
 * Shallow copy an object.
 */

module.exports = function copy(obj) {
  // Arrays get out cheap
  if (Array.isArray(obj)) return obj.slice()

  var clone = {}

  for (let key in obj) {
    clone[key] = obj[key]
  }

  return clone
}
