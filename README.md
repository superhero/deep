
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

## 5. **Deep**

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
deep.merge(/* ... */)
```

### Example:
```javascript
import { assign, clone, freeze, merge } from '@superhero/deep'

assign(/* ... */)
clone(/* ... */)
freeze(/* ... */)
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
  ✔ Assigns arrays correctly (1.993351ms)
  ✔ Assigns objects correctly (0.797187ms)
  ✔ Overwrites non-object properties correctly (0.311862ms)
  ✔ Handles undefined values correctly (0.67959ms)
  ▶ Descriptor properties
    ▶ Retains
      ✔ non-writable, non-configurable and non-enumarable (0.365558ms)
      ✔ writable but non-configurable and non-enumarable (0.384859ms)
      ✔ writable and configurable but non-enumarable (0.24546ms)
    ✔ Retains (1.395563ms)
    ▶ Assigns
      ✔ non-writable, non-configurable and non-enumarable (0.246451ms)
    ✔ Assigns (0.528402ms)
  ✔ Descriptor properties (2.438803ms)
  ✔ Merges nested arrays correctly (1.67104ms)
  ✔ Merges nested objects correctly (0.649403ms)
  ✔ Does not alter objects with no conflicts (0.219023ms)
✔ @superhero/deep/assign (10.784739ms)

▶ @superhero/deep/clone
  ✔ Clones simple objects (3.898407ms)
  ✔ Clones nested objects (0.358366ms)
  ✔ Clones arrays (0.347023ms)
  ✔ Handles circular references (0.190668ms)
  ✔ Clones objects with null prototype (0.302189ms)
✔ @superhero/deep/clone (6.720191ms)

▶ @superhero/deep/freeze
  ✔ Freezes a simple object (2.561531ms)
  ✔ Freezes nested objects recursively (0.357866ms)
  ✔ Handles circular references gracefully (0.308297ms)
  ✔ Freezes objects with symbols (0.210516ms)
  ✔ Handles already frozen objects without error (0.157051ms)
  ✔ Freezes objects with non-enumerable properties (0.214033ms)
  ✔ Freezes arrays (0.244445ms)
  ✔ Handles objects with null prototype (0.337528ms)
  ✔ Freezes objects with multiple property types (0.525787ms)
✔ @superhero/deep/freeze (7.261487ms)

▶ @superhero/deep
  ✔ All functions are accessible as a member to the default import object (1.250244ms)
  ✔ All functions are accessible to import from the default import object (0.23689ms)
✔ @superhero/deep (3.080305ms)

▶ @superhero/deep/merge
  ✔ Merges arrays with unique values (3.122153ms)
  ✔ Merges arrays with order preserved (0.298964ms)
  ✔ Handles empty arrays correctly (0.275066ms)
  ✔ Handles arrays with duplicate values (0.492229ms)
  ✔ Merges objects and prioritizes restrictive descriptors (0.623443ms)
  ✔ Merges objects with non-enumerable properties (0.342317ms)
  ✔ Handles nested object merging (0.43726ms)
  ✔ Stops at circular references (0.827394ms)
  ✔ Stops when nested and with circular references (0.720571ms)
  ✔ Returns second value for non-object types (0.925228ms)
  ✔ Handles multiple merges sequentially (0.359582ms)
✔ @superhero/deep/merge (12.298476ms)

tests 38
suites 8
pass 38

-----------------------------------------------------------------
file             | line % | branch % | funcs % | uncovered lines
-----------------------------------------------------------------
assign.js        | 100.00 |   100.00 |  100.00 | 
assign.test.js   | 100.00 |   100.00 |  100.00 | 
clone.js         | 100.00 |   100.00 |  100.00 | 
clone.test.js    |  96.34 |    87.50 |  100.00 | 56-58
freeze.js        | 100.00 |   100.00 |  100.00 | 
freeze.test.js   | 100.00 |   100.00 |  100.00 | 
index.js         | 100.00 |   100.00 |  100.00 | 
index.test.js    | 100.00 |   100.00 |  100.00 | 
merge.js         | 100.00 |   100.00 |  100.00 | 
merge.test.js    | 100.00 |   100.00 |  100.00 | 
-----------------------------------------------------------------
all files        |  99.66 |    99.19 |  100.00 | 
-----------------------------------------------------------------
```

---

## License
This project is licensed under the MIT License.

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
