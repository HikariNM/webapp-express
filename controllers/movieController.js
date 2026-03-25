const db = require('../data/db');

function index(req, res) {
    const sqlQuery = 'SELECT * FROM movies'

    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
        }
        res.json(result)
    })
}

function show(req, res) {
    const id = Number(req.params.id)
    const sqlQuery = 'SELECT * FROM movies WHERE id = ?';
    const relationsQuery = `
    SELECT 
    reviews.text
    FROM movies
    JOIN reviews
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?;
    `;
    const paramsQuery = [id];


    db.query(sqlQuery, paramsQuery, (err, row) => {
        if (err) {
            return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
        }
        const movie = row[0];

        db.query(relationsQuery, paramsQuery, (err, result) => {
            if (err) {
                console.error('errore 2')
                return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
            }
            movie.text = result.map(rec => rec.text);
            // console.log(movie);
            res.json(movie);
        })
    })

}

module.exports = { index, show };