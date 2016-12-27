/**
 * @author yanglei
 * @date 2016-12-06
 * @fileoverview
 */
const rows = [
    ["date", "new_reg_num", "one", "reg_num", "aaccount", "app_new_act", "app_new_reg",
        "two", "app_auser", "three", "app_pv", "four", "app_ip", "pc_new_visit", "pc_new_reg",
        "five", "pc_visit", "six",  "pc_pv", "pc_ip", "wap_new_visit", "wap_new_reg",
        "seven", "wap_visit", "eight", "wap_pv", "wap_ip"]
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
const _col = ["月份", "新增注册用户量", "注册转化率", "累计注册用户数", "平台活跃账户数", "APP新增激活",
    "APP新增注册", "APP注册转化率", "APP活跃用户量", "APP新用户占比", "APP启动次数","APP人均启动次数",
    "APP启动IP数", "pc端新增访问人数", "pc端注册人数", "pc端注册转化率", "pc端访问人数", "PC端新用户占比",
    "pc端访问量","PC端访问IP数","WAP站新增访问人数", "WAP站注册人数", "WAP站注册转化率",
    "WAP站访问人数", "WAP站新问用户占比", "WAP站访问量", "WAP站访问IP数"];
const rowsWeek = [
    ["date", "new_reg_num", "one", "reg_num", "aaccount", "app_new_act", "app_new_reg", "two", "app_auser",
        "three",
        //"four",
        "app_pv", "six", "five", "app_ip", "pc_new_visit", "pc_new_reg", "seven", "pc_visit",
        "pc_pv", "pc_ip", "eight", "one_one", "wap_new_visit", "wap_new_reg", "one_two", "wap_visit",
        "one_three", "wap_pv", "wap_ip", "one_four"]
];
const colsWeek = [
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
    //},{
    //    caption : ""
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
    },{
        caption : ""
    }]
];
const _colWeek = ["日期", "新增注册用户量", "注册转化率", "累计注册用户数", "平台活跃账户数", "APP新增激活",
    "APP新增注册", "APP注册转化率", "APP活跃用户量", "APP新用户占比",
    //"APP活跃率",
    "APP启动次数", "APP人均启动次数",
    "APP启动IP数", "APP次日留存", "pc端新增访问人数", "pc端注册人数", "pc端注册转化率", "pc端访问人数",
    "PC端新用户占比", "pc端访问量", "PC端访问IP数", "PC端次日留存", "WAP站新增访问人数", "WAP站注册人数",
    "WAP站注册转化率", "WAP站访问人数", "WAP站新用户占比", "WAP站访问量", "WAP站访问IP数", "WAP站次日留存"];
const rowsMonth = [
    ["date", "new_reg_num", "one", "reg_num", "aaccount", "app_new_act", "app_new_reg", "two", "app_auser",
        "three", "app_pv", "five", "app_ip", "six", "app7", "app14", "pc_new_visit", "pc_new_reg", "seven", "pc_visit",
        "eight", "pc_pv", "pc_ip", "one_one", "pc7", "pc14", "wap_new_visit", "wap_new_reg", "one_two", "wap_visit",
        "one_three","wap_pv", "wap_ip", "one_four", "wap7", "wap14"]
];
const colsMonth = [
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
    },{
        caption : ""
    },{
        caption : ""
    },{
        caption : ""
    }]
];
const _colMonth = ["日期", "新增注册用户量", "注册转化率", "累计注册用户数", "平台活跃账户数", "APP新增激活",
    "APP新增注册", "APP注册转化率", "APP活跃用户量", "APP新用户占比", "APP启动次数", "APP人均启动次数",
    "APP启动IP数", "APP次日留存", "APP七日留存", "APP14日留存", "pc端新增访问人数", "pc端注册人数", "pc端注册转化率", "pc端访问人数",
    "PC端新用户占比", "pc端访问量", "PC端访问IP数", "PC端次日留存", "PC端七日留存", "PC端14日留存", "WAP站新增访问人数", "WAP站注册人数",
    "WAP站注册转化率", "WAP站访问人数", "WAP站新用户占比", "WAP站访问量", "WAP站访问IP数", "WAP站次日留存", "WAP站7日留存", "WAP站14日留存"];
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
                +key.new_reg_num,
                +key.app_new_act + +key.pc_new_visit + +key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            key.four = util.ceil(key.app_pv, key.app_auser);
            key.five = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.six = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.seven = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.eight = util.toFixed(key.wap_new_visit, key.wap_visit);
            key.aaccount = Math.ceil(key.aaccount);
            key.new_reg_num = Math.ceil(key.new_reg_num);
            key.date = moment(key.date).format("YYYY-MM-DD");
            if(key.date === z && key.day_type === 1) {
                zObj = key;
            } else if(key.date === q && key.day_type === 1) {
                qObj = key;
            } else if(key.date === z && key.day_type === 6) {
                obj = key;
            }
            if(key.day_type === 1) {
                newData.push(key);
            }
        }
        const two = {};
        const three = {};
        obj.date = "近30天平均";
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
        two.date = "昨日增长";
        two.one = "--";
        two.two = "--";
        two.three = "--";
        two.five = "--";
        two.six = "--";
        two.seven = "--";
        two.eight = "--";
        two.four = two.four.toFixed(2);
        three.date = "昨日对比";
        three.one = "--";
        three.two = "--";
        three.three = "--";
        three.five = "--";
        three.six = "--";
        three.seven = "--";
        three.eight = "--";
        newData.push(obj);
        newData.push(two);
        newData.push(three);
        return util.toTable([newData], rows, cols);
    },
    weekOne(data) {
        const source = data.first.data[0];
        let one = {};
        for(let i = 0; i < rowsWeek[0].length; i++) {
            one[rowsWeek[0][i]] = _colWeek[i];
        }
        for(let key of source) {
            key.one = util.toFixed(
                +key.new_reg_num,
                +key.app_new_act + +key.pc_new_visit + +key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            key.four = util.toFixed(key.app_auser, key.app_new_act);
            key.five = util.ceil(key.app_pv, key.app_auser);
            key.six = util.toFixed(key.week_day_app, key.week_day_app_new);
            key.seven = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.eight = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.one_one = util.toFixed(key.week_day_pc, key.week_day_pc_new);
            key.one_two = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.one_three = util.toFixed(key.wap_new_visit, key.wap_visit);
            key.one_four = util.toFixed(key.week_day_wap, key.week_day_wap_new);
            key.date = `${moment(key.date - 6 * 24 * 60 * 60 * 1000).format("MM.DD")}-${moment(key.date).format("MM.DD")}`;
        }

        return util.toTable([[one].concat(source)], rowsWeek, colsWeek);
    },
    monthOne(data) {
        const source = data.first.data[0];
        let one = {};
        for(let i = 0; i < rowsMonth[0].length; i++) {
            one[rowsMonth[0][i]] = _colMonth[i];
        }
        for(let key of source) {
            key.one = util.toFixed(
                +key.new_reg_num,
                +key.app_new_act + +key.pc_new_visit + +key.wap_new_visit
            );
            key.two = util.toFixed(key.app_new_reg, key.app_new_act);
            key.three = util.toFixed(key.app_new_act, key.app_auser);
            //key.four = util.toFixed(key.app_auser, key.app_new_act);
            key.five = util.ceil(key.app_pv, key.app_auser);
            key.six = util.toFixed(key.mon_day_app, key.mon_day_app_new);
            key.seven = util.toFixed(key.pc_new_reg, key.pc_new_visit);
            key.eight = util.toFixed(key.pc_new_visit, key.pc_visit);
            key.one_one = util.toFixed(key.mon_day_pc, key.mon_day_pc_new);
            key.one_two = util.toFixed(key.wap_new_reg, key.wap_new_visit);
            key.one_three = util.toFixed(key.wap_new_visit, key.wap_pv);
            key.one_four = util.toFixed(key.mon_day_wap, key.mon_day_wap_new);
            key.app7 = util.toFixed(key.mon_7day_app, key.mon_7day_app_new);
            key.app14 = util.toFixed(key.mon_14day_app, key.mon_14day_app_new);
            key.pc7 = util.toFixed(key.mon_7day_pc, key.mon_7day_pc_new);
            key.pc14 = util.toFixed(key.mon_14day_pc, key.mon_14day_pc_new);
            key.wap7 = util.toFixed(key.mon_7day_wap, key.mon_7day_wap_new);
            key.wap14 = util.toFixed(key.mon_14day_wap, key.mon_14day_wap_new);
            key.date = `${moment(key.date).format("MM")}月`;
        }

        return util.toTable([[one].concat(source)], rowsMonth, colsMonth);
    }
};