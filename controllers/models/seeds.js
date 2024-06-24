const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     description: 1.99,
//     category: 'fruit'
// })
// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const seedProducts = [
    {
        name: 'Fairy Eggplant',
        description: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        description: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        description: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        description: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        description: 2.69,
        category: 'dairy'
    },
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })