/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */

module.exports = {
    productOne(data) {
        var source = data.data,
            newData = {
                one : 0,
                two : 0,
                three : 0,
                four : 0,
                five : 0,
                six : 0,
                seven : 0
            };
        for(var key of source) {
            if(key.key_type === "products_acc") {

            }
        }
    }
};