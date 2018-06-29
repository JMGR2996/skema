import test from 'ava'
import {defaults} from '../../src'

const getTest = only => only
  ? test.only
  : test

const tryCatchSync = (func, success, fail) => {
  let o
  try {
    o = func()
  } catch (error) {
    return fail(error)
  }

  return success(o)
}

const tryCatchAsync = (func, success, fail) => {
  return func().then(success, fail)
}

const tryCatchFactory = ({async}) => async
  ? tryCatchAsync
  : tryCatchSync

export function run (skemaOptions = {}) {
  const {skema, type} = defaults(skemaOptions)
  const _tryCatch = tryCatchFactory(skemaOptions)

  return ({
    // description
    d,
    // skema
    s,
    // input value
    input,
    // output value
    output,
    // error
    e,
    // skema create error
    se,
    only,
    after,
    args,
    async
  }, i) => {

    const hasAsync = async === !!async
    const tryCatch = hasAsync
      ? tryCatchFactory({async})
      : _tryCatch

    getTest(only)(`${i}: ${d}`, async t => {
      function from (s) {
        return tryCatch(
          () => args
            ? hasAsync
              ? s.from(input, args, {async})
              : s.from(input, args)
            : hasAsync
              ? s.from(input, {async})
              : s.from(input),
          async o => {
            if (e) {
              t.fail('should fail')
              return
            }

            typeof output === 'function'
              ? output(t, o)
              : match(t, o, output)

            if (after) {
              await after(t, o)
            }
          },
          error => {
            if (!e) {
              console.error('unexpected error:', error && error.stack || error)
              t.fail('should not fail')
              return
            }

            sMatch(t, error, output, 'error: ')
          }
        )
      }

      await tryCatchSync(() => {
        return s()
      }, s => {
        if (se) {
          t.fail('factory should fail')
          return
        }

        return from(s)

      }, error => {
        if (!se) {
          console.error('unexpected factory error:', error.stack || error)
          t.fail('factory should not fail')
          return
        }

        sMatch(t, error, output, 'factory error: ')
      })
    })
  }
}

function isObject (v) {
  return Object(v) === v
}

function deepEqual (t, value, expect, path) {
  const originalPath = path
  path = path || []

  if (!isObject(value)) {
    return t.fail(`not deepEqual: not an object, path: ${JSON.stringify(path)}`)
  }

  if (Object.keys(value).length > Object.keys(expect).length) {
    let tmp = value
    value = expect
    expect = value
  }

  Object.keys(expect).forEach(key => {
    const v = expect[key]

    if (isObject(v)) {
      return deepEqual(t, value[key], v, path.concat(key))
    }

    t.is(value[key], v, `not equal, key: ${key}, path: ${JSON.stringify(path)}`)
  })

  if (!originalPath) {
    t.pass()
  }
}

function match (t, value, expect, prefix = '') {
  if (Object(expect) === expect) {
    deepEqual(t, value, expect)
    return
  }

  t.is(value, expect, `${prefix}result not match`)
}

function sMatch (t, value, expect, prefix = '') {
  Object.keys(expect).forEach(key => {
    match(t, value[key], expect[key], prefix + key + ': ')
  })
}
