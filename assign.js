export default function assign(a, ...b)
{
  b.forEach((b) => assignB2A(a, b))
  return a
}

function assignB2A(a, b)
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

  if(aType === '[object Array]' && bType === '[object Array]')
  {
    return assignArray(a, b)
  }

  if(aType === '[object Object]' && bType === '[object Object]')
  {
    return assignObject(a, b)
  }

  if(aType === '[object Set]' && bType === '[object Set]')
  {
    return assignSet(a, b)
  }

  if(aType === '[object Map]' && bType === '[object Map]')
  {
    return assignMap(a, b)
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

function assignSet(a, b)
{
  for(const v of b)
  {
    a.add(v)
  }
  return a
}

function assignMap(a, b)
{
  for(const [k, v] of b)
  {
    if(a.has(k))
    {
      a.set(k, assignB2A(a.get(k), v))
    }
    else
    {
      a.set(k, v)
    }
  }
  return a
}

/**
 * Mutates "a" by assigning properties from "b".
 *
 * Rules:
 * - If both sides are plain objects, recurse.
 * - If property exists in a:
 *   - if configurable: redefine with b's descriptor (value is assigned/merged)
 *   - else if writable and data property: write value
 *   - else: leave as-is
 * - Accessors are copied as accessors; never forced into data descriptors.
 */
function assignObject(a, b)
{
  for(const key of Reflect.ownKeys(b))
  {
    const
      hasA = Object.prototype.hasOwnProperty.call(a, key),
      da   = hasA ? Object.getOwnPropertyDescriptor(a, key) : undefined,
      db   = Object.getOwnPropertyDescriptor(b, key)

    if(!db)
    {
      continue
    }

    const aIsData = !!da && ('value' in da)
    const bIsData = 'value' in db

    // recurse only when both are data props holding plain objects
    if(hasA
    && aIsData
    && bIsData
    && Object.prototype.toString.call(da.value) === '[object Object]'
    && Object.prototype.toString.call(db.value) === '[object Object]')
    {
      assignObject(da.value, db.value)
      continue
    }

    if(hasA)
    {
      // if not configurable, we can only write if it's a writable data prop
      if(da && da.configurable)
      {
        assignPropertyDescriptor(a, da, db, key)
      }
      else if(da && ('value' in da) && da.writable)
      {
        // only safe for data properties
        const next = assignB2A(da.value, bIsData ? db.value : undefined)
        Object.defineProperty(a, key, { ...da, value: next })
      }
      else
      {
        continue
      }
    }
    else
    {
      // define new property with b's descriptor, but merge the value if needed
      assignPropertyDescriptor(a, undefined, db, key)
    }
  }

  return a
}

function assignPropertyDescriptor(a, da, db, key)
{
  // Accessor: copy as-is (no merging of get/set)
  if(!('value' in db))
  {
    Object.defineProperty(a, key, db)
    return
  }

  const aValue = da && ('value' in da) ? da.value : undefined
  const next   = assignB2A(aValue, db.value)

  const descriptor = { ...db, value: next }
  Object.defineProperty(a, key, descriptor)
}
