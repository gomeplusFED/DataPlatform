/**
 * @author yanglei
 * @date 20160512
 * @fileoverview 角色不能有重复角色
 */

module.exports = {
    uniq(req, params, cb) {
        req.models.Role.find({
            name : params.name
        }, (err, data) => {
            if(err) {
                cb(err);
            } else {
                cb(null, data);
            }
        })
    }
};