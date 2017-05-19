var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');
var ObjectId  = Schema.ObjectId;

var SaleInfoSchema = new Schema({
  Info_id: { type: ObjectId }, 	//商品信息
  sell_id: { type: ObjectId }, 	//卖方
  buy_id: { type: ObjectId },	//买方
  price: { type: Number },		//交易价格
  trad_at: { type: Date, default: Date.now } //交易时间
});

QuestionSchema.plugin(BaseModel);


mongoose.model('SaleInfo', InfoSchema);
