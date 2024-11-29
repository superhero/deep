import assert           from 'assert'
import { suite, test }  from 'node:test'
import deep             from '@superhero/deep'
import { assign, clone, freeze, merge } from '@superhero/deep'

suite('@superhero/deep', () =>
{
  test('All functions are accessible as a member to the default import object', () =>
  {
    assert.ok('function' === typeof deep.assign,  'Shold export the assign function')
    assert.ok('function' === typeof deep.clone,   'Shold export the clone function')
    assert.ok('function' === typeof deep.freeze,  'Shold export the freeze function')
    assert.ok('function' === typeof deep.merge,   'Shold export the merge function')
  })

  test('All functions are accessible to import from the default import object', () =>
  {
    assert.ok('function' === typeof assign, 'Shold export the assign function')
    assert.ok('function' === typeof clone,  'Shold export the clone function')
    assert.ok('function' === typeof freeze, 'Shold export the freeze function')
    assert.ok('function' === typeof merge,  'Shold export the merge function')
  })
})
