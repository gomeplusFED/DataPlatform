/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */

module.exports = (Router) => {
    Router.get("/users/all", (req, res, next) => {
        var params = req.query || {};
        req.models.User2.find(params, (err, data) => {
            if(!err) {
                res.json(data);
            }
        });
    });

    Router.post("/users/update", (req, res, next) => {
        var params = req.body;
        req.models.User2.find({
            email : req.session.userInfo.email
        }, (err, data) => {
            if(!err) {
                
            } else {
                next(err);
            }
        });
    });
};