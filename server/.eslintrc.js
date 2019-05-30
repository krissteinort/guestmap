router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
      const { name, message, latitude, longitude } = req.body;
      const userMessage = {
        name,
        message,
        latitude,
        longitude,
        date: new Date()
      };
      messages
        .insert(userMessage)
        .then(insertedMessage => {
          res.json(insertedMessage);
        });
    } else {
      next(result.error);
    }
  });