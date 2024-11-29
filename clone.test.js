import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepclone        from '@superhero/deep/clone'

suite('@superhero/deep/clone', () =>
{
  test('Clones simple objects', () =>
  {
    const 
      obj     = { foo: 'bar', baz: 42 },
      result  = deepclone(obj),
      legacy  = deepclone(obj, true)

    assert.deepStrictEqual(result, obj, 'Cloned object should be equal to the original')
    assert.deepStrictEqual(legacy, obj, 'Cloned object should be equal to the original (legacy mode)')

    assert.notStrictEqual(result, obj, 'Cloned object should not be the same reference as the original')
    assert.notStrictEqual(legacy, obj, 'Cloned object should not be the same reference as the original (legacy mode)')
  })

  test('Clones nested objects', () =>
  {
    const obj = { foo: { bar: { baz: 'qux' } } }

    const 
      result = deepclone(obj),
      legacy = deepclone(obj, true)

    assert.deepStrictEqual(result, obj, 'Cloned nested object should be equal to the original')
    assert.deepStrictEqual(legacy, obj, 'Cloned nested object should be equal to the original (legacy mode)')

    assert.notStrictEqual(result.foo, obj.foo, 'Cloned nested object should not share reference with the original')
    assert.notStrictEqual(legacy.foo, obj.foo, 'Cloned nested object should not share reference with the original (legacy mode)')
  })

  test('Clones arrays', () =>
  {
    const arr = [1, 2, 3, [4, 5]]

    const 
      result = deepclone(arr),
      legacy = deepclone(arr, true)

    assert.deepStrictEqual(result, arr, 'Cloned array should be equal to the original')
    assert.deepStrictEqual(legacy, arr, 'Cloned array should be equal to the original (legacy mode)')

    assert.notStrictEqual(result, arr, 'Cloned array should not share reference with the original')
    assert.notStrictEqual(legacy, arr, 'Cloned array should not share reference with the original (legacy mode)')

    assert.notStrictEqual(result[3], arr[3], 'Nested array in clone should not share reference with the original')
    assert.notStrictEqual(legacy[3], arr[3], 'Nested array in clone should not share reference with the original (legacy mode)')
  })

  if(false === !!structuredClone)
  {
    test.skip('Handles circular references (structuredClone not available)')
    test.skip('Clones objects with null prototype (structuredClone not available)')
  }
  else
  {
    test('Handles circular references', () =>
    {
      const obj = {}
      obj.self = obj
  
      const result = deepclone(obj)
  
      assert.strictEqual(result.self, result, 'Circular references should be preserved in the clone')
    })
  
    test('Clones objects with null prototype', () =>
    {
      const obj = Object.create(null)
      obj.foo = 'bar'
  
      const result = deepclone(obj)
  
      assert.deepEqual(result, obj, 'Cloned object with null prototype should be equal to the original')
      assert.notStrictEqual(result, obj, 'Cloned object with null prototype should not share reference with the original')
    })
  }
})
