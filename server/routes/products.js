import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const prisma = new PrismaClient();

router.get('/all', async (req, res) => {
    // request all of the products from prisma
    const products = await prisma.product.findMany();

    // return the json data collection of all the products
    res.json(products);
});

router.get('/:id', async (req, res) => {
    // request the id from the url
    const id = req.params.id;

    // find the unique dataset that relates to that id
    const product = await prisma.product.findUnique({
        where: {
            product_id: parseInt(id),
        }
    });

    // check to see if the product exists at the id
    if (!product) {
        return res.status(404).send('Product not found');
    }

    // return the json data collection of that product
    res.json(product);
});

router.post('/purchase', (req, res) => {
    res.send('purchase page');
});

export default router;