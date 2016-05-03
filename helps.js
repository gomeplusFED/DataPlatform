/**
 * @author xiaojue
 * @fileoverview view中的帮助函数
 */
var ejs = require('ejs');

module.exports = function(app) {

    app.locals.createPaginationItem = function(currentPage, pageCount, pageMax, paginationMaxCount) {
        var fixedCurrentPage = 1,
            offset = Math.ceil(paginationMaxCount / 2);
        fixedCurrentPage = (currentPage - offset) >= 1 ? (currentPage - offset) : 1;
        if (pageCount > paginationMaxCount) {
            /*当前页处于分页的中间位置*/
            fixedCurrentPage = currentPage >= offset + 1 ? (currentPage - offset) : 1;
            /*修正startIndex，分页按钮数总是paginationMaxCount*/
            if (pageCount - fixedCurrentPage + 1 < paginationMaxCount) {
                fixedCurrentPage -= paginationMaxCount - pageCount + currentPage - offset - 1;
            }
        }
        /*修正fixedCurrentPage出现0*/
        fixedCurrentPage = fixedCurrentPage > 0 ? fixedCurrentPage : 1;
        var str = ejs.render('<% for(var i = fixedCurrentPage;i <= pageCount&&i<(paginationMaxCount+fixedCurrentPage); i++){%>' +
            '<li data-action="J_page" <% if(i == currentPage){ %>class="active goto"<%}%> ><a href="javascript:;"><%= i %></a></li>' +
            '<% } %>', {
                fixedCurrentPage: fixedCurrentPage,
                pageCount: pageCount,
                paginationMaxCount: paginationMaxCount,
                currentPage: currentPage
            });
        return str;
    };
    app.locals.createNavBarByLimit = function(userInfo,limit){
        var limited = userInfo.limited;
        var str = '';
        for(limitItem in limited){
            if(limit[limitItem]){
                var href = limit[limitItem].href;
                var name = limit[limitItem].name;
                var path = limit[limitItem].path;
                var className = limit[limitItem].className;
                str += '<li><a href="#!' + href + '"><i class="' + className + '"></i>' + name;
                if(limited[limitItem].length){
                    str += '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">';
                    limited[limitItem].forEach(function(v, k){
                        var pathItem = path[v];
                        if(pathItem && pathItem.display){
                            str += '<li><a href="#!' + pathItem.path + '">' + pathItem.name + '</a></li>';
                        }
                    })
                    str += '</ul>';
                }else{
                    str += '</a>';
                }
                str += '</li>';
            }
        }
        return str;
    }
};
