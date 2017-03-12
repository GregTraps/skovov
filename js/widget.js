/**
 * Created by Greg on 2017/3/6.
 */
define(['jquery'],function ($) {
    function Widget() {
        this.boundingBox = null;  //插件容器
    }
    Widget.prototype = {
        on : function (type,handler) {
            if (this.handlers[type] == undefined){
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },
        fire : function (type,data) {
            if (this.handlers[type] instanceof  Array){
                var handlers = this.handlers[type];
                for (var i = 0;i < handlers.length;i++){
                    handlers[i](data);
                }
            }
            return this;
        },
        renderUI : function(){}, //接口：添加DOM节点
        bindUi : function(){},  //接口：监听事件
        syncUI : function(){},   //接口：初始化组件属性
        destructor : function(){}, //接口： 销毁前处理的函数
        render : function (container) {
            this.renderUI();
            this.handlers = {};//把handlers（自定义事件监听数组）放到这里初始化，而不是放到widget构造器里，
                                //使得窗体销毁后再次出现的窗体拥有新的自定义监听列表
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.boundingBox);
        },//方法：渲染组件
        destroy : function () {
            this.destructor();
            this.boundingBox.off();
            this.boundingBox.remove();
        } //方法：销毁组件
    };
    return {
        Widget : Widget
    }
});