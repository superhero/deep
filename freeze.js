export default function freeze(obj)
{
  const seen = new WeakSet
  freezeIterator(obj, seen)
}

function freezeIterator(obj, seen)
{
  const objType = Object.prototype.toString.call(obj)

  if('[object Array]'   === objType
  || '[object Object]'  === objType)
  {
    if(seen.has(obj))
    {
      return
    }
    else
    {
      seen.add(obj)
    }

    for(const key of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)])
    {
      freezeIterator(obj[key], seen)
    }

    Object.freeze(obj)
  }
}