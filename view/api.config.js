/**
 * Created by Alan(000058) on 2016/11/17.
 * Email: 1480801@qq.com
 *
 * !!!!!!!!!!!注意!!!!!!!!!!!!
 *  该文件可存于本地,避免冲突无需每次提交,如果有经常使用的后端api会定期更新
 */
const apiConfig = [
    {regexp:/\/mudev37\//ig,api:"http://192.168.1.37:801"}, //192.168.1.37 测试服务器
    {regexp:/\/mudev\//ig,api:"http://10.0.10.243:8066"}, //沈宇清
    {regexp:/\/lwj$\//ig,api:"http://10.0.10.145:8087"}, //梁文捷
    {regexp:/\/transferApi\//ig,api:"http://transferApi.ceair.com:807/"}, //梁文捷
    {regexp:/\/transferApi02\//ig,api:"http://192.168.1.62:905"}, //梁文捷
    {regexp:/\/addservices\//ig,api:"http://172.19.148.62:8999"},
    {regexp:/\/hotelApi\//ig,api:"http://172.19.148.62:701"},
    {regexp:/\/travelApi\//ig,api:"http://dev.ceair.com"}
];
module.exports=apiConfig;