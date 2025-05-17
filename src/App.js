import "./styles.css";
import data from "./data.json";
import { useState } from "react";

const Breadcrumb = ({ data, selectedProductId }) => {
  const trails = [];

  const buildTrial = (node, path = []) => {
    if (!node) return;

    const newPath = [...path, node.title];

    if (node.product && node.product.mainProductId === selectedProductId) {
      trails.push([...newPath, node.product.title]);
    }

    if (node.children) {
      node.children.forEach((child) => buildTrial(child, newPath));
    }
  };

  data.collections.forEach((collection) => buildTrial(collection));

  if (trails.length === 0) return <p>No breadcrumb found.</p>;

  return (
    <div className="breadcrumbs">
      {trails.map((trail, index) => (
        <nav className="breadcrumb" key={index}>
          {trail.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < trail.length - 1 && " >"}
            </span>
          ))}
        </nav>
      ))}
    </div>
  );
};

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState("p1");

  const productOptions = [
    { id: "p1", title: "Oversized Cotton Tee" },
    { id: "p2", title: "Graphic Hoodie" },
    { id: "p3", title: "Canvas Tote Bag" },
  ];

  return (
    <div className="App">
      <h1>Product Breadcrumb L2</h1>
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
      <Breadcrumb data={data} selectedProductId={selectedProductId} />
    </div>
  );
}
