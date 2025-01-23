function errorsHandler(err, req, res, next) {
    console.error(err.stack.split("\n")[1]);
    res.status(err.statusCode || 500);
    res.json({
      error: err.message,
    });
  }
  
export default errorsHandler;