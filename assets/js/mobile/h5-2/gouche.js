function createBrandsManager(_container){
  var container = _container;

  var removeSeries=function(bObj,sCode){
      if(!(sCode in bObj))return;
      var sObj = bObj[sCode];
      sObj[0].remove();
      sObj[1].removeClass('selected')
      delete bObj[sCode];
  }
  var addSeries=function(bObj,sCode,jqObjArr){
      bObj[sCode]=jqObjArr;
      container.append(jqObjArr[0]);
      jqObjArr[1].addClass('selected');
  }
  

  var brandsManager = {
    brands:{},//{bCode:{sCode:$}}
    //sCode='' for 不限
    toggleSeries:function(bCode,sCode,jqObjArr){
      var brands = this.brands;
      var bObj = brands[bCode] = brands[bCode] || {};
      
      if(bObj[sCode]){
        removeSeries(bObj,sCode);
        if($.isEmptyObject(brands)){
          container.hide();
        }
      }
      else{
        if($.isEmptyObject(brands)){
          container.show();
        }
        if(sCode==''){
          for(var i in bObj){
            removeSeries(bObj,i);
          }
        }else{
          removeSeries(bObj,'');
        }
        addSeries(bObj,sCode,jqObjArr);

      }
    },

    removeByBrands:function(bCode){
      var sObj = brands[bCode];
      for(var i in sObj){
        sObj[i].remove();
      }
      brands[bCode]=undefined;
    }
  }
  return brandsManager;
}

var brandsManager = createBrandsManager($('.selected-brand'));

var curPageIndex=1;
var pageStack=[];
pageStack.push(0);
var pages = [$('#page-1'),$('#page-2'),
      $('#page-3')];
function gotoPage(pageIndex){
  pageStack.push(curPageIndex);
  pageIndex = pageIndex || (curPageIndex+1);
  document.body.scrollTop=0;
  var $curPage = pages[curPageIndex-1];
  var $page = pages[pageIndex-1];
  $page.css({left:'100%'}).show();
  $curPage.animate({left:'-100%'},function(){
    $curPage.hide();
  });
  $page.animate({left:'0'});
  curPageIndex=pageIndex;
}

function backPage(){
  document.body.scrollTop=0
  var pageIndex = pageStack.pop();
  if(pageIndex ==0){
    history.back();
    return;
  }
  var $curPage = pages[curPageIndex-1];
  var $page = pages[pageIndex-1];
  $page.css({left:'-100%'}).show();
  $curPage.animate({left:'100%'},function(){
    $curPage.hide();
  });
  $page.animate({left:'0'});
  curPageIndex=pageIndex;
}

$('#page-1 .next-btn').click(function(){
  gotoPage();
})

$('#page-2 .next-btn').click(function(){
  gotoPage();
})


$('.back-icon').click(function(){
  backPage();
})
$(".selected-brand").on('click','.close-icon',function(){
  var $sbItem
      ,$selectedBrand;
  var $parent = $(this).parent();
  while( $parent){
    if($parent.hasClass('sb-item')){
      $sbItem = $parent;
      break;
    }
    $parent = $parent.parent();
  }
  var bCode = $sbItem.attr('brand-code')
      ,sCode = $sbItem.attr('series-code');
  brandsManager.toggleSeries(bCode,sCode);
  //$sbItem.remove();
})



var $curBrandArray;
var $curFold;
var curBrandCode;
$('.icon-item').click(function(){
  var $self = $(this);

  var loaclBrandCode=$self.attr('data-code');
  if(curBrandCode===loaclBrandCode){
    return;
  }
  if($curFold){
    $curFold.hide();
    $curBrandArray.hide();
  }
  var dataIndex = $self.attr('data-index')
  curBrandCode = $self.attr('data-code');
  $curFold = $self.siblings('.fold-series[data-index='+dataIndex+']');
  $curBrandArray = $self.find('.brand-array');
  $curFold.slideDown(500,function(){
    $curBrandArray.show();
  });
})

var _dataObj={
  brands:[],
  series:[],
}



$('.series-item').click(function(){
  var dIndex =$(this).attr('data-index');
  var sCode = $(this).attr('data-code');
  var textDiv = $(this).find('.text');
  var text = textDiv.text();
  var html = '<div class="sb-item" brand-code='+curBrandCode+' series-code='+sCode+'>'
            + '<span class="text">'+text+'</span>'
            + '<i class="close-icon"></i>'
            +'</div>';
  //$(this).find('.text').toggleClass('selected');
  brandsManager.toggleSeries(curBrandCode,sCode,[$(html),textDiv]);
})