import { Router } from 'express';
import {
    addProductCategory,
    getProductCategories,
    getProductCategory,
    updateProductCategory,
} from '../controllers/productCategoryController.js';
import {
    addProduct,
    getProduct,
    getProducts,
    updateProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts); // Get all Categories
router.get('/category', getProductCategories); // Get all Categories

router.post('/add', addProduct); // Add new Category
router.post('/category/add', addProductCategory); // Add new Category

router.get('/:productID', getProduct); // Get ProductCategory by _id
router.get('/category/:categoryID', getProductCategory); // Get ProductCategory by _id

router.put('/:productID', updateProduct); // Update product category
router.put('/category/:categoryID', updateProductCategory); // Update product category

export default router;
