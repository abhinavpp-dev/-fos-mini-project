const jwt = require('jsonwebtoken');
const Cart = require('../models/cartmodel');
const Product = require('../models/product');

const addcart = async (req, res) => {
    // Retrieve the token from cookies
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login')
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Extract userId from the token payload

        // Get productId from the request body
        const { productId } = req.body;

        // Check if the cart exists for the user
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check if the product is already in the cart
        const cartItem = cart.items.find(item => item.product.equals(productId));
        if (cartItem) {
            cartItem.quantity += 1; // Increment quantity if it exists
        } else {
            cart.items.push({ product: productId, quantity: 1 }); // Add new product to the cart
        }

        cart.updatedAt = new Date(); // Update the timestamp
        await cart.save(); // Save the cart

        // Redirect to the cart page or return a success message
        return res.redirect('/menu');
    } catch (err) {
        // Handle JWT-specific errors
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.redirect('/login')
        }
        // Handle server errors
        return res.status(500).json({ message: 'Server error.', error: err.message });
    }
};
  
const rendercart = async (req, res) => {
    // Retrieve the token from cookies
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login')
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Extract userId from the token payload

        // Fetch the user's cart and populate the product details
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        // Calculate the total amount
        let totalAmount = 0;
        let cartItems = [];
        if (cart && cart.items.length > 0) {
            cartItems = cart.items;
            totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        }

        // Render the cart page with cart details and total amount
        return res.render('users/cart1', { cart: { items: cartItems }, totalAmount });
    } catch (err) {
        // Handle JWT-specific errors
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res. redirect('/login')
        }
        // Handle server errors
        return res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

const increaseitem=async(req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const userId=decoded.userId;
        const {productId}=req.body;

        //fetch the cart

        const cart=await Cart.findOne({user:userId});
        
       

        const cartItem=cart.items.find(item=>item.product.equals(productId));
       if(cartItem ){

        cartItem.quantity+=1;//increase the quantity

        cart.updatedAt=new Date();
        await cart.save();

        //recalculate the total amount
        let totalAmount=0;
        cart.items.forEach(item=>{
            totalAmount+=item.product.price*item.quantity;
        });
        return res.redirect('/cart1');
        

     }
   

    }catch(error){
        console.error(error);
        res.status(404).send('internal server error');
    }
}

const decreaseitem=async(req,res)=>{
    const token=req.cookies.token;
    if(!token){
        res.redirect('/login');
    }
try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const userId=decoded.userId;
    const {productId}=req.body;

    const cart=await Cart.findOne({user:userId});

    const cartitem=cart.items.find(item=>item.product.equals(productId));
    if(cartitem){
        cartitem.quantity-=1//decrease quantity
        cart.updatedAt=new Date();
        await cart.save();
    }
    
    res.redirect('/cart1');


}catch(error){
    console.error(error)
    res.status(404).send('internal server error');
}

}




module.exports={addcart,rendercart,increaseitem,decreaseitem}