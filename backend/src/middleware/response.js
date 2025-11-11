// Adds res.success & res.fail helpers for consistent JSON structure
export const apiResponse = (req, res, next) => {
  res.success = (data = {}, meta = {}) => {
    res.json({ success: true, data, meta });
  };
  res.fail = (statusCode = 400, error = "Bad Request", details) => {
    res
      .status(statusCode)
      .json({ success: false, error, ...(details && { details }) });
  };
  next();
};
