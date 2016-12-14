/**
 * @author lzn
 * @date 20161213
 * @fileoverview 发送邮件
 */
var email = require("emailjs");
var emailcfg = require('../../../db/email.json');
var server = email.server.connect(emailcfg);

module.exports = (Router) => {

    Router.post("/email/send", (req, res, next) => {
        let {subject, text, to} = req.body;
        server.send({
            text,
            from: emailcfg.from,
            to,
            subject
        }, function (err, message) {
            if (err) {
                res.json({
                    code : 400,
                    success : false,
                    msg: err.message
                });
            } else {
                res.json({
                    code : 200,
                    success : true,
                    msg: message
                });
            }
        });
    });
    return Router;
};