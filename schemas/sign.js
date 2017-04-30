var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    urername: {type: String},
    userid: {type: Number},
    password: {type: String}
});

userSchema.pre('save', function (next) {//pre是一个中间件来的，当触发data事件时会执行该函数
    // if (this.isNew) {
    //     app.json({
    //         'success':1,
    //         'message':'保存成功'
    //     })
    //     // this.meta.createAt = this.meta.updateAt = Date.now();
    // }
    // else {
    //     app.json({
    //         'success':0,
    //         'message':'保存失败'
    //     })
    //     // this.meta.updateAt = Date.now();
    // }
    next();
})

// 静态方法在Model层就能使用
userSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})//取出数据库的所有的数据
            // .sort('meta.updateAt')//根据更新时间来排序
            .exec(cb);//执行回调函数
    },
    findById: function (id, cb) {
        return this
            .findOne({userid: id})
            .exec(cb);//执行回调函数
    }
}

module.exports = userSchema;