Souche.UI.CustomMultiSelect=function(){var e=function(e){this.id=e,this.ele=$("string"!=typeof e?e:"#"+this.id),this.config={isAutoDrop:!0,maxDisplayItems:10,placeholder:"请选择品牌"},this.selected=[],this._init(),this._defaultHeadHeight=30};return $.extend(e.prototype,{addOption:function(e,t){var s=$("<li><a href='#' data-value='"+e+"'><input type='checkbox'/><span class='value'>"+t+"</span></a></li>");$(".sc-select-list",this.ele).append(s),this._bindSelect($("a",s))},removeOption:function(e){$(".sc-select-list li a",this.ele).each(function(t,s){$(s).attr("data-value")==e&&s.parentNode.parentNode.removeChild(s.parentNode)})},removeAllOption:function(){$(".sc-select-list",this.ele).html("")},showOptions:function(){$(".sc-select-list",this.ele).removeClass("hidden")},hideOptions:function(){$(".sc-select-list",this.ele).addClass("hidden")}}),$.extend(e.prototype,{_init:function(e){var t=this;Souche.Util.mixin(this.config,e),this._defaultHeadHeight=$(".sc-select-hd").height(),$(".sc-select-list").css({height:30*this.config.maxDisplayItems}),$(".sc-select-list li",this.ele).length>10&&$(".sc-select-list",this.ele).css("height",300),$(document.body).on("click",function(){t.hideOptions()}),this._bindClick(),this._bindSelect(),this._renderSelected()},_bindClick:function(){var e=this;$(".sc-select-hd",this.ele).click(function(t){var s=$(".sc-select-list",e.ele);$(".sc-select-list",e.ele).hasClass("hidden")?($(".sc-select-list").addClass("hidden"),$(".sc-select-list",e.ele).removeClass("hidden").css({top:$(".sc-select-hd",e.ele).height()}),e.config.isAutoDrop&&e._autoDrop(s),$(".sc-select-list",e.ele).scrollTop(0),$(s[0].parentNode).css({zIndex:Souche.Data.DropdownzIndex++})):($(".sc-select-list").addClass("hidden"),s.css({top:25})),t.stopPropagation()})},_bindSelect:function(e){var t=this;e||(e=$(".sc-select-list li a",this.ele)),$("input[type=checkbox]",e).on("click",function(e){var s=$(this.parentNode).attr("data-value"),c=$(".value",this.parentNode).html(),l=$(this);l.attr("checked")?t._addKey(s,c):t._delKey(s),t._renderSelected(),$(t).trigger("change",{key:s,value:c}),e.stopPropagation()}),e.on("click",function(e){e.preventDefault();var s=$(this).attr("data-value"),c=$(".value",this).html(),l=$("input[type=checkbox]",this);l.attr("checked")?(t._delKey(s),l.attr("checked",!1)):(t._addKey(s,c),l.attr("checked","checked")),t._renderSelected(),$(t).trigger("change",{key:s,value:c}),e.stopPropagation()})},_delKey:function(e){for(var t=this,s=0;s<t.selected.length;s++){var c=t.selected[s];c&&c.key==e&&t.selected.splice(s,1)}},_addKey:function(e,t){for(var s=this,c=!1,l=0;l<s.selected.length;l++){var i=s.selected[l];i&&i.key==e&&(c=!0)}c||s.selected.push({key:e,value:t})},_renderSelected:function(){var e=this;$(".selected_values",e.ele).val(e.selected.join(",")),$(".sc-select-content",e.ele).html("");for(var t=0;t<e.selected.length;t++){var s=e.selected[t];$(".sc-select-content",e.ele).append("<div class=sc-selected-item data-value='"+s.key+"'>"+s.value+"<i class=sc-close>x</i></div>")}$(".sc-selected-item",e.ele).on("click",function(t){for(var s=$(this).attr("data-value"),c=0;c<e.selected.length;c++){var l=e.selected[c];l&&l.key==s&&e.selected.splice(c,1)}e._renderSelected(),$(".sc-select-list li a[data-value='"+s+"'] input[type='checkbox']",e.ele).attr("checked",!1),t.stopPropagation()}),e.selected.length?$(".sc-select-hd",e.ele).css({height:$(".sc-select-content",e.ele).height()}):($(".sc-select-hd",e.ele).css({height:e._defaultHeadHeight}),$(".sc-select-content",e.ele).html("<span class='placeholder'>"+e.config.placeholder+"</span>")),$(".sc-select-list",e.ele).css({top:$(".sc-select-hd",e.ele).height()})},_autoDrop:function(){this.config}}),e}(),define(function(){return Souche.UI.CustomMultiSelect});