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

router.post('/purchase', async (req, res) => {
    const { street, city, province, country, postal_code, 
        credit_card, credit_expire, credit_cvv, cart, 
        } = req.body;

    // check if the user is logged in
    if (!req.session.user_id) {
        return res.status(401).send('Unauthorized. Please login to complete purchase.');
    }

    // validate inputs
    if (!street || !city || !province || !country || !postal_code || 
        !credit_card || !credit_expire || !credit_cvv || 
        !cart) {
        return res.status(400).send('Missing required fields');
    }

    // splitting the carts items and counting the quantity
    const productList = cart.split(',');
    const productCounts = {};

    productList.forEach(product => {
        if (productCounts[product]) {
            productCounts[product]++;
        } else {
            productCounts[product] = 1;
        }
    });

    // create the purchase data set
    const purchase = await prisma.purchase.create({
        data: {
            customer_id: req.session.user_id,
            street: street,
            city: city,
            province: province,
            country: country,
            postal_code: postal_code,
            credit_card: credit_card,
            credit_expire: credit_expire,
            credit_cvv: credit_cvv,
            
        },
    });

    // Create the PurchaseItem records for each product in the cart
    const purchaseItems = Object.keys(productCounts).map(productId => {
        return {
            purchase_id: purchase.purchase_id,  // Link to the Purchase
            product_id: parseInt(productId),    // Convert productId from string to integer
            quantity: productCounts[productId]  // Quantity for this product
        };
    });

    // Bulk create PurchaseItem records
    await prisma.purchaseItem.createMany({
        data: purchaseItems
    });



    res.send('purchase completed successfully');
});

export default router;