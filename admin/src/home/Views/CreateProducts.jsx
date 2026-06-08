import React, { useRef, useState } from "react";
import { DeleteIcon, SwitchIcon } from "../../SVG/SVG";
import "./views.css";
import { toast } from "sonner";
import { createProduct } from "../../services/products.service";

function CreateProducts() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [tags, setTags] = useState("");
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name || !category || !price || !stock || !tags)
      return toast.error("Please fill all the fields, except description.");

    try {
      const res = await createProduct(
        name,
        description,
        category,
        price,
        stock,
        tags,
        file,
      );
      if (!res.ok) throw new Error(res.message);

      toast.success(res.message);
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStock("");
      setTags("");
      setFile(null);
      document.getElementById("file").value = null;
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) {
        const filename = e.target.files[0].name.split(".")[0];
        setName(
          filename
            .replace(/[-_]/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        );
      }
    }
  };

  return (
    <section className="create">
      <form onSubmit={handleSubmit}>
        <article className="img">
          {/* display none */}
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileRef}
          />
          {/* display none */}

          {file ? (
            <>
              <img src={URL.createObjectURL(file)} alt="" />
              <div className="btns">
                <span
                  onClick={() => fileRef.current.click()}
                  className="switch"
                >
                  <SwitchIcon />
                </span>
                <span
                  onClick={() => (
                    setFile(null),
                    (document.getElementById("file").value = "")
                  )}
                  className="delete"
                >
                  <DeleteIcon />
                </span>
              </div>
            </>
          ) : (
            <label htmlFor="file">
              <span>+</span>
              <p>Upload a photo</p>
            </label>
          )}
        </article>

        <article className="credentials">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1),
              )
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1),
              )
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <button type="submit" className="submit">
            Create Product
          </button>
        </article>
      </form>
    </section>
  );
}

export default CreateProducts;
