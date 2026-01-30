import assert           from 'assert'
import { suite, test }  from 'node:test'
import deepassign       from '@superhero/deep/assign'

suite('@superhero/deep/assign', () =>
{
  test('Assigns arrays correctly', () => 
  {
    const 
      a         = [1, 2, 3],
      b         = [3, 4, 5],
      expected  = [1, 2, 3, 4, 5]
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Arrays should merge with unique values')
  })

  test('Assigns objects correctly', () => 
  {
    const 
      a         = { foo: 1, bar: { baz: 2 } },
      b         = { foo: 2, bar: { qux: 3 }, hello: 'world' },
      expected  = { foo: 2, bar: { baz: 2, qux: 3 }, hello: 'world' }
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Objects should deep merge')
  })
  
  test('Overwrites non-object properties correctly', () => 
  {
    const 
      a         = { foo: 1 },
      b         = { foo: 2 },
      expected  = { foo: 2 }
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Properties should be overwritten')
  })
  
  test('Handles undefined values correctly', () => 
  {
    const 
      a         = { foo: 1 },
      b         = { foo: undefined },
      expected  = { foo: 1 }
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Undefined values should not overwrite existing properties')
  })

  suite('Descriptor properties', () =>
  {
    suite('Retains', () =>
    {
      test('non-writable, non-configurable and non-enumarable', () => 
      {
        const a = {}
      
        Object.defineProperty(a, 'foo', 
        {
          value         : 1,
          writable      : false,
          configurable  : false,
          enumerable    : false
        })
      
        const b = { foo: 2 }
      
        deepassign(a, b)
      
        const descriptor_a = Object.getOwnPropertyDescriptor(a, 'foo')
      
        assert.strictEqual(descriptor_a.value,        1,     'Value of non-writeable property should not be overwritten')
        assert.strictEqual(descriptor_a.writable,     false, 'Writable state should remain unchanged')
        assert.strictEqual(descriptor_a.configurable, false, 'Configurable state should remain unchanged')
        assert.strictEqual(descriptor_a.enumerable,   false, 'Enumerable state should remain unchanged')
      })
      
      test('writable but non-configurable and non-enumarable', () => 
      {
        const a = {}
      
        Object.defineProperty(a, 'foo', 
        {
          value         : 1,
          writable      : true,
          configurable  : false,
          enumerable    : false
        })
      
        const b = { foo: 2 }
      
        deepassign(a, b)
      
        const descriptor_a = Object.getOwnPropertyDescriptor(a, 'foo')
      
        assert.strictEqual(descriptor_a.value,        2,     'Value of writeable property should be overwritten')
        assert.strictEqual(descriptor_a.writable,     true,  'Writable state should remain unchanged')
        assert.strictEqual(descriptor_a.configurable, false, 'Configurable state should remain unchanged')
        assert.strictEqual(descriptor_a.enumerable,   false, 'Enumerable state should remain unchanged')
      })
      
      test('writable and configurable but non-enumarable', () => 
      {
        const a = {}
      
        Object.defineProperty(a, 'foo', 
        {
          value         : 1,
          writable      : true,
          configurable  : true,
          enumerable    : false
        })
      
        const b = { foo: 2 }
      
        deepassign(a, b)
      
        const descriptor_a = Object.getOwnPropertyDescriptor(a, 'foo')
      
        assert.strictEqual(descriptor_a.value,        2,     'Value of writeable property should be overwritten')
        assert.strictEqual(descriptor_a.writable,     true,  'Writable state should remain unchanged')
        assert.strictEqual(descriptor_a.configurable, true,  'Configurable state should remain unchanged')
        assert.strictEqual(descriptor_a.enumerable,   true,  'Enumerable state should change to becouse the property is configurable')
      })
    })
    
    suite('Assigns', () =>
    {
      test('non-writable, non-configurable and non-enumarable', () => 
      {
        const 
          a = { foo: 1 },
          b = {}
      
        Object.defineProperty(a, 'foo', 
        {
          value         : 2,
          writable      : false,
          configurable  : false,
          enumerable    : false
        })
      
        deepassign(a, b)
      
        const descriptor_a = Object.getOwnPropertyDescriptor(a, 'foo')
      
        assert.strictEqual(descriptor_a.value,        2,     'Value should be overwritten')
        assert.strictEqual(descriptor_a.writable,     false, 'Writable state should be assigned')
        assert.strictEqual(descriptor_a.configurable, false, 'Configurable state should be assigned')
        assert.strictEqual(descriptor_a.enumerable,   false, 'Enumerable state should be assigned')
      })
    })
  })
  
  test('Merges nested arrays correctly', () => 
  {
    const 
      a         = { foo: [1, 2] },
      b         = { foo: [2, 3] },
      expected  = { foo: [1, 2, 3] }
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Nested arrays should merge with unique values')
  })
  
  test('Merges nested objects correctly', () => 
  {
    const 
      a         = { foo: { bar: { baz: 1 }}},
      b         = { foo: { bar: { qux: 2 }}},
      expected  = { foo: { bar: { baz: 1, qux: 2 }}}
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Nested objects should deep merge')
  })
  
  test('Does not alter objects with no conflicts', () => 
  {
    const 
      a         = { foo: 1 },
      b         = { bar: 2 },
      expected  = { foo: 1, bar: 2 }
  
    deepassign(a, b)
    assert.deepStrictEqual(a, expected, 'Objects without conflicts should merge correctly')
  })

  suite('Map/Set + accessors', () =>
  {
    test('Assigns sets as a union', () =>
    {
      const
        a = new Set([1, 2, 3]),
        b = new Set([3, 4, 5])

      deepassign(a, b)

      assert.deepStrictEqual(a, new Set([1, 2, 3, 4, 5]))
    })

    test('Assigns maps by key and merges values on conflict', () =>
    {
      const
        a = new Map([['x', { foo: 1 }], ['y', 1]]),
        b = new Map([['x', { bar: 2 }], ['z', 3]])

      deepassign(a, b)

      assert.ok(a instanceof Map)
      assert.deepStrictEqual(a.get('x'), { foo: 1, bar: 2 })
      assert.strictEqual(a.get('y'), 1)
      assert.strictEqual(a.get('z'), 3)
    })

    test('Assigns symbol keys (including non-enumerables)', () =>
    {
      const k = Symbol('k')

      const a = {}
      const b = {}

      Object.defineProperty(b, k,
      {
        value         : 42,
        writable      : true,
        configurable  : true,
        enumerable    : false
      })

      deepassign(a, b)

      const d = Object.getOwnPropertyDescriptor(a, k)
      assert.strictEqual(d.value, 42)
      assert.strictEqual(d.enumerable, false)
    })

    test('Does not invoke getters while assigning', () =>
    {
      const a = {}
      const b = {}

      let calls = 0

      Object.defineProperty(a, 'foo',
      {
        enumerable    : true,
        configurable  : true,
        get() { calls++; return { foo: 1 } }
      })

      Object.defineProperty(b, 'foo',
      {
        enumerable    : true,
        configurable  : true,
        value         : { bar: 2 },
        writable      : true
      })

      deepassign(a, b)

      assert.strictEqual(calls, 0, 'Getter must not be invoked during assign')

      const d = Object.getOwnPropertyDescriptor(a, 'foo')
      assert.ok('value' in d)
      assert.deepStrictEqual(d.value, { bar: 2 })
    })

    test('Copies accessor descriptors from b when a does not have the property', () =>
    {
      const a = {}
      const b = {}

      const getB = () => 123

      Object.defineProperty(b, 'foo',
      {
        enumerable    : true,
        configurable  : true,
        get           : getB
      })

      deepassign(a, b)

      const d = Object.getOwnPropertyDescriptor(a, 'foo')
      assert.strictEqual(d.get, getB)
      assert.strictEqual(d.set, undefined)
      assert.strictEqual(d.value, undefined)
    })

    test('Does not override a non-configurable accessor on a', () =>
    {
      const a = {}
      const b = {}

      const getA = () => 1
      const getB = () => 2

      Object.defineProperty(a, 'foo',
      {
        enumerable    : true,
        configurable  : false,
        get           : getA
      })

      Object.defineProperty(b, 'foo',
      {
        enumerable    : true,
        configurable  : true,
        get           : getB
      })

      deepassign(a, b)

      const d = Object.getOwnPropertyDescriptor(a, 'foo')
      assert.strictEqual(d.get, getA, 'Non-configurable accessor must remain')
    })

    test('Assigns into writable non-configurable data properties', () =>
    {
      const a = {}
      const b = {}

      Object.defineProperty(a, 'foo',
      {
        enumerable    : false,
        configurable  : false,
        writable      : true,
        value         : 1
      })

      Object.defineProperty(b, 'foo',
      {
        enumerable    : true,
        configurable  : true,
        writable      : true,
        value         : 2
      })

      deepassign(a, b)

      const d = Object.getOwnPropertyDescriptor(a, 'foo')
      assert.strictEqual(d.value, 2)
      assert.strictEqual(d.configurable, false)
      assert.strictEqual(d.enumerable, false)
      assert.strictEqual(d.writable, true)
    })
  })
})
