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
-  **router** --- 路由

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
-  **modelName** --- 数据表名

同一路由可以查询多个表
<pre><code>{
    modelName : ['xxx', 'xxx']
}
</code></pre>
-  **dataName** --- 查询数据后对应的数据名称

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
-  **paramsName** --- 添加动态参数所用

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
-  **fixedName** --- 添加动态参数，主用于需要查库添加参数所用

<pre><code>{
    pixedName : fucntion(req, query, cb) {}
}
</code></pre>
-  **procedure** --- 查库流程

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
-  **sql** --- 支持sql查询

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
-  **paging** 对应表是否分页

<pre><code>{
    paging : [true, false]
}
</code></pre>
-  **page** --- 分页时每页条数

<pre><code>{
    page : 20
}
</code></pre>
-  **sum** --- 需要求和字段

<pre><code>{
    sum : ['xx', 'xxx']
}
</code></pre>
-  **order** --- 排序字段

<pre><code>{
    order : ['xx', 'xxx']
}
</code></pre>
-  **selectFilter** --- 前端模块需查表完成

<pre><code>{
    selectFilter : function(req, cb) {}
}
</code></pre>
-  **rows** --- 行,用于下载

<pre><code>{
    rows : [
	[
	    'xx', 'xx'
	]
    ]
}
</code></pre>
- **cols** --- 列,用于下载

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
-  **platform** --- 是否显示平台

默认值
<pre><code>{
    platform : true
}
</code></pre>
-  **channel** --- 是否显示渠道

默认值
<pre><code>{
    channel : false
}
</code></pre>
-  **version** --- 是否显示版本

默认值
<pre><code>{
    version : false
}
</code></pre>
-  **coupon** --- 是否显示优惠券类型

默认值
<pre><code>{
    coupon : false
}
</code></pre>
-  **excel_export** --- 是否有导出路径

默认值
<pre><code>{
    excel_export : false
}
</code></pre>
-  **flexible_btn** --- 按钮设置

<pre><code>{
    flexible_btn : [{
        content: '<a href="javascript:void(0)">导出</a>',
        preMethods: ['excel_export']
    }]
}
</code></pre>
- **date_picker** --- 是否显示时间

默认值
<pre><code>{
    date_picker : true
}
</code></pre>
-  **date_picker_data** --- 初始时间

默认值
<pre><code>{
    //可以选择多天 7 只能选择单天 1
    date_picker_data : 7
}
</code></pre>
-  **level_select** --- 联动菜单是否显示

默认值
<pre><code>{
    level_select : false
}
</code></pre>
-  **level_select_url** --- 联动菜单地址

<pre><code>{
    level_select_url : '/xxx/xxx'
}
</code></pre>
-  **level_select_name** --- 查询字段名称

<pre><code>{
    level_select_name : 'xxxx'
}
</code></pre>
-  **filter_select** --- 单选

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
-  **filter** --- 数据过滤

<pre><code>{
    filter : function(data, query, dates, type) {}
}
</code></pre>
-  **search** --- 搜索框

默认值
<pre><code>{
    search : {
	show : false
    }
}
</code></pre>
-  **control_table_col** --- 表格字段选择框

默认值
<pre><code>{
    show : false
}
</code></pre>
-  **global_platfomr** --- 全局模块

默认值
<pre><code>{
    show : false,
    key : '参数名',
    list : [{
	key : '参数值',
	name : '名称'
    }]
}
</code></pre>