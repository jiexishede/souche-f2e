
!function(name,func,depenpencies){
    var hasDefine = (typeof define ==='function');
    if(hasDefine){
        depenpencies = depenpencies ||[];
        define(depenpencies,func);
    }else{
        this[name] = func();
    }

}('BrandMgr',filter,['common/BrandManager','filter/addListener']);


function filter(BrandMgr,addListener) {
    //BrandMgr
    addListener(BrandMgr);
    return {
        init:function(){
            var hotBrands_g = {
                "brand-15": "奥迪",
                "brand-20": "宝马",
                "brand-25": "奔驰",
                "brand-27": "本田",
                "brand-29": "标致",
                "brand-30": "别克",
                "brand-41": "大众",
                "brand-49": "丰田",
                "brand-53": "福特",
                "brand-99": "路虎",
                "brand-102": "马自达",
                "brand-108": "迷你",
                "brand-119": "起亚",
                "brand-121": "日产",
                "brand-134": "斯巴鲁",
                "brand-135": "斯柯达",
                "brand-146": "沃尔沃",
                "brand-151": "现代",
                "brand-154": "雪佛兰",
                "brand-155": "雪铁龙"
            };

            var prices = [5, 8, 12, 16, 20, 25, 50, 70, 100];

            function makeBrands(brands) {
                var b, otherBrandsStr = '';
                var brandList = $('#brand-list');

                var $otherCtn = brandList.find('#other-brands');
                for (var i = 0; i < brands.length; i++) {
                    b = brands[i];
                    if (!hotBrands_g[b.code]) {
                        otherBrandsStr += '<div data-code="'+ b.code+'" class="item col-1-4"><span class="brand-name">'+ b.enName+'</span></div>';
                    }
                }
                $otherCtn.append(otherBrandsStr);
            }

            function makeSeries(codes) {
                var start = '<div class="clearfix">',
                    end = '</div></div>';
                var html = '';

                for (var i in codes) {
                    html += start;
                    html += '<div class="series-title">' + i + '</div ><div class="series-name-wrapper">'
                    var s = codes[i];
                    for (var j in s) {
                        var b = s[j];
                        html += '<div data-code="' + b.code + '"class="series-name">' + b.name + '</div>';
                    }
                    html += end;
                }
                $('#series-list .content').append(html);
            }

            function showPopup_b() {
                $('.wrapGrayBg').removeClass('hidden');
                var $win = $(window);
                var winW = $win.width(),
                    scrollTop = $win.scrollTop();
                $('#brand-wrapper').css({
                    width: winW - 20,
                    top: scrollTop + 50
                }).removeClass('hidden');

            }

            function showPopup_s() {
                $('.wrapGrayBg').removeClass('hidden');
                var $win = $(window);
                var winW = $win.width(),
                    scrollTop = $win.scrollTop();
                $('#series-wrapper').css({
                    width: winW - 20,
                    top: scrollTop + 50
                }).removeClass('hidden');

            }
            var selectedBrand = '';
            var selectedSeries = '';
            var selectedBrandName = '';
            var selectedSeriesName = '';
            var brandLoaded = false;
            $('#btn-select-brand').click(function () {
                showPopup_b();
                if (!brandLoaded) {
                    //add hotbrand first;
                    var b, hotBrandsStr = '';
                    var $hotCtn = $('#brand-list #hot-brands');
                    for (var i in hotBrands_g) {
                        hotBrandsStr += '<div data-code = "' + i + '"class = "item col-1-4"><span class="brand-name">' + hotBrands_g[i] + ' </span></div>';
                    }
                    $hotCtn.append(hotBrandsStr);

                    $.ajax({
                        url: contextPath + "/pages/dicAction/loadAllExistBrands.json",
                        dataType: "json ",
                        success: function (data) {
                            makeBrands(data.items);
                            brandLoaded = true;
                        }
                    })
                }
            })

            $('#brand-list').on('click', '.item', function () {
                var self = $(this);
                var code = self.attr('data-code'),
                    name = self.find('.brand-name').text();
                if(self.hasClass('selected')){
                    BrandMgr.removeBrand(code);
                }else{
                    if(BrandMgr.brands.length>=5){
                        console.log('brands len should be less or equal 5');
                        return;
                    }
                    BrandMgr.addBrand(code,name);
                }
            });
            $('#brand-buxian').click(function () {
                BrandMgr.noLimitBrand();
            })


            $('#brand-pane').on('click','.selected-item',function(){
                var self = $(this);
                var code = self.attr('data-code');
                BrandMgr.removeBrand(code);
            })

            $('#btn-select-series').click(function () {
                var $self = $(this);
                if (BrandMgr.brands.length==0) {
                    $self.text('请先选择品牌 ↑').css({
                        color: '#f00'
                    });
                    return;
                }
                $('.tab-items .pane-selected-item').each(function(idx,item){
                    $(this).attr('data-index',idx);
                })
                if($('.tab-items .pane-selected-item.selected').length==0){
                    selectBrandTab(0)
                }
                showPopup_s();
            })
            $('.tab-items').on('click','.selected-brand-item',function(){
                var i = $(this).attr('data-index');
                selectBrandTab(i);
            })

            var seriesPopupTitle = $('#series-list .title');
            function selectBrandTab(index){
                $('.content-tabs .content').removeClass('selected').eq(index).addClass('selected');

                var pSelectItem = $('.tab-items .pane-selected-item').removeClass('selected').eq(index);
                pSelectItem.addClass('selected');
                var bName = pSelectItem.find('.selected-brand-name').text();
                seriesPopupTitle.text(bName);
            }

            $('#series-wrapper').on('click', '.series-name', function () {
                var $self = $(this);
                var code = $self.attr('data-code');
                var name = $self.text();
                setSeries(code, name);
                $self.addClass('selected');
            })



            $('#option-advance').click(function () {
                var $self = $(this);
                if ($self.hasClass('reverse')) {
                    $self.removeClass('reverse');
                    $('#option-advance-show').addClass('hidden');
                } else {
                    $self.addClass('reverse');
                    $('#option-advance-show').removeClass('hidden');
                }
            });

            $('.wrapGrayBg').click(function () {
                $(this).addClass('hidden');
                $('#brand-wrapper').addClass('hidden');
                $('#series-wrapper').addClass('hidden');
                $('.mobile-popup').addClass('hidden');
            });


            $('#series-buxian').click(function () {
                setSeries('', '不限');
            })

            $('#select-price-1').change(function () {
                var lowP = $(this).val();
                var $highP = $('#select-price-2');
                var curHighP = $highP.val();
                $highP.empty();
                var findSelected = false;
                var html = '';
                for (var i = 0; i < prices.length; i++) {
                    var p = prices[i];
                    if (p > lowP) {
                        if (p == curHighP) {
                            findSelected = true;
                            html += '<option selected="selected" value="' + p + '">' + p + '万</option>'
                        } else {
                            html += '<option value="' + p + '">' + p + '万</option>'
                        }
                    }
                }
                if (findSelected) {
                    html = '<option value="100000000">不限</option>' + html;
                } else {
                    html = '<option selected="selected" value="100000000">不限</option>' + html;
                }
                $highP.append(html)
            });
            $('#select-price-2').change(function () {
                var highP = $(this).val();
                var $lowP = $('#select-price-1');
                var curLowP = $lowP.val();
                $lowP.empty();
                var html = '';
                var findSelected = false;
                for (var i = 0; i < prices.length; i++) {
                    var p = prices[i];
                    if (p < highP) {
                        if (p == curLowP) {
                            findSelected = true;
                            html += '<option selected="selected" value="' + p + '">' + p + '万</option>'
                        } else {
                            html += '<option value="' + p + '">' + p + '万</option>'
                        }
                    }
                }
                if (findSelected) {
                    html = '<option value="0">不限</option>' + html;
                } else {
                    html = '<option selected="selected" value="0">不限</option>' + html;
                }
                $lowP.append(html)
            });

            function hasResult(dataObj) {
                $.ajax({
                    url: contextPath + '/pages/mobile/listAction/queryCars.json?index=99999',
                    data: dataObj,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        if (data.i == 0) {
                            $('.mobile-popup .cond').text(getAllCond());
                            showSorry();
                        } else {
                            var addr = contextPath + '/pages/mobile/list.html?';
                            for (var i in dataObj) {
                                addr += (i + '=' + dataObj[i] + '&');
                            }
                            window.location.href = addr;
                        }
                    }
                })
            }

            $('#go-list-btn').click(function () {
                function getCond(val) {
                    if (!val) {
                        return '';
                    } else {
                        return val;
                    }
                }
                var dataObj = {
                    carBrand: '',
                    carSeries: '',
                    carPrice: '',
                    carYear: '',
                    carMileage: '',
                    carModel: '',
                    carEngineVolume: '',
                    transmissionType: ''
                };

                var year = $('#select-year').val();
                if (!year || year == '') {
                    year = '0000-9999'
                } else {
                    year = year + '-9999'
                }
                var price1 = $('#select-price-1').val();
                var price2 = $('#select-price-2').val();
                /*
                 if ((+price1) > (+price2)) {
                 alert('请检查价格范围的选择.')
                 return;
                 }*/
                dataObj.carYear = year;
                dataObj.carPrice = price1 + '-' + price2;
                dataObj.carBrand = selectedBrand;
                dataObj.carSeries = selectedSeries;
                dataObj.carMileage = getCond($("#select-mile").val());
                dataObj.carModel = getCond($('#select-model').val());
                dataObj.carEngineVolume = getCond($('#select-volume').val());
                dataObj.transmissionType = getCond($('#select-transmission').val());
                //$.ajax for no reuslt
                hasResult(dataObj);

            })

            function getAllCond() {
                function buildUtil($item, prefix, suffix) {
                    prefix = prefix || '';
                    suffix = suffix || '';
                    if ($item.val()) {
                        var item = $item.find('option:selected').text();
                    } else {
                        return;
                    }

                    if (item && item != '不限' && item != '') {
                        conds.push(prefix + item.trim() + suffix);
                    }
                }
                var conds = [];
                var price1 = $('#select-price-1').val();
                var price2 = $('#select-price-2').val();
                if (price1 == '0' && price2 == '100000000') {
                    //nothing to do
                } else {
                    price2 = (price2 == '100000000' ? '不限' : price2 + '万')
                    conds.push(price1 + '万-' + price2);
                }
                if (selectedBrand) {
                    conds.push(selectedBrandName.trim())
                }
                if (selectedSeries) {
                    conds.push(selectedSeriesName.trim())
                }
                buildUtil($('#select-mile'));
                buildUtil($('#select-year'), '最远年份');
                buildUtil($('#select-model'));
                buildUtil($('#select-volume'));
                buildUtil($('#select-transmission'));

                return conds.join('/');
            }
            $('.filter-content select').change(function () {
                $(this).css({
                    color: '#000'
                });
            })



            function goToCustom() {
                var phoneReg = /^1[3458][0-9]{9}$/;
                var phoneNum = $('#phone-for-notify').val();
                if (!phoneReg.test(phoneNum)) {
                    $('#notify-form .wrong-tip').removeClass('hidden');
                    return;
                }
                $('#notify-form .wrong-tip').addClass('hidden');
                SM.PhoneRegister(phoneNum, function () {
                    if (window.location.href.toString().toLowerCase().indexOf('from=sms') != -1) {
                        window.location.href = contextPath + '/mobile/carcustom.html?from=sms';
                    } else {
                        window.location.href = contextPath + '/mobile/carcustom.html';
                    }
                });
            }

            function showSorry() {
                var $popup = $('.mobile-popup').removeClass('hidden');
                $('.wrapGrayBg').removeClass('hidden');
                var scrollTop = $(window).scrollTop();
                $popup.removeClass('hidden').css({
                    top: scrollTop + 50,
                    zIndex: 10000
                });
                var phoneNum = checkUserLocal().phoneNum
                if (phoneNum) {
                    $popup.find('#phone-for-notify').val(phoneNum);
                }

                $('#notify-form').submit(function (e) {
                    e.preventDefault();
                    var minP = $('#select-price-1').val();
                    var maxP = $('#select-price-2').val();
                    var brand = selectedBrand;
                    $.ajax({
                        url: contextPath + '/mobile/carCustomAction/saveBuyInfo.json',
                        data: {
                            brands: brand,
                            minPrice: minP,
                            maxPrice: maxP
                        },
                        success: function () {
                            goToCustom();
                        },
                        error: function () {
                            alert('error');
                        }
                    });
                })
            }
        }
    }


}