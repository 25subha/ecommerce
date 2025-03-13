import { Product } from "../models/product.model.js";

const createNewProduct = async( req, res ) => {
    try {
        const {title, description, price, imageUrl} = req.body;

        if(title === "") {
            return res.status(400).json({message: "title is required"})
        }
        if(description === "") {
            return res.status(400).json({message: "description is required"})
        }
        if(isNaN(price) || price === "") {
            return res.status(400).json({message: "price is required"})
        }
        if(imageUrl === "") {
            return res.status(400).json({message: "imageUrl is required"})
        }
        
        const existingProduct = await Product.findOne({$or: [{title}, {description}]})

        if(existingProduct) {
            if(existingProduct.title === title) {
                return res.status(400).json({message: "this title alrady exists"})
            }
            if (existingProduct.description === description) {
                return res.status(400).json({message: "this description alrady exists"})
            }
        }

        const product = await Product.create({
            title,
            description,
            price,
            imageUrl
        })
        return res.status(201).json({product: product,
            message: "product created sucessfully"
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const getAllProduct = async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json({product: product, message: "product fetched sucessfully"})
    } catch (error) {
        res.status(500).json({message: error.message})

    }
};

const updateProductDetails = async(req,  res) => {
  try {
      const {title, description, price, imageUrl} = req.body
  
      if ([title, description, imageUrl].some((filds) => {
          !filds || filds?.trim() === ""
      })) {
          return res.status(400).json({message: "all filds are required"})
      };
      
      if (isNaN(price) || price === "") {
        return res.status(400).json({message: "price are required"})
      }

      const existingProduct = await Product.findOne({$or: [{title}, {description}]})

      
        if(existingProduct) {
            if(existingProduct.title === title) {
                return res.status(400).json({message: "this title alrady exists"})
            }
            if (existingProduct.description === description) {
                return res.status(400).json({message: "this description alrady exists"})
            }
        }
 

      const updatedProduct = await Product.findByIdAndUpdate(req.params?._id, {
          title,
          description,
          price,
          description,
          _id: req.params._id
      })
  
      res.status(200).json({updatedProduct, message: "product details updated sucessfully"})
  } catch (error) {
    res.status(500).json({message: error.message})

  }
};

const deleteProduct = async (req, res) => {
     try {
        await Product.findByIdAndDelete(req.params?._id)
        res.status(200).json({message: "product deleted sucessfully"})
     } catch (error) {
        res.status(500).json({message: error.message})
     }
};

const singaleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params?._id)
        return res.status(200).json({product: product,
            message: 
        "product fetched sucessfully"
        })
    } catch (error) {
        res.status(500).json({message: error.message})

    }

}

export{
    createNewProduct,
    updateProductDetails,
    deleteProduct,
    singaleProduct,
    getAllProduct
}