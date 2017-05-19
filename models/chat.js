var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var ChatSchema = new Schema({
  author_id: { type: ObjectId },
  author_name: { type: String },
  send_id: { type: ObjectId },
  content:{type:String},
  create_at: { type: Date, default: Date.now },
  view: { type: Number, default: 0}
});

ChatSchema.plugin(BaseModel);

ChatSchema.index({ create_at: -1 });

mongoose.model('Chat', ChatSchema);
