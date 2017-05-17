var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var ChatSchema = new Schema({
  author_id: { type: ObjectId },
  author_name: { type: String },
  sent_id: { type: ObjectId },
  content:{type:String},
  create_at: { type: Date, default: Date.now },
  
});

ChatSchema.plugin(BaseModel);

ChatSchema.index({ create_at: -1 });
// QuestionSchema.index({ title: 1 });
// QuestionSchema.index({ author_id: 1 });
// QuestionSchema.index({ tags: 1 });
// QuestionSchema.index({ comment_id: 1 });
// QuestionSchema.index({ pv: -1 });

mongoose.model('Chat', ChatSchema);
