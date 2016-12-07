/**
 * @author yanglei
 * @date 2016-12-06
 * @fileoverview
 */
const rows = [
    ["date", "aaccount", "new_reg_num", "one", "reg_num", "app_new_act", "app_new_reg",
        "two", "app_auser", "three", "app_pv", "app_ip", "four", "pc_new_visit", "pc_new_reg",
        "five", "pc_visit", "pc_pv", "pc_ip", "six", "wap_new_visit", "wap_new_reg",
        "seven", "wap_visit", "wap_pv", "wap_ip", "eight"]
];
const cols = [
    [{
        caption : ""
    },{
        caption : "全部平台"
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : "APP"
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : "PC"
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : "WAP站"
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    }]
];
const _col = ["月份", "平台活跃账户数", "新增注册用户量", "注册转化率", "累计注册用户数", "APP新增激活",
    "APP新增注册", "APP注册转化率", "APP活跃用户量", "APP新用户占比", "APP启动次数", "APP启动IP数",
    "APP人均启动次数", "pc端新增访问人数", "pc端注册人数", "pc端注册转化率", "pc端访问人数", "pc端访问量",
    "PC端访问IP数", "PC端新用户占比", "WAP站新增访问人数", "WAP站注册人数", "WAP站注册转化率",
    "WAP站访问人数", "WAP站访问量", "WAP站访问IP数", "WAP站新问用户占比"];
const moment = require("moment");
const util = require("../../utils");

module.exports = {
    dayOne(data, now) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        let zObj = {};
        let qObj = {};
        let obj = {};
        let one = {};
        const newData = [];
        for(let i = 0; i < rows[0].length; i++) {
            one[rows[0][i]] = _col[i];
        }
        newData.push(one);
        for(let key of source) {
            key.one = util.toFixed(
                key.app_new_reg + key.pc_new_reg + key.wap_new_reg,
                key.app_new_act + key.pc_new_visit + key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            key.four = util.division(key.app_pv, key.app_auser);
            key.five = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.six = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.seven = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.eight = util.toFixed(key.wap_new_visit, key.wap_visit);
            key.date = moment(key.date).format("YYYY-MM-DD");
            if(key.date === z && key.day_type === 1) {
                zObj = key;
            } else if(key.date === q && key.day_type === 1) {
                qObj = key;
            } else if(key.date === z && key.day_type === 5) {
                obj = key;
            }
            if(key.day_type === 1) {
                newData.push(key);
            }
        }
        const two = {};
        const three = {};
        for(let row of rows[0]) {
            if(row !== "date" &&
                row !== "one" &&
                row !== "two" &&
                row !== "three" &&
                row !== "five" &&
                row !== "six" &&
                row !== "seven" &&
                row !== "eight") {
                two[row] = (zObj[row] || 0) - (qObj[row] || 0);
                three[row] = util.toFixed(two[row], qObj[row] || 0);
            }
        }
        two.date = "昨日新增";
        two.one = "--";
        two.two = "--";
        two.three = "--";
        two.five = "--";
        two.six = "--";
        two.seven = "--";
        two.eight = "--";
        three.date = "昨日新增比率";
        three.one = "--";
        three.two = "--";
        three.three = "--";
        three.five = "--";
        three.six = "--";
        three.seven = "--";
        three.eight = "--";
        newData.push(two);
        newData.push(three);
        return util.toTable([newData], rows, cols);
    },
    weekOne(data) {
        const source = data.first.data[0];
        let one = {};
        for(let i = 0; i < rows[0].length; i++) {
            one[rows[0][i]] = _col[i];
        }
        for(let key of source) {
            key.one = util.toFixed(
                key.app_new_reg + key.pc_new_reg + key.wap_new_reg,
                key.app_new_act + key.pc_new_visit + key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            key.four = util.division(key.app_pv, key.app_auser);
            key.five = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.six = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.seven = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.eight = util.toFixed(key.wap_new_visit, key.wap_visit);
            key.date = `${moment(key.date - 6 * 24 * 60 * 60 * 1000).format("MM-DD")}-${moment(key.date).format("MM-DD")}`;
        }

        return util.toTable([[one].concat(source)], rows, cols);
    },
    monthOne(data) {
        const source = data.first.data[0];
        let one = {};
        for(let i = 0; i < rows[0].length; i++) {
            one[rows[0][i]] = _col[i];
        }
        for(let key of source) {
            key.one = util.toFixed(
                key.app_new_reg + key.pc_new_reg + key.wap_new_reg,
                key.app_new_act + key.pc_new_visit + key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            key.four = util.division(key.app_pv, key.app_auser);
            key.five = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.six = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.seven = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.eight = util.toFixed(key.wap_new_visit, key.wap_visit);
            key.date = `${moment(key.date).format("MM")}月`;
        }

        return util.toTable([[one].concat(source)], rows, cols);
    }
};