//Copyright by PNGSOFT CORP. 2007-2018.
//File: APP\assets\core\service\core.js 
//Created:	Duongitvn(18/12/2018)
//Edit:
//Description: 
var png = function () {

    var ArrConfig = {
        strApiURL: "https://b2bapi.itourlink.com/",
        strImgURL: "https://b2bapi.itourlink.com/",
    }
    if (location.host.indexOf("localhost:") >= 0) 
        ArrConfig.strApiURL = "http://localhost:23689/";

    var _ObjClnUrl  = {
        APPB2B: 'https://itourlink.com/'
        ,APPB2B_Agent: 'https://agent.itourlink.com/'
        ,APPB2B_AgentHost: 'https://agenthost.itourlink.com/'
        ,APPB2B_Guide: 'https://guide.itourlink.com/'
        ,APPB2B_Management: 'https://management.itourlink.com/'
        ,APPB2B_Pub: 'https://pub.itourlink.com/'
        ,APPB2B_Traveller: 'https://pax.itourlink.com/'
        ,APPTMS: 'https://demo.itoursys.com/'
    }
    if (location.host.indexOf("localhost:") >= 0){
        var strLocalUrl = 'http://localhost:'
        _ObjClnUrl.APPB2B = strLocalUrl+'4132/'
        _ObjClnUrl.APPB2B_Agent = strLocalUrl+'4133/'
        _ObjClnUrl.APPB2B_AgentHost = strLocalUrl+'4134/'
        _ObjClnUrl.APPB2B_Guide = strLocalUrl+'4135/'
        _ObjClnUrl.APPB2B_Management = strLocalUrl+'4136/'
        _ObjClnUrl.APPB2B_Pub = strLocalUrl+'4137/'
        _ObjClnUrl.APPB2B_Traveller = strLocalUrl+'4138/'
        _ObjClnUrl.APPTMS = strLocalUrl+'1300/'
        
    }
    var _APPB2B_Type = ''

    Object.keys(_ObjClnUrl).forEach(function(value){
        if(window.location.href.indexOf(_ObjClnUrl[value]) >= 0){
            _APPB2B_Type = value
        }
    })


    var _FirebaseConfig = {
        apiKey: "AIzaSyD4oliJN8todqRozKCfIuYOJp_aPfbeylA",
        authDomain: "chatfirehieu.firebaseapp.com",
        projectId: "chatfirehieu",
        storageBucket: "chatfirehieu.appspot.com",
        messagingSenderId: "228259686130",
        appId: "1:228259686130:web:fc04e2c123d8c878e0126b",
        measurementId: "G-HNJ2FR7Y9Z"
    }

    var _FirebaseConfig_TMS = {
        apiKey: "AIzaSyBRqY5x0AqL0ZO6mU0c6cn7UM0QGwzargM",
        authDomain: "png-tms.firebaseapp.com",
        projectId: "png-tms",
        storageBucket: "png-tms.appspot.com",
        messagingSenderId: "680052074782",
        appId: "1:680052074782:web:b7e7cfa830fe3caa53410f",
        measurementId: "G-P3MZ4V4P5K"
    }

    if(window.location.href.indexOf('itoursys') >= 0){
        _ObjClnUrl.APPTMS = window.location.protocol+'//'+window.location.host+'/'
    }

    var IsTMS = (window.location.href.indexOf(_ObjClnUrl.APPTMS) >= 0)
    var IsPngAdmin = (window.location.href.indexOf(_ObjClnUrl.APPB2B_Management) >= 0)
    

    if(IsTMS){
        ArrConfig.strApiURL = "https://demoapi.itoursys.com/";
        ArrConfig.strImgURL = "https://demoapi.itoursys.com/";
        if (location.host.indexOf("localhost:") >= 0) {
            ArrConfig.strApiURL = "http://localhost:4563/";
            // ArrConfig.strImgURL = "http://localhost:4563/";
        }
    }

    var ArrLS = { UrlBeforeLogin:{}
        ,CompanyFriend:{}
        ,Language:{}
        ,Currency:{}
        ,SearchDetail:{}
        ,UserDetail:{}
        ,UserPngDetail:{}
        ,AccessToken:{}
    }
    Object.keys(ArrLS).forEach(function(value){
        ArrLS[value] = {
            set: function(setVal){localStorage.setItem(value,setVal)},
            get: function(){return localStorage.getItem(value)},
            remove: function(){localStorage.removeItem(value)},
        }
    })


    var _login = function (options) {
        var defaults = {
            username:'',
            password:'',
            clientid:'APP_USER',
            membertype: 0,
            OnComplete: function () {},
            OnSuccess: function () {},
            OnError: function () {},
        }
        options = $.extend(defaults, options);
        
        var url = ArrConfig.strApiURL  + "oauth/token";
        var post = "grant_type=password&client_id="+options.clientid+"&username=" + options.username + "&password=" + options.password;
        if(options.membertype)
            post+='&intMemberTypeID='+options.membertype
        $.ajax({
            type: 'POST',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                pngElm.getLoading({IsLoading:true})
            },
            data: post,
            dataType: 'json',
            complete: function() {
                pngElm.getLoading({IsLoading:false})
                options.OnComplete.call()
            },
            success: function (jsondata) {
                if(IsPngAdmin){
                    png.ArrLS.UserPngDetail.set(JSON.stringify(jsondata))
                    options.OnSuccess.call(this,jsondata)
                }else{
                    var ArrUser = {
                        access_token: jsondata['access_token']
                        ,intMemberTypeID: options.membertype
                    }
                    
                    var urlApi,objInput
                    if(!IsTMS){
                        if(options.membertype == 1 || options.membertype == 2){
                            urlApi = 'api/user/GetMemberDetail'
                            objInput = null
                            if(options.membertype == 1)
                                ArrUser['typemodule'] = 'front-end'
                            else if(options.membertype == 2)
                                ArrUser['typemodule'] = 'back-end'
                        }
                        if(options.membertype == 3){
                            urlApi = 'api/guide/GetMemberDetail'
                            objInput = {strGDUserGUID:jsondata['strUserGUID']}
                            ArrUser['typemodule'] = 'back-end'
                        }
                        if(options.membertype == 4){
                            urlApi = 'api/infosupp/GetMemberDetail'
                            objInput = {strSPUserGUID:jsondata['strUserGUID']}
                            ArrUser['typemodule'] = 'back-end'
                        }
                        if(options.membertype == 5){
                            urlApi = 'api/traveller/GetMemberDetail'
                            objInput = {strPassengerGUID:jsondata['strUserGUID']}
                            ArrUser['typemodule'] = 'back-end'
                        }
                    }else{
                        urlApi = 'api/user/GetMemberDetail'
                        objInput = {strUserGUID:jsondata['strUserGUID']}
                    }
                    

                    
                    png.ArrLS.UserDetail.set(JSON.stringify(ArrUser))

                    var objAjax = {
                        url: urlApi
                        , OnSuccess: function (data) {
                            ArrUser = $.extend(ArrUser, JSON.parse(data)[0][0]);

                            png.ArrLS.UserDetail.set(JSON.stringify(ArrUser))
                            
                            options.OnSuccess.call(this,jsondata)
                        }
                    }
                    if(objInput){
                        objAjax['data'] = { strJson: JSON.stringify(objInput) }
                        png.post(objAjax)
                    }else{
                        png.get(objAjax)
                    }

                }
            },
            error: function (respond) {
                pngElm.ViewNotifyCnt({
                    respond:respond,
                    arrCustomNof:[{400:"<i class='fa  fa-times-circle' style='color: red;font-size:24px; cursor:pointer'></i> <span langkey='pg_Login_Txt_WrongPassword'>   </span>"}],
                    strURL: url,
                    objParams: post
                })
                options.OnError.call(this,respond)
            }
        });
    }

    var _login_ImgUrl = function (options) {
        var defaults = {
            username:'',
            password:'',
            clientid:'APP_USER',
            membertype: 0,
            OnComplete: function () {},
            OnSuccess: function () {},
            OnError: function () {},
        }
        options = $.extend(defaults, options);
        
        var url = ArrConfig.strImgURL  + "oauth/token";
        var post = "grant_type=password&client_id="+options.clientid+"&username=" + options.username + "&password=" + options.password;
        if(options.membertype)
            post+='&intMemberTypeID='+options.membertype
        $.ajax({
            type: 'POST',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                pngElm.getLoading({IsLoading:true})
            },
            data: post,
            dataType: 'json',
            complete: function() {
                pngElm.getLoading({IsLoading:false})
                options.OnComplete.call()
            },
            success: function (jsondata) {
                if(IsPngAdmin){
                    if(JSON.parse( png.ArrLS.UserPngDetail.get())){
                        var obj = JSON.parse( png.ArrLS.UserPngDetail.get())
                        obj['access_token_ImgUrl'] = jsondata['access_token']
                        png.ArrLS.UserPngDetail.set(JSON.stringify(obj))
                        options.OnSuccess.call(this,jsondata,true)
                    }else{
                        options.OnSuccess.call(this,jsondata,false)
                    }
                }else{
                    if(JSON.parse( png.ArrLS.UserDetail.get())){
                        var obj = JSON.parse( png.ArrLS.UserDetail.get())
                        obj['access_token_ImgUrl'] = jsondata['access_token']
                        png.ArrLS.UserDetail.set(JSON.stringify(obj))
                        options.OnSuccess.call(this,jsondata,true)
                    }else{
                        options.OnSuccess.call(this,jsondata,false)
                    }

                }
            },
            error: function (respond) {
                pngElm.ViewNotifyCnt({
                    respond:respond,
                    arrCustomNof:[{400:"Login Error!"}]
                })
                options.OnError.call(this,respond)
            }
        });
    }

    var checkRefreshToken = null
    var _refreshToken = function (strUrl,fCallBlack) {
        var username,password,clientid
        var membertype = 0
        if(IsPngAdmin){
            if(Cookies.get('PNGusername') && Cookies.get('PNGpassword')){
                username = Cookies.get('PNGusername')
                password = Cookies.get('PNGpassword')
            }
            clientid = 'APP_PNG_USER'
        }else{
            if(Cookies.get('B2Busername'+_APPB2B_Type) && Cookies.get('B2Bpassword'+_APPB2B_Type)){
                username = Cookies.get('B2Busername'+_APPB2B_Type)
                password = Cookies.get('B2Bpassword'+_APPB2B_Type)

                membertype = Cookies.get('B2Bmembertype'+_APPB2B_Type)
            }
            clientid = 'APP_USER'
        }
        // else{
        //     username = localStorage.getItem('B2Busername')
        //     password = localStorage.getItem('B2Bpassword')
        // }
        // var fSuccess = function () {
        //     console.log(JSON.parse(localStorage.getItem("CURRENT_USER")));
        // }
        if(username && password){
            pngElm.getLoading({IsLoading:true})
            if(checkRefreshToken == null)
                checkRefreshToken = 0
            checkRefreshToken+=1

            if(checkRefreshToken==1){
                if(strUrl.indexOf(ArrConfig.strImgURL)>=0 && ArrConfig.strImgURL != ArrConfig.strApiURL)
                    _login_ImgUrl({
                        username: username,
                        password: password,
                        clientid: clientid,
                        membertype: membertype,
                        OnSuccess: function (jsondata,IsSuccess) {
                            checkRefreshToken=null
                            if(IsSuccess)
                                fCallBlack();
                        },
                        OnError: function (respond) {
                            checkRefreshToken=null
                        }
                    })
                else
                    _login({
                        username: username,
                        password: password,
                        clientid: clientid,
                        membertype: membertype,
                        OnSuccess: function (jsondata) {
                            checkRefreshToken=null
                            fCallBlack();
                        },
                        OnError: function (respond) {
                            _logout();
                        }
                    })
            }else if(checkRefreshToken<100){
                CallAgain()
                function CallAgain(){
                    if(checkRefreshToken==null)
                        fCallBlack()
                    else 
                        setTimeout(function(){ CallAgain(); }, 100);
                }
                // setTimeout(function(){ fCallBlack(); }, 1000);
            }
        }
        else
            _logout();
    }


    var _getCurrenToken = function (strUrl) {

        var strUserData = png.ArrLS.UserDetail.get();
        if (IsPngAdmin) {
            strUserData = png.ArrLS.UserPngDetail.get();
        }
        if (strUserData == null || strUserData == undefined) {
            return null;
        }
        else {
            var ArrToken = JSON.parse(strUserData)
            var strRtn = ''
            if(strUrl.indexOf(ArrConfig.strImgURL)>=0 && ArrConfig.strImgURL != ArrConfig.strApiURL)
                strRtn= ArrToken.access_token_ImgUrl
            else
                strRtn= ArrToken.access_token

            return strRtn;
        }
    }

    var ObjList_ArrApi={}
    var ArrApi=[]
    var _ReturnAjax = function (options,prmMethod) {
        var defaults = {
            url: "",
            data: null,
            OnSuccess: function (data) {},
            OnError: function (data) {},
        }
        options = $.extend(defaults, options);

        
            
        var ExecFunction = function (options,prmMethod,OnSuccess) {
            var strUrl = (('||'+options.url).indexOf("||http")>=0? '': ArrConfig.strApiURL) + options.url
            var data = options.data

            var jsonAjax = {
                type: prmMethod,
                url: strUrl,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _getCurrenToken(strUrl));
                    pngElm.getLoading({IsLoading:true})
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                complete: function() {

                },
                success: function (data) {
                    OnSuccess()
                    if(Object.keys(ObjList_ArrApi).length==0){
                        pngElm.getLoading({IsLoading:false})
                    }

                    options.OnSuccess.call(this, data);

                    pngElm.ChangeLanguage()
                },
                error: function (respond) {
                    if (respond.status == 401) {
                        //Lỗi xác thực đăng nhập
                        _refreshToken(strUrl,function(){ExecFunction(options,prmMethod,OnSuccess)})
                    }
                    else {
                        OnSuccess()
                        if(Object.keys(ObjList_ArrApi).length==0){
                            pngElm.getLoading({IsLoading:false})
                        }
                        pngElm.ViewNotifyCnt({
                            respond:respond
                            ,strURL: strUrl
                            ,objParams: data
                        })
                        options.OnError.call(this, respond);
                    }
                }
            }
            if(prmMethod == "POST"){
                jsonAjax['data'] = data
            }

            $.ajax(jsonAjax);
        }

        var intCallApiPerTime = 10
        var intNoOfWhile = 0

        var totalRtn = 0
        var totalRtnAjax = 0

        ArrApi.push({options: options,prmMethod: prmMethod})
        if(ArrApi.length==1){
            setTimeout(function(){
                // var i = ObjList_ArrApi.length
                // ObjList_ArrApi.push(ArrApi)

                var i = 0
                if(Object.keys(ObjList_ArrApi).length)
                    i = ObjList_ArrApi[Object.keys(ObjList_ArrApi).length-1] + 1
                
                ObjList_ArrApi[i] = ArrApi
                ArrApi = []
                CallApi(i) 
            }, 100);
        }

        function CallApi(key){
            var ArrApi_Item = ObjList_ArrApi[key]
            intNoOfWhile ++

            totalRtn = 0
            totalRtnAjax = 0

            var intMinKey = 0
            var intMaxKey = 0
            if(intCallApiPerTime){
                intMinKey = (intNoOfWhile - 1) * intCallApiPerTime
                intMaxKey = intNoOfWhile * intCallApiPerTime

                if(intMaxKey > ArrApi_Item.length)
                    intMaxKey = ArrApi_Item.length
            }else{
                intMaxKey = ArrApi_Item.length
            }
            
            for(var i = intMinKey;i < intMaxKey;i++){
                totalRtn++
                
                ExecFunction(ArrApi_Item[i].options,ArrApi_Item[i].prmMethod,function(){
                    totalRtnAjax++
                    if(totalRtn==totalRtnAjax){
                        
                        if(intMaxKey == ArrApi_Item.length)
                            delete ObjList_ArrApi[key]
                            // ObjList_ArrApi.splice(key,1)
                        else
                            CallApi(key)
                    }
                });
            }

        }
        


        // if (_getCurrenToken() || IsPublic ) 
            // ExecFunction();
        // else
        //     _refreshToken(ExecFunction);

    }
    
    var _logout = function () {

        var Obj = JSON.parse(png.ArrLS.UserDetail.get())


        if(Obj.intMemberTypeID == 3){
            Obj.strUserGUID = Obj.strGDUserGUID
        }
        
        if(Obj.intMemberTypeID == 5){
            Obj.strUserGUID = Obj.strTLUserGUID
        }

        var ObjList_Api = {
            AddActionLogByLogOut:{
                strApiLink:'api/log/AddActionLogByLogOut'
                ,objParams:{
                    strUserGUID: null,
                    intMemberTypeID: null,
                }
            }
        }
        
        sessionStorage.clear()

        if(IsPngAdmin){
            png.ArrLS.UserPngDetail.remove();
            if(Cookies.get('PNGusername') && Cookies.get('PNGpassword')){
                Cookies.remove('PNGusername')
                Cookies.remove('PNGpassword') 
            }
            window.location.href='/'
        }
        else if(IsTMS){
            localStorage.clear()

            if(Cookies.get('B2Busername'+_APPB2B_Type) && Cookies.get('B2Bpassword'+_APPB2B_Type)){
                Cookies.remove('B2Busername'+_APPB2B_Type)
                Cookies.remove('B2Bpassword'+_APPB2B_Type) 
                Cookies.remove('B2Bmembertype'+_APPB2B_Type) 
            }
            window.location.href="/"
        }
        else{
            // var UserPngDetail = png.ArrLS.UserPngDetail.get();
            png.postListApiGetValue({           // Post list các Api phía trên và lấy về dữ liệu
                objList_Api: ObjList_Api            // Tên các Object api đã khai báo phía trên 
                ,objListApi_RtnVal: {           // Giá trị nhận về từ API
                    'AddActionLogByLogOut':{               // Tên api tương ứng với giá trị trả về
                        objParams_Cus: Obj
                        ,OnSuccess: function(data){
                            
                            // var Language = png.ArrLS.Language.get();
                            localStorage.clear()
                            // png.ArrLS.UserPngDetail.set(UserPngDetail);
                            // png.ArrLS.Language.set(Language);

                            if(Cookies.get('B2Busername'+_APPB2B_Type) && Cookies.get('B2Bpassword'+_APPB2B_Type)){
                                Cookies.remove('B2Busername'+_APPB2B_Type)
                                Cookies.remove('B2Bpassword'+_APPB2B_Type) 
                                Cookies.remove('B2Bmembertype'+_APPB2B_Type) 
                            }
                            window.location.href="/"
                        }
                    }
                }
            })
        }
        // else{
        //     localStorage.removeItem('B2Busername')
        //     localStorage.removeItem('B2Bpassword')
        // }
        // coreLoadPage.loadLogin();
    }

    // var _postClt = function (options) {
    //     var defaults = {
    //         fileAspx: "",
    //         func: "",
    //         dataJSON: "",
    //         OnSuccess: function (data) {},
    //         OnError: function (data) {}
    //     }
    //     options = $.extend(defaults, options);
    //     $.ajax({
    //         type:'POST',
    //         url:'system/'+options.fileAspx.replace('.aspx','')+'.aspx/'+options.func,
    //         data: JSON.stringify(options.dataJSON),
    //         contentType: "application/json; charset=utf-8",
    //         dataType : "json",
    //         success:function(data){
    //             options.OnSuccess.call(this,data.d)
    //         },
    //         error:function(respond){
    //             options.OnError.call(this,respond)
    //         }
    //     })
    // }

    // var _uploadFiles = function (options) {
    //     var defaults = {
    //         idOrClassInputFile: '#Default',
    //         path: "",
    //         OnSuccess: function (data) {},
    //         OnError: function (data) {}
    //     }
    //     options = $.extend(defaults, options);
        
    //     var files = $(options.idOrClassInputFile).get(0).files;
    //     var data = new FormData();
    //     for (var i = 0; i < files.length; i++) {
    //         data.append(files[i].name, files[i]);
    //     }
        
    //     $.ajax({
    //         url: "system/UploadFile.ashx?path="+options.path,
    //         type: "POST",
    //         data: data,
    //         contentType: false,
    //         processData: false,
    //         success: function (data) { 
    //             options.OnSuccess.call(this,JSON.parse(data))
    //         },
    //         error: function (err) { 
    //             options.OnError.call(err)
    //         }
    //     });
    // }
    var _postFiles = function (options) {
        var defaults = {
            data: [],
            url: "",
            OnSuccess: function (data) {}
        }
        options = $.extend(defaults, options);
        
        var url = (('||'+options.url).indexOf("||http")>=0? '': ArrConfig.strApiURL) + options.url;

        $.ajax({
            url: url,
            type: "POST",
            data: options.data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _getCurrenToken(url));
                pngElm.getLoading({IsLoading:true})
            },
            contentType: false,
            processData: false,
            complete: function() {
                pngElm.getLoading({IsLoading:false})
            },
            success: function (data) {
                options.OnSuccess.call(this, data);
            },
            error: function (respond) {
                if (respond.status == 401) {
                    //Lỗi xác thực đăng nhập
                    _refreshToken(url,function(){_postFiles(options)})
                }else{
                    pngElm.getLoading({IsLoading:false})
                    pngElm.ViewNotifyCnt({
                        respond:respond
                        ,strURL: url
                        ,objParams: options.data
                    })
                }
            }
        });
    }

    var _postValCode = function (options) {
        var defaults = {
            strCombocode: '000',
            strWhere: "",
            OnSuccess: function (data) {}
        }
        options = $.extend(defaults, options);
        
        
        var ArrValCode = []
        if(sessionStorage.getItem('ObjValCode')){
            ArrValCode = JSON.parse(sessionStorage.getItem('ObjValCode'))[options.strCombocode]
        }

        if(ArrValCode && ArrValCode.length && !options.strWhere){
            options.OnSuccess.call(this,ArrValCode)
        }
        else
            png.post({
                url: "api/public/GetComboboxByCode",
                data: {
                    strCombocode: options.strCombocode
                    , strWhere: options.strWhere
                },
                OnSuccess: function (data) {
                    var ArrRtn = []
                    data.forEach(function (val) {
                        var obj = {}
                        obj[val.strValueFeild] = val.strTextFeild
                        ArrRtn.push(obj)
                    })

                    var Obj = {}
                    if(sessionStorage.getItem('ObjValCode')){
                        Obj = JSON.parse(sessionStorage.getItem('ObjValCode'))
                    }
                    Obj[options.strCombocode+(options.strWhere? 'w' : '')] = ArrRtn
                    sessionStorage.setItem('ObjValCode',JSON.stringify(Obj))
                    options.OnSuccess.call(this,ArrRtn)
                }
            })
        
    }

    var _postList = function (options) {
        var defaults = {
            objApi:{
                strApiLink: ''
                ,objParams:{
    
                }
            },
            arrInput: [],
            intCallApiPerTime:1,
            //GEN
            OnSuccessItem: function (data) {},
            OnSuccess: function (data) {}
        }
        options = $.extend(defaults, options);
        
        
        var intNoOfWhile = 0

        var totalRtn = 0
        var totalRtnAjax = 0

        if(options.arrInput && options.arrInput.length != 0){
            CallApi()
        }else{
            options.OnSuccess.call()
        }
        function CallApi(){
            intNoOfWhile ++

            totalRtn = 0
            totalRtnAjax = 0

            var intMinKey = 0
            var intMaxKey = 0

            if(options.intCallApiPerTime){
                intMinKey = (intNoOfWhile - 1) * options.intCallApiPerTime
                intMaxKey = intNoOfWhile * options.intCallApiPerTime

                if(intMaxKey > options.arrInput.length)
                    intMaxKey = options.arrInput.length
            }else{
                intMaxKey = options.arrInput.length
            }


            for(var i = intMinKey;i < intMaxKey;i++){
                totalRtn++
                
                var objRtnItem = JSON.parse(JSON.stringify(options.objApi.objParams))
                Object.keys(objRtnItem).forEach(function (valCol) {
                    if (typeof options.arrInput[i][valCol] != 'undefined')
                        objRtnItem[valCol] = options.arrInput[i][valCol]
                })
                png.post({
                    url: options.objApi.strApiLink, data: {strJson : JSON.stringify(objRtnItem)}
                    ,OnSuccess: function (data) {
                        options.OnSuccessItem.call(this,objRtnItem,data)
                        totalRtnAjax++
                        if(totalRtn==totalRtnAjax){
                            
                            if(intMaxKey == options.arrInput.length)
                                options.OnSuccess.call()
                            else
                                CallApi()
                        }
                    }
                })
            }

        }
        // options.arrInput.forEach(function(value,key){
        //     totalRtn++

        //     var objRtnItem = JSON.parse(JSON.stringify(options.objDataInput))
        //     Object.keys(objRtnItem).forEach(function (valCol) {
        //         if (typeof value[valCol] != 'undefined')
        //             objRtnItem[valCol] = value[valCol]
        //     })

        //     png.post({
        //         url: options.urlApi, data: {strJson : JSON.stringify(objRtnItem)}
        //         ,OnSuccess: function () {
        //             totalRtnAjax++
        //             if(totalRtn==totalRtnAjax){
        //                 options.OnSuccess.call()
        //             }
        //         }
        //     })
        // })

    }

    var _postSendEmail = function (options) {
        var defaults = {
            strUserGUID:null
            ,strEmailsSendTo: null
            ,strEmailsCC: null
            ,strEmailsBCC: null
            ,strEmailTemplateSubject: ''
            ,IsBodyHtml: 1
            ,strEmailTemplateContent: ''
            ,strTempApiUrl:''
            ,objTempPar:{}
            
            ,OnSuccess: function (data) {}
        }
        options = $.extend(defaults, options);
        
        var Str_SendTo = options.strEmailsSendTo
        var Str_CC = options.strEmailsCC
        var Str_BCC = options.strEmailsBCC
        var Str_Subject = options.strEmailTemplateSubject
        var Str_Body = options.strEmailTemplateContent

        if(options.strTempApiUrl){
            png.post({
                url: options.strTempApiUrl, data: {strJson : JSON.stringify(options.objTempPar)}
                ,OnSuccess: function (data) {
                    var arr = JSON.parse(data)[0]
                    if(arr.length){
                        arr.forEach(function(value){

                            if(value.strEmailsSendTo){
                                Str_SendTo= value.strEmailsSendTo
                            }else{
                                Str_SendTo = null
                            }
                            if(value.strEmailsCC){
                                Str_CC= value.strEmailsCC
                            }else{
                                Str_CC = null
                            }
                            if(value.strEmailsBCC){
                                Str_BCC= value.strEmailsBCC
                            }else{
                                Str_BCC = null
                            }
                            if(value.strEmailTemplateSubject){
                                Str_Subject= value.strEmailTemplateSubject
                            }else{
                                Str_Subject = null
                            }
                            Str_Body = value.strEmailTemplateContent
        
                            GetSendEmail()
                        })
                    }
                }
            })
        }else{
            GetSendEmail()
        }

        function GetSendEmail(){
            if(Str_SendTo){
                var objParams = {
                    strUserGUID: (options.strUserGUID || '')
                    ,strEmailsSendTo: Str_SendTo
                    ,strEmailsCC: Str_CC
                    ,strEmailsBCC: Str_BCC
                    ,strSubject: Str_Subject
                    ,IsBodyHtml: options.IsBodyHtml
                    ,strBody: Str_Body
                }
                png.post({
                    url: "api/public/GetSendEmail", data: {strJson : JSON.stringify(objParams)}
                    ,OnSuccess: function (data) {
                        options.OnSuccess.call(this,data)
                    }
                })
            }else{
                options.OnSuccess.call(this,0)
            }
        }

    }

    var _postListApiGetValue = function (options) {
        var defaults = {
            objList_Api: {}
            ,objList_ComboValue: {}
            ,objListApi_RtnVal: {
                arrOrObjDefault:{
                    objParams_Cus:{}, OnSuccess: function(data){ }
                }
            }
            ,objListComboValue_RtnVal: {
                arrOrObjDefault:{
                    objParams_Cus:{}, OnSuccess: function(data){ }
                }
            }
            ,OnSuccessList:function(data){

            }
        }

        options = $.extend(defaults, options);


        var checkGetListValue = 0
        var checkGetListValue_Total = 0
        var ObjListArr = {}

        var ObjList_Api = options.objList_Api
        var ObjListApi_RtnVal = options.objListApi_RtnVal
        if(ObjList_Api && Object.keys(ObjList_Api).length && Object.keys(ObjListApi_RtnVal) && Object.keys(ObjListApi_RtnVal).length){
            checkGetListValue_Total+= Object.keys(ObjListApi_RtnVal).length
            Object.keys(ObjListApi_RtnVal).forEach(function(value){
                var objDtlApi = ObjList_Api[value]
                var objParams = JSON.parse(JSON.stringify(objDtlApi.objParams)) 

                var objDtlApi_Cus = ObjListApi_RtnVal[value]
                var objParams_Cus = objDtlApi_Cus.objParams_Cus

                Object.keys(objParams).forEach(function(valPar){
                    if (typeof objParams_Cus[valPar] != 'undefined')
                        objParams[valPar] = objParams_Cus[valPar]
                })
                
                png.post({
                    url: objDtlApi.strApiLink,
                    data:  { strJson: JSON.stringify(objParams) },
                    OnSuccess: function (data) {
                        console.log(objDtlApi.strApiLink,objParams,JSON.parse(data))
                        ObjListArr[value] = objDtlApi_Cus.OnSuccess.call(this,data)
                        OnSuccessList()
                    },
                    OnError: function (res) {
                        console.log(objDtlApi.strApiLink,objParams,res.responseJSON)
                    },
                })
            })
        }

        var ObjList_ComboValue = options.objList_ComboValue
        var ObjListComboValue_RtnVal = options.objListComboValue_RtnVal

        if(ObjList_ComboValue && Object.keys(ObjList_ComboValue).length && Object.keys(ObjListComboValue_RtnVal) && Object.keys(ObjListComboValue_RtnVal).length){
            checkGetListValue_Total+= Object.keys(ObjListComboValue_RtnVal).length
            Object.keys(ObjListComboValue_RtnVal).forEach(function(value){
                var objDtlApi = ObjList_ComboValue[value]
                var objParams = JSON.parse(JSON.stringify(objDtlApi)) 

                var objDtlApi_Cus = ObjListComboValue_RtnVal[value]
                var objParams_Cus = objDtlApi_Cus.objParams_Cus

                Object.keys(objParams).forEach(function(valPar){
                    if (typeof objParams_Cus[valPar] != 'undefined')
                        objParams[valPar] = objParams_Cus[valPar]
                })

                if(objParams.strCombocode){
                    png.postValCode({
                        strCombocode: objParams.strCombocode,
                        strWhere: '',
                        OnSuccess: function (data) {
                            ObjListArr[value] = objDtlApi_Cus.OnSuccess.call(this,data)
                            OnSuccessList()
                        }
                    })
                }
                if(objParams.strTableName){
                    $.GetServerDataBySQL({
                        strTableName: objParams.strTableName
                        ,strFeildSelect: objParams.strFeildSelect
                        ,strWhere: objParams.strWhere
                        ,IsNotCache: objParams.IsNotCache
                        ,OnSuccess: function (data) {
                            ObjListArr[value] = objDtlApi_Cus.OnSuccess.call(this,data)
                            OnSuccessList()
                        }
                    })
                }
                
            })
        }


        function OnSuccessList(){
            checkGetListValue ++

            if(checkGetListValue == checkGetListValue_Total){
                options.OnSuccessList.call(this,ObjListArr)
            }
        }

    }

    
    return { ArrLS: ArrLS
        ,ObjClnUrl : _ObjClnUrl
        ,APPB2B_Type : _APPB2B_Type
        ,firebaseConfig : _FirebaseConfig
        ,firebaseConfig_TMS : _FirebaseConfig_TMS
        ,login: function (options) {_login(options)}
        ,logout: function () {_logout()}
        ,getServerURL: function (strURL) {
            return ArrConfig.strApiURL + strURL;
        }
        ,getServerImgURL: function (strURL = null) {
            var strUrlRtn = ArrConfig.strImgURL
            if(strURL)
                strUrlRtn+= strURL

            if((strURL || '').indexOf('.') !=-1)
                strUrlRtn+='?ver='+Math.random().toString(36).substring(4).toUpperCase()

            return strUrlRtn;
        }
        ,get: function (options) {_ReturnAjax(options,"GET")}
        ,post: function (options) {_ReturnAjax(options,"POST")}
        ,postFiles: function (options) {_postFiles(options)}
        ,postValCode: function (options) {_postValCode(options)}
        ,postList: function (options) {_postList(options)}
        ,postSendEmail: function (options) {_postSendEmail(options)}
        ,postListApiGetValue: function (options) {_postListApiGetValue(options)}
    }
}();
