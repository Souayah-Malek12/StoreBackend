const { default: slugify } = require('slugify');
const productModel = require('../models/productModel');


const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, photo } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(401).send({
                success: false,
                message: "name is required"
            });
        }
        if (!description) {
            return res.status(401).send({
                success: false,
                message: "description is required"
            });
        }
        if (!price) {
            return res.status(401).send({
                success: false,
                message: "price is required"
            });
        }
        if (!category) {
            return res.status(401).send({
                success: false,
                message: "category is required"
            });
        }
        if (!quantity) {
            return res.status(401).send({
                success: false,
                message: "quantity is required"
            });
        }

        // Check if the photo is uploaded and its size
        if (!photo ) {
            return res.status(401).send({
                success: false,
                message: "photo is required "
            });
        }
           

        // Create new product
        const product = await productModel.create({
            name, description, price , category, quantity, photo,
            slug: slugify(name),
        });

        // Save product to the database

        // Respond with success message
        return res.status(201).send({
            success: true,
            message: "Product created successfully",
            product : {
                name,
                description,
                price,
                category,
                quantity,
                photo
            }
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in create product API",
            error: error.message // Return error message for better debugging
        });
    }
};

const getAllProductsController = async(req, res)=> {
    try{
        const products = await productModel.find({}).populate("category").limit(12).sort({ createdAt : -1})
        res.status(200).send({
            success : true,
            message : "All Products",
            products
        })
    }catch(error){

        return res.status(500).send({
            success: false,
            message: "Error in get All products API",
            error: error.message 
        });
    }
}

const getSingleProductApi = async(req, res) => {
    try{
        const {slug} = req.params;
        const product = await productModel.findOne({slug}).populate("category")
        
        return res.status(200).send({
            success: true,
            message: "the product",
            product
        })    
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in get  product API",
            error: error.message 
        });
    }
}

const deleteProductController = async(req, res)=> {
    try{
        await productModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Product deleted Successfully",
        });
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in delete product API",
            error: error.message 
        });
    }
}

const updateProductController= async(req, res)=> {
    try{
        const {id} = req.params;
        const {name, description, price, category, quantity, photo} = req.body; 
        const updatedProduct = await productModel.findById(id)

        if (!updatedProduct) {
            return res.status(404).send({
              success: false,
              message: "Product not found",
            });
          }

        if(name) updatedProduct.name = name ;
        if(description) updatedProduct.description = description 
        if(price) updatedProduct.price = price 
        if(category) updatedProduct.category = category 
        if(quantity) updatedProduct.quantity = quantity 
        if(photo) updatedProduct.photo = photo 

        await updatedProduct.save()

        return res.status(200).send({
            success : true,
            message: "Product updated Successfully",
            updatedProduct
        })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in update product API",
            error: error.message 
        });
    }
}

const filterProductController = async(req, res)=> {
        try{
                const {checked , radio } = req.body;
                const alt = {}

                if(checked.length>0) alt.category = checked;
                if(radio.length) alt.price = {$gt : radio[0], $lt : radio[1]}
                const products = await productModel.find(alt)

                return res.status(200).send({
                    success : true,
                    products
                })
        }catch(error){
            return res.status(500).send({
                success: false,
                message: "Error in filter product API",
                error: error.message 
            });
        }
}

const productCountController = async(req, res)=> {
    try{
        const total = await productModel.find({}).estimatedDocumentCount()
        return res.status(200).send({
            success: true,
            total
        })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in counting  products API",
            error: error.message 
        });
    }
}

const productListController =async(req, res)=> {
    try{
        const perPage = 3   
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
        .find({})
        .skip((page-1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1})
        return res.status(200).send({
            success : true,
            products
        })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in Listing  products API",
            error: error.message 
        });
    }
}

const searchProductController = async(req, res)=> {
    try{
        const {keyword} = req.params
        const results = await productModel.find({
            $or: [
            {name : {$regex : keyword, $options: "i"}},
            {descritpion : {$regex : keyword, $options : "i"}}
            ]
        }
        )
        res.json(results)
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in searching  product API",
            error: error.message 
        });
    }
}
module.exports = {filterProductController ,createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController, productCountController, productListController, searchProductController}