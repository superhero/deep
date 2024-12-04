export default function clone(input) 
{
  const seen = new WeakSet()
  return deepClone(input, seen)
}

function deepClone(value, seen) 
{
  switch(Object.prototype.toString.call(value))
  {
    case '[object Array]'  : return cloneArray(value, seen)
    case '[object Object]' : return cloneObject(value, seen)
  }

  return structuredClone(value)
}

function cloneArray(array, seen) 
{
  if(seen.has(array)) 
  {
    return array
  }

  seen.add(array)
  return array.map((item) => deepClone(item, seen))
}

function cloneObject(obj, seen) 
{
  if(seen.has(obj)) 
  {
    return obj
  }

  seen.add(obj)

  const output = {}

  for(const key of Object.getOwnPropertyNames(obj)) 
  {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key)
    Object.defineProperty(output, key, 
      { ...descriptor, value : deepClone(descriptor.value, seen) })
  }

  return output
}