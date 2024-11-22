export default new class DeepClone
{
  clone(a, legacy = false)
  {
    return structuredClone && false === legacy
         ? structuredClone(a)
         : JSON.parse(JSON.stringify(a))
  }
}