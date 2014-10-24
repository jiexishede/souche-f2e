define(['souche/add-series','souche/custom-select','souche/util/load-info'],function(AddSeries,CustomSelect,LoadInfo){
    return {
        init:function(_config){
            AddSeries.init(_config);
            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            });

            ageSelectHigh = new CustomSelect("age_select_high", {
                placeholder: "请选择",
                multi: false
            });

            new CustomSelect("price_select_high", {
                placeholder: "请选择",
                multi: false
            });
            new CustomSelect("brand_option", {
                placeholder: "请选择",
                multi: false
            });
            priceSelect = new CustomSelect("price_select", {
                placeholder: "请选择",
                multi: false
            });

            var provinceSelect = new CustomSelect("privince",{
                placeholder: "请选择省",
                multi: false
            })
            var citySelect = new CustomSelect("city",{
                placeholder: "请选择市",
                multi: false
            })

            LoadInfo.loadProvince(function(data){
                provinceSelect.removeAllOption()
                for(var i=0;i<data.items.length;i++){
                    provinceSelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
                }
            })
            $(provinceSelect).on("change",function(e,_d){
                LoadInfo.loadCity(_d.key,function(data){
                    citySelect.removeAllOption()
                    for(var i=0;i<data.items.length;i++){
                        citySelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
                    }
                })
            })
//            $(citySelect).on("change",function(e,_d){
//                LoadInfo.loadCity(_d.key,function(data){
//                    areaSelect.removeAllOption()
//                    for(var i=0;i<data.items.length;i++){
//                        areaSelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
//                    }
//                })
//            })
            $(".addCarinstrestItem").click(function(){
                AddSeries.show();
                $(".addInstrestCar").css({
                    left:($(window).width()-$(".addInstrestCar").width())/2,
                    top:100
                })
            })
            $(AddSeries).on("change",function(e,_data){
                var series = [];
                for(var i=0;i<_data.selectedSeries.length;i++) {
                    var series = _data.selectedSeries[i].split(",");
                    var _code = series[0];
                    series.push(_code);
                }
                $("#car_series").val(series.join(","))

            })

            $("#form-submit").on("click",function(e){
                e.preventDefault();
                if(!$("#you-name").val()){
                    alert("请填写姓名");
                    return;
                }
                if(!$("#you-phone").val()){
                    alert("请填写手机");
                    return;
                }
                if(!$("#car_series").val()){
                    alert("请选择车系")
                    return;
                }
                if(!$("#car_series").val()){
                    alert("请选择车系")
                    return;
                }
                if(!($("#price_select_val").val()||$("#price_select_high_val").val())){
                    alert("请选择预算区间")
                    return;
                }
                if(!($("#price_select_val").val()||$("#price_select_high_val").val())){
                    alert("请选择预算区间")
                    return;
                }
            })
        }
    }
});