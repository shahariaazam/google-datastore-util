#### Google Datastore Utilities
Simple CRUD library for Google Datastore.

#### Usage

```js
var ds = require("./GoogleDatastoreUtil")({
    projectId: "googleCloudProjectId",
    keyFilename: "keyFileLocation",
    namespace: "yourNamespace",
    kind: "nameOfKind"
});

ds.read(id, function(error, result){
    console.info(error, result);
});

ds.create(data, function(error, result){
    console.info(error, result);
});

ds.delete(id, function(error, result){
    console.info(error, result);
});

ds.update(id, data, function(error, result){
    console.info(error, result);
});
```