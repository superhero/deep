export default function assign(a, ...b)
{
  b.forEach((b) => assignB2A(a, b))
}

function assignB2A(a, b)
{
  if(b === undefined)
  {
    return a
  }

  if(Object.prototype.toString.call(a) === '[object Array]'
  && Object.prototype.toString.call(b) === '[object Array]')
  {
    return assignArray(a, b)
  }

  if(Object.prototype.toString.call(a) === '[object Object]'
  && Object.prototype.toString.call(b) === '[object Object]')
  {
    return assignObject(a, b)
  }

  return b
}

function assignArray(a, b)
{
  const values = new Set(a.concat(b))
  a.length = 0
  a.push(...values)
  return a
}

/**
 * @param {Object} a 
 * @param {Object} b 
 * 
 * @throws {TypeError} If a property in "a" is also in "b", 
 *                     but the property in "a" is not configurable.
 * 
 * @returns {Object} a
 */
function assignObject(a, b)
{
  for (const key of Object.getOwnPropertyNames(b))
  {
    if(Object.prototype.toString.call(a[key]) === '[object Object]'
    && Object.prototype.toString.call(b[key]) === '[object Object]')
    {
      assignObject(a[key], b[key])
    }
    else if(Object.hasOwnProperty.call(a, key))
    {
      const descriptor_a = Object.getOwnPropertyDescriptor(a, key)

      if(descriptor_a.configurable)
      {
        assignPropertyDescriptor(a, b, key)
      }
      else if(descriptor_a.writable)
      {
        descriptor_a.value = b[key]
        Object.defineProperty(a, key, descriptor_a)
      }
      else
      {
        continue
      }
    }
    else
    {
      assignPropertyDescriptor(a, b, key)
    }
  }

  return a
}

function assignPropertyDescriptor(a, b, key)
{
  const descriptor_b = Object.getOwnPropertyDescriptor(b, key)
  descriptor_b.value = assignB2A(a[key], b[key])
  Object.defineProperty(a, key, descriptor_b)
}