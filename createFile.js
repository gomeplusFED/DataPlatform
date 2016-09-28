/**
 * @author yanglei
 * @date 201600928
 * @fileoverview 命令行创建文件
 */

const fs      = require("fs"),
    _path     = require("path"),
    moment    = require("moment");
let propram   = require("commander"),
    path      = _path.join(__dirname),
    type      = "js",
    author    = null,
    catalog   = null,
    name      = null,
    myCommand = propram.version("0.0.1");

myCommand
    .option("-c, --create", "创建文件", (path) => {
        createFile(path);
    })
    .option("-d, --delete", "删除文件", (path) => {
        deleteFile(path)
    })
    .option("-t, --type <type>", "添加文件类型", (type) => {
        addType(type)
    })
    .option("-l, --catalog <catalog>", "添加文件目录", (catalog) => {
        addCatalog(catalog)
    })
    .option("-a, --author <author>", "添加作者", (author) => {
        addAuthor(author)
    })
    .option("-n, --name <name>", "添加文件名称", (n) => {
        addName(n)
    })
    .option("--ca, --createAll", "创建所有文件", () => {
        createAllFile()
    })
    .option("--da, --deleteAll", "删除所有文件", () => {
        deleteAllFile()
    })
    .option("--cs, --createSome", "创建部分文件", () => {
        createSomeFile()
    })
    .option("--ds, --deleteSome", "删除部分文件", () => {
        deleteSomeFile()
    })
    .parse(process.argv);

function addType(t) {
    type = t;
}
function addAuthor(a){
    author = a;
}
function addCatalog(c) {
    catalog = c;
}
function addName(n) {
    name = n;
}
function existFile(path) {
    return fs.existsSync(path);
}
function createFile(path) {
    if(!existFile(path)) {
        let p = path.split("\\");
        let _p = p[0];
        for(let i = 0; i< p.length - 1; i++) {
            if(existFile(_p)) {
                _p = _p.concat(`\\${p[i + 1]}`);
            } else {
                fs.mkdirSync(_p);
                _p = _p.concat(`\\${p[i + 1]}`);
            }
        }
    }
    fs.writeFileSync(path, `/**
 * @author ${author}
 * @date ${moment(new Date()).format("YYYY-MM-DD")}
 * @fileoverview
 */
module.exports = {}`);
    console.log(`已经创建文件,${path}`);
}
function deleteFile(path) {
    fs.unlinkSync(path);
    console.log(`已经删除文件,${path}`);
}
function createAllFile() {
    if(!catalog) {
        console.log("未填写目录");
        return;
    }
    if(!name) {
        console.log("未填写文件名");
        return;
    }
    let _manage = _path.join(path, `/controllers/manage/${catalog}/${name}.${type}`),
        _p = _path.join(path, `/controllers/path/${name}.${type}`),
        _filter = _path.join(path, `/filters/${catalog}/${name}.${type}`);
    path = _manage;
    createFile(path);
    path = _p;
    createFile(path);
    path = _filter;
    createFile(path);
}
function deleteAllFile() {
    let manage = `${path}/controllers/manage/${catalog}`,
        path = `${path}/controllers/path`,
        filter = `${path}/filters`;
    path = manage;
    deleteFile(manage, name);
    path = path;
    deleteFile(path, name);
    path = filter;
    deleteFile(filter, name);
}
function createSomeFile() {
    if(!catalog) {
        console.log("未填写目录");
        return;
    }
    if(!name) {
        console.log("未填写文件名");
        return;
    }
    let _manage = _path.join(path, `/controllers/manage/${catalog}/${name}.${type}`),
        _filter = _path.join(path, `/filters/${catalog}/${name}.${type}`);
    path = _manage;
    createFile(path);
    path = _filter;
    createFile(path);
}
function deleteSomeFile() {
    let manage = `${path}/controllers/manage/${catalog}`,
        filter = `${path}/filters`;
    path = manage;
    deleteFile(manage, name);
    path = filter;
    deleteFile(filter, name);
}