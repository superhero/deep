import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepintersect    from '@superhero/deep/intersect'

suite('@superhero/deep/intersect', () =>
{
  test('Intersects arrays by value and position', () =>
  {
    const
      a         = [1, 2, 3],
      b         = [2, 3, 4],
      expected  = [2, 3]

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Arrays should intersect by value and position')
  })

  test('Intersects nested arrays', () =>
  {
    const
      a         = [1, [2, 3], 4],
      b         = [1, [2, 4], 4],
      expected  = [1, [2], 4]

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Nested arrays should intersect deeply')
  })

  test('Handles empty array intersection', () =>
  {
    const
      a         = [1, 2, 3],
      b         = [],
      expected  = []

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Intersection with empty array results in empty array')
  })

  test('Intersects objects with matching keys and values', () =>
  {
    const
      a         = { foo: 1, bar: 2 },
      b         = { foo: 1, baz: 3 },
      expected  = { foo: 1 }

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Only matching keys with same values should intersect')
  })

  test('Deeply intersects nested objects', () =>
  {
    const
      a         = { foo: { bar: 1, baz: 2 } },
      b         = { foo: { bar: 1, baz: 3 } },
      expected  = { foo: { bar: 1 } }

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Nested objects should deeply intersect')
  })

  test('Intersection stops at type mismatch', () =>
  {
    const
      a         = { foo: [1, 2] },
      b         = { foo: { bar: 1 } },
      expected  = {}

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Type mismatch should result in empty intersection')
  })

  test('Throws on circular references', () =>
  {
    const a = {}
    const b = {}
    a.self = a
    b.self = b

    assert.throws(() => deepintersect(a, b), {
      name: 'CircularReferenceError',
      code: 'E_DEEP_INTERSECT_CIRCULAR_REFERENCE'
    }, 'Circular references should throw CircularReferenceError')
  })

  test('Intersects arrays with undefined positions', () =>
  {
    const
      a         = [1, undefined, 3],
      b         = [1, 2, 3],
      expected  = [1, 3]

    const result = deepintersect(a, b)
    assert.deepStrictEqual(result, expected, 'Undefined positions should be excluded')
  })

  test('Handles intersection of primitive types', () =>
  {
    const
      a         = 'string',
      b         = 'string',
      expected  = 'string'

    const result = deepintersect(a, b)
    assert.strictEqual(result, expected, 'Matching primitive types should intersect')
  })

  test('Returns undefined for non-intersecting primitives', () =>
  {
    const
      a         = 'string',
      b         = 'different'

    const result = deepintersect(a, b)
    assert.strictEqual(result, undefined, 'Non-matching primitive types should return undefined')
  })

  test('Handles multiple sequential intersections', () =>
  {
    const
      a         = { foo: 1, bar: 2 },
      b         = { bar: 2, baz: 3 },
      c         = { bar: 2, qux: 4 },
      expected  = { bar: 2 }

    const result = deepintersect(a, b, c)
    assert.deepStrictEqual(result, expected, 'Multiple objects should intersect sequentially')
  })
})
