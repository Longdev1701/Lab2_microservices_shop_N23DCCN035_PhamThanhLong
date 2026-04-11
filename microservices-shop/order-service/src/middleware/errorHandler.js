const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Du lieu don hang khong hop le",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID khong hop le",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Loi he thong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
