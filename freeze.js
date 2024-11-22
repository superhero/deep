export default new class DeepFreeze
{
  freeze(obj)
  {
    const seen = new WeakSet
    this.#freeze(obj, seen)
  }

  #freeze(obj, seen)
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
        this.#freeze(obj[key], seen)
      }

      Object.freeze(obj)
    }
  }
}