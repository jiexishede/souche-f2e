define(function() {
    var topNav = {
        init: function() {
            $(".nav-item").each(function(i, item) {
                var inner = $(item).find(".nav-inner");
                //预先计算每个inner的高度，留着动画用
                //先透明，然后显示出来，计算高度，然后隐藏
                $(inner).css({
                    opacity: 0
                }).removeClass("hidden");
                $(inner).attr("data-height", $(inner).height())
                    .addClass("hidden");
                var itemWidth = $(item).width();
                var itemHeight = $(item).height();
                $(item).attr("data-width", itemWidth);
                $(item).attr("data-height", itemHeight);
            });
            var isIns = {

            }
            $(".nav-item").mouseenter(function(event) {
                var name = $(this).attr("data-name");
                isIns[name] = true;
                var self = this;
                setTimeout(function() {
                    if (!isIns[name]) return;
                    var itemWidth = $(self).attr("data-width");
                    var itemHeight = $(self).attr("data-height");
                    var inner = $(self).find(".nav-inner");
                    inner.removeClass("hidden");

                    var innerHeight = inner.attr("data-height");
                    inner.attr("data-height", innerHeight);
                    //先显示inner，算出其宽高，然后变小，再动画变大。
                    inner.css({
                        width: itemWidth,
                        height: itemHeight,
                        opacity: 1
                    }).animate({
                        width: 598,
                        height: innerHeight,
                        opacity: 1
                    }, 400)
                }, 200)

            }).mouseleave(function() {
                var name = $(this).attr("data-name");
                isIns[name] = false;
                var self = this;
                var itemWidth = $(self).attr("data-width");
                var itemHeight = $(self).attr("data-height");
                var inner = $(self).find(".nav-inner");
                var innerHeight = inner.attr("data-height");
                inner.animate({
                    width: itemWidth,
                    height: itemHeight,
                    opacity: 1
                }, 300, function() {
                    //动画后恢复inner的高度
                    inner.css({
                        height: innerHeight
                    }).addClass("hidden")
                })
            })
        }
    }
    return topNav;
});