function errorsHandler(err, req, res, next) {
    console.error(err);

    res.status(500).json({ error: 'Internal Server Error', message: err.message })
}

module.exports = errorsHandler;