import deepclone from '@superhero/deep/clone'

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

  if('[object Set]' === aType
  && '[object Set]' === bType)
  {
    return mergeSet(a, b)
  }

  if('[object Map]' === aType
  && '[object Map]' === bType)
  {
    return mergeMap(a, b, seen)
  }

  return b
}

function mergeArray(a, b)
{
  return [...new Set(a.concat(b))]
}

function mergeSet(a, b)
{
  return new Set([...a, ...b])
}

function mergeMap(a, b, seen)
{
  if(seen.has(a))
  {
    return b
  }

  seen.add(a)

  const output = new Map(a)

  for(const [key, bValue] of b)
  {
    if(output.has(key))
    {
      const aValue = output.get(key)
      output.set(key, mergeAandB(aValue, bValue, seen))
    }
    else
    {
      output.set(key, bValue)
    }
  }

  return output
}
function mergeObject(a, b, seen)
{
  if(seen.has(a))
  {
    return b
  }

  seen.add(a)

  const output = Object.create(Object.getPrototypeOf(a))

  // copy keys unique to a
  for(const key of Reflect.ownKeys(a))
  {
    if(Object.prototype.hasOwnProperty.call(b, key))
    {
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(a, key)
    if(descriptor)
    {
      Object.defineProperty(output, key, descriptor)
    }
  }

  // merge/copy keys from b
  for(const key of Reflect.ownKeys(b))
  {
    if(Object.prototype.hasOwnProperty.call(a, key))
    {
      const da = Object.getOwnPropertyDescriptor(a, key)
      const db = Object.getOwnPropertyDescriptor(b, key)

      if(!da || !db)
      {
        continue
      }

      Object.defineProperty(output, key, mergeDescriptor(da, db, seen))
    }
    else
    {
      const descriptor = Object.getOwnPropertyDescriptor(b, key)
      if(descriptor)
      {
        Object.defineProperty(output, key, descriptor)
      }
    }
  }

  return output
}

function mergeDescriptor(da, db, seen)
{
  const enumerable   = (da.enumerable   ?? true) && (db.enumerable   ?? true)
  const configurable = (da.configurable ?? true) && (db.configurable ?? true)

  const aIsData = 'value' in da
  const bIsData = 'value' in db

  // data + data: keep “most restrictive” flags and merge the values
  if(aIsData && bIsData)
  {
    const writable = (da.writable ?? true) && (db.writable ?? true)

    return {
      enumerable,
      configurable,
      writable,
      value: mergeAandB(da.value, db.value, seen)
    }
  }

  // accessor + accessor: keep “most restrictive” flags and combine get/set
  // (b wins when both define the same accessor)
  if(!aIsData && !bIsData)
  {
    return {
      enumerable,
      configurable,
      get: db.get ?? da.get,
      set: db.set ?? da.set
    }
  }

  // mixed (data vs accessor): do NOT evaluate accessors; prefer b’s shape,
  // but apply “most restrictive” flags
  if(bIsData)
  {
    return {
      enumerable,
      configurable,
      writable: (da.writable ?? true) && (db.writable ?? true),
      value: db.value
    }
  }

  return {
    enumerable,
    configurable,
    get: db.get,
    set: db.set
  }
}
