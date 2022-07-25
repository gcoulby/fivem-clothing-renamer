import DbConnection, { msg } from "../../services/db";

export default function handler(req, res) {
    try {
        if (Object.keys(req.query).length !== 2) {
            res.status(400).send(`Invalid length: Expected 2 received ${Object.keys(req.query).length}`);
            return;
        }

        let gender = req.query.gender;
        let type = req.query.type;

        let sql = `SELECT * FROM codes WHERE gender = "${gender}" AND type = "${type}"`;
        console.log(sql);
        DbConnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(`Selected ${type} assets for gender: ${gender}`);
            res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
