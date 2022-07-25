import DbConnection, { msg } from "../../services/db";

export default function handler(req, res) {
    try {
        if (Object.keys(req.query).length !== 2) {
            res.status(400).send(`Invalid length: Expected 2 received ${Object.keys(req.query).length}`);
            return;
        }

        let in_use = req.query.in_use;
        let asset_name = req.query.asset_name;

        let sql = `UPDATE codes SET in_use = ${in_use} WHERE asset_code = "${asset_name}"`;
        console.log(sql);
        DbConnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(`Updated asset ${asset_name} in use: ${in_use}`);
        });
        res.status(200).send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
