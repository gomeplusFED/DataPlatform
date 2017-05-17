/**
 * @author lzn
 * @date 20161213
 * @fileoverview 发送邮件
 */
var email = require("emailjs");


module.exports = (Router) => {

    Router.post("/email/send", (req, res, next) => {
        let body = req.body;
        let mails = JSON.parse(body.mails);
        var server = email.server.connect({
            user: body.username,
            password: body.password,
            host: "10.58.46.25",
            ssl: false
        });
        let tasks = [];
        for(let mail of mails) {
            let {subject, text, to} = mail;
            tasks.push(new Promise((resolve, reject) => {
                server.send({
                    text,
                    from: body.email,
                    to,
                    subject
                }, function (err, message) {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(to);
                    }
                });
            }));
        }
        Promise.all(tasks).then(() => {
            res.json({
                code : 200,
                success : true,
                msg: 'ok'
            });
        }).catch((e) => {
            res.json({
                code : 400,
                success : false,
                msg: e
            });
        })

    });
    return Router;
};