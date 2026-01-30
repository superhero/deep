export default function clone(input, options = {}) 
{
  const seen = new WeakMap()

  options.preservesImutable   = options.preservesImutable   ?? false
  options.preservesEnumerable = options.preservesEnumerable ?? true
  options.fallback            = options.fallback            ?? ((value) => cloneObject(options, seen, value))

  return deepClone(options, seen, input)
}

function deepClone(options, seen, value) 
{
  let clone

  switch(Object.prototype.toString.call(value))
  {
    case '[object Array]'   : clone = cloneArray(options, seen, value)        ; break
    case '[object Object]'  : clone = cloneObject(options, seen, value)       ; break
    case '[object Set]'     : clone = cloneSet(options, seen, value)          ; break
    case '[object Map]'     : clone = cloneMap(options, seen, value)          ; break
    case '[object Date]'    : clone = new Date(value.getTime())               ; break
    case '[object RegExp]'  : clone = new RegExp(value.source, value.flags)   ; break
    default                 : clone = options.fallback(value)                 ; break
  }

  if(options.preservesImutable
  && value && typeof value === 'object'
  && clone && typeof clone === 'object')
  {
    if(false === Object.isExtensible(value))
    {
      Object.preventExtensions(clone)
    }

    if(Object.isSealed(value))
    {
      Object.seal(clone)
    }

    if(Object.isFrozen(value))
    {
      Object.freeze(clone)
    }
  }

  return clone
}

function cloneArray(options, seen, array) 
{
  const already = seen.get(array)

  if(already) 
  {
    return already
  }

  const clone = new Array(array.length)

  seen.set(array, clone)

  for(let i = 0; i < array.length; i++)
  {
    clone[i] = deepClone(options, seen, array[i])
  }

  return clone
}

function cloneObject(options, seen, value)
{
  if(typeof value !== 'object' || value === null) 
  {
    return value
  }

  const already = seen.get(value)

  if(already) 
  {
    return already
  }

  const clone = Object.create(Object.getPrototypeOf(value))

  seen.set(value, clone)

  for (const key of Reflect.ownKeys(value))
  {
    cloneProperty(options, seen, value, clone, key)
  }

  return clone
}

function cloneSet(options, seen, set)
{
  const already = seen.get(set)

  if(already)
  {
    return already
  }

  const clone = new Set()
  
  seen.set(set, clone)

  for(const value of set)
  {
    clone.add(deepClone(options, seen, value))
  }

  return clone
}

function cloneMap(options, seen, map)
{
  const already = seen.get(map)

  if(already)
  {
    return already
  }

  const clone = new Map()
  
  seen.set(map, clone)

  for(const [key, value] of map)
  {
    clone.set(
      deepClone(options, seen, key),
      deepClone(options, seen, value)
    )
  }

  return clone
}

function cloneProperty(options, seen, src, target, key)
{
  const descriptor = Object.getOwnPropertyDescriptor(src, key)

  if(!descriptor)
  {
    return
  }

  if('value' in descriptor)
  {
    const clonedValue = deepClone(options, seen, descriptor.value)

    Object.defineProperty(target, key,
    {
      enumerable    : options.preservesEnumerable ? descriptor.enumerable   : true,
      writable      : options.preservesImutable   ? descriptor.writable     : true,
      configurable  : options.preservesImutable   ? descriptor.configurable : true,
      value         : clonedValue
    })
  }
  else
  {
    Object.defineProperty(target, key,
    {
      enumerable    : options.preservesEnumerable ? descriptor.enumerable   : true,
      configurable  : options.preservesImutable   ? descriptor.configurable : true,
      get           : descriptor.get,
      set           : descriptor.set
    })
  }
}
