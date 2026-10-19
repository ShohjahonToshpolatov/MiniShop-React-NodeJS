export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.required().validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      errors: { render: false },
    });

    if (error) {
      return res.status(400).json({
        message: "Ma'lumotlar noto'g'ri",
        errors: error.details.map((detail) => {
          const field = detail.path.join(".") || "body";
          return `${field}: ${detail.type}`;
        }),
      });
    }

    req.body = value;
    next();
  };
}
