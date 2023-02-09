const express = require('express');
const morgan = require('morgan');

const customerRouter = require('./routes/customerRoutes');
const partnerRouter = require('./routes/partnerRoutes');
const productRouter = require('./routes/productRoutes');

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req,res,next) => {
    console.log('Hello from the middleware');
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2) ROUTES

app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/partner', partnerRouter);

module.exports = app;
