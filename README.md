
# Deep Utilities

This repository contains a set of deep utility classes for handling common operations like cloning, freezing, merging, and assigning objects and arrays. Below is the documentation for each utility class, its purpose, and examples.

---

## 1. **DeepAssign**

### Purpose:
Deeply assigns properties from one or more source objects to a target object. Handles nested structures, arrays, and property descriptors.

### Features:
- Merges arrays with unique values.
- Deeply merges nested objects.
- Handles property descriptors (`writable`, `configurable`, `enumerable`).

### Example:
```javascript
import deepassign from '@superhero/deep/assign'

const target = { foo: { bar: 1 } }
const source = { foo: { baz: 2 } }

deepassign(target, source)

console.log(target) // { foo: { bar: 1, baz: 2 } }
```

---

## 2. **DeepMerge**

### Purpose:
Deeply merges two or more objects into a new object. Handles nested structures, circular references, arrays, and property descriptors.

### Features:
- Merges arrays with unique values while maintaining order.
- Merges nested objects with priority for restrictive property descriptors.
- Detects and handles circular references.

### Example:
```javascript
import deepmerge from '@superhero/deep/merge'

const obj1 = { foo: { bar: 1 }, arr: [1, 2] }
const obj2 = { foo: { baz: 2 }, arr: [2, 3] }

const result = deepmerge(obj1, obj2)

console.log(result)
// { foo: { bar: 1, baz: 2 }, arr: [1, 2, 3] }
```

---

## 3. **DeepFreeze**

### Purpose:
Recursively freezes an object, making it immutable. Handles nested structures and circular references.

### Features:
- Freezes nested objects and arrays.
- Handles circular references gracefully.

### Example:
```javascript
import deepfreeze from '@superhero/deep/freeze'

const obj = { foo: { bar: 'baz' } }
obj.foo.self = obj.foo // Circular reference

deepfreeze(obj)

obj.foo.bar = 'new value' // TypeError: Cannot assign to read-only property
```

---

## 4. **DeepClone**

### Purpose:
Creates a deep clone of an object. Supports nested structures, circular references, arrays, and custom serialization methods.

### Features:
- Uses `structuredClone` if available, falling back to JSON-based cloning.
- Handles nested objects, arrays, and custom `toJSON` methods.
- Supports circular references if `structuredClone` is available.

### Example:
```javascript
import deepclone from '@superhero/deep/clone'

const obj = { foo: { bar: 'baz' }, arr: [1, 2, 3] }

const clone = deepclone(obj)

console.log(clone) // Deeply cloned object
console.log(clone === obj) // false
```

---

## 5. **DeepIntersect**

### Purpose:
Performs a deep intersection between two or more values. Supports objects, arrays, and nested structures, and handles circular references. Values are strictly compared when considered intersecting.

### Features:
- Intersects arrays by values.
- Intersects objects only when the key exists in all sources and the values intersect deeply.
- Preserves intersected restrictive property descriptors (`writable`, `configurable`, `enumerable`).
- Detects and throws on circular references.

### Example:
```javascript
import deepintersect from '@superhero/deep/intersect'

const a = { foo: { bar: 1 }, arr: [1, 2, 3] }
const b = { foo: { bar: 1, baz: 2 }, arr: [1, 4, 3] }

const result = deepintersect(a, b)

console.log(result)
// { foo: { bar: 1 }, arr: [1, 3] }
```

#### Note:
- If two values are loosely equal, but of different types, they do not intersect.

- Arrays with nested objects can only be compared if the nested structure shares the same index between the compared arrays.

- A circular structure throws a CircularReferenceError (ReferenceError) with the code `E_DEEP_INTERSECT_CIRCULAR_REFERENCE`.

---

## 6. **Deep**

### Purpose:
Makes the functions accessible through the imported default object.

### Features:
- Exports all the above mentioned functions.
- Exports a default object with all the above mentioned functions as members.

### Example:
```javascript
import deep from '@superhero/deep'

deep.assign(/* ... */)
deep.clone(/* ... */)
deep.freeze(/* ... */)
deep.intersect(/* ... */)
deep.merge(/* ... */)
```

### Example:
```javascript
import { assign, clone, freeze, intersect, merge } from '@superhero/deep'

assign(/* ... */)
clone(/* ... */)
freeze(/* ... */)
intersect(/* ... */)
merge(/* ... */)
```

---

## Testing
Each utility class has a set of unit tests to ensure correctness across different cases.

### Run Tests
To execute the tests:
```bash
npm test
```

### Test Coverage

```
▶ @superhero/deep/assign
  ✔ Assigns arrays correctly (3.552823ms)
  ✔ Assigns objects correctly (0.702394ms)
  ✔ Overwrites non-object properties correctly (1.106746ms)
  ✔ Handles undefined values correctly (0.592877ms)

  ▶ Descriptor properties
    ▶ Retains
      ✔ non-writable, non-configurable and non-enumarable (0.774514ms)
      ✔ writable but non-configurable and non-enumarable (0.490026ms)
      ✔ writable and configurable but non-enumarable (0.314062ms)
    ✔ Retains (2.377181ms)

    ▶ Assigns
      ✔ non-writable, non-configurable and non-enumarable (0.415235ms)
    ✔ Assigns (0.824789ms)
  ✔ Descriptor properties (3.881836ms)

  ✔ Merges nested arrays correctly (6.642858ms)
  ✔ Merges nested objects correctly (0.731397ms)
  ✔ Does not alter objects with no conflicts (0.27423ms)
✔ @superhero/deep/assign (20.322649ms)

▶ @superhero/deep/clone
  ✔ Clones simple objects (6.103605ms)
  ✔ Clones nested objects (0.771236ms)
  ✔ Preserves descriptors (1.57539ms)
  ✔ Clones arrays (1.604074ms)
  ✔ Handles circular references (0.507477ms)
  ✔ Clones objects with null prototype (1.230476ms)
✔ @superhero/deep/clone (14.513864ms)

▶ @superhero/deep/freeze
  ✔ Freezes a simple object (2.735609ms)
  ✔ Freezes nested objects recursively (0.40638ms)
  ✔ Handles circular references gracefully (0.781639ms)
  ✔ Freezes objects with symbols (0.455776ms)
  ✔ Handles already frozen objects without error (0.342712ms)
  ✔ Freezes objects with non-enumerable properties (0.455515ms)
  ✔ Freezes arrays (0.61924ms)
  ✔ Handles objects with null prototype (0.57424ms)
  ✔ Freezes objects with multiple property types (0.984788ms)
✔ @superhero/deep/freeze (12.988297ms)

▶ @superhero/deep
  ✔ All functions are accessible as a member to the default import object (1.908797ms)
  ✔ All functions are accessible to import from the default import object (0.603152ms)
✔ @superhero/deep (7.176949ms)

▶ @superhero/deep/intersect
  ✔ Intersects arrays by value and position (5.556412ms)
  ✔ Intersects nested arrays (0.312899ms)
  ✔ Handles empty array intersection (0.297251ms)
  ✔ Intersects objects with matching keys and values (0.554782ms)
  ✔ Deeply intersects nested objects (0.568448ms)
  ✔ Intersection stops at type mismatch (0.278157ms)
  ✔ Throws on circular references (1.779685ms)
  ✔ Intersects arrays with undefined positions (0.702569ms)
  ✔ Handles intersection of primitive types (0.525931ms)
  ✔ Returns undefined for non-intersecting primitives (0.867342ms)
  ✔ Handles multiple sequential intersections (0.836957ms)
✔ @superhero/deep/intersect (15.753992ms)

▶ @superhero/deep/merge
  ✔ Merges arrays with unique values (4.014593ms)
  ✔ Merges arrays with order preserved (0.431737ms)
  ✔ Handles empty arrays correctly (0.409507ms)
  ✔ Handles arrays with duplicate values (0.501899ms)
  ✔ Merges objects and prioritizes restrictive descriptors (0.804508ms)
  ✔ Merges objects with non-enumerable properties (0.802831ms)
  ✔ Handles nested object merging (0.709563ms)
  ✔ Stops at circular references (0.768717ms)
  ✔ Stops when nested and with circular references (1.386111ms)
  ✔ Returns second value for non-object types (1.438328ms)
  ✔ Handles multiple merges sequentially (0.494506ms)
✔ @superhero/deep/merge (14.798621ms)

tests 50
suites 9
pass 50

------------------------------------------------------------------------
file                | line % | branch % | funcs % | uncovered lines
------------------------------------------------------------------------
assign.js           |  97.80 |    96.15 |  100.00 | 15-16
assign.test.js      | 100.00 |   100.00 |  100.00 | 
clone.js            |  95.83 |    93.33 |  100.00 | 22-23
clone.test.js       | 100.00 |   100.00 |  100.00 | 
freeze.js           | 100.00 |   100.00 |  100.00 | 
freeze.test.js      | 100.00 |   100.00 |  100.00 | 
index.js            | 100.00 |   100.00 |  100.00 | 
index.test.js       | 100.00 |   100.00 |  100.00 | 
intersect.js        |  94.77 |    91.18 |  100.00 | 70-71 85-86 134-137
intersect.test.js   | 100.00 |   100.00 |  100.00 | 
merge.js            |  98.72 |    96.30 |  100.00 | 81-82
merge.test.js       | 100.00 |   100.00 |  100.00 | 
------------------------------------------------------------------------
all files           |  98.84 |    96.81 |  100.00 | 
------------------------------------------------------------------------
```

---

## License
This project is licensed under the MIT License.

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
