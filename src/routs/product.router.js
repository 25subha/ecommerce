import { Router } from "express";
import { createNewProduct, deleteProduct, getAllProduct, singaleProduct, updateProductDetails } from "../controllers/product.controller.js";

const router = Router();

router.route("/create-product").post(createNewProduct);
router.route("/get-allproduct").get(getAllProduct);
router.route("/update-product/:_id").patch(updateProductDetails);
router.route("/remove-product/:_id").delete(deleteProduct);
router.route("/current-product/:_id").get(singaleProduct);

export default router;