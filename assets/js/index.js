


define(['index/qiugou','souche/down-counter'], function (QiuGou,downCounter){
	
	$('.down-counter').each(function(){
		var $this = $(this);
		downCounter($this);
	});
	Souche.Index = (function(){
	var config = {
		has_qiugou:false
	};
	
	return {
		init:function(_config){
			$.extend(config,_config);
			QiuGou.init(config);
			//sidebar自动顶住
			var contentTop = $("#content").offset().top;
			var contentHeight = $("#content").height();
			var sidebarHeight = $("#side_bar").height();
			var checkSidebar = function(){
				var windowTop = $(window).scrollTop();
				//顶部对齐
				if(windowTop>(contentTop-20)){
					$("#side_bar").css({
						top:10
					})
				}else{
					$("#side_bar").css({
						top:contentTop-windowTop
					})
				}
			}
			checkSidebar()
			$(window).on("scroll",function(e){
				checkSidebar();
				//底部对其
				// if(sidebarHeight+windowTop>contentTop+contentHeight){
				// 	$("#side_bar").css({
				// 		top:contentHeight-sidebarHeight
				// 	})
				// }
			})

			//brand 出来，隐藏效果
			
			var showDelayT = 200;
			var checkDisplayStatus = function(){
				var brandTimer = setTimeout(function(){
					var zIndex = (+$('#brand').css('z-index'))+1;
					clearTimeout(brandTimer);
					if(brandSelectActive == true){
						$('#nav-item-brand').css({border:'1px solid #fc7000',
																				'border-right':'1px solid #fff',
																				'z-index':zIndex});
						$('#brand').show().animate({width:'690px',avoidTransforms:true},showDelayT);
					}else{
						$('#brand').animate({width:'0px',avoidTransforms:true},showDelayT,function() {
							$('#brand').hide();
							$('#nav-item-brand').css({border:'1px solid #fff','z-index':0});
						});
					}
				},showDelayT);
			};

			var brandSelectActive = false;

			$('#nav-item-brand,#brand').on('mouseenter',function(){
				brandSelectActive=true;
				checkDisplayStatus();
				
			}).on('mouseleave',function(){
				brandSelectActive =false;
				checkDisplayStatus();
			});
			  var phoneReg = /^1[3458][0-9]{9}$/;
			var submitToPhone = function(){
				$.ajax({
					url:contextPath+"/pages/saleDetailAction/sendAddressToPhone.json",
					data:{},
					type:"post",
					success:function(data){
							$(".wrapGrayBg").show();
							$("#address-popup").addClass("hidden")
							$("#address-result-popup").removeClass('hidden');
					}
				})
			}
			$("#address-form").on("submit",function(e){
				e.preventDefault();
				if(!phoneReg.test($("#address-phone").val())){
					$(".warning",this).removeClass("hidden");
				}else{
					Souche.PhoneRegister($("#address-phone").val(),function(){
						submitToPhone();
					})
					
				}
			})
			$(".sendadd").click(function(){
				Souche.checkPhoneExist(function(is_login){
					if(is_login){
						submitToPhone();
					}else{
						$("#address-popup").removeClass("hidden")
						$(".wrapGrayBg").show();
					}
				})
			})
		}
	}
})();
	return Souche.Index;
});


