/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */

module.exports = (Router) => {
    Router.get("/users/find", (req, res, next) => {
        var limit = req.query.limit || 10,
            offset = req.query.offset || 0;
        req.models.User2.find({}).limit(limit).offset();
    });

    Router.post("/users/update", (req, res, next) => {
        var params = req.body;
        req.models.User2.find({
            email : req.session.userInfo.email
        }, (err, data) => {
            if(!err) {
                if(data.length) {
                    if(params.status) {

                    }
                } else {
                    res.json({
                        success : false,
                        msg : "未查找到该用户"
                    })
                }
            } else {
                next(err);
            }
        });
    });

     return Router;
};