var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var LikeSchema = new Schema({
  user_id: { type: ObjectId },
  info_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now }
});

LikeSchema.plugin(BaseModel);

// LikeSchema.index({ create_at: -1 });
mongoose.model('Like', LikeSchema);
