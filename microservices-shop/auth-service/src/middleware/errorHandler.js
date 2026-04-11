const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Du lieu da ton tai",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Loi he thong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
