const express=require("express");
const authControllers=require("../controllers/authControllers");

const router=express.Router();
router.get("/login",authControllers.getLogin);
router.get("/callback",authControllers.getCallback);

module.exports=router;
