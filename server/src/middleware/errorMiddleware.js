/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  if (err.isAiError) {
    console.error('Server-side AI Provider Error:', err.originalError || err);
    return res.status(503).json({
      success: false,
      error: "AI_SERVICE_TEMPORARILY_UNAVAILABLE",
      message: "AI analysis is temporarily unavailable. Please try again in a minute."
    });
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
