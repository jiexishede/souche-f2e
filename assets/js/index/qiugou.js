define(['index/mod/rss-addSeries','souche/custom-select',],
function(AddSeries,CustomSelect){
    var data = {
        brands:[],
        series:[],
        startYear:null,
        endYear:null,
        minPrice:null,
        maxPrice:null
    }
    var ageSelect,ageSelectHigh;
    var priceSelect,priceSelectHigh;
    var config = {};
    return {
        init:function(_config){
            $.extend(config,_config);
            AddSeries.init(_config);
            this._initData(_config.userRequementJson);
            this._bind();
            if(_config.userRequementJson.series){
                this._renderSelected(_config.userRequementJson.series)
            }
            this._initSelect();
        },
        _initSelect:function(){
            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelect).on("change",function(e,_data){
                data.startYear = _data.value;
            })
            ageSelectHigh = new CustomSelect("age_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelectHigh).on("change",function(e,_data){
                data.endYear = _data.value;
            })

            priceSelect = new CustomSelect("price_select", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelect).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.minPrice = _data.value;
                $(".low-price").val(data.minPrice);
            })
            priceSelectHigh = new CustomSelect("price_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelectHigh).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.maxPrice = _data.value;
                $(".high-price").val(data.maxPrice);
            })
//            $(".low-price").on("keyup",function(){
//                $(this).val($(this).val().replace(/[^0-9]/, ""))
//            })
//            $(".low-price").on("keyup",function(){
//                $(this).val($(this).val().replace(/[^0-9]/, ""))
//            })
            setInterval(function() {
                $(".low-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())){

                    $(p).val($(p).val().replace(/[^0-9]/, ""))
                        }
                })
                $(".high-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())) {
                        $(p).val($(p).val().replace(/[^0-9]/, ""))
                    }
                })
            }, 200)
        },
        //根据配置的userRequementJson的生成初始数据
        _initData:function(initJson){
            if(initJson.brands&&initJson.brands.length){
                for(var i=0;i<initJson.brands.length;i++){
                    var series = initJson.brands[i].split(",");
                    var _code = series[0];
                    data.brands.push(_code);
                }
            }
            if(initJson.series&&initJson.series.length){
                for(var i=0;i<initJson.series.length;i++){
                    var series = initJson.series[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
            }
            if(initJson.startYear) {
                data.startYear = initJson.startYear;
//                ageSelect.setSelected(data.startYear);
            }
            if(initJson.endYear) data.endYear = initJson.endYear;
            if(initJson.minPrice) data.startYear = initJson.minPrice;
            if(initJson.maxPrice) data.startYear = initJson.maxPrice;

        },
        _bind:function(){
            var self = this;
            //选择感兴趣的车系
            $(".addCarinstrestItem").on("click",function(){
                AddSeries.show();
            });
            //从series读取数据
            $(AddSeries).on("change",function(e,_data){
                data.series = [];
                for(var i=0;i<_data.selectedSeries.length;i++) {
                    var series = _data.selectedSeries[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
                self._renderSelected(_data.selectedSeries);
            })
            //删除的动作，
            $(".selected_series_result").on("click",".selected-item",function(){
                AddSeries.delSeries($(this).attr("code"))
            })

            var rss_isSubmiting = false;
            //提交订阅
            $("#J_xuqiu_submit").on("click",function(){
                $(this).addClass("loading").html("提交中")
                if(rss_isSubmiting) return;
                rss_isSubmiting = true;
                data.minPrice = $(".low-price").val();
                data.maxPrice = $(".high-price").val();
                if(!(data.brands.length
                    ||data.series.length
                    ||data.endYear
                    ||data.startYear
                    ||data.minPrice
                    ||data.maxPrice)){
                    $(".trail .warning").html("请至少填写一项").removeClass("hidden")
                    return;
                }
                if(data.startYear&&data.endYear&&data.minYear>data.maxYear){
                    $(".trail .warning").html("年份选择错误").removeClass("hidden")
                }
                if(data.minPrice&&data.maxPrice&&data.minYear>data.maxYear){
                    $(".trail .warning").html("预算填写错误").removeClass("hidden")
                }
                $.ajax({
                    url:config.submit_api,
                    data:{
                        brands:data.brands.join(","),
                        series:data.series.join(","),
                        minYear:data.startYear,
                       maxYear:data.endYear,
                        minPrice:data.minPrice,
                        maxPrice:data.maxPrice
                    },
                    dataType:"json",
                    success:function(result){
                        window.location.reload()
                    },
                    error:function(){

                        rss_isSubmiting = false;
                    }
                })
            })
            //获取一个初始宽度
            if($(".dialogContentContainer").hasClass("hidden")){
                $(".dialogContentContainer").css({opacity:0}).removeClass("hidden")
                var dialogWidth = $(".dialogContentContainer").width();
                $(".dialogContentContainer").css({opacity:1}).addClass("hidden")
            }else{
                var dialogWidth = $(".dialogContentContainer").width();
            }

            //编辑订阅卡片
            $("#J_card_edit").click(function(){


                $(".dialogContentContainer").css({width:200}).removeClass("hidden").animate({
                    width:dialogWidth,
                    opacity:1
                },500)
            })
            //去掉填写的需求
            $("#J_xuqiu_cancel").click(function(){
                $(".dialogContentContainer").animate({width:200,opacity:0},500,function(){
                    $(".dialogContentContainer").addClass("hidden")
                })
            })
        },
        _renderSelected:function(selectedSeries){
            var html = "";
            for(var i=0;i<selectedSeries.length;i++) {
                var series = selectedSeries[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/series/"+_code+".png'/>"+_name+"</div>"
            }
            $(".selected_series_result").html(html);

        }
    }
});