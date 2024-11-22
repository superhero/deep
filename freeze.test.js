import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepfreeze       from '@superhero/deep/freeze'

suite('@superhero/deep/freeze', () =>
{
  test('Freezes a simple object', () =>
  {
    const obj = { foo: 'bar' }

    deepfreeze.freeze(obj)

    assert.throws(() => { obj.foo = 'baz' }, TypeError, 'Should not allow modifying a frozen object')
    assert.strictEqual(Object.isFrozen(obj), true,      'Object should be frozen')
  })

  test('Freezes nested objects recursively', () =>
  {
    const obj = { foo: { bar: { baz: 'qux' } } }

    deepfreeze.freeze(obj)

    assert.throws(() => { obj.foo.bar.baz = 'changed' }, TypeError, 'Should not allow modifying nested properties')
    assert.strictEqual(Object.isFrozen(obj.foo.bar),  true, 'Nested object should be frozen')
    assert.strictEqual(Object.isFrozen(obj.foo),      true, 'Parent object should be frozen')
  })

  test('Handles circular references gracefully', () =>
  {
    const obj = {}
    obj.self = obj

    deepfreeze.freeze(obj)

    assert.strictEqual(Object.isFrozen(obj),      true, 'Object with circular reference should be frozen')
    assert.strictEqual(Object.isFrozen(obj.self), true, 'Circular reference should also be frozen')
  })

  test('Freezes objects with symbols', () =>
  {
    const sym = Symbol('test')
    const obj = { [sym]: 'value' }

    deepfreeze.freeze(obj)

    assert.throws(() => { obj[sym] = 'new value' }, TypeError,  'Should not allow modifying properties with symbols')
    assert.strictEqual(Object.isFrozen(obj), true,              'Object with symbols should be frozen')
  })

  test('Handles already frozen objects without error', () =>
  {
    const obj = Object.freeze({ foo: 'bar' })

    deepfreeze.freeze(obj) // Should not throw an error
    assert.strictEqual(Object.isFrozen(obj), true, 'Already frozen object should remain frozen')
  })

  test('Freezes objects with non-enumerable properties', () =>
  {
    const obj = {}
    Object.defineProperty(obj, 'foo',
    {
      value         : 'bar',
      enumerable    : false,
      configurable  : true,
      writable      : true
    })

    deepfreeze.freeze(obj)

    assert.throws(() => { obj.foo = 'baz' }, TypeError, 'Should not allow modifying non-enumerable properties')
    assert.strictEqual(Object.isFrozen(obj), true,      'Object with non-enumerable properties should be frozen')
  })

  test('Freezes arrays', () =>
  {
    const arr = [1, 2, 3]

    deepfreeze.freeze(arr)

    assert.throws(() => { arr[0] = 4 }, TypeError, 'Should not allow modifying an array')
    assert.strictEqual(Object.isFrozen(arr), true, 'Array should be frozen')
  })

  test('Handles objects with null prototype', () =>
  {
    const obj = Object.create(null)
    obj.foo = 'bar'

    deepfreeze.freeze(obj)

    assert.throws(() => { obj.foo = 'baz' }, TypeError, 'Should not allow modifying properties of objects with null prototype')
    assert.strictEqual(Object.isFrozen(obj), true,      'Object with null prototype should be frozen')
  })

  test('Freezes objects with multiple property types', () =>
  {
    const 
      sym = Symbol('test'),
      obj = 
      {
        [sym]  : 'value',
        foo    : 'bar',
        nested : { baz: 'qux' }
      }

    Object.defineProperty(obj, 'nonEnum',
    {
      value         : 'hidden',
      enumerable    : false,
      configurable  : true,
      writable      : true
    })

    deepfreeze.freeze(obj)

    assert.throws(() => { obj.nested.baz  = 'changed'   }, TypeError, 'Should not allow modifying nested properties')
    assert.throws(() => { obj[sym]        = 'new value' }, TypeError, 'Should not allow modifying symbol properties')
    assert.throws(() => { obj.nonEnum     = 'visible'   }, TypeError, 'Should not allow modifying non-enumerable properties')
    assert.strictEqual(Object.isFrozen(obj.nested), true, 'Nested object should be frozen')
    assert.strictEqual(Object.isFrozen(obj),        true, 'Parent object should be frozen')
  })
})
