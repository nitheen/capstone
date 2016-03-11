var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var connect = require('connect');
var r = require('rethinkdb');

var config = require(__dirname + '/config.js');

var app = express();


//For serving the index.html and all the other front-end assets.
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

//The REST routes for "index".
app.route('/index')
    .get(listData)
    .post(createData);

app.route('/index/:id')
    .get(getData)
    .put(updateData)
    .delete(deleteData);

app.route('/update/:id')
    .post(updateTimer);
//If we reach this middleware the route could not be handled and must be unknown.
app.use(handle404);

//Generic error handling middleware.
app.use(handleError);
/*
 * Retrieve all items.
 */

function updateTimer(req, res, next) {
    console.log(req.params);
    console.log(req.body);
    var data = req.body.counter;
    var dataID = req.params.id;
    console.log("Got a POST request for the homepage");
    console.log(data);
    var projectCount;
    //console.log(response);

    r.table('customerData').get(dataID).toJSON().run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }
        console.log(result);
        var obj = JSON.parse(result);
        projectCount = obj['project_count'];
        console.log("Project Count " + projectCount);
        projectCount = projectCount + 1;
        var response = {
            "project_number": projectCount,
            "project_length": req.body.counter
        };
        r.table('customerData').get(dataID).update({"project_count": projectCount}, {returnChanges: true}).run(req.app._rdbConn, function (err, result) {
            if (err) {
                return next(err);
            }
        });
        //r.table('customerData').get(dataID).insert({"scene_count": response}, {returnChanges: true}).run(req.app._rdbConn, function(err, result) {
        //    if(err) {
        //        return next(err);
        //    }
        //});
        r.table('customerData').get(dataID).update({scene_count: r.row('scene_count').append(response)})
            .run(req.app._rdbConn, function (err, result) {
                if (err) {
                    return next(err);
                }
            });
    });

    //r.table('customerData').get(dataID).update({"project_count": projectCount}, {returnChanges: true}).run(req.app._rdbConn, function(err, result) {
    //  if(err) {
    //    return next(err);
    //  }
    //});

    r.table('customerData').get(dataID).update({"session_length": data}, {returnChanges: true}).run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result.changes[0].new_val);
    });
}


function listData(req, res, next) {
    r.table('customerData').orderBy({index: 'createdAt'}).run(req.app._rdbConn, function (err, cursor) {
        if (err) {
            return next(err);
        }

        //Retrieve all the items in an array.
        cursor.toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        });
    });
}

/*
 * Insert a new item.
 */
function createData(req, res, next) {
    var data = req.body;
    data.createdAt = r.now();

    console.dir(data);

    r.table('customerData').insert(data, {returnChanges: true}).run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result.changes[0].new_val);
    });
}

/*
 * Get a specific item.
 */
function getData(req, res, next) {
    var data = req.params.id;

    r.table('customerData').get(data).run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
}

/*
 * Update an item.
 */
function updateData(req, res, next) {
    var data = req.body;
    var dataID = req.params.id;

    r.table('customerData').get(dataID).update(data, {returnChanges: true}).run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result.changes[0].new_val);
    });
}

/*
 * Delete an item.
 */
function deleteData(req, res, next) {
    var dataID = req.params.id;

    r.table('customerData').get(dataID).delete().run(req.app._rdbConn, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json({success: true});
    });
}

/*
 * Page-not-found middleware.
 */
function handle404(req, res, next) {
    res.status(404).end('not found');
}

/*
 * Generic error handling middleware.
 * Send back a 500 page and log the error to the console.
 */
function handleError(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({err: err.message});
}

/*
 * Store the db connection and start listening on a port.
 */
function startExpress(connection) {
    app._rdbConn = connection;
    app.listen(config.express.port);
    console.log('Listening on port ' + config.express.port);
}

/*
 * Connect to rethinkdb, create the needed tables/indexes and then start express.
 * Create tables/indexes then start express
 */
async.waterfall([
    function connect(callback) {
        r.connect(config.rethinkdb, callback);
    },
    function createDatabase(connection, callback) {
        //Create the database if needed.
        r.dbList().contains(config.rethinkdb.db).do(function (containsDb) {
            return r.branch(
                containsDb,
                {created: 0},
                r.dbCreate(config.rethinkdb.db)
            );
        }).run(connection, function (err) {
            callback(err, connection);
        });
    },
    function createTable(connection, callback) {
        //Create the table if needed.
        r.tableList().contains('customerData').do(function (containsTable) {
            return r.branch(
                containsTable,
                {created: 0},
                r.tableCreate('customerData')
            );
        }).run(connection, function (err) {
            callback(err, connection);
        });
    },
    function createIndex(connection, callback) {
        //Create the index if needed.
        r.table('customerData').indexList().contains('createdAt').do(function (hasIndex) {
            return r.branch(
                hasIndex,
                {created: 0},
                r.table('customerData').indexCreate('createdAt')
            );
        }).run(connection, function (err) {
            callback(err, connection);
        });
    },
    function waitForIndex(connection, callback) {
        //Wait for the index to be ready.
        r.table('customerData').indexWait('createdAt').run(connection, function (err, result) {
            callback(err, connection);
        });
    }
], function (err, connection) {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }

    startExpress(connection);
});
