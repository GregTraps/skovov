/**
 * Created by Greg on 2017/3/10.
 */
define(['jquery','widget'],function ($, widget) {
    //HTML结构div.container>(div.picroll_window>div.picroll_box)+div.picroll_nav
    function Picroll() {
        this.cfg = {
            width : 300,
            height : 200,
            skinClassName : null,
            boxNumber : 5,
            repeat : true,
            interval : 2000,
            speed : 1000
        }
    }
    Picroll.prototype = $.extend({},new widget.Widget(),{
        renderUI : function (container) {
            this.boundingBox = container;
            container.children("div:first").addClass("picroll_window");
            container.find(".picroll_window > div").addClass("picroll_box");
            this.cfg.boxNumber = container.find(".picroll_box").length;
            // container.find(".picroll_box:first").clone().appendTo(container.find(".picroll_window")).css("margin-right","-"+this.cfg.width+"px");
            var navLi = "";
            for (var j = 0 ;j<this.cfg.boxNumber;j++){
                navLi += '<li></li>'
            }
            container.append($('<div class="picroll_nav">' + '<ul>'+navLi+'</ul>' + '</div>'));
        },
        bindUI : function () {
            var that = this;
            this.on("picroll",function (data) {
                var index = $(data).index();
                var window = that.boundingBox.find(".picroll_window");
                var moveLength = that.boundingBox.width();
                xpos = -index * moveLength;
                window.stop(true, false).animate({left: xpos + "px"}, that.cfg.speed, "swing");
            });
            this.boundingBox.find(".picroll_nav ul").delegate("li","mouseenter",function () {
                that.fire("picroll",this);
                $(this).addClass("picroll_nav_hover").siblings().removeClass("picroll_nav_hover");
                that.boxIndex = $(this).index();
            });

            this.boxIndex = 0;
            function autoTrigger() {
                that.boundingBox.find(".picroll_nav li:nth-child("+(that.boxIndex+1)+")").trigger("mouseenter");
                that.boxIndex++;
                if (that.boxIndex == that.cfg.boxNumber){
                    if (that.cfg.repeat){
                        that.boxIndex = 0;
                    }else {
                        clearInterval(that.rollTrigger);
                    }
                }
                that.rollTrigger = setTimeout(autoTrigger,that.cfg.interval+that.cfg.speed);
            }
            autoTrigger();
            this.boundingBox.mouseover(function () {
                clearInterval(that.rollTrigger);
            }).mouseleave(function () {
                if (that.cfg.repeat){
                    that.rollTrigger = setTimeout(autoTrigger,that.cfg.interval);
                }
            });
            var container = this.boundingBox;
            $(window).resize(function () {
                clearInterval(that.rollTrigger);
                var nowWid = container.width();
                container.find(".picroll_window").stop(true,true).css({
                    "width" : nowWid * that.cfg.boxNumber
                });
                container.find(".picroll_box").css({
                    "width" : nowWid
                });
                that.rollTrigger = setTimeout(autoTrigger,500);
            })
        },
        syncUI : function () {
            var container = this.boundingBox;
            container.css({
                "overflow" : "hidden",
                "position" : "relative"
            });
            container.find(".picroll_window").css({
                "width" : container.width() * this.cfg.boxNumber,
                "height" : container.height()
            });
            container.find(".picroll_box").css({
                "width" : container.width(),
                "height" : "100%"
            });
            container.find(".picroll_nav").css("margin-left",(-this.cfg.boxNumber*10)+"px");
            if (this.cfg.skinClassName){
                container.addClass(this.cfg.skinClassName);
            }
        },
        destructor : function () {
            this.boundingBox.off();
        },
        render : function (container) {

        },
        createRoll : function (container, cfg) {
            $.extend(this.cfg,cfg);
            this.renderUI(container);
            this.syncUI();
            this.handlers = {};
            this.bindUI();
        }
    });
    return {
        Picroll : Picroll
    }
});