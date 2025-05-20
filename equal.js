import assert from 'node:assert'
import util   from 'node:util'

export default function equal(a, b, strict = true) 
{
  assert.strictEqual(typeof strict, 'boolean', 'Third argument "loose" must be a boolean')

  return strict
    ? util.isDeepStrictEqual(a, b)
    : isDeepLooseEqual(a, b)
}

function isDeepLooseEqual(a, b)
{
  try
  {
    assert.deepEqual(a, b)
    return true
  }
  catch(error)
  {
    if(error instanceof assert.AssertionError)
    {
      return false
    }
    else
    {
      throw error
    }
  }
}