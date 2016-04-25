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

    app.locals.createNavBarByLimit = function(limits, limit, thirdMenuIndex) {
        var limitItemArray = limits.split(","),
            subLimitItemArray = null,
            href = null,
            className = null,
            limitItem = null,
            limitItemKey = null,
            name = null,
            path = null,
            str = '',
            i = 0,
            parent = -1000,
            children = -1000;
        if (thirdMenuIndex) {
            parent = parseInt(thirdMenuIndex.split("-")[0]);
            children = parseInt(thirdMenuIndex.split("-")[1]);
        }
        limitItemArray.forEach(function(item, index) {
            subLimitItemArray = item.split("-");
            for (i = 0; i < limit.length; i++) {
                limitItemKey = Object.keys(limit[i])[0];
                if (limit[i][limitItemKey].id === (subLimitItemArray[0] - 0) && limit[i][limitItemKey].display) {
                    limitItem = limit[i];
                    break;
                }
            }
            if (limitItem && limitItem[limitItemKey]) {
                href = limitItem[limitItemKey].href;
                className = limitItem[limitItemKey].className;
                name = limitItem[limitItemKey].name;
                path = limitItem[limitItemKey].path;

                var isActive = function(isChildren) {
                    return limitItem[limitItemKey].id === parent ? 'active' : ''
                }
                str += '<li><a href="#!' + href + '"><i class="' + className + '"></i>' + name;
                if (path.length > 0) {
                    str += '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">';
                    path.forEach(function(v, k) {
                        for (var i = 1; i < subLimitItemArray.length; i++) {
                            if (k === parseInt(subLimitItemArray[i])) {
                                if (v.display) {
                                    str += '<li><a href="#!' + v.path + '">' + v.name + '</a></li>';
                                }
                            }
                        }
                    });
                    str += '</ul>';
                } else {
                    str += '</a>';
                }
                str += '</li>';
            }
        });
        return str;
    };
};
