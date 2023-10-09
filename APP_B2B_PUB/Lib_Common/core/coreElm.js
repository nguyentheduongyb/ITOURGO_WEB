var pngElm = function () {
    var _getTable = function (options){
        var defaults = {
            arrCols: {
                default:{
                    IsColSpecial:false
                    ,strStyle: { '0': '', '1': 'background:#ffe4e4' }
                    ,name:''
                    ,IsMergeRow:false
                    ,IsFormatNumber:false
                    ,strAttrTH:''
                    ,strAttrTD:''
                    ,strColWidth:''
                }
            },
            arrTbl: [{default:''}]
        }
        options = $.extend(defaults, options)
        var strHtml = "<table class='table-default'><thead><tr>"
        Object.keys(options.arrCols).forEach(function(key){
            if(!options.arrCols[key].IsColSpecial){
                var strAttrTH = (options.arrCols[key].strAttrTH || '')
                strHtml+= "<th "+strAttrTH+">"+options.arrCols[key].name+"</th>"
            }
        });
        strHtml+= "</tr></thead>"
        if(options.arrTbl.length!=0){
            options.arrTbl.forEach(function(value,key){
                var strStyle = ''
                Object.keys(options.arrCols).forEach(function(valueCols){
                    if(options.arrCols[valueCols].IsColSpecial){
                        strStyle+=options.arrCols[valueCols].strStyle[value[valueCols]]+";"
                    }
                })
                strHtml+= "<tr row='"+key+"' style='"+strStyle+"'>"
                    Object.keys(options.arrCols).forEach(function(valueCols2){
                        var strValTD = value[valueCols2]!=null? value[valueCols2] : ""
                        if(options.arrCols[valueCols2].IsFormatNumber)
                            strValTD = $.pngFormatNumber(strValTD)

                        var strAttrTD = (options.arrCols[valueCols2].strAttrTD || '')
                        var strColWidth = (options.arrCols[valueCols2].strColWidth || '')
                        
                        if(!options.arrCols[valueCols2].IsColSpecial){
                            var intMergeRow = 0
                            if(options.arrCols[valueCols2].IsMergeRow){
                                var IsMerge = true
                                options.arrTbl.forEach(function(valueRowMerge,keyRowMerge){
                                    if(keyRowMerge>=key && IsMerge){
                                        if(value[valueCols2] == valueRowMerge[valueCols2]){
                                            intMergeRow+=1
                                        }else{
                                            IsMerge = false
                                        }
                                    }
                                });
                                if(key==0 || value[valueCols2] != options.arrTbl[key-1][valueCols2]){
                                    strHtml+= "<td"+(intMergeRow!=1?' rowspan="'+intMergeRow+'"':'')+" "+strAttrTD+"><div class='pn-"+valueCols2+"' row='"+key+"' "+(strColWidth? 'style="width:'+strColWidth+'"':'')+">"+strValTD+"</div></td>"
                                }
                            }else{
                                strHtml+= "<td "+strAttrTD+"><div class='pn-"+valueCols2+"' row='"+key+"' "+(strColWidth? 'style="width:'+strColWidth+'"':'')+">"+strValTD+"</div></td>"
                            }
                        }
                    });
                strHtml+= "</tr>"
            });
        }else{
            strHtml+= "<tr>"
                strHtml+= "<td colspan='"+ Object.keys(options.arrCols).length+"'>"+pngElm.getLangKey({langkey:'sys_Txt_NoData'})+"</td>"
            strHtml+= "</tr>"
        }
        strHtml+= "</table>"
        return strHtml
    } 


    var _getInputs = function (options){
        var defaults = {
            type:'',attr:'',class:'',classEx:''
        }
        options = $.extend(defaults, options);
        var strHtmlInput = '';
        if(options.type=='text' || options.type=='number' || options.type=='hidden' || options.type=='checkbox' || options.type=='password'){
            strHtmlInput = "<input type='"+options.type+"' class='"+options.class+" "+options.classEx+"' "+options.attr+" autocomplete='off'>"
        }else if(options.type=='select' || options.type=='textarea'){
            strHtmlInput = "<"+options.type+" class='"+options.class+" "+options.classEx+"' "+options.attr+"></"+options.type+">"
        }
        return strHtmlInput
    }


    var _getTabs = function (options){
        var defaults = {
            idOrClassPnTab:'',
            arrTab:{ 
                tab1:{name:'Tab1',isDefault:false,OnClick:function(){}}
            },
            typeTab:'pn-1',
            IsPushUrl: false,
            strQueryName:'tab'
        }
        options = $.extend(defaults, options);
        
        var classDefault = ''
        var strHtmlTab = ''
    
        Object.keys(options.arrTab).forEach(function(value_Tab){
            strHtmlTab+= '<span class="tab" tab="'+value_Tab+'">'+options.arrTab[value_Tab].name+'</span>'
        })
        $(options.idOrClassPnTab).addClass('pnTab').addClass(options.typeTab)
        $(options.idOrClassPnTab).html(strHtmlTab)
        
        Object.keys(options.arrTab).forEach(function(value_Tab){
            $(options.idOrClassPnTab + " .tab[tab=" + value_Tab + "]").click(function (evt) {
                if(options.arrTab[value_Tab].OnClick){
                    $(options.idOrClassPnTab + " .tab").removeClass("active")
                    $(this).addClass("active")
                    var objReturn = {
                        idTab:value_Tab
                    }
                    //if(!options.IsPushUrl || (options.IsPushUrl && value_Tab != $.pngGetQSVal("tab")))
                        options.arrTab[value_Tab].OnClick.call(this,objReturn,evt)

                    if(options.IsPushUrl){
                        if($.pngGetQSVal(options.strQueryName) && value_Tab != $.pngGetQSVal(options.strQueryName))
                            window.history.pushState("", "",$.pngGetQSVal(options.strQueryName,value_Tab));
                        else
                            window.history.replaceState("", "",$.pngGetQSVal(options.strQueryName,value_Tab));
                    }
                    pngElm.ChangeLanguage()
                }
            });
            if(options.arrTab[value_Tab].isDefault){
                if(options.arrTab[value_Tab].OnClick){

                    if(!options.IsPushUrl){
                        $(options.idOrClassPnTab + " .tab[tab=" + value_Tab + "]").click()
                    }
                    classDefault = value_Tab
                    
                }else{
                    $(options.idOrClassPnTab + " .tab[tab=" + value_Tab + "]").addClass("active")
                }
            }
        })
        if(options.IsPushUrl){
            if($.pngGetQSVal(options.strQueryName)){
                if(options.arrTab[$.pngGetQSVal(options.strQueryName)]){
                    classDefault = $.pngGetQSVal(options.strQueryName)
                }
            }

            $(options.idOrClassPnTab + " .tab[tab=" + classDefault + "]").click()
        }

    }


    var _CheckboxItemAndAll = function (options){
        var defaults = {
            idOrClass:'',
            idOrClassChkItem:'.CLSItem',
            idOrClassChkAll:'.CLSCheckAll',
        }
        options = $.extend(defaults, options);
        $(options.idOrClass + " "+options.idOrClassChkAll).prop('checked', ($(options.idOrClass + ' '+options.idOrClassChkItem).length && $(options.idOrClass + ' '+options.idOrClassChkItem+':checked').length == $(options.idOrClass + ' '+options.idOrClassChkItem).length));
        $(options.idOrClass + " "+options.idOrClassChkAll).change(function () {
            $(options.idOrClass + " "+options.idOrClassChkItem).prop('checked', this.checked).change();
        });
        $(options.idOrClass + " "+options.idOrClassChkItem).change(function () {
            $(options.idOrClass + " "+options.idOrClassChkAll).prop('checked', ($(options.idOrClass + ' '+options.idOrClassChkItem).length && $(options.idOrClass + ' '+options.idOrClassChkItem+':checked').length == $(options.idOrClass + ' '+options.idOrClassChkItem).length));
        });
    }



    var Obj_LangKeyCur = null
    var Obj_LangKeyDft = null

    var Obj_LangKeyDBCur = null
    var Obj_LangKeyDBDft = null

    var _getLanguageSys = function (options) {
        var defaults = {
            defaultLang:'en'
            ,mainLang:'en'
            ,OnSuccess: function(){}
        }
        options = $.extend(defaults, options);
        
        var strMainLang = options.mainLang
        var strDefaultLang = options.defaultLang

        if (!png.ArrLS.Language.get()) {
            // localStorage.setItem("LANGUAGE", defaultLang)
            png.ArrLS.Language.set(strDefaultLang)
        }
        if(!$.pngGetQSVal('lang')){
            window.history.replaceState("", "",$.pngGetQSVal('lang',png.ArrLS.Language.get()));
        }else{
            png.ArrLS.Language.set($.pngGetQSVal('lang'))
        }

        var langCode = png.ArrLS.Language.get()

        if(langCode == 'vi')
            $.fn.datepicker.defaults.language = langCode;

        var IsChangeLang = false
        if(!sessionStorage.getItem('strLangCodeOld') || sessionStorage.getItem('strLangCodeOld')!=langCode){
            IsChangeLang = true
            sessionStorage.setItem('strLangCodeOld',langCode)
        }

        if(!sessionStorage.getItem('strVerLang')){
            sessionStorage.setItem('strVerLang',coreSystem.getLinkVer(''))
        }

        if(sessionStorage.getItem('strVerLang')!=coreSystem.getLinkVer('')){
            IsChangeLang = true
        }

        if (location.host.indexOf("localhost:") >= 0)
            IsChangeLang = true

        if(!IsChangeLang && sessionStorage.getItem('Obj_LangKeyCur') && sessionStorage.getItem('Obj_LangKeyDft') && sessionStorage.getItem('Obj_LangKeyDBCur') && sessionStorage.getItem('Obj_LangKeyDBDft')){
            Obj_LangKeyCur = JSON.parse(sessionStorage.getItem('Obj_LangKeyCur'))
            Obj_LangKeyDft = JSON.parse(sessionStorage.getItem('Obj_LangKeyDft'))
            Obj_LangKeyDBCur = JSON.parse(sessionStorage.getItem('Obj_LangKeyDBCur'))
            Obj_LangKeyDBDft = JSON.parse(sessionStorage.getItem('Obj_LangKeyDBDft'))
            options.OnSuccess.call()
        }else{
            
            var objLangCommmon = null
            var objLangCustom = null
            $.getJSON(coreSystem.getLib_CommonURL('language/common/lang.' + langCode + '.json'), function (arrLangKey) {
                objLangCommmon = arrLangKey
                GetLangKey()
            });
            $.getJSON(coreSystem.getLib_CustomURL('language/lang.' + langCode + '.json'), function (arrLangKey) {
                objLangCustom = arrLangKey
                GetLangKey()
            });


            function GetLangKey(){
                if(objLangCommmon && objLangCustom){
                    Obj_LangKeyCur = $.pngExtendObj(objLangCommmon,objLangCustom)

                    if(langCode==strMainLang)
                        Obj_LangKeyDft = Obj_LangKeyCur

                    checkLangKey()
                }

            }
            
            $.getJSON(coreSystem.getLib_CommonURL('language/db-trans/lang.' + langCode + '.json'), function (arrLangKey) {
                Obj_LangKeyDBCur = arrLangKey
                if(langCode==strMainLang)
                    Obj_LangKeyDBDft = Obj_LangKeyDBCur
                checkLangKey()

            });

            if(langCode!=strMainLang){
                
                var objLangCommmon_2 = null
                var objLangCustom_2 = null
                $.getJSON(coreSystem.getLib_CommonURL('language/common/lang.' + strMainLang + '.json'), function (_brrLangKeyDft) {
                    objLangCommmon_2 = _brrLangKeyDft
                    GetMainLangKey()
                });

                $.getJSON(coreSystem.getLib_CustomURL('language/lang.' + strMainLang + '.json'), function (_brrLangKeyDft) {
                    objLangCustom_2 = _brrLangKeyDft
                    GetMainLangKey()
                });

                function GetMainLangKey(){
                    if(objLangCommmon_2 && objLangCustom_2){
                        Obj_LangKeyDft = $.pngExtendObj(objLangCommmon_2,objLangCustom_2)
                        checkLangKey()
                    }

                }

                $.getJSON(coreSystem.getLib_CommonURL('language/db-trans/lang.' + strMainLang + '.json'), function (arrLangKey) {
                    Obj_LangKeyDBDft = arrLangKey
                    checkLangKey()
                });


            }

            function checkLangKey(){
                if(Obj_LangKeyCur && Obj_LangKeyDft && Obj_LangKeyDBCur && Obj_LangKeyDBDft){
                    sessionStorage.setItem('Obj_LangKeyCur',JSON.stringify(Obj_LangKeyCur))
                    sessionStorage.setItem('Obj_LangKeyDft',JSON.stringify(Obj_LangKeyDft))
                    sessionStorage.setItem('Obj_LangKeyDBCur',JSON.stringify(Obj_LangKeyDBCur))
                    sessionStorage.setItem('Obj_LangKeyDBDft',JSON.stringify(Obj_LangKeyDBDft))
                    options.OnSuccess.call()
                }

            }

        }

    }
    
    var _ChangeLanguage = function (){

        if(Obj_LangKeyCur && Obj_LangKeyDft){
            $("[langkey]").each(function () {
                var strTr = Obj_LangKeyCur[$(this).attr('langkey')];
                if (!strTr || strTr == "undefined") {
                    strTr = Obj_LangKeyDft[$(this).attr('langkey')]
                }
                if ($(this).attr('langval')) {
                    var strLangval = $(this).attr('langval')
                    strLangval = ('['+strLangval+']').replace('[[','').replace(']]','')
                    
                    strLangval.split('],[').forEach(function(val,key){
                        strTr = (strTr || '').replace('{'+key+'}',val)
                    })
                }

                if ($(this).attr('placeholder')) {
                    $(this).attr('placeholder', strTr)
                } else {
                    $(this).html(strTr);
                }
            });
        }

    }

    var FN_TimeChangeLang = null
    var _getLangKey = function (options) {
        var defaults = {
            langkey:''
            ,arrLangVal:[]
        }
        options = $.extend(defaults, options);
        clearTimeout(FN_TimeChangeLang)
        FN_TimeChangeLang = setTimeout(function(){pngElm.ChangeLanguage()},100)
        var strTr = ''
        if(options.langkey){
            strTr = Obj_LangKeyCur[options.langkey];
            if (!strTr || strTr == "undefined") {
                strTr = Obj_LangKeyDft[options.langkey]
            }
        }
        if(options.arrLangVal || options.arrLangVal.length){
            options.arrLangVal.forEach(function(value,key){
                strTr = (strTr || '').replace('{'+key+'}',value)
            })
        }

        return strTr

    }


    var _getLangKeyDB = function (options) {
        var defaults = {
            langkey:''
        }
        options = $.extend(defaults, options);
        clearTimeout(FN_TimeChangeLang)
        FN_TimeChangeLang = setTimeout(function(){pngElm.ChangeLanguage()},100)

        var strTr = ''
        if(options.langkey){
            strTr = Obj_LangKeyDBCur[options.langkey];
            if (!strTr || strTr == "undefined") {
                strTr = Obj_LangKeyDBDft[options.langkey]
            }
        }
        
        return strTr

    }



    var Arr_ListCurrency= []
    var _getCurrencySys = function (options) {
        var defaults = {
            intCurrencyID: null
            ,OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        if(sessionStorage.getItem('Arr_ListCurrency')){

            Arr_ListCurrency = JSON.parse(sessionStorage.getItem('Arr_ListCurrency'))
        }

        if(Arr_ListCurrency.length == 0){
            var objParams ={
                strUserGUID: null
                ,intCurrencyID:options.intCurrencyID
                ,tblsReturn:'[0]'
            }
            png.post({
                url: "api/public/GetListCurrency", data: { strJson: JSON.stringify(objParams) }
                ,OnSuccess: function (data) {
                    Arr_ListCurrency = JSON.parse(data)[0]

                    sessionStorage.setItem('Arr_ListCurrency',JSON.stringify(Arr_ListCurrency))

                    options.OnSuccess.call(this,Arr_ListCurrency)
                }
            })
        }else{
            var arr = Arr_ListCurrency
            if(options.intCurrencyID){
                arr = Arr_ListCurrency.filter(function(item){ return item.intCurrencyID == options.intCurrencyID })
            }
            options.OnSuccess.call(this,arr)
        }

    }

    var _ChangeCurrency = function (options) {
        var defaults = {
            intCurrencyID:null,
            OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        var strCompanyOwnerGUID = ''
        if(png.ArrLS.CompanyFriend.get()){
            strCompanyOwnerGUID = JSON.parse(png.ArrLS.CompanyFriend.get()).strCompanyGUID
        }else{
            strCompanyOwnerGUID = JSON.parse(png.ArrLS.UserDetail.get()).strCompanyGUID
        }
        var objParams ={
            strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID
            ,strCompanyOwnerGUID: strCompanyOwnerGUID
            ,intCurrencyID: options.intCurrencyID

            ,intCurPage:null
            ,intPageSize:null
            ,strOrder:null
            ,tblsReturn: '[0]'
        }
        png.post({
            url: "api/user/GetListCompanyCurrencyByPtn", data: { strJson: JSON.stringify(objParams) }
            ,OnSuccess: function (data) {
                var arrTbl_0 = JSON.parse(data)[0]
                options.OnSuccess.call(this,arrTbl_0)
            }
        })
    }
    
    var _ChangeCompanyOwner = function (options) {
        var defaults = {
            intSizeValue:1,
            strCompanyOwnerGUID: null,
            strOrder:null,
            strFilterCompanyName:null,
            OnSuccess: function(){}
        }
        options = $.extend(defaults, options);
        var objParams ={
            strUserPartnerGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID
            ,strCompanyPartnerGUID:JSON.parse(png.ArrLS.UserDetail.get()).strCompanyGUID
            ,strCompanyOwnerGUID:options.strCompanyOwnerGUID
            ,intCurPage:1
            ,intPageSize:options.intSizeValue
            ,strOrder:options.strOrder
            ,strFilterCompanyName: options.strFilterCompanyName
            ,IsOwnerFriend:1
            ,tblsReturn:'[0]'
        }

        png.post({
            url: "api/user/GetListCompanyOwner", data: {strJson : JSON.stringify(objParams)}
            ,OnSuccess: function (data) {
                var arrTbl_0 = JSON.parse(data)[0]
                options.OnSuccess.call(this,arrTbl_0)
                
            }
        })
    }


    var _getAgeType = function (options) {
        var defaults = {
            idOrClass:'',
            intNoAdult:1,
            intNoRoom:1,
            objNoOfRoom:{'sgl':0,'dbl':1,'twn':0,'tpl':0},
            IsViewDblRoom: false,
            arrChildren:[],
            OnSuccess: function(){}
        }
        var ObjNoOfRoom = JSON.parse(JSON.stringify(defaults.objNoOfRoom))
        options = $.extend(defaults, options);

        ObjNoOfRoom = $.pngExtendObj(ObjNoOfRoom,options.objNoOfRoom)

        if(options.intNoRoom !=null){

            options.intNoRoom = 0
            Object.keys(ObjNoOfRoom).forEach(function(value){
                options.intNoRoom+=ObjNoOfRoom[value]
            })
        }


        var arrChildren = options.arrChildren

        var ArrNoOfCus={}

        if(options.intNoRoom !=null)
            ArrNoOfCus['room'] = { langkey:'sys_Txt_Hd_Room',isHas:true,value:options.intNoRoom}
        ArrNoOfCus['adult'] = { langkey:'sys_Txt_Hd_Adt',isHas:true,value:options.intNoAdult}

        var strHtmlCus=''
        Object.keys(ArrNoOfCus).forEach(function(value){
            
            if(value == "adult"){
                strHtmlCus +='<li style="display: inline-flex;padding-bottom: 10px;"> '
                strHtmlCus +='    <b style="width: 160px;"><b langkey="'+ArrNoOfCus[value].langkey+'"></b>: </b>'
           
                strHtmlCus +='    <a class="exp '+value+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">-</a> '
                strHtmlCus +='    <div style="width: 40px;text-align: center">'
                strHtmlCus +='     <span class="cus-no-'+value+'">'
                if (ArrNoOfCus[value].isHas)
                    strHtmlCus +='         1'
                else
                    strHtmlCus +='         0'
                strHtmlCus +='     </span> '
                strHtmlCus +='    </div> '
                strHtmlCus +='    <a class="add '+value+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">+</a> '
                strHtmlCus +='</li>'
            }

            if(value == "room"){

                if(options.IsViewDblRoom){
                    var valueNoOfRoom = 'dbl'
                        strHtmlCus +='<li style="display: inline-flex;padding-bottom: 10px;"> '
                        strHtmlCus +='    <b style="width: 160px;"><b langkey="'+ArrNoOfCus[value].langkey+'"></b>: </b>'
                
                        strHtmlCus +='    <a class="exp room_'+valueNoOfRoom+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">-</a> '
                        strHtmlCus +='    <div style="width: 40px;text-align: center">'
                        strHtmlCus +='     <span class="cus-no-room_'+valueNoOfRoom+'">'
                            strHtmlCus +='         1'
                        strHtmlCus +='     </span> '
                        strHtmlCus +='    </div> '
                        strHtmlCus +='    <a class="add room_'+valueNoOfRoom+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">+</a> '
                        strHtmlCus +='</li>'
                }else{
                    var idRoom = Math.random().toString(36).substring(4).toUpperCase()
                    strHtmlCus +='<li style="padding-bottom: 10px;"> '

                    strHtmlCus +='    <b langkey="'+ArrNoOfCus[value].langkey+'" style="width: 160px;"></b>:'
                    strHtmlCus +='      <a data-toggle="collapse" href="#pnFilterForm'+idRoom+'" aria-expanded="false" class="collapsed" style=" float: right;">'
                    strHtmlCus +='          <span id="NoOfRoomsType"></span>'
                    strHtmlCus +='          <i class="fa fa-angle-down" style="float: right;  margin-left: 5px;  line-height: 20px;"></i>'
                    strHtmlCus +='      </a>'
                    strHtmlCus +='      <div id="pnFilterForm'+idRoom+'" class="panel-collapse panel panel-default collapse" aria-expanded="false" style="padding: 10px 10px 0;margin:0">  '
                    
                    Object.keys(ObjNoOfRoom).forEach(function(valueNoOfRoom){

                        strHtmlCus +='          <div style="display: inline-flex;padding-bottom: 10px;">'
                        strHtmlCus +='              <b langkey="'+ArrNoOfCus[value].langkey+'_'+valueNoOfRoom+'" style="width: 150px;">'+valueNoOfRoom.toUpperCase()+' Room(s)</b>    '
                        strHtmlCus +='              <a class="exp room_'+valueNoOfRoom+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">-</a>     '
                        strHtmlCus +='              <div style="width: 40px;text-align: center"><span class="cus-no-room_'+valueNoOfRoom+'">0</span></div>'
                        strHtmlCus +='              <a class="add room_'+valueNoOfRoom+'" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">+</a>'
                        strHtmlCus +='          </div> '
                    })
                    strHtmlCus +='      </div> '
                    strHtmlCus +='</li>'
                }
            }


        });
        
        strHtmlCus +='<li style="display: inline-flex;"> '
            strHtmlCus +='<b style="width: 160px;"><b langkey="sys_Txt_Hd_Kid"></b>: </b>'
            strHtmlCus +='<a class="exp intKid" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">-</a> '
                strHtmlCus +='    <div style="width: 40px;text-align: center">'
                strHtmlCus +='     <span class="no-kid">0</span>'
                strHtmlCus +='    </div> '
            strHtmlCus +='<a class="add intKid" style="padding: 0 10px;display: inline-block;background: #d8d8d8; cursor: pointer;">+</a>'
            // strHtmlCus +='<a class="btn btn-primary" id="btnAddChildren" style="float:right"><i class="fa fa-plus"></i> <span langkey="sys_Txt_Hd_btnAddKid"></span></a>'
        strHtmlCus +='</li>'
        strHtmlCus +='<div id="pnChildren"><div>'
        $(options.idOrClass).html(strHtmlCus)

        Object.keys(ObjNoOfRoom).forEach(function(valueNoOfRoom){
            
            GetValueNoOfRoomType(valueNoOfRoom,ObjNoOfRoom[valueNoOfRoom])
            $(options.idOrClass+" .add.room_"+valueNoOfRoom).click(function(){
                ObjNoOfRoom[valueNoOfRoom] += 1
                
                GetValueNoOfRoomType(valueNoOfRoom,ObjNoOfRoom[valueNoOfRoom])
                OnSuccess()
            }); 
            $(options.idOrClass+" .exp.room_"+valueNoOfRoom).click(function(){
                if(ObjNoOfRoom[valueNoOfRoom] > 0){
                    ObjNoOfRoom[valueNoOfRoom] -= 1
                    GetValueNoOfRoomType(valueNoOfRoom,ObjNoOfRoom[valueNoOfRoom])
                    OnSuccess()
                }
                
            });

        })
        function GetValueNoOfRoomType(roomtype,value){
            $(options.idOrClass+" .cus-no-room_"+roomtype).text(value)
            var strNoOfRoomsType = ''
            Object.keys(ObjNoOfRoom).forEach(function(valueNoOfRoom){
                if(ObjNoOfRoom[valueNoOfRoom])
                    strNoOfRoomsType+= valueNoOfRoom.toUpperCase()+':'+ObjNoOfRoom[valueNoOfRoom]+';'
            })
            $('#NoOfRoomsType',options.idOrClass).html(strNoOfRoomsType)
        }


        Object.keys(ArrNoOfCus).forEach(function(value){
            $(options.idOrClass+" .cus-no-"+value+"").text(ArrNoOfCus[value]['value'])
        });

        // $('#ddlAgeType').attr('aria-expanded', true)

        Object.keys(ArrNoOfCus).forEach(function(value){
            $(options.idOrClass+" .add."+value).click(function(){
                $(options.idOrClass+" .cus-no-"+value).text($(options.idOrClass+" .cus-no-"+value).text().getNumber()+1)
                OnSuccess()
            }); 
            $(options.idOrClass+" .exp."+value).click(function(){
                if (ArrNoOfCus[value].isHas){
                    if($(options.idOrClass+" .cus-no-"+value).text().getNumber() - 1 >= 1)
                        $(options.idOrClass+" .cus-no-"+value).text($(options.idOrClass+" .cus-no-"+value).text().getNumber()-1)
                }
                else{
                    if($(options.idOrClass+" .cus-no-"+value).text().getNumber() - 1 >= 0)
                        $(options.idOrClass+" .cus-no-"+value).text($(options.idOrClass+" .cus-no-"+value).text().getNumber()-1)
                }
                OnSuccess()
            });
        })

        var intMinChildAge = 0
        var intMaxChildAge = 0

        png.postListApiGetValue({
            objList_ComboValue: {
                Arr_ChildAge:{
                    strTableName:'MC86'
                    ,strFeildSelect:'MIN(MC86_ChildAge) AS intMinChildAge,MAX(MC86_ChildAge) AS intMaxChildAge'
                    ,strWhere:'WHERE IsActive = 1'
                    ,IsNotCache: 0
                }
            }
            ,objListComboValue_RtnVal: {
                'Arr_ChildAge':{
                    objParams_Cus:{}, OnSuccess: function(data){ 
                        var obj = data[0]
    
                        intMinChildAge = obj.intMinChildAge
                        intMaxChildAge = obj.intMaxChildAge
                        
                        GetListChildren(arrChildren)
                    
                    }
                }
            }
        })
        // $(options.idOrClass+' #btnDelHtml').on('click',function(){
        //     $(options.idOrClass+' #pnChildren').html("")
        // })
        
        $(options.idOrClass+' .add.intKid').click(function(){
            
            arrChildren[arrChildren.length] = '9'
            GetListChildren(arrChildren,arrChildren.length-1)

        })
        $(options.idOrClass+' .exp.intKid').click(function(){

            $(options.idOrClass+' .btnRemoveChildren_'+(arrChildren.length-1)).click()
            
        })
        //options.OnSuccess.call(this,$(options.idOrClass+" .cus-no-adult").text().getNumber(),arrChildren)
        function GetListChildren(arrParChildren,intParKey){
            // $(options.idOrClass+' #btnDelHtml').on('click')
            // options.OnSuccess.call(this,$(options.idOrClass+" .cus-no-adult").text().getNumber(),arrChildren)\
            
            $(options.idOrClass+" .no-kid").text(arrChildren.length)

            var strHtmlMain = ''
            
            arrParChildren.forEach(function(val,key){
                var strHtml='<div style="border-bottom: 1px solid #f3f3f3;padding-top: 15px;"><a class="btn btn-link btnRemoveChildren_'+key+'" data="'+key+'"><i class="fa fa-times"></i></a><b><span langkey="sys_Txt_Hd_Kid_Item"></span> '+(key+1)+':</b> <span class="ViewNumberAge_'+key+'"></span> <span langkey="sys_Txt-YsO"></span><div class="AgeRange_'+key+'"></div></div>'
                
                if(intParKey){
                    if(intParKey == key)
                    strHtmlMain=strHtml
                }else
                    strHtmlMain+=strHtml
                

            })
            $('#pnChildren',options.idOrClass).append(strHtmlMain)
            arrParChildren.forEach(function(val,key){
                var keyVal = null
                if(intParKey){
                    if(intParKey == key)
                        keyVal=key
                }else
                    keyVal=key
                    
                if(keyVal!=null){
                    pngPn.getForm({
                        objInput:{
                            strAgeRange:{title:'',attr:'class="col-md-12"',isRequire:false
                                ,inputRange:{step: 1,min:intMinChildAge,max:intMaxChildAge,value:arrParChildren[keyVal],format:''}
                            }
                        },
                        idOrClass:options.idOrClass+' .AgeRange_'+keyVal
                    })
                    $('.ViewNumberAge_'+keyVal).text($(options.idOrClass+' .AgeRange_'+keyVal+' .input-range').val())

                    $(options.idOrClass+' .AgeRange_'+keyVal+' .input-range').change(function(){
                        var valAge= this.value
                        if(this.value ==0)
                            valAge = '< 1'

                        $('.ViewNumberAge_'+keyVal).text(valAge)
                        arrParChildren[keyVal] = this.value

                        OnSuccess()
                    })

                    $(' .btnRemoveChildren_'+keyVal,options.idOrClass).click(function(e){
                        e.stopPropagation();
                        $('#pnChildren',options.idOrClass).html("")
                        // $(options.idOrClass+' #btnAddChildren').click()
                        
                        var data = $(this).attr('data')
                        if(arrChildren.length!=1){
                            arrChildren.splice(data, 1); 
                        }
                        else
                            arrChildren=[];

                        GetListChildren(arrChildren)
                    })
                }
            })

            OnSuccess()
        }
        function OnSuccess(){
            options.OnSuccess.call(this,$(options.idOrClass+" .cus-no-adult").text().getNumber(),arrChildren,ObjNoOfRoom)
        }

    }

    var _getCaptcha = function (options) {
        var defaults = {
            strValCaptcha:'',
            strUrlImg:'https://pixelsharing.files.wordpress.com/2010/11/salvage-tileable-and-seamless-pattern.jpg',
            idCaptcha:'Default',
            idOrClassPn:'.default',
            OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        if(!options.strValCaptcha){
            var cd;
            var strHtml=""
            strHtml+='<div id="CaptchaImageCode-'+options.idCaptcha+'"></div>'
            strHtml+='<button id="ReloadCaptcha-'+options.idCaptcha+'" class="btn" style="position: absolute;top: 0;border-radius: 0;"><i style="margin:0" class="fa fa-refresh"></i></button>'
            strHtml+='<input type="text" id="InputCaptcha-'+options.idCaptcha+'" class="form-control" langkey="sys_Txt-phdEntCap" placeholder="Enter Captcha">'
            $(options.idOrClassPn).html(strHtml)

            CreateCaptcha()
            $(options.idOrClassPn+" #ReloadCaptcha-"+options.idCaptcha).click(function(){
                CreateCaptcha()
            })
        }else{
            return ValidateCaptcha() 
        }
        
        function ValidateCaptcha() {
            var IsCheck = true

            var string1 = options.strValCaptcha;
            var string2 = $('#InputCaptcha-'+options.idCaptcha).val();

            var strConfirm = ''

            if(!string2) {
                IsCheck = false
                strConfirm = 'Please enter code given above in a picture.';
                $('#InputCaptcha-'+options.idCaptcha).focus();
            } 
            else {
                if (string1 != string2){
                    IsCheck = false
                    strConfirm = 'Invalid Captcha! Please try again.';
                    $('#ReloadCaptcha-'+options.idCaptcha).click()
                    $('#InputCaptcha-'+options.idCaptcha).focus().select();
                }
            }  
            
            $('#InputCaptcha-'+options.idCaptcha).parent().removeClass('has-error')
            $('#InputCaptcha-'+options.idCaptcha).parent().find('small.validate').remove()

            if(!IsCheck){
                $('#InputCaptcha-'+options.idCaptcha).parent().addClass('has-error')
                $('#InputCaptcha-'+options.idCaptcha).parent().append('<small class="validate text-danger" style="position: absolute;">'+strConfirm+'</small>')
            }
              
            return IsCheck;
              
        }

        function CreateCaptcha() {
            //$('#InvalidCapthcaError').hide();
            var alpha = [];
                   
            for (var i = 0; i < 26; i++) {
                alpha.push(String.fromCharCode('A'.charCodeAt(0) + i))
            }
            for (var i = 0; i < 10; i++) {
                alpha.push(String.fromCharCode('0'.charCodeAt(0) + i))
            }

            var cd = ''
            for (var i = 0; i < 6; i++) {
              cd+= (i==0? '' : ' ') + alpha[Math.floor(Math.random() * alpha.length)]
            }

            $(options.idOrClassPn+" #CaptchaImageCode-"+options.idCaptcha).empty().append('<canvas id="CapCode-'+options.idCaptcha+'" class="capcode" width="300" height="80"></canvas>')
            
            var c = document.getElementById("CapCode-"+options.idCaptcha),
                ctx=c.getContext("2d"),
                x = c.width / 2,
                img = new Image();
          
            img.src = options.strUrlImg;
            img.onload = function () {
                var pattern = ctx.createPattern(img, "repeat");
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.font="46px Roboto Slab";
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.setTransform (1, -0.12, 0, 1, 0, 15);
                ctx.fillText(cd,x,55);
            };

            options.OnSuccess.call(this,removeSpaces(cd))
        }

          
        // Remove Spaces
        function removeSpaces(string) {
            return string.split(' ').join('');
        }


    }


    var FN_StopLoading = null
    var _getLoading = function (options) {
        var defaults = {
            IsLoading:true
        }
        options = $.extend(defaults, options);
        clearTimeout(FN_StopLoading)
        if(options.IsLoading){
            if(!$('body #pnLoading')[0])
                $('body').append('<div id="pnLoading"><div class="iconload"></div></div>')
        }else{

            FN_StopLoading = setTimeout(function(){
                $('body>#pnLoading').remove()
            },400)

        }
    }

    var _ChangeSttInput = function (options) {
        var defaults = {
            idOrClassInput:'',
            strConfirm:'',
            IsHasStt: false
        }
        options = $.extend(defaults, options);

        if(options.IsHasStt){
            $(options.idOrClassInput).parent().addClass('has-error').css('position','relative')
            $(options.idOrClassInput).parent().find('label').addClass('text-danger')
            $(options.idOrClassInput).parent().append('<small class="validate text-danger" style="position: absolute; display: block;background: #b30300;  color: #fff;  z-index: 1;  padding: 3px;  border-radius: 5px;"><span class="close-confirm" style="float: right;padding: 0 3px;cursor: pointer;"><i class="fa fa-times"></i></span>'+options.strConfirm+'</small>')
            
            $(options.idOrClassInput).parent().find('.close-confirm').click(function(){
                $(this).parent('small.validate').remove()
            })
            
        }else{
            $(options.idOrClassInput).parent().removeClass('has-error')
            $(options.idOrClassInput).parent().find('label').removeClass('text-danger')
            $(options.idOrClassInput).parent().find('small.validate').remove()
        }

    }

    var _ViewNotifyCnt = function (options) {
        var defaults = {
            respond:{},
            arrCustomNof:[{0:"Connect Fail!"}],
            strURL: '',
            objParams: '',
        }
        defaults['arrCustomNof'] = null
        options = $.extend(defaults, options);

        var Res = options.respond.status

        var Is_TMS = (window.location.href.indexOf(png.ObjClnUrl.APPTMS) >= 0)
        var Obj_UserDetail = JSON.parse(png.ArrLS.UserDetail.get())

        var ObjList_Api = {
            AddErrorID:{
                strApiLink:'api/public/AddErrorID'
                ,objParams:{
                    strUserGUID: (Obj_UserDetail? Obj_UserDetail.strUserGUID : null )
                    ,strStackTrace: options.respond.responseJSON.StackTrace
                    ,strMachineName: window.navigator.userAgent
                    ,strURL: window.location.href
                    ,strExceptionMessage: options.respond.responseJSON.ExceptionMessage
                    ,strJsonParam: JSON.stringify(options.objParams)
                    ,strBrowserName :  pngElm.getDtlBrowser().name + ' - v' + pngElm.getDtlBrowser().version
                    ,strIPNet: null
                    ,strLoginName: (Obj_UserDetail? Obj_UserDetail.strFullName + '('+Obj_UserDetail.strEmail+' - '+Obj_UserDetail.strMobile+')' : null )
                    ,strCompanyName: (Obj_UserDetail? Obj_UserDetail.strCompanyName : null )
                    ,strURLAPI: options.strURL
                    ,IsB2B: !Is_TMS
                    ,strRemark: null
                }
            },
            GetInfoIP: {
                strApiLink:'api/public/GetInfoIP'
                ,objParams:{}
            },
        }

        var ArrListNof = [
            {0:"Connection Error!"},{400:"The server cannot or will not process the request due to an apparent client error!"}
            ,{401:"Authentication is required and has failed or has not yet been provided!"}
            ,{404:"404 Not Found!"}
            ,{500:"Internal Server Error!"}
        ]

        if(options.arrCustomNof)
            options.arrCustomNof.forEach(function(val){
                var IsCusErr = true
                ArrListNof.forEach(function(val2){
                    if(Object.keys(val)[0]==Object.keys(val2)[0]){
                        val2[Object.keys(val2)] = val[Object.keys(val)]
                        IsCusErr = false
                    }

                })
                if(IsCusErr)
                    ArrListNof.push(val)
            })

        var strContentNof = ""
        ArrListNof.forEach(function(val){
            if(Res==Object.keys(val)[0]){
                strContentNof = val[Object.keys(val)]
            }
        })
        if(Res!=500)
            $.Confirm({ strContent: strContentNof });
        else{
            
            png.postListApiGetValue({
                objList_Api: ObjList_Api
                ,objListApi_RtnVal: {
                    'GetInfoIP':{
                        objParams_Cus: {}
                        , OnSuccess: function(data){ 
                            var obj = JSON.parse(data)

                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                ,objListApi_RtnVal: {
                                    'AddErrorID':{
                                        objParams_Cus:{
                                            strIPNet: obj.query
                                        }, OnSuccess: function(data){ }
                                    }
                                }
                                ,OnSuccessList:function(data){
                                    PopUp_ViewSupport()
                                }
                            })
                        }
                    }
                }
            })
        }


        function PopUp_ViewSupport(_Opt) {
            var Dft = {
                OnSuccess: function () {}
            }
            _Opt = $.extend(Dft, _Opt);
    
            var IdOrClass_Main = ''
    
    
            var Obj_FN_Main = {}
            pngPn.getPopUp({
                strTitle: 'Thông báo'
                , intTypeSize:1
                , OnPanel: PopUp_GetList
                , OnClosePopUp: function () {
    
                }
            })
    
            function PopUp_GetList(_IdOrClassPp,_OnClosePp){
                
                IdOrClass_Main = _IdOrClassPp
                Obj_FN_Main.OnClosePp = _OnClosePp

                var strHtml = ''
                strHtml+= '<h3 class="pn-margin-b-15">Đường truyền kết nối với hệ thống đang gặp sự cố.</h3>'
                strHtml+= '<p>Bạn hãy gửi liên hệ với bộ phận kỹ thuật để được hỗ trợ sớm nhất và nhanh nhất.</p>'
                strHtml+= '<div class="pnContent"></div>'
    
                $(IdOrClass_Main).html(strHtml)
                pngPn.getSupport({idOrClass:IdOrClass_Main+' .pnContent'})
            }
    
    
        }
    }

    var _ComboboxesDes = function (options) {
        var defaults = {
            idOrClassPn:''
            , action:1
            , strDataInput:''
            , OnRtn: function(){}
        }
        options = $.extend(defaults, options);


        if(options.action==1){
            $(options.idOrClassPn).append(pngElm.getInputs({type:'text',class:'txtCountry',classEx:'',attr:'placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_DdlSelectVal-Country'})+'" style="width:33%"'}))
            $(options.idOrClassPn).append(pngElm.getInputs({type:'text',class:'txtRegion',classEx:'',attr:'placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_DdlSelectVal-Reg'})+'" style="width:33%"'}))
            $(options.idOrClassPn).append(pngElm.getInputs({type:'text',class:'txtCity',classEx:'class="form-control"',attr:'placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_DdlSelectVal-Des'})+'" style="width:34%"'}))

            var strDataInput = options.strDataInput

            var listCountry = []
            var listRegion = []
            var listCity = []
            $.GetServerDataBySQL({
                strTableName: "MC02"
                ,strFeildSelect: "MC02_CountryCode AS strCountryCode,MC02_CountryName AS strCountryName"
                ,strWhere: "WHERE IsActive=1 ORDER BY MC02_CountryName"
                ,OnSuccess: function (data) {
                    data.forEach(function(value,key) {
                        listCountry.push({id: value.strCountryCode, text: value.strCountryName})
                    });

                    $(options.idOrClassPn+' .txtCountry').select2({
                        data: listCountry,
                        allowClear: true
                    });
                    $(options.idOrClassPn+' .txtRegion').select2({
                        data: [{id:1,text:' '}],
                        allowClear: true
                    }).select2("enable", false);
                    $(options.idOrClassPn+' .txtCity').select2({
                        data: [{id:1,text:' '}],
                        allowClear: true
                    }).select2("enable", false);


                    $(options.idOrClassPn+' .txtCountry').change(function () {
                        

                        if (this.value) {
                            $.GetServerDataBySQL({
                                strTableName: "MC03"
                                ,strFeildSelect: "MC03_RegionCode AS strRegionCode,MC03_RegionName AS strRegionName"
                                ,strWhere: "WHERE IsActive=1 AND MC03_RegionCode LIKE'%" + this.value + "%' AND MC03.IsActive=1 ORDER BY MC03_RegionName"
                                ,OnSuccess: function (data) {
                                    listRegion=[]
                                    data.forEach(function(value,key) {
                                        listRegion.push({id: value.strRegionCode, text: value.strRegionName})
                                    });
                                    $(options.idOrClassPn+' .txtRegion').select2('val',null).select2("enable", true);
                                    $(options.idOrClassPn+' .txtRegion').select2({
                                        data: listRegion,
                                        allowClear: true
                                    });
                                    setTimeout(function(){
                                        if(strDataInput && strDataInput.length>2)
                                            $(options.idOrClassPn+' .txtRegion').val(strDataInput.substr(0, 4)).change()
                                    })

                                }
                            })
                        }
                        else {
                            $(options.idOrClassPn+' .txtRegion').select2('val',null).select2("enable", false)
                        }
                        $(options.idOrClassPn+' .txtCity').select2('val',null).select2("enable", false)
                    });
                    
                    if(strDataInput){
                        $(options.idOrClassPn+' .txtCountry').select2('val',strDataInput.substr(0, 2)).change()
                    }

                    $(options.idOrClassPn+' .txtRegion').change(function () {
                        if (this.value) {
                            $.GetServerDataBySQL({
                                strTableName: "MC04"
                                ,strFeildSelect: "MC04_CityCode AS strCityCode,MC04_CityName AS strCityName"
                                ,strWhere: "WHERE IsActive=1 AND MC04_CityCode LIKE'%" + this.value + "%' AND MC04.IsActive=1 ORDER BY MC04_CityName"
                                ,OnSuccess: function (data) {
                                    listCity=[]
                                    data.forEach(function(value,key) {
                                        listCity.push({id: value.strCityCode, text: value.strCityName})
                                    });
                                    $(options.idOrClassPn+' .txtCity').select2('val',null).select2("enable", true);
                                    $(options.idOrClassPn+' .txtCity').select2({
                                        data: listCity,
                                        allowClear: true
                                    });

                                    
                                    if(strDataInput && strDataInput.length>4){
                                        $(options.idOrClassPn+' .txtCity').select2('val',strDataInput)
                                    }
                                    
                                    setTimeout(function(){
                                        strDataInput = ''
                                    })
                                }
                            })
                        }
                        else {
                            $(options.idOrClassPn+' .txtCity').select2('val',null).select2("enable", false)
                        }
                    })
                    // if(options.strDataInput)
                    //     options.strDataInput = ''

                }
            })

        }
        if(options.action==2){
            var strRtn = ''

            if($(options.idOrClassPn+' .txtCity').select2('val'))
                strRtn = $(options.idOrClassPn+' .txtCity').select2('val')
            else if($(options.idOrClassPn+' .txtRegion').select2('val'))
                strRtn = $(options.idOrClassPn+' .txtRegion').select2('val')
            else if($(options.idOrClassPn+' .txtCountry').select2('val'))
                strRtn = $(options.idOrClassPn+' .txtCountry').select2('val')

            options.OnRtn.call(this,strRtn)
        }

    }

    var _getDtlBrowser = function (options) {
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|coc_coc_browser|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            M[1] = "Internet Explorer";
            M[2] = tem[1];
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) {
                M[1] = tem[1].replace('OPR', 'Opera'); 
                M[2] = tem[2]; 
            }
            else M[1] = "Chrome";
            
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        
        var firefox = /firefox/.test(navigator.userAgent.toLowerCase()) && !/webkit    /.test(navigator.userAgent.toLowerCase());
        var webkit  = /webkit/.test(navigator.userAgent.toLowerCase());
        var opera   = /opera/.test(navigator.userAgent.toLowerCase());
        var msie    = /msie/.test(navigator.userAgent.toLowerCase())||/msie (\d+\.\d+);/.test(navigator.userAgent.toLowerCase())||/trident.*rv[ :]*(\d+\.\d+)/.test(navigator.userAgent.toLowerCase());
        var prefix  = msie?"":(webkit?'-webkit-':(firefox?'-moz-':''));
        
        return {name: M[0], version: M[1], firefox: firefox, opera: opera, msie: msie, chrome: webkit, prefix: prefix};
    }


    return {
        getTable            : function (options){return _getTable(options)}
        ,getInputs          : function (options){return _getInputs(options)}
        ,getTabs            : function (options){_getTabs(options)}
        ,CheckboxItemAndAll : function (options){_CheckboxItemAndAll(options)}
        ,ChangeLanguage     : function (){_ChangeLanguage()}
        ,ChangeCompanyOwner : function (options){_ChangeCompanyOwner(options)}
        ,ChangeCurrency     : function (options){_ChangeCurrency(options)}
        ,getAgeType         : function (options){return _getAgeType(options)}
        ,getCaptcha         : function (options){return _getCaptcha(options)}
        ,getLoading         : function (options){return _getLoading(options)}
        ,ChangeSttInput     : function (options){return _ChangeSttInput(options)}
        ,ViewNotifyCnt      : function (options){_ViewNotifyCnt(options)}
        ,ComboboxesDes      : function (options){_ComboboxesDes(options)}
        ,getLangKey         : function (options){return _getLangKey(options)}
        ,getLangKeyDB       : function (options){return _getLangKeyDB(options)}
        ,getCurrencySys       : function (options){return _getCurrencySys(options)}
        ,getLanguageSys       : function (options){return _getLanguageSys(options)}
        ,getDtlBrowser       : function (options){return _getDtlBrowser(options)}
    }
}();