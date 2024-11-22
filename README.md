
# README: Deep Utilities

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

deepassign.assign(target, source)

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

const result = deepmerge.merge(obj1, obj2)

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

deepfreeze.freeze(obj)

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

const clone = deepclone.clone(obj)

console.log(clone) // Deeply cloned object
console.log(clone === obj) // false
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
  ✔ Merges arrays correctly (2.205053ms)
  ✔ Merges objects correctly (0.37599ms)
  ✔ Overwrites non-object properties correctly (0.211516ms)
  ✔ Handles undefined values correctly (0.174874ms)
  ▶ Descriptor properties
    ▶ Retains
      ✔ non-writable, non-configurable and non-enumarable (0.302976ms)
      ✔ writable but non-configurable and non-enumarable (0.250721ms)
      ✔ writable and configurable but non-enumarable (0.148421ms)
    ✔ Retains (0.912545ms)
    ▶ Assigns
      ✔ non-writable, non-configurable and non-enumarable (0.266101ms)
    ✔ Assigns (1.379408ms)
  ✔ Descriptor properties (2.578897ms)
  ✔ Merges nested arrays correctly (0.188364ms)
  ✔ Merges nested objects correctly (0.159693ms)
  ✔ Does not alter objects with no conflicts (0.127767ms)
✔ @superhero/deep/assign (7.763161ms)

▶ @superhero/deep/clone
  ✔ Clones simple objects (2.379372ms)
  ✔ Clones nested objects (0.316103ms)
  ✔ Clones arrays (0.31091ms)
  ✔ Handles circular references (0.204913ms)
  ✔ Clones objects with null prototype (0.385473ms)
✔ @superhero/deep/clone (5.133978ms)

▶ @superhero/deep/freeze
  ✔ Freezes a simple object (1.831304ms)
  ✔ Freezes nested objects recursively (0.242757ms)
  ✔ Handles circular references gracefully (0.155595ms)
  ✔ Freezes objects with symbols (0.190945ms)
  ✔ Handles already frozen objects without error (0.129469ms)
  ✔ Freezes objects with non-enumerable properties (0.193278ms)
  ✔ Freezes arrays (0.168815ms)
  ✔ Handles objects with null prototype (0.160426ms)
  ✔ Freezes objects with multiple property types (0.351257ms)
✔ @superhero/deep/freeze (5.204715ms)

▶ @superhero/deep/merge
  ✔ Merges arrays with unique values (2.511877ms)
  ✔ Merges arrays with order preserved (0.324244ms)
  ✔ Handles empty arrays correctly (0.319828ms)
  ✔ Handles arrays with duplicate values (0.258181ms)
  ✔ Merges objects and prioritizes restrictive descriptors (0.462677ms)
  ✔ Merges objects with non-enumerable properties (0.203703ms)
  ✔ Handles nested object merging (0.198121ms)
  ✔ Stops at circular references (0.137618ms)
  ✔ Stops when nested and with circular references (0.34896ms)
  ✔ Returns second value for non-object types (0.230399ms)
  ✔ Handles multiple merges sequentially (0.294846ms)
✔ @superhero/deep/merge (7.196893ms)

tests 36
pass 36

-----------------------------------------------------------------
file             | line % | branch % | funcs % | uncovered lines
-----------------------------------------------------------------
assign.js        | 100.00 |   100.00 |  100.00 | 
assign.test.js   | 100.00 |   100.00 |  100.00 | 
clone.js         | 100.00 |   100.00 |  100.00 | 
clone.test.js    |  96.34 |    87.50 |  100.00 | 56-58
freeze.js        | 100.00 |   100.00 |  100.00 | 
freeze.test.js   | 100.00 |   100.00 |  100.00 | 
merge.js         | 100.00 |   100.00 |  100.00 | 
merge.test.js    | 100.00 |   100.00 |  100.00 | 
-----------------------------------------------------------------
all files        |  99.65 |    99.15 |  100.00 | 
-----------------------------------------------------------------
```

---

## License
This project is licensed under the MIT License.

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
