const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
require('dotenv').config();

const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const airtableRoutes = require("./routes/airtableRoutes");
const formRoutes = require("./routes/formRoutes");
const formResponseRoutes = require("./routes/formResponseRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// --- PUBLIC ROUTES ---
app.use("/auth", authRoutes);
app.use("/webhooks", webhookRoutes);

// --- PROTECTED ROUTES ---
app.use("/airtable", auth, airtableRoutes);
app.use("/forms", auth, formRoutes);
app.use("/responses", auth, formResponseRoutes);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database is connected");
});

app.listen(process.env.port,()=>{
    console.log(`Server is running on port ${process.env.port}`)
});
