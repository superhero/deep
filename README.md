
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

## 6. **DeepEqual**

### Purpose:
Performs a deep equal compare between two values. Supports objects, arrays, and nested structures, and handles circular references. Values are strictly compared by default.

### Features:
- Compares first and second argument - returns a boolean.
- Can perform a loose compare by passing a false third argument.

### Example:
```javascript
import deepequal from '@superhero/deep/equal'

const a = { foo: { bar: 1 }, arr: [1, 2, 3] }
const b = { foo: { bar: 1 }, arr: [1, 2, 3] }
const c = { foo: { bar: 1 }, arr: ['1', '2', '3'] }

deepequal(a, b)         // true
deepequal(a, c)         // false
deepequal(a, c, false)  // true
deepequal(a, b, false)  // true
deepequal(a, b, c)      // throws AssertionError
```

---

## 7. **Deep**

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
deep.equal(/* ... */)
deep.freeze(/* ... */)
deep.intersect(/* ... */)
deep.merge(/* ... */)
```

### Example:
```javascript
import { assign, clone, equal, freeze, intersect, merge } from '@superhero/deep'

assign(/* ... */)
clone(/* ... */)
equal(/* ... */)
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
  ✔ Assigns arrays correctly (2.973718ms)
  ✔ Assigns objects correctly (0.70144ms)
  ✔ Overwrites non-object properties correctly (0.318183ms)
  ✔ Handles undefined values correctly (1.009161ms)
  ▶ Descriptor properties
    ▶ Retains
      ✔ non-writable, non-configurable and non-enumarable (0.479579ms)
      ✔ writable but non-configurable and non-enumarable (0.466066ms)
      ✔ writable and configurable but non-enumarable (0.309409ms)
    ✔ Retains (1.735145ms)
    
    ▶ Assigns
      ✔ non-writable, non-configurable and non-enumarable (0.384251ms)
    ✔ Assigns (0.73481ms)
  ✔ Descriptor properties (3.130721ms)
  ✔ Merges nested arrays correctly (2.917128ms)
  ✔ Merges nested objects correctly (0.937044ms)
  ✔ Does not alter objects with no conflicts (0.274969ms)
✔ @superhero/deep/assign (15.154613ms)

▶ @superhero/deep/clone
  ✔ Clones simple objects (3.281531ms)
  ✔ Clones nested objects (0.470928ms)
  ✔ Do not preserves descriptors (0.56486ms)
  ✔ Preserves descriptors (0.547388ms)
  ✔ Does not preserve frozen object state (1.833744ms)
  ✔ Clones arrays (0.707413ms)
  ✔ Handles circular references (0.320116ms)
  ✔ Clones objects with null prototype (0.620148ms)
✔ @superhero/deep/clone (12.239426ms)

▶ @superhero/deep/equal
  ✔ Strict equality: same values, same types (5.24189ms)
  ✔ Strict equality: fails on type mismatch (0.422575ms)
  ✔ Loose equality: same values, different types (0.457711ms)
  ✔ Loose equality: different values (1.583009ms)
  ✔ Deep equality with nested structure (0.678751ms)
  ✔ Fails on missing property (0.721941ms)
  ✔ Validates third argument is boolean (2.323427ms)
✔ @superhero/deep/equal (13.789463ms)

▶ @superhero/deep/freeze
  ✔ Freezes a simple object (3.92657ms)
  ✔ Freezes nested objects recursively (0.371321ms)
  ✔ Handles circular references gracefully (1.267506ms)
  ✔ Freezes objects with symbols (0.444381ms)
  ✔ Handles already frozen objects without error (0.930388ms)
  ✔ Freezes objects with non-enumerable properties (0.455779ms)
  ✔ Freezes arrays (0.477364ms)
  ✔ Handles objects with null prototype (0.536402ms)
  ✔ Freezes objects with multiple property types (0.776249ms)
✔ @superhero/deep/freeze (15.887295ms)

▶ @superhero/deep
  ✔ All functions are accessible as a member to the default import object (1.711564ms)
  ✔ All functions are accessible to import from the default import object (0.375857ms)
✔ @superhero/deep (4.37013ms)

▶ @superhero/deep/intersect
  ✔ Intersects arrays by value and position (5.404912ms)
  ✔ Intersects nested arrays (0.367099ms)
  ✔ Handles empty array intersection (0.687107ms)
  ✔ Intersects objects with matching keys and values (2.015991ms)
  ✔ Deeply intersects nested objects (0.501549ms)
  ✔ Intersection stops at type mismatch (0.423998ms)
  ✔ Throws on circular references (1.079638ms)
  ✔ Intersects arrays with undefined positions (0.399501ms)
  ✔ Handles intersection of primitive types (0.576801ms)
  ✔ Returns undefined for non-intersecting primitives (2.684012ms)
  ✔ Handles multiple sequential intersections (0.511929ms)
✔ @superhero/deep/intersect (19.049326ms)

▶ @superhero/deep/merge
  ✔ Merges arrays with unique values (4.448622ms)
  ✔ Merges arrays with order preserved (0.439982ms)
  ✔ Handles empty arrays correctly (0.291365ms)
  ✔ Handles arrays with duplicate values (0.497621ms)
  ✔ Merges objects and prioritizes restrictive descriptors (3.844952ms)
  ✔ Merges objects with non-enumerable properties (0.710082ms)
  ✔ Handles nested object merging (0.412465ms)
  ✔ Stops at circular references (0.446904ms)
  ✔ Stops when nested and with circular references (1.003584ms)
  ✔ Returns second value for non-object types (3.370647ms)
  ✔ Handles multiple merges sequentially (10.429993ms)
✔ @superhero/deep/merge (37.960347ms)

tests 59
suites 10
pass 59

------------------------------------------------------------------------
file                | line % | branch % | funcs % | uncovered lines
------------------------------------------------------------------------
assign.js           |  97.80 |    96.15 |  100.00 | 15-16
assign.test.js      | 100.00 |   100.00 |  100.00 | 
clone.js            |  89.47 |    83.33 |  100.00 | 27-28 87-94
clone.test.js       | 100.00 |   100.00 |  100.00 | 
equal.js            |  87.10 |    85.71 |  100.00 | 26-29
equal.test.js       | 100.00 |   100.00 |  100.00 | 
freeze.js           | 100.00 |   100.00 |  100.00 | 
freeze.test.js      | 100.00 |   100.00 |  100.00 | 
index.js            | 100.00 |   100.00 |  100.00 | 
index.test.js       | 100.00 |   100.00 |  100.00 | 
intersect.js        |  95.15 |    91.67 |  100.00 | 70-71 97-98 146-149
intersect.test.js   | 100.00 |   100.00 |  100.00 | 
merge.js            |  98.72 |    96.30 |  100.00 | 81-82
merge.test.js       | 100.00 |   100.00 |  100.00 | 
------------------------------------------------------------------------
all files           |  98.15 |    95.43 |  100.00 | 
------------------------------------------------------------------------
```

---

## License
This project is licensed under the MIT License.

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
