/**
 * When intersecting two arrays [object Array], the result is a new array
 * containing only values present in both arrays. Duplicate values are removed.
 * 
 * @example intersecting [1, 2, 3] and [2, 3, 4] results in [2, 3].
 * 
 * ----------------------------------------------------------------------------
 * 
 * When intersecting two objects [object Object], the result is a new object
 * with properties that exist in both objects and whose values are also
 * intersecting. The descriptor of the intersected property is defined by
 * the most restrictive rules, same as the merge strategy.
 * 
 * @example if key exists in both objects and the values are primitives and
 * equal, that value is kept.
 * 
 * @example if the values are nested objects or arrays, the intersection
 * continues recursively.
 * 
 * ----------------------------------------------------------------------------
 * 
 * When the types differ, no value is intersected.
 * 
 * @example intersecting a string and an object results in no match.
 */
export default function intersect(a, b, ...c)
{
  const
    seen = new WeakMap,
    output = intersectAandB(a, b, seen)

  return c.length
    ? intersect(output, ...c)
    : output
}

function intersectAandB(a, b, seen)
{
  if(Object.is(a, b))
  {
    return a
  }

  const
    aType = Object.prototype.toString.call(a),
    bType = Object.prototype.toString.call(b)

  if(aType !== bType)
  {
    return undefined
  }

  if('[object Array]' === aType)
  {
    return intersectArray(a, b, seen)
  }

  if('[object Object]' === aType)
  {
    return intersectObject(a, b, seen)
  }

  return undefined
}

function intersectArray(a, b, seen)
{
  if(hasSeen(a, b, seen))
  {
    return seen.get(a).get(b)
  }

  const
    values = a.map((value, i) => 
    {
      if(b.includes(value))
      {
        return value
      }

      if('object' === typeof value)
      {
        return intersectAandB(value, b[i], seen)
      }
    }),
    output = values.filter((value) => value !== undefined)

  seen.get(a).set(b, output)

  return output
}

function intersectObject(a, b, seen)
{
  if(hasSeen(a, b, seen))
  {
    return seen.get(a).get(b)
  }

  const output = {}

  for(const key of Object.getOwnPropertyNames(a))
  {
    if(false === (key in b))
    {
      continue
    }

    const value = intersectAandB(a[key], b[key], seen)

    if(undefined === value)
    {
      continue
    }

    const
      descriptorA = Object.getOwnPropertyDescriptor(a, key),
      descriptorB = Object.getOwnPropertyDescriptor(b, key)

    Object.defineProperty(output, key,
    {
      configurable : descriptorA.configurable && descriptorB.configurable,
      enumerable   : descriptorA.enumerable   && descriptorB.enumerable,
      writable     : descriptorA.writable     && descriptorB.writable,
      value
    })
  }

  seen.get(a).set(b, output)

  return output
}

function hasSeen(a, b, seen)
{
  if(false === seen.has(a))
  {
    seen.set(a, new WeakMap)
  }
  else if(seen.get(a).has(b))
  {
    if(CircularReferenceError === seen.get(a).get(b))
    {
      throw new CircularReferenceError('Circular reference detected')
    }
    else
    {
      return true
    }
  }

  // Avoid circular references by initiating the weak map with a 
  // ReferenceError that is written over later when the object is 
  // fully processed and the reference is not circular, and can 
  // then instead be set to the output to act as a cache layer.
  seen.get(a).set(b, CircularReferenceError)

  return false
}

class CircularReferenceError extends ReferenceError
{
  name = 'CircularReferenceError'
  code = 'E_DEEP_INTERSECT_CIRCULAR_REFERENCE'
}