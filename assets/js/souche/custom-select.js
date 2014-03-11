Souche.UI.CustomSelect = function(){
  var select = function(id,_config){
    this.id = id;
    this.ele = typeof(id)!="string"?$(id):$("#"+this.id);
    this.config = {
      isAutoDrop:true,
      placeholder:"请选择品牌",
      multi:true,
      listContainer:".sc-select-list .sc-popup-bd"
    };
    $.extend(this.config,_config)
    this.selected = [];
    this._init();
    this._defaultHeadHeight = 30;
    this._enable = true;
  };
  /**
  * 自定义事件：select unselect
  */
  $.extend(select.prototype,{
    addOptions:function(html){
        $(this.config.listContainer,this.ele).append(html)
        for(var i=0;i<this.selected.length;i++){
            $(".sc-select-list .option[data-value='"+this.selected[i].key+"']").addClass("active");
          }
     },
     removeSelected:function(key){
        this._delKey(key);
        this._renderSelected();
     },
     removeAllOption:function(){
        $(this.config.listContainer,this.ele).html("");
     },
     showOptions:function(){
      if(!this._enable) return;
        $(".sc-select-list",this.ele).removeClass("hidden");
        this.ele.addClass("sc-active");
        $(this).trigger("show");
     },
     hideOptions:function(){
        $(".sc-select-list",this.ele).addClass("hidden");
        this.ele.removeClass("sc-active");
        $(this).trigger("hide");
     },
     disable:function(txt){
        $(".sc-select-content",this.ele).html("<span class='placeholder'>"+txt+"</span>");
        this._enable = false;
     },
     enable:function(txt){
        this._enable = true;
        this._renderSelected();
     }
  })
  $.extend(select.prototype,{
    _init:function(_config){
      var self = this;
      Souche.Util.mixin(this.config,_config);

      this._defaultHeadHeight = $(".sc-select-hd").height();
      $(".sc-selected-item",self.ele).each(function(i,v){
        self.selected.push({key:$(v).attr("data-value"),value:$(v).text().replace("x","")})
      })
      
      $(document.body).on("click",function(){
        self.hideOptions();
      });
      this._bindClick();
      this._bindSelect();
      if(this.config.multi){
        this._renderSelected();
      }else{
        this._renderSingleSelected();
      }

     },
     //绑定输入框的点击事件
     _bindClick:function(){
      var self = this;

      $(".sc-select-hd",this.ele).click(function(e){
        var list =$(".sc-select-list",self.ele);
        if($(".sc-select-list",self.ele).hasClass("hidden")){
          $(".sc-select-list").addClass("hidden");
          self.showOptions();
          $(".sc-select-list",self.ele).css({
            top:$(".sc-select-hd",self.ele).height()+2
          });
          if(self.config.isAutoDrop){
            self._autoDrop(list);
          }
          $(".sc-select-list",self.ele).scrollTop(0)
          $(list[0].parentNode).css({
            zIndex:Souche.Data.DropdownzIndex++
          });
        }else{
          self.hideOptions();
          list.css({
              top:30
          });
        }
        
        e.stopPropagation();
      });

      
      
     },
     //绑定选择事件
     _bindSelect:function(){
      var self = this;
      // if(!_ele){
      //   _ele = $(".sc-select-list a.option",this.ele)
      // }
      // $("input[type=checkbox]",_ele).on("click",function(e){

      //   var key = $(this.parentNode).attr("data-value");
      //   var value = $(".value",this.parentNode).html();
      //   var checkbox = $(this);
      //   if(checkbox.attr("checked")){
      //     self._addKey(key,value);
      //     // checkbox.attr("checked",false);
      //   }else{
      //     self._delKey(key);
      //     // checkbox.attr("checked","checked");
          
      //   }
      //   self._renderSelected();
      //   $(self).trigger("change",{key:key,value:value})
      //   // $(".sc-select-content",self.ele).html(value)
      //   // $(".selected_value",self.ele).val(key)
      //   e.stopPropagation();
      // })
      $(".sc-select-list",self.ele).on("click","a.option",function(e){
        e.preventDefault();
        var key = $(this).attr("data-value");
        var value = $(".value",this).html();
        var $this = $(this);
        
        if(self.config.multi){
          if($this.hasClass("active")){
            self._delKey(key);
            $this.removeClass("active");
            $(self).trigger("unselect",{key:key,value:value})
          }else{
            self._addKey(key,value);
            $this.addClass("active");
            $(self).trigger("select",{key:key,value:value})
            
          }
          self._renderSelected();
        }else{
          self.selected = [{key:key,value:value}];
          self._renderSingleSelected();
        }
        $(self).trigger("change",{key:key,value:value})
        // $(".sc-select-content",self.ele).html(value)
        // $(".selected_value",self.ele).val(key)
        e.stopPropagation();
      })
      $(".sc-select-list",self.ele).on("click",function(e){
        e.stopPropagation();
      });
      $(".close",self.ele).on("click",function(e){
        self.hideOptions();
      })
      $(".sc-select-list",self.ele).on("scroll",function(e){
        e.stopPropagation();
      })

      
 
     },
     _delKey:function(key){
      var self = this;
      for(var i =0;i<self.selected.length;i++){
          var s = self.selected[i];
          if(s&&s.key==key){
            self.selected.splice(i,1)
          }
        }
     },
     _addKey:function(key,value){
      var self = this;
      var alreadySelected = false;
      for(var i =0;i<self.selected.length;i++){
        var s = self.selected[i];
        if(s&&s.key==key){
          alreadySelected = true;
        }
      }
      if(!alreadySelected){
        self.selected.push({key:key,value:value})
      }else{

      }
     },
     //渲染选择框里的item
     _renderSelected:function(){
      var self = this;
      var s = []
      for(var i=0;i<self.selected.length;i++){
        s.push(self.selected[i].key)
      }
      $(".selected_values",self.ele).val(s.join(","))
      $(".sc-select-content",self.ele).html("")
      for(var i=0;i<self.selected.length;i++){
        var s = self.selected[i];
        $(".sc-select-content",self.ele).append("<div class=sc-selected-item data-value='"+s.key+"'>"+s.value+"<i class=sc-close>x</i></div>")
        
      }
      $(".sc-selected-item",self.ele).on("click",function(e){
        var key = $(this).attr("data-value");
        for(var i =0;i<self.selected.length;i++){
            var s = self.selected[i];
            if(s&&s.key==key){
              self.selected.splice(i,1)
            }
          }
          $(self).trigger("unselect",{key:key})
        self._renderSelected();
        // self.hideOptions();
        $(".sc-select-list a.option[data-value='"+key+"']",self.ele).removeClass("active")
        
        e.stopPropagation();
      })
      if(self.selected.length){
        // $(".sc-select-hd",self.ele).css({
        //   height:$(".sc-select-content",self.ele).height()
        // })
      }else{
        // $(".sc-select-hd",self.ele).css({
        //   height:self._defaultHeadHeight
        // })
        $(".sc-select-content",self.ele).html("<span class='placeholder'>"+self.config.placeholder+"</span>")
      }
      
      $(".sc-select-list",self.ele).css({
        top:$(".sc-select-hd",self.ele).height()+2
      });

     },
     _renderSingleSelected:function(){
      var self = this;
      var s = []
      for(var i=0;i<self.selected.length;i++){
        s.push(self.selected[i].key)
      }
      $(".selected_values",self.ele).val(s.join(","))
      if(this.selected.length){
        $(".sc-select-content",this.ele).html(this.selected[0].value);
      }else{
        
        $(".sc-select-content",this.ele).html("<span class='placeholder'>"+this.config.placeholder+"</span>")
      }
      this.hideOptions();
     },
     _autoDrop:function(list){
      var c = this.config
      //自适应滚屏,求实现，如果select被覆盖，自动缩短其高度
      // if(list.offset().top+list.height()>$(window).scrollTop()+$(window).height()){
      //   list.css({
      //     height:c.optionHeight-list.offset().top-list.height()+23
      //   });
        
      // }else{
      //   list.css({
      //     top:25
      //   });
      // }
     }
  })
  
  return select;
}();

define(function (){
　　　　return Souche.UI.CustomSelect;
　　});
