//Copyright by PNGSOFT CORP. 2007-2018.
//File: APP\front-end\main-page\tour\main-lead.js
//Created:	MrHieu
//Edit:
//Description:


$.ModuleLayouts_Searchbar_GetValue = function(objCustom){
    
    var ObjSearchDtl = {}

    var ObjSearchDtl_ItemDft = {
        objDestination: null
        , dtmDateStart: null
        , dtmDateValidFrom: null
        , dtmDateValidTo: null
        , intNoAdult: 1
        , arrChildren: []
        , objNoOfRoom: {'sgl':0,'dbl':1,'twn':0,'tpl':0}
        , intCateID: null
    }

    if(!png.ArrLS.SearchDetail.get() || !JSON.parse(png.ArrLS.SearchDetail.get())['tour']) {
        if(png.ArrLS.SearchDetail.get())
            ObjSearchDtl = JSON.parse(png.ArrLS.SearchDetail.get())
        ObjSearchDtl['tour'] = ObjSearchDtl_ItemDft
        png.ArrLS.SearchDetail.set(JSON.stringify(ObjSearchDtl))
    }

    ObjSearchDtl = JSON.parse(png.ArrLS.SearchDetail.get())

    ObjSearchDtl['tour'] = $.pngReplaceObj(ObjSearchDtl_ItemDft,ObjSearchDtl['tour'])

    var ObjSearchDtl_Item  = ObjSearchDtl['tour']

    if(objCustom){
        Object.keys(objCustom).forEach(function (valCol) {
            if (typeof ObjSearchDtl_Item[valCol] != 'undefined')
                ObjSearchDtl_Item[valCol] = objCustom[valCol]
        })
        png.ArrLS.SearchDetail.set(JSON.stringify(ObjSearchDtl))
    }
    return ObjSearchDtl_Item

}
$.ModuleLayouts_Searchbar_GetValue()


$.ModuleLayouts_Searchbar = function (options) {
    var defaults = {
        idOrClass: '',
        IsHome:false,
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var idOrClass = options.idOrClass

    var ObjList_Api = {
        GetListCateByCompanyGUID:{
            strApiLink:'api/public/tour/GetListCateByCompanyGUID'
            ,objParams:{
                strCompanyGUID: null
                , strUserGUID: '47ecbd6d-897a-4a41-a061-95d5d3b166b6'
            }
        }
        , GetListDestinationForTourByPUB:{
            strApiLink:'api/public/traveller/GetListDestinationForTourByPUB'
            ,objParams:{
                strUserGUID: '47ecbd6d-897a-4a41-a061-95d5d3b166b6'
                ,strCompanyPartnerGUID: 'e824fd66-a3ca-46f4-a1be-ab7a0d1f6137'
                ,strCompanyOwnerGUID: null
                ,intCateID: null
                ,strFilterDestinationName: null
                ,intCurPage:1
                ,intPageSize:10
                ,strOrder:null
                ,tblsReturn:'[0]'
            }
        }
    }

    var Arr_Cate = []
    var Obj_FormInput = {}

    var Str_BackgroundCode=''

    var strHtmlCnt = ''
    if(options.IsHome){
        Str_BackgroundCode = '#FFF'
    }
    else
        Str_BackgroundCode = '#F5F7F8'

        strHtmlCnt += '<div style="background: '+Str_BackgroundCode+'">'
        strHtmlCnt += '     <div class="pn-padding-l-r-15 navbar" style="width:100%;display: flex;"> '
        if ($(window).width() >= 1024){
            if(!options.IsHome){
                var strUrlBack = '/tour'//coreLoadPage.getUrlHost()
                //strUrlBack = $.pngGetQSVal('cname', $.pngGetQSVal('cname'),strUrlBack)
                //strUrlBack = $.pngGetQSVal('menuid', $.pngGetQSVal('menuid'),strUrlBack)
                
                strHtmlCnt +='<a href="'+strUrlBack+'" style="padding: 12px;float: left; margin-top: 3px;font-size: 30px;"><i class="fa fa-arrow-left"></i></a>'
            }else{
                //strHtmlCnt += '<div style="float:left"><h1 class="pn-margin-t-b-15">Tour</h1></div>'
            }

            
            strHtmlCnt +='<div id="Searchbar" class="navbar-item" style="display:inline-flex;background:#FFF;border-radius: 10em;margin: 20px 0;box-shadow: 0px 0px 18px -12px;margin-left:15px"></div>'
            

            strHtmlCnt += '<div id="pnCart" style="float:right;margin-top:20px;"></div>'
        }else{

            if (!options.IsHome) {
                var strUrlBack = '/tour'//coreLoadPage.getUrlHost()
                //strUrlBack = $.pngGetQSVal('cname', $.pngGetQSVal('cname'),strUrlBack)
                //strUrlBack = $.pngGetQSVal('menuid', $.pngGetQSVal('menuid'),strUrlBack)
                
                strHtmlCnt +='<a href="'+strUrlBack+'" style="display:flex; align-items: center; margin-right: 10px;font-size: 30px;"><i class="fa fa-arrow-left"></i></a>'
            }else{
                // strHtmlCnt += '<div style="float:left"><h1 class="pn-margin-t-b-15" style="font-size:20px">Tour</h1></div>'
            }


            strHtmlCnt +='<span id="btnViewSrc" style="margin: 7px 0px;position: relative;padding: 0 10px;border: 1px solid #949494;border-radius: 1em;display: flex;justify-content: space-between;width: 100%;">'
            strHtmlCnt +='   <span class="pnFormShort" style="font-size: 16px;display: inline-block; margin-top: 5px;"></span>'
            strHtmlCnt +='    <a class="searchbar" style="color:#383838;font-size: 20px;display: flex;align-items: center;">'
            strHtmlCnt +='        <i class="fa fa-search"></i>'
            strHtmlCnt +='    </a>'
            strHtmlCnt +='</span>'
            strHtmlCnt += '<div id="pnCart" style="margin-top:3px;"></div>'
        }

    strHtmlCnt += '    </div>'
    strHtmlCnt += '     <div class="pnFilter"></div>'
    strHtmlCnt += '</div>'
    strHtmlCnt += '<style>'
    strHtmlCnt += idOrClass+'>div.fixed{'
    strHtmlCnt += '    position: fixed;left: 0;right: 0;top: 0;z-index: 10;box-shadow: 0px 0px 18px -7px;background:#fff!important'
    strHtmlCnt += '    }'
    strHtmlCnt += '</style>'
    
    $(idOrClass).html(strHtmlCnt);

    
    //coreLoadPage.viewVideoHelper({
    //    strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID
    //    ,strTravelHelperSubModuleCode: '725BB'
    //    ,intLangID: $.pngGetLangID()
    //    ,idOrClassBtn:'#btnVideoHelperHp'
    //})

    
    var ObjSearchDtl = $.ModuleLayouts_Searchbar_GetValue()

    if( new Date(moment(ObjSearchDtl.dtmDateStart)) < new Date(moment().format('l'))){
        ObjSearchDtl.dtmDateStart = null
    }
    if( new Date(moment(ObjSearchDtl.dtmDateValidFrom)) < new Date(moment().add('days',1).format('l'))){
        ObjSearchDtl.dtmDateValidFrom = null
    }
    if( new Date(moment(ObjSearchDtl.dtmDateValidTo)) < new Date(moment().add('days',1).format('l'))){
        ObjSearchDtl.dtmDateValidTo = null
    }
    $.ModuleLayouts_Searchbar_GetValue(ObjSearchDtl)


    png.postListApiGetValue({
        objList_Api: ObjList_Api
        ,objListApi_RtnVal: {
            'GetListCateByCompanyGUID':{
                objParams_Cus:{
                }
                ,OnSuccess: function(data){

                    Arr_Cate = JSON.parse(data)[0]
                    Arr_Cate.forEach(function(value){
                        value['strCateName'] = pngElm.getLangKeyDB({langkey:value.strLangCode})
                    })
                    // return JSON.parse(data)[0]
                }
            }
        }
        ,OnSuccessList:function(data){
            GetMainPanel()
        }
    })

    function GetMainPanel(){

        Obj_FormInput = {
            intCateID: {
                title: '', attr: 'class="col-md-12" style="border-right:1px solid #D6D6D6;"', isRequire: false, IsRtn: true
                    ,input: { type: 'select', classEx: 'form-control pn-border-none pn-shadow-none bg-none', attr: '' }
                    ,dropDown:{arrList: $.pngGetArrComboValue(Arr_Cate,'intCateID','strCateName')}
            },
            strDestinationName: {
                title: '<i class="fa fa-map-marker" style="font-size: 20px;padding: 7px;padding-left: 15px;"></i>', attr: 'class="col-md-12" style="border-right:1px solid #D6D6D6;"', isRequire: false, IsRtn: true
                , input: { type: 'text', classEx: 'form-control pn-border-none pn-shadow-none bg-none', attr: 'maxlength="30"  placeholder="Destination" langkey="sys_Txt_Hd_phdAdrTour" style=""' }
            },
            dtmDateStart:{title:'<i class="fa fa-calendar" style="font-size: 20px;padding: 7px;"></i>',attr:'class="col-md-12 col-sm-4 col-xs-12 item2" style="border-right:1px solid #D6D6D6;"',isRequire: false
                ,input:{type:'text',classEx:'form-control pn-border-none pn-shadow-none bg-none',attr:'langkey="pg_Main_Tour_PPbook-DateStart" placeholder="Date Start" '}
                ,datePicker:{todayHighlight: true,format: 'dd/mm/yyyy',startDate: moment()}
            },
            dtmDateValidFrom_dtmDateValidTo:{title:'<i class="fa fa-calendar" style="font-size: 20px;padding: 7px;"></i>',attr:'class="col-md-12  col-sm-8 col-xs-12 item2" style="border-right:1px solid #D6D6D6;"',isRequire: false
                ,datePickerRange:{todayHighlight: true,format: 'dd/mm/yyyy',weekStart: 1,startDate: moment(),endDate: null,diffmin:1,placeholderFrom:'Date Valid From',placeholderTo:'Date Valid To'}
            },
            pnNoPaxAndNoRoom:{title:'<i class="fa fa-user" style="font-size: 20px;padding: 7px;"></i>',attr:'class="col-md-12"'
                ,input:{IsNoInput:true}
            },
        }

        
        var Obj_Detail = JSON.parse(JSON.stringify(ObjSearchDtl))

        if(ObjSearchDtl.objDestination){
            Obj_Detail['strDestinationName'] = ObjSearchDtl.objDestination[Object.keys(ObjSearchDtl.objDestination)[0]]
        }

        if ($(window).width() >= 1024){

            pngPn.getFormHorizontal({
                objInput: Obj_FormInput
                , idOrClass: idOrClass+' #Searchbar'
                , objDetail: Obj_Detail
                , classEx:''
                , attr: ''
                , strHtmlBtn:'<button id="btnFilter" class="btn bg-primary txt-white pn-round-1em pn-round-t-l-0 pn-round-b-l-0"><i class="fa fa-search"></i></button>'
            })
            
    
            $('.strDestinationName').parent().append('<ul class="cmt-content-dpn-list" style="padding: 5px 10px;background: #fff;list-style: none; position: absolute;display: none;width:100%;z-index: 10;"></ul>')
    
    
            $('.input-daterange input',idOrClass+' #Searchbar').css('border','none').css('box-shadow','none').css('width','130px')
            $('.input-group-addon',idOrClass+' #Searchbar').css('border','none')
    
            strHtmlCnt = ''
            strHtmlCnt += '<a class="form-control" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" style="border: none;background:none;box-shadow: none;line-height: 23px;">'
            strHtmlCnt += '    <span id="ListNoPaxAndNoRoom"></span> <i class="fa fa-angle-down" style="float: right;  margin-left: 5px;line-height: 23px;"></i>'
            strHtmlCnt += '</a>'
            strHtmlCnt += '<ul class="dropdown-menu open-right" id="ddlAgeType2">'
            strHtmlCnt += '   <form role="form" style="display: inline-flex">'
            strHtmlCnt += '       <div id="pnInputAgeType" style="padding: 15px;"></div>'
            strHtmlCnt += '       <style>'
            strHtmlCnt += '           #pnInputAgeType #pnChildren{'
            strHtmlCnt += '               max-height: 50vh;overflow-x: hidden;'
            strHtmlCnt += '           }'
            strHtmlCnt += '       </style>'
            strHtmlCnt += '       '
            strHtmlCnt += '   </form>'
            strHtmlCnt += '</ul>'
            $('.pn-pnNoPaxAndNoRoom',idOrClass+' #Searchbar').addClass('dropdown search')
            $('.pn-pnNoPaxAndNoRoom',idOrClass+' #Searchbar').css('position','relative')
            $('.pn-pnNoPaxAndNoRoom',idOrClass+' #Searchbar').html(strHtmlCnt)
            
            $(idOrClass+' #Searchbar').DefaultButton(idOrClass+' #Searchbar #btnFilter')

            GetInputDes(idOrClass)
            GetInputCate(idOrClass)
            GetInputAdultChildRoom(idOrClass)
            GetInputFilter(idOrClass)
        }else{

            var strHtml_FormShort = ''
    
            strHtml_FormShort+= '<div style="position: absolute;top: -8px;background: '+Str_BackgroundCode+';font-size: 10px;margin-left: -5px;border-radius: 1em;"><b style="margin: 0 5px;">'+(Obj_Detail.intCateID ? Arr_Cate.filter(function(item){ return item.intCateID == Obj_Detail.intCateID } )[0].strCateName : Arr_Cate[0].strCateName)+'</b></div>'
        
            strHtml_FormShort+= '<div style="height: 20px;overflow: hidden;"><i class="fa fa-map-marker" style="width:10px;margin-right:3px"></i>'+(ObjSearchDtl.objDestination? ObjSearchDtl.objDestination[Object.keys(ObjSearchDtl.objDestination)[0]] : '<i>not input</i>')+'</div>'

            strHtml_FormShort+= '<div style="font-size: 8px;margin-bottom: 3px;">'
            if(Obj_Detail.intCateID == 33){
                strHtml_FormShort+= (Obj_Detail.dtmDateValidFrom?  $.pngFormatDateTime(Obj_Detail.dtmDateValidFrom,'ddd, DD MMM')+' - '+ $.pngFormatDateTime(Obj_Detail.dtmDateValidTo,'ddd, DD MMM')+' | ' : '' )
            }else{
                strHtml_FormShort+= (Obj_Detail.dtmDateStart?  $.pngFormatDateTime(Obj_Detail.dtmDateStart,'ddd, DD MMM')+' | ' : '' )
            }
            // strHtml_FormShort+=' | '
            strHtml_FormShort+= '<span>'+ObjSearchDtl.intNoAdult+' <span langkey="sys_Txt_Hd_shtAdt"></span></span> '
            strHtml_FormShort+= ' - <span> '+ObjSearchDtl.arrChildren.length+' <span langkey="sys_Txt_Hd_shtKid"></span></span>'
            var intNoRooms = 0
            Object.keys(ObjSearchDtl.objNoOfRoom).forEach(function(value){
                intNoRooms+=ObjSearchDtl.objNoOfRoom[value]
            })
            strHtml_FormShort+= ' - <span>'+intNoRooms+' <span langkey="sys_Txt_Hd_shtRoom"></span></span>'
            strHtml_FormShort+='</div>'

            $(idOrClass+' .pnFormShort').html(strHtml_FormShort)
            

            $('#btnViewSrc',idOrClass).click(function(){


                GetPanelFullScreen(function(_idOrClassPn){
                    
                    var strHtml = ''
                    strHtml+='<div class="pn-padding-l-r-15">'
                    strHtml+='     <div class="pnForm"></div>'
                    strHtml+='     <button class="btn" style="background: #257EF8;color:#fff" id="btnFilter"><i class="fa fa-search"></i></button>'
                    strHtml+='</div>'
                    $(_idOrClassPn).html(strHtml)
                    
                    pngPn.getForm({
                        objInput: Obj_FormInput
                        , idOrClass: _idOrClassPn+' .pnForm'
                        , objDetail: Obj_Detail
                    })
            
                    $('.strDestinationName').parent().append('<ul class="cmt-content-dpn-list" style="padding: 5px 10px;background: #fff;list-style: none; position: absolute;display: none;width:100%;margin-top: 30px;z-index: 10;"></ul>')
            
                    $('.input-daterange input',_idOrClassPn+' .pnForm').css('border','none')//.css('width','100px')
                    $('.input-group-addon',_idOrClassPn+' .pnForm').css('border','none')
            
                    var strHtmlCnt = ''
                    strHtmlCnt += '<a class="form-control" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" style="border: none;background:none;box-shadow: none;line-height: 23px;">'
                    strHtmlCnt += '    <span id="ListNoPaxAndNoRoom"></span> <i class="fa fa-angle-down" style="float: right;  margin-left: 5px;line-height: 23px;"></i>'
                    strHtmlCnt += '</a>'
                    strHtmlCnt += '<ul class="dropdown-menu open-left" id="ddlAgeType2">'
                    strHtmlCnt += '   <form role="form" style="display: inline-flex">'
                    strHtmlCnt += '       <div id="pnInputAgeType" style="padding: 15px;"></div>'
                    strHtmlCnt += '       <style>'
                    strHtmlCnt += '           #pnInputAgeType #pnChildren{'
                    strHtmlCnt += '               max-height: 50vh;overflow-x: hidden;'
                    strHtmlCnt += '           }'
                    strHtmlCnt += '       </style>'
                    strHtmlCnt += '       '
                    strHtmlCnt += '   </form>'
                    strHtmlCnt += '</ul>'
                    $('.pnElm-pnNoPaxAndNoRoom',_idOrClassPn+' .pnForm').css('position','relative')
                    $('.pnElm-pnNoPaxAndNoRoom',_idOrClassPn+' .pnForm').addClass('dropdown search')
                    $('.pnElm-pnNoPaxAndNoRoom',_idOrClassPn+' .pnForm').html(strHtmlCnt)
                    
                    $(_idOrClassPn+' .pnForm').DefaultButton(_idOrClassPn+' #btnFilter')
        
                    $(_idOrClassPn+' .pnForm .col-md-12').css('display','flex')
                    $(_idOrClassPn+' .pnForm .col-md-12 label i').css('width','30px').css('padding','7px').css('text-align','center').css('padding-bottom','6px')
        
                    $(_idOrClassPn+' .pnForm .pnElm-dtmDateValidFrom_dtmDateValidTo input').css('text-align','left').css('box-shadow','none')
                    
                    $(_idOrClassPn+' .pnForm').find('.form-control,label i').css('border-bottom','1px solid #ccc')
                    
        
                    
                    GetInputDes(_idOrClassPn)
                    GetInputCate(_idOrClassPn)
                    GetInputAdultChildRoom(_idOrClassPn)
                    GetInputFilter(_idOrClassPn)

                })
            })

    
            
        }

        
        var IsClickIn = false
        $(window).click(function(event){
            if ( $(".strDestinationName").has(event.target).length == 0 && !$(".strDestinationName").is(event.target) ){
                $(".cmt-content-dpn-list").hide()
            } else {
                $(".cmt-content-dpn-list").show()
            }

            // if ( ( $(idOrClass+" .searchbar").has(event.target).length == 0 && !$(idOrClass+" .searchbar").is(event.target) ) && ( $(idOrClass+" .ctn-searchbar").has(event.target).length == 0 && !$(idOrClass+" .ctn-searchbar").is(event.target) ) ){
            //     $(idOrClass+" .ctn-searchbar").hide()
            //     if($("body .datepicker.datepicker-dropdown").length && IsClickIn){
            //         $(idOrClass+" .ctn-searchbar").show()
            //     }else{
            //         IsClickIn = false
            //     }
            // } else {
            //     IsClickIn = true
            //     $(idOrClass+" .ctn-searchbar").show()
            // }

            
        })

        
        function GetInputDes(_idOrClassPn){

            var idOrClass = _idOrClassPn
            var FN_TimeUOut = null
            $(idOrClass+' .strDestinationName').keyup(function(){
                var self = this
                clearTimeout(FN_TimeUOut)
                
                if($(this).val().trim()!=""){
                    FN_TimeUOut = setTimeout(function(){GetMain()},300)
                }else{
                    ObjSearchDtl['objDestination'] = null
                    $(".cmt-content-dpn-list").html('')
                }
    
                var self = this
                function GetMain(){
                    $(".cmt-content-dpn-list").show()
    
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        ,objListApi_RtnVal: {
                            'GetListDestinationForTourByPUB':{
                                objParams_Cus:{
                                    intCateID:$(idOrClass+' .intCateID').val()
                                    ,strFilterDestinationName: self.value.trim()
                                    ,tblsReturn:'[0]'
                                }
                                ,OnSuccess: function(data){
                                    var arrTbl_0 =  JSON.parse(data)[0]
                                    ObjSearchDtl['objDestination'] = {}
    
                                    var strHtml = ""
                                    if(arrTbl_0.length){
                                        arrTbl_0.forEach(function(value){
                                            strHtml+="<li><a strB2BSearchingGUID='"+value.strDestinationGUID+"' data='"+value.strDestinationCode+"' style='cursor:pointer;display: inherit;padding: 5px 0;border-bottom: 1px #e5e5e5 solid;'><b>"+value.strDestinationName+"</b>"
                                                strHtml+="<div style='font-size: 10px;'>"+value.strTextSearch+"</div>"
                                            strHtml+="</a></li>"
                                        });
                                        ObjSearchDtl['objDestination'][arrTbl_0[0].strDestinationCode] = arrTbl_0[0].strDestinationName
                                    }else{
                                        strHtml+= pngElm.getLangKey({langkey:'sys_Txt_NoResultsWereFound'})
                                        ObjSearchDtl['objDestination'] = null
                                    }
    
                                    $(".cmt-content-dpn-list").html(strHtml)
                                    $(".cmt-content-dpn-list li a").click(function(e){
                                        var strValue = $(this).find('b').text().trim()
                                        $(self).val(strValue)
                                        ObjSearchDtl['objDestination'] = {}
                                        ObjSearchDtl['objDestination'][$(this).attr('data')] = strValue
                                    })
                                }
                            }
                        }
                    })
    
                }
                    
            });
        }

        function GetInputCate(_idOrClassPn){
            var idOrClass = _idOrClassPn
            $(idOrClass+' .intCateID').change(function(e){
                if(this.value == 33){
                    $(idOrClass+' .dtmDateValidFrom').parents('.item,.item2').show();
                    $(idOrClass+' .dtmDateValidTo').parents('.item,.item2').show();
                    $(idOrClass+' .dtmDateStart').parents('.item,.item2').hide();
    
                }else{
                    $(idOrClass+' .dtmDateValidFrom').parents('.item,.item2').hide();
                    $(idOrClass+' .dtmDateValidTo').parents('.item,.item2').hide();
                    $(idOrClass+' .dtmDateStart').parents('.item,.item2').show();
                }
            }).change()

        }

        function GetInputAdultChildRoom(_idOrClassPn){
            var idOrClass = _idOrClassPn
            
            pngElm.getAgeType({
                idOrClass:idOrClass+' #pnInputAgeType'
                ,intNoAdult: ObjSearchDtl.intNoAdult
                ,arrChildren:ObjSearchDtl.arrChildren
                ,objNoOfRoom: ObjSearchDtl.objNoOfRoom
                ,IsViewDblRoom: false
                ,OnSuccess:function(intNoAdults,arrChildren,objNoOfRoom){
                    var intNoRooms = 0
                    Object.keys(objNoOfRoom).forEach(function(value){
                        intNoRooms+=objNoOfRoom[value]
                    })
    
                    var strHtml=''
                        strHtml+= '<span>'+intNoAdults+' <span langkey="sys_Txt_Hd_shtAdt"></span></span>'
                        strHtml+= ' - <span>'+arrChildren.length+' <span langkey="sys_Txt_Hd_shtKid"></span></span>'
                    if(intNoRooms)
                        strHtml+= ' - <span>'+intNoRooms+' <span langkey="sys_Txt_Hd_shtRoom"></span></span>'
                    
                    ObjSearchDtl.intNoAdult = intNoAdults
                    ObjSearchDtl.arrChildren = arrChildren
                    ObjSearchDtl.objNoOfRoom = objNoOfRoom
    
    
                    $(idOrClass+' #ListNoPaxAndNoRoom').html(strHtml)
    
                    pngElm.ChangeLanguage()
                }
            })

        }

        
        function GetInputFilter(_idOrClassPn){
            var idOrClass = _idOrClassPn

            $(idOrClass+' #btnFilter').click(function() {

                ObjSearchDtl = $.pngReplaceObj(ObjSearchDtl
                    ,pngPn.getForm({
                        action: 2,
                        objInput: Obj_FormInput,
                        idOrClass: idOrClass,
                    })
                ) 
                
                // console.log(ObjSearchDtl) 
                $.ModuleLayouts_Searchbar_GetValue(ObjSearchDtl)

                if (ObjSearchDtl.objDestination)
                    window.location.href = '/tour/search?idmdit=' + Object.keys(ObjSearchDtl.objDestination)[0]
                else 
                    window.location.href = '/tour/search'
                //window.history.pushState("", "", $.pngGetQSVal('module', 'src-rtl'));

                //idmdit


                //if(ObjSearchDtl.objDestination)
                //    window.history.replaceState("", "", $.pngGetQSVal('idmdit',Object.keys(ObjSearchDtl.objDestination)[0]));
                //else
                //    window.history.replaceState("", "", $.pngGetQSVal('idmdit',''))
                //coreLoadPage.init()

                $('.pnFullScreen').remove()
    
            });

        }
        

        function GetPanelFullScreen(_OnHtml){
            var IdOrClass_Pn = Math.random().toString(36).substring(4).toUpperCase()

            var strHtml = ''
            strHtml+= '<div id="'+IdOrClass_Pn+'" class="pnFullScreen" style="background: #fff; position: fixed; z-index: 1000; top: 0; bottom: 0; left: 0; right: 0;">'
                strHtml+= '<div style="display: flow-root;border-bottom: 1px solid #ccc;padding: 5px">'
                strHtml+= '     <button type="button" class="close" style="font-size: 40px;"><i class="fa fa-times"></i></button>'
                strHtml+= '</div>'
                strHtml+= '<div class="pnContent" style="overflow: auto; height: calc( 100vh - 60px);"></div>'
            strHtml+= '</div>'

            $('body').append(strHtml)

            IdOrClass_Pn= '#'+IdOrClass_Pn

            $('.close',IdOrClass_Pn).click(function(){
                $(IdOrClass_Pn).remove()
            })

            _OnHtml.call(this,IdOrClass_Pn+' .pnContent')


        }


        // var strHtml_FormShort = ''
    
        // strHtml_FormShort+= '<div><b>'+$(idOrClass+' .intCateID option:selected').text()+'</b></div>'
        
        // strHtml_FormShort+= '<div><i class="fa fa-map-marker" style="width:10px;margin-right:7px"></i>'+(ObjSearchDtl.objDestination? ObjSearchDtl.objDestination[Object.keys(ObjSearchDtl.objDestination)[0]] : '<i>not input</i>')+'</div>'

        
        // $(idOrClass+' .intCateID').change(function(e){
        //     if(this.value == 33){
        //         $(idOrClass+' .dtmDateValidFrom').parents('.item').show();
        //         $(idOrClass+' .dtmDateValidTo').parents('.item').show();
        //         $(idOrClass+' .dtmDateStart').parents('.item').hide();

                
        //         strHtml_FormShort+= '<div><i class="fa fa-calendar" style="width:10px;margin-right:7px"></i>'+$(idOrClass+' .dtmDateValidFrom').val()+' - '+ $(idOrClass+' .dtmDateValidTo').val() +'</div>'
        //     }else{
        //         $(idOrClass+' .dtmDateValidFrom').parents('.item').hide();
        //         $(idOrClass+' .dtmDateValidTo').parents('.item').hide();
        //         $(idOrClass+' .dtmDateStart').parents('.item').show();
        //         strHtml_FormShort+= '<div><i class="fa fa-calendar" style="width:10px;margin-right:7px"></i>'+($(idOrClass+' .dateStart').val() || '<i>not input</i>' )+'</div>'
        //     }
        // }).change()
        
        // pngElm.getAgeType({
        //     idOrClass:idOrClass+' #pnInputAgeType'
        //     ,intNoAdult: ObjSearchDtl.intNoAdult
        //     ,arrChildren:ObjSearchDtl.arrChildren
        //     ,objNoOfRoom: ObjSearchDtl.objNoOfRoom
        //     ,IsViewDblRoom: false
        //     ,OnSuccess:function(intNoAdults,arrChildren,objNoOfRoom){
        //         var intNoRooms = 0
        //         Object.keys(objNoOfRoom).forEach(function(value){
        //             intNoRooms+=objNoOfRoom[value]
        //         })

        //         var strHtml=''
        //             strHtml+= '<span>'+intNoAdults+' <span langkey="sys_Txt_Hd_shtAdt"></span></span>'
        //             strHtml+= ' - <span>'+arrChildren.length+' <span langkey="sys_Txt_Hd_shtKid"></span></span>'
        //         if(intNoRooms)
        //             strHtml+= ' - <span>'+intNoRooms+' <span langkey="sys_Txt_Hd_shtRoom"></span></span>'
                
        //         ObjSearchDtl.intNoAdult = intNoAdults
        //         ObjSearchDtl.arrChildren = arrChildren
        //         ObjSearchDtl.objNoOfRoom = objNoOfRoom


        //         $(idOrClass+' #ListNoPaxAndNoRoom').html(strHtml)

        //         pngElm.ChangeLanguage()
        //     }
        // })
        
        // strHtml_FormShort+='<i class="fa fa-user" style="width:10px;margin-right:7px"></i>'+$(idOrClass+' #ListNoPaxAndNoRoom').html()
        // $(idOrClass+' .pnFormShort').html(strHtml_FormShort)


        // $(idOrClass+' #btnFilter').click(function() {

        //     ObjSearchDtl = $.pngReplaceObj(ObjSearchDtl
        //         ,pngPn.getForm({
        //             action: 2,
        //             objInput: Obj_FormInput,
        //             idOrClass: idOrClass,
        //         })
        //     ) 
            
        //     // console.log(ObjSearchDtl) 
        //     $.ModuleLayouts_Searchbar_GetValue(ObjSearchDtl)
        //     window.history.pushState("", "", $.pngGetQSVal('module','src-rtl'));
        //     if(ObjSearchDtl.objDestination)
        //         window.history.replaceState("", "", $.pngGetQSVal('idmdit',Object.keys(ObjSearchDtl.objDestination)[0]));
        //     else
        //         window.history.replaceState("", "", $.pngGetQSVal('idmdit',''))
        //     coreLoadPage.init()

        // });


    }
    
    //coreLoadPage.viewOrderBooking({
    //    IsView:true
    //    ,idOrClass: idOrClass+' #pnCart'
    //})


    $(window).scroll(function() {
        if($(idOrClass).length){
            if ($(this).scrollTop() >  $(idOrClass).offset().top) {
                $(idOrClass+'>div').addClass('fixed')
            } else {
                $(idOrClass+'>div').removeClass('fixed')
            }
        }
        
    });
    

}
