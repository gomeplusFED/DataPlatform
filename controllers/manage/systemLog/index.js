/**
 * @author yanglei
 * @date 20160503
 * @fileoverview 角色管理
 */
var util = require("../../../utils");

module.exports = (Router) => {
    Router.get("/log/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 10,
            page = query.page || 1,
            sql = "SELECT * FROM tbl_dataplatform_nodejs_log ORDER BY date DESC"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.Log.count({}, (err, count) => {
            if(!err) {
                req.db.driver.execQuery(sql, (err, data) => {
                    if(!err) {
                        res.json({
                            code : 200,
                            count : count,
                            data : data
                        });
                    } else {
                        next(err);
                    }
                });
            } else {
                next(err)
            }
        });
    });

    return Router;
};