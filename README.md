#美信数据平台#
=======================
##引入核心模板##
<pre><code>var main = require('../..../main');
module.exports = function(Router) {
    Router = new main(Router, options);

    return Router;
};
</code></pre>
##options配置##



<ol>
<li><a href="#1" id="1">路由</a></li>
<li><a href="#2" id="2">数据表名</a></li>
<li><a href="#3" id="3">查询数据后对应的数据名称</a></li>
<li><a href="#4" id="4">添加动态参数所用</a></li>
<li><a href="#5" id="5">添加动态参数，主用于需要查库添加参数所用</a></li>
<li><a href="#6" id="6">查库流程</a></li>
<li><a href="#7" id="7">支持sql查询</a></li>
<li><a href="#8" id="8">对应表是否分页</a></li>
<li><a href="#9" id="9">分页时每页条数</a></li>
<li><a href="#10" id="10">需要求和字段</a></li>
<li><a href="#11" id="11">排序字段</a></li>
<li><a href="#12" id="12">前端模块需查表完成</a></li>
<li><a href="#13" id="13">行</a></li>
<li><a href="#14" id="14">列</a></li>
<li><a href="#15" id="15">是否显示平台</a></li>
<li><a href="#16" id="16">是否显示渠道</a></li>
<li><a href="#17" id="17">是否显示版本</a></li>
<li><a href="#18" id="18">是否显示优惠券类型</a></li>
<li><a href="#19" id="19">是否有导出路径</a></li>
<li><a href="#20" id="20">按钮设置</a></li>
<li><a href="#21" id="21">是否显示时间</a></li>
<li><a href="#22" id="22">初始时间</a></li>
<li><a href="#23" id="23">联动菜单是否显示</a></li>
<li><a href="#24" id="24">联动菜单地址</a></li>
<li><a href="#25" id="25">查询字段名称</a></li>
<li><a href="#26" id="26">单选</a></li>
<li><a href="#27" id="27">数据过滤</a></li>
<li><a href="#28" id="28">搜索框</a></li>
<li><a href="#29" id="29">表格字段选择框</a></li>
<li><a href="#30" id="30">全局模块</a></li>
</ol>
-  **router** --- <a name="1" href=".1">路由</a>

设置了路由之后会默认生成三个路由，在router后添加后缀
<ol>
<li>_json</li>
<li>_jsonp</li>
<li>_excel</li>
</ol>
<pre><code>{
    router : '/xxx/xxx' || '/xxx'
}
</code></pre>
-  **modelName** --- <a name="2" href=".2">数据表名</a>

同一路由可以查询多个表
<pre><code>{
    modelName : ['xxx', 'xxx']
}
</code></pre>
-  **dataName** --- <a name="3">查询数据后对应的数据名称</a>

默认值
<ol>
<li>first --- 查询第一个表之后数据对应的名称
<li>second --- 查询第二个表之后数据对应的名称
<li>third --- 查询第三个表之后数据对应的名称
<li>fourth --- 查询第四个表之后数据对应的名称
</ol>
<pre><code>{
    dataName : ['first', 'second', 'third', 'fourth']
}
</code></pre>
-  **paramsName** --- <a name="4">添加动态参数所用</a>

默认值
<ol>
<li>params --- 第一个表添加参数
<li>secondParams --- 第二个表添加参数
<li>thirdParams --- 第三个表添加参数
<li>fourthParams --- 第四个表添加参数
</ol>
<pre><code>{
    paramsName : ['params', 'secondParams', 'thirdParams', 'fourthParams']
}
//使用方法实在options里边设置对应值
{
    params : {} || function(query, params, data){}
}
</code></pre>
-  **fixedName** --- <a name="5">添加动态参数，主用于需要查库添加参数所用</a>

<pre><code>{
    pixedName : fucntion(req, query, cb) {}
}
</code></pre>
-  **procedure** --- <a name="6">查库流程</a>

默认情况下分三种情况
<pre><code>{
    //不分页的情况
    procedure : [{
	find : 'params',
	order : ['xx', 'xx'],
	run : ''
    }]
    //分页且不需要对某些值求和
    procedure : [
	[
	    {
	 	find : 'params',
		offset : 'offset',
		limit : 'limit',
		order : ['xxx', 'xxx'],
		run : ''
	    },
	    {
		count : ''
	    }
	]
    ]
    //分页且需要对某些值求和
    procedure : [
	[
	    {
	 	find : 'params',
		offset : 'offset',
		limit : 'limit',
		order : ['xxx', 'xxx'],
		run : ''
	    },
	    {
		aggregate : 'params',
		sum : ['xxx', 'xxx'],
		get : ''
	    },
	    {
		count : ''
	    }
	]
    ]
}
</code></pre>
-  **sql** --- <a name="7">支持sql查询</a>

默认值
<pre><code>{
    sql : ['firstSql', 'secondSql', 'thirdSql', 'fourthSql']
}
//不分页时 支持sql查询
{
    firstSql : function(query, params) {}
}
//分页时 支持sql查询 true 查询数据 false 查询总条数
{
    firstSql : function(query, params, true || false){}
}
</code></pre>
-  **paging** --- <a name="8">对应表是否分页</a>

<pre><code>{
    paging : [true, false]
}
</code></pre>
-  **page** --- <a name="9">分页时每页条数</a>

<pre><code>{
    page : 20
}
</code></pre>
-  **sum** --- <a name="10">需要求和字段</a>

<pre><code>{
    sum : ['xx', 'xxx']
}
</code></pre>
-  **order** --- <a name="11">排序字段</a>

<pre><code>{
    order : ['xx', 'xxx']
}
</code></pre>
-  **selectFilter** --- <a name="12">前端模块需查表完成</a>

<pre><code>{
    selectFilter : function(req, cb) {}
}
</code></pre>
-  **rows** --- <a name="13">行,用于下载</a>

<pre><code>{
    rows : [
	[
	    'xx', 'xx'
	]
    ]
}
</code></pre>
- **cols** --- <a name="14">列,用于下载</a>

<pre><code>{
    cols : [
	[
	    caption : '列名',
	    type : '类型',
	    help : '帮助信息'
	]
    ]
}
</code></pre>
-  **platform** --- <a name="15">是否显示平台</a>

默认值
<pre><code>{
    platform : true
}
</code></pre>
-  **channel** --- <a name="16">是否显示渠道</a>

默认值
<pre><code>{
    channel : false
}
</code></pre>
-  **version** --- <a name="17">是否显示版本</a>

默认值
<pre><code>{
    version : false
}
</code></pre>
-  **coupon** --- <a name="18">是否显示优惠券类型</a>

默认值
<pre><code>{
    coupon : false
}
</code></pre>
-  **excel_export** --- <a name="19">是否有导出路径</a>

默认值
<pre><code>{
    excel_export : false
}
</code></pre>
-  **flexible_btn** --- <a name="20">按钮设置</a>

<pre><code>{
    flexible_btn : [{
        content: '<a href="javascript:void(0)">导出</a>',
        preMethods: ['excel_export']
    }]
}
</code></pre>
- **date_picker** --- <a name="21">是否显示时间</a>

默认值
<pre><code>{
    date_picker : true
}
</code></pre>
-  **date_picker_data** --- <a name="22">初始时间</a>

默认值
<pre><code>{
    //可以选择多天 7 只能选择单天 1
    date_picker_data : 7
}
</code></pre>
-  **level_select** --- <a name="23">联动菜单是否显示</a>

默认值
<pre><code>{
    level_select : false
}
</code></pre>
-  **level_select_url** --- <a name="24">联动菜单地址</a>

<pre><code>{
    level_select_url : '/xxx/xxx'
}
</code></pre>
-  **level_select_name** --- <a name="25">查询字段名称</a>

<pre><code>{
    level_select_name : 'xxxx'
}
</code></pre>
-  **filter_select** --- <a name="26">单选</a>

<pre><code>{
    filter_select : [{
        title: '标题',
        filter_key : '参数名',
        groups: [{
            key: '参数值',
            value: '参数显示名称'
        }]
    }]
}
</code></pre>
-  **filter** --- <a name="27">数据过滤</a>

<pre><code>{
    filter : function(data, query, dates, type) {}
}
</code></pre>
-  **search** --- <a name="28">搜索框</a>

默认值
<pre><code>{
    search : {
        show : false
    }
}
</code></pre>
-  **control_table_col** --- <a name="29">表格字段选择框</a>

默认值
<pre><code>{
    control_table_col : false
}
</code></pre>
-  **global_platform** --- <a name="30">全局模块</a>

默认值
<pre><code>{
    golbal_platform : {
        show : false,
        key : '参数名',
        list : [{
            key : '参数值',
            name : '名称'
        }]
    }
}
</code></pre>