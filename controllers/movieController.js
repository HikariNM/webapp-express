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
    const sqlQuery = `
    SELECT 
    movies.* ,
    ROUND(AVG(reviews.vote)) AS average_review
    FROM movies
    LEFT JOIN reviews
    ON reviews.movie_id = movies.id
    WHERE movies.id =  ?;
    `;
    const relationsQuery = `
    SELECT 
    *
    FROM reviews
    WHERE movie_id = ?;
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

            db.query(countQuery, (err, count) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: "DB Error", message: "Error retrieving data from the database" });
                }
                movie.archiveLength = count[0].count;
                res.json(movie);
            })
        })
    })
}

function storeRev(req, res) {
    const { id } = req.params;
    const { name, vote, text } = req.body;

    const sqlQuery = `
    INSERT 
    INTO reviews(name, vote, text, movie_id) 
    VALUES(?,?,?,?);
    `;

    // const paramsQuery = [name, vote, text, id];

    db.query(sqlQuery, [name, vote, text, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Database query error",
                message: err.message
            });
        }
        res.status(201).json({ message: `Review successuflly added with id ${result.insertId}`, id: result.insertId })
    })
}

module.exports = { index, show, storeRev };