const { default: slugify } = require('slugify');

const productModel = require('../models/productModel');
const categoryModel = require("../models/categoryModel")
const orderModel = require("../models/orderModel")

const braintree = require('braintree');

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MEMerchantID ,
    publicKey: process.env.BRAINTREE_Public_Key ,
    privateKey: process.env.BRAINTREE_Private_Key,
  });


  
  const passagerCommand = async(req, res)=>{
    try{
        const {name , tel , adr , cart,total} = req.body;
        
       
        const productDetails = cart.flatMap((prod) =>
            prod?.details.map((d) => ({
              name: prod.name,
              color: d.color,
              size: d.size,
              photo: prod.photo, 
            }))
          );
       
            console.log(productDetails)
        const passagerOrder = await orderModel.create({
            products : productDetails,
            payment : total,
            buyer : name,
            addresse : adr,
            buyerPhone : tel,
            
        })
        return res.status(201).send({
            success : true ,
            message : 'passager order  passed successfully',
            passagerOrder
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in commande passager Api",
            error: err.message,
          });
    }
  }

const braintreeTokenController = async(req, res)=>{
    try{
       gateway.clientToken.generate({}, function (err, response){
            if(err){
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate client token",
                    error: err.message || err, // Ensuring a proper error message
                  });
            }else{
                res.status(200).send({
                    success: true,
                    message: "toekn created Successfully",
                    response
                })
            }
       })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message,
          });
    }
}
const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;

        // Use forEach to calculate total instead of map
        cart.forEach((c) => {
            total += c.price; // Ensure 'c' is used correctly
        });

        // Perform the transaction
        gateway.sale({
            amount: total, // Keep total as is
            paymentMethodNonce: nonce, // Corrected typo
            options: {
                submitForSettlement: true, // Corrected typo
            }
        }, async (err, result) => {
            if (err) {
                console.error(err); // Log the error
                return res.status(500).send({ error: 'Transaction failed' });
            }

            if (result.success) {
                // Await the order save to ensure it completes
                await new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user.id,
                }).save();

                return res.json({ ok: true });
            } else {
                return res.status(500).send({ error: 'Transaction was not successful' });
            }
        });
    } catch (error) {
        console.error(error); // Log any unexpected errors
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const createProductController = async (req, res) => {
    try {
        

        const { name, description, price, category,  quantity, photo ,details } = req.body;


        console.log("Request body:", req.body);


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
        if (!details ) {
            return res.status(401).send({
                success: false,
                message: "details is required "
            });
        }
           
        const slug = slugify(name); // Ensure slugify is imported at the top of your file

        // Create new product
        const product = await productModel.create({
            name, description, price , category, quantity, photo, details,
            slug,
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
                photo, 
                details,
                slug
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
        const { name, description, price, category,  quantity, photo ,Newdetails } = req.body; 
        console.log(Newdetails)
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
        
        if (Newdetails) {
          
            Newdetails.forEach(detail => {
                updatedProduct.details.push({
                  color: detail.color,
                  size: detail.size,
                  quantities: detail.quantities
                });
              });
            
            
          } 

        await updatedProduct.save()

        return res.status(200).send({
            success : true,
            message: "Product updated Successfully",
            updatedProduct
        })
    }catch(error){
        console.log(error)
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

const relatedSearchController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const relatedProds = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        })
        .limit(3)
        .populate("category");
        
        res.status(200).send({
            success: true,
            relatedProds
        });
    } catch (error) {
        console.error("Error fetching related products:", error); // Log the full error
        return res.status(500).send({
            success: false,
            message: "Error in searching related products API",
            error: error.message 
        });
    }
};

const getProductByCategory = async(req, res)=> {
    try{
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug});

        if (!category) {
            return res.status(404).json({
              success: false,
              message: 'Category not found',
            });
          }

        const products = await productModel.find({ category: category._id })

        res.status(200).send({
            success: true,
            products
        });
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in searching category products API",
            error: error.message 
        });
    }
}

module.exports = {filterProductController ,createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController, productCountController,
     productListController, searchProductController, relatedSearchController, getProductByCategory
    ,braintreeTokenController, braintreePaymentController  , passagerCommand
}