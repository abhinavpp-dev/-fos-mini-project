const express=require('express');
const router=express.Router();
 
const uploads=require('../utils/multer-cloudinary')
const { renderadminlogin, adminlogin, viewusers, adminlogout, blockuser, unblockuser } = require('../controllers/admincontroller');
const { renderaddproductform, addproduct, viewmenu, renderupdatemenu, updatemenu, deletemenuitem } = require('../controllers/addproduct');
const { rendercategories, createcategory, deletecategory } = require('../controllers/category');
const { renderslider, addslider, rendermanageslider, updateslider, deleteslider } = require('../controllers/bannercontrol');
const { renderCoupon, createCoupon, applycoupencode } = require('../controllers/coupon');





//multer setup

//admin login
router.get('/adminlogin',renderadminlogin);
router.post('/adminlogin',adminlogin)

//render suer details
router.get('/users',viewusers);

//render add product
router.get('/addproduct',renderaddproductform);
router.post('/addproduct',uploads.single('image'),addproduct);

//view and update menu
router.get('/viewmenu',viewmenu)
router.get('/updatemenu/:id',renderupdatemenu);
router.post('/updatemenu/:id',uploads.single('image'),updatemenu);
router.post('/deletemenu/:id',deletemenuitem)

//category

router.get('/categories',rendercategories);
router.post('/categories',createcategory);
router.post('/categories/:id',deletecategory);


//logout
router.get('/adminlogout',adminlogout)

// router.get('/admindash',renderadmindash)

//block and unblock user

router.post('/users/blockuser/:id',blockuser);
router.post('/users/unblockuser/:id',unblockuser)


//banner
router.get('/banners',renderslider)
router.post('/addslider',uploads.single('image'),addslider);
router.get('/slidermanagement',rendermanageslider)

router.post('/update-slider',updateslider)
router.post('/delete-slider/:id',deleteslider);

//coupon
router.get('/discounts',renderCoupon)
router.post('/createcoupons',createCoupon)
router.post('/apply-coupon',applycoupencode)

module.exports=router;