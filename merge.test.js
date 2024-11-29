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

    assert.strictEqual(result.self, b.self, 'Circular references should not merge further')
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

      assert.strictEqual(resultA.foo.bar.foo.bar, b,      'Circular references should not interfare with the merged result')
      assert.strictEqual(resultB.foo.bar.foo.bar, 'baz',  'Circular references should not interfare with the merged result')
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
})
