/**
 * @author liuliang
 * @fileoverview 用户权限页面逻辑
 * @date 20151222
 */

(function(doc, win) {

  var userManagement = {
    init: function() {
      this.$edit = $(".limit-edit");
      this.$view = $(".limit-view");
      this.$changeRole = $(".limit-change-role");
      this.$searchBtn = $("button[name=search-btn]");
      this.data = this.createSelect2(win.limitArray, true);
      this.bindEvent();
    },
    bindEvent: function() {
      var self = this;
      self.$edit.click(function() {
        var $select = $(this).parent().find(".js-data-example-ajax");
        if (!$select.data('select')) {
          var select = $select.select2({
            data: self.data
          });
          $select.data('select', select).next('.select2-container').hide();
        }
        $(this).parents('td').children('form').toggle();
        $select.next('.select2-container').toggle();
        if($select.data('open') !== 1){
          var userid = $(this).attr('data-id');
          self.getLimits(userid,function(data){
            if(data.length){
              data = data[0].limited.split(',');
              $select.data('select').val(data).trigger('change'); 
            } 
          });
          $select.data('open',1);
        }else{
          //clear
          $select.data('select').val(null).trigger('change'); 
          $select.data('open',0); 
        }
        return false;
      });

      /*点击提交按钮提交*/
      $("input[name=submit]").on("click", function() {
        var tdParent = $(this).parents('td');
        var value = tdParent.find("select").val();
        var userid = tdParent.find('input[name=userId]').val();
        self.setLimits({
          userId:userid,
          limits:value.join(',')
        }, function(data) {
          if(data.success){
            alert('更新成功'); 
            tdParent.find('.limit-edit').trigger('click');
          }else{
            alert('更新失败'); 
          }
        });
      });

      /*点击角色修改*/
      this.$changeRole.on("click", function() {
        var that = $(this);
        var role = parseInt($(this).data('role'));
        role = role === 0 ? 1 : 0;
        self.setRole(role, $(this).data('id'), function(data) {
          if (data.success) {
            that.data("role", data.data);
            that.parent("td").children('.user-role').text(data.data + 0 ? "管理员" : "普通用户");
          }
        });
        return false;
      });

      self.$searchBtn.on("click", function() {
        self.searchUser();
        return false;
      });

      $("input[name=search-by-mail]").keydown(function(e) {
        if (e.keyCode === 13) {
          self.searchUser();
        }
      });
    },
    getLimits: function(userid, cb) {
      this._request('/user/showLimit', {
        userId: userid
      }, cb);
    },
    setLimits: function(data, cb) {
      this._request('/user/updateLimit', data, cb);
    },
    setRole: function(role, userid, cb) {
      this._request('/user/changeRole', {
        role: role,
        userId: userid
      }, cb);
    },
    _request: function(api, data, cb, type) {
      $.ajax({
        type: type || 'POST',
        url: api,
        data: data,
        dataType: 'json',
        success: cb
      });
    },
    searchUser: function() {
      var input = $("input[name=search-by-mail]");
      if (!input.val().trim()) {
        $(".alert-message").removeClass('hidden').text("搜索内容不能为空");
        return false;
      } else {
        location.href = "/user/all?query=" + input.val();
      }
    },
    createSelect2: function(initailData, isDisplayFalseUndo) {
      var data = [],
        key = null,
        path = null;
      function forPath(data,v,k){
        data.id += "-"+k; 
      }
      if (Array.isArray(initailData)) {
        initailData.forEach(function(item, index) {
          key = Object.keys(item)[0];
          if (item[key].display || isDisplayFalseUndo) {
            data[index] = {
              id: item[key].id
            };
            for(var keys in item[key]){
              if(keys === "name"){
                data[index].text = item[key].name;
              }else if (keys === "path" && item[key].path.length > 0) {
                path = item[key].path;
                path.forEach(forPath.bind(null, data[index]));
              }
            }
          }
        });
      }
      return data;
    }
  };

  $(doc).ready(function() {
    userManagement.init();
  });

})(document, window);
