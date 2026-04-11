const prisma = require("../lib/prisma");

const productExists = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID san pham khong hop le",
      });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay san pham",
      });
    }

    req.product = product;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = productExists;
