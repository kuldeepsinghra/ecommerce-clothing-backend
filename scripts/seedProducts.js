const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('../models/product');
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const fetchImages = async (count = 30) => {
  try {
    const res = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        query: 'clothing',
        count: count,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    return res.data.map(img => img.urls.small);
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany();  // Clear existing products
    console.log('Existing products cleared.');

    const totalProducts = 150;
    const batchSize = 30;

    let allImages = [];

    // Fetch images in batches of 30 (5 times)
    for (let i = 0; i < totalProducts / batchSize; i++) {
      console.log(`Fetching batch ${i + 1}...`);
      const images = await fetchImages(batchSize);
      allImages = allImages.concat(images);
    }

    console.log(`Fetched ${allImages.length} images.`);

    // Create product objects
    const products = allImages.map((image, index) => ({
      name: `Clothing Item ${index + 1}`,
      description: `High-quality clothing product ${index + 1}.`,
      price: (Math.random() * 100 + 10).toFixed(2),
      category: ['Men', 'Women', 'Kids'][Math.floor(Math.random() * 3)],
      imageURL: image,
      stock: Math.floor(Math.random() * 100) + 10,
    }));

    // Store all products in MongoDB
    await Product.insertMany(products);

    console.log(`${products.length} products with real images added successfully!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to seed products:', error);
  }
};

seedProducts();
