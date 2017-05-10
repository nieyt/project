var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var ClassifySchema = new Schema({
  classify: { type: String },
  info_id: { type: ObjectId },
  info_title: { type: String },
  create_at: { type: Date, default: Date.now }
});

TopicSchema.plugin(BaseModel);

TopicSchema.index({ tag: 1 });
TopicSchema.index({ question_id: 1 });
TopicSchema.index({ create_at: -1 });

mongoose.model('Topic', TopicSchema);
