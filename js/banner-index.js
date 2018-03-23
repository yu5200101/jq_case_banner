
~function ($) {
    function pluginBanner(options) {
        var $container = this,
            $wrapper = $container.children('.wrapper'),
            $focusBox = $container.children('.focusBox'),
            $arrowLeft = $container.children('.arrowLeft'),
            $arrowRight = $container.children('.arrowRight'),
            $slideList = null,
            $imgList = null,
            $focusList = null,
            bannerData = null;

        //=>初始化参数
        var _default = {
            initIndex : 0,
            autoInterval : 2000,
            showFocus : true,
            needFocus : true,
            eventFocus : 'mouseenter',
            showArrow :true,
            eventArrow : 'click',
            needAuto : true,
            url: null
        };
        options && $.each(options,function (key,value) {
            if(options.hasOwnProperty(key)){
                _default[key] = value;
            }
        });
        var initIndex = _default.initIndex,
            autoInterval = _default.autoInterval,
            showFocus = _default.showFocus,
            needFocus = _default.needFocus,
            eventFocus = _default.eventFocus,
            showArrow = _default.showArrow,
            eventArrow = _default.eventArrow,
            needAuto = _default.needAuto,
            url = _default.url;

        //=>获取数据getData 和绑定数据 bingData
        ~function (){
            $.ajax({
                method : 'GET',
                url: url,
                dataType : 'json',
                async : false,
                success : function (result) {
                    bannerData = result;
                }
            });
            var str = ``,
                strFocus = ``;
            $.each(bannerData,function (index,item) {
                str += `<li class="slide">
            <img src="" data-img="${item.img}" alt="">
        </li>`;
                if(showFocus){
                    strFocus += `<li class = "${index === bannerData.length -1 ? 'last' : ''}"></li>`;
                }
            });
            $wrapper.html(str);
            showFocus ? $focusBox.html(strFocus) : null;
            //=>赋值
            $slideList = $wrapper.children();
            $imgList = $wrapper.find('img');
            showFocus ? $focusList = $focusBox.children() : null;
        }();
        //=>默认展示
        ~function () {
            $slideList.css({
                zIndex:0,
                opacity:0

            }).eq(initIndex).css({
                zIndex:1,
                opacity:1

            });
            if(showFocus){
                $focusList.removeClass('select')
                    .eq(initIndex).addClass('select');
            }
        }();
        //=>延迟加载
        $(window).on('load',function () {
            $imgList.each(function (index, item) {
                let tempImg = new Image();
                tempImg.src = $(item).data('img');
                //=>item.getAttribute('data-img);
                tempImg.onload = function () {
                    item.src = this.src;
                    $(item).css('display','block');
                };
            });
        });
        //=>改变banner
        var autoTimer = null,
            count = bannerData.length;
        needAuto ? autoTimer = setInterval(autoMove,autoInterval) : null;
        function autoMove() {
            initIndex++;
            initIndex === count ? initIndex = 0 : null;
            change();
        }
        $container.on('mouseenter',function () {
            needAuto ? clearInterval(autoTimer) : null;
            if(showArrow){
                $arrowLeft.css('display','block');
                $arrowRight.css('display','block');
            }
        }).on('mouseleave',function () {
            needAuto ? autoTimer = setInterval(autoMove,autoInterval) : null;
            if(showArrow) {
                $arrowLeft.css('display', 'none');
                $arrowRight.css('display', 'none');
            }
        });
        if(showArrow){
            $arrowRight.on(eventArrow,autoMove);
            $arrowLeft.on(eventArrow,function () {
                initIndex --;
                initIndex === -1 ? initIndex = count -1 : null;
                change();
            });
        }
        if(showFocus && needFocus){
            $focusList.on(eventFocus,function () {
                initIndex = $(this).index();
                change();
            });
        }
        //change
        function change() {
            var $curSlide = $slideList.eq(initIndex);
            $curSlide.css('zIndex',1)
                .siblings().css('zIndex',0);
            $curSlide.stop().animate({opacity:1},200,function () {
                $(this).siblings().css('opacity',0);
            });
            //->
            if(showFocus){
                $focusList.eq(initIndex).addClass('select')
                    .siblings().removeClass('select');
            }
        }
    }

    $.fn.extend({
        pluginBanner:pluginBanner
    });
}(jQuery);