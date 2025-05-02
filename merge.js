import deepclone from '@superhero/deep/clone'

/**
 * When merging two objects [object Object], a new object is created with the 
 * properties of both objects defined. The descriptor of the property in the 
 * new object is determined by the descriptors of the properties in the two 
 * objects being merged. The priority of the property descriptor is set on the 
 * new object according to the more restrictive definition in the two sources.
 * 
 * @example if the descriptor of the property in object "a" has "configurable" 
 * set to "false", and the descriptor of the property in object "b" has the 
 * "configurable" set to "true", the new object will have the descriptor for 
 * "configurable" set to "false".
 * 
 * @example if the descriptor of the property in object "a" has "enumerable" 
 * set to "true", and the descriptor of the property in object "b" has the 
 * "enumerable" set to "true", the new object will have the descriptor for 
 * "enumerable" set to "true".
 * 
 * @example if the descriptor of the property in object "a" has "writable" set 
 * to "false", and the descriptor of the property in object "b" has the 
 * "writable" set to "false", the new object will have the descriptor for 
 * "writable" set to "false".
 * 
 * ----------------------------------------------------------------------------
 * 
 * When merging two nested objects [object Object], and there is a circular 
 * reference, the merge will stop at the circular reference and return the
 * object that contains the circular reference.
 * 
 * ----------------------------------------------------------------------------
 * 
 * When merging a and b of different types, the value of b is returned.
 * 
 * @example if the type of the property in object "a" is object "c", and the 
 * type of the property in object "b" is a number, then the value of the 
 * property in the new object will be the number.
 * 
 * @example if the type of the property in object "a" is a string, and the type
 * of the property in object "b" is object "c", then the value of the property 
 * in the new object will be the object "c".
 * 
 * ----------------------------------------------------------------------------
 * 
 * When merging two arrays [object Array], a new array is created with the 
 * unique values of both arrays. The order of the values in the new array is 
 * determined by the order of the values in the two arrays being merged.
 * 
 * @example if array "a" with values [1, 2, 3] is merged with array "b" with 
 * values [2, 3, 4], the new array will have values [1, 2, 3, 4].
 * 
 * @example if array "a" with values [2, 3, 4] is merged with array "b" with 
 * values [1, 2, 3], the new array will have values [2, 3, 4, 1].
 * 
 * @example if array "a" with values [1, 2, 3] is merged with an empty array 
 * "b", the new array will still have values [1, 2, 3].
 * 
 * @example if array "a" with values [1, 1, 2, 2] is merged with array "b" with
 * values [2, 2, 3, 3], the new array will have values [1, 2, 3].
 */
export default function merge(a, b, ...c)
{
  const 
    seen    = new WeakSet,
    output  = mergeAandB(a, b, seen)

  return c.length
  ? merge(output, ...c)
  : deepclone(output, { preservesImutable: true })
}

function mergeAandB(a, b, seen)
{
  if(b === undefined)
  {
    return a
  }

  if(Object.is(a, b))
  {
    return a
  }

  const
    aType = Object.prototype.toString.call(a),
    bType = Object.prototype.toString.call(b)

  if('[object Array]' === aType
  && '[object Array]' === bType)
  {
    return mergeArray(a, b)
  }

  if('[object Object]' === aType
  && '[object Object]' === bType)
  {
    return mergeObject(a, b, seen)
  }

  return b
}

function mergeArray(a, b)
{
  return [...new Set(a.concat(b))]
}

function mergeObject(a, b, seen)
{
  if(seen.has(a))
  {
    return b
  }

  seen.add(a)

  const output = {}

  for(const key of Object.getOwnPropertyNames(a))
  {
    if(key in b)
    {
      continue
    }
    else
    {
      const descriptor = Object.getOwnPropertyDescriptor(a, key)
      Object.defineProperty(output, key, descriptor)
    }
  }

  for(const key of Object.getOwnPropertyNames(b))
  {
    if(key in a)
    {
      const
        descriptor_a = Object.getOwnPropertyDescriptor(a, key),
        descriptor_b = Object.getOwnPropertyDescriptor(b, key)

      Object.defineProperty(output, key,
      {
        configurable : descriptor_a.configurable && descriptor_b.configurable,
        enumerable   : descriptor_a.enumerable   && descriptor_b.enumerable,
        writable     : descriptor_a.writable     && descriptor_b.writable,
        value        : mergeAandB(a[key], b[key], seen)
      })
    }
    else
    {
      const descriptor = Object.getOwnPropertyDescriptor(b, key)
      Object.defineProperty(output, key, descriptor)
    }
  }

  return output
}