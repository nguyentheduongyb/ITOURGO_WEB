//Copyright by PNGSOFT CORP. 2007-2018.
//File: APP\assets\core\service\WebLiberary.js 
//Created:	Duongitvn(18/12/2018)
//Edit:
//Description: 

Array.prototype.remove = function (from, to) {
    if (from != undefined) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    } else return null;

};

Number.prototype.format = function (n, x, s, c) {
    if (n == undefined) { n = 0; } if (x == undefined) { x = 3; }
    s = ","; c = ".";
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~ ~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
String.prototype.format = function (intDecimal) {
    //$("#txtPrice,#txtPriceSGL").AutoFormatInput();
    var strValue = parseFloat(this.toString().Replace(",", ""));
    if (isNaN(strValue)) { strValue = 0; }
    var n = 0;
    if (intDecimal != undefined & intDecimal != "") {
        if (intDecimal.toString().isNumber()) {
            n = parseInt(intDecimal);
        }
    }
    var x = 3; var s = ","; var c = ".";
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = strValue.toFixed(Math.max(0, ~ ~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}
String.prototype.getNumber = function () {
    var strValue = this.toString();
    strValue = strValue.Replace(",", "");
    var dblReturn = parseFloat(strValue);
    if (isNaN(dblReturn)) { return 0; }
    else return dblReturn;
}
String.prototype.Replace = function (strFind, strReplace) {
    var s = this.toString();
    if (s.length > 0) {
        while (s.indexOf(strFind) > -1) {
            s = s.replace(strFind, strReplace);
        }
    }
    return s;
}
String.prototype.isDate = function () {
    var date = this.toString();
    return !!(function (d) { return (d !== 'Invalid Date' && !isNaN(d)) })(new Date(date));
}
String.prototype.isNumber = function () {
    var s = parseFloat(this.toString().Replace(",", ""));
    return !isNaN(s);
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
Date.prototype.getMonthName = function () {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.getMonth()];
};
Date.prototype.getDayName = function () {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.getDay()];
};
Date.prototype.getDateString = function () {
    if (this.getDate() < 10) {
        return "0" + this.getDate() + ' ' + this.getMonthName() + ' ' + this.getFullYear();
    } else {
        return this.getDate() + ' ' + this.getMonthName() + ' ' + this.getFullYear();
    }
}
//----EXTEND FUNCTION FOR CONTROL----
$.fn.extend({
    AutoFormatInput: function (intDeclare) {
        return this.each(function () {
            if (intDeclare != undefined) { if (!intDeclare.toString().isNumber()) { options.intDeclare = 0; } else { intDeclare = parseInt(intDeclare); } }
            $(this).bind("change", function () {
                this.value = this.value.toString().format(intDeclare);
            });
            $(this).keypress(function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode
                var isReturn = false;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    if (charCode == 45 || charCode == 46)
                    { isReturn = true; }
                    else { isReturn = false; }
                }
                else {
                    isReturn = true;
                }
                return isReturn;
            });
        });
    },
    DefaultButton: function (idOrClassBtn) {
        return this.each(function () {
            // $(this).keydown(function (event) {
            //     if (event.keyCode == 13) {
            //         $("#" + strButtonID).click();
            //         event.preventDefault();
            //         return false;
            //     }
            //     return (event.keyCode != 13);
            // });
            $(this).keyup(function(e) {
                if (e.which == 13) {
                    $(idOrClassBtn).click();
                }
            });
        });
    },
    getNumber: function () {
        var strValue = $(this).val(); if (strValue == undefined) { strValue = "0"; }
        strValue = strValue.Replace(",", "");
        var dblReturn = parseFloat(strValue);
        if (isNaN(dblReturn)) { return 0; }
        else return dblReturn;
    },
    getDateString: function () {
        if ($(this).isDate() == false) {
            return null;
        }
        else {
            var dtmDateValue = new Date($(this).val());
            if (dtmDateValue.getDate() < 10) {
                return "0" + dtmDateValue.getDate() + ' ' + dtmDateValue.getMonthName() + ' ' + dtmDateValue.getFullYear();
            } else {
                return dtmDateValue.getDate() + ' ' + dtmDateValue.getMonthName() + ' ' + dtmDateValue.getFullYear();
            }
        }
    },
    isNumber: function () {
        var strValue = $(this).val();
        strValue = strValue.Replace(",", "");
        var dblReturn = parseFloat(strValue);
        return !isNaN(dblReturn);
    },
    isDate: function () {
        var strValue = $(this).val();
        var date = strValue;
        return !!(function (d) { return (d !== 'Invalid Date' && !isNaN(d)) })(new Date(date));
    },
    
    getFormatNumberInput : function (IsDecimal = false,IsRequire = true) {
        return this.each(function () {
            var selfInput =this
            $(this).change( function () {
                var valFn = $.pngFormatNumber(this.value.replace(/,/g,''))
                if(!valFn){
                    if(IsRequire){
                        valFn = '0'
                    }
                }

                if(valFn){
                    if(valFn.indexOf('.')==-1 && IsDecimal) 
                        valFn = valFn + '.00'
                }

                this.value = valFn
            }).change();
            $(this).keypress(function(e){
                
                var caret = $(this)[0].selectionStart
                var caretEnd = $(this)[0].selectionEnd

                var val = this.value
                var valChange = val
                if(caret!=caretEnd){
                    valChange = (valChange || '').substr(0,caret) + (valChange || '').substr(caretEnd,(valChange || '').length)
                }
                var charCode = (e.which) ? e.which : e.keyCode;
                if (
                    (charCode >= 48 && charCode <= 57)
                    || (charCode == 45 && caret == 0 && valChange.indexOf('-')==-1)
                    || (charCode == 46 && IsDecimal && valChange.indexOf('.')==-1)
                ){
                    setTimeout(function(){GetMain(false)},10)
                }else{
                    e.preventDefault(); //stop character from entering input
                }
                
               
                // var valFn = val.replace(/[^0-9\.]/g,'')
                // var valFn = $.pngFormatNumber(val.replace(/,/g,''))
                
            }).on('keydown', function(e) {
                
                if (e.keyCode==8){
                    var caret = $(selfInput)[0].selectionStart

                    var str = ($(selfInput).val() || '').substr(0, caret)
                    if((str+'|').indexOf(',|')!=-1){
                        caret-=1
                        setCaretToPos($(selfInput)[0],caret)
                    }
                    setTimeout(function(){GetMain(true)},10)
                }
                    
            });;

            function GetMain(_isBackSpace){

                var val = $(selfInput).val()
                var caret = $(selfInput)[0].selectionStart
                // if(!val)
                // val = '0'

                // if(valFn.indexOf('.')==-1 && IsDecimal) 
                //     valFn = valFn + '.00'

                var valFN = val.replace(/,/g,'')

                var intNumberInteger = (valFN.indexOf('.')==-1? valFN : valFN.split('.')[0])
                var intNumberDecimal = (valFN.indexOf('.')==-1? null : valFN.split('.')[1])

                if((!_isBackSpace && intNumberInteger != '-') || (_isBackSpace && intNumberInteger.length > 2)){
                    // if(
                    //     (valFN.indexOf('.')!=-1 && val.indexOf('.') >= caret)
                    //     || valFN.indexOf('.')==-1
                    // ){
                        var strMinus=''
                        if(intNumberInteger.indexOf('-')!=-1){
                            strMinus='-'
                            intNumberInteger = intNumberInteger.replace(/-/g,'')
                        }

                        if(('|'+intNumberInteger).replace(/-/g,'').indexOf('|0')!=-1 && (intNumberInteger.length > 2)){
                            intNumberInteger= '1'+intNumberInteger
                                val= '11'+val
                                valFN = $.pngFormatNumber(intNumberInteger.replace(/,/g,''))
                                valFN = strMinus+('|'+valFN).replace('|1,','').replace('|1','')
                            }else{
                                valFN = strMinus+$.pngFormatNumber(intNumberInteger.replace(/,/g,''))
                            }

                        if(IsDecimal){
                            // if(valFN.indexOf('.')==-1 && val.indexOf('.')!=-1) 
                            if(intNumberDecimal)
                                valFN = valFN + '.'+intNumberDecimal
                            else if(val.indexOf('.')!=-1)
                                valFN = valFN + '.'
                        }

                    // }else{
                    //     valFN = val
                    // }
                // }else{
                //     valFN = $.pngFormatNumber(val.replace(/,/g,''))
                //     if(valFN.indexOf('.')==-1 && IsDecimal) 
                //        valFN = valFN + '.00'
                }
                
                $(selfInput).val(valFN)
                if(val.length<valFN.length && ( 
                        (valFN.indexOf('.')!=-1 && ((valFN.split('.')[0] || '').replace('-','')).length > 1)
                        || valFN.indexOf('.')==-1
                    )
                )
                    caret+=1
                else if(val.length>valFN.length)
                    caret-=1
                
                if(caret<0)
                    caret = 0

                setCaretToPos($(selfInput)[0],caret)


            }
            function setCaretToPos(input, pos) {
                setSelectionRange(input, pos, pos);
            }
            function setSelectionRange(input, selectionStart, selectionEnd) {
                if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                } else if (input.createTextRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                }
            }



        })
    }
    
});


$.WebPaging = function (options) {
    var defaults = {
        intCurrentPage: 1,
        intPageSize: 10,
        intTotalRecode: 0,
        strControlID: "",
        ChangePages: function (data) { }
    }
    var options = $.extend(defaults, options);
    var arrPageSize = [10,20,30,40,50]
    var intTotalPage = Math.ceil(options.intTotalRecode / options.intPageSize);


    // var strHtmlPag = '<table style="width: 100%">'
    //     strHtmlPag+= '  <tr>'
    //     strHtmlPag+= '      <td class="col-1"></td>'
    //     strHtmlPag+= '      <td class="col-2" align="right"></td>'
    //     strHtmlPag+= '  </tr>'
    //     strHtmlPag+= '</table>'
    var strHtmlPag = '<div style="display: inline-block;padding: 7px 0;margin-bottom: 10px;" class="col-1"></div>'
        strHtmlPag+= '<div style="float: right;" class="col-2"></div>'

    $(options.strControlID).html(strHtmlPag);

    options.intCurrentPage = parseInt(options.intCurrentPage)
    options.intPageSize = parseInt(options.intPageSize)
    if(options.intCurrentPage && options.intPageSize){

        var strHtmlPag_Col1 = ''
            strHtmlPag_Col1+= '<span langval="['+((options.intCurrentPage - 1)*options.intPageSize +1)+'],['+(options.intCurrentPage*options.intPageSize > options.intTotalRecode? options.intTotalRecode :  options.intCurrentPage*options.intPageSize)+'],['+options.intTotalRecode+']" langkey="sys_Txt_PgSz-Show"></span>'
        $(options.strControlID).find('.col-1').html(strHtmlPag_Col1);

        
        var strHtmlPag_Col2 = ''
            strHtmlPag_Col2+= '<div style="display: inline-block;margin-bottom: 10px;">'
                strHtmlPag_Col2+= '<span langkey="sys_Txt_PgSz-ItPerPg"></span> '
                strHtmlPag_Col2+= '<select class="PageSize form-control" style="width:inherit;display: initial;">'
                var i=0
                arrPageSize.forEach(function(val,key){
                    if((options.intPageSize > arrPageSize[key-1]|| key==0) && options.intPageSize < val && i==0){
                        i++
                        strHtmlPag_Col2+= "<option value='"+options.intPageSize+"'>"+options.intPageSize+"</option>"
                    }

                    strHtmlPag_Col2+= "<option value='"+val+"'>"+val+"</option>"
                })
                strHtmlPag_Col2+= "</select> "

            strHtmlPag_Col2+= '</div>'
            strHtmlPag_Col2+= '<div style="display: inline-block;margin-bottom: 10px;">'

                strHtmlPag_Col2+= '<ul class="pagination" style="margin:0; margin-bottom:-12px">';
                strHtmlPag_Col2+= '     <li data="--"><a class="glyphicon glyphicon-backward" style="top: 0px;"></a></li>';
                strHtmlPag_Col2+= '     <li data="-"><a class="glyphicon glyphicon-chevron-left" style="top: 0px;"></a></li>';
                strHtmlPag_Col2+= '</ul>';

                strHtmlPag_Col2+= ' <span langkey="sys_Txt_PgSz-Pg"></span> <select class="listpage form-control" style="width:inherit;display: initial;"></select> / '+intTotalPage;

                strHtmlPag_Col2+= '<ul class="pagination" style="margin:0; margin-bottom:-12px">';
                strHtmlPag_Col2+= '     <li data="+"><a class="glyphicon glyphicon-chevron-right" style="top: 0px;"></a></li>';
                strHtmlPag_Col2+= '     <li data="++"><a class="glyphicon glyphicon-forward" style="top: 0px;"></a></li>';
                strHtmlPag_Col2+= '</ul>';
            strHtmlPag_Col2+= '</div>'

        $(options.strControlID).find('.col-2').html(strHtmlPag_Col2);

        var strHTMLListPage
        for (i = 1; i <= intTotalPage; i++) {

            strHTMLListPage+= "<option value='" + i + "'><a>" + i + "</a></option>";

        }
        $(options.strControlID).find('.col-2 .listpage').html(strHTMLListPage);

        $(options.strControlID).find('.col-2 .PageSize').val(options.intPageSize)
        $(options.strControlID).find('.col-2 .PageSize').change(function(){
            options.ChangePages.call(this, 1, this.value);
        })

        $(options.strControlID).find('.col-2 .listpage').val(options.intCurrentPage)
        $(options.strControlID).find('.col-2 .listpage').change(function(){
            options.ChangePages.call(this, this.value, options.intPageSize);
        })

        $(options.strControlID).find('.col-2 .pagination li').click(function(){
            
            var strData = $(this).attr("data");
            if (strData != undefined) {
                if (strData == "+") {
                    if(options.intCurrentPage < intTotalPage)
                        options.intCurrentPage+= 1
                }
                else if (strData == "++") 
                    options.intCurrentPage = intTotalPage
                else if (strData == "-") {
                    if(options.intCurrentPage > 1)
                        options.intCurrentPage-= 1
                }else if (strData == "--") 
                    options.intCurrentPage = 1
            }
            
            options.ChangePages.call(this, options.intCurrentPage, options.intPageSize);

        })

        if(options.intCurrentPage!=1 && options.intTotalRecode==0){
            options.ChangePages.call(this, 1, options.intPageSize);
        }

    }else{
        var strHtmlPag_Col1 = ''
            strHtmlPag_Col1+= '<span>Showing '+options.intTotalRecode+' Items</span>'
        $(options.strControlID).find('.col-1').html(strHtmlPag_Col1);
    }
    
}

$.Confirm = function (options) {
    var defaults = {
        strContent: "",
        strTitle: "",
        OnSuccess: function () {},
        OnExits: function () {}
    }
    options = $.extend(defaults, options);
    var strHTML =  '<div class="modal fade in" id="pnModuleConfirm" aria-hidden="true" data-backdrop="false" data-keyboard="false" tabindex="-1" role="dialog" style="display: block; ">'
        strHTML+=  '    <a data-target="#pnModuleConfirm" id="pnConfirmShowButton" data-toggle="modal" style="display:none">show model</a>';
        strHTML+=  '    <div class="modal-dialog">'
        strHTML+=  '        <div class="modal-content" style="width:300px; margin: auto; top: 100px;">'
        strHTML+=  '            <div class="modal-header" style="background-color: #3474d2; color:#ffffff;">' + options.strTitle + '<button type="button " class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>';
        strHTML+=  '            <div class="modal-body">'
        strHTML+=  '                <div class="text-center">' + options.strContent + '</div>'
        strHTML+=  '            </div>'
        strHTML+=  '            <div class="modal-footer">'
        strHTML+=  '                <div id="pnBtnCfm">'
        strHTML+=  '                    <button type="button" class="btn btn-default btn-flat" data-dismiss="modal"><span langkey="sys_Btn_Cancel"></span></button>'
        strHTML+=  '                    <button type="button" class="btn btn-primary btn-flat" data-dismiss="modal"><span langkey="sys_Btn_OK"></span></button>'
        strHTML+=  '                </div>'
        strHTML+=  '                <div id="pnBtnNotify">'
        strHTML+=  '                    <button type="button" class="btn btn-default" data-dismiss="modal"><span langkey="sys_Btn_Close"></span><span class="intSecond"></span></button>'
        strHTML+=  '                </div>'
        strHTML+=  '            </div>'
        strHTML+=  '        </div>'
        strHTML+=  '    </div>'
        strHTML+=  '</div>'
    if(!$('body #pnModuleConfirm')[0])
        $("body").append(strHTML);
    
    $("#pnConfirmShowButton").click();
    $("#pnModuleConfirm").focus()
    pngElm.ChangeLanguage()

    var fnTimeOut

    if(options.OnSuccess.toString().replace(/\s+/g,'')=="function(){}"){
        $("#pnModuleConfirm").find("#pnBtnCfm").remove()
        var intSeconds = 3
        TimeOut()
        function TimeOut(){
            if(intSeconds!=0){
                fnTimeOut = setTimeout(function(){TimeOut()},1000)
                $("#pnModuleConfirm").find(".btn-default .intSecond").text('('+intSeconds+')')
                intSeconds-=1
            }else{
                $("#pnModuleConfirm").find(".btn-default").click()
            }
        }

    }else{
        $("#pnModuleConfirm").find("#pnBtnNotify").remove()
    }
    $("#pnModuleConfirm").find(".btn-default,.close").click(function () {
        removeNotify()
        options.OnExits.call();
    });
    $("#pnModuleConfirm").find(".btn-primary").click(function () {
        removeNotify()
        options.OnSuccess.call();
    });
    function removeNotify(){
        $("#pnModuleConfirm").remove();
        clearTimeout(fnTimeOut);
        if (($(document).find('.TMSModal')).length != 0)
            $('body').addClass('modal-open')
        else
            $('body').removeClass("modal-open").css('padding-right','0');
    }
    // $("#pnModuleConfirm").on('hidden.bs.modal', function (evt) {
    //     options.OnExits.call();
    // });
    $('#pnModuleConfirm').keyup(function(e) {
        var strClass=''
        if (e.which == 13) {
            strClass = '.btn-primary'
            if (($(this).find('#pnBtnNotify')).length != 0)
                strClass = '.btn-default'
        }
        if (e.which == 27 || e.keyCode == 27) {
            strClass = '.btn-default'
        }
        $(this).find(strClass).click();
    });

}

$.modal = {};

$.modal.popup = function (options) {
    var defaults = {
        title: "TMS System",
        content: "",
        footer: "",
        size: 1, //access: 1 for basic, 2 for dialog, 3 for full page
        effect: 1,
        scroll: false,
        OnClose: function () {

        }
    }
    options = $.extend(defaults, options);
    var _intCount = $.modal.popup.count() + 1;
    var strClass = "modal ";
    if (options.effect == 1) { 
        strClass+= "fade "; } 
    if (options.scroll == true) { 
        strClass+= "modal-scroll "; 
    }
    var strHTML =  '<div class="TMSModal ' + strClass + '"  aria-hidden="true" data-backdrop="static" id="pnModalsPopup_' + _intCount + '" tabindex="' + _intCount + '"'; 
    if (options.size == 1) { 
        strHTML+=  'role="basic"'; 
    } else if (options.size == 2 || options.size == 3) { 
        strHTML+=  'role="dialog"'; 
    } else if (options.size > 3) { 
        strHTML+=  'data-width="' + options.size + '"'; 
    } 
        strHTML+=  " style='display: block;'>";
        strHTML+=  '    <a data-target="#pnModalsPopup_' + _intCount + '" id="pnModalsPopupShowButton_' + _intCount + '" data-toggle="modal" style="display:none">show model</a>';
        strHTML+=  '    <div style="background-color: white;-webkit-box-shadow: -1px 2px 16px 2px rgba(0,0,0,0.75);-moz-box-shadow: -1px 2px 16px 2px rgba(0,0,0,0.75);box-shadow: -1px 2px 16px 2px rgba(0,0,0,0.75);" class="modal-dialog pn-round-1em'; 
        if (options.size == 2) { 
            strHTML+=  ' modal-lg">'; 
        } else if (options.size == 3) { 
            strHTML+=  ' modal-lg modal-exlg">'; 
        } else { 
            strHTML+=  '">'; 
        }
        strHTML+=  '        <div class="modal-header">'
        strHTML+=  '            <button type="button "class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
        strHTML+=  '            <h4 class="modal-title">'+options.title+'</h4>'
        strHTML+=  '        </div>';
        strHTML+=  '        <div class="modal-body">'+options.content+'</div>';
        strHTML+=  '        <div class="modal-footer">'
        strHTML+=  '            <span id="spanSave" style="margin-right:5px;display:none;"></span>'
        strHTML+=  '            <button style="display:none;" type="button" class="btn btn-primary" data-dismiss="modal">Close</button>'
        strHTML+=  '        </div>';
        strHTML+=  '    </div>'
        strHTML+=  '</div>';
    $("body").append(strHTML);
    
    $("#pnModalsPopupShowButton_" + _intCount).click();
    
    $("#pnModalsPopup_" + _intCount).find('.close').attr('title',pngElm.getLangKey({langkey:'sys_Txt_PressEscToClose'}))
    $("#pnModalsPopup_" + _intCount).find('.close').attr('data-placement','bottom')
    $("#pnModalsPopup_" + _intCount).find('.close').tooltip()
    
    $("#pnModalsPopup_" + _intCount).on('shown.bs.modal', function() { 
        pngElm.ChangeLanguage();
        if(_intCount > 1)
            $("#pnModalsPopup_" + (_intCount - 1)).css('overflow-y','hidden')
    });
    
    $("#pnModalsPopup_" + _intCount).on('hidden.bs.modal', function (evt) {

        this.remove();
        $('#pnFixedForPopUp_'+ _intCount).remove()
        
        if (($(document).find('.TMSModal')).length != 0)
            $('body').addClass('modal-open')

        if(_intCount > 1)
            $("#pnModalsPopup_" + (_intCount - 1)).css('overflow-y','auto')

        options.OnClose.call(this);
    });
}
$.modal.popup.remover = function () {
    $("#pnModalsPopup_" + ($.modal.popup.count())).find('button.close').click()
}
$.modal.popup.count = function () {
    return $(".TMSModal").length;
}


$.fn.loadJS = function (strLink) {
    var scripts = document.getElementsByTagName("script");
    var IsCheck = true;
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].getAttribute('src') == strLink) {
            IsCheck = false;
        }
    }
    if (IsCheck == true) {
        var jsLink = $("<script type='text/javascript' src='" + strLink + "'>");
        $("head").append(jsLink);
    }
}
$.fn.loadCSS = function (strLink) {
    var link = document.getElementsByTagName("link");
    var IsCheck = true;
    for (var i = 0; i < link.length; i++) {
        if (link[i].getAttribute('src') == strLink) {
            IsCheck = false;
        }
    }
    if (IsCheck == true) {
        var cssLink = $("<link>");
        $("head").append(cssLink);
        cssLink.attr({
            rel: "stylesheet",
            type: "text/css",
            href: strLink
        });
    }
}


$.pngFormatNumber= function (number) {
    if(number){
        var num = parseFloat(number).toFixed(2);
        num = parseFloat(num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }else
        return 0
}


$.pngFormatPrice = function(_dblPrice,_intCurrencyID){
    var strRtn = ''
    var intCurrencyID = null
    var strCurrencySymbol = ''

    var ArrListCurrency = null
    pngElm.getCurrencySys({
        OnSuccess: function(_arrListCurrency){
            ArrListCurrency = _arrListCurrency
        }
    })
    if(_intCurrencyID){
        intCurrencyID = _intCurrencyID
        strCurrencySymbol = ArrListCurrency.filter(function(item){return item.intCurrencyID == _intCurrencyID})[0].strCurrencySymbol
    }
    else{
        if(png.ArrLS.Currency.get()){
            intCurrencyID = JSON.parse(png.ArrLS.Currency.get()).intCurrencyID 
            strCurrencySymbol = JSON.parse(png.ArrLS.Currency.get()).strCurrencySymbol
        }
    }

    _dblPrice = (_dblPrice || 0)



    strRtn = strCurrencySymbol + '' + $.pngFormatNumber(_dblPrice)

    if(intCurrencyID == 3)
        strRtn = $.pngFormatNumber(_dblPrice)+ '&nbsp;' +strCurrencySymbol 

    return strRtn.trim()
}

$.pngFormatDateTime = function(_dtmDatetime,_strFormat){
    var dtmDate = _dtmDatetime
    var strFormat = _strFormat
    var dtmDateRtn = null

    if(!strFormat){
        strFormat = 'ddd, DD MMM, YYYY'
    }
    
    if(dtmDate){
        if(dtmDate.indexOf('Date')>-1){
            dtmDate = parseInt(dtmDate.substr(6))
        }
        if($.pngGetQSVal('lang') == 'vi' && _strFormat != 'l')
            dtmDateRtn = moment(dtmDate).lang($.pngGetQSVal('lang')).format(strFormat)
        else
            dtmDateRtn = moment(dtmDate).format(strFormat)
    }
    return  dtmDateRtn
}

$.pngExtendObj = function (objDefault,objMain,IsHold=false) {
    var objReturn = $.extend({}, objDefault);
    if(IsHold)
        objReturn = objDefault
    // Object.keys(objDefault).forEach(function(value){
    //     objReturn[value] = objDefault[value]
    // })
    if(objMain && Object.keys(objMain).length)
        Object.keys(objMain).forEach(function(value){
            objReturn[value] = objMain[value]
        })
    return objReturn;
}

$.pngReplaceObj = function (objDefault,objMain) {
    var objReturn = JSON.parse(JSON.stringify(objDefault))
    if(objMain && Object.keys(objMain).length){
        
        if(Object.keys(objMain).length < Object.keys(objReturn).length){
            Object.keys(objMain).forEach(function(value){
                if(typeof objReturn[value] != 'undefined')
                    objReturn[value] = objMain[value]
            })
        }else{
            Object.keys(objReturn).forEach(function(value){
                if(typeof objMain[value] != 'undefined')
                    objReturn[value] = objMain[value]
            })
        }

    }
    return objReturn;
}

$.pngRenameKeyObj = function (objMain,old_key,new_key) {
    if (old_key !== new_key) {
        objMain[new_key] = objMain[old_key]
        delete objMain[old_key];
    }
    return objMain;
}

$.pngLimitText = function (strText,stringLimit,endText = '...') {
    var strTextReturn = ''
        strTextReturn = (strText || '')
    if(strTextReturn.length>stringLimit)
        strTextReturn = strTextReturn.substr(0,stringLimit)+endText
    return strTextReturn
}

$.pngHtmlStars = function (dblNumber) {
    var strHtml = ''
    for(var i = 1;i<=5;i++){
        var strClassStar ='fa-star'
        if(i>dblNumber){
            if(i-dblNumber==0.5)
                strClassStar+='-half'
            strClassStar+='-o'
        }
        strHtml+='<i class="fa '+strClassStar+'"></i>'
    }
    return strHtml
}

$.pngGetQSVal = function (nameQS,valNewQS = '&&&',strUrlLink) {
    var strURL = (strUrlLink || window.location.href)

    var objValOldQS = new RegExp('[\?&]' + nameQS + '=([^&#]*)').exec(strURL)
    
    var IsGetQS = false
    if(valNewQS == '&&&'){
        IsGetQS = true
        valNewQS = null
    }
    if(valNewQS && !IsGetQS){
        if (objValOldQS == null){
            strURL += (strURL.indexOf('?')==-1? '?' : '&') + nameQS + '=' + valNewQS
        }else{
            strURL = strURL.replace(nameQS+'='+objValOldQS[1],nameQS+'='+valNewQS)
        }
    
        return strURL;
    }
    else if(!IsGetQS){
        if (objValOldQS != null){
            strURL = (strURL+'&').replace('#&','&').replace(nameQS+'='+objValOldQS[1]+'&','')
            strURL = (strURL+'&').replace('&&','').replace('?&','')
            
            strURL =  strURL.replace(nameQS+'='+objValOldQS[1],'')
        }
        
        return strURL;
    }
    else{
        if (objValOldQS == null)
            return null;
        else{
            return decodeURI(objValOldQS[1]) || 0;
        }
    }
}


$.pngGetLangID = function(){
    var langID
    if(png.ArrLS.Language.get() == "en")
        langID = 1
    else if(png.ArrLS.Language.get() == "vi")
        langID = 18
    return langID
}

$.pngGetArrAddAndDel = function (ArrFirst,ArrLast,OnRtn=function () {}) {
    var ArrListDel = ArrFirst.filter(function(i) {return ArrLast.indexOf(i) < 0;})
    var ArrListAdd = ArrLast.filter(function(i) {return ArrFirst.indexOf(i) < 0;})
    OnRtn.call(this,ArrListAdd,ArrListDel)
}

$.pngGetArrComboValue = function (ArrList,key,val) {
    var arr= []
    ArrList.forEach(function(value){
        var obj = {}
        obj[value[key]] = value[val]
        arr.push(obj)
    })
    return arr
}

$.pngGetArrQuery = function(_ArrListMain,_OnFilter,_strListOrder) {
    var arrListMain = _ArrListMain

    if(_OnFilter){
        arrListMain.filter(function(value,key){
            return _OnFilter(value,key)
        })
    }
    _strListOrder.split(',').reverse().forEach(function(value){
        arrListMain.sort(function(a, b){
            var a1= a[value], b1= b[value];
            if(a1== b1) return 0;
            return a1> b1? 1: -1;
        });
    })


    return arrListMain

}

$.pngGetSlug = function(_strText) {
    
    var slug = _strText.toLowerCase();
 
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    return slug;

}

$.pngGetNewIdPanel = function(_idOrClass) {
    var id = Math.random().toString(36).substring(4).toUpperCase()
    if(_idOrClass)
        $(_idOrClass).html('<div id="'+id+'"></div>')
    return '#'+id
}

$.pngGetRamdomPassword = function(_passwordLength){
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var letterArray = "!@#$%^&*";
    var allChars = numberChars + upperChars + lowerChars + letterArray;
    var randPasswordArray = Array(_passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars; randPasswordArray[3] = letterArray;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
    }
    
    function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

ObjData = [];
ObjData.Config = [];
ObjData.Config.strDefaultImages = "assets/images/noimages.png";

$.BindDropDownList = function (options) {
    //Sự kiện seccuss: được gọi khi hoàn thành lệnh
    var defaults = {
        strCombocode: "",
        strControlID: "",
        strWhere: "", //Có điều kiện hoặc không có điều kiện
        strText: "Select...",
        parameters: null,
        IsViewSate: false,
        IsRenSelect2: true,
        OnSuccess: function () {
        }
    }
    options = $.extend(defaults, options);
    var strDataReturn = "";
    var strControlViewSate = "";
    if (options.IsViewSate == true) {
        try {
            if (ObjData == undefined) {
                ObjData = [];
            }
        } catch (ex) { ObjData = []; }
        try {
            if (ObjData.ArrTemp == undefined) {
                ObjData.ArrTemp = [];
            }
        } catch (ex) { ObjData.ArrTemp = []; }

        var strTempSave = options.strControlID;
        if (eval("ObjData.ArrTemp." + strTempSave) == undefined) {
            strControlViewSate = strTempSave;
            GetDDLServerData();
        }
        else {
            $("#" + options.strControlID).html(eval("ObjData.ArrTemp." + strTempSave));
            if (options.IsRenSelect2 == true) {
                //$("#" + options.strControlID).select2();
            }

            if (options.OnSuccess != undefined) {
                options.OnSuccess.call(this)
            }

        }
    }
    else {
        GetDDLServerData();
    }
    function GetDDLServerData() {
        var item = {};

        //alert(options.strControlID)
        //alert(options.strCode)
        item.strCombocode = options.strCombocode;
        item.strWhere = options.strWhere;
        png.post({
            url: "api/system/GetComboboxByCode",
            data: item,
            OnSuccess: function (data) {
                strHTML = "";
                if (options.strText != "") {
                    strHTML = "<option value='-1'>" + options.strText + "</option>";
                }
                for (x = 0; x < data.length; x++) {
                    strHTML = strHTML + "<option value='" + data[x].strValueFeild + "'>" + data[x].strTextFeild + "</option>";
                }
                $("#" + options.strControlID).html(strHTML);
                if (options.IsRenSelect2 == true) {
                    //$("#" + options.strControlID).select2();
                }

                if (options.IsViewSate == true) {
                    eval('ObjData.ArrTemp.' + strControlViewSate + '="' + strHTML + '"');
                }
                if (options.OnSuccess != undefined) {
                    options.OnSuccess.call(this)
                }
            }
        });
        //$.BindAjax({
        //    objData: item, strApiURL: "api/values/", strActionName: "GetComboboxByCode",
        //    OnSuccess: function (data) {
        //        strHTML = "";
        //        data = JSON.parse(data);
        //        if (options.strText != "") {
        //            strHTML = "<option value='-1'>" + options.strText + "</option>";
        //        }
        //        for (x = 0; x < data.length; x++) {
        //            strHTML = strHTML + "<option value='" + data[x].strValueFeild + "'>" + data[x].strTextFeild + "</option>";
        //        }
        //        $("#" + options.strControlID).html(strHTML);
        //        if (options.IsRenSelect2 == true) {
        //            $("#" + options.strControlID).select2();
        //        }

        //        if (options.IsViewSate == true) {
        //            eval('ObjData.ArrTemp.' + strControlViewSate + '="' + strHTML + '"');
        //        }
        //        if (options.OnSuccess != undefined) {
        //            options.OnSuccess.call(this)
        //        }
        //    }
        //});
    }
    return strDataReturn;
};
$.BindDropDownListSQL = function (options) {
    //Funtion retrieving data from one table any bind to ddl control
    var defaults = {
        strControlID: "",
        strTableName: "",
        strValue: "",
        strText: "",
        strSQLValue: "",
        strSQLText: "",
        strWhere: "",
        strTextDefault: "",
        strDefaultValue: "",
        IsViewSate: false,
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);
    if (options.strSQLValue == "") { options.strSQLValue = options.strValue; }
    if (options.strSQLText == "") { options.strSQLText = options.strText; }
    var strControlViewSate = "";
    if (options.IsViewSate == true) {
        try {
            if (ObjData == undefined) {
                ObjData = [];
            }
        } catch (ex) { ObjData = []; }
        try {
            if (ObjData.ArrTemp == undefined) {
                ObjData.ArrTemp = [];
            }
        } catch (ex) { ObjData.ArrTemp = []; }

        var strTempSave = options.strControlID.replace(/#/g,"")
        strTempSave = strTempSave.replace(/./g,"")
        if (eval("ObjData.ArrTemp." + strTempSave) == undefined) {
            strControlViewSate = strTempSave;
            GetDDLServerData();
        }
        else {
            $(options.strControlID).html(eval("ObjData.ArrTemp." + strTempSave));
            if (options.strDefaultValue != "") {
                $(options.strControlID).val(options.strDefaultValue);
            }
            if (options.OnSucces != undefined) {
                options.OnSucces.call(this);
            }
            if (options.OnSuccess != undefined) {
                options.OnSuccess.call(this);
            }

        }
    }
    else {
        GetDDLServerData();
    }
    function GetDDLServerData() {
        $.GetServerDataBySQL(
         {
             strTableName: options.strTableName,
             strFeildSelect: options.strSQLValue + "," + options.strSQLText,
             strWhere: options.strWhere,
             OnSuccess: function (data) {
                 var strHTML = "";
                 if (options.strTextDefault != "") {
                     strHTML = strHTML + "<option value='-1'>" + options.strTextDefault + "</option>";
                 }
                 for (i = 0; i < data.length; i++) {
                     var strValValue = "data[" + i + "]." + options.strValue;
                     var strValText = "data[" + i + "]." + options.strText;
                     strHTML = strHTML + "<option value='" + eval(strValValue) + "'>" + eval(strValText) + "</option>";
                 }
                 $(options.strControlID).html(strHTML);
                 //$(options.strControlID).select2();
                 if (options.strDefaultValue != "") {
                     $(options.strControlID).val(options.strDefaultValue);
                 }
                 if (options.IsViewSate == true) {
                     eval('ObjData.ArrTemp.' + strControlViewSate + '="' + strHTML + '"');
                 }
                 if (options.OnSucces != undefined) {
                     options.OnSucces.call(this);
                 }
                 if (options.OnSuccess != undefined) {
                     options.OnSuccess.call(this);
                 }

             }
         }
    );

    }

};

$.GetServerDataBySQL = function (options) {
    //Function of system
    var defaults = {
        strTableName: "", //From Table Name
        strFeildSelect: "", //Column select
        strWhere: "",  //only string
        parameters: "-1", //Access all type data
        IsNotCache: 0, //Access all type data
        OnSuccess: function (data, parameters) { },
        OnError: function () { }
    }
    options = $.extend(defaults, options);

    var Arr_Rtn = null

    var Arr_SQL = JSON.parse(sessionStorage.getItem('ArrSQL'))

    if(Arr_SQL && !options.IsNotCache){
        var arr = Arr_SQL.filter(function(item){ return item.strTableName == options.strTableName && item.strWhere == options.strWhere && item.strFeildSelect == options.strFeildSelect })
    
        if(arr && arr.length){
            Arr_Rtn = arr[0].arrRtn
        }
    }

    if(Arr_Rtn && Arr_Rtn.length){
        options.OnSuccess.call(this, Arr_Rtn, 0);
    }else{
        var itempost = {};
        itempost.strTableName = options.strTableName;
        itempost.strWhere = options.strWhere;
        itempost.strFeildSelect = options.strFeildSelect;
        itempost.parameters = options.parameters;
        png.post({
            url: "api/public/GetSQLDataByTableConfig",
            data: itempost,
            OnSuccess: function (data, intRow) {

                var Arr = []
                if(sessionStorage.getItem('ArrSQL')){
                    Arr = JSON.parse(sessionStorage.getItem('ArrSQL'))
                }
                var obj ={
                    strTableName:options.strTableName,
                    strWhere:options.strWhere,
                    strFeildSelect:options.strFeildSelect,
                    arrRtn: JSON.parse(data)
                }
                Arr.push(obj)
                // console.log(Arr)
                if(!options.IsNotCache)
                    sessionStorage.setItem('ArrSQL',JSON.stringify(Arr))

                options.OnSuccess.call(this, JSON.parse(data), intRow);
            }
        });
    }


}

$.GetCloseMenuLeft = function () {
    
    var body = $('body');

    if (!body.hasClass("page-sidebar-closed")){
        $('.menu-toggler.sidebar-toggler').click()
    }

}


// function fnCloseMenuLeft() {
//     var body = $('body');

//     if (!body.hasClass("page-sidebar-closed")){
//         $('.menu-toggler.sidebar-toggler').click()
//     }
// }

//Duongitvn(18/07/2019)