const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const upload = require("../middleware/upload");


router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.delete("/:id", productController.deleteProduct);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "explore_images", maxCount: 10 },
  ]),
  productController.updateProduct
);


router.post(
  "/upload",
  upload.fields([
    { name: "mainImages", maxCount: 5 },       
    { name: "explore_images", maxCount: 10 },
  ]),
  productController.uploadProductWithFiles
);


module.exports = router;
