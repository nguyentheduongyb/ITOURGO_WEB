//Copyright by PNGSOFT CORP. 2007-2019.
//File: APP_B2B_PUB\coreSystem.js
//Created:	MrHieu(04/10/2019)
//Edit:
//Description: 
var coreSystem = function () {

    var strUrl = document.getElementsByTagName("script")[4].getAttributeNode("src").value

    var ver = '0.0'
    
    var _getLinkVer = function(strUrl){
        return '/'+strUrl+'?v='+ver
    }

    var _getLib_CommonURL = function(strUrl){
        return '/Lib_Common/' + strUrl + '?v='+ver
    }
    var _getLib_CustomURL = function(strUrl){
        return '/Lib_Custom/' + strUrl + '?v='+ver
    }

    var _getPageItem = function(options){
        var defaults = {
            title:''
            ,icon:'assets/images/itourlinkicon.png'
            ,description:''
            ,image:''
            ,keywords:''
        }
        options = $.extend(defaults, options);

        var IdOrClass='html head'
        if(options.title){
            $('title',IdOrClass).html(options.title)
            $('meta[itemprop=name]',IdOrClass).attr('content', options.title)
            $('meta[property="og:title"]',IdOrClass).attr('content', options.title)
            $('meta[name="twitter:title"]',IdOrClass).attr('content', options.title)
        }

        if(options.icon){
            $('link[rel=icon]',IdOrClass).attr('href',_getLib_CommonURL(options.icon))
        }

        if(options.description){
            $('meta[name=description]',IdOrClass).attr('content', options.description)
            $('meta[itemprop=description]',IdOrClass).attr('content', options.description)
            $('meta[property="og:description"]',IdOrClass).attr('content', options.description)
            $('meta[name="twitter:description"]',IdOrClass).attr('content', options.description)
        }

        if(options.image){
            $('meta[itemprop=image]',IdOrClass).attr('content', options.image)
            $('meta[property="og:image"]',IdOrClass).attr('content', options.image)
            $('meta[name="twitter:image"]',IdOrClass).attr('content', options.image)
        }

        if(options.keywords){
            $('meta[name=keywords]',IdOrClass).attr('content', options.keywords)
        }

        $('meta[property="og:url"]',IdOrClass).attr('content', window.location.href)
        
    }

    var _getPanelFormReqAdvisory = function(options){
        var defaults = {
            idOrClass:''
        }
        options = $.extend(defaults, options);

        var IdOrClassPn = options.idOrClass

        var ObjList_Api = {
            AddGuestContact:{
                strApiLink:'api/public/news/AddGuestContact'
                ,objParams:{
                    strUserGUID: null
                    ,strGuestContactName: null
                    ,strGuestContactEmail: null
                    ,strGuestContactMobile: null
                    ,strDescription: null
                    ,strListMemberTypeID: null
                }
            },
        }

        var ObjList_ComboValue = {
            Arr_ValCode:{
                strCombocode:''
            }
            ,Arr_SQL:{
                strTableName:''
                ,strFeildSelect:' AS intID, AS strName'
                ,strWhere:'WHERE IsActive = 1'
            }
        }

        var Arr_MemberType = []

        png.postListApiGetValue({
            objList_ComboValue: ObjList_ComboValue
            ,objListComboValue_RtnVal: {
                'Arr_SQL':{
                    objParams_Cus:{
                        strTableName:'MB02'
                        ,strFeildSelect:'MB02_MemberTypeID AS intID,MB02_LangCode AS strName'
                        ,strWhere:'WHERE IsActive = 1'
                    }
                    , OnSuccess: function(data){ 
                        Arr_MemberType = data

                        Arr_MemberType.forEach(function(value) {
                            value['strName'] = pngElm.getLangKeyDB({langkey:value['strName'] })
                        });

                        GetMainPanel()
                    }
                }
            }
        })

        function GetMainPanel(){
            var strHtml=''
            strHtml+='<div>'
                strHtml +='<h3><b>'+pngElm.getLangKey({langkey:'pg_Dft_Home_ContactTxtReqTitle'})+'</b></h3>'
                strHtml+='<span>'+pngElm.getLangKey({langkey:'pg_Dft_Home_ContactTxtReqDes'})+'</span><br>'
                strHtml+='<div class="pnFormContact" style="margin-top: 10px;"></div>'
                strHtml+='<div><button class="btn" id="btnSendRequest" style="border-radius: 10em;background: #3838d1;color: #fff;font-weight: bold;padding: 10px 25px;">'+pngElm.getLangKey({langkey:'sys_Btn_SendReq'})+'</button></div>'
            strHtml+='</div>'

            $(IdOrClassPn).html(strHtml)

            var Obj_Input = {
                strGuestContactName: {title:'',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                    ,input:{type:'text',classEx:'form-control',attr:'placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_FormFullname'})+'(*)" style="border-radius: 10em;"'}
                }
                ,strGuestContactEmail: {title:'',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                    , input: { type: 'text', classEx: 'form-control', attr: 'placeholder="' + pngElm.getLangKey({ langkey: 'sys_Txt_FormEmail' }) + '(*)" style="border-radius: 10em;"' }
                    , validate: { format: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ }
                }
                ,strGuestContactMobile: {title:'',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                    , input: { type: 'text', classEx: 'form-control', attr: 'placeholder="' + pngElm.getLangKey({ langkey: 'sys_Txt_FormMobile' }) + '(*)" style="border-radius: 10em;"' }
                    , validate: { format: /^([+]\d{2})?\d{9,11}$/ }
                }
                ,strListMemberTypeID: {title: pngElm.getLangKey({langkey:'sys_Txt_SelectingYourInterested'}),attr:"class='col-md-12'",isRequire:false,IsRtn:true
                    ,listCheckbox:{arrList: $.pngGetArrComboValue(Arr_MemberType,'intID','strName') ,formatItem:'<span style="margin-right:15px;display:inline-block">{chk} {tit}</span>',splitReturn:','}
                }
                ,strDescription:{title:'',isRequire:false,attr:"class='col-md-12'",IsRtn:true
                    ,input:{type:'textarea',classEx:'form-control',attr:'rows="5" placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_FormComment'})+'" style="border-radius: 1em;"'}
                }
            }
    
            pngPn.getForm({
                action: 1,
                objInput: Obj_Input,
                idOrClass: IdOrClassPn+ ' .pnFormContact',
                objDetail: {},
            })
            $(IdOrClassPn + ' .pnFormContact').DefaultButton(IdOrClassPn + ' #btnSendRequest')

            $(IdOrClassPn + ' #btnSendRequest').click(function(){
                 pngPn.getForm({
                    action: 2,
                    objInput: Obj_Input,
                    idOrClass: IdOrClassPn+ ' .pnFormContact',
                    OnChkSuccess: function(objRtn){
                        if(objRtn){
                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                ,objListApi_RtnVal: {
                                    'AddGuestContact':{
                                        objParams_Cus: objRtn
                                        , OnSuccess: function (data) {
                                            var obj = JSON.parse(data)[0][0]
                                            pngPn.getForm({
                                                action: 1,
                                                objInput: Obj_Input,
                                                idOrClass: IdOrClassPn+ ' .pnFormContact',
                                                objDetail: {},
                                            })
                                            
                                            $.Confirm({ strContent: pngElm.getLangKey({ langkey: 'sys_Cfm_SentSuccess' }) });

                                            png.postSendEmail({
                                                strUserGUID: null
                                                , strEmailsSendTo: ""
                                                , strEmailsCC: ""
                                                , strEmailsBCC: ""
                                                , strEmailTemplateSubject: ""
                                                , IsBodyHtml: 1
                                                , strEmailTemplateContent: ""
                                                , strTempApiUrl: "api/public/GetEmailSendGuestContactByPublic"
                                                , objTempPar: {
                                                    strUserGUID: null
                                                    , strGuestContactGUID: obj.strGuestContactGUID
                                                    , intLangID: 18
                                                }
                                            })

                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            })


            var lastScrollTop = 100;

            var intTop = 100
            $(window).scroll(function () {

                var st = $(this).scrollTop();

                if ($(IdOrClassPn + '>div').height() < $('#pnContent').height()) {

                    var strPn = $(IdOrClassPn + '>div').width();
                    if ($(this).scrollTop() + 100 > $('#pnCnt').offset().top) {

                        if (st > lastScrollTop) {
                            // downscroll code

                            if (($(this).scrollTop() + $(window).height()) < ($(IdOrClassPn + '>div').offset().top + $(IdOrClassPn + '>div').height()) || ($(this).scrollTop() + $(window).height()) > $('app-footer-root').offset().top) {


                                intTop = intTop + (lastScrollTop - st)

                            }


                        } else {
                            // upscroll code

                            intTop = intTop + (lastScrollTop - st)


                        }

                        if (intTop > 100) {
                            intTop = 100
                        }

                        $(IdOrClassPn + '>div').attr('style', 'position:fixed;top: ' + intTop + 'px;width:' + strPn + 'px;z-index:1')

                    } else {
                        intTop = 100
                        $(IdOrClassPn + '>div').attr('style', '')
                    }

                } else {
                    $(IdOrClassPn + '>div').attr('style', '')
                }

                lastScrollTop = st;

            });
        
        }

        
    }

    var _getTransLinkFriendly = function(options){
        var defaults = {
            strLink:''
        }
        options = $.extend(defaults, options);

        var strLink = (options.strLink || window.location.href)

        var path = strLink.replace(png.ObjClnUrl.APPB2B,'')


        if (strLink.indexOf("?") >= 0){
            path = path.split('?')[0]
        }
        
        var strLinkRtn = strLink
        if(path!=''){
            ArrUrlPath = path.split('/')

            if(ArrUrlPath[0]=='page'){
                strLinkRtn = $.pngGetQSVal(ArrUrlPath[0],ArrUrlPath[1],window.location.href)
            }
            if(ArrUrlPath[0]=='post'){
                strLinkRtn = $.pngGetQSVal('page','news-detail',window.location.href)
                strLinkRtn = $.pngGetQSVal('slug',ArrUrlPath[1],strLinkRtn)
            }
            if(ArrUrlPath[0]=='client'){
                strLinkRtn = $.pngGetQSVal('page','client-detail',window.location.href)
                strLinkRtn = $.pngGetQSVal('slug',ArrUrlPath[1],strLinkRtn)
            }
        }
        return strLinkRtn
    }


    var _viewChat = function (_Opt) {
        var Dft = {
            strUserGUID: null
            , strCompanyGUID: null
            , idOrClass: '#ChatPanel'
            , IsBegin: true
            , objProduct: {
                strImageLink: '',
                strName: '',
            }
            , objFriendDetail: {
                strImageLink: '',
                strName: '',
                strCode: '',
            }
            , OnSuccess: function () { }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Main = _Opt.idOrClass

        var Obj_UserDetail = {
            strCode: JSON.parse(png.ArrLS.UserDetail.get()).strCustCode
        }


        var Obj_FriendDetail = null
        if (_Opt.objFriendDetail && _Opt.objFriendDetail.strName != '') {
            Obj_FriendDetail = _Opt.objFriendDetail
        }

        var Obj_Product = null
        if (_Opt.objProduct && _Opt.objProduct.strName != '') {
            Obj_Product = _Opt.objProduct
        }


        var Arr_ListChat = []
        if (sessionStorage.getItem('Arr_ListChat'))
            Arr_ListChat = JSON.parse(sessionStorage.getItem('Arr_ListChat'))

        var Str_ChannelCode = null


        var FN_itl_chatcontent = function () {
        }

        var FN_itl_channel_1 = function () {
        }

        var FN_itl_channel_2 = function () {
        }
        var FN_itl_channel_1_mb = function () {
        }

        var FN_itl_channel_2_mb = function () {
        }

        var db = firebase.database()
        var dbFs = firebase.firestore()

        var Is_Mobile

        if ($(window).width() >= 1024) {
            Is_Mobile = false
        } else {
            Is_Mobile = true
        }

        var Is_OpenListFriend
        var Is_OpenChat

        var strHtml = ''

        if (!Is_Mobile) {
            strHtml = `
                <div id="pnListChat" class="bg-white" style="position:fixed;bottom: 0;right: 100px;z-index:1000;box-shadow: 0px 0px 10px 0px;">
                    <div id="pnSmall">
                        <div class="bg-primary" style="padding: 15px;display: flex;align-items: center;cursor:pointer"><i class="fa fa-commenting"></i><span style="margin-left: 10px;"> Chat</span> <span class="txtNotRead"></span></div>
                    </div>
                    <div id="pnBig">
                        <div class="bg-white txt-primary" style=" padding: 10px; border-bottom: 1px solid #ccc">
                            <div style="float:right">
                                <button type="button" class="btn btn-link btnClose" style="font-size: 20px;padding: 0;margin: 0;line-height: 20px;"><i class="fa fa-angle-down"></i></button>
                            </div>
                            <div style="float:right">
                                <a class="btn btn-link btnShowChat" style="font-size: 20px;padding: 0;margin: 0;line-height: 20px;margin-right: 20px;"><i class="fa fa-angle-double-left" style="font-weight: bold;"></i></a>
                            </div>
                            <h3 style="font-size: 20px;">Chat <span class="txtNotRead"></span></h3>
                        </div>
                        <div style="display: flex;">
                            <div id="pnChatForms" class="bg-white" style="width:300px; padding-right: 15px; border-right: 1px solid #ccc">
                                <div style=" padding: 10px;">
                                    <h3 class="title" style="display:inline-block;font-size: 20px;"></h3>
                                </div>
                                <div style="">
                                    <div style="position:relative">
                                        <div id="chat_content_container" style="width: 100%;height: 225px;overflow-y: auto;padding-left: 15px;padding-right: 15px;padding-bottom: 10px;">
                                        </div>
                                        <div id="chat_attached" style="width: 100%;position:absolute;bottom:0;left:0;right:0;">
                                            <div class="btnShow" style="text-align:center;"><i class="fa fa-angle-double-down" style="background: #ccc;padding: 3px 5px;"></i></div>
                                            <div class="pnCnt" style="max-height: 100px;overflow-y: auto;background:#efefef;padding: 0 15px"></div>
                                        </div>
                                    </div>
                                    <div class="pnEnterTxt" style="display:flex;padding: 5px">
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="" style=" padding: 10px;">
                                    <h3 style="font-size: 20px;">Danh sách Chat</h3>
                                </div>
                                <div id="list_chat" style="width:300px;height: 289px;overflow-y: auto;padding-left: 15px;padding-right: 15px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
            `

            if (_Opt.IsBegin) {
                $(IdOrClass_Main).html(strHtml)


                $('#pnSmall', IdOrClass_Main).click(function () {
                    GetPanelListChat(true)
                })


                $('#pnBig .btnClose', IdOrClass_Main).click(function () {
                    GetPanelListChat(false)
                })
                $('.btnShowChat', IdOrClass_Main).hide()
                $('.btnShowChat', IdOrClass_Main).click(function () {
                    var IsOpen = $(this).find('i').hasClass('fa-angle-double-left')
                    GetPanelChat(IsOpen)
                })


                $('#chat_attached').hide()
                $('.btnShow', '#chat_attached').click(function () {
                    var IsOpen = $(this).find('i').hasClass('fa-angle-double-up')

                    if (IsOpen) {
                        $(this).find('i').removeClass('fa-angle-double-up').addClass('fa-angle-double-down')
                        $('#chat_attached .pnCnt').show()
                    } else {
                        $(this).find('i').removeClass('fa-angle-double-down').addClass('fa-angle-double-up')
                        $('#chat_attached .pnCnt').hide()
                    }
                })



                GetListPerson(IdOrClass_Main)

            }


            GetPanelListChat(false)
            GetPanelChat(false)


            if (Obj_FriendDetail) {
                $('.btnShowChat', IdOrClass_Main).show()
            }

            if (Obj_Product) {
                if (Obj_Product.strName) {
                    var strImg = Obj_Product.strImageLink
                    if (strImg)
                        strImg = png.getServerImgURL(strImg)
                    else
                        strImg = coreSystem.getLib_CommonURL('assets/images/img-noimage.png')

                    $('#chat_attached').show()
                    var strHtml = `
                    <div >
                        <div class="" style="display: flex;padding:5px 0">
                            <img alt="" class="username-avatar img-circle" src="${strImg}" style="height: 20px; width: 20px;">
                            <span class="username username-hide-on-mobile">${Obj_Product.strName}<span> 
                        </div>
                    </div>
                `
                    $('#chat_attached .pnCnt').html(strHtml)

                }
                
                var arr = Arr_ListChat.filter(function (item) { return item.strCode == Obj_FriendDetail.strCode })

                if (arr.length)
                    Str_ChannelCode = arr[0].strChannelCode

                GetPanelListChat(true)
                GetPanelChat(true)
            }



        } else {
            IdOrClass_Main = '#pnChat'

            // strHtml = `
            //     <div id="pnListChat" class="bg-white" style="position:fixed; top: 50%; right: 0;;z-index:1000;box-shadow: 0px 0px 10px 0px;">
            //         <div class="bg-primary" style="padding: 15px;display: flex;align-items: center;cursor:pointer"><i class="fa fa-commenting"></i><span class="txtNotRead" style="margin-left: 10px;"></span></div>
            //     </div>
            // `
            strHtml = `
                <a href="javascript:;" id="pnListChat" class="dropdown-toggle btn btn-texticon pn-round-10em txt-white" style="background: #F7904D;"  data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                   <i class="fa fa-commenting" style="font-size: 18px;line-height: 20px;"></i>
                   <div class="pnNumberOfUnRead"></div>
                </a>
                
            `
            $(IdOrClass_Main).html(strHtml)

            $('#pnListChat', IdOrClass_Main).click(function () {
                GetPanelFullScreen(function (_idOrClassPn) {
                    Is_OpenListFriend = true
                    var strHtml = ''
                    strHtml += `
                        <div id="list_chat" style="padding-left: 15px;padding-right: 15px;"></div>
                    `
                    $(_idOrClassPn).html(strHtml)

                    GetListPerson(_idOrClassPn)

                }, 'Danh sách chat', function () {
                    Is_OpenListFriend = false
                    FN_itl_channel_1()
                    FN_itl_channel_2()

                })
            })

            if (Obj_Product) {

                var arr = Arr_ListChat.filter(function (item) { return item.strCode == Obj_FriendDetail.strCode })

                if (arr.length)
                    Str_ChannelCode = arr[0].strChannelCode

                $('#pnListChat', IdOrClass_Main).click()

                GetPanelChat(true)
            }

            GetListPerson()

        }



        function GetListPerson(_idOrCLass) {

            Arr_ListChat = []

            if (_idOrCLass) {
                FN_itl_channel_1 = dbFs.collection('itl-channel').where("strCode1", "==", Obj_UserDetail.strCode).onSnapshot(
                    snapshot => {
                        snapshot.docChanges().forEach(function (value) {
                            // console.log(value.doc.data())

                            data = value.doc.data()

                            data['strCode'] = data['strCode2']

                            GetUpdArr(value, data)

                        })
                        GetPanelItemChat()
                    }
                )
                FN_itl_channel_2 = dbFs.collection('itl-channel').where("strCode2", "==", Obj_UserDetail.strCode).onSnapshot(
                    snapshot => {
                        snapshot.docChanges().forEach(function (value) {
                            // console.log(value.doc.data())

                            data = value.doc.data()

                            data['strCode'] = data['strCode1']
                            GetUpdArr(value, data)

                        })
                        GetPanelItemChat()
                    }
                )
            } else {
                FN_itl_channel_1_mb()
                FN_itl_channel_1_mb = dbFs.collection('itl-channel').where("strCode1", "==", Obj_UserDetail.strCode).onSnapshot(
                    snapshot => {
                        snapshot.docChanges().forEach(function (value) {
                            // console.log(value.doc.data())

                            data = value.doc.data()

                            data['strCode'] = data['strCode2']

                            GetUpdArr(value, data)

                        })
                        GetPanelItemChat_ChatClose()
                    }
                )

                FN_itl_channel_2_mb()
                FN_itl_channel_2_mb = dbFs.collection('itl-channel').where("strCode2", "==", Obj_UserDetail.strCode).onSnapshot(
                    snapshot => {
                        snapshot.docChanges().forEach(function (value) {
                            // console.log(value.doc.data())

                            data = value.doc.data()

                            data['strCode'] = data['strCode1']
                            GetUpdArr(value, data)

                        })
                        GetPanelItemChat_ChatClose()
                    }
                )
            }


            function GetUpdArr(value, data) {
                if (value.type === "added") {
                    Arr_ListChat.push(data)
                }
                if (value.type === "modified") {

                    var intKey = Arr_ListChat.findIndex((obj => obj.strChannelCode == data.strChannelCode))

                    Arr_ListChat[intKey] = $.pngExtendObj(Arr_ListChat[intKey], data)
                }
                if (value.type === "removed") {
                }
            }


            function GetPanelItemChat() {

                $('#list_chat', _idOrCLass).html('')

                var strHtml = ''

                if (Arr_ListChat.length) {
                    $('.btnShowChat', _idOrCLass).show()
                } else {
                    $('#list_chat', _idOrCLass).html('<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>')
                    if (!Obj_FriendDetail)
                        $('.btnShowChat', _idOrCLass).hide()

                    sessionStorage.removeItem('Arr_ListChat')
                }

                Arr_ListChat.forEach(function (value, key) {
                    strHtml = `
                        <div id="${value.strCode}" class="item" strChannelCode="${value.strChannelCode}"  intRowID="${key}" style="padding: 10px 0;display: flex;align-items: center;cursor:pointer"></div>
                    `
                    $('#list_chat', _idOrCLass).append(strHtml)

                    if (value.strCode == value.strCode1)
                        GetNotRead('#list_chat #' + value.strCode, value.IsRead2, value)
                    else {
                        GetNotRead('#list_chat #' + value.strCode, value.IsRead1, value)
                    }

                    $('#list_chat #' + value.strCode, _idOrCLass).click(function () {
                        var intRowID = $(this).attr('intRowID')
                        Str_ChannelCode = Arr_ListChat[intRowID].strChannelCode
                        Obj_FriendDetail = Arr_ListChat[intRowID]
                        GetPanelChat(true)

                        $('#chat_attached').hide()
                        Obj_Product = null

                    })

                    GetProfile(value.strCode, key)
                })

                GetCountNotRead()
            }

            function GetPanelItemChat_ChatClose() {

                GetCountNotRead()
            }



            function GetProfile(_strCode, _key) {
                dbFs.collection('itl-userprofile').where("strCode", "==", _strCode).onSnapshot(
                    snapshot => {
                        snapshot.docChanges().forEach(function (value) {
                            // console.log(value.doc.data())

                            data = value.doc.data()

                            var strImg = data.strImageUrl
                            if (strImg)
                                strImg = png.getServerImgURL(strImg)
                            else
                                strImg = coreSystem.getLib_CommonURL('assets/images/img-noimage.png')

                            var strHtml = `
                                <img alt="" class="username-avatar img-circle" src="${strImg}" style="height: 20px; width: 20px;"><span style="margin-left: 10px;">${data.strName}<span>
                            `

                            if (value.type === "added") {
                                $('#list_chat', _idOrCLass).find('#' + _strCode).html(strHtml)
                                Arr_ListChat[_key] = $.pngExtendObj(Arr_ListChat[_key], data)
                            }
                            if (value.type === "modified") {
                                $('#list_chat', _idOrCLass).find('#' + _strCode).html(strHtml)
                                Arr_ListChat[_key] = $.pngExtendObj(Arr_ListChat[_key], data)
                            }
                            // if (change.type === "modified") {
                            //     console.log("Modified city: ", change.doc.data());
                            // }
                            // if (change.type === "removed") {

                        })

                        sessionStorage.setItem('Arr_ListChat', JSON.stringify(Arr_ListChat))
                    }
                )
            }

            function GetNotRead(_idOrClass, _IsRead, _objDtl) {
                if (_IsRead == 0) {

                    $(_idOrClass).css('font-weight', 'bold')
                    if (!Is_Mobile) {
                        if (Str_ChannelCode == _objDtl.strChannelCode) {
                            Obj_FriendDetail = _objDtl
                            // GetPanelListChat(true)
                            // if(!Is_OpenChat)
                            if (Is_OpenListFriend)
                                GetPanelChat(true)
                        }
                    } else {
                        if (Is_OpenChat && Str_ChannelCode == _objDtl.strChannelCode) {
                            Obj_FriendDetail = _objDtl
                            if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode1) {
                                if (!Obj_FriendDetail.IsRead2 || Obj_FriendDetail.IsRead2 == 0) {
                                    dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ IsRead2: 1, dtmDateTimeLastChkMess2: moment().format() })
                                }
                            }

                            if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode2) {

                                if (!Obj_FriendDetail.IsRead1 || Obj_FriendDetail.IsRead1 == 0) {
                                    dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ IsRead1: 1, dtmDateTimeLastChkMess1: moment().format() })
                                }
                            }
                        }
                    }
                }
                else
                    $(_idOrClass).css('font-weight', 'normal')
            }

            function GetCountNotRead() {
                var intNotRead = 0
                intNotRead += Arr_ListChat.filter(function (item) { return item.strCode == item.strCode1 && item.IsRead2 == 0 }).length
                intNotRead += Arr_ListChat.filter(function (item) { return item.strCode == item.strCode2 && item.IsRead1 == 0 }).length

                if (!Is_Mobile) {
                    if (intNotRead > 0) {
                        $('.txtNotRead', IdOrClass_Main).html(' (' + intNotRead + ')')
                    } else {
                        $('.txtNotRead', IdOrClass_Main).html('')
                    }
                }
                else {
                    if (intNotRead > 0)
                        $('.pnNumberOfUnRead', IdOrClass_Main).html('<span style="position: absolute;top: -5px;right: -5px;background: red;width: 20px;height: 20px;font-size: 10px;line-height: 20px;border-radius: 50%;">' + (intNotRead > 99 ? '99<sup>+</sup>' : intNotRead) + '</span>')
                    else
                        $('.pnNumberOfUnRead', IdOrClass_Main).html('')
                }
            }

        }


        function GetPanelListChat(_IsOpen) {
            Is_OpenListFriend = _IsOpen
            if (_IsOpen) {
                $('#pnBig', IdOrClass_Main).show()
                $('#pnSmall', IdOrClass_Main).hide()
                if (Is_OpenChat) {
                    GetPanelChat(Is_OpenChat)
                }
            } else {
                $('#pnBig', IdOrClass_Main).hide()
                $('#pnSmall', IdOrClass_Main).show()
            }
        }



        function GetPanelChat(_IsOpen) {
            Is_OpenChat = _IsOpen
            if (_IsOpen) {
                $('.btnShowChat i', IdOrClass_Main).removeClass('fa-angle-double-left').addClass('fa-angle-double-right')
                $('#pnChatForms', IdOrClass_Main).show()

                GetList()
            } else {
                $('.btnShowChat i', IdOrClass_Main).removeClass('fa-angle-double-right').addClass('fa-angle-double-left')
                $('#pnChatForms', IdOrClass_Main).hide()
            }


        }

        function GetList() {


            var strChannelCode = ''
            if (Str_ChannelCode) {
                strChannelCode = Str_ChannelCode
            } else {

                if (Obj_FriendDetail) {
                    strChannelCode = Obj_UserDetail.strCode + '_' + Obj_FriendDetail.strCode
                } else {
                    Str_ChannelCode = Arr_ListChat[0].strChannelCode
                    Obj_FriendDetail = Arr_ListChat[0]

                    strChannelCode = Str_ChannelCode
                }

            }

            if (Str_ChannelCode) {

                if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode1) {
                    if (!Obj_FriendDetail.IsRead2 || Obj_FriendDetail.IsRead2 == 0) {
                        dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ IsRead2: 1, dtmDateTimeLastChkMess2: moment().format() })
                    }
                    dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ dtmDateTimeLastOpen2: moment().format() })
                }

                if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode2) {

                    if (!Obj_FriendDetail.IsRead1 || Obj_FriendDetail.IsRead1 == 0) {
                        dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ IsRead1: 1, dtmDateTimeLastChkMess1: moment().format() })
                    }
                    dbFs.collection('itl-channel').doc(Str_ChannelCode).update({ dtmDateTimeLastOpen1: moment().format() })
                }

                setTimeout(function () {
                    $('#list_chat .item', IdOrClass_Main).css('background', 'none')
                    $('#list_chat .item[strChannelCode=' + Str_ChannelCode + ']', IdOrClass_Main).css('background', '#f3f3f3')
                }, 100)

            }

            var strImg = Obj_FriendDetail.strImageUrl
            if (strImg)
                strImg = png.getServerImgURL(strImg)
            else
                strImg = coreSystem.getLib_CommonURL('assets/images/img-noimage.png')


            var strTitle = `
                <img alt="" class="username-avatar img-circle" src="${strImg}" style="height: 20px; width: 20px;"><span style="margin-left: 10px;">${Obj_FriendDetail.strName}<span>
            `

            if (!Is_Mobile) {

                $('#pnChatForms .title', IdOrClass_Main).html(strTitle)


                $('#pnChatForms .pnEnterTxt', IdOrClass_Main).html(`
                    <textarea id="chat_input" class="form-control" rows="2" maxlength="1000"
                        placeholder=""></textarea>
                    <button id="chat_input_send" class="btn btn-link" disabled="true" style="padding-left: 5px; padding-right: 0;"><i class="fa fa-paper-plane"></i></button>
                `)



                $('#chat_input', IdOrClass_Main).keyup(function () {
                    $('#chat_input_send', IdOrClass_Main).attr('disabled', !(this.value))
                })

                $('#chat_input_send', IdOrClass_Main).click(function () {
                    GetSendMessage($('#chat_input', IdOrClass_Main).val())
                    $('#chat_input_send', IdOrClass_Main).attr('disabled', true)
                    $('#chat_input', IdOrClass_Main).val('').focus()
                })
            } else {
                GetPanelFullScreen(function (_idOrClassPn) {

                    var strHtml = ''
                    strHtml += `
                        <div style="position:relative">
                            <div id="chat_content_container" style="width: 100%; height: calc(100vh - 230px); overflow-y: auto;padding-left: 15px;padding-right: 15px;padding-bottom: 10px;">
                            </div>
                            <div id="chat_attached" style="width: 100%;position:absolute;bottom:0;left:0;right:0;">
                                <div class="btnShow" style="text-align:center;"><i class="fa fa-angle-double-down" style="background: #ccc;padding: 3px 5px;"></i></div>
                                <div class="pnCnt" style="max-height: 100px;overflow-y: auto;background:#efefef;padding: 0 15px"></div>
                            </div>
                        </div>
                        <div class="pnEnterTxt" style="display:flex;padding: 5px">
                            <textarea id="chat_input" class="form-control" rows="2" maxlength="1000"
                                placeholder=""></textarea>
                            <button id="chat_input_send" class="btn btn-link" disabled="true" style="padding-left: 5px; padding-right: 0;"><i class="fa fa-paper-plane"></i></button>
                        </div>
                    `
                    $(_idOrClassPn).html(strHtml)

                    $('#chat_attached').hide()

                    $('.btnShow', '#chat_attached').click(function () {
                        var IsOpen = $(this).find('i').hasClass('fa-angle-double-up')

                        if (IsOpen) {
                            $(this).find('i').removeClass('fa-angle-double-up').addClass('fa-angle-double-down')
                            $('#chat_attached .pnCnt').show()
                        } else {
                            $(this).find('i').removeClass('fa-angle-double-down').addClass('fa-angle-double-up')
                            $('#chat_attached .pnCnt').hide()
                        }
                    })

                    if (Obj_Product) {

                        var strImg = Obj_Product.strImageLink
                        if (strImg)
                            strImg = png.getServerImgURL(strImg)
                        else
                            strImg = coreSystem.getLib_CommonURL('assets/images/img-noimage.png')

                        $('#chat_attached').show()
                        var strHtml = `
                            <div >
                                <div class="" style="display: flex;padding:5px 0">
                                    <img alt="" class="username-avatar img-circle" src="${strImg}" style="height: 20px; width: 20px;">
                                    <span class="username username-hide-on-mobile">${Obj_Product.strName}<span> 
                                </div>
                            </div>
                        `
                        $('#chat_attached .pnCnt').html(strHtml)
                    }
                    $('#chat_input', _idOrClassPn).keyup(function () {
                        $('#chat_input_send', _idOrClassPn).attr('disabled', !(this.value))
                    })

                    $('#chat_input_send', _idOrClassPn).click(function () {
                        GetSendMessage($('#chat_input', _idOrClassPn).val())
                        $('#chat_input_send', _idOrClassPn).attr('disabled', true)
                        $('#chat_input', _idOrClassPn).val('').focus()
                    })


                }, strTitle, function () {
                    FN_itl_chatcontent()
                    Is_OpenChat = false
                })
            }






            var IdOrClass_Pn = '#chat_content_container'

            $(IdOrClass_Pn).html('')


            FN_itl_chatcontent()
            FN_itl_chatcontent = dbFs.collection('itl-chatcontent').where("strChannelCode", "==", strChannelCode).onSnapshot(
                snapshot => {
                    // if(snapshot.size == 1){
                    snapshot.docChanges().forEach(function (value) {
                        // console.log(value.doc.data())

                        data = value.doc.data()

                        if (value.type === "added") {
                            var strHtml = ''
                            strHtml += '<div id="' + value.doc.id + '">'
                            strHtml += '</div>'

                            if (!$(IdOrClass_Pn + ' #' + value.doc.id).length)
                                $(IdOrClass_Pn).append(strHtml)

                            pnCtn(data, IdOrClass_Pn + ' #' + value.doc.id)
                        }


                        function pnCtn(_objDtl, _idOrCLass) {

                            var strHtml = ''
                            if (_objDtl.strCode == Obj_UserDetail.strCode) {

                                strHtml += `
                                        <div class="" style="padding: 5px;color:#ffffff;background: #5079b3;border-radius: 5px;margin-left: 10px;margin-bottom: 15px;">
                                            <div class="message_content" style="white-space: pre-wrap;word-wrap: break-word;">${_objDtl.strMessage}</div>
                                            ${(_objDtl.objProduct ? ` 
                                                <div style="display: flex;padding:5px">
                                                    <img alt="" class="username-avatar img-circle" src="${(_objDtl.objProduct.strImageLink ? png.getServerImgURL(_objDtl.objProduct.strImageLink) : coreSystem.getLib_CommonURL('assets/images/img-noimage.png'))}" style="height: 20px; width: 20px;">
                                                    <span class="username username-hide-on-mobile" style="padding-left:5px">${_objDtl.objProduct.strName}<span> 
                                                </div>
                                            `: ``)}
                                            <div style="font-size: 8px;">${$.pngFormatDateTime(_objDtl.dtmDateTimeSend) + ' ' + $.pngFormatDateTime(_objDtl.dtmDateTimeSend, 'HH:mm:ss')}</div>
                                        </div>
                                    `
                            } else {
                                strHtml += `
                                        <div style="padding: 5px;background: #e7e7e7;border-radius: 10px;margin-right: 10px;margin-bottom: 15px;">
                                            <div class="message_content" style="white-space: pre-wrap;word-wrap: break-word;">${_objDtl.strMessage}</div>
                                            ${(_objDtl.objProduct ? ` 
                                                <div style="display: flex;padding:5px">
                                                    <img alt="" class="username-avatar img-circle" src="${(_objDtl.objProduct.strImageLink ? png.getServerImgURL(_objDtl.objProduct.strImageLink) : coreSystem.getLib_CommonURL('assets/images/img-noimage.png'))}" style="height: 20px; width: 20px;">
                                                    <span class="username username-hide-on-mobile">${_objDtl.objProduct.strName}<span> 
                                                </div>
                                            `: ``)}
                                            <div style="font-size: 8px;">${$.pngFormatDateTime(_objDtl.dtmDateTimeSend) + ' ' + $.pngFormatDateTime(_objDtl.dtmDateTimeSend, 'HH:mm:ss')}</div>
                                        </div>
                                    `
                            }
                            $(_idOrCLass).html(strHtml)
                        }
                    })
                    // }

                    $(IdOrClass_Pn).scrollTop($(IdOrClass_Pn).prop('scrollHeight'))
                }
            )



        }


        function GetSendMessage(_strValue) {

            if (!Str_ChannelCode) {
                Str_ChannelCode = Obj_UserDetail.strCode + '_' + Obj_FriendDetail.strCode

                dbFs.collection('itl-channel').doc(Str_ChannelCode).set({
                    strChannelCode: Str_ChannelCode,
                    strCode1: Obj_UserDetail.strCode,
                    strCode2: Obj_FriendDetail.strCode,
                    dtmDateTimeLastSend1: moment().format(),
                    dtmDateTimeLastSend2: null,
                    dtmDateTimeLastOpen1: moment().format(),
                    dtmDateTimeLastOpen2: null,
                    IsRead1: 1,
                    IsRead2: 0,
                    dtmDateTimeLastChkMess1: null,
                    dtmDateTimeLastChkMess2: null,
                })

            }

            if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode1)
                dbFs.collection('itl-channel').doc(Str_ChannelCode).update({
                    IsRead1: 0, dtmDateTimeLastSend2: moment().format(),
                })

            if (Obj_FriendDetail.strCode == Obj_FriendDetail.strCode2)
                dbFs.collection('itl-channel').doc(Str_ChannelCode).update({
                    IsRead2: 0, dtmDateTimeLastSend1: moment().format(),
                })


            dbFs.collection('itl-userprofile').doc(Obj_FriendDetail.strCode).get().then((doc) => {
                if (!doc.exists) {
                    dbFs.collection('itl-userprofile').doc(Obj_FriendDetail.strCode).set({
                        strMemberGUID: null,
                        strCompanyGUID: Obj_FriendDetail.strCompanyGUID,
                        strName: Obj_FriendDetail.strName,
                        strImageUrl: Obj_FriendDetail.strImageUrl,
                        strCode: Obj_FriendDetail.strCode,
                    })
                }
            })


            dbFs.collection('itl-chatcontent').doc(Str_ChannelCode + '_' + moment().unix()).set({
                strChannelCode: Str_ChannelCode,
                strCode: Obj_UserDetail.strCode,
                strMessage: _strValue,
                dtmDateTimeSend: moment().format(),
                objProduct: Object.keys(Obj_Product).length? Obj_Product : null,
            })

            $('#chat_attached').hide()
            Obj_Product = null

        }

        function GetPanelFullScreen(_OnHtml, _strTitle, _OnClose) {
            var IdOrClass_Pn = Math.random().toString(36).substring(4).toUpperCase()

            var strHtml = ''
            strHtml += '<div id="' + IdOrClass_Pn + '" class="pnFullScreen" style="background: #fff; position: fixed; z-index: 1001; top: 0; bottom: 0; left: 0; right: 0;">'
            strHtml += '<div style="display: flow-root;border-bottom: 1px solid #ccc;padding: 5px 15px">'
            strHtml += '     <b style="line-height: 30px;">' + _strTitle + '</b>'
            strHtml += '     <button type="button" class="close" style="font-size: 40px;"><i class="fa fa-times"></i></button>'
            strHtml += '</div>'
            strHtml += '<div class="pnContent" style="overflow: auto; height: calc( 100vh - 60px);"></div>'
            strHtml += '</div>'

            $('body').append(strHtml)

            IdOrClass_Pn = '#' + IdOrClass_Pn

            $('.close', IdOrClass_Pn).click(function () {
                $(IdOrClass_Pn).remove()
                _OnClose.call()
            })

            _OnHtml.call(this, IdOrClass_Pn + ' .pnContent')


        }


    }

    if (!png.ArrLS.Language.get()) {
        // localStorage.setItem("LANGUAGE", defaultLang)
        png.ArrLS.Language.set('vi')
    }
    if (!$.pngGetQSVal('lang')) {
        window.history.replaceState("", "", $.pngGetQSVal('lang', png.ArrLS.Language.get()));
    } else {
        png.ArrLS.Language.set($.pngGetQSVal('lang'))
    }

    var _getLoadPage = function (options) {
        var defaults = {
            OnSuccess: function () {

            }
        }
        options = $.extend(defaults, options);


        var i = 0
        var Obj = {
            1: function () {
                pngElm.getLanguageSys({
                    defaultLang: 'vi'
                    , OnSuccess: function () {
                        GetMain()
                    }
                })
            }
            , 2: function () {
                pngElm.getCurrencySys({
                    OnSuccess: function (arrData) {
                        arrData.forEach(function (value) {
                            if (value.intCurrencyID == 3)
                                png.ArrLS.Currency.set(JSON.stringify(value))
                        })
                        GetMain()
                    }
                })
            }
        }
        Object.keys(Obj).forEach(function (value) {
            Obj[value]()
        })

        function GetMain() {
            i++
            if (i == Object.keys(Obj).length) {
                _changeStorageToCookie()
                options.OnSuccess.call()
            }
        }
    }

    function _changeStorageToCookie() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            Cookies.set(key, value, { expires: 14 });
        }
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);

            Cookies.set(key, value, { expires: 14 });
        }
    }

    return {
        getLinkVer: function (options) {  return _getLinkVer(options)}
        ,getLib_CommonURL: function (options) {  return _getLib_CommonURL(options)}
        ,getLib_CustomURL: function (options) {  return _getLib_CustomURL(options)}
        ,getPageItem: function (options) {  return _getPageItem(options)}
        ,getPanelFormReqAdvisory: function (options) {  return _getPanelFormReqAdvisory(options)}
        ,getTransLinkFriendly: function (options) {  return _getTransLinkFriendly(options)}
        , getLoadPage: function (options) { return _getLoadPage(options) }
        , changeStorageToCookie: function (options) { return _changeStorageToCookie(options) }
        , viewChat: function (options) { _viewChat(options) }

    }
}();


$.ModuleSystemBreadcrumb = function (options) {
    var defaults = {
        roottab: 'app-breadcrumb-root'
        , arrBrcbItems: [{
            id: "", title: "", url: ""
        }]
    }
    options = $.extend(defaults, options);


    var strHtmlMain = ''
    strHtmlMain += '<div id="Breadcrumb">'
    strHtmlMain += '    <div class="container">'
    strHtmlMain += '        <div class="row navbar">'
    strHtmlMain += '            <div class="col-md-12 navbar-item">'
    strHtmlMain += '                <ul class="page-breadcrumb"></ul>'
    strHtmlMain += '            </div>'
    strHtmlMain += '        </div>'
    strHtmlMain += '    </div>'
    strHtmlMain += '</div>'
    $(options.roottab).html(strHtmlMain)


    GenderControl();

    function GenderControl() {
        var strHTML = ""
        if (options.arrBrcbItems)
            options.arrBrcbItems.forEach(function (value, key) {
                strHTML += "<li>"
                if (key)
                    strHTML += "<span style='padding: 7px;'>></span>"

                if (key + 1 == options.arrBrcbItems.length)
                    strHTML += "<span class='breadcrumb-title' ANCD langkey='" + value.id + "'>" + value.title + "</span>"
                else
                    strHTML += "<a class='breadcrumb-title' langkey='" + value.id + "' " + (value.attr || "") + " " + (value.url ? "href='" + value.url + "'" : "") + ">" + value.title + "</a>"

                strHTML += "</li>"
            });


        $(options.roottab).find(".page-breadcrumb").html(strHTML);
    }
}