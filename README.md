
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
  ✔ Assigns arrays correctly (3.167398ms)
  ✔ Assigns objects correctly (0.763768ms)
  ✔ Overwrites non-object properties correctly (0.347727ms)
  ✔ Handles undefined values correctly (0.521744ms)

  ▶ Descriptor properties
    ▶ Retains
      ✔ non-writable, non-configurable and non-enumarable (0.474666ms)
      ✔ writable but non-configurable and non-enumarable (0.649244ms)
      ✔ writable and configurable but non-enumarable (0.298073ms)
    ✔ Retains (1.918778ms)

    ▶ Assigns
      ✔ non-writable, non-configurable and non-enumarable (0.485428ms)
    ✔ Assigns (0.889839ms)
  ✔ Descriptor properties (3.74915ms)
  
  ✔ Merges nested arrays correctly (1.898073ms)
  ✔ Merges nested objects correctly (0.761838ms)
  ✔ Does not alter objects with no conflicts (0.277694ms)
✔ @superhero/deep/assign (14.053485ms)

▶ @superhero/deep/clone
  ✔ Clones simple objects (7.235299ms)
  ✔ Clones nested objects (0.634553ms)
  ✔ Clones arrays (0.650244ms)
  ✔ Handles circular references (0.382144ms)
  ✔ Clones objects with null prototype (0.375334ms)
✔ @superhero/deep/clone (11.89498ms)

▶ @superhero/deep/freeze
  ✔ Freezes a simple object (3.683567ms)
  ✔ Freezes nested objects recursively (0.406919ms)
  ✔ Handles circular references gracefully (0.309979ms)
  ✔ Freezes objects with symbols (0.405137ms)
  ✔ Handles already frozen objects without error (0.337038ms)
  ✔ Freezes objects with non-enumerable properties (0.354681ms)
  ✔ Freezes arrays (0.662049ms)
  ✔ Handles objects with null prototype (0.387428ms)
  ✔ Freezes objects with multiple property types (0.626902ms)
✔ @superhero/deep/freeze (10.607326ms)

▶ @superhero/deep
  ✔ All functions are accessible as a member to the default import object (1.734551ms)
  ✔ All functions are accessible to import from the default import object (0.255022ms)
✔ @superhero/deep (5.188429ms)

▶ @superhero/deep/merge
  ✔ Merges arrays with unique values (3.271451ms)
  ✔ Merges arrays with order preserved (0.455376ms)
  ✔ Handles empty arrays correctly (0.283857ms)
  ✔ Handles arrays with duplicate values (0.538911ms)
  ✔ Merges objects and prioritizes restrictive descriptors (0.592729ms)
  ✔ Merges objects with non-enumerable properties (0.343159ms)
  ✔ Handles nested object merging (0.359878ms)
  ✔ Stops at circular references (0.554345ms)
  ✔ Stops when nested and with circular references (0.667265ms)
  ✔ Returns second value for non-object types (0.744991ms)
  ✔ Handles multiple merges sequentially (0.327608ms)
✔ @superhero/deep/merge (11.803686ms)

tests 38
suites 8
pass 38

-----------------------------------------------------------------
file             | line % | branch % | funcs % | uncovered lines
-----------------------------------------------------------------
assign.js        | 100.00 |   100.00 |  100.00 | 
assign.test.js   | 100.00 |   100.00 |  100.00 | 
clone.js         |  95.83 |    92.86 |  100.00 | 22-23
clone.test.js    | 100.00 |   100.00 |  100.00 | 
freeze.js        | 100.00 |   100.00 |  100.00 | 
freeze.test.js   | 100.00 |   100.00 |  100.00 | 
index.js         | 100.00 |   100.00 |  100.00 | 
index.test.js    | 100.00 |   100.00 |  100.00 | 
merge.js         | 100.00 |   100.00 |  100.00 | 
merge.test.js    | 100.00 |   100.00 |  100.00 | 
-----------------------------------------------------------------
all files        |  99.78 |    99.25 |  100.00 | 
-----------------------------------------------------------------
```

---

## License
This project is licensed under the MIT License.

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
