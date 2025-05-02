export default function clone(input, options = {}) 
{
  const seen = new WeakSet()

  options.preservesImutable   = options.preservesImutable   ?? false
  options.preservesEnumerable = options.preservesEnumerable ?? true
  options.fallback            = options.fallback            ?? cloneFallback.bind(null, options, seen)

  return deepClone(input, options, seen)
}

function deepClone(value, options, seen) 
{
  switch(Object.prototype.toString.call(value))
  {
    case '[object Array]'  : return cloneArray(value, options, seen)
    case '[object Object]' : return cloneObject(value, options, seen)
  }

  return options.fallback(value)
}

function cloneArray(array, options, seen) 
{
  if(seen.has(array)) 
  {
    return array
  }

  seen.add(array)
  return array.map((item) => deepClone(item, options, seen))
}

function cloneObject(obj, options, seen) 
{
  if(seen.has(obj)) 
  {
    return obj
  }

  seen.add(obj)

  const output = {}

  for(const key of Object.getOwnPropertyNames(obj)) 
  {
    if(options.preservesImutable)
    {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key)
      Object.defineProperty(output, key, 
      { 
        enumerable    : options.preservesEnumerable ? descriptor.enumerable : true,
        writable      : descriptor.writable, 
        configurable  : descriptor.configurable, 
        value         : deepClone(descriptor.value, options, seen) 
      })
      continue
    }
    else if(options.preservesEnumerable)
    {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key)
      Object.defineProperty(output, key, 
      { 
        enumerable    : descriptor.enumerable, 
        writable      : true, 
        configurable  : true, 
        value         : deepClone(descriptor.value, options, seen) 
      })
      continue
    }
    else
    {
      output[key] = deepClone(obj[key], options, seen)
    }
  }

  return output
}

function cloneFallback(options, seen, value)
{
  if(typeof value !== 'object'
  || value === null) 
  {
    return value
  }

  const clone = Object.create(Object.getPrototypeOf(value))
  for(const key in value) 
  {
    clone[key] = deepClone(value[key], options, seen)
  }

  return clone
}