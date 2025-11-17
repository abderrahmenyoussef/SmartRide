const urlnotfound = (req, res, next) => {
    const error = new Error(`URL Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const userErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message;

    // Gestion des erreurs classiques de Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Les données fournies sont invalides ou incomplètes';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID invalide';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Email ou Username dupliqué';
    } 
    res.status(statusCode);
    res.json({
        message: "Erreur détectée avec le Middleware",
        error: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { urlnotfound, userErrorHandler };