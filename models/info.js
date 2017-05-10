var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var InfoSchema = new Schema({
  title: { type: String },
  author_id: { type: ObjectId },
  description: { type: String },
  images: { type: String, default: '/img/default.jpg' },
  area: { type: String, default: '烟台' },
  classify: { type: String },	// 分类
  price: { type: Number },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  comment_id: [{ type: ObjectId }],             // 评论的人
  approval: [{ type: ObjectId }]				// 点赞的人	
});

QuestionSchema.plugin(BaseModel);

// UserSchema.index({ email: 1 }, { unique: true });
// QuestionSchema.index({ title: 1 });
// QuestionSchema.index({ author_id: 1 });
// QuestionSchema.index({ tags: 1 });
// QuestionSchema.index({ comment_id: 1 });
// QuestionSchema.index({ pv: -1 });

mongoose.model('Info', InfoSchema);
