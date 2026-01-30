import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepclone        from '@superhero/deep/clone'

suite('@superhero/deep/clone', () =>
{
  test('Clones simple objects', () =>
  {
    const 
      obj     = { foo: 'bar', baz: 42 },
      cloned  = deepclone(obj)

    assert.deepStrictEqual(cloned, obj, 'Cloned object should be equal to the original')
    assert.notStrictEqual(cloned, obj, 'Not the same reference as the original')
  })

  test('Clones nested objects', () =>
  {
    const 
      obj     = { foo: { bar: { baz: 'qux' } } },
      cloned  = deepclone(obj)

    assert.deepStrictEqual(cloned, obj, 'Cloned nested object should be equal to the original')
    assert.notStrictEqual(cloned.foo, obj.foo, 'Not the same reference as the original')
  })

  test('Do not preserves descriptors', () =>
  {
    const origin = {}

    Object.defineProperty(origin, 'foo', { value: {}, enumerable: true,  writable: true,  configurable: true  })
    Object.defineProperty(origin, 'bar', { value: {}, enumerable: false, writable: true,  configurable: true  })
    Object.defineProperty(origin, 'baz', { value: {}, enumerable: false, writable: false, configurable: true  })
    Object.defineProperty(origin, 'qux', { value: {}, enumerable: false, writable: false, configurable: false })

    const cloned = deepclone(origin, { preservesImutable: false, preservesEnumerable: false })

    assert.notStrictEqual(cloned,     origin,     'Not the same reference as the original')
    assert.notStrictEqual(cloned.foo, origin.foo, 'Cloned nested object should not share reference with the original')

    const
      clonedDescriptors = Object.getOwnPropertyDescriptors(cloned),
      originDescriptors = Object.getOwnPropertyDescriptors(origin)

    for(const key in originDescriptors)
    {
      assert.equal(clonedDescriptors[key].enumerable,    true)
      assert.equal(clonedDescriptors[key].writable,      true)
      assert.equal(clonedDescriptors[key].configurable,  true)
    }
  })

  test('Preserves descriptors', () =>
  {
    const origin = {}

    Object.defineProperty(origin, 'foo', { value: {}, enumerable: true,  writable: true,  configurable: true  })
    Object.defineProperty(origin, 'bar', { value: {}, enumerable: false, writable: true,  configurable: true  })
    Object.defineProperty(origin, 'baz', { value: {}, enumerable: false, writable: false, configurable: true  })
    Object.defineProperty(origin, 'qux', { value: {}, enumerable: false, writable: false, configurable: false })

    const cloned = deepclone(origin, { preservesImutable: true, preservesEnumerable: true })

    assert.deepStrictEqual(cloned,    origin,     'Cloned nested object should be equal to the original')
    assert.notStrictEqual(cloned,     origin,     'Not the same reference as the original')
    assert.notStrictEqual(cloned.foo, origin.foo, 'Cloned nested object should not share reference with the original')

    const
      clonedDescriptors = Object.getOwnPropertyDescriptors(cloned),
      originDescriptors = Object.getOwnPropertyDescriptors(origin)

    for(const key in originDescriptors)
    {
      assert.equal(clonedDescriptors[key].enumerable,    originDescriptors[key].enumerable)
      assert.equal(clonedDescriptors[key].writable,      originDescriptors[key].writable)
      assert.equal(clonedDescriptors[key].configurable,  originDescriptors[key].configurable)
    }
  })

  test('Does not preserve frozen object state', () =>
  {
    const origin = { foo:'bar', baz: 42, qux: true }

    Object.freeze(origin)

    assert.ok(Object.isFrozen(origin), 'Origin object should be frozen')

    const cloned = deepclone(origin)

    assert.deepStrictEqual(cloned, origin, 'Cloned nested object should be equal to the original')
    assert.notStrictEqual(cloned,  origin, 'Not the same reference as the original')
    assert.ok(false === Object.isFrozen(cloned), 'Cloned object should not be frozen')
  })

  test('Clones arrays', () =>
  {
    const 
      array   = [1, 2, 3, [4, 5]],
      cloned  = deepclone(array)

    assert.deepStrictEqual(cloned, array, 'Cloned array should be equal to the original')
    assert.notStrictEqual(cloned, array, 'Not the same reference as the original')
    assert.notStrictEqual(cloned[3], array[3], 'Nested array in clone should not share reference with the original')
  })

  test('Handles circular references', () =>
  {
    const obj = {}
    obj.self = obj

    const cloned = deepclone(obj)

    assert.notStrictEqual(cloned, obj)
    assert.strictEqual(cloned.self, cloned)
  })

  test('Preserves shared references', () =>
  {
    const shared = { x: 1 }
    const obj = { a: shared, b: shared }

    const cloned = deepclone(obj)

    assert.notStrictEqual(cloned, obj)
    assert.strictEqual(cloned.a, cloned.b)
    assert.notStrictEqual(cloned.a, shared)
  })

  test('Clones objects with null prototype', () =>
  {
    const obj = Object.create(null)
    obj.foo = 'bar'

    const cloned = deepclone(obj)
    assert.deepEqual(cloned, obj, 'Cloned object with null prototype should be equal to the original')
    assert.notStrictEqual(cloned, obj, 'Not the same reference as the original')
  })
})
