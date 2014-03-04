define(['souche/custom-select','souche/select'], function (CustomSelect,Select){
  var brandSelect,seriesSelect,priceLowSelect,priceHighSelect,ageSelect,modelSelect;
  var brandSort = function(data){
    var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var obj = {}
    for(var i in data){
      var brand = data[i]
      var firstword = brand.name.charAt(0).toUpperCase();
      if(!obj[firstword]){
        obj[firstword] = []
      }
      brand.name = brand.name.substr(2,brand.name.length)
      obj[firstword].push(brand);
    }

    return obj;
  }
  return {
    init:function(){
      brandSelect = new CustomSelect("brand_select",{
        placeholder:"请选择品牌"
      });
      seriesSelect = new CustomSelect("series_select",{
        placeholder:"请选择车系"
      });
      priceLowSelect = new Select("price_low_select",{
        maxDisplayItems:5
      })
      priceHighSelect = new Select("price_high_select",{
        maxDisplayItems:5
      })
      ageSelect = new CustomSelect("age_select",{
        placeholder:"请选择",
        multi:false
      })
      modelSelect = new CustomSelect("model_select",{
        placeholder:"请选择",
        multi:false
      })
      this._bindBrandChange();
      //没有默认值，则只需要一个请求即可初始化
      brandSelect.removeAllOption();
      seriesSelect.removeAllOption();
      $.ajax({
        url:"/demo/yutou/index/brand.json",//contextPath+"/pages/dicAction/loadRootLevel.json",
        dataType:"json",
        data:{
          type:"car-subdivision"
        },
        success:function(data){
          var html = "";
          data = brandSort(data.items);
          for(var i in data){
            var b = data[i];
            var name = i;
            html+="<div data-name='"+name+"' class='clearfix'><div class='word-title'>"+name+"</div><div class='word-brands'>"
            for(var n =0;n<b.length;n++){
              var brand = b[n]
              html+=('<a href="#" data-value="'+brand.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+brand.name+'</span></a>');
            }
            html+="</div></div>"
            
          }
          brandSelect.addOptions(html)
        },  
        error:function(){
          alert("品牌信息请求出错，刷新后再试")
        },
        failure:function(){
          alert("品牌信息请求出错，刷新后再试")
        }
      });
    },
    _bindBrandChange:function(){
      var self = this;
      $(brandSelect).on("select",function(e,data){
        console.log(data)
        self._addSeries(data.key)
        //选中了某品牌
      }).on("unselect",function(e,data){
        console.log(data)
        self._removeSeries(data.key)
        //取消选中某品牌，删除其所拥有的车系列表
      })
    },
    _addSeries:function(brandCode){
      if($("#series_select .sc-select-list div[data-brandid="+brandCode+"]").length){
        return;
      }
      $.ajax({
        url:"/demo/yutou/index/series.json",//contextPath+"/pages/dicAction/loadRootLevelForCar.json",
        dataType:"json",
        data:{
          type:"car-subdivision",
          code:brandCode
        },
        success:function(data){
          var html = "";

          for(var i in data.codes){
            var b = data.codes[i];
            var name = i;
            html+="<div data-name='"+name+"' data-brandid='"+brandCode+"' class='clearfix'><div class='brand-title'>"+name+"</div>"
            for(var n =0;n<b.length;n++){
              var series = b[n]
              html+=('<a href="#" data-value="'+series.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+series.name+'</span></a>');
            }
            html+="</div>"
            
          }
          seriesSelect.addOptions(html)
        },  
        error:function(){
          alert("车系信息请求出错，刷新后再试")
        },
        failure:function(){
          alert("车系信息请求出错，刷新后再试")
        }
      });
    },
    _removeSeries:function(brandCode){
      console.log($("#series_select .sc-select-list div[data-brandid="+brandCode+"]"))
      $("#series_select .sc-select-list div[data-brandid="+brandCode+"]").remove();
    }
  };
});