var mysql = require("mysql");

const DbConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

DbConnection.connect(function (err) {
    if (err) throw err;
    msg("Connected to SQL");
});

export const msg = (str) => {
    let date = new Date();
    console.log(`${date.toLocaleString("en-GB")}\t${str}`);
};

export default DbConnection;
