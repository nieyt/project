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
  brand:{type:String},
  price: { type: Number },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  comment_id: [{ type: ObjectId }],             // 评论的人
  approval: { type: Number },			// 点赞人数	
});

InfoSchema.plugin(BaseModel);

InfoSchema.index({ create_at: 1 });

mongoose.model('Info', InfoSchema);
