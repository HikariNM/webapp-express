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
    reviews.text, reviews.name, reviews.vote, reviews.id
    FROM movies
    JOIN reviews
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?;
    `;

    const secondRelationQuery = `
    SELECT 
    Round(AVG(vote),1) as 'AVG'
    FROM reviews
    where movie_id = ?;
    `;

    const countQuery = `
    SELECT 
    COUNT(*) as 'count'
    FROM movies;
    `;

    const paramsQuery = [id];

    db.query(sqlQuery, paramsQuery, (err, row) => {
        if (err) {
            return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
        }
        const movie = row[0];

        db.query(relationsQuery, paramsQuery, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
            }
            movie.text = result;
            // console.log(movie);

            db.query(secondRelationQuery, paramsQuery, (err, avg) => {
                if (err) {
                    return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
                }
                movie.vote = avg[0]['AVG'];

                db.query(countQuery, (err, count) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
                    }
                    movie.count = count[0].count;
                    // console.log(movie.count);
                    res.json(movie);
                })
            })


        })


    })

}

module.exports = { index, show };