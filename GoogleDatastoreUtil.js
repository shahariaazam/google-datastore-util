'use strict';
var GoogleDatastoreUtil = function (options) {

    var ds = require('@google-cloud/datastore')({
        projectId: options.projectId,
        keyFilename: options.keyFilename,
        namespace: options.namespace
    });

    var kind = options.kind;

    function fromDatastore(obj) {
        obj.data.id = obj.key.id;
        return obj.data;
    }

    function toDatastore(obj, nonIndexed) {
        nonIndexed = nonIndexed || [];
        var results = [];
        Object.keys(obj).forEach(function (k) {
            if (obj[k] === undefined) {
                return;
            }
            results.push({
                name: k,
                value: obj[k],
                excludeFromIndexes: nonIndexed.indexOf(k) !== -1
            });
        });
        return results;
    }


    this.list = function (limit, token, cb) {
        var q = ds.createQuery([kind])
            .limit(limit)
            .order('title')
            .start(token);

        ds.runQuery(q, function (err, entities, nextQuery) {
            if (err) {
                return cb(err);
            }
            var hasMore = entities.length === limit ? nextQuery.startVal : false;
            cb(null, entities.map(fromDatastore), hasMore);
        });
    };

    this.update = function (id, data, cb) {
        var key;
        if (id) {
            key = ds.key([kind, parseInt(id, 10)]);
        } else {
            key = ds.key(kind);
        }

        var entity = {
            key: key,
            data: toDatastore(data, ['description'])
        };

        ds.save(
            entity,
            function (err) {
                data.id = entity.key.id;
                cb(err, err ? null : data);
            }
        );
    };

    this.read = function (id, cb) {
        var key = ds.key([kind, parseInt(id, 10)]);
        ds.get(key, function (err, entity) {
            if (err) {
                return cb(err);
            }
            if (!entity) {
                return cb({
                    code: 404,
                    message: 'Not found'
                });
            }
            cb(null, fromDatastore(entity));
        });
    };

    this.delete = function (id, cb) {
        var key = ds.key([kind, parseInt(id, 10)]);
        ds.delete(key, cb);
    };

    this.create = function (data, cb) {
        this.update(null, data, cb);
    }
};

GoogleDatastoreUtil.prototype.test = function () {
    console.log(1);
};

module.exports = function (options) {
    return new GoogleDatastoreUtil(options);
};