Souche = window.Souche || {};
Souche.Sidebar = (function() {
    var siderbarShow = false;

    $(document).ready(function() {
      
        var lessThenIE8 = function () {
            if($.browser.msie){
              if($.browser.version <= 8.0){
                return true;
              }
                return false;
                }else{
                  return false;
                }
        }();
        
        if(lessThenIE8){
           $(".sidebar").css({height:"254px"});
           $(".talkside ,#talk-list").remove();

            $(".toolbar-close").on("click",function(e) {
                e.stopPropagation();
                $("#toolbar").animate({
                    width: 52,
                    height: 254
                }, 500, function() {

                })
                $("#toolbar").removeClass("sidebar-active")
                siderbarShow = false;
            });

            $(document.body).click(function() {
                if (siderbarShow) {
                    $("#toolbar").animate({
                        width: 52,
                        height: 254
                    }, 500, function() {

                    })
                    $("#toolbar").removeClass("sidebar-active")
                    siderbarShow = false;
                }

            });
        }else{
             $(".toolbar-close").click(function() {
                $("#toolbar").animate({
                    width: 52,
                    height: 309
                }, 500, function() {

                })
                $("#toolbar").removeClass("sidebar-active")
                siderbarShow = false;
            });
            $(document.body).click(function() {
                if (siderbarShow) {
                    $("#toolbar").animate({
                        width: 52,
                        height: 309
                    }, 500, function() {

                    })
                    $("#toolbar").removeClass("sidebar-active")
                    siderbarShow = false;
                }
            });
        };

        $("#talk_with").on("click",function(e){
            var uid = $(this).attr("data-userid");

            Souche.Sidebar.showTalk(uid,window.location.href);
        })
        $(".advisor-tip-close").click(function(e) {
            e.preventDefault();
            $(".my-advisor-tip").addClass("hidden");
            $("#advisor_notice").addClass("hidden")
            $.cookie('f2e_guwen_close', '1', {
                expires: 1
            });
            e.stopPropagation();
        })


        $(".sidebar").click(function(e) {
            e.stopPropagation();
        })
        $(".sidebar .side-trigger").click(function(e) {
            e.preventDefault();
            Souche.stats&&Souche.stats.add_click($(this).attr("click_type"))
            var self = this;
            if ($(this).hasClass("suggest-box")) {
                Souche.Sidebar.showSidebar(self);
            }else if($(this).hasClass("reserve-box")) {
                Souche.MiniLogin.checkLogin(function(isLogin) {
                    Souche.Sidebar.showSidebar(self);
                },false,true)
            } else {
                Souche.MiniLogin.checkLogin(function(isLogin) {
                    Souche.Sidebar.showSidebar(self);
                })
            }


        });
        $("#my-advisor").on("mouseenter", function() {
            $("#my-advisor").addClass("active")
        }).mouseleave(function() {
            $("#my-advisor").removeClass("active")
        });

        $(".sidebar").on("mouseenter", function() {
            if (!$(".sidebar").hasClass("sidebar-active")) {
                $(".sidebar").addClass("active")
            }
        }).mouseleave(function() {
            $(".sidebar").removeClass("active")
        });
      
        $("#noreg-popup").on("click", function(e) {
            e.stopPropagation();
        })
        var Q_Buy_active = false;
        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {

                $("#toTop").show("slow");
            } else {
                $("#toTop").hide("slow");
            }
        });
        $("#toTop").click(function() {
            $("html,body").animate({
                scrollTop: 0
            });
        });
        $(document.body).on("mousemove",function(){
            Souche.Sidebar.hideMessageTip();
        })
        if(window.Souche_user_id){
            $.ajax({
                url:contextPath+"/pages/chatAction/getTotalUnreadCount.json",
                dataType:"json",
                data:{
                    user:"buyer_"+Souche_user_id
                },
                success:function(data){
                    console.log(data.totalCount)
                    if(data&&data.totalCount>0){
                        $(".unreadtip").removeClass("hidden")
                    }
                }

            })
        }

    });
    var pageTitle = document.title;
    var tipDotCount = 1;
    var tipTimer;
    var hasNewMessage;

    return {
        getSalerId:function(store,callback){
            $.ajax({
                url:contextPath+"/pages/saleDetailAction/getChatId.json",
                data:{
                    store:store
                },
                success:function(data){
                    if(data.chatId){
                        callback(data.chatId);
                    }else{
                        callback()
                    }

                }
            })
        },
        setChatMsgPoint:function(store,callback){
            $.ajax({
                url:contextPath+"/pages/saleDetailAction/setChatMsgPoint.json",
                data:{
                    sender:Souche_user_id,
                    chatID:"",
                    receiver:store,
                    text:"hillo world",
                    img:"",
                    voice:"",
                    time:new Date().getTime()
                },
                success:function(data){

                }
            })
        },
        showTalk:function(user_id,url){
            var self = this;
            Souche.MiniLogin.checkLogin(function(isLogin) {
                $(".unreadtip").addClass("hidden")
                if(user_id.indexOf("shop_")!=-1){
                    //授权店
                    self.getSalerId(user_id,function(chatId){
                        if(chatId){
                            var href = $("#sidebar-talk").attr("href")
                            if(user_id){
                                href = contextPath+"/pages/toolbar/talk.html?talk_with="+user_id+"&url="+encodeURIComponent(url);
                            }
                            Souche.Sidebar.showSidebar($("#sidebar-talk")[0],href)
                        }else{
                            Souche.Sidebar.setChatMsgPoint(user_id,function(){

                            })
                        }
                    })
                }else{
                    var href = $("#sidebar-talk").attr("href")
                    if(user_id){
                        href = contextPath+"/pages/toolbar/talk.html?talk_with="+user_id+"&url="+encodeURIComponent(url);
                    }
                    Souche.Sidebar.showSidebar($("#sidebar-talk")[0],href)

                }
            },false,true)

        },
        hideMessageTip:function(){
            if(tipTimer) clearInterval(tipTimer)
            document.title =  pageTitle
        },
        newMessageTip:function(){
            clearInterval(tipTimer)
            hasNewMessage = true;
            tipTimer = setInterval(function(){
                if(tipDotCount==1){
                    tipDotCount = 0;
                }else{
                    tipDotCount=1;
                }
                document.title = (tipDotCount==1?"☏":"☎")+"您有新消息 | "+pageTitle
            },10)

        },
        hideTalk:function(){
            $("#toolbar").animate({
                width: 52,
                height: 309
            }, 500, function() {

            })
            $("#toolbar").removeClass("sidebar-active")
            siderbarShow = false;
        },
        showSidebar:function(self,url) {
            var href = $(self).attr("href");
            if(url){
                href = url;
            }
            $(".sidebar .side-box").removeClass("active")
            $(self.parentNode).addClass("active")
            if (!$("#toolbar").hasClass("sidebar-active")) {
                $("#toolbar").animate({
                    width: 905,
                    height: ($(window).height() - 20) > 500 ? 500 : ($(window).height() - 20)
                }, 500, function() {
                    siderbarShow = true;
                })
                $(".sidebar  iframe").css({
                    height: (($(window).height() - 20) > 500 ? 500 : ($(window).height() - 20)) - 32
                })
                $("#toolbar").addClass("sidebar-active")
                $(".sidebar").removeClass("active")
            }
            $(".toolbar-content iframe").attr("src", href);
            $(".toolbar-content .iframe-loading").removeClass("hidden");
            $(".toolbar-content iframe").load(function() {
                $(this).removeClass("hidden");
                $(".toolbar-content .iframe-loading").addClass("hidden");
            })
        }
    }
})();
