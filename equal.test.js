import assert          from 'assert'
import { suite, test } from 'node:test'
import deepequal       from './equal.js'

suite('@superhero/deep/equal', () =>
{
  test('Strict equality: same values, same types', () =>
  {
    const a = { foo: 'bar', baz: 42 }
    const b = { foo: 'bar', baz: 42 }

    assert.strictEqual(deepequal(a, b), true)
  })

  test('Strict equality: fails on type mismatch', () =>
  {
    const a = { foo: 'bar', baz: 42 }
    const b = { foo: 'bar', baz: '42' }

    assert.strictEqual(deepequal(a, b, true), false)
  })

  test('Loose equality: same values, different types', () =>
  {
    const a = { foo: 'bar', baz: 42 }
    const b = { foo: 'bar', baz: '42' }

    assert.strictEqual(deepequal(a, b, false), true)
  })

  test('Loose equality: different values', () =>
  {
    const a = { foo: 'bar', baz: 42 }
    const b = { foo: 'bar', baz: 99 }

    assert.strictEqual(deepequal(a, b, false), false)
  })

  test('Deep equality with nested structure', () =>
  {
    const a = { foo: { bar: [1, 2] } }
    const b = { foo: { bar: [1, 2] } }

    assert.strictEqual(deepequal(a, b), true)
    assert.strictEqual(deepequal(a, b, false), true)
  })

  test('Fails on missing property', () =>
  {
    const a = { foo: 'bar', baz: 42 }
    const b = { foo: 'bar' }

    assert.strictEqual(deepequal(a, b), false)
    assert.strictEqual(deepequal(a, b, false), false)
  })

  test('Validates third argument is boolean', () =>
  {
    assert.throws(() => deepequal({}, {}, 'loose'), 
    { name : 'AssertionError' })
  })
})
