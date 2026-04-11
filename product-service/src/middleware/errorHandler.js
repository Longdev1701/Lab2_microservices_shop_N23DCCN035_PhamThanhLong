const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: `${err.meta?.target} da ton tai`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Khong tim thay ban ghi",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Loi he thong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
