// This is an optional module
import {E} from './error'
import util from 'util'

E('REDECLARE_TYPE', {
  message: 'type \'%s\' should not be declared again'
})

E('UNKNOWN_TYPE', {
  message: 'unknown type \'%s\'',
  ctor: RangeError
})

E('INVALID_TYPE_NAME', {
  message: 'invalid type name \'%s\'',
  ctor: TypeError
})

E('NON_ARRAY_TYPES', {
  message: 'types must be an array',
  ctor: TypeError
})

E('EMPTY_ARRAY_TYPE', {
  message: 'empty type array',
  ctor: TypeError
})

E('INVALID_TYPE', {
  message: 'invalid type definition',
  ctor: TypeError
})

E('EMPTY_TYPE', {
  message: '`any()`` should be used instead of an empty type, or type alias not found',
  ctor: TypeError
})

E('INVALID_SETTER', {
  message: 'invalid setter, only functions are accepted',
  ctor: TypeError
})

E('INVALID_VALIDATOR', {
  message: 'invalid validator for \'%s\', only functions or regular expressions are accepted',
  ctor: TypeError
})

E('VALIDATION_FAILS', {
  message (value, key) {
    value = util.inspect(value)
    if (key) {
      return util.format('invalid value %s for key \'%s\'', value, key)
    }

    return util.format('invalid value %s', value)
  }
})

E('ASSIGN_ASYNC', {
  message: '`set()` should be used to assign new value to property of async skema'
})

E('NOT_OPTIONAL', {
  message: key => util.format(
    'property %s is not optional', util.inspect(key))
})

E('NOT_OBJECT', {
  message: key => util.format(
    'the value of property %s is not an object', util.inspect(key))
})

E('NOT_WRITABLE', {
  message: 'property \'%s\' is readonly'
})

E('SHAPE_NOT_FOUND', {
  message: 'shape definition not found on the object'
})
