// 选择类目接口
module.exports = function(Router) {
    Router.get('/api/categories', function(req, res, next) {
        let pid = req.query.pid || 0;
        let level = req.query.level || 3;
        req.models["ConfCategories"].find({ pid: pid, status: 1 }, function(err, data) {
            if(data[0] && data[0].level > level){
                res.send([]);
            }else{
                res.send(data);
            }
        });
    });

    Router.get('/api/socialAnalysisCategories', function(req, res, next) {
        var pid = req.query.pid || "";
        req.models["SocialCategory"].find({ pid: pid }, function(err, data) {
            res.send(data);
        });
    });
    
    return Router;
};
