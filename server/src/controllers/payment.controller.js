const ServerError = require("../Errors/errorClas");
const {
  creatingOrder,
  addPaymentIdToOrder,
  successPayment,
  cancellingOrder,
} = require("../services/cart.service");
const { getProductById } = require("../services/products.service");
const stripe = require("../utils/stripe");

const createPaymentSession = async (req, res, next) => {
  try {
    // getting product
    const { productId } = req.params;

    // getting product
    const product = await getProductById(req.userId, productId);
    if (!product) return next(new ServerError("Product not found", 404));

    if (product.stock < 1)
      return next(new ServerError("Product out of stock", 400));

    // creating order
    const orderId = await creatingOrder(req.userId, productId);

    // creating payment session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: (product.price - (product.discount || 0)) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success/${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/failure/${orderId}`,
    });

    // adding payment id to order table
    await addPaymentIdToOrder(orderId, session.id);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const successPaymentSession = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    await successPayment(req.userId, orderId);

    return res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    await cancellingOrder(req.userId, orderId);

    return res.status(200).json({ message: "Order cancelled" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = { createPaymentSession, successPaymentSession, cancelOrder };
