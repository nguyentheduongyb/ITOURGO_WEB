
var ConnectToTMS = function () {
    var ArrConfig = {
        strAPPKey: "",
        strAPIUrl: "",
        strUserGUID: "",
        IsReloadToken: false,
        strAPITestUrl: "http://localhost:4563/"
    }
    return {
       
        init: function (options) {
            var defaults = {
                strCompanyGUID:'',
                OnSuccess: function () {}
            }
            options = $.extend(defaults, options);
            var arrWhere={
                strCompanyGUID: options.strCompanyGUID
            }
            png.post({
                url: "api/system/GetAppKeyConnectTMS",
                data: {strJson : JSON.stringify(arrWhere)},
                OnSuccess: function (data) {
                    pngElm.getLoading({IsLoading:true})
                    var arrTbl_0 = JSON.parse(data)[0];

                    ArrConfig = $.extend(ArrConfig, arrTbl_0[0]);
                    
                    if (location.host.indexOf("localhost:") >= 0 && ArrConfig.strAPITestUrl.length>0) {
                        ArrConfig.strAPIUrl = ArrConfig.strAPITestUrl;
                    }
                    options.OnSuccess.call(this)
                }
            });
        },
        post: function (options) {
            var defaults = {
                strCompanyGUID:"",
                url: "",
                data: {},
                OnSuccess: function (data) {

                }
            }
            options = $.extend(defaults, options);
            ConnectToTMS.init({
                strCompanyGUID:options.strCompanyGUID,
                OnSuccess:function () {
                    if (ConnectToTMS.getToken()) {
                        ExecFunction();
                    }
                    else {
                        ConnectToTMS.refreshToken(ExecFunction);
                    }
                },
            });
            var ExecFunction = function () {
                var url = ArrConfig.strAPIUrl + options.url;
                //console.log("Token Access: " + ConnectToTMS.getToken());
                $.ajax({
                    type: 'POST',
                    url: url,
                    beforeSend: function (xhr) {
                        pngElm.getLoading({IsLoading:true})
                        xhr.setRequestHeader("Authorization", "Bearer " + ConnectToTMS.getToken());
                    },
                    data: options.data,
                    contentType: 'application/x-www-form-urlencoded',
                    dataType: 'json',
                    success: function (data) {                        
                        pngElm.getLoading({IsLoading:false})

                        options.OnSuccess.call(this, data);
                    },
                    error: function (respond) {
                        if (respond.status == 401) {
                            //Lỗi xác thực đăng nhập
                            ConnectToTMS.refreshToken(ExecFunction);
                        }
                        else {        
                            pngElm.getLoading({IsLoading:false})
                            pngElm.ViewNotifyCnt({
                                respond:respond
                            })
                        }
                    }
                });
            }

        },
        refreshToken: function (fCallBlack) {
            var AccessServer = function () {
                var xhr = new window.XMLHttpRequest();
                var url = ArrConfig.strAPIUrl  + "oauth/token";
                var post = "grant_type=password&client_id=APP_B2B_USER&appkey=" + ArrConfig.strAPPKey;
                // var post = "grant_type=password&login_mode=B2BConnectTMS&appkey=" + ArrConfig.strAPPKey;
                $.ajax({
                    type: 'POST',
                    url: url,
                    beforeSend: function (xhr) {        
                        pngElm.getLoading({IsLoading:true})
                        xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        
                    },
                    data: post,
                    dataType: 'json',
                    success: function (data) {
                        // console.log(data)
                        ConnectToTMS.setToken(data.access_token);
                        fCallBlack();
                    },
                    error: function (respond) {        
                        pngElm.getLoading({IsLoading:false})
                        pngElm.ViewNotifyCnt({
                            respond:respond
                        })
                    }
                });

            }
            AccessServer();
        },
        setToken: function (access_token) {
            // localStorage.setItem("png_access_token", access_token);
            png.ArrLS.AccessToken.set(access_token)
        },
        getToken: function () {
            return png.ArrLS.AccessToken.get()
        },
        clearToken: function () {
            png.ArrLS.AccessToken.remove()
        }
    }
}();
