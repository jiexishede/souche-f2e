var contextPath = contextPath || "";
var Souche = Souche || {};
if(window.location.href.indexOf("souche.com")!=-1){
    document.domain  = "souche.com";
}
Souche.Util = function() {
    var appearKV = {

    };
    return {
        /**
         * 混合配置
         */
        mixin: function(target, source) {
            for (var i in source) {
                target[i] = source[i];
            }
        },
        /**
         * 元素第一次出现的时候执行某方法，之后不再执行
         * @distance 可省略，元素距离窗口下沿多远的时候触发。
         */
        appear: function(id, bindFunc, distance, multi) {
            appearKV[id] = appearKV[id] || [];
            appearKV[id].push(bindFunc);
            if (!distance) {
                distance = 0;
            }
            appearKV[id].distance = distance;
            appearKV[id].multi = multi;
        },
        init: function() {

            var check = function() {
                var viewportWidth = $(window).width();
                var viewportHeight = $(window).height();
                var windowScrollTop = $(window).scrollTop();
                for (var i in appearKV) {
                    if($(i).length){
                        var offset = $(i).offset();
                        var height = $(i).height();
                        if (offset.top - windowScrollTop > 0 && offset.top - windowScrollTop < (viewportHeight - appearKV[i].distance)) {
                            for (var b = 0; b < appearKV[i].length; b++) {
                                appearKV[i][b]();
                            }
                            if (!appearKV[i].multi) {
                                appearKV[i] = [];
                            }

                        }
                    }

                }
            };
            $(document).ready(function() {
                setTimeout(function() {
                    check();
                }, 200);
            })
            $(window).scroll(check);

        },
        /**
         * [actionList 串行动作]
         * @param  {[array]} data [{0,function},{100,function}]
         * @return {[type]}      [description]
         */
        actionList: function(data) {

        }
    };
}();

Souche.Util.init();
Souche.Data = {
    DropdownzIndex: 1000
}
Souche.UI = Souche.UI || {};
Souche.UI.Select = function() {
    /**
	* 优化调用方式，同时优化请求数，用最少的代码和逻辑完成最多的工作！
		Souche.UI.Select.init({
			eles:['sell_brand','sell_set','sell_type'],
			type:"car-subdivision",
			defaultValues:[]
		})
	*
	* @time 2013-9-3
	* @author 芋头
	*/
    var Select = function(_config) {
        this.config = {
            eles: ['#J_buybrand', '#J_buyset', ''],
            type: "car-subdivision",
            defaultValues: []
        };
        Souche.Util.mixin(this.config, _config);
        this.init();
    };
    Select.prototype = {
        init: function() {
            var c = this.config;
            for (var i = 0; i < c.eles.length; i++) {
                c.defaultValues[i] = c.defaultValues[i] || "";
                c.eles[i] = "#" + c.eles[i];
            }
            //没有默认值，则只需要一个请求即可初始化
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevel.json",
                dataType: "json",
                data: {
                    type: c.type
                },
                success: function(data) {
                    $(c.eles[0]).append($("<option value=''>-请选择-</option>"));
                    for (var i in data.items) {
                        var item = data.items[i];
                        $(c.eles[0]).append('<option value="' + item.code + '" ' + (c.defaultValues[0] == item.code ? "selected" : "") + '>' + item.name + '</option>');
                    }
                    if (c.defaultValues[0]) {
                        $(c.eles[0]).change();
                    }
                },
                error: function() {

                },
                failure: function() {

                }
            });
            for (var i in c.eles) {

                $(c.eles[i]).attr("data-index", i).change(function() {
                    var code = this.value;
                    if (code == null) return;
                    var a = code.split("-")[0];
                    var index = $(this).attr("data-index") * 1;
                    $(Souche.UI.Select).trigger("change",{id:this.id,value:this.value,text:this.options[this.selectedIndex].innerHTML})
                    if (index >= c.eles.length - 1) return;
                    if (a == 'brand') {
                        $.ajax({
                            url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                            dataType: "json",
                            data: {
                                type: c.type,
                                code: code
                            },
                            success: function(data) {

                                $(c.eles[1]).empty();
                                $(c.eles[1]).append($("<option value=''>-请选择-</option>"));
                                for (var j = 0; j < data['keys'].length; j++) {
                                    var key = data['keys'][j];
                                    var group = $("<optgroup label='" + key + "' style='color:green;font-style: italic;background-color:#f5f5f5;'></optgroup>");
                                    $(c.eles[1]).append(group);
                                    for (var a = 0; a < data['codes'][key].length; a++) {
                                        var o = data['codes'][key][a];
                                        group.append($("<option style='background-color:#ffffff;color:#000000;font-style: normal;' value='" + o['code'] + "' " + (c.defaultValues[1] == o['code'] ? "selected" : "") + ">" + o['name'] + "</option>"));
                                    }
                                    $(c.eles[1]).append($(""));
                                }
                                if (c.defaultValues[1]) {
                                    $(c.eles[1]).change();
                                }

                            }
                        });
                    } else {
                        $.ajax({
                            url: contextPath + "/pages/dicAction/loadNextLevel.json",
                            dataType: "json",
                            data: {
                                type: c.type,
                                code: code
                            },
                            success: function(data) {
                                $(c.eles[index + 1]).empty();
                                $(c.eles[index + 1]).append($("<option value=''>-请选择-</option>"));
                                for (var i in data.items) {
                                    var item = data.items[i];
                                    $(c.eles[index + 1]).append('<option value="' + item.code + '" ' + (c.defaultValues[index + 1] == item.code ? "selected" : "") + '>' + item.name + '</option>');
                                }
                                if (c.defaultValues[2]) {
                                    $(c.eles[2]).change();
                                }
                            }
                        });
                    }
                });
            }

        }
    };
    return {
        init: function(config) {
            return new Select(config);
        }
    };
}();
Souche.UI.NewSelect = function() {
    /**
     * 优化调用方式，同时优化请求数，用最少的代码和逻辑完成最多的工作！
     Souche.UI.Select.init({
			eles:['sell_brand','sell_set','sell_type'],
			type:"car-subdivision",
			defaultValues:[]
		})
     *
     * @time 2013-9-3
     * @author 芋头
     */
    var Select = function(_config) {
        this.config = {
            eles: ['#J_buybrand', '#J_buyset', ''],
            type: "car-subdivision",
            defaultValues: []
        };
        Souche.Util.mixin(this.config, _config);
        this.init();
    };
    Select.prototype = {
        init: function() {
            var c = this.config;
            for (var i = 0; i < c.eles.length; i++) {
                c.defaultValues[i] = c.defaultValues[i] || "";
                c.eles[i] = "#" + c.eles[i];
            }
            if(c.type!="car-subdivision"&& c.type!="area"){
                for (var i in c.eles) {
                    $(c.eles[i]).attr("data-index", i)
                }
                $(".choose-cont").on("click",function(e){
                    var code = $(this).attr("data-code");
                    var name = $(this).html();
                    var index = $(this).closest(".open-item").attr("data-index")
                    $(this).closest(".open-item").attr({
                        "data-code":code,
                        "data-name":name
                    })
                    $(".choose-cont",$(this).closest(".open-item")).removeClass("active");
                    $(this).addClass("active");
                    if (index >= c.eles.length - 1) {
                        $(this).closest(".open-item").addClass("hidden")
                        $(".display-text",$(c.eles[0]).closest(".select")).html(function(){
                            var arr = []
                            for(var z=0;z< c.eles.length;z++){
                                arr.push($(c.eles[z]).attr("data-name"))
                            }
                            return arr.join(" ")
                        })
                    }
                    $(".choose-result",$(this).closest(".open-item")).val(code);
                });
                return;

            }
            //没有默认值，则只需要一个请求即可初始化
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevel.json",
                dataType: "json",
                data: {
                    type: c.type
                },
                success: function(data) {
                    $(".choose-box",c.eles[0]).html("")

                    if(c.type=="car-subdivision"){
                        var obj = {}
                        for (var i in data.items) {
                            var zimu = data.items[i].name.split(" ")[0]
                            var name = data.items[i].name.split(" ")[1]
                            data.items[i].name = name;
                            if(obj[zimu]){
                                obj[zimu].push(data.items[i])
                            }else{
                                obj[zimu] = [data.items[i]]
                            }

                        }
                        for(var i in obj){
                            $(".choose-box",c.eles[0]).append("<div class=cont-tit>"+i+"</div>")
                            for (var ii in obj[i]) {
                                var item = obj[i][ii];
                                var con = $('<div class="choose-cont" data-code="'+item.code+'" data-name="'+item.name+'">' + item.name + '</option>');
                                $(".choose-box",c.eles[0]).append(con);
                                con.on("click",function(e){
                                    e.stopPropagation();
                                    $(c.eles[0]).attr({
                                        "data-code":$(this).attr("data-code"),
                                        "data-name":$(this).attr("data-name")
                                    })
                                    $(c.eles[0]).trigger("change",{
                                        code:$(this).attr("data-code"),
                                        name:$(this).attr("data-name")
                                    });


                                })
                            }
                        }
                    }else{
                        for (var i in data.items) {
                            var item = data.items[i];
                            var con = $('<div class="choose-cont" data-code="'+item.code+'" data-name="'+item.name+'">' + item.name + '</option>');
                            $(".choose-box",c.eles[0]).append(con);
                            con.on("click",function(e){
                                e.stopPropagation();
                                $(c.eles[0]).attr({
                                    "data-code":$(this).attr("data-code"),
                                    "data-name":$(this).attr("data-name")
                                })
                                $(c.eles[0]).trigger("change",{
                                    code:$(this).attr("data-code"),
                                    name:$(this).attr("data-name")
                                });


                            })
                        }
                    }

                    if (c.defaultValues[0]) {
                        $(c.eles[0]).trigger("change",{
                            code:c.defaultValues[0]
                        });
                    }
                },
                error: function() {

                },
                failure: function() {

                }
            });
            for (var i in c.eles) {

                $(c.eles[i]).attr("data-index", i).change(function(e,data) {
                    var code = data.code;
                    if (code == null) return;
                    var a = code.split("-")[0];

                    var index = $(this).attr("data-index") * 1;
                    $(".choose-result",$(this)).val(data.code);

                    $(Souche.UI.NewSelect).trigger("change",{id:this.id,code:data.code,name:data.name})
                    if (index >= c.eles.length - 1) {
                        $(c.eles[0]).closest(".select-open").addClass("hidden")
                        $(".display-text",$(c.eles[0]).closest(".select-item")).html(function(){
                            var arr = []
                            for(var z=0;z< c.eles.length;z++){
                                arr.push($(c.eles[z]).attr("data-name"))
                            }
                            return arr.join(" ")
                        })
                        return;
                    }
                    if (a == 'brand') {
                        $.ajax({
                            url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                            dataType: "json",
                            data: {
                                type: c.type,
                                code: code
                            },
                            success: function(data) {
                                $(".choose-box",c.eles[1]).html("")
                                for (var j = 0; j < data['keys'].length; j++) {
                                    var key = data['keys'][j];
                                    $(".choose-box",c.eles[1]).append("<div class=cont-tit>"+key+"</div>")
                                    for (var a = 0; a < data['codes'][key].length; a++) {
                                        var item = data['codes'][key][a]
                                        var con = $('<div class="choose-cont" data-code="' + item.code + '" data-name="' + item.name + '">' + item.name + '</option>');
                                        $(".choose-box", c.eles[1]).append(con);
                                        con.on("click", function (e) {
                                            e.stopPropagation();
                                            $(c.eles[1]).attr({
                                                "data-code":$(this).attr("data-code"),
                                                "data-name":$(this).attr("data-name")
                                            })
                                            $(c.eles[1]).trigger("change",{
                                                code: $(this).attr("data-code"),
                                                name: $(this).attr("data-name")
                                            });

                                        })
                                    }
                                }

                                if (c.defaultValues[1]) {
                                    $(c.eles[1]).trigger("change",{
                                        code:c.defaultValues[1]
                                    });
                                }

                            }
                        });
                    } else {
                        $.ajax({
                            url: contextPath + "/pages/dicAction/loadNextLevel.json",
                            dataType: "json",
                            data: {
                                type: c.type,
                                code: code
                            },
                            success: function(data) {
                                $(".choose-box",c.eles[index+1]).html("")
                                for (var i in data.items) {
                                    var item = data.items[i];
                                    var con = $('<div class="choose-cont" data-code="'+item.code+'" data-name="'+item.name+'">' + item.name + '</option>');
                                    $(".choose-box",c.eles[index+1]).append(con);
                                    con.on("click",function(e){
                                        e.stopPropagation();
                                        $(c.eles[index+1]).attr({
                                            "data-code":$(this).attr("data-code"),
                                            "data-name":$(this).attr("data-name")
                                        })
                                        $(c.eles[index+1]).trigger("change",{
                                            code:$(this).attr("data-code"),
                                            name:$(this).attr("data-name")
                                        });

                                    })
                                }
                                if (c.defaultValues[index+1]) {
                                    $(c.eles[index+1]).trigger("change",{
                                        code:c.defaultValues[index+1]
                                    });
                                }

                            }
                        });
                    }
                });
            }

        }
    };
    return {
        init: function(config) {
            return new Select(config);
        }
    };
}();
Souche.Form = Souche.Form || {};
Souche.Form = function() {
    if (jQuery.validator) {
        jQuery.validator.addMethod("exactlength", function(value, element, param) {
            return this.optional(element) || value.length == param;
        }, jQuery.format("请输入 {0} 字符."));
        jQuery.validator.addMethod("vin", function(value, element) {
            return this.optional(element) || /^[A-Z0-9]{8}[0-9X][A-Z0-9]{2}[A-Z0-9]{6}$/.test(value.toUpperCase());
        }, jQuery.format("vin编码格式错误."));
    }

    var form = function(config) {
        this.config = {
            ele: "loginform",
            isAsync: false, //提交方式，默认同步提交，直接提交form，如果设为true，则异步提交
            beforeSubmit: function() {
                return true;
            },
            validateFail: function(message, element) {

            },
            success: function(data) {

            },
            error: function() {

            }
        };
        Souche.Util.mixin(this.config, config);
    };
    form.prototype = {
        submit: function(_config) {
            var c = this.config;

            $("#" + c.ele).validate({
                messages: c.messages || {},
                submitHandler: function(form) {
                    if (c.beforeSubmit()) {
                        if (c.isAsync) {
                            $("*[type='submit']").attr("disabled", true);
                            $.ajax({
                                url: $(form).attr("action") || "",
                                type: $(form).attr("method") || "get",
                                dataType: "json",
                                data: $(form).serialize(),
                                success: function(data) {
                                    $("*[type='submit']").attr("disabled", false);
                                    if (data.errorMessage) {
                                        c.error(data.errorMessage);
                                    } else {
                                        c.success(data);
                                    }

                                },
                                error: function() {
                                    $("*[type='submit']").attr("disabled", false);
                                    c.error();
                                }
                            });
                        } else {
                            form.submit();
                        }

                    }
                },
                errorPlacement: function(message, element) {
                    c.validateFail(message.html(), element);
                }
            });
        }
    };
    return {
        submit: function(_config) {
            new form(_config).submit();
        }
    };
}();


Souche.MiniLogin = Souche.MiniLogin || {};
Souche.MiniLogin = function () {

    var secret_login_url = contextPath + "/pages/phonelogin.html";
    var static_login_url = contextPath+"/pages/minilogin.html";
    var minilogin = null;
    var minilayer = null;
    var is_secret = false;
    var has_third=true;
    var useCheck = true;
    var hide_weixin = false;
    var callback = function() {

    };
    return  {
        callback: function() {
            this.close();
            callback();
        },
        resizeTo:function(w,h){
//            minilogin.animate({
//                width: w,
//                height: h,
//                left: $(window).width() / 2 - w/2
//            })
        },
        close: function() {
            $(".result_p .warning ").addClass("hidden");
            if (minilogin) {
                minilogin.css({
                    display: "none"
                });
            }
            if (minilayer) {
                minilayer && minilayer.css({
                    display: "none"
                });
            }


        },
        _show: function() {
            var self = this;
            if (minilogin) {
                minilogin.attr("src", static_login_url);
                minilogin.css({
                    display: "block",
                    width:  (has_third?750:400),
                    height: (has_third?400:300),
                    left: $(window).width() / 2 - (has_third?750:400)/2
                });
                minilayer.css({
                    display: "block"
                });
                if(is_secret){
                    minilogin.attr("src", secret_login_url+"?has_third="+(has_third?1:0)+"&hide_weixin="+(hide_weixin?1:0));
                }else{
                    minilogin.attr("src", static_login_url+"?has_third="+(has_third?1:0)+"&hide_weixin="+(hide_weixin?1:0));
                }
            } else {
                minilogin = $("<iframe id='minilogin' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
               if(is_secret){
                   minilogin.attr("src", secret_login_url+"?has_third="+(has_third?1:0)+"&hide_weixin="+(hide_weixin?1:0));
               }else{
                   minilogin.attr("src", static_login_url+"?has_third="+(has_third?1:0)+"&hide_weixin="+(hide_weixin?1:0));
               }

                minilogin.css({
                    display: "block",
                    width:  (has_third?750:400),
                    height: (has_third?400:300),
                    position: "fixed",
                    top: 100,
                    left: $(window).width() / 2 - (has_third?750:400)/2,
                    zIndex: 100000001,
                    background:"#fff"
                });

                minilayer = $("<div id='minilayer'></div>");
                minilayer.css({
                    display: "block",
                    width: $(document.body).width(),
                    left: 0,
                    top: 0,
                    height: $(document.body).height(),
                    position: "absolute",
                    background: "#111",
                    zIndex: 100000000
                }).css("opacity", 0.7);
                $(document.body).append(minilayer);
                $(document.body).append(minilogin);

                minilayer.on("click",function(){
                    self.close();

                })
            }
        },
        /**
         *
         * @param _callback 登录后回调的函数
         * @param _is_secret 是要加验证码的登录？
         * @param no_third 不要第三方登录？
         * @param no_useCheck 不检查是否登录直接弹出登录？
         * @param hide_weixin 隐藏掉微信登陆？
         */
        checkLogin: function(_callback,_is_secret,no_third,no_useCheck,_hide_weixin) {
            callback = _callback;
            var self = this;
            is_secret = !!_is_secret;
            has_third = !no_third;
            useCheck = !no_useCheck;
            hide_weixin = !!_hide_weixin;
            if(useCheck){
                if(is_secret&&has_third){
                    Souche.checkVerifyAndThirdLogin(function(isLogin) {
                        if (isLogin) {
                            self.callback && self.callback();
                        } else {
                            self._show();
                        }
                    })
                }else if(!is_secret){
                    if(has_third){
                        Souche.checkAllLogin(function(isLogin) {
                            if (isLogin) {
                                self.callback && self.callback();
                            } else {
                                self._show();
                            }
                        })
                    }else{
                        Souche.checkPhoneExist(function(isLogin) {
                            if (isLogin) {
                                self.callback && self.callback();
                            } else {
                                self._show();
                            }
                        })
                    }
                }else{
                    $.ajax({
                        url: contextPath + "/pages/evaluateAction/isPhoneVerifyLogin.json",
                        type: "post",
                        dataType: "json",
                        success: function(data) {
                            if (data.result == "true") {
                                self.callback && self.callback();
                            } else {
                                self._show();
                            }
                        },
                        error: function() {
                            self._show();
                        }
                    });
                }
            }else{
                self._show();
            }

        }
    };
}();


/*
 1.pages/evaluateAction/isLogin.json    收藏，对比，订阅
 --( 包含了全部的登录方式)

 2.pages/evaluateAction/isPhoneLogin.json  预约看车，降价通知
 --(包含填写手机号码和，手机号码+验证 两种登录方式)

 3.pages/evaluateAction/isPhoneVerifyLogin.json   后续订单业务相关所有操作
 --(仅包含手机号码+验证码一种登录)
 4./pages/evaluateAction/isVerifyAndThirdLogin.json 验证码和第三方登录的验证
 */
Souche.checkVerifyAndThirdLogin = function(callback){
    $.ajax({
        url: contextPath + "/pages/evaluateAction/isVerifyAndThirdLogin.json",
        type: "post",
        dataType: "json",
        success: function(data) {
            if (data.result == "true") {
                callback(true)
            } else {
                callback(false)
            }
        },
        error: function() {
            callback(false)
        }
    })
}
Souche.checkAllLogin = function(callback){
    $.ajax({
        url: contextPath + "/pages/evaluateAction/isLogin.json",
        type: "post",
        dataType: "json",
        success: function(data) {
            if (data.result == "true") {
                callback(true)
            } else {
                callback(false)
            }
        },
        error: function() {
            callback(false)
        }
    })
}
//检查是否填过手机号
Souche.checkPhoneExist = function(callback) {
    $.ajax({
        url: contextPath + "/pages/evaluateAction/isPhoneLogin.json",
        type: "post",
        dataType: "json",
        success: function(data) {
            if (data.result == "true") {
                callback(true)
            } else {
                callback(false)
            }
        },
        error: function() {
            callback(false)
        }
    })
};
//一步注册手机号
Souche.PhoneRegister = function(phone, callback) {
    $.ajax({
        url: contextPath + "/pages/evaluateAction/noRegisterLogin.json",
        type: "post",
        dataType: "json",
        data: {
            phone: phone
        },
        success: function(data) {
            if (data.errorMessage) {
                callback(false)
            } else {
                callback(true)
            }
        },
        error: function() {
            callback(false)
        }
    })
};

Souche.AjaxManager = (function() {
    var manager = {};
    var instance = {};

    var success = function() {
        var def = arguments[2];
        delete this.context.ajaxList[this.identify][this.option.url];
    }

    var addDelayAborted = function(option, callback) {
        var identify = this.predicate.call(option);
        option.context = {
            context: this,
            identify: identify,
            option: option
        };

        if (this.ajaxList[identify]) {

            var lastTime = this.ajaxList[identify].lastTime;
            var currentTime = +new Date();
            if ((currentTime - lastTime) > this.delayTime) {
                window.clearTimeout(this.ajaxList[identify].handle);
                this.ajaxList[identify].lastTime = +new Date();
                if (this.ajaxList[identify][option.url] && this.aborted) {
                    this.ajaxList[identify][option.url].abort();
                }
                var deferred = $.ajax(option);
                this.ajaxList[identify][option.url] = deferred;
                deferred.done(success).then(callback);
            } else {
                window.clearTimeout(this.ajaxList.handle);
                var self = this;
                this.ajaxList.handle = window.setTimeout(function() {
                    self.ajaxList[identify].lastTime = +new Date();
                    if (self.ajaxList[identify][option.url] && self.aborted) {
                        self.ajaxList[identify][option.url].abort();
                    }
                    var deferred = $.ajax(option);
                    self.ajaxList[identify][option.url] = deferred;
                    deferred.done(success).then(callback);
                }, this.delayTime);
            }

        } else {
            this.ajaxList.handle = undefined;
            this.ajaxList[identify] = this.ajaxList[identify] || {};
            this.ajaxList[identify].lastTime = +new Date();
            var deferred = $.ajax(option);
            this.ajaxList[identify][option.url] = deferred;
            deferred.done(success).then(callback);
        }
    }

    var add = function(option, callback) {
        if (!option.url) {
            throw new Error("url underfind");
        }
        //var in
        addDelayAborted.apply(this, arguments);
    }

    var initManager = function(option) {
            option = option || {};
            this.aborted = option.aborted || false;
            this.delayTime = option.delayTime || 0;
            this.predicate = option.predicate || function() {
                return this.url;
            };
            this.ajaxList = {};
        }
        //manager.addAjax = add;

    manager.init = function(option) {
        initManager.prototype.addAjax = add;
        var result = new initManager(option);
        return result;
    }

    return manager;
}());

(function() {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function(key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
})();