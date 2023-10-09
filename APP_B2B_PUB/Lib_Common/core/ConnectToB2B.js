
var ConnectToB2B = function () {
    var ArrConfig = {
        strAPPKey: "",
        strAPIUrl: "",
        strUserGUID: "",
        IsReloadToken: false,
        strAPITestUrl: "http://localhost:23689/"
    }
    return {
        getConfigDetail: function () {
            return ArrConfig
        },
        clearToken: function () {
            localStorage.removeItem("png_access_token");
        },
        init: function (_Opt) {
            var Dft = {
                OnSuccess: function () {
        
                }
            }
            _Opt = $.extend(Dft, _Opt);

            png.postListApiGetValue({
                objList_Api: {
                    GetB2BRemoteConfig:{         
                        strApiLink:'api/system/GetB2BRemoteConfig' // 
                        ,objParams:{
                            strUserGUID : JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID,
                        }
                    },
                }
                ,objListApi_RtnVal: {
                    'GetB2BRemoteConfig':{
                        objParams_Cus:{}
                        , OnSuccess: function(data){ 
                            var obj = JSON.parse(data)[0][0]
                            ArrConfig = $.pngExtendObj(ArrConfig,obj)
                            
                            _Opt.OnSuccess.call()
                            // if (location.host.indexOf("localhost:") >= 0 && ArrConfig.strAPITestUrl.length>0) {
                            //     ArrConfig.strAPIUrl = ArrConfig.strAPITestUrl;
                            // }
                        }
                    }
                }
            })


        },
        showError: function (respond) {
            var fArrayStruct = function (ArrObj) {
                var intEachIndex = 0;
                var objkey = [];
                $.each(ArrObj, function (key, value) {
                    objkey.push(key);
                });
                return objkey;
            }
           

           
            var ArrMess = {}
            if (respond.responseText != "") {
                ArrMess = JSON.parse(respond.responseText);
            }
            else {
                ArrMess = {
                    exceptionMessage: "Can't connect to api server " + ArrConfig.strAPIUrl+"<br/>Please check you connect to api!"
                }
            }
            $.Confirm({ strContent: ArrMess.exceptionMessage });

        },
        getToken: function () {
            var strTokenData = localStorage.getItem("png_access_token");

            if (strTokenData == null) { strTokenData = ""; }
            return strTokenData;
        },
        post: function (options) {
            var defaults = {
                url: "",
                parameter: null,
                data: {},
                OnSuccess: function (data) {

                }
            }
            options = $.extend(defaults, options);
            var ExecFunction = function () {
                var url = ArrConfig.strAPIUrl + options.url;
                console.log("Token Access: " + ConnectToB2B.getToken());
                $.ajax({
                    type: 'POST',
                    url: url,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + ConnectToB2B.getToken());
                        pngElm.getLoading({IsLoading:true})
                    },
                    data: options.data,
                    contentType: 'application/x-www-form-urlencoded',
                    dataType: 'json',
                    success: function (data) {
                        pngElm.getLoading({IsLoading:false})
                        options.OnSuccess.call(this, data, options.parameter);
                    },
                    error: function (respond) {
                        
                        pngElm.getLoading({IsLoading:false})
                        if (respond.status == 401) {
                            //Lỗi xác thực đăng nhập
                            if (ArrConfig.IsReloadToken == false) {
                                ConnectToB2B.refreshToken(ExecFunction);
                            }
                            else {
                               $.Confirm({ strContent: "Lỗi xác thực đăng nhập application key" });
                               // ConnectToB2B.function.showApiFalse();
                            }
                        }
                        else {
                            ConnectToB2B.showError(respond);
                            //throw new Error({ 'messeger': 'Error connect server' });
                        }
                    }
                });
            }

            if (ConnectToB2B.getToken() == "") {
                ConnectToB2B.refreshToken(ExecFunction);
            }
            else {
                ExecFunction();
            }
        },
        postListApiGetValue:function (options) {
            var defaults = {
                objList_Api_B2B: {}
                ,objListApi_RtnVal: {
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
    
            var objList_Api_B2B = options.objList_Api_B2B
            var ObjListApi_RtnVal = options.objListApi_RtnVal
            if(objList_Api_B2B && Object.keys(objList_Api_B2B).length && Object.keys(ObjListApi_RtnVal) && Object.keys(ObjListApi_RtnVal).length)
                Object.keys(ObjListApi_RtnVal).forEach(function(value){
                    checkGetListValue_Total++
                    var objDtlApi = objList_Api_B2B[value]
                    var objParams = JSON.parse(JSON.stringify(objDtlApi.objParams)) 
    
                    var objDtlApi_Cus = ObjListApi_RtnVal[value]
                    var objParams_Cus = objDtlApi_Cus.objParams_Cus
    
                    Object.keys(objParams).forEach(function(valPar){
                        if (typeof objParams_Cus[valPar] != 'undefined')
                            objParams[valPar] = objParams_Cus[valPar]
                    })
                    
                    ConnectToB2B.post({
                        url: objDtlApi.strApiLink,
                        data:  { strJson: JSON.stringify(objParams) },
                        OnSuccess: function (data) {
                            ObjListArr[value] = objDtlApi_Cus.OnSuccess.call(this,data)
                            OnSuccessList()
                        }
                    })
                })
    
    
    
            function OnSuccessList(){
                checkGetListValue ++
    
                if(checkGetListValue == checkGetListValue_Total){
                    options.OnSuccessList.call(this,ObjListArr)
                }
            }
    
        },
        setToken: function (access_token) {
            localStorage.setItem("png_access_token", access_token);
        },
        refreshToken: function (fCallBlack) {
            var AccessServer = function () {
                var xhr = new window.XMLHttpRequest();
                var url = ArrConfig.strAPIUrl  + "oauth/token";
                var post = "grant_type=password&client_id=APP_TMS_KEY&appkey=" + ArrConfig.strAPPKey;
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
                    success: function (data) {
                        pngElm.getLoading({IsLoading:false})
                        ConnectToB2B.setToken(data.access_token);
                        fCallBlack(data);
                        ArrConfig.IsReloadToken = false;
                    },
                    error: function (respond) {
                        //console.log(respond);
                        pngElm.getLoading({IsLoading:false})
                        var ArrMess = JSON.parse(respond.responseText);
                        $.Confirm({ strContent: "<b style='color:red;'>Error: "+ArrMess.error_description+"</b>", IsAutoClose: false });
                        //ConnectToB2B.ShowReconnect({ errordata: respond, fCallBlack: AccessServer });
                        
                    }
                });

            }
            AccessServer();
        }
    }
}();
