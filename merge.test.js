import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepmerge        from '@superhero/deep/merge'

suite('@superhero/deep/merge', () =>
{
  test('Merges arrays with unique values', () =>
  {
    const 
      a         = [1, 2, 3],
      b         = [2, 3, 4],
      expected  = [1, 2, 3, 4]
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Arrays should merge with unique values')
  })

  test('Merges arrays with order preserved', () =>
  {
    const 
      a         = [2, 3, 4],
      b         = [1, 2, 3],
      expected  = [2, 3, 4, 1]
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Order of values should be preserved')
  })

  test('Handles empty arrays correctly', () =>
  {
    const 
      a         = [1, 2, 3],
      b         = [],
      expected  = [1, 2, 3]
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Merging with empty array should not alter values')
  })

  test('Handles arrays with duplicate values', () =>
  {
    const 
      a         = [1, 1, 2, 2],
      b         = [2, 2, 3, 3],
      expected  = [1, 2, 3]
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Duplicate values should be removed')
  })

  test('Merges objects and prioritizes restrictive descriptors', () =>
  {
    const 
      a = {},
      b = {}

    Object.defineProperty(a, 'foo',
    {
      value         : 1,
      writable      : true,
      configurable  : false,
      enumerable    : true
    })

    Object.defineProperty(b, 'foo',
    {
      value         : 2,
      writable      : false,
      configurable  : true,
      enumerable    : true
    })

    const 
      result      = deepmerge(a, b),
      descriptor  = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(descriptor.value,        2,      'Value should prioritize the second object')
    assert.strictEqual(descriptor.writable,     false,  'Writable state should reflect the more restrictive descriptor')
    assert.strictEqual(descriptor.configurable, false,  'Configurable state should reflect the more restrictive descriptor')
    assert.strictEqual(descriptor.enumerable,   true,   'Enumerable state should remain unchanged')
  })

  test('Merges objects with non-enumerable properties', () =>
  {
    const 
      a = {},
      b = {}

    Object.defineProperty(a, 'foo',
    {
      value         : 1,
      writable      : true,
      configurable  : true,
      enumerable    : false
    })

    Object.defineProperty(b, 'foo',
    {
      value         : 2,
      writable      : false,
      configurable  : false,
      enumerable    : false
    })

    const 
      result      = deepmerge(a, b),
      descriptor  = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(descriptor.value,        2,      'Value should prioritize the second object')
    assert.strictEqual(descriptor.writable,     false,  'Writable state should reflect the more restrictive descriptor')
    assert.strictEqual(descriptor.configurable, false,  'Configurable state should reflect the more restrictive descriptor')
    assert.strictEqual(descriptor.enumerable,   false,  'Enumerable state should remain unchanged')
  })

  test('Handles nested object merging', () =>
  {
    const 
      a         = { foo: { bar: 1 } },
      b         = { foo: { baz: 2 } },
      expected  = { foo: { bar: 1, baz: 2 } }
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Nested objects should merge correctly')
  })

  test('Stops at circular references', () =>
  {
    const 
      a = {},
      b = {}

    a.self = a
    b.self = b

    const result = deepmerge(a, b)

    assert.deepStrictEqual(result.self, b.self, 'Circular references should not merge further')
  })

  test('Stops when nested and with circular references', () =>
  {
    const 
      a = { foo: { bar: { foo: { bar: 'baz' } } } },
      b = { foo: {} }

    b.foo.bar = b

    const 
      resultA = deepmerge(a, b),
      resultB = deepmerge(b, a)

    assert.deepStrictEqual(resultA.foo.bar.foo.bar, b,      'Circular references should not interfare with the merged result')
    assert.deepStrictEqual(resultB.foo.bar.foo.bar, 'baz',  'Circular references should not interfare with the merged result')
  })

  test('Returns second value for non-object types', () =>
  {
    const 
      a         = { foo: 'string' },
      b         = { foo: 42 },
      expected  = { foo: 42 }
    
    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Non-object types should replace with the second value')
  })

  test('Handles multiple merges sequentially', () =>
  {
    const 
      a         = { foo: 1 },
      b         = { bar: 2 },
      c         = { baz: 3 },
      expected  = { foo: 1, bar: 2, baz: 3 }

    const resultA = deepmerge(a, b, c)
    assert.deepStrictEqual(resultA, expected, 'Multiple objects should merge sequentially')

    const resultB = deepmerge(a, b, undefined, c)
    assert.deepStrictEqual(resultB, expected, 'Ignore undefined attributes')
  })

  test('Merges sets with unique values', () =>
  {
    const
      a        = new Set([1, 2, 3]),
      b        = new Set([2, 3, 4]),
      expected = new Set([1, 2, 3, 4])

    const result = deepmerge(a, b)
    assert.deepStrictEqual(result, expected, 'Sets should merge as a union')
  })

  test('Merges maps by key and keeps b for new keys', () =>
  {
    const
      a = new Map([['a', 1]]),
      b = new Map([['b', 2]])

    const result = deepmerge(a, b)

    assert.ok(result instanceof Map)
    assert.strictEqual(result.get('a'), 1)
    assert.strictEqual(result.get('b'), 2)
  })

  test('Merges maps by key and deep-merges values on conflicts', () =>
  {
    const
      a = new Map([['x', { foo: 1 }]]),
      b = new Map([['x', { bar: 2 }]])

    const result = deepmerge(a, b)

    assert.ok(result instanceof Map)
    assert.deepStrictEqual(result.get('x'), { foo: 1, bar: 2 })
  })

  test('Merges accessor descriptors without evaluating getters', () =>
  {
    const a = {}
    const b = {}

    let getterCalls = 0

    Object.defineProperty(a, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get() { getterCalls++; return 1 }
    })

    Object.defineProperty(b, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get() { getterCalls++; return 2 }
    })

    const result = deepmerge(a, b)
    const descriptor = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(getterCalls, 0, 'Getters must not be invoked during merge')
    assert.ok(descriptor.get, 'Merged property should keep a getter')
    assert.strictEqual(typeof descriptor.get, 'function')
  })

  test('Merges accessor+accessor and prefers b get/set when present', () =>
  {
    const a = {}
    const b = {}

    const getA = () => 1
    const setA = () => {}
    const getB = () => 2

    Object.defineProperty(a, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get           : getA,
      set           : setA
    })

    Object.defineProperty(b, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get           : getB
      // no set here
    })

    const result = deepmerge(a, b)
    const d = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(d.get, getB, 'Getter should prefer b')
    assert.strictEqual(d.set, setA, 'Setter should fall back to a when b lacks it')
  })

  test('Merges data+accessor and prefers b shape without invoking accessors', () =>
  {
    const a = {}
    const b = {}

    Object.defineProperty(a, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      value         : 1,
      writable      : true
    })

    let calls = 0
    Object.defineProperty(b, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get() { calls++; return 2 }
    })

    const result = deepmerge(a, b)
    const d = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(calls, 0, 'Getter must not be invoked during merge')
    assert.ok(d.get, 'Result should be an accessor (b shape)')
    assert.strictEqual(d.value, undefined)
  })

  // ... to cover some edge cases ...

  test('Returns first value when second is undefined', () =>
  {
    const a = { foo: 1 }
    const result = deepmerge(a, undefined)

    assert.deepStrictEqual(result, a)
    assert.notStrictEqual(result, a)
  })

  test('Short-circuits on identical references', () =>
  {
    const a = { foo: 1 }
    const result = deepmerge(a, a)

    assert.deepStrictEqual(result, a)
    assert.notStrictEqual(result, a)
  })

  test('Merges symbol keys and prioritizes restrictive descriptors', () =>
  {
    const
      a   = {},
      b   = {},
      key = Symbol('foo')

    Object.defineProperty(a, key,
    {
      value         : 1,
      writable      : false,
      configurable  : false,
      enumerable    : false
    })

    Object.defineProperty(b, key,
    {
      value         : 2,
      writable      : true,
      configurable  : true,
      enumerable    : true
    })

    const
      result      = deepmerge(a, b),
      descriptor  = Object.getOwnPropertyDescriptor(result, key)

    assert.strictEqual(descriptor.value,        2)
    assert.strictEqual(descriptor.writable,     false)
    assert.strictEqual(descriptor.configurable, false)
    assert.strictEqual(descriptor.enumerable,   false)
  })

  test('Merges accessor+data and prefers b data without invoking getter', () =>
  {
    const a = {}
    const b = {}

    let calls = 0

    Object.defineProperty(a, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      get() { calls++; return 1 }
    })

    Object.defineProperty(b, 'foo',
    {
      enumerable    : true,
      configurable  : true,
      writable      : true,
      value         : 42
    })

    const
      result = deepmerge(a, b),
      d      = Object.getOwnPropertyDescriptor(result, 'foo')

    assert.strictEqual(calls, 0)
    assert.strictEqual(d.value, 42)
    assert.strictEqual(d.get, undefined)
    assert.strictEqual(d.set, undefined)
  })

  test('Stops at circular references inside maps', () =>
  {
    const a = new Map()
    const b = new Map()

    a.set('self', a)
    b.set('self', b)

    const result = deepmerge(a, b)

    assert.ok(result instanceof Map)

    const inner = result.get('self')
    assert.ok(inner instanceof Map)
    assert.strictEqual(inner.get('self'), inner)
  })

})
