import { Router } from 'express';
import {
    addProductCategory,
    getProductCategories,
    getProductCategory,
} from '../controllers/productCategoryController.js';
import {
    addProduct,
    getProduct,
    getProducts,
} from '../controllers/productController.js';

const router = Router();

router.post('/add', addProduct); // Add new Category
router.get('/', getProducts); // Get all Categories
router.get('/:productID', getProduct); // Get ProductCategory by _id

router.post('/category/add', addProductCategory); // Add new Category
router.get('/category/', getProductCategories); // Get all Categories
router.get('/category/:categoryID', getProductCategory); // Get ProductCategory by _id
// router.put('/:clientNumber', updateClient); // Update client

export default router;
