/**
 * @author Mr.He
 * @date 20161010
 * @fileoverview 自动添加模块路由配置
 */

module.exports = (Router) => {

    Router.get("/addpage" , (req , res , next) => {
        res.render("addModule/index" , {
            pageTitle : "Yes"
        });
    });

    return Router;
}