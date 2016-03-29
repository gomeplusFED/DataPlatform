/**
 * @author liuliang
 * @date 20151222
 * @fileoverview  分页前台逻辑
 */
(function(win) {

  function pagination(options) {

    var currentPage = options.currentPage,
      pageCount = options.pageCount,
      path = options.path,
      params = (function(a) {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(location);

    function gotoPage(page){
      location.href = path + "?page=" + page + (params.query ? "&query=" + params.query : "");
    }

    $('.pagination').on('click', "[data-action=J_page]", function(e) {
      var target = $(e.target);
      if(!target.parent().hasClass('goto')) gotoPage(target.text());
    });

    $('.pagination').on("click", "[data-action=J_prev]", function(e) {
      var target = $(e.target);
      var isDisabled = target.hasClass('disabled');
      if (!isDisabled) {
        currentPage -= 1;
        currentPage = currentPage < 1 ? 1 : currentPage;
        gotoPage(currentPage);
      }
    });

    $('.pagination').on("click", "[data-action=J_next]", function(e) {
      var target = $(e.target);
      var isDisabled = target.hasClass('disabled');
      if (!isDisabled) {
        currentPage += 1;
        currentPage = currentPage > pageCount ? pageCount : currentPage;
        gotoPage(currentPage);
      }
    });

  }

  pagination(win.$page_config);

})(window);
