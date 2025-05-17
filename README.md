### 📁 `App.js`

```jsx
import "./styles.css";
import json from "./data.json";
import { useState } from "react";
```

* **Imports**:

  * The CSS styles.
  * Your product/category JSON.
  * `useState` from React for selecting products from a dropdown.

---

```jsx
const Breadcrumb = ({ data, selectedProductId }) => {
  const trails = [];
```

* This defines the `Breadcrumb` component.
* `data`: the full collection tree.
* `selectedProductId`: which product you want the breadcrumb for.
* `trails`: an array to store all breadcrumb paths where the product is found.

---

```jsx
  const buildTrail = (node, path = []) => {
```

* This is a **recursive function** that walks through the tree.
* `node`: current collection node.
* `path`: breadcrumb path built so far (starts empty at root).

---

```jsx
    if (!node) return;
```

* Base case: stop recursion if the node doesn't exist.

---

```jsx
    const newPath = [...path, node.title];
```

* Append the current node’s title to the path.
* This ensures we don’t mutate the original path on recursive calls.

---

```jsx
    if (node.product && node.product.mainProductId === selectedProductId) {
      trails.push([...newPath, node.product.title]);
    }
```

* If this node has a `product` AND its ID matches the selected product:

  * Push the complete path (including the product title) into `trails`.

---

```jsx
    if (node.children) {
      node.children.forEach(child => buildTrail(child, newPath));
    }
  };
```

* If there are children, call `buildTrail` on each one.
* Pass along the updated `newPath`.

---

```jsx
  data.collections.forEach(collection => buildTrail(collection));
```

* Start the traversal from the top-level `collections` array.

---

```jsx
  if (trails.length === 0) return <p>No breadcrumb found.</p>;
```

* If the product isn’t found anywhere in the data, show a message.

---

```jsx
  return (
    <div className="breadcrumbs">
      {trails.map((trail, index) => (
        <nav className="breadcrumb" key={index}>
          {trail.map((item, i) => (
            <span key={i}>
              {item} {i < trail.length - 1 && ">"}
            </span>
          ))}
        </nav>
      ))}
    </div>
  );
};
```

* Renders one `<nav>` for **each breadcrumb trail** (in case a product is in multiple collections).
* For each item in the breadcrumb:

  * Show the title.
  * If it’s **not the last item**, add a `>` separator.

---

```jsx
export default function App() {
  const [selectedProductId, setSelectedProductId] = useState("p1");
```

* Main component.
* `selectedProductId` tracks which product's breadcrumb to display.
* Default value is `"p1"`.

---

```jsx
  const productOptions = [
    { id: "p1", title: "Oversized Cotton Tee" },
    { id: "p2", title: "Graphic Hoodie" },
    { id: "p3", title: "Canvas Tote Bag" }
  ];
```

* List of products shown in the dropdown.

---

```jsx
  return (
    <div className="App">
      <h1>Product Breadcrumb</h1>
```

* Renders the title and layout.

---

```jsx
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {productOptions.map((product) => (
          <option key={product.id} value={product.id}>
            {product.title}
          </option>
        ))}
      </select>
```

* A dropdown to let the user select a product.
* When changed, it updates `selectedProductId`.

---

```jsx
      <Breadcrumb data={json} selectedProductId={selectedProductId} />
    </div>
  );
}
```

* Renders the breadcrumb component with the selected product.

---

Let’s simulate it step by step using the `p1` product:

---

### ✅ **Initial Setup**

You selected `p1` – **"Oversized Cotton Tee"**.

This product appears in **two places** in your nested `collections` data:

1. Under `Men > Clothing > T-Shirts`
2. Under `Unisex > Featured`

---

We’ll trace both paths separately.

---

## 🔁 Recursion Path 1: Men → Clothing → T-Shirts → p1

### 🔹 Step 1: `node = Men`

```js
path = []
newPath = [...path, node.title] // newPath = ["Men"]
```

### 🔹 Step 2: `node = Clothing`

```js
path = ["Men"]
newPath = [...path, "Clothing"] // newPath = ["Men", "Clothing"]
```

### 🔹 Step 3: `node = T-Shirts`

```js
path = ["Men", "Clothing"]
newPath = [...path, "T-Shirts"] // newPath = ["Men", "Clothing", "T-Shirts"]
```

This node has:

```json
"product": {
  "mainProductId": "p1",
  "title": "Oversized Cotton Tee"
}
```

### ✅ Match Found!

We add:

```js
trails.push(["Men", "Clothing", "T-Shirts", "Oversized Cotton Tee"])
```

---

## 🔁 Recursion Path 2: Unisex → Featured → p1

### 🔹 Step 1: `node = Unisex`

```js
path = []
newPath = ["Unisex"]
```

### 🔹 Step 2: `node = Featured`

```js
path = ["Unisex"]
newPath = ["Unisex", "Featured"]
```

This node has:

```json
"product": {
  "mainProductId": "p1",
  "title": "Oversized Cotton Tee"
}
```

### ✅ Match Found Again!

We add:

```js
trails.push(["Unisex", "Featured", "Oversized Cotton Tee"])
```

---

### 📦 Final Output:

```js
trails = [
  ["Men", "Clothing", "T-Shirts", "Oversized Cotton Tee"],
  ["Unisex", "Featured", "Oversized Cotton Tee"]
]
```

---

### 📊 Recap of Arrays:

| Level    | `path`                | `newPath`                         |
| -------- | --------------------- | --------------------------------- |
| Men      | `[]`                  | `["Men"]`                         |
| Clothing | `["Men"]`             | `["Men", "Clothing"]`             |
| T-Shirts | `["Men", "Clothing"]` | `["Men", "Clothing", "T-Shirts"]` |
| Featured | `["Unisex"]`          | `["Unisex", "Featured"]`          |

