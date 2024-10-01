const categoryModel = require("../models/categoryModel")
const slugify = require('slugify');

const createCategoryController = async(req, res)=> {
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                success : false,
                message: "Category name is required",
                
            })
        }
        const categoryExist = await categoryModel.findOne({name});

        if(categoryExist){
            return res.status(400).send({
                success : false,
                message: "Category exist",
                name
            })
        }
        const newCategory = await categoryModel.create({name,  slug: slugify(name)})
        return res.status(200).send({
            success : true,
            message: "Category created Successfully",
            name,
            category : newCategory
        })
        
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in create category api",
            error
        });
    }
}

const updateCategoryController = async(req, res)=> {
    try{
        const {name} = req.body;
        const {id} = req.params;

        if(!name){
            return res.status(401).send({
                success : false,
                message: "Category name is required",
            })
        }

        const categoryExist = await categoryModel.findById(id);

        if(!categoryExist){
            return res.status(404).send({
                success : false,
                message: "Category does not exist",
                
            })
        }

         const categoryUpdated = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) })

        return res.status(200).send({
            success: true,
            message: "Category updated Successfully",
            category : categoryUpdated
        });



    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in update category api",
            error
        });
    }

}

const find = async(req, res)=>{
    const {id} = req.params;  
    const checked = await categoryModel.findById(id)

    if(checked){
        return res.status(200).send({
            success : true
        })
    }else {
        return res.status(404).send({
            success: false
        })
    }
}

const getAllCategoryController = async(req, res)=>{
    try{
        const categories = await categoryModel.find({});
        if(categories){
            return res.status(200).send({
                success: true,
                message: "All Categories  ",
                category : categories
            });
        }else {
            return res.status(404).send({
                success: true,
                message: "No categories founded Categories  ",
            }) 
        }
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error in get ALL categorys api",
            error
        });
    }
}

module.exports = { createCategoryController, updateCategoryController, find, getAllCategoryController }