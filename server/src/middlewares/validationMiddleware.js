export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    console.log(`Validation Success: ${req.method} ${req.path}`);
    next();
  } else {
    console.error(`Validation Error: ${req.method} ${req.path} - ${JSON.stringify(result.error.flatten())}`);
    res.status(400).json({ error: result.error.flatten() });
  }
};
