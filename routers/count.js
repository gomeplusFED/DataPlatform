/**
 * @author yanglei
 * @fileoverview 记录网页访问数量
 * @date 20160429
 */

module.exports = (Router) => {

    Router.get("/dataPlatform/count", (req, res, next) => {
        var params = req.query,
            count = req.models.Count;
        count.find(params, (err, data) => {
            if(!err) {
                if(data.length) {
                    data[0].count += 1;
                    data[0].save((err) => {
                        if(!err) {
                            res.send("success");
                        } else {
                            next(err);
                        }
                    });
                } else {
                    params.count = 1;
                    count.create(params, (err, data) => {
                        if(!err) {
                            res.send("success");
                        } else {
                            next(err);
                        }
                    });
                }
            } else {
                next(err);
            }
        })
    });

    return Router;
};