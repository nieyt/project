var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var UpSchema = new Schema({
    user_id: {type: ObjectId},
    info_id: {type: ObjectId}
});

mongoose.model('Up', UpSchema);