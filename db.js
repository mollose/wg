var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');

mkdirp.sync('var/db');

var db = new sqlite3.Database('var/db/wg.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER NOT NULL, \
        provider TEXT NOT NULL, \
        subject TEXT NOT NULL, \
        displayName TEXT NOT NULL, \
        email TEXT NOT NULL, \
        photo TEXT NOT NULL, \
        PRIMARY KEY (provider, subject) \
    )");
});

module.exports = db;