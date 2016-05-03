/**
 * @author yanglei
 * @date 20160503
 * @fileoverview 角色管理
 */
var orm = require("orm");

module.exports = (Router) => {
    Router.get("/role/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 30,
            page = query.page || 1,
            sql = "SELECT * FROM tbl_dataplatform_nodejs_role"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.Role.count({}, (err, count) => {
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

    Router.post("/role/update", (req, res, next) => {

    });

    Router.post("/role/add", (req, res, next) => {

    });

    return Router;
};