/**
 * @author yanglei
 * @date 20160503
 * @fileoverview 角色管理
 */
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

    Router.post("/role/add", (req, res, next) => {
        var body = req.body,
            params = {
                name : body.name,
                date : new Date().getTime(),
                limited : body.limited || "{}",
                export : body.export | "{}",
                status : 1,
                remark : body.remark
            };
        req.models.Role.create(params, (err, data) => {
            if(!err) {
                res.json({
                    code : 200,
                    success : true,
                    msg : "添加角色成功"
                })
            } else {
                res.json({
                    code : 400,
                    success : false,
                    msg : "添加角色失败"
                });
            }
        })
    });

    return Router;
};