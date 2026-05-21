const db = require("../config/db");


exports.createProduct = (req, res) => {
  const { title, description, category, image, explore_images } = req.body;

  if (!title || !description || !category || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const imageArray = Array.isArray(image) ? image : [image];
  const exploreImagesArray = explore_images ? explore_images : [];

  const query = `
    INSERT INTO products (title, description, category, image, explore_images)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      title,
      description,
      category,
      JSON.stringify(imageArray),
      JSON.stringify(exploreImagesArray),
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Failed to create product" });
      }

      res.status(201).json({
        message: "Product created",
        productId: result.insertId,
      });
    }
  );
};

// Handles product creation with file uploads
exports.uploadProductWithFiles = (req, res) => {
  const { title, description, category } = req.body;

  const mainImages = req.files["mainImages"]
    ? req.files["mainImages"].map(file => `/uploads/${file.filename.replace(/\\/g, "/")}`)
    : [];

  const exploreImages = req.files["explore_images"]
    ? req.files["explore_images"].map(file => `/uploads/${file.filename.replace(/\\/g, "/")}`)
    : [];

  if (!title || !description || !category || mainImages.length === 0) {
    return res.status(400).json({
      error: "Missing required fields or at least one main image",
    });
  }

  const query = `
    INSERT INTO products (title, description, category, image, explore_images)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      title,
      description,
      category,
      JSON.stringify(mainImages),   // Always save JSON string arrays
      JSON.stringify(exploreImages),
    ],
    (err, result) => {
      if (err) {
        console.error("Error uploading product:", err);
        return res.status(500).json({ error: "Failed to upload product" });
      }

      res.status(201).json({
        message: "Product uploaded successfully",
        productId: result.insertId,
      });
    }
  );
};


exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    const formattedResults = results.map(product => {
      let images = [];
      let explores = [];

      try {
        images = JSON.parse(product.image);
      } catch {
        images = product.image ? [product.image] : [];
      }

      try {
        explores = JSON.parse(product.explore_images);
      } catch {
        explores = product.explore_images ? [product.explore_images] : [];
      }

      return {
        ...product,
        image: images,
        explore_images: explores,
      };
      

    });
    

    res.json(formattedResults);
  });
};
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  });
};


exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { title, description, category } = req.body;

  let mainImages = [];
  let exploreImages = [];

  
  if (req.files && req.files["mainImages"]) {
    mainImages = req.files["mainImages"].map(
      (file) => `/uploads/${file.filename.replace(/\\/g, "/")}`
    );
  } else {
    mainImages = JSON.parse(req.body.existingMainImages || "[]");
  }

  if (req.files && req.files["explore_images"]) {
    exploreImages = req.files["explore_images"].map(
      (file) => `/uploads/${file.filename.replace(/\\/g, "/")}`
    );
  } else {
    exploreImages = JSON.parse(req.body.existingExploreImages || "[]");
  }

  const sql = `
    UPDATE products
    SET title = ?, description = ?, category = ?, image = ?, explore_images = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      description,
      category,
      JSON.stringify(mainImages),
      JSON.stringify(exploreImages),
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Failed to update product" });
      }

      res.json({ message: "Product updated successfully" });
    }
  );
};



