// 选择类目接口
module.exports = function(Router) {
    Router.get('/api/categories', function(req, res, next) {
        var pid = req.query.pid || 0;
        req.models["ConfCategories"].find({ pid: pid, status: 1 }, function(err, data) {
            res.send(data);
        })
    });

    Router.get('/api/socialAnalysisCategories', function(req, res, next) {
        var pid = req.query.pid || "";
        req.models["SocialCategory"].find({ pid: pid }, function(err, data) {
            res.send(data);
        });
    });
    return Router;
};
