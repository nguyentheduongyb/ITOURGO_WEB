//Copyright by PNGSOFT CORP. 2007-2019.
//File: APP_B2B_PUB\coreSystem.js
//Created:	MrHieu(04/10/2019)
//Edit:
//Description: 
$.ModulePage_BookingDetailMain = function (options) {
    var defaults = {
        strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strPassengerGUID,
        strCompanyGUID: JSON.parse(png.ArrLS.UserDetail.get()).strCompanyGUID,
        strBookingGUID: $.pngGetQSVal("BKID"),
        idOrClass: '',
        isPartner: 1,
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);


    var IdOrClass_Main = options.idOrClass


    var ObjList_Api = {
        GetListPassengerBooking: {
            strApiLink: 'api/traveller/GetListPassengerBooking'
            , objParams: {
                strPassengerGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strBookingCode: null
                , strFilterDateFrom: null
                , strFilterDateTo: null
                , intOrderStatusID: null
                , intPaymentStatusID: null
                , intBookingStatusID: null
                , intCurPage: null
                , intPageSize: null
                , isPartner: 1
                , tblsReturn: "0,3,4,[5],[6]"
            }
        },
        GetCheckPassengerByEmail: {
            strApiLink: 'api/traveller/GetCheckPassengerByEmail'
            , objParams: {
                strEmail: null
            }
        },
        AddPassengerToRegister: {
            strApiLink: 'api/traveller/AddPassengerToRegister'
            , objParams: {
                strCountryGUID: null
                , intSaluteID: null
                , strFirstName: null
                , strLastName: null
                , strMobileNumber: null
                , dtmDateOfBirth: null
                , strPassengerAddress: null
                , strRemark: null
                , strEmail: null
                , IsEnable: 1
                , strUserGUID: options.strUserGUID
            }
        },

        AddOrUpdPassengerBooking: {
            strApiLink: 'api/traveller/AddOrUpdPassengerBooking'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strPassengerGUID: null
            }
        },

        UpdAgentBookingItemDetailForPrice: {
            strApiLink: 'api/booking/UpdAgentBookingItemDetailForPrice'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strListAgentBookingItemDetailGUID: null
            }
        },

        AddAgentBooking: {
            strApiLink: 'api/booking/AddAgentBooking'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
            }
        },
    }

    var ObjList_ComboValue = {
        Arr_SQL: {
            strTableName: ''
            , strFeildSelect: ' AS intID, AS strName'
            , strWhere: 'WHERE IsActive = 1'
        }
    }

    var Obj_BookingDetail = {}
    var Arr_CustomerBooking = []
    var Arr_BookingDetail = []
    var Arr_ListBookingItem = []
    var Arr_ListAgentBookingItemDetail = []
    var Arr_ListBookingByAgentHost = []


    var Obj_CustomerLeader = {}

    var Arr_Markup_Ddl = []

    var Str_PassengerGUID = null


    var Obj_FN_Main = {}

    png.postListApiGetValue({
        objList_Api: ObjList_Api
        , objList_ComboValue: ObjList_ComboValue
        , objListApi_RtnVal: {
            'GetListPassengerBooking': {
                objParams_Cus: {
                    tblsReturn: '[0][1][2][3]'
                }
                , OnSuccess: function (data) {
                    Obj_BookingDetail = JSON.parse(data)[0][0]
                    Arr_CustomerBooking = JSON.parse(data)[1]
                    Arr_BookingDetail = JSON.parse(data)[2]
                    Arr_ListBookingByAgentHost = JSON.parse(data)[3]

                    Obj_CustomerLeader = Arr_CustomerBooking.filter(function (item) { return item.IsLeader })[0]

                    var strAgentBookingItemGUID = ''
                    Arr_ListAgentBookingItemDetail.forEach(function (value, key) {
                        if (value.intCateID == 1) {


                            var intMar = 0
                            if (value.intLevel == 1)
                                intMar = '15px'

                            if (value.intLevel == 2)
                                intMar = '30px'

                            if (!value.strFocGUID) {

                                value['strHtmlAction'] = ''

                                if (strAgentBookingItemGUID != value.strAgentBookingItemGUID) {
                                    strAgentBookingItemGUID = value.strAgentBookingItemGUID

                                    value['strServiceName_View'] = '<div style="margin-left: ' + intMar + '">' + value['strServiceName'] + '</div>'

                                    value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                    value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])


                                    // if(value.intOrderStatusID != 6 && value.IsCancelCharge == 0)
                                    //     value['strHtmlAction']+= '<button class="btn btnCancellation" data="'+key+'">Cancellation</button>'  
                                } else {
                                    value['strServiceName_View'] = ' - ' + value['strServiceName']
                                    value['dtmDateFrom_View'] = ''
                                    value['dtmDateTo_View'] = ''
                                }
                                value['strServiceName_View'] = value['strServiceName_View'] + (value['intProductID'] == 2 && ((value.intQuantityTypeID >= 5 && value.intQuantityTypeID <= 8) || (value.intQuantityTypeID >= 18 && value.intQuantityTypeID <= 25)) ? ' <b>(Giá GIT)</b>' : '')

                                if (value['strPriceListGUID'] && value['IsSystemPriceList'] != 1 && !value['strFocGUID']) {
                                    value['strServiceName_View'] += '<br><i>(' + value['strPriceListName'] + ')</i>'
                                }
                            } else {
                                if (strAgentBookingItemGUID != value.strAgentBookingItemGUID) {
                                    strAgentBookingItemGUID = value.strAgentBookingItemGUID



                                    value['strServiceName_View'] = '<div style="margin-left: ' + intMar + '">' + value['strSupplierName'] + ' - ' + value['strServiceName'] + '</div>'

                                    value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                    value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                                    value['strHtmlAction'] = ''
                                } else {

                                    value['dtmDateFrom_View'] = ''
                                    value['dtmDateTo_View'] = ''
                                }


                            }




                        } else {
                            value['strServiceName_View'] = value['strServiceName']
                            if (value['strTourGUID'])
                                value['strServiceName_View'] = '<a action="ViewTourDetail" intRowID="' + key + '">' + value['strServiceName'] + '</a>'


                            value['strHtmlAction'] = ''

                            if (strAgentBookingItemGUID != value.strAgentBookingItemGUID) {
                                strAgentBookingItemGUID = value.strAgentBookingItemGUID
                                value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])




                                // if(value.intOrderStatusID != 6 && value.IsCancelCharge == 0)
                                //     value['strHtmlAction']+= '<button class="btn btnCancellation" data="'+key+'">Cancellation</button>'  

                            }
                            // value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                            // value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                            // value['strServiceName_View'] = value['strServiceName']
                            // if(value['strTourGUID'])
                            //     value['strServiceName_View'] = '<a action="ViewTourDetail" intRowID="'+key+'">'+value['strServiceName']+'</a>'
                        }

                        if (value['dtmDateFrom_View'])
                            value['dtmDateFromTo_View'] = value['dtmDateFrom_View'] + ' - ' + value['dtmDateTo_View']

                        if (!value.IsMaster) {
                            value['dblPriceUnit_View'] = $.pngFormatPrice(value['dblPriceUnit'])
                        }

                        value.dblPriceTotalAgentView = $.pngFormatPrice(value['dblPriceTotalAgent'])
                    })
                }
            },
        }
        , objListComboValue_RtnVal: {
            Arr_SQL: {
                objParams_Cus: {
                    strTableName: 'MC57'
                    , strFeildSelect: 'MC57_MakupTypeID AS intID,MC57_MakupName AS strName'
                    , strWhere: ' WHERE IsActive=1 ORDER BY MC57_MakupTypeID'

                }, OnSuccess: function (data) {
                    Arr_Markup_Ddl.push({ '0': 'Input Price' })
                    data.forEach(function (value, key) {
                        var obj = {}
                        obj[value.intID] = value.strName
                        Arr_Markup_Ddl.push(obj)
                    });
                }
            }
        }
        , OnSuccessList: function (data) {
            if (Obj_CustomerLeader.strPassengerEmail) {
                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    , objListApi_RtnVal: {
                        'GetCheckPassengerByEmail': {
                            objParams_Cus: {
                                strEmail: Obj_CustomerLeader.strPassengerEmail
                            }
                            , OnSuccess: function (data) {
                                var obj = JSON.parse(data)[0][0]
                                if (obj.strPassengerGUID) {
                                    Str_PassengerGUID = obj.strPassengerGUID
                                }

                                GetMainPanel()
                            }
                        }
                    }
                })
            } else {
                GetMainPanel()
            }
        }
    })


    function GetMainPanel() {

        var objPanel = {
            pnMain: {
                tag: 'div', attr: 'style="background:#F5F7F8"', childTags: [{ div: 'class="row"' }]
                , pnTitle: { tag: 'div', attr: 'class="col-md-12"' }
                , pnDetail: { tag: 'div', attr: 'class="col-md-12"' }
                , pnBookingInfo: { tag: 'div', attr: 'class="col-md-12"' }
                , pnListBookingService: { tag: 'div', attr: 'class="col-md-12"' }
                , pnCustomer: { tag: 'div', attr: 'class="col-md-12"' }
                , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnTitle = function (_idOrClassPn) {
            var IdOrClassPn = _idOrClassPn

            var strUrl = '/user/' + JSON.parse(png.ArrLS.UserDetail.get()).strUserName + '?strKey=ListBooking'
                        
            var strHtml = ''
            strHtml+='<div style="background:#F5F7F8">'
                strHtml+='<div >'
                    strHtml+='<div class="row">'
                        strHtml+='<div class="col-md-12" style="margin-bottom: 15px;">'
                            strHtml+='<a href="'+strUrl+'" style="padding: 12px;float: left; margin-top: 3px;font-size: 30px;"><i class="fa fa-arrow-left"></i></a>'
                            strHtml+='<h1 class="pn-margin-t-b-15" style="display: inline-block;">Booking Detail</h1>'
                            
                        strHtml+='</div>'
                    strHtml+='</div>'
                strHtml+='</div>'
            strHtml+='</div>'
            $(IdOrClassPn).html(strHtml)
        }
        objEvtPanel.pnDetail = function (_idOrClassPn) {
            var IdOrClassPn = _idOrClassPn

            var strHtml = ''
            strHtml += '<div class="pnTbl bg-white pn-round-1em pn-padding-15"></div>'
            $(IdOrClassPn).html(strHtml)

            pngPn.getTable2({
                objApi: null
                , objParams_Cus: null
                , editRltArr: function (arr) {
                    var Arr = []
                    Arr.push(Obj_BookingDetail)
                    return Arr
                }
                , editRlt: function (value, key) {
                    value['dblPriceSubTotal_View'] = $.pngFormatPrice(value.dblPriceSubTotal)
                    value['dblPriceDiscount_View'] = $.pngFormatPrice(value.dblPriceDiscount)
                    value['dblPriceTotal_View'] = $.pngFormatPrice(value.dblPriceTotal)
                    value['dblPricePaid_View'] = $.pngFormatPrice(value.dblPricePaid)
                    value['dblPriceBalance_View'] = $.pngFormatPrice(value.dblPriceBalance)

                    if (value.intOrderStatusID == 3)
                        value.strOrderStatusName_View = value.strOrderStatusName + '<br><b style="color: red;">Time Remaining: <br><span id="pnTimeRemaining"></span></b>'
                    else {
                        value.strOrderStatusName_View = value.strOrderStatusName
                    }
                }
                , objCols: {

                    dtmBookingDate: { name: 'Booked On' }
                    , strOrderBookingCode: { name: 'Booking Code' }
                    , strOrderStatusName_View: { name: 'Booking Status' }
                    // , dblPriceSubTotal_View: { name: 'Sub Total Price' }
                    // , dblPriceDiscount_View: { name: 'Total Discount' }
                    , dblPriceTotal_View: { name: 'Total Price' }
                    , dblPricePaid_View: { name: 'Total Paid' }
                    , dblPriceBalance_View: { name: 'Total Balance' }

                }
                // ,editTableInput:function(){}
                , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                }
                , customEvent: function (_iOrClass_Pn) {

                }
                // ,changeInput:function(){}
                , IsViewCheckBoxMain: false
                , idOrClass: IdOrClassPn + ' .pnTbl'
            })

            if (Obj_BookingDetail.intOrderStatusID == 3) {
                var countDownDate = new Date($.pngFormatDateTime(Obj_BookingDetail.dtmDateDeadline, 'YYYY-MM-DDTHH:mm:ss.sssZ')).getTime();
                // Update the count down every 1 second
                var IsDone = false
                var x = setInterval(function () {

                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Display the result in the element with id="demo"
                    $('#pnTimeRemaining').html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

                    // If the count down is finished, write some text
                    if (distance < 0) {
                        clearInterval(x);
                        $('#pnTimeRemaining').html("EXPIRED");
                        if (IsDone) {
                            location.reload()
                        }

                    } else {
                        IsDone = true
                    }
                }, 1000);
            }



        }


        objEvtPanel.pnBookingInfo = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += '<h3 class="pn-margin-t-30 pn-margin-b-15"><b>Booking Info</b></h3>'
            strHtml += '<div class="bg-white pn-padding-15 pn-round-1em" style="display: flow-root;">'
            strHtml += '<div class="pnCnt"></div>'
            // strHtml+='<span id="pnGenVoucher" style="float: right;display: flex;"></span>'
            strHtml += '</div>'

            $(IdOrClass_Pn).html(strHtml)

            // strHtml = ''
            // if(Obj_BookingDetail.intOrderStatusID ==3){
            //     strHtml += '<button class="btn btn-default">Cancel Booking</button>'
            //     strHtml += ' <button class="btn btn-primary">Generate Voucher</button>'
            // }else if(Obj_BookingDetail.intOrderStatusID ==4){
            //     strHtml += '<select class="form-control" id="ddlTours">'
            //         strHtml += '<option value="">Select Tour</option>'
            //     Arr_ListBookingItem.filter(function(item){return item.strTourGUID}).forEach(function(value){
            //         strHtml += '<option value="'+value.strTourGUID+'">'+value.strServiceName+'</option>'
            //     })
            //     strHtml += '</select>'
            //     strHtml += '<button class="btn btn-default" id="btnViewVoucher">View Voucher</button>'
            // }
            // $('#pnGenVoucher').html(strHtml)

            $('#ddlTours').change(function () {
                // if(this.value){
                $('#btnViewVoucher').attr('disabled', !this.value)
                // }
            }).change()

            $('#btnViewVoucher').click(function () {
                $.ModulePage_BookingDetailMain_PopUpViewVoucher({
                    strUserGUID: options.strUserGUID,
                    strBookingGUID: options.strBookingGUID,
                    arrListBookingItem: Arr_ListBookingItem,
                    objBookingInfo: Obj_BookingDetail

                })
            })

            $('#btnViewQuote').click(function () {
                $.ModulePage_BookingDetailMain_PopUpViewQuote({
                    strUserGUID: options.strUserGUID,
                    strBookingGUID: options.strBookingGUID,
                    arrListAgentBookingItemDetail: Arr_ListAgentBookingItemDetail,
                    objDetailBk: Obj_BookingDetail
                })
            })




            strHtml = ''
            strHtml += '<div class="row">'
            strHtml += "<div class='col-md-4'>Group Size: " + Obj_BookingDetail.intGroupSize + '</div>'
            strHtml += "<div class='col-md-4'>Payable: <a action='ViewPayable'>" + $.pngFormatPrice(Obj_BookingDetail.dblPricePayable) + "</a></div>"
            strHtml += '</div>'
            $(IdOrClass_Pn + " .pnCnt").html(strHtml)


            $('a', IdOrClass_Pn + " .pnCnt").click(function () {
                var action = $(this).attr('action')

                if (action == 'ViewPayable') {
                    $.ModulePage_BookingDetailMain_PopUpPayable({
                        strUserGUID: options.strUserGUID
                        , strCompanyGUID: options.strCompanyGUID
                        , objBookingDetail: Obj_BookingDetail
                        , OnSuccess: function () {
                            location.reload()
                        }
                    })
                }
            })
        }

        objEvtPanel.pnListBookingService = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += '<div class="pn-margin-t-30 pn-margin-b-15" style="display: flow-root;"">'
            strHtml += '<h3 style="display:inline-block"><b>List Booking Services</b></h3>'
            strHtml += '<span class="mobile-pn-float-none mobile-pn-margin-t-15" style="float: right;display: flex;">'
            // strHtml += '    <button class="btn bg-primary pn-round-1em" id="btnSendBooking">Send Booking</button>'
            strHtml += '</span>'
            strHtml += '</div>'
            strHtml += '<div id="pnTabList"></div>'
            strHtml += '<div id="pnTabCnt" style="padding:20px 15px; background:#fff;border-radius:1em;border-top-left-radius:0"></div>'
            // strHtml += '<div class="pnListBtn pn-margin-t-30"></div>'

            $(IdOrClass_Pn).html(strHtml)



            $('#btnSendBooking').click(function () {

                var arr = []
                if (Arr_ListAgentBookingItemDetail.length)
                    arr = Arr_ListAgentBookingItemDetail
                else
                    arr = ArrBookingDetail_View

                $.ModulePage_BookingDetailMain_PopUpViewSendQuote({
                    strUserGUID: options.strUserGUID
                    , arrListAgentBookingItemDetail: arr
                    , arrCustomerList: Arr_CustomerBooking
                    , objBookingDetail: Obj_BookingDetail
                })
            })


            var ArrBookingDetail_View = []
            var intRowID = 0
            Arr_BookingDetail.forEach(function (value) {
                var obj = JSON.parse(JSON.stringify(value))

                intRowID++
                obj.No = intRowID

                if (value.intQuantityTypeID == null && value.intOrder == 100) {
                    intRowID++
                    obj.No = intRowID
                }
                obj.dblPriceUnitAgent = obj.intUnitPrice
                obj.dblPriceTotalAgent = obj.intTotalPrice

                ArrBookingDetail_View.push(obj)
            })
            
            var IntPriceType = null
            
            pnListBookingService_TabPriceCost(IdOrClass_Pn + ' #pnTabCnt')

            strHtml = ''

            if (Obj_BookingDetail.intOrderStatusID != 6) {
                strHtml += '<div class="mobile-pn-margin-b-15" style="display: inline-block;background: #7BC719;padding: 0 7px;border-radius: 1em;">'
                strHtml += '  <select id="ddlServiceType" class="form-control" style="display: inline-block;width: inherit;padding: 0;height: 28px; float: left; margin: 5px 0;"></select>'
                strHtml += '  <button class="btn btn-texticon" id="btnAddMoreService" style="background: #7BC719;color: #fff;"><i class="fa fa-plus-square-o"></i><span>' + pngElm.getLangKey({ langkey: 'sys_Btn_AddMoreService' }) + '</span></button>'
                strHtml += '</div>'
            }
            strHtml += '<button class="btn btn-texticon bg-success txt-white pn-round-1em" id="btnExport" style="background: #f7904d;"><i class="fa fa-print"></i><span>Export</span></button>'
            if (!Str_PassengerGUID)
                strHtml += '<button class="btn btn-texticon bg-white txt-primary pn-round-1em mobile-pn-margin-b-15" style="border: 1px solid;" id="sendRequestAccLeader"><i class="fa fa-users"></i><span langkey="sys_Txt_SendReqAccforLeader" id="titleSendAcc"></span></button>'
            else
                strHtml += '<button class="btn btn-texticon bg-white txt-primary pn-round-1em mobile-pn-margin-b-15" style="border: 1px solid;" id="sendRequestAccLeader"><i class="fa fa-refresh"></i><span>Đồng bộ hóa bảng Booking cho tài khoản Leader</span></button>'

            $(IdOrClass_Pn + " .pnListBtn").html(strHtml)


            // coreLoadPage.viewMenu({
            //     strUserGUID: options.strUserGUID
            //     , strCompanyGUID: null
            //     , OnSuccess: function (_arr) {
            //         var strHtml = ''
            //         _arr.forEach(function (value) {
            //             strHtml += '<option value="' + value.strWebMenuGUID + '">' + value.strMenuName + '</option>'
            //         })
            //         $('#ddlServiceType').html(strHtml)
            //     }
            // })
            $('#btnAddMoreService').click(function () {


                var strUrl = coreLoadPage.getUrlHost()
                strUrl = $.pngGetQSVal('cname', $.pngGetQSVal('cname'), strUrl)
                strUrl = $.pngGetQSVal('menuid', $('#ddlServiceType').val(), strUrl)
                strUrl = $.pngGetQSVal('module', 'home', strUrl)

                window.history.pushState("", "", strUrl);

                var ArrChildAge = []
                Arr_CustomerBooking.forEach(function (value) {
                    if (value.intAgeID == 4)
                        ArrChildAge.push(value.intPassengerAges)
                })

                Obj_BookingDetail.arrChildren = ArrChildAge

                var arrListBookingItem = Arr_ListBookingItem.filter(function (item) { return (!item.IsCancelCharge) })

                Obj_BookingDetail.arrListBookingItem = arrListBookingItem
                Obj_BookingDetail.intTotalOrderBookingItem = arrListBookingItem.length
                coreLoadPage.viewOrderBooking({
                    objOrderDetail: Obj_BookingDetail
                    , IsAdd: true
                })
                coreLoadPage.init()
            })


            $('#btnExport').click(function () {

                $.ModulePage_BookingDetailMain_PopUpViewQuote({
                    strUserGUID: options.strUserGUID
                    , arrListAgentBookingItemDetail: (IntPriceType == 1 ? Arr_BookingDetail : Arr_ListAgentBookingItemDetail)
                    , arrOrderBookingByAgentHost: (IntPriceType == 1 ? Arr_ListBookingByAgentHost : null)
                    , intPriceType: IntPriceType
                })
            })


            $(IdOrClass_Pn).find('#sendRequestAccLeader').click(function () {

                if (Obj_CustomerLeader.strPassengerEmail) {
                    if (Str_PassengerGUID) {
                        Get_PopUpHasPassenger()
                    }
                    else {
                        $.Confirm({
                            strContent: '<span langkey="sys_Cfm_AYS"></span>'
                            , OnSuccess: function () {
                                GetNotPassenger()
                            }
                        })
                    }

                } else {
                    $.Confirm({ strContent: '<span langkey="sys_Txt_InputEmailLeader"></span>' });
                }


                function GetNotPassenger() {
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        , objListApi_RtnVal: {
                            'AddPassengerToRegister': {
                                objParams_Cus: {
                                    strCountryGUID: Obj_CustomerLeader.strCountryGUID
                                    , intSaluteID: Obj_CustomerLeader.intSaluteID
                                    , strFirstName: Obj_CustomerLeader.strPassengerFirstName
                                    , strLastName: Obj_CustomerLeader.strPassengerLastName
                                    , strMobileNumber: Obj_CustomerLeader.strPassengerPhone
                                    , dtmDateOfBirth: Obj_CustomerLeader.dtmPassengerBirthday
                                    , strPassengerAddress: null
                                    , strRemark: Obj_CustomerLeader.strRemark
                                    , strEmail: Obj_CustomerLeader.strPassengerEmail
                                }
                                , OnSuccess: function (data) {

                                    png.postSendEmail({
                                        strUserGUID: null
                                        , strEmailsSendTo: null
                                        , strEmailsCC: ""
                                        , strEmailsBCC: null
                                        , strEmailTemplateSubject: null
                                        , IsBodyHtml: 1
                                        , strEmailTemplateContent: null
                                        , strTempApiUrl: 'api/public/GetEmailRegisterPassenger'
                                        , objTempPar: {
                                            strPassengerGUID: JSON.parse(data)[0][0].strPassengerGUID
                                            , strTemplateCode: "RTV"
                                            , intLangID: $.pngGetLangID()
                                            , strCompanyName: JSON.parse(png.ArrLS.UserDetail.get()).strFullName
                                        }
                                        , OnSuccess: function (data) {
                                            if (data == "1") {
                                                $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailSuccess"></span>' })
                                                // $.modal.popup.remover();
                                                // $("#titleSendAcc").attr("langkey","sys_Txt_SendToAccLeader")
                                            } else {
                                                $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailFail"></span>' })
                                            }
                                        }
                                    })

                                }
                            }
                        }
                    })
                }
                function Get_PopUpHasPassenger() {
                    var Obj_FN_Main = {}
                    pngPn.getPopUp({
                        strTitle: 'Đồng bộ hóa tài khoản Leader'
                        , intTypeSize: 1
                        , OnPanel: GetMainPanel
                        , OnClosePopUp: function () {

                        }
                    })
                    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

                        IdOrClass_Main = _IdOrClassPp
                        Obj_FN_Main.OnClosePp = _OnClosePp

                        // Obj_FN_Main.OnClosePp(true,true)

                        pngPn.getPanelHtml({
                            objPanel: {
                                pnMain: {
                                    tag: 'div', attr: 'class="panel-itl"', childTags: [{ div: 'class="container"' }, { div: 'class="row"' }]
                                    // ,pnForm:{tag:'div',attr:'class="col-md-12"'}
                                    , pnInfor: { tag: 'div', attr: 'class="col-md-12"' }
                                    , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
                                }
                            }
                            , objEvtPanel: {

                                pnForm: function (_idOrClassPn, _objAll, _OnRtn) {
                                    var strHtml = ''
                                    strHtml += '<div class="row" style="">'
                                    strHtml += '<b><span langkey="sys_Txt_AccExist"> </span></b>'
                                    strHtml += '</div>'
                                    $(_idOrClassPn).html(strHtml)

                                    _OnRtn('')
                                },
                                pnInfor: function (_idOrClassPn, _objAll, _OnRtn) {
                                    var strHtml = ''
                                    strHtml += '<div class="row" style=" margin-top: 30px; ">'
                                    strHtml += '<table class="table table-bordered">'
                                    strHtml += '    <tbody>'
                                    strHtml += '        <tr>'
                                    strHtml += '            <th scope="col"><span langkey="sys_Menu_FullName"></span> </th>'
                                    strHtml += '            <th scope="col"><span langkey="">Email</span></th>'
                                    strHtml += '        </tr>'
                                    strHtml += '    </tbody>'
                                    strHtml += '    <tbody>'
                                    strHtml += '        <tr>'
                                    strHtml += '            <td>'
                                    strHtml += '                <div><span id="">' + Obj_CustomerLeader.strPassengerName + '</span></div>'
                                    strHtml += '            </td>'
                                    strHtml += '            <td>'
                                    strHtml += '                <div><span id="">' + Obj_CustomerLeader.strPassengerEmail + '</span></div>'
                                    strHtml += '            </td>'
                                    strHtml += '        </tr>'
                                    strHtml += '    </tbody>'
                                    strHtml += '</table>'
                                    // strHtml+= '    <div class="col-md-6"><label><span langkey="sys_Menu_FullName"></span> </label> '
                                    // strHtml+= '    <div>'+ Obj_CustomerLeader.strPassengerName+'</div></div>'
                                    // strHtml+= '    <div class="col-md-6"><label><span> Email</span> </label> '
                                    // strHtml+= '    <div>'+ Obj_CustomerLeader.strPassengerEmail+'</div></div>'
                                    strHtml += '</div>'
                                    $(_idOrClassPn).html(strHtml)

                                }
                                , pnBtn: function (_IdOrClassPn, _objAll, _OnRtn) {

                                    var strHtml = ''
                                    strHtml += '<div class="row">'
                                    strHtml += '<div style=" margin-top: 30px; ">'
                                    strHtml += '<div >'
                                    strHtml += '<button type="button" class="btn bg-primary" id="send">Đồng bộ hóa</button>'
                                    strHtml += '</div>'
                                    strHtml += '</div>'
                                    strHtml += '</div>'
                                    $(_IdOrClassPn).html(strHtml)

                                    $(_IdOrClassPn + " #send").click(function () {
                                        png.postListApiGetValue({
                                            objList_Api: ObjList_Api
                                            , objListApi_RtnVal: {
                                                'AddOrUpdPassengerBooking': {
                                                    objParams_Cus: {
                                                        strPassengerGUID: Str_PassengerGUID
                                                    }
                                                    , OnSuccess: function (data) {
                                                        $.Confirm({ strContent: '<span langkey="sys_Menu_Success"></span>' })
                                                        Obj_FN_Main.OnClosePp(true, true)
                                                    }
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                            , idOrClass: IdOrClass_Main
                            , OnChangeIdPn: function (_Fn) {
                                Obj_FN_Main.pnMain = _Fn
                            }
                        })

                    }

                }


            })







            function pnListBookingService_TabPriceCost(_idOrClass) {
                var IdOrClass_Pn_Item = _idOrClass
                $(IdOrClass_Pn_Item).html('')

                var strHtml = ''
                Arr_ListBookingByAgentHost.forEach(function (value, key) {
                    strHtml = ''
                    strHtml += '<div class="pn-margin-t-b-15"><b>' + (key + 1) + '. </b>' + value.strCompanyName + (value.strCompanyPhone ? ' - <b>Phone:</b> ' + value.strCompanyPhone : '') + (value.strCompanyEmail ? ' - <b>Email:</b> ' + value.strCompanyEmail : '') + ' - <b>Status: ' + value.strOrderStatusName + '</b> (<a action="ViewRequest" intRowID="' + key + '"><b langkey="pg_RP_Feedback"></b></a>)</div>'
                    strHtml += '<div class="' + value.strAgentHostBookingGUID + '"></div>'
                    $(IdOrClass_Pn_Item).append(strHtml)

                    var arr = ArrBookingDetail_View.filter(function (item) { return item.strBookingByAgentHostGUID.toUpperCase() == value.strAgentHostBookingGUID.toUpperCase() })

                    GetListPriceForCompany(arr, IdOrClass_Pn_Item + ' .' + value.strAgentHostBookingGUID)
                })

                function GetListPriceForCompany(_arrPriceTable, _idOrClass) {
                    var IdOrClass_Pn_Item = _idOrClass
                    var ArrPriceTableItem = _arrPriceTable

                    var strBookingItemGUID = ''
                    var strSupplierGUID = ''


                    var objCols = {
                        'No': { name: 'No' }
                        , strServiceName_View: { name: 'Service Name' }
                        , dtmDateFromTo_View: { name: 'Date From - Date To' }
                        , intQuantity: { name: 'Quantity', strAttrTD: 'style="text-align:right"' }
                        , intUnitPrice_FN: { name: 'Unit Price', strAttrTD: 'style="text-align:right"' }
                        , intTotalPrice_FN: { name: 'Total Price', strAttrTD: 'style="text-align:right"' }
                        , strHtmlAction: { name: 'Action' }
                        , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
                    }

                    if ($(window).width() < 767) {
                        objCols = {
                            'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }

                            , strServiceName_View: {
                                name: 'Service Name', strAttrTD: "style='vertical-align: top' "
                                , list_input: {

                                    strServiceName_View: {
                                        title: '', attr: "class='col-md-12' "
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    dtmDateFromTo_View: {
                                        title: '', attr: "class='col-md-12' style='margin-bottom: 5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    strSglDblName_ViewMobile: {
                                        title: '', attr: "class='col-md-12' style='margin-bottom: 5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    intQuantity: {
                                        title: 'Quantity', attr: "class='col-md-12' style='margin: 0'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                }
                            }
                            , intQuantity: {
                                name: 'Unit Price', strAttrTD: "style='vertical-align: top' "
                                , list_input: {

                                    intUnitPrice_FN: {
                                        title: '', attr: "class='col-md-12'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    intTotalPrice_FN: {
                                        title: 'Total Price', attr: "class='col-md-12' style='margin-bottom: 5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    strHtmlAction: {
                                        title: '', attr: "class='col-md-12' style='margin-bottom: 5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                }
                            }
                            , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
                        }

                    }


                    pngPn.getTable2({
                        objApi: null
                        , objParams_Cus: null
                        , editRltArr: function (arr) {
                            console.log(ArrPriceTableItem)
                            return ArrPriceTableItem
                        }
                        , editRlt: function (value, key) {
                            value['No'] = (key + 1)

                            if (value.intCateID == 1) {

                                var intMar = 0
                                if (value.intLevel == 1)
                                    intMar = '15px'

                                if (value.intLevel == 2)
                                    intMar = '30px'

                                if (!value.strFocGUID) {

                                    value['strHtmlAction'] = ''

                                    if (strBookingItemGUID != value.strBookingItemGUID) {
                                        strBookingItemGUID = value.strBookingItemGUID

                                        value['strServiceName_View'] = '<div style="margin-left: ' + intMar + '">' + value['strServiceName'] + '</div>'

                                        value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                        value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                                        if (strSupplierGUID != value.strSupplierGUID) {
                                            strSupplierGUID = value.strSupplierGUID
                                            if (value.intVoucherStatusID == 2)
                                                value['strHtmlAction'] += '<button class="btn bg-success txt-white btnViewVoucher" data="' + key + '" >View Voucher</button>'
                                        }

                                        // if(value.intOrderStatusID != 6 && value.IsCancelCharge == 0)
                                        //     value['strHtmlAction']+= '<button class="btn btnCancellation" data="'+key+'">Cancellation</button>'  
                                    } else {
                                        value['strServiceName_View'] = ' - ' + value['strServiceName']
                                        value['dtmDateFrom_View'] = ''
                                        value['dtmDateTo_View'] = ''
                                    }
                                    value['strServiceName_View'] = value['strServiceName_View'] + (value['intProductID'] == 2 && ((value.intQuantityTypeID >= 5 && value.intQuantityTypeID <= 8) || (value.intQuantityTypeID >= 18 && value.intQuantityTypeID <= 25)) ? ' <b>(Giá GIT)</b>' : '')

                                    if (value['strPriceListGUID'] && value['IsSystemPriceList'] != 1 && !value['strFocGUID']) {
                                        value['strServiceName_View'] += '<br><i>(' + value['strPriceListName'] + ')</i>'
                                    }

                                } else {
                                    if (strBookingItemGUID != value.strBookingItemGUID) {
                                        strBookingItemGUID = value.strBookingItemGUID



                                        value['strServiceName_View'] = '<div style="margin-left: ' + intMar + '">' + value['strSupplierName'] + ' - ' + value['strServiceName'] + '</div>'

                                        value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                        value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                                        value['strHtmlAction'] = ''
                                    } else {

                                        value['dtmDateFrom_View'] = ''
                                        value['dtmDateTo_View'] = ''
                                    }


                                }


                            } else {

                                value['strServiceName_View'] = value['strServiceName']
                                if (value['strTourGUID'])
                                    value['strServiceName_View'] = '<a action="ViewTourDetail" intRowID="' + key + '">' + value['strServiceName'] + '</a>'


                                value['strHtmlAction'] = ''

                                if (strBookingItemGUID != value.strBookingItemGUID) {
                                    strBookingItemGUID = value.strBookingItemGUID
                                    value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                                    value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])



                                    if (strSupplierGUID != value.strSupplierGUID) {
                                        strSupplierGUID = value.strSupplierGUID
                                        if (value.intVoucherStatusID == 2)
                                            value['strHtmlAction'] += '<button class="btn bg-success txt-white btnViewVoucher" data="' + key + '" >View Voucher</button>'
                                    }

                                    // if(value.intOrderStatusID != 6 && value.IsCancelCharge == 0)
                                    //     value['strHtmlAction']+= '<button class="btn btnCancellation" data="'+key+'">Cancellation</button>'  

                                }

                            }


                            if (value['dtmDateFrom_View'])
                                value['dtmDateFromTo_View'] = value['dtmDateFrom_View'] + ' - ' + value['dtmDateTo_View']


                            // value['strServiceName_View'] = value['strServiceName']
                            // if(value['strTourGUID'])
                            //     value['strServiceName_View'] = '<a action="ViewTourDetail" intRowID="'+key+'">'+value['strServiceName']+'</a>'


                            if (value.IsMaster) {

                                value['intUnitPrice_FN'] = ''
                                value['intTotalPrice_FN'] = $.pngFormatPrice(value['intTotalPrice'])
                            } else {

                                value['intUnitPrice_FN'] = $.pngFormatPrice(value['intUnitPrice'])
                                value['intTotalPrice_FN'] = $.pngFormatPrice(value['intTotalPrice'])
                            }
                            // // value['strHtmlAction'] = '<button class="btnDelete btn btn-danger" data="' + key + '"><i class="fa fa-trash"></i></button>'
                            // value['strHtmlAction']=''
                        }
                        , objCols: objCols
                        // ,editTableInput:function(){}
                        , changeCkbMaster: function (IsChecked, intRowID, arrList) {

                            ArrPriceTableItem = arrList
                        }
                        , customEvent: function (_idOrClass_Pn) {

                            ArrPriceTableItem.forEach(function (value, key) {
                                if (value.intOrderStatusID == 6 || value.intOrderStatusID == 7 || value.IsCancelCharge != 0) {
                                    $('button[intRowID=' + key + '].btnCancellation', _idOrClass_Pn).remove()
                                }
                            })

                            $('a', _idOrClass_Pn).click(function () {
                                var intRowID = $(this).attr('intRowID')
                                var action = $(this).attr('action')
                                var obj = ArrPriceTableItem[intRowID]

                                if (action == "ViewTourDetail") {

                                    $.ModulePage_BookingDetailMain_PopUpTourDetail({
                                        strUserGUID: options.strUserGUID
                                        , strTourGUID: obj['strTourGUID']
                                    })
                                }


                            })

                            $('.btnCancellation', _idOrClass_Pn).click(function () {

                                var intRowID = $(this).attr('data')


                                $.ModulePage_BookingDetailMain_PopUpCancelBooking({
                                    strUserGUID: options.strUserGUID
                                    , strCompanyGUID: options.strCompanyGUID
                                    , strBookingItemGUID: ArrPriceTableItem[intRowID].strBookingItemGUID
                                    , objBookingDetail: Obj_BookingDetail
                                    , OnSuccess: function () {
                                        window.location.reload()
                                    }
                                })
                            })

                            $('.btnViewVoucher', _idOrClass_Pn).click(function () {

                                var intRowID = $(this).attr('data')

                                if (ArrPriceTableItem[intRowID].strTourGUID) {

                                    $.ModulePage_BookingDetailMain_PopUpVoucherForTour({
                                        strUserGUID: options.strUserGUID
                                        , strTourGUID: ArrPriceTableItem[intRowID].strTourGUID
                                        , objBookingDetail: Obj_BookingDetail
                                        , objBookingServiceDetail: ArrPriceTableItem[intRowID]
                                        , arrCustomerList: Arr_CustomerBooking
                                    })
                                }

                                if (ArrPriceTableItem[intRowID].strSupplierGUID) {

                                    $.ModulePage_BookingDetailMain_PopUpVoucherForSupp({
                                        strUserGUID: options.strUserGUID
                                        , strSupplierGUID: ArrPriceTableItem[intRowID].strSupplierGUID
                                        , objBookingDetail: Obj_BookingDetail
                                        , objBookingServiceDetail: ArrPriceTableItem[intRowID]
                                        , arrPriceTableItem: ArrPriceTableItem
                                        , arrCustomerList: Arr_CustomerBooking
                                        , objAgentHostDetail: Arr_ListBookingByAgentHost.filter(function (item) { return item.strAgentHostBookingGUID.toUpperCase() == ArrPriceTableItem[intRowID].strBookingByAgentHostGUID.toUpperCase() })[0]
                                    })
                                }
                            })

                        }
                        // ,changeInput:function(){}
                        , IsViewCheckBoxMain: false
                        , idOrClass: IdOrClass_Pn_Item
                    })


                }

                $('a', IdOrClass_Pn_Item).click(function () {
                    var action = $(this).attr('action')
                    if (action == "ViewRequest") {
                        var intRowID = $(this).attr('intRowID')
                        var obj = Arr_ListBookingByAgentHost[intRowID]

                        // $.ModulePage_BookingDetailMain_PopUpSendRequest({
                        //     strUserGUID:options.strUserGUID,
                        //     strBookingGUID:options.strBookingGUID,
                        //     objDetailAgentHost: obj,
                        // })

                        GetPopUp_ViewRequest({
                            objDetail: obj
                        })

                    }
                })



                var strHtml = ''
                strHtml += '<div style="text-align:right;color:red">'
                strHtml += '<b>Price Total: ' + $.pngFormatPrice(Obj_BookingDetail.dblPriceTotal) + '</b><br>'
                strHtml += '</div>'

                $(IdOrClass_Pn_Item).append(strHtml)

            }

            function pnListBookingService_TabMarkup(_idOrClass) {
                var IdOrClass_Pn_Item = _idOrClass

                var strHtml = ''
                strHtml += '<div class="">'
                strHtml += '<div id="pnListPrice"></div>'
                strHtml += '</div>'
                strHtml += '<div id="pnTotalPrice" style="text-align: right;margin: -17px 0 25px;color: red;"></div>'
                strHtml += '<div class="panel-itl" style="display:flow-root">'
                strHtml += '<button class="btn btn-texticon bg-primary viewedit" id="btnSaveAll" style="float:right"><i class="fa fa-floppy-o"></i><span langkey="sys_Btn_Save"></span><span class="intITs"></span></button> '
                strHtml += '</div>'
                $(IdOrClass_Pn_Item).html(strHtml)


                $(IdOrClass_Pn + " .viewedit").attr('disabled', true);


                var Arr_PriceTableAgent_Tour_Temp = JSON.parse(JSON.stringify(Arr_ListAgentBookingItemDetail))

                if (Arr_PriceTableAgent_Tour_Temp.length) {

                    var strHtml = ''
                    Arr_ListBookingByAgentHost.forEach(function (value, key) {
                        strHtml = ''
                        strHtml += '<div class="pn-margin-t-b-15"><b>' + (key + 1) + '. </b>' + value.strCompanyName + (value.strCompanyPhone ? ' - <b>Phone:</b> ' + value.strCompanyPhone : '') + (value.strCompanyEmail ? ' - <b>Email:</b> ' + value.strCompanyEmail : '') + '</div>'
                        strHtml += '<div class="' + value.strAgentHostBookingGUID + '"></div>'
                        $(IdOrClass_Pn + ' #pnListPrice').append(strHtml)

                        var arr = Arr_PriceTableAgent_Tour_Temp.filter(function (item) { return item.strBookingByAgentHostGUID.toUpperCase() == value.strAgentHostBookingGUID.toUpperCase() })

                        GetListPriceForCompany(arr, IdOrClass_Pn + ' #pnListPrice .' + value.strAgentHostBookingGUID)
                    })
                } else {

                    $.Confirm({
                        strContent: 'Bạn có muốn thiết lập giá Markup không?'
                        , OnSuccess: function () {
                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                , objListApi_RtnVal: {
                                    'AddAgentBooking': {
                                        objParams_Cus: {}
                                        , OnSuccess: function (data) {
                                            location.reload()
                                        }
                                    }

                                }
                            })
                        }
                    })


                }

                // GetListPriceForCompany (Arr_PriceTableAgent_Tour_Temp, IdOrClass_Pn+ ' #pnListPrice')

                function GetListPriceForCompany(_arrPriceTable, _idOrClass) {

                    var IdOrClass_Pn_Item2 = _idOrClass
                    var ArrPriceTableItem = _arrPriceTable
                    var strHtml = ''
                    strHtml += '<div class="pnTbl"></div>'
                    $(IdOrClass_Pn_Item2).html(strHtml)


                    // var strAgentBookingItemGUID = ''
                    // ArrPriceTableItem.forEach(function(value,key){
                    //     if(value.intCateID == 1 ){

                    //         if(strAgentBookingItemGUID!=value.strAgentBookingItemGUID){
                    //             strAgentBookingItemGUID=value.strAgentBookingItemGUID

                    //             if(!value['strFocGUID'])
                    //                 value['strServiceName_View'] = value['strSupplierName']+' - '+value['strItemTypeName']+' - '+value['strServiceName']+(value['IsInstantBooking']? ' <b>(Allotment)</b>' : '')
                    //             else
                    //                 value['strServiceName_View'] = value['strSupplierName']+' - '+value['strServiceName']

                    //             value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                    //             value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                    //         }else{
                    //             value['strServiceName_View'] = ' - '+value['strServiceName']
                    //             value['dtmDateFrom_View'] = ''
                    //             value['dtmDateTo_View'] = ''
                    //         }

                    //     }else{
                    //         value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                    //         value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])

                    //         value['strServiceName_View'] = value['strServiceName']
                    //         if(value['strTourGUID'])
                    //             value['strServiceName_View'] = '<a action="ViewTourDetail" intRowID="'+key+'">'+value['strServiceName']+'</a>'
                    //     }
                    //     value['dblPriceUnit_View'] = $.pngFormatPrice(value['dblPriceUnit'])
                    // })

                    var objCols = {
                        'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                        , strServiceName_View: { name: '<span langkey="pg_Dft_TC_OrDtl_ServiceName"></span>' }
                        // ,strDtmDateFreeCancellation: {name:pngElm.getLangKey({langkey:'pg_Dft_TC_OrDtl_FreeCancellationTill'})}
                        , dtmDateFromTo_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateFrom"></span> - <span langkey="pg_Dft_TC_OrDtl_DateTo"></span>' }
                        , strMarkupValue: {
                            name: 'Markup Value',
                            list_input: {
                                intMakupTypeID: {
                                    title: '', attr: "class='col-md-12' ", isRequire: false, IsRtn: true
                                    , input: { type: 'select', classEx: 'form-control', attr: ' style="" ' }
                                    , dropDown: { arrList: Arr_Markup_Ddl }
                                }
                                , dblMarkupService: {
                                    title: '', isRequire: false, attr: " class='pnMarkup col-md-12' style='margin:0;'", IsRtn: true
                                    , input: { type: 'text', classEx: 'form-control', attr: 'input-fn="true" IsDecimal="true" style=""' }
                                }
                            }
                        }
                        , intQuantity: { name: '<span langkey="pg_Dft_TC_OrDtl_TotalPax"></span>' }
                        , dblPriceUnit: {
                            name: '<span langkey="pg_Dft_TC_OrDtl_PriceUnit"></span>',
                            list_input: {
                                dblPriceUnit_View2: {
                                    title: '', attr: "class='col-md-12'style='' "
                                    , input: { IsNoInput: true, IsViewDtl: true }
                                }
                                , dblPriceUnitAgent: {
                                    title: '', isRequire: false, attr: "class='col-md-12' ", IsRtn: true
                                    , input: { type: 'text', classEx: 'form-control input-number', attr: 'input-fn="true" IsDecimal="true" ' }
                                }
                            }
                        }
                        , dblPriceTotalAgentView: { name: '<span langkey="pg_Dft_TC_OrDtl_PriceTotal"></span>', strAttrTD: 'align="right"' }
                        , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
                    }

                    if ($(window).width() < 767) {
                        objCols = {
                            'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }

                            , strServiceName_View: {
                                name: '<span langkey="pg_Dft_TC_OrDtl_ServiceName"></span>', strAttrTD: "style='vertical-align: top' "
                                , list_input: {

                                    strServiceName_View: {
                                        title: '', attr: "class='col-md-12' "
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    dtmDateFromTo_View: {
                                        title: null, attr: "class='col-md-12' style='margin-bottom:5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                    intQuantity: {
                                        title: '<span langkey="pg_Dft_TC_OrDtl_TotalPax"></span>', attr: "class='col-md-12' style='margin-bottom:5px'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                }
                            }
                            , strMarkupValue: {
                                name: 'Markup Value', strAttrTD: "style='vertical-align: top' ",
                                list_input: {
                                    intMakupTypeID: {
                                        title: '<div style="width:60px">Markup Type</div>', attr: "class='col-md-12' style='margin-bottom:10px;'", isRequire: false, IsRtn: true
                                        , input: { type: 'select', classEx: 'form-control', attr: ' style="width: 110px;margin-left:5px" ' }
                                        , dropDown: { arrList: Arr_Markup_Ddl }
                                    }
                                    , dblMarkupService: {
                                        title: '<div style="width:60px">Markup Value</div>', isRequire: false, attr: " class='pnMarkup col-md-12' style='margin-bottom:20px;'", IsRtn: true
                                        , input: { type: 'text', classEx: 'form-control', attr: 'input-fn="true" IsDecimal="true" style="width: 110px;margin-left:5px"' }
                                    }
                                    , dblPriceUnit_View: {
                                        title: '<div style="width:60px">Price Cost:</div>', attr: "class='col-md-12' style='margin-bottom:10px;'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    }
                                    , dblPriceUnitAgent: {
                                        title: '<div style="width:60px">Price Agent</div>', isRequire: false, attr: "class='col-md-12' style='margin-bottom:20px;'", IsRtn: true
                                        , input: { type: 'text', classEx: 'form-control input-number', attr: 'input-fn="true" IsDecimal="true" style="width: 110px;margin-left:5px"' }
                                    }
                                    , dblPriceTotalAgentView: {
                                        title: '<span langkey="pg_Dft_TC_OrDtl_PriceTotal"></span>', attr: "class='col-md-12' style='margin:0'"
                                        , input: { IsNoInput: true, IsViewDtl: true }
                                    },
                                }
                            }
                            , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
                        }

                    }



                    pngPn.getTable2({
                        objApi: null
                        , objParams_Cus: null
                        , editRltArr: function (arr) {
                            return ArrPriceTableItem
                        }
                        , editRlt: function (value, key) {
                            value['No'] = (key + 1)
                            value['dblPriceUnit_View2'] = '(Cost: ' + value['dblPriceUnit_View'] + ')'


                            // valTbl['strHtmlAction']= '<button class="btnDelete btn btn-danger" data="' + keyTbl + '"><i class="fa fa-trash"></i></button>'
                        }
                        , objCols: objCols
                        // ,editTableInput:function(){}
                        , changeCkbMaster: function (IsChecked, intRowID, arrList) {
                            if (IsChecked) {
                                if (arrList[intRowID].intOrderStatusID == 6) {
                                    $(IdOrClass_Pn_Item2 + ' tr[row=' + intRowID + ']').find('input,select').attr('disabled', true)
                                } else {
                                    $(IdOrClass_Pn_Item2 + ' tr[row=' + intRowID + '] td').addClass('bg-selectrow')
                                }
                            }
                            else
                                $(IdOrClass_Pn_Item2 + ' tr[row=' + intRowID + '] td').removeClass('bg-selectrow')


                            if (IsChecked)
                                $('.intMakupTypeID[row=' + intRowID + ']').change()


                            ArrPriceTableItem = arrList

                            ArrPriceTableItem.forEach(function (value) {
                                if (value['intOrderStatusID'] == 6)
                                    value['IsEnableInput'] = 0
                            })
                            // Arr_PriceTableAgent_Tour_Temp.forEach(function(value,key){
                            //     var arr = ArrPriceTableItem.filter(function(item){ return item.strAgentBookingItemDetailGUID.toUpperCase() == value.strAgentBookingItemDetailGUID.toUpperCase()  })

                            //     if(arr.length)
                            //         Arr_PriceTableAgent_Tour_Temp[key] = arr[0]
                            // })
                            // ArrPriceTableItem.forEach(function(value){
                            //     var obj = Arr_PriceTableAgent_Tour_Temp.filter(function(item){ return item.strAgentBookingItemDetailGUID.toUpperCase() == value.strAgentBookingItemDetailGUID.toUpperCase()  })[0]
                            //     obj = value
                            // })

                            var intNoEnableInput = Arr_PriceTableAgent_Tour_Temp.filter(function (item) { return item.IsEnableInput }).length
                            if (intNoEnableInput == 0) {
                                $(IdOrClass_Pn_Item + " .viewedit>span.intITs").text("");
                                $(IdOrClass_Pn_Item + " .viewedit").attr('disabled', true);
                            } else {
                                $(IdOrClass_Pn_Item + " .viewedit>span.intITs").text(" (" + intNoEnableInput + ")");
                                $(IdOrClass_Pn_Item + " .viewedit").attr('disabled', false);
                            }
                        }
                        , customEvent: function (_idOrClassPn) {
                            ArrPriceTableItem.forEach(function (value, key) {
                                $(_idOrClassPn + ' tr[row=' + key + ']').find('.intMakupTypeID').attr('row', key)
                                $(_idOrClassPn + ' tr[row=' + key + ']').find('.dblMarkupService').attr('row', key)
                                if (value.intOrderStatusID == 6 || value.IsMaster == 1) {
                                    $(_idOrClassPn + ' tr[row=' + key + ']').find('.IsEnableInput').remove()
                                }

                                if (value.IsMaster == 1) {
                                    $(_idOrClassPn + ' tr[row=' + key + ']').find('.pn-strMarkupValue').remove()
                                    $(_idOrClassPn + ' tr[row=' + key + ']').find('.pn-dblPriceUnit').remove()
                                }

                            })

                            $(_idOrClassPn).find('.pnElm-dblPriceUnitView').css('margin-left', '5px')


                            $(_idOrClassPn).find('.intMakupTypeID').change(function () {
                                var data = $(this).attr('row')
                                var objDtl = ArrPriceTableItem[data]

                                if (this.value != 0) {
                                    $(IdOrClass_Pn_Item2).find(' tr[row=' + data + '] input.input-number').attr('disabled', true)
                                    $(IdOrClass_Pn_Item2).find(' tr[row=' + data + '] .pnMarkup').show()
                                }
                                else {
                                    if (objDtl.IsEnableInput)
                                        $(IdOrClass_Pn_Item2).find(' tr[row=' + data + '] input.input-number').attr('disabled', false)
                                    $(IdOrClass_Pn_Item2).find(' tr[row=' + data + '] .pnMarkup').hide()
                                }
                            })

                            $(_idOrClassPn).find('.intMakupTypeID,.dblMarkupService').change(function () {
                                var data = $(this).attr('row')

                                var intMakupTypeID = $(_idOrClassPn).find(' tr[row=' + data + '] .intMakupTypeID').val()
                                var dblMarkupService = $(_idOrClassPn).find(' tr[row=' + data + '] .dblMarkupService').val()
                                dblMarkupService = parseFloat(dblMarkupService.replace(',', ''))
                                var objDtl = ArrPriceTableItem[data]


                                if (intMakupTypeID == 1) {
                                    objDtl.dblPriceUnitAgent = objDtl.dblPriceUnit + objDtl.dblPriceUnit / 100 * dblMarkupService
                                    $(_idOrClassPn).find(' tr[row=' + data + '] input.input-number').val(objDtl.dblPriceUnitAgent).change()

                                } else if (intMakupTypeID == 2) {
                                    objDtl.dblPriceUnitAgent = objDtl.dblPriceUnit + dblMarkupService
                                    $(_idOrClassPn).find(' tr[row=' + data + '] input.input-number').val(objDtl.dblPriceUnitAgent).change()
                                }
                                objDtl.dblPriceTotalAgent = objDtl.dblPriceUnitAgent * objDtl.intQuantity
                                $(_idOrClassPn).find('.pn-dblPriceTotalAgentView[row=' + data + ']').html($.pngFormatPrice(objDtl.dblPriceTotalAgent))
                                $(_idOrClassPn).find('[row=' + data + '] .pnElm-dblPriceTotalAgentView').html($.pngFormatPrice(objDtl.dblPriceTotalAgent))

                                GetTotalPriceAgent()
                            })


                            $(_idOrClassPn).find('.input-number').change(function (e) {
                                if (typeof e.originalEvent != 'undefined') {
                                    $(this).change()
                                    var data = $(this).parents('tr').attr('row')
                                    var objDtl = ArrPriceTableItem[data]

                                    objDtl.dblPriceTotalAgent = objDtl.dblPriceUnitAgent * objDtl.intQuantity
                                    $(_idOrClassPn).find('.pn-dblPriceTotalAgentView[row=' + data + ']').html($.pngFormatPrice(objDtl.dblPriceTotalAgent))
                                    $(_idOrClassPn).find('[row=' + data + '] .pnElm-dblPriceTotalAgentView').html($.pngFormatPrice(objDtl.dblPriceTotalAgent))

                                    GetTotalPriceAgent()
                                }
                            })

                            $('a', _idOrClassPn).click(function () {
                                var intRowID = $(this).attr('intRowID')
                                var action = $(this).attr('action')
                                var obj = ArrPriceTableItem[intRowID]

                                if (action == "ViewTourDetail") {

                                    $.ModulePage_BookingDetailMain_PopUpTourDetail({
                                        strUserGUID: options.strUserGUID
                                        , strTourGUID: obj['strTourGUID']
                                    })
                                }


                            })

                        }
                        // ,changeInput:function(){}
                        , IsViewCheckBoxMain: true
                        , idOrClass: IdOrClass_Pn_Item2 + ' .pnTbl'
                    })

                }


                GetTotalPriceAgent()

                function GetTotalPriceAgent() {
                    var dblSumPriceTotalAgent = 0
                    Arr_PriceTableAgent_Tour_Temp.forEach(function (value) {
                        if (value.intOrderStatusID != 6 && !value.IsMaster)
                            dblSumPriceTotalAgent += (value.dblPriceTotalAgent || 0)
                    })

                    var strHtml = ''
                    strHtml += '<b>Sub Total: ' + $.pngFormatPrice(dblSumPriceTotalAgent) + '</b>'
                    $(IdOrClass_Pn_Item + ' #pnTotalPrice').html(strHtml)
                }

                $(IdOrClass_Pn_Item).find('#btnSaveAll').click(function () {

                    var ArrInput = Arr_PriceTableAgent_Tour_Temp.filter(function (item) { return item.IsEnableInput })

                    var strListAgentBookingItemDetailGUID = ''

                    ArrInput.forEach(function (value) {
                        strListAgentBookingItemDetailGUID += value.strAgentBookingItemDetailGUID + '!' + value.intMakupTypeID + '!' + value.dblMarkupService + '!' + value.dblPriceUnitAgent + '#'
                    })

                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        , objListApi_RtnVal: {
                            'UpdAgentBookingItemDetailForPrice': {
                                objParams_Cus: {
                                    strListAgentBookingItemDetailGUID: strListAgentBookingItemDetailGUID
                                }, OnSuccess: function (data) {
                                    window.location.reload()
                                }
                            }
                        }
                    })


                })

            }

        }

        objEvtPanel.pnCustomer = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += '<h3 class="pn-margin-t-b-30" style="display:inline-block"><b>List Customer</b></h3>'
            strHtml += '<div class="pnTbl bg-white pn-round-1em pn-padding-15"></div>'
            $(IdOrClass_Pn).html(strHtml)


            $.ModulePage_BookingDetailMain_CustomerList({
                strUserGUID: options.strUserGUID
                , strCompanyPartnerGUID: null
                , strCompanyOwnerGUID: null
                , strBookingGUID: options.strBookingGUID
                , arrCustomerList: Arr_CustomerBooking
                , arrCountry: null
                , arrSalute: null
                , arrAge: null
                , dtmDateFrom: Obj_BookingDetail.dtmDateFrom
                , objBookingDetail: Obj_BookingDetail
                , idOrClass: IdOrClass_Pn + " .pnTbl"
            })
        }

        objEvtPanel.pnBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            if (Obj_BookingDetail.intOrderStatusID != 6) {
                strHtml += '<div class="pn-margin-t-30 pn-margin-b-15" align="right"><button id="btnCancellationAll" class="btn btn-default">Cancellation Booking</button></div>'
            }
            $(IdOrClass_Pn).html(strHtml)


            $('#btnCancellationAll', IdOrClass_Pn).click(function () {

                $.ModulePage_BookingDetailMain_PopUpCancelBooking({
                    strUserGUID: options.strUserGUID
                    , strCompanyGUID: options.strCompanyGUID
                    , strBookingItemGUID: null
                    , objBookingDetail: Obj_BookingDetail
                    , OnSuccess: function () {
                        window.location.reload()
                    }
                })
            })


        }


        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })

    }



    function GetPopUp_ViewRequest(_Opt) {
        var Dft = {
            objDetail: {},
            IsDuplicate: null,
            OnSuccess: function () {

            }
        }
        _Opt = $.extend(Dft, _Opt);

        console.log('Function', _Opt)

        var IdOrClass_Main = ''

        var Is_Create = false
        var Is_Edit = false
        var Is_Duplicate = false

        var Obj_Detail = _Opt.objDetail
        // var Obj_Detail = options.objDetail

        //---------Obj_XXX      // Khai báo các biến dùng chung cho cả hàm
        //---------Arr_XXX
        //---------Is_XXX
        //---------Int_XXX
        //---------Str_XXX


        if (Object.keys(Obj_Detail).length) {
            Is_Edit = true
        } else {
            Is_Create = true
        }
        if (_Opt.IsDuplicate) {
            Is_Edit = false
            Is_Duplicate = true
        }

        var Arr_TypeOfComment_Ddl = []
        var Arr_Comment_Ddl = []
        //------------------- Khái báo biển chính của giao diện
        var Obj_Filter_Dtl = {}
        var Obj_Filter = {}
        var Arr_ListTbl = []

        var Obj_FormInput = {}

        var Obj_FN_Main = {}
        //-------------------

        png.postListApiGetValue({           // Post list các Api phía trên và lấy về dữ liệu
            objList_ComboValue: {
                Arr_TypeOfComment_Ddl: {
                    strTableName: 'CC04'             // Bảng sử dụng để get dữ liệu
                    , strFeildSelect: 'CC04_TypeOfCommentID AS intID,CC04_TypeOfCommentName AS strName' // Trường cần lựa chọn
                    , strWhere: 'WHERE IsActive=1 ORDER BY CC04_Order'      // Điều kiện
                },
                Arr_Comment_Ddl: {
                    strTableName: 'CC06'             // Bảng sử dụng để get dữ liệu
                    , strFeildSelect: 'CC06_CommentForID AS intID,CC06_CommentForName AS strName' // Trường cần lựa chọn
                    , strWhere: 'WHERE IsActive=1 ORDER BY CC06_Order'      // Điều kiện
                }
            }            // Tên các Object api đã khai báo phía trên 
            , objListComboValue_RtnVal: {           // Giá trị nhận về từ API
                'Arr_TypeOfComment_Ddl': {               // Tên api tương ứng với giá trị trả về
                    objParams_Cus: {
                    }
                    , OnSuccess: function (data) {
                        Arr_TypeOfComment_Ddl = $.pngGetArrComboValue(data, 'intID', 'strName')
                    }
                },
                'Arr_Comment_Ddl': {               // Tên api tương ứng với giá trị trả về
                    objParams_Cus: {
                    }
                    , OnSuccess: function (data) {
                        Arr_Comment_Ddl = $.pngGetArrComboValue(data, 'intID', 'strName')
                    }
                }
            }
            , OnSuccessList: function (data) {      // Hàm thực hiện khi thành công tất cả các api trên
                GetPopUp()
            }
        })

        function GetPopUp() {
            var strTitle = ''
            if (Is_Create) {
                strTitle = pngElm.getLangKey({ langkey: 'sys_Btn_Create' })

                Obj_Detail = {
                    dtmDateOfTicket: moment().format('l')
                }
            }

            if (Is_Edit) {
                strTitle = pngElm.getLangKey({ langkey: 'sys_Btn_Edit' })
            }
            if (Is_Duplicate) {
                strTitle = pngElm.getLangKey({ langkey: 'sys_Btn_Duplicate' })
            }
            pngPn.getPopUp({
                strTitle: strTitle
                , intTypeSize: 1//------------1 small ---2 medium ---3 large
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {
                    //------Chọn sự kiện khi Đóng PopUP
                    // options.OnSuccess.call()
                    // _Opt.OnSuccess.call()
                }
            })
        }

        function GetMainPanel(_IdOrClassPp, _OnClosePp) {

            IdOrClass_Main = _IdOrClassPp
            Obj_FN_Main.OnClosePp = _OnClosePp

            //Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
            //Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}


            var objPanel = {
                pnMain: {
                    tag: 'div', attr: 'class=""'
                    , childTags: [{ div: 'class="row"' }]
                    // ,pnListBtn:{tag:'div',attr:'class="col-md-12"'} 
                    // ,pnFormFilter:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnTable:{tag:'div',attr:'class="col-md-12"'}

                    , pnForm: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
                }
            }
            var objEvtPanel = {}

            objEvtPanel.pnForm = function (_idOrClassPn) {
                var IdOrClass_Pn = _idOrClassPn
                Obj_FormInput = {
                    ///-----------INSERT INPUT

                    intTypeOfCommentID: {
                        title: 'Type Of Comment', isRequire: false, attr: "class='col-md-6 '", IsRtn: true
                        , input: { type: 'select', classEx: 'form-control', attr: '' }
                        , dropDown: {
                            IsViewSlcOpt: false, arrList: Arr_TypeOfComment_Ddl

                        }
                    },
                    intCommentForID: {
                        title: 'Feedback for', isRequire: false, attr: "class='col-md-6 '", IsRtn: true
                        , input: { type: 'select', classEx: 'form-control', attr: '' }
                        , dropDown: {
                            IsViewSlcOpt: false, arrList: Arr_Comment_Ddl

                        }
                    },
                    // PnServiceName:{title:'Name',isRequire:false,attr:"class='col-md-6'"
                    //     ,input:{IsNoInput:true}
                    //     ,OnLoadHtml:function (_idOrClass_Pn) {

                    //         GetPanel()
                    //         function GetPanel(){

                    //             var strHtml = ''
                    //             if(Obj_Detail.strServicesName){
                    //                 strHtml+= Obj_Detail.strServicesName
                    //             }
                    //             strHtml+= '(<a action="SlcTour">Select</a>)'
                    //             $(_idOrClass_Pn).html(strHtml)

                    //             $('a',_idOrClass_Pn).click(function(){
                    //                 var action = $(this).attr('action')
                    //                 if(action == 'SlcTour'){
                    //                     GetPopUp_ViewGuide({
                    //                         strBookingGUID: Obj_Detail.strBookingGUID,
                    //                         intCommentForID : $('.intCommentForID',IdOrClass_Pn).val(),
                    //                         OnSuccess: function(_obj){
                    //                             Obj_Detail = $.pngExtendObj(Obj_Detail,_obj)
                    //                             GetPanel()
                    //                             // GetPanel(_strServiceItemGUID)
                    //                         }
                    //                     })
                    //                 }
                    //             })
                    //         }

                    //     }
                    // },
                    __________1: {
                        title: '', isRequire: false, attr: "class='col-md-12' style=''"
                        , input: { IsNoInput: true }
                    },
                    strTitle: { title: 'Title', isRequire: false, attr: "class='col-md-12 '", IsRtn: true, input: { type: 'text', classEx: 'form-control', attr: '' } },
                    strContent: { title: 'Content', isRequire: false, attr: "class='col-md-12 '", IsRtn: true, input: { type: 'textarea', classEx: 'form-control', attr: 'rows="5" ' } },

                }

                pngPn.getForm({
                    action: 1,
                    objInput: Obj_FormInput,
                    idOrClass: IdOrClass_Pn,
                    objDetail: Obj_Detail,
                })

            }
            objEvtPanel.pnBtn = function (_idOrClassPn) {
                var IdOrClass_Pn = _idOrClassPn

                var strHtml = ''
                strHtml += '<button id="btnSave" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-floppy-o"></i><span>' + pngElm.getLangKey({ langkey: 'sys_Btn_Save' }) + '</span></button>'
                $(IdOrClass_Pn).html(strHtml)

                $(IdOrClass_Pn + ' #btnSave').click(function () {
                    pngPn.getForm({
                        action: 2,
                        objInput: Obj_FormInput,
                        idOrClass: IdOrClass_Main + ' #pnForm',
                        OnChkSuccess: function (objRtn) {
                            if (objRtn) {

                                objRtn = $.pngExtendObj(Obj_Detail, objRtn)

                                // if(Is_Create || Is_Duplicate){
                                png.postListApiGetValue({
                                    objList_Api: {

                                        AddAgentRequest: {
                                            strApiLink: 'api/connectto/tour/AddAgentRequest'
                                            , objParams: {
                                                strJson: null
                                                , strCompanyGUID: null

                                            }
                                        }
                                    }
                                    , objListApi_RtnVal: {
                                        'AddAgentRequest': {
                                            objParams_Cus: {
                                                strJson: JSON.stringify($.pngReplaceObj({
                                                    strUserGUID: options.strUserGUID
                                                    , strBookingGUID: options.strBookingGUID
                                                    , strAgentHostBookingGUID: Obj_Detail.strAgentHostBookingGUID
                                                    , strMemberGUID: (options.strCompanyGUID != null ? null : options.strUserGUID)
                                                    , strPartnerCompanyGUID: (options.strCompanyGUID != null ? options.strCompanyGUID : null)
                                                    , strPassengerGUID: null
                                                    , strTitle: null
                                                    , strContent: null
                                                    , intTypeOfCommentID: null
                                                    , intCommentForID: null
                                                }, objRtn))
                                                , strCompanyGUID: Obj_Detail.strCompanyGUID
                                            }
                                            , OnSuccess: function (data) {
                                                Obj_FN_Main.OnClosePp(false, true)
                                                _Opt.OnSuccess.call()
                                                // options.OnSuccess.call()
                                            }
                                        }
                                    }
                                })
                                // }
                                // if(Is_Edit){
                                //     png.postListApiGetValue({
                                //         objList_Api: ObjList_Api
                                //         ,objListApi_RtnVal: {
                                //             'UpdCustCareTicket':{
                                //                 objParams_Cus: objRtn
                                //                 , OnSuccess: function(data){ 
                                //                     Obj_FN_Main.OnClosePp(false,true)
                                //                     _Opt.OnSuccess.call()
                                //                     // options.OnSuccess.call()
                                //                 }
                                //             }
                                //         }
                                //     })
                                // }

                            }


                        }
                    })
                })
            }
            // ===================================

            pngPn.getPanelHtml({            // Get ra panel dạng html
                objPanel: objPanel
                , objEvtPanel: objEvtPanel
                , idOrClass: IdOrClass_Main  // Id or class chính
                , OnChangeIdPn: function (_Fn) {
                    Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
                }
            })



        }
    }

}

$.ModulePage_BookingDetailMain_CustomerList = function (options) {
    var defaults = {
        strUserGUID: ''
        , strCompanyPartnerGUID: ''
        , strCompanyOwnerGUID: ''
        , strBookingGUID: ''
        , arrCustomerList: []
        , arrCountry: []
        , arrSalute: []
        , arrAge: []
        , dtmDateFrom: null
        , objBookingDetail: {}
        , idOrClass: ''
        , OnSuccess: function () {
        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = options.idOrClass


    var Dtm_OrderBkDateFrom = $.pngFormatDateTime(options.dtmDateFrom, 'l')

    var Arr_ListTbl = options.arrCustomerList

    var Obj_BookingDetail = options.objBookingDetail

    var ObjList_Api = {
        UpdPassengerForBooking: {
            strApiLink: 'api/booking/UpdPassengerForBooking'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strPassengerGUID: null
                , intSaluteID: null
                , intAgeID: null
                , intPassengerAges: null
                , strPassengerFirstName: null
                , strPassengerLastName: null
                , dtmPassengerBirthday: null
                , dtmPasspostExpirationDate: null
                , strPassengerEmail: null
                , strPassengerPhone: null
                , strRemark: null
                , strPassport: null
                , strCountryGUID: null
                , IsDelete: null
            }
        }
    }

    var ObjList_ComboValue = {
        arrCountry: {
            strTableName: 'MC02'
            , strFeildSelect: 'MC02_CountryGUID AS intID,MC02_CountryName AS strName'
            , strWhere: ' WHERE IsActive=1 ORDER BY MC02_CountryName'
        }
        , arrSalute: {
            strTableName: 'MC16'
            , strFeildSelect: 'MC16_SaluteID AS intID, MC16_SaluteName AS strName'
            , strWhere: 'WHERE IsActive = 1 ORDER BY MC16_SaluteID'
        }
        , arrAge: {
            strTableName: 'MC23'
            , strFeildSelect: 'MC23_AgeID AS intID,MC23_AgeName AS strName'
            , strWhere: 'WHERE IsActive = 1 ORDER BY MC23_Order'
        }
        , Arr_ChildAge: {
            strTableName: 'MC86'
            , strFeildSelect: 'MC86_ChildAgeID AS intID,MC86_ChildAgeName AS strName'
            , strWhere: 'WHERE IsActive = 1 ORDER BY MC86_Order'
            , IsNotCache: 0
        }
    }


    var Arr_ChildAge = []

    var strHtmlOptChild = ''




    // options.arrSalute.unshift({'':'Select'});

    png.postListApiGetValue({
        objList_ComboValue: ObjList_ComboValue
        , objListComboValue_RtnVal: {
            'arrCountry': {
                objParams_Cus: {}, OnSuccess: function (data) {
                    options.arrCountry = $.pngGetArrComboValue(data, 'intID', 'strName')
                }
            }
            , 'arrSalute': {
                objParams_Cus: {}, OnSuccess: function (data) {
                    options.arrSalute = $.pngGetArrComboValue(data, 'intID', 'strName')
                }
            }
            , 'arrAge': {
                objParams_Cus: {}, OnSuccess: function (data) {
                    options.arrAge = $.pngGetArrComboValue(data, 'intID', 'strName')
                }
            }
            , 'Arr_ChildAge': {
                objParams_Cus: {}, OnSuccess: function (data) {
                    Arr_ChildAge = data

                    Arr_ChildAge.forEach(function (value, key) {
                        var textAgeChild = value.intID
                        if (value.intID == 0)
                            textAgeChild = '< 1'
                        strHtmlOptChild += '<option value="' + value.intID + '">' + textAgeChild + ' y/o</option>'
                    })

                }
            }
        }
        , OnSuccessList: function (data) {

            GetMainPanel()
        }
    })




    function GetMainPanel() {


        var ObjCusMain = Arr_ListTbl.filter(function (item) { return item.IsLeader })[0]

        if (Obj_BookingDetail.intOrderStatusID == 3 || Obj_BookingDetail.intOrderStatusID == 4) {
            var objInput_Main = {
                intSaluteID: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Salute"></span>', isRequire: true, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'select', classEx: 'form-control', attr: '' }
                    , dropDown: { arrList: options.arrSalute }
                }
                , strPassengerFirstName: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_FirstName' }), isRequire: true, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                }
                , strPassengerLastName: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_LastName' }), isRequire: true, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                }
                , strCountryGUID: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Country"></span>', isRequire: true, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'require', attr: ' style="width:100%" placeholder="Select ..."' }
                    , dropDown: { Select2: { IsMultiple: false }, arrList: options.arrCountry }
                }
                , intAgeID: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Age"></span>', isRequire: true, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'select', classEx: 'form-control', attr: '' }
                    , dropDown: { arrList: options.arrAge }
                }
                , dtmPassengerBirthday: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_DateOfBirth"></span>', isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                    , datePicker: { todayHighlight: true, format: 'dd/mm/yyyy', startDate: null }
                }
                , strPassengerEmail: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_Email' }), isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                    , validate: { format: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ }
                }
                , strPassengerPhone: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_PhoneNumber' }), isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                    , validate: { format: /^([+]\d{2})?\d{9,15}$/ }
                }
                , strRemark: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Remark"></span>', isRequire: false, attr: "class='col-md-12'", IsRtn: true
                    , input: { type: 'textarea', classEx: 'form-control', attr: 'rows="3" cols="30"' }
                }
            }
            var objInput = {
                intSaluteID: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Salute"></span>', isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'select', classEx: 'form-control', attr: '' }
                    , dropDown: { arrList: options.arrSalute }
                }
                , strPassengerFirstName: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_FirstName' }), isRequire: false, attr: "class='col-md-4'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                }
                , strPassengerLastName: {
                    title: pngElm.getLangKey({ langkey: 'sys_Txt_LastName' }), isRequire: false, attr: "class='col-md-5'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                }
                , intAgeID: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_Age"></span>', isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { type: 'select', classEx: 'form-control', attr: '' }
                    , dropDown: { arrList: options.arrAge }
                }
                , dtmPassengerBirthday: {
                    title: '<span langkey="pg_Dft_TC_OrDtl_DateOfBirth"></span>', isRequire: false, attr: "class='col-md-4'", IsRtn: true
                    , input: { type: 'text', classEx: 'form-control', attr: '' }
                    , datePicker: { todayHighlight: true, format: 'dd/mm/yyyy', startDate: null }
                }
            }
        } else {
            var objInput_Main = {
                strSaluteName: {
                    title: 'Salute', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                // ,strPassengerName: {title:'Customer Name',attr:"class='col-md-3'",IsRtn:true
                //     ,input:{IsNoInput:true,IsViewDtl:true}
                // }
                , strPassengerFirstName: {
                    title: 'First Name', isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strPassengerLastName: {
                    title: 'Last Name', isRequire: false, attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strAgeName: {
                    title: 'Age', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , dtmPassengerBirthday_View: {
                    title: 'Date Of Birth', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strCountryName: {
                    title: 'Country', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strPassengerEmail: {
                    title: 'Email', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strPassengerPhone: {
                    title: 'Phone', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strRemark: {
                    title: 'Remark', isRequire: false, attr: "class='col-md-12'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
            }
            var objInput = {
                strSaluteName: {
                    title: 'Salute', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                // ,strPassengerName: {title:'Customer Name',attr:"class='col-md-3'",IsRtn:true
                //     ,input:{IsNoInput:true,IsViewDtl:true}
                // }
                , strPassengerFirstName: {
                    title: 'First Name', isRequire: false, attr: "class='col-md-4'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strPassengerLastName: {
                    title: 'Last Name', isRequire: false, attr: "class='col-md-5'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , strAgeName: {
                    title: 'Age', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
                , dtmPassengerBirthday_View: {
                    title: 'Date Of Birth', attr: "class='col-md-3'", IsRtn: true
                    , input: { IsNoInput: true, IsViewDtl: true }
                }
            }
        }


        var strHtml = ''
        strHtml += '<div class="pnCus" data="0" style="margin-bottom: 20px;">'
        strHtml += '<h3 style="margin: 10px 0 20px;">' + pngElm.getLangKey({ langkey: 'sys_Txt_CustomerLeader' }) + ' <span style="color:red">*</span></h3>'
        strHtml += '<div class="pnForm"></div>'
        strHtml += '</div>'
        strHtml += '<div id="pnCusNoMain"></div>'
        if (Obj_BookingDetail.intOrderStatusID == 3 || Obj_BookingDetail.intOrderStatusID == 4) {
            strHtml += '<div class="">'
            strHtml += '    <button class="btn btn-texticon bg-success txt-white" id="btnAddCustomer"><i class="fa fa-plus"></i><span langkey="pg_Dft_TC_OrDtl_btn-AddCustomer"></span></button>'
            strHtml += '    <button class="btn btn-texticon bg-primary txt-white" id="btnSaveCustomer"><i class="fa fa-floppy-o"></i><span langkey="sys_Btn_Save"></span></button>'
            strHtml += '</div>'
        }
        $(IdOrClass_Main).html(strHtml)

        pngPn.getForm({
            action: 1,
            objInput: objInput_Main,
            idOrClass: IdOrClass_Main + ' .pnCus[data="0"] .pnForm',
            objDetail: ObjCusMain,
        })
        $(IdOrClass_Main + ' .pnCus[data="0"]').find('.intAgeID').attr('disabled', true)


        Arr_ListTbl.forEach(function (value, key) {
            if (!value.IsLeader)
                GetCusNoMain(value, key)
        })

        pngElm.getLangKey()
        function GetCusNoMain(_objDetail, _intRowID) {
            var strHtml = ''
            strHtml += '<div class="pnCus" data="' + _intRowID + '" style="margin-bottom: 20px;position: relative;">'
            strHtml += '<div class="row">'
            strHtml += '<div class="col-md-12">'
            strHtml += '<h3 style="padding: 20px 0;">' + pngElm.getLangKey({ langkey: 'sys_Txt_Customer' }) + ' ' + (_intRowID + 1) + '</h3>'
            if (Obj_BookingDetail.intOrderStatusID == 3 || Obj_BookingDetail.intOrderStatusID == 4) {
                strHtml += '<button class="btn" style="position: absolute;top: 15px;right: 15px;font-size: 16px;background: #ECEDEE;cursor: pointer;" action="delete"  data="' + _intRowID + '"><i class="fa fa-trash"></i></button>'
            }
            strHtml += '<div class="pnForm"></div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '</div>'
            $('#pnCusNoMain').append(strHtml)
            pngPn.getForm({
                action: 1,
                objInput: objInput,
                idOrClass: IdOrClass_Main + ' #pnCusNoMain .pnCus[data="' + _intRowID + '"] .pnForm',
                objDetail: _objDetail,
            })

        }

        $(IdOrClass_Main).find('.intAgeID').each(function () {
            var data = $(this).parents('.pnCus').attr('data')
            if (!$(this).parent().find('.intPassengerAges')[0]) {
                $(this).parent().append('<select class="intPassengerAges form-control" data="' + data + '">' + strHtmlOptChild + '</select>')
                // $(IdOrClass_Main).find('.intPassengerAges[data='+data+']').val(Arr_ListTbl[data].intPassengerAges)
            }
        })

        $(IdOrClass_Main + ' button').click(function () {
            var action = $(this).attr('action')
            var data = $(this).parents('.pnCus').attr('data')

            if (action == 'delete') {
                $.Confirm({
                    strContent: '<span langkey="sys_Cfm_AYS"></span>'
                    , OnSuccess: function () {

                        if (Arr_ListTbl[data].strPassengerGUID) {
                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                , objListApi_RtnVal: {
                                    'UpdPassengerForBooking': {
                                        objParams_Cus: {
                                            strPassengerGUID: Arr_ListTbl[data].strPassengerGUID
                                            , IsDelete: 1
                                        }, OnSuccess: function (data) { }
                                    }
                                }
                                , OnSuccessList: function (data) {
                                    coreLoadPage.init()
                                    // png.postListApiGetValue({
                                    //     objList_Api: ObjList_Api
                                    //     ,objListApi_RtnVal: {
                                    //         'UpdOrderBookingStep1ByPassenger':{
                                    //             objParams_Cus:{
                                    //                 IsDelete:1
                                    //             }, OnSuccess: function(data){
                                    //                 $.Confirm({ strContent: '<span langkey="sys_Cfm_DelSuccess"></span>' });
                                    //                 coreLoadPage.init()
                                    //             }
                                    //         }
                                    //     }
                                    // })


                                }
                            })
                        } else {
                            Arr_ListTbl.splice(data, 1);
                            GetMainPanel()
                        }

                    }
                })
            }

        })

        $(IdOrClass_Main).find('.intAgeID').change(function () {
            var data = $(this).parents('.pnCus').attr('data')
            var idOrClassPn = IdOrClass_Main + " .pnCus[data=" + data + "]"

            var self = this
            $(idOrClassPn + ' .intPassengerAges').change(function () {
                var data = $(this).attr('data')
                if (self.value == 4) {
                    var dtmStartDate = moment(Dtm_OrderBkDateFrom).add('years', -this.value - 1).add('days', 1).format('DD/MM/YYYY')
                    var dtmEndDate = moment(Dtm_OrderBkDateFrom).add('years', -this.value).format('DD/MM/YYYY')

                    // if(Arr_ListTbl[data]['intPassengerAges'] != this.value){

                    //     Arr_ListTbl[data]['intPassengerAges'] = this.value

                    //     $(idOrClassPn+" .dtmPassengerBirthday").val('').change()
                    // }
                    $(idOrClassPn + " .dtmPassengerBirthday").datepicker('setStartDate', dtmStartDate)
                    $(idOrClassPn + " .dtmPassengerBirthday").datepicker('setEndDate', dtmEndDate)

                }
            })

            var dtmStartDate, dtmEndDate

            var intPassengerAges = null
            intPassengerAges = Arr_ListTbl[data].intPassengerAges
            if (intPassengerAges == null)
                intPassengerAges = 9

            if (this.value == 4) {
                $(idOrClassPn + ' .intPassengerAges').parent().find('label').css('display', 'block')
                $(idOrClassPn + ' .intPassengerAges').css('display', 'inline-block').css('width', '50%')
                $(idOrClassPn + ' .intAgeID').css('display', 'inline-block').css('width', '50%')
                $(idOrClassPn + ' .intPassengerAges').show()
                $(idOrClassPn + ' .intPassengerAges').val(intPassengerAges).change()


            } else {
                $(idOrClassPn + ' .intAgeID').css('width', '100%')
                $(idOrClassPn + ' .intPassengerAges').hide()

                dtmStartDate = ''
                dtmEndDate = moment(Dtm_OrderBkDateFrom).add('years', -18).format('DD/MM/YYYY')
                // ArrCustomerList[ArrCustomerListNoDelete[data].intKey]['intPassengerAges'] = null

                $(idOrClassPn + " .dtmPassengerBirthday").datepicker('setStartDate', dtmStartDate)
                $(idOrClassPn + " .dtmPassengerBirthday").datepicker('setEndDate', dtmEndDate)

            }

            if (Arr_ListTbl[data]['intAgeID'] != this.value) {

                $(idOrClassPn + " .dtmPassengerBirthday").val('').change()
            }

        }).change()

        $(IdOrClass_Main).find('select,input,textarea').change(function () {
            var data = $(this).parents('.pnCus').attr('data')
            if (data > 0) {
                Arr_ListTbl[data].IsEnableInput = 1
                $(this).parents('.pnCus .row').css('background', '#fff4ef')
            }

        })
        Arr_ListTbl.forEach(function (value, key) {
            if (value.IsEnableInput == 1)
                $(IdOrClass_Main + " .pnCus[data=" + key + "] .row").css('background', '#fff4ef')
        })



        $('#btnAddCustomer').click(function () {
            // console.log(Arr_ListTbl)
            Arr_ListTbl.push({
                IsDelete: 0, intAgeID: 3, IsEnableInput: 1
            })
            GetMainPanel()
        })


        $('#btnSaveCustomer').click(function () {

            var ArrInput = []

            pngPn.getForm({
                action: 2,
                objInput: objInput_Main,
                idOrClass: IdOrClass_Main + ' .pnCus[data="0"] .pnForm',
                OnChkSuccess: function (objRtn) {
                    if (objRtn) {
                        objRtn = $.pngExtendObj(Arr_ListTbl[0], objRtn)
                        ArrInput.push(objRtn)

                        // var intAdd = Arr_ListTbl.filter(function(item){ return !item.strPassengerGUID}).length

                        // var ArrOrderBookingItem_Tour = []
                        // options.arrOrderBookingItem.forEach(function(value){
                        //     if(value.intCateID == 18 || value.intCateID == 19 || value.intCateID == 33){
                        //         ArrOrderBookingItem_Tour.push(value)
                        //     }
                        // })

                        // if(intAdd > 0 && ArrOrderBookingItem_Tour.length){
                        //     $.ModulePage_OrderStep1_CustomerList_PopUpListCustomerAdd({
                        //         strUserGUID: options.strUserGUID
                        //         ,arrOrderBookingItem: ArrOrderBookingItem_Tour
                        //         ,intTotalPax: Int_TotalPaxCur
                        //         ,OnSuccess: function(strListOrderBookingItemGUID){
                        //             GetSave(strListOrderBookingItemGUID)
                        //         }
                        //     })
                        // }else{
                        GetSave(null)
                        // }

                    }
                }
            })

            function GetSave(_strListOrderBookingItemGUID) {
                Arr_ListTbl.forEach(function (value, key) {
                    if (value.IsEnableInput) {
                        pngPn.getForm({
                            action: 2,
                            objInput: objInput,
                            idOrClass: IdOrClass_Main + ' .pnCus[data="' + key + '"] .pnForm',
                            OnChkSuccess: function (objRtn) {
                                if (objRtn) {
                                    if (objRtn.intAgeID == 4)
                                        objRtn.intPassengerAges = $(IdOrClass_Main + ' .pnCus[data="' + key + '"] .intPassengerAges').val()

                                    objRtn = $.pngExtendObj(value, objRtn)
                                    ArrInput.push(objRtn)
                                }
                            }
                        })
                    }
                })
                png.postList({
                    objApi: ObjList_Api.UpdPassengerForBooking,
                    arrInput: ArrInput,
                    intCallApiPerTime: 1,
                    //GEN
                    OnSuccess: function (data) {

                        coreLoadPage.init()
                        // if(_strListOrderBookingItemGUID)
                        // png.postListApiGetValue({
                        //     objList_Api: ObjList_Api
                        //     ,objListApi_RtnVal: {
                        //         'UpdOrderBookingStep1ByPassenger':{
                        //             objParams_Cus:{
                        //                 strListOrderBookingItemGUID:_strListOrderBookingItemGUID
                        //             }, OnSuccess: function(data){
                        //                 $.Confirm({ strContent: '<span langkey="sys_Cfm_UpdSuccess"></span>' });
                        //                 coreLoadPage.init()
                        //             }
                        //         }
                        //     }
                        // })
                        // else{
                        //     var confirmSuccess = '<span langkey="sys_Cfm_UpdSuccess"></span>'
                        //     $.Confirm({ strContent: confirmSuccess });
                        //     coreLoadPage.init()
                        // }

                    }
                })
            }

        })


    }




}

$.ModulePage_BookingDetailMain_PopUpViewVoucher = function (options) {
    var defaults = {
        strUserGUID: null
        // ,strCompanyPartnerGUID:null
        // ,strCompanyOwnerGUID:null
        , strBookingGUID: null
        , arrListBookingItem: null
        , objBookingInfo: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX

    var Str_TourGUID = options.arrListBookingItem.filter(function (item) { return item.strTourGUID })[0].strTourGUID

    var Obj_TourDetail = {}
    var Arr_PaymentTerm = []
    var Arr_CancellationPolicy = []

    var ObjList_Api = {
        GetListBookingService: {
            strApiLink: 'api/booking/GetListBookingService'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strBookingServiceGUID: null
                , strBookingItemGUID: null
                , intBookingStatusID: null

                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
        , GetListBooking: {
            strApiLink: 'api/booking/GetListBooking'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strBookingServiceGUID: null

                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
        , GetListTourDetailByPtn: {
            strApiLink: 'api/tour/GetListTourDetailByPtn'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourGUID: Str_TourGUID

                , intCurPage: 1
                , intPageSize: 1
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
        , GetListTourPaymentTerm: {
            strApiLink: 'api/tour/GetListTourPaymentTerm'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourPaymentTermGUID: null
                , strTourGUID: Str_TourGUID
                , IsActive: null
                , intCurPage: null
                , intPageSize: null
                , strOrder: 'intDayTo desc'
                , tblsReturn: '[0]'
            }
        }
        , GetListTourCancellationPolicy: {
            strApiLink: 'api/tour/GetListTourCancellationPolicy'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourCancellationPolicyGUID: null
                , strTourGUID: Str_TourGUID
                , IsActive: null
                , intCurPage: null
                , intPageSize: null
                , strOrder: 'intTo desc'
                , tblsReturn: '[0]'
            }
        }
    }
    var ObjList_ComboValue = {
        ArrValCode: {
            strCombocode: ""
        }
    }



    var Obj_FN_Main = {}

    png.postListApiGetValue({
        objList_Api: ObjList_Api
        //,objList_ComboValue: ObjList_ComboValue
        , objListApi_RtnVal: {
            'GetListTourDetailByPtn': {
                objParams_Cus: {
                    tblsReturn: '[0]'
                }
                , OnSuccess: function (data) {
                    Obj_TourDetail = JSON.parse(data)[0][0]
                    // return JSON.parse(data)[0]
                }
            }
            , 'GetListTourPaymentTerm': {
                objParams_Cus: {
                    tblsReturn: '[0]'
                }
                , OnSuccess: function (data) {
                    Arr_PaymentTerm = JSON.parse(data)[0]
                    // return JSON.parse(data)[0]
                }
            }
            , 'GetListTourCancellationPolicy': {
                objParams_Cus: {
                    tblsReturn: '[0]'
                }
                , OnSuccess: function (data) {
                    Arr_CancellationPolicy = JSON.parse(data)[0]
                    // return JSON.parse(data)[0]
                }
            }
        }
        //,objListComboValue_RtnVal: ObjListComboValue_RtnVal
        , OnSuccessList: function (data) {
            pngPn.getPopUp({
                strTitle: 'Booking Voucher'
                , intTypeSize: 2
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {

                }
            })
        }
    })

    function GetMainPanel(_idOrClassPp, _OnClosePp) {

        IdOrClass_Main = _idOrClassPp


        pngPn.getPanelHtml({
            objPanel: {
                pnMain: {
                    tag: 'div', attr: 'class="panel-itl"', childTags: [{ div: 'class="row"' }]
                    , pnPanel1: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnPanel2: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnPanel3: { tag: 'div', attr: 'class="col-md-12"' }
                }
            }
            , objEvtPanel: {
                pnPanel1: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)
                    console.log(Obj_TourDetail)
                    var strHtml = ''
                    strHtml += '<b>PkgOps</b>'
                    strHtml += '<br><b>Phone:</b>'
                    strHtml += '<br><b>Validity: </b>30 Aug 2020 - 06 Sep 2020'
                    strHtml += '<br><b>Confirmation No: 30 Aug 2020 - 06 Sep 2020</b>'
                    strHtml += '<br><b>Free Cancellation Till: 05 March 2020</b>'



                    $(_idOrClassPn).html(strHtml)

                    _OnRtn('')
                }
                , pnPanel2: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)

                    pnPanel_GetPanel({ idOrClass: _idOrClassPn })

                    _OnRtn('')
                }
                , pnPanel3: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)

                    pnPanel3_GetPanel({ idOrClass: _idOrClassPn })
                    // var strHtml='<b>INCLUDE & EXCLUDE</b>'
                    // $(_idOrClassPn).html(strHtml)

                    _OnRtn('')
                }
            }
            , idOrClass: IdOrClass_Main
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn
            }
        })

    }


    function pnPanel_GetPanel(_Opt) {
        var Dft = {
            idOrClass: ''
            , OnSuccess: function () { }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Pn = _Opt.idOrClass
        var strHtml = ''
        strHtml += ''

        strHtml += '<div class="panel panel-default" id="pnFormRegister2">'
        strHtml += '    <div class="panel-heading">Hotel Selection</div>'
        strHtml += '    <div class="panel-body">'
        strHtml += '         <div id="pnTable">'
        strHtml += '         </div>'
        strHtml += '    </div>'
        strHtml += '</div>'
        $(IdOrClass_Pn).html(strHtml)

        var ArrListTbl = []

        pngPn.getTable2({
            objApi: ObjList_Api.GetListBookingService
            , objParams_Cus: {
            }
            , editRlt: function (valTbl, keyTbl) {
                valTbl['No'] = keyTbl + 1
                valTbl['strDateFromDateTo'] = $.pngFormatDateTime(valTbl.dtmDateFrom) + ' - ' + $.pngFormatDateTime(valTbl.dtmDateTo)
                valTbl['strHtmlAction'] = '<button class="btnView btn btn-primary" data="' + keyTbl + '"><i class="fa fa-eye"></i></button>'
            }
            , editRltArr: function (arr) {
                return arr.filter(function (item) { return (item.intBookingStatusID == 4) })
            }
            , objCols: {

                No: { name: pngElm.getLangKey({ langkey: 'sys_Txt_Tbl-No' }) }
                , strSupplierName: { name: 'Supplier Name' }
                , strDateFromDateTo: { name: 'Check In - Check Out' }
                //, IsShowMenu: { name: "IsShowMenu", input: { type: 'checkbox', classEx: '', attr: '' } }
                , strHtmlAction: { name: pngElm.getLangKey({ langkey: 'sys_Txt_Tbl-Action' }) }

            }
            // ,editTableInput:function(){}
            , changeCkbMaster: function (IsChecked, intRowID, arrList) {
                ArrListTbl = arrList
            }
            , customEvent: function (_idOrClass) {
                $(_idOrClass + ' .btnView').click(function () {
                    var data = $(this).attr('data')
                    $.ModulePage_BookingDetailMain_PopUpViewVoucher_PopUpVoucherDtl({
                        strUserGUID: options.strUserGUID,
                        strBookingGUID: options.strBookingGUID,
                        objBookingServiceDtl: ArrListTbl[data],
                        objBookingInfo: options.objBookingInfo,
                    })
                })
            }
            // ,changeInput:function(){}
            , IsViewCheckBoxMain: false
            , idOrClass: IdOrClass_Pn + ' #pnTable'
        })




        // png.postListApiGetValue({
        //     objList_Api: ObjList_Api
        //     ,objListApi_RtnVal: { 
        //         'GetListBookingService':{
        //             objParams_Cus: {}
        //             , OnSuccess: function(data){ 
        //                 ArrList = JSON.parse(data)[0]
        //                 GetPanel()
        //             }
        //         }
        //     }
        // })

        // function GetPanel(){
        //     var strHtml=''
        //     ArrList.forEach(function(value){
        //         strHtml+='<b>Suplier Name:</b> '+ value.strSupplierName
        //         strHtml+='<br><b>Item Name:</b> '+ value.strItemName
        //         strHtml+='<br><b>Date From - Data To:</b> '+ $.pngFormatDateTime(value.dtmDateFrom) +' - '+ $.pngFormatDateTime(value.dtmDateTo)
        //         strHtml+='<br><b>Status:</b> '+ value.strBookingStatusName
        //         strHtml+='<hr>'
        //     })

        //     $(IdOrClass_Pn).html(strHtml)

        // }

    }

    function pnPanel3_GetPanel(_Opt) {
        var Dft = {
            idOrClass: ''
            , OnSuccess: function () { }
        }
        _Opt = $.extend(Dft, _Opt);


        var IdOrClass_Pn = _Opt.idOrClass

        var strHtml = ''
        strHtml += '<div class="panel panel-default" id="pnFormRegister2">'
        strHtml += '    <div class="panel-heading">Include</div>'
        strHtml += '    <div class="panel-body">'
        strHtml += (Obj_TourDetail.strIncluded || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>')
        strHtml += '    </div>'
        strHtml += '</div>'
        strHtml += '<div class="panel panel-default" id="pnFormRegister2">'
        strHtml += '    <div class="panel-heading">Exclude</div>'
        strHtml += '    <div class="panel-body">'
        strHtml += (Obj_TourDetail.strExcluded || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>')
        strHtml += '    </div>'
        strHtml += '</div>'

        strHtml += '<div class="panel panel-default" id="pnFormRegister2">'
        strHtml += '    <div class="panel-heading">Term & Condition</div>'
        strHtml += '    <div class="panel-body">'
        strHtml += (Obj_TourDetail.strTermAndCondition || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>')
        strHtml += '    </div>'
        strHtml += '</div>'



        $(IdOrClass_Pn).html(strHtml)

    }


}

$.ModulePage_BookingDetailMain_PopUpViewVoucher_PopUpVoucherDtl = function (options) {


    var defaults = {
        strUserGUID: null
        // ,strCompanyPartnerGUID:null
        // ,strCompanyOwnerGUID:null
        , strBookingGUID: null
        , objBookingServiceDtl: {}
        , objBookingInfo: {}
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    var ObjList_Api = {
        GetListBookingService: {
            strApiLink: 'api/booking/GetListBookingService'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strBookingServiceGUID: null
                , strBookingItemGUID: null
                , intBookingStatusID: null

                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
    }
    var ObjList_ComboValue = {
        ArrValCode: {
            strCombocode: ""
        }
    }

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX

    var Obj_BookingServiceDtl = options.objBookingServiceDtl


    var Obj_FN_Main = {}

    // png.postListApiGetValue({
    //     objList_Api: ObjList_Api
    //     //,objList_ComboValue: ObjList_ComboValue
    //     ,objListApi_RtnVal: {
    //         'GetListItemTypeInAd':{
    //             objParams_Cus:{
    //             }
    //             ,OnSuccess: function(data){

    //                 pngPn.getPopUp({
    //                     strTitle: 'Pop Up'
    //                     , intTypeSize:2
    //                     , OnPanel: GetMainPanel
    //                     , OnClosePopUp: function () {

    //                     }
    //                 })
    //                 // return JSON.parse(data)[0]
    //             }
    //         }
    //     }
    //     //,objListComboValue_RtnVal: ObjListComboValue_RtnVal
    //     // ,OnSuccessList:function(data){}
    // })

    console.log(options.objBookingInfo)
    pngPn.getPopUp({
        strTitle: 'Voucher Detail'
        , intTypeSize: 2
        , OnPanel: GetMainPanel
        , OnClosePopUp: function () {

        }
    })
    function GetMainPanel(_idOrClassPp, _OnClosePp) {

        IdOrClass_Main = _idOrClassPp


        pngPn.getPanelHtml({
            objPanel: {
                pnMain: {
                    tag: 'div', attr: 'class="panel-itl"', childTags: [{ div: 'class="row"' }]
                    , pnPanel1: { tag: 'div', attr: 'class="col-md-12"' }
                    // ,pnPanel2:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnPanel3:{tag:'div',attr:'class="col-md-12"'}
                }
            }
            , objEvtPanel: {
                pnPanel1: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)

                    var strHtml = ''
                    // strHtml+='<b>PkgOps</b>'
                    // strHtml+='<br><span>Dubai United</span>'
                    // strHtml+='<br><b>Email: </b>'
                    // strHtml+='<br><b>Mobile: </b>'
                    // strHtml+='<br>'
                    // strHtml+='<br><b>Consultant</b>'
                    // strHtml+='<br><span>PkgOps</span>'
                    // strHtml+='<br><span>Dubai United</span>'
                    // strHtml+='<br><b>Email: </b>'
                    // strHtml+='<br><b>Mobile: </b>'

                    // strHtml+='<br>'
                    // strHtml+='<br><b>Emergency Contact No.: </b>'
                    // strHtml+='<br><h3>Voucher Detail</h3>'

                    strHtml += '<br><b>Comfirmation No.: </b>' + Obj_BookingServiceDtl.strRefCode
                    strHtml += '<br><b>Booked On: </b>' + options.objBookingInfo.dtmBookingDate
                    strHtml += '<br>'
                    strHtml += '<br><b>Supplier Name: </b> ' + Obj_BookingServiceDtl.strSupplierName
                    strHtml += '<br><b>Supplier Address: </b> ' + Obj_BookingServiceDtl.strSupplierAddr

                    // strHtml+='<br><b>Room:</b> '+ Obj_BookingServiceDtl.strItemName
                    // strHtml+='<br><b>Check In - Check Out: </b>' + Obj_BookingServiceDtl.strDateFromDateTo

                    strHtml += '<br><h3>Guest Itinerary/General Infomation</h3>'
                    strHtml += '<div id="pnListRoom"></div>'
                    strHtml += '<br><b>Guest Nationality: </b>'
                    $(_idOrClassPn).html(strHtml)


                    var ArrListTbl = []
                    ArrListTbl.push({
                        No: 1
                        , strItemName: Obj_BookingServiceDtl.strItemName
                        , strCheckInOut: Obj_BookingServiceDtl.strDateFromDateTo
                        , strNumberOfRoom: '2 SGL Room(s), 2 DBL Room(s)'
                    })

                    pngPn.getTable2({
                        objApi: null
                        , objParams_Cus: {}
                        , objCols: {
                            'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                            , strItemName: { name: 'Room Type' }
                            , strCheckInOut: { name: 'Check In - Check Out' }
                            , strNumberOfRoom: { name: 'Number Of Room' }
                        }
                        , editRltArr: function (arr) {
                            return ArrListTbl
                        }
                        , editRlt: function (value, key) {
                            // value['strMarkupHtml'] = ''
                            // value['strMarkupHtml']+= value.dblMarkup+'('+value.strMakupName+')'
                        }
                        , customEvent: function (idOrClassPn) {

                        }
                        , changeCkbMaster: function (IsChecked, intRowID, arrList) {
                            ArrListTbl = arrList;
                        }
                        , IsViewCheckBoxMain: false
                        , idOrClass: '#pnListRoom'
                    })


                    _OnRtn('')
                }

            }
            , idOrClass: IdOrClass_Main
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn
            }
        })

    }




}



$.ModulePage_BookingDetailMain_PopUpViewQuote = function (options) {
    var defaults = {
        strUserGUID: null
        , arrListAgentBookingItemDetail: null
        , arrOrderBookingByAgentHost: null
        , intPriceType: 1 //1: Goc ----2: Ban
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX

    var Arr_ListAgentBookingItemDetail = options.arrListAgentBookingItemDetail
    var Arr_OrderBookingByAgentHost = options.arrOrderBookingByAgentHost


    var Obj_DetailCom = null
    var Obj_DetailMem = null

    if (options.intPriceType == 1) {
        if (Arr_OrderBookingByAgentHost.length == 1) {
            Obj_DetailCom = Arr_OrderBookingByAgentHost[0]
        }
        // Obj_DetailCom = JSON.parse(png.ArrLS.CompanyFriend.get())
    }
    if (options.intPriceType == 2) {
        Obj_DetailCom = JSON.parse(png.ArrLS.UserDetail.get())
    }
    Obj_DetailMem = JSON.parse(png.ArrLS.UserDetail.get())
    console.log(Arr_ListAgentBookingItemDetail)
    var ObjList_Api = {

    }
    var ObjList_ComboValue = {
        ArrValCode: {
            strCombocode: ""
        }
    }

    var Obj_FN_Main = {}

    pngPn.getPopUp({
        strTitle: 'View Quote'
        , intTypeSize: 2
        , OnPanel: GetMainPanel
        , OnClosePopUp: function () {

        }
    })
    function GetMainPanel(_idOrClassPp, _OnClosePp) {

        IdOrClass_Main = _idOrClassPp


        pngPn.getPanelHtml({
            objPanel: {
                pnMain: {
                    tag: 'div', attr: '', childTags: [{ div: 'class="row"' }]
                    , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnCnt: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnFt: { tag: 'div', attr: 'class="col-md-12"' }
                }
            }
            , objEvtPanel: {
                pnBtn: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)
                    // console.log(Obj_TourDetail)
                    var strHtml = ''
                    strHtml += '<div class="panel-itl">'
                    strHtml += '<button class="btn btn-default btn-texticon" id="btnPrint" style=" margin-top: -20px"><i class="fa fa-print"></i><span>Print Quote</span></button>'
                    strHtml += '</div>'

                    $(_idOrClassPn).html(strHtml)

                    $(_idOrClassPn + ' #btnPrint').click(function () {
                        pngPn.getPopUpPrint({
                            idOrClass: IdOrClass_Main + ' #pnCnt'
                            , strHtml: $(IdOrClass_Main + ' #pnCnt').html().replace('<table class="table-default">', '<table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none; width: 100%">') + $(IdOrClass_Main + ' #pnFt').html()
                        })
                    })


                    _OnRtn('')
                }
                , pnCnt: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)

                    pnCnt_GetPanel({ idOrClass: _idOrClassPn })

                    _OnRtn('')
                }
                , pnFt: function (_idOrClassPn, _objAll, _OnRtn) {
                    // console.log(_idOrClassPn,_objAll)

                    var dblPriceTotal = 0
                    var dblPriceTotalAgent = 0
                    var strHtml = ''
                    Arr_ListAgentBookingItemDetail.forEach(function (value) {
                        if (value.intOrderStatusID != 6 && !value.IsMaster) {
                            dblPriceTotal += value.intTotalPrice
                            dblPriceTotalAgent += value.dblPriceTotalAgent
                        }
                    })
                    if (options.intPriceType == 1) {
                        strHtml += '<div id="pnTotalPrice" class="txt-primary" style="text-align: right;"><b>Total Price: ' + $.pngFormatPrice(dblPriceTotal) + '</b></div>'
                    }
                    if (options.intPriceType == 2) {
                        strHtml += '<div id="pnTotalPrice" class="txt-primary" style="text-align: right;"><b>Total Price: ' + $.pngFormatPrice(dblPriceTotalAgent) + '</b></div>'
                    }
                    strHtml += '<div style="text-align: right;margin-top:20px"><b>Người gửi: </b>' + Obj_DetailMem.strFullName + '</div>'
                    strHtml += '<div style="text-align: right;"><b>SĐT: </b>' + Obj_DetailMem.strMobile + '</div>'
                    strHtml += '<div style="text-align: right;"><b>Email: </b>' + Obj_DetailMem.strEmailWorking + '</div>'

                    $(_idOrClassPn).html(strHtml)
                    _OnRtn('')
                }
            }
            , idOrClass: IdOrClass_Main
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn
            }
        })

    }


    function pnCnt_GetPanel(_Opt) {
        var Dft = {
            idOrClass: ''
            , OnSuccess: function () { }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Pn = _Opt.idOrClass

        var ArrListTbl = []


        var strHtml = ''
        strHtml += '<div id="pnForm"></div>'
        strHtml += '<div id="pnTable"></div>'
        $(IdOrClass_Pn).html(strHtml)


        if (Obj_DetailCom) {
            Obj_DetailCom['strHtmlCompanyLogo'] = '<img src="' + png.getServerImgURL(Obj_DetailCom['strCompanyLogo']) + '" style="width: 100%;height: auto;">'

            var obj =


                pngPn.getForm({
                    action: 1,
                    objInput: {
                        strHtmlCompanyLogo: {
                            title: '', attr: "class='col-md-3' style='margin-bottom: 25px;width: 25%;display: inline-block;'"
                            , input: { IsNoInput: true, IsViewDtl: true }
                        }
                        , PanelCtnForm: {
                            title: '', attr: "class='col-md-9' style='margin-bottom: 25px;width: 70%;display: inline-block; margin-left: 25px;'"
                            , input: { IsNoInput: true }
                        }
                    },
                    idOrClass: IdOrClass_Pn + ' #pnForm',
                    objDetail: Obj_DetailCom
                })

            var strHtmlInfor = "";
            strHtmlInfor += '<div class="row">'
            strHtmlInfor += '    <div class="col-md-12" style="margin-bottom: 15px;">'
            strHtmlInfor += '            <h3 style=""><b>' + Obj_DetailCom.strCompanyName + '</b></h3>'
            strHtmlInfor += '       </div>'
            if (Obj_DetailCom.strCompanyAddr) {
                strHtmlInfor += '    <div class="col-md-12" style="margin-bottom: 5px;"><label>Address: </label>'
                strHtmlInfor += '            <span>' + Obj_DetailCom.strCompanyAddr + '</span>'
                strHtmlInfor += '    </div>'
            }
            strHtmlInfor += '<div class="col-md-12" style="margin-bottom: 5px;">'
            if (Obj_DetailCom.strCompanyPhone) {
                strHtmlInfor += '<label>Phone: </label><span>' + Obj_DetailCom.strCompanyPhone + '</span><span class="pn-margin-l-r-15">|</span>'
            }
            if (Obj_DetailCom.strCompanyEmail) {
                strHtmlInfor += '<label>Email: </label><span>' + Obj_DetailCom.strCompanyEmail + '</span>'
            }
            strHtmlInfor += '</div>'

            $(IdOrClass_Pn + ' #pnForm .pnElm-PanelCtnForm').html(strHtmlInfor);
        }

        var objCols
        if (options.intPriceType == 1) {
            objCols = {
                'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                , strServiceName: { name: '<span langkey="pg_Dft_TC_OrDtl_ServiceName"></span>' }
                , dtmDateFrom_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateFrom"></span>' }
                , dtmDateTo_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateTo"></span>' }
                , intQuantity: { name: '<span langkey="pg_Dft_TC_OrDtl_TotalPax"></span>', strAttrTD: 'style="text-align:right"' }
                , intUnitPrice_FNP: { name: '<span langkey="pg_Dft_TC_OrDtl_PriceUnit"></span>', strAttrTD: 'style="text-align:right"' }
                , intTotalPrice_FNP: { name: '<span langkey="pg_Dft_TC_OrDtl_PriceTotal"></span>', strAttrTD: 'style="text-align:right"' }
                , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
            }
        }
        if (options.intPriceType == 2) {
            objCols = {
                'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                , strServiceName: { name: '<span langkey="pg_Dft_TC_OrDtl_ServiceName"></span>' }
                , dtmDateFrom_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateFrom"></span>' }
                , dtmDateTo_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateTo"></span>' }
                , intQuantity: { name: '<span langkey="pg_Dft_TC_OrDtl_TotalPax"></span>', strAttrTD: 'style="text-align:right"' }
                , dblPriceUnitAgent_FNP: { name: '<span langkey="pg_Dft_TC_OrDtl_PriceUnit"></span>', strAttrTD: 'style="text-align:right"' }
                , dblPriceTotalAgent_FNP: { name: '<span langkey="pg_Dft_TC_OrDtl_PriceTotal"></span>', strAttrTD: 'style="text-align:right"' }
                , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
            }
        }

        pngPn.getTable2({
            objApi: null
            , objParams_Cus: {
            }
            , editRlt: function (value, key) {
                value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])
                if (!value.IsMaster)
                    value['intUnitPrice_FNP'] = $.pngFormatPrice(value['intUnitPrice'])
                value['intTotalPrice_FNP'] = $.pngFormatPrice(value['intTotalPrice'])

                if (!value.IsMaster)
                    value['dblPriceUnitAgent_FNP'] = $.pngFormatPrice(value['dblPriceUnitAgent'])
                value['dblPriceTotalAgent_FNP'] = $.pngFormatPrice(value['dblPriceTotalAgent'])
            }
            , editRltArr: function (arr) {
                return Arr_ListAgentBookingItemDetail
            }
            , objCols: objCols
            // ,editTableInput:function(){}
            , changeCkbMaster: function (IsChecked, intRowID, arrList) {
                ArrListTbl = arrList
            }
            , customEvent: function (_idOrClass) {
            }
            // ,changeInput:function(){}
            , IsViewCheckBoxMain: false
            , idOrClass: IdOrClass_Pn + ' #pnTable'
        })


        $(IdOrClass_Pn + ' #pnTable').find('table').attr('border', '1').attr('cellspacing', '0').attr('cellpadding', '5')
    }


}


$.ModulePage_BookingDetailMain_PopUpCancelBooking = function (options) {
    var defaults = {
        strUserGUID: null
        , strCompanyGUID: null
        , strBookingItemGUID: null
        , objBookingDetail: {}
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    var Obj_BookingDetail = options.objBookingDetail

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX


    var ObjList_Api = {

        UpdCancellationTermByBookingItemGUID: {
            strApiLink: 'api/payrcvbooking/UpdCancellationTermByBookingItemGUID'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingItemGUID: options.strBookingItemGUID
                , dtmDateDay: null
            }
        },

        UpdCancellationTermByBookingGUID: {
            strApiLink: 'api/payrcvbooking/UpdCancellationTermByBookingGUID'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: Obj_BookingDetail.strBookingGUID
                , dtmDateDay: null
            }
        },

        GetListBookingCancellationPolicyForBooking: {
            strApiLink: 'api/booking/GetListBookingCancellationPolicyForBooking'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingCancellationPolicyGUID: null
                , strBookingGUID: Obj_BookingDetail.strBookingGUID
                , strBookingItemGUID: options.strBookingItemGUID
                , dtmDateDay: null
                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        },

    }

    if (options.strBookingItemGUID) {
        Is_CancelAll = false
    } else {
        Is_CancelAll = true
    }

    var Arr_ListCancellationPolicy = []

    var Obj_FN_Main = {}



    GetPopUp()

    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: 'Cancellation Booking'
            , intTypeSize: 2
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {

            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true,true)

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class="panel-itl"'
                , childTags: [{ div: 'class="row"' }]
                , pnForm: { tag: 'div', attr: 'class="col-md-12 pn-margin-b-30"' }
                , pnContent: { tag: 'div', attr: 'class="col-md-12"' }
                , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
                //--------------END - GETLIST
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnForm = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn
            pngPn.getForm({
                action: 1,
                objInput: {
                    strGroupName: {
                        title: 'Group Name', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , intGroupSize: {
                        title: '<span langkey="pg_Dft_TC_LtBk_GroupSize"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , strCompanyName: {
                        title: '<span langkey="pg_Dft_TC_LtBk_CompanyName"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dtmDateFromTo: {
                        title: '<span langkey="pg_Dft_TC_LtBk_DateFrom-DateTo"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , ________________0: { title: '', attr: "class='col-md-12' style='margin:0'", input: { IsNoInput: true, IsViewDtl: true } }
                    , strOrderStatusName: {
                        title: 'Booking Status', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceTotal_View: {
                        title: 'Total Price', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPricePaid_View: {
                        title: 'Paid', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceBalance_View: {
                        title: 'Balance', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                },
                idOrClass: IdOrClass_Pn,
                objDetail: Obj_BookingDetail,
                OnChkSuccess: function () { }
            })

        }


        objEvtPanel.pnContent = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += '<div class="pnTbl"></div>'
            strHtml += '<div class="pnTotalCharge pn-margin-t-b-15"></div>'
            $(IdOrClass_Pn).html(strHtml)



            pngPn.getTable2({
                objApi: ObjList_Api.GetListBookingCancellationPolicyForBooking
                , objParams_Cus: null
                , editRlt: function (value, key) {

                    value.dtmDateFrom_View = $.pngFormatDateTime(value.dtmDateFrom)
                    value.dtmDateTo_View = $.pngFormatDateTime(value.dtmDateTo)
                    value.dblPriceChargeCancel_View = $.pngFormatPrice(value.dblPriceChargeCancel)

                    // valTbl['strHtmlAction']= '<button class="btnDelete btn btn-danger" data="' + keyTbl + '"><i class="fa fa-trash"></i></button>'
                }
                , objCols: {
                    'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                    , strServiceName: { name: '<span langkey="pg_Dft_TC_OrDtl_ServiceName"></span>' }
                    , dtmDateFrom_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateFrom"></span>' }
                    , dtmDateTo_View: { name: '<span langkey="pg_Dft_TC_OrDtl_DateTo"></span>' }
                    , dblPriceChargeCancel_View: { name: 'Phí hủy', strAttrTD: '' }
                }
                // ,editTableInput:function(){}
                , changeCkbMaster: function (IsChecked, intRowID, arrList) {
                    Arr_ListCancellationPolicy = arrList
                }
                , customEvent: function (_idOrClassPn) {

                    if (Arr_ListCancellationPolicy.length)
                        $('.pnTotalCharge', IdOrClass_Pn).html('<b>Total Price Charge: </b>' + $.pngFormatPrice(Arr_ListCancellationPolicy[0].dblSumPriceChargeCancel))
                    else
                        $(_idOrClassPn).html('<b>Không mất phí hủy Dịch Vụ</b>')
                }
                // ,changeInput:function(){}
                , IsViewCheckBoxMain: false
                , idOrClass: IdOrClass_Pn + ' .pnTbl'
            })


        }


        objEvtPanel.pnBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += '<div class="pn-margin-t-b-15">'
            strHtml += '<button id="pnCancelation" class="btn btn-default">Cancelation</button>'
            strHtml += '</div>'
            $(IdOrClass_Pn).html(strHtml)


            $('#pnCancelation', IdOrClass_Pn).click(function () {

                $.Confirm({
                    strContent: '<span langkey="sys_Cfm_AYS"></span>'
                    , OnSuccess: function () {

                        if (Is_CancelAll) {

                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                , objListApi_RtnVal: {
                                    'UpdCancellationTermByBookingGUID': {
                                        objParams_Cus: {}
                                        , OnSuccess: function (data) {
                                            options.OnSuccess.call()
                                        }
                                    },
                                }
                            })
                        } else {

                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                , objListApi_RtnVal: {
                                    'UpdCancellationTermByBookingItemGUID': {
                                        objParams_Cus: {}
                                        , OnSuccess: function (data) {
                                            options.OnSuccess.call()
                                        }
                                    },
                                }
                            })
                        }
                    }
                })

            })
        }

        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })



        function pnForm_GetPanel(_Opt) {
            var Dft = {
                idOrClass: ''
                , OnSuccess: function () {

                }
            }
            _Opt = $.extend(Dft, _Opt);

            var IdOrClass_Pn = _Opt.idOrClass


            $(IdOrClass_Pn).html('<div id="pnFormDtl"></div><div id="pnCnt"></div><div id="pnBtn"></div>')
            //Total Amount:	1,200,000	Total Paid:	200,000	Total Balance:	1,000,000

            Obj_DetailBK['dblPriceTotalView'] = $.pngFormatPrice(Obj_DetailBK['dblPriceTotal'])
            Obj_DetailBK['dblPricePaidView'] = $.pngFormatPrice(Obj_DetailBK['dblPricePaid'])
            Obj_DetailBK['dblPriceBalanceView'] = $.pngFormatPrice(Obj_DetailBK['dblPriceBalance'])


            pngPn.getForm({
                action: 1,
                objInput: {
                    strGroupName: {
                        title: 'Group Name', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , intGroupSize: {
                        title: '<span langkey="pg_Dft_TC_LtBk_GroupSize"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , strCompanyName: {
                        title: '<span langkey="pg_Dft_TC_LtBk_CompanyName"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dtmDateFromTo: {
                        title: '<span langkey="pg_Dft_TC_LtBk_DateFrom-DateTo"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceTotalView: {
                        title: '<span langkey="pg_Dft_TC_LtBk_PriceTotal"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPricePaidView: {
                        title: '<span langkey="pg_Dft_TC_LtBk_PricePaid"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceBalanceView: {
                        title: '<span langkey="pg_Dft_TC_LtBk_PriceBalance"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                },
                idOrClass: IdOrClass_Pn + ' #pnFormDtl',
                objDetail: Obj_DetailBK,
                OnChkSuccess: function () { }
            })


            pngPn.getForm({
                action: 1,
                objInput: {
                    dblPriceCharge: {
                        title: 'Cancellation Charge', attr: "class='col-md-12'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , strRemark: {
                        title: 'Remark', isRequire: false, attr: "class='col-md-12'", IsRtn: true
                        , input: { type: 'textarea', classEx: 'form-control', attr: 'rows="5" ' }
                    }
                    // ,PanelPaymentMethod:{title:'',attr:"class='col-md-12' style='margin:0'"
                    //     ,input:{IsNoInput:true}
                    // }

                },
                idOrClass: IdOrClass_Pn + ' #pnCnt',
                objDetail: {
                    dblPriceCharge: $.pngFormatPrice(Obj_CancellationPolicyPriceCharge.dblPriceCharge)
                }
            })


            if (Obj_CancellationPolicyPriceCharge.dblPriceCharge) {
                // pngPn.getForm({
                //     action: 1,
                //     objInput: {
                //         intPaymentMethodID:{title:'<span langkey="pg_Dft_TC_OrDtl_Paymentmethod"></span>',attr:"class='col-md-12'"
                //             ,input:{type:'select',classEx:'form-control',attr:''}
                //             ,dropDown:{arrList: Arr_PaymentMethod_Ddl}
                //         }
                //         ,PanelPayDtl:{title:'',attr:"class='col-md-12' style='margin:0'"
                //             ,input:{IsNoInput:true}
                //         }
                //     },
                //     idOrClass: IdOrClass_Pn+' .pnElm-PanelPaymentMethod',
                //     objDetail: {}
                // })

                // $(".intPaymentMethodID",IdOrClass_Pn+' .pnElm-PanelPaymentMethod').change(function(){

                //     var idOrClass = IdOrClass_Pn+' .pnElm-PanelPayDtl'

                //     var strHtml = ''
                //     if(this.value == 11){

                //         strHtml+='(Credit Balance: '+$.pngFormatPrice(Dbl_CreditRemain)+')'
                //         $(idOrClass).html(strHtml)
                //     }
                //     if(this.value ==1){


                //         pngPn.getForm({
                //             action: 1,
                //             objInput: {
                //                 strCompanyBankAccountGUID:{title:'',attr:"class='col-md-12'"
                //                     ,input:{type:'select',classEx:'form-control',attr:''}
                //                     ,dropDown:{arrList: $.pngGetArrComboValue(Arr_ListBankAccount,'strCompanyBankAccountGUID','strNameDisplay')}
                //                 }
                //                 ,PanelBkAcDtl:{title:'',attr:"class='col-md-12' style='margin:0'"
                //                     ,input:{IsNoInput:true}
                //                 }
                //             },
                //             idOrClass: idOrClass,
                //             objDetail: {}
                //         })

                //         $(idOrClass).find('.strCompanyBankAccountGUID').change(function(){
                //             var self = this
                //             Str_CompanyBankAccountGUID = this.value
                //             var obj = Arr_ListBankAccount.filter(function(item){ return item.strCompanyBankAccountGUID == self.value })[0]

                //             strHtml =''
                //             strHtml+='<b>Account Name:</b> '+obj.strCompanyBankAccountName
                //             strHtml+='<br><b>Account Code:</b> '+obj.strCompanyBankAccountCode
                //             strHtml+='<br><b>Bank Name:</b> '+obj.strCompanyBankAccountInfo
                //             strHtml+='<br><b>Bank Add:</b> '+obj.strBankAddress
                //             strHtml+='<br><b>SwiftCode:</b> '+obj.strSwiftCode
                //             $('.pnElm-PanelBkAcDtl').html(strHtml)

                //         }).change()

                //     }

                //     if(this.value ==3){
                //         strHtml+= '<img src="https://logos-world.net/wp-content/uploads/2020/04/PayPal-Logo.png" style="height: 35px;">'
                //         strHtml+= '<img src="https://thietkelogo.com/wp-content/uploads/2017/10/logo-mastercard.jpg" style="height: 35px;">'
                //         $(idOrClass).html(strHtml)

                //     }
                // }).change()

            }


            var strHtml = ''
            strHtml += '<button class="btn btn-danger" action="viewconf" id="btnCancellation"><i class="fa fa-cash"></i>Cancellation All</button>'

            $(IdOrClass_Pn + ' #pnBtn').html(strHtml)

            $('#btnCancellation').click(function () {

                $.Confirm({
                    strContent: '<span langkey="sys_Cfm_AYS"></span>'
                    , OnSuccess: function () {
                        png.postListApiGetValue({
                            objList_Api: ObjList_Api
                            , objListApi_RtnVal: {
                                'UpdBookingStatusCancellation': {
                                    objParams_Cus: {
                                        dblCancellationCharge: Obj_CancellationPolicyPriceCharge.dblPriceCharge
                                        , strRemark: $(IdOrClass_Pn + ' .strRemark').val()
                                    }
                                    , OnSuccess: function (data) {
                                        // return JSON.parse(data)[0]
                                    }
                                }
                            }
                            , OnSuccessList: function (data) {
                                $.Confirm({ strContent: pngElm.getLangKey({ langkey: 'sys_Cfm_UpdSuccess' }) })
                                Obj_FN_Main.OnClosePp(true, true)
                                options.OnSuccess.call()
                            }
                        })
                    }
                })

            })

        }



        // var strHtml = '';
        // strHtml += '<div class="row">';
        //     strHtml += '<div class="form-group">';
        //     strHtml += '<div class="col-md-12" style="margin-bottom:15px"><b>Total Price : '+$.pngFormatPrice(Obj_DetailBK.dblPriceTotal)+' </b></div>';
        //     strHtml += '<div class="col-md-12" style="margin-bottom:15px"><b>Total Paid: '+$.pngFormatPrice(Obj_DetailBK.dblPricePaid)+' </b></div>';
        //     // strHtml += '<div class="col-md-12" style="margin-bottom:15px"><b>Date Deadline: </b> '+$.pngFormatDateTime(Obj_PaymentAmuontAnfPeriod.dtmDateDeadline)+'</div>';
        //     strHtml += '<div class="col-md-12 control-label">'
        //     strHtml += '<div> </div>'
        //     strHtml += '<div><b>Price charge: <a action="list-pt" id="PricePayment">'+$.pngFormatPrice(Obj_PaymentAmuontAnfPeriod.dblPriceCharge)+'</a></b></div>'
        //     strHtml += '</div>';
        //     strHtml += '<label class="col-md-3 control-label"><span langkey="pg_Dft_TC_OrDtl_Paymentmethod"></span>: </label>';
        //     strHtml += '<div class="col-md-9"><select  class="form-control" style="width:200px" id="ddlPaymentMethod"></select>'
        //     strHtml += '    <div id="pnPayEx"></div>'
        //     strHtml += '</div></div>';
        //     // strHtml += '<div class="form-group" style="clear: both;padding-top: 10px;">';
        //     // strHtml += '<label class="col-md-3 control-label"><span langkey="pg_Dft_TC_OrDtl_Remark"></span>:</label>';
        //     // strHtml += '<div class="col-md-9"><textarea class="form-control" id="txtOrderRemark" placeholder=""></textarea></div></div>';
        //     strHtml += '<div class="col-md-12"><button class="btn btn-success" action="viewconf" id="btnPayment"><i class="fa fa-cash"></i>Cancellation Booking</button></div>';
        // strHtml += '</div>';
        // $(IdOrClass_Main).html(strHtml);

        // var strHtml_Ddl=''
        // Arr_PaymentMethod_Ddl.forEach(function(value){
        //     strHtml_Ddl+='<option value="'+Object.keys(value)[0]+'">'+value[Object.keys(value)]+'</option>'
        // })

        // $("#ddlPaymentMethod",IdOrClass_Main).html(strHtml_Ddl)
        // $("#ddlPaymentMethod",IdOrClass_Main).change(function(){
        //     var strHtml = ''
        //     if(this.value == 11){

        //         strHtml+='(Credit Balance: '+$.pngFormatPrice(Dbl_CreditRemain)+')'
        //         $('#pnPayEx').html(strHtml)
        //     }
        //     if(this.value ==1){
        //         var objParams = {
        //             strWhere : null
        //             ,strOrder : null
        //             ,strCompanyGUID :  options.strCompanyOwnerGUID
        //             ,intMemberTypeID : 1
        //             ,intCurPage : null
        //             ,intPageSize : null
        //             ,tblsReturn : null
        //         }

        //         png.post({
        //             url: "api/user/GetFilterCompanyBankAccount",
        //             data: {strJson : JSON.stringify(objParams)},
        //             OnSuccess: function (data) {
        //                 // console.log(data)
        //                 var ArrList = JSON.parse(data)[0]

        //                 strHtml+= '<select class="form-control">'
        //                 ArrList.forEach(function(value){
        //                     strHtml+= '<option value="'+value.strCompanyBankAccountGUID+'">'+value.strNameDisplay+'</option>'
        //                 })
        //                 strHtml+='</select>'
        //                 strHtml+='<div id="pnCnt"></div>'
        //                 $('#pnPayEx').html(strHtml)


        //                 $('#pnPayEx').find('select').change(function(){
        //                     var self = this
        //                     Str_CompanyBankAccountGUID = this.value
        //                     var obj = ArrList.filter(function(item){ return item.strCompanyBankAccountGUID == self.value })[0]

        //                     strHtml =''
        //                     strHtml+='<b>Account Name:</b> '+obj.strCompanyBankAccountName
        //                     strHtml+='<br><b>Account Code:</b> '+obj.strCompanyBankAccountCode
        //                     strHtml+='<br><b>Bank Name:</b> '+obj.strCompanyBankAccountInfo
        //                     strHtml+='<br><b>Bank Add:</b> '+obj.strBankAddress
        //                     strHtml+='<br><b>SwiftCode:</b> '+obj.strSwiftCode
        //                     $('#pnPayEx #pnCnt').html(strHtml)

        //                 }).change()

        //             }
        //         })

        //     }
        //     if(this.value ==3){
        //         strHtml+= '<img src="https://logos-world.net/wp-content/uploads/2020/04/PayPal-Logo.png" style="height: 35px;">'
        //         strHtml+= '<img src="https://thietkelogo.com/wp-content/uploads/2017/10/logo-mastercard.jpg" style="height: 35px;">'
        //         $('#pnPayEx').html(strHtml)

        //     }

        // }).change()

        // $(IdOrClass_Main +' #btnPayment').click(function(){
        //     var objParams = {
        //         strUserGUID:options.strUserGUID
        //         ,strCompanyOwnerGUID: options.strCompanyOwnerGUID
        //         ,strBookingGUID:Obj_DetailBK.strBookingGUID

        //         ,intPaymentMethodID: $("#ddlPaymentMethod").val()
        //         ,dblPricePayment: Obj_PaymentAmuontAnfPeriod.dblPriceCharge
        //         ,strCompanyBankAccountGUID: Str_CompanyBankAccountGUID
        //         ,dtmInvoiceDeadline: $.pngFormatDateTime(Obj_PaymentAmuontAnfPeriod.dtmDateDeadline,'l')
        //         ,strCompanyPartnerGUID: options.strCompanyPartnerGUID
        //     }
        //     $.Confirm({ 
        //         strContent: '<span langkey="sys_Cfm_AYS"></span>' 
        //         ,OnSuccess: function(){

        //             png.post({
        //                 url: "api/booking/AddBookingInvoice",
        //                 data: {strJson : JSON.stringify(objParams)},
        //                 OnSuccess: function (data) {
        //                     options.OnSuccess.call()
        //                     Obj_FN_Main.OnClosePp(false,true)
        //                 }
        //             });
        //         }
        //     })
        // })


    }

}


$.ModulePage_BookingDetailMain_PopUpSendRequest = function (options) {
    var defaults = {
        strUserGUID: null
        , strBookingGUID: null
        , objDetailAgentHost: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    var Obj_DetailAgentHost = options.objDetailAgentHost

    //---------
    var Obj_FN_Main = {}
    //---------

    GetPopUp()
    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: '<span langkey="pg_RP_ListQuestion"></span>'
            , intTypeSize: 2//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}


        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: ''
                , childTags: [{ div: 'class="row"' }]
                , pnTitle: { tag: 'div', attr: 'class="col-md-12 pn-margin-t-b-15"' }
                , pnContent: { tag: 'div', attr: 'class="col-md-12"' }
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnTitle = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += Obj_DetailAgentHost.strCompanyName + (Obj_DetailAgentHost.strCompanyPhone ? ' - <b>Phone:</b> ' + Obj_DetailAgentHost.strCompanyPhone : '') + (Obj_DetailAgentHost.strCompanyEmail ? ' - <b>Email:</b> ' + Obj_DetailAgentHost.strCompanyEmail : '')
            $(IdOrClass_Pn).html(strHtml)
        }
        objEvtPanel.pnContent = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += '<div class="row pn-padding-t-15" style="background:#EBEDEE">'
            strHtml += '<div class="col-md-12">'
            strHtml += '<div id="pnTabList"></div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '<div id="pnTabCnt"></div>'
            $(IdOrClass_Pn).html(strHtml)

            var ObjListTab = {
                'tab-1': {
                    name: '<span langkey="pg_RP_Pending"></span>', isDefault: true,
                    OnClick: function () {
                        $.ModulePage_BookingDetailMain_PopUpSendRequest_TabPending({
                            strUserGUID: options.strUserGUID,
                            strBookingGUID: options.strBookingGUID,
                            strAgentHostBookingGUID: Obj_DetailAgentHost.strAgentHostBookingGUID,
                            // ,strCompanyOwnerGUID:options.strCompanyOwnerGUID
                            idOrClass: IdOrClass_Pn + ' #pnTabCnt',
                            OnSuccess: function () {

                            }
                        })
                    }
                },
                'tab-2': {
                    name: '<span langkey="pg_RP_Done"></span>', isDefault: false,
                    OnClick: function () {

                        $.ModulePage_BookingDetailMain_PopUpSendRequest_TabDone({
                            strUserGUID: options.strUserGUID,
                            strBookingGUID: options.strBookingGUID
                            , strAgentHostBookingGUID: Obj_DetailAgentHost.strAgentHostBookingGUID
                            , idOrClass: IdOrClass_Pn + ' #pnTabCnt'
                            , OnSuccess: function () {

                            }
                        })
                    }
                },
            }


            pngElm.getTabs({
                idOrClassPnTab: IdOrClass_Pn + ' #pnTabList'
                , arrTab: ObjListTab
                , IsPushUrl: true
                // ,strQueryName:'tab'
            })
        }



        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })



    }





}

$.ModulePage_BookingDetailMain_PopUpSendRequest_TabPending = function (options) {
    var defaults = {
        strUserGUID: null
        , strBookingGUID: null
        , strAgentHostBookingGUID: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = options.idOrClass
    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX

    var Obj_FN_Main = {}

    var ObjList_Api = {
        GetListAgentRequest: {
            strApiLink: 'api/request/GetListAgentRequest'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strAgentRequestGUID: null
                , strBookingGUID: options.strBookingGUID
                , strAgentHostBookingGUID: options.strAgentHostBookingGUID
                , strCompanyGUID: null
                , strMemberGUID: null
                , strPartnerCompanyGUID: null
                , strPassengerGUID: null
                , isDone: 0
                , intCurPage: 1
                , intPageSize: 10
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
    }

    GetMainPanel()
    function GetMainPanel() {
        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: {                 // Khai báo các thành phần của panel
                pnMain: {
                    tag: 'div', attr: 'class="panel-itl"'
                    , childTags: [{ div: 'class="row"' }]
                    , pnListBtn: { tag: 'div', attr: 'class="col-md-12 pn-margin-t-b-15"' }
                    , pnTable: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnNote: { tag: 'div', attr: 'class="col-md-12"' }

                }
            }
            , objEvtPanel: {

                pnListBtn: function (_IdOrClassPn, _objAll, _OnRtn) {

                    var strHtml = '<button id="btnCreateQuestion" class="btn btn-texticon bg-primary"><i class="fa fa-pencil-square-o"></i><span langkey="pg_RP_MakeQuestion"></span></button>'

                    $(_IdOrClassPn).html(strHtml)
                    $('#btnCreateQuestion').click(function () {
                        $.ModulePage_BookingDetailMain_PopUpSendRequest_TabPending_MakeQuestion({
                            strUserGUID: options.strUserGUID,
                            strBookingGUID: options.strBookingGUID,
                            strAgentHostBookingGUID: options.strAgentHostBookingGUID,
                            OnSuccess: function () {
                                Obj_FN_Main.pnMain('pnTable')
                            }
                        })
                    })


                    _OnRtn('')
                },
                pnTable: function (_IdOrClassPn, _objAll, _OnRtn) {

                    pnTable_GetPanel({
                        idOrClass: _IdOrClassPn
                    })

                    _OnRtn('')
                },
                pnNote: function (_IdOrClassPn, _objAll, _OnRtn) {

                    var strHtml = '<i style=" float: right; color: red; "><span langkey="pg_RP_CloseQuestionNote"></span></i>'

                    $(_IdOrClassPn).html(strHtml)

                    _OnRtn('')
                },

            }
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })
    }

    function pnTable_GetPanel(_Opt) {
        var Dft = {
            idOrClass: ''
            , OnSuccess: function () {

            }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Pn = _Opt.idOrClass


        //---------ObjConfigLang
        //---------ArrConfigLang
        //---------IsConfigLang
        //---------IntConfigLang
        //---------StrConfigLang

        pngPn.getTable2({
            objApi: ObjList_Api.GetListAgentRequest
            , objParams_Cus: {
            }
            , editRlt: function (valTbl, keyTbl) {
                valTbl['strAgentRequestCodeView'] = '<a class="viewQuestion" style="cursor:pointer" data="' + keyTbl + '">' + valTbl['strAgentRequestCode'] + '</a>'
                valTbl['dtmCreateDateView'] = $.pngFormatDateTime(valTbl['dtmCreateDate'], "Do MMMM YYYY")

                valTbl['strHtmlAction'] = ''
                valTbl['strHtmlAction'] += '<a class="btn btn-default btn-texticon viewQuestion" data="' + keyTbl + '"><i class="fa fa-comment-o"></i><span>Reply</span></a>'

            }
            , objCols: {

                No: { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                , strAgentRequestCodeView: { name: '<span langkey="pg_RP_QuestionCode"></span>' }
                , strTitle: { name: '<span langkey="pg_Main_TC_mdLR_RequestTitle"></span>' }
                , strAgentRequestFrom: { name: '<span langkey="pg_RP_CreateBy"></span>' }
                , dtmCreateDateView: { name: '<span langkey="pg_RP_CreateDate"></span>' }
                , strSupportStatusName: { name: '<span langkey="pg_RP_StatusProcess"></span>' }
                , strHtmlAction: { name: '<span langkey="sys_Txt_Action"></span>' }

            }
            // ,editTableInput:function(){}
            , changeCkbMaster: function (IsChecked, intRowID, arrList) {

                ArrListTbl = arrList
            }
            , customEvent: function () {
                $(IdOrClass_Main + ' .viewQuestion').click(function () {
                    var data = $(this).attr('data')
                    $.ModulePage_BookingDetailMain_PopUpSendRequest_ViewReply({
                        strUserGUID: options.strUserGUID,
                        strBookingGUID: options.strBookingGUID,
                        strAgentHostBookingGUID: options.strAgentHostBookingGUID,
                        isDone: 0,
                        objDetail: ArrListTbl[data]
                        , OnSuccess: function () {
                            Obj_FN_Main.pnMain('pnTable')
                        }
                    })

                })
            }
            // ,changeInput:function(){}
            , IsViewCheckBoxMain: false
            , idOrClass: IdOrClass_Pn
        })
    }


}

$.ModulePage_BookingDetailMain_PopUpSendRequest_TabPending_MakeQuestion = function (options) {
    var defaults = {
        strUserGUID: null
        , strBookingGUID: null
        , strAgentHostBookingGUID: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX
    var Obj_DetailCom = JSON.parse(png.ArrLS.UserDetail.get())

    var ObjList_Api = {
        AddAgentRequest: {
            strApiLink: 'api/request/AddAgentRequest'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: options.strBookingGUID
                , strAgentHostBookingGUID: options.strAgentHostBookingGUID
                , strMemberGUID: (Obj_DetailCom.strCompanyGUID != null ? null : Obj_DetailCom.strUserGUID)
                , strPartnerCompanyGUID: (Obj_DetailCom.strCompanyGUID != null ? Obj_DetailCom.strCompanyGUID : null)
                , strPassengerGUID: null
                , strTitle: null
                , strContent: null
                , intTypeOfCommentID: null
                , intCommentForID: null
            }
        }
    }

    var Obj_FormInput = {
        strTitle: {
            title: '<span langkey="pg_Main_TC_mdLR_RequestTitle"></span>', isRequire: true, attr: "class='col-md-12'", IsRtn: true
            , input: { type: 'text', classEx: 'form-control', attr: '' }

        }
        , strContent: {
            title: '<span langkey="pg_Main_LRq_RequestContent"></span>', isRequire: true, attr: "class='col-md-12'"
            , input: { type: 'textarea', classEx: 'form-control', attr: 'rows="5" ' }
        }
    }

    var Obj_FN_Main = {}


    GetPopUp()
    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: '<span langkey="pg_RP_MakeQuestion"></span>'
            , intTypeSize: 1//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}


        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class="panel-itl"', childTags: [{ div: 'class="row"' }]
                , pnForm: { tag: 'div', attr: 'class="col-md-12"' }
                , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnForm = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            pngPn.getForm({
                action: 1,
                objInput: Obj_FormInput, //,options.objDetail
                idOrClass: IdOrClass_Pn,
            })

        }

        objEvtPanel.pnBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = '<button id="btnSend" class="btn btn-texticon bg-primary"><i class="fa fa-external-link-square"></i><span>Send</span></button>'
            $(IdOrClass_Pn).html(strHtml)

            $(IdOrClass_Pn + ' #btnSend').click(function () {
                pngPn.getForm({
                    action: 2,
                    objInput: Obj_FormInput,
                    idOrClass: IdOrClass_Main + ' #pnForm',
                    OnChkSuccess: function (objRtn) {
                        if (objRtn) {
                            png.postListApiGetValue({
                                objList_Api: ObjList_Api
                                , objListApi_RtnVal: {
                                    'AddAgentRequest': {
                                        objParams_Cus: objRtn
                                        , OnSuccess: function (data) {
                                            _OnClosePp(false, true)
                                            options.OnSuccess.call()
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            })
        }

        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })



    }



}

$.ModulePage_BookingDetailMain_PopUpSendRequest_TabDone = function (options) {
    var defaults = {
        strUserGUID: null
        , strBookingGUID: null
        , strAgentHostBookingGUID: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = options.idOrClass
    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX

    var Obj_FN_Main = {}

    var ObjList_Api = {
        GetListAgentRequest: {
            strApiLink: 'api/request/GetListAgentRequest'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strAgentRequestGUID: null
                , strBookingGUID: options.strBookingGUID
                , strAgentHostBookingGUID: options.strAgentHostBookingGUID
                , strCompanyGUID: null
                , strMemberGUID: null
                , strPartnerCompanyGUID: null
                , strPassengerGUID: null
                , isDone: 1
                , intCurPage: 1
                , intPageSize: 10
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
    }

    GetMainPanel()
    function GetMainPanel() {
        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: {                 // Khai báo các thành phần của panel
                pnMain: {
                    tag: 'div', attr: 'class="panel-itl"'
                    , childTags: [{ div: 'class="row"' }]
                    , pnTable: { tag: 'div', attr: 'class="col-md-12"' }
                }
            }
            , objEvtPanel: {

                pnTable: function (_IdOrClassPn, _objAll, _OnRtn) {

                    pnTable_GetPanel({
                        idOrClass: _IdOrClassPn
                    })

                    _OnRtn('')
                },

            }
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })
    }

    function pnTable_GetPanel(_Opt) {
        var Dft = {
            idOrClass: ''
            , OnSuccess: function () {

            }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Pn = _Opt.idOrClass


        //---------ObjConfigLang
        //---------ArrConfigLang
        //---------IsConfigLang
        //---------IntConfigLang
        //---------StrConfigLang

        pngPn.getTable2({
            objApi: ObjList_Api.GetListAgentRequest
            , objParams_Cus: {
            }
            , editRlt: function (valTbl, keyTbl) {
                // valTbl['strHtmlAction']= '<button class="btnDelete btn btn-danger" data="' + keyTbl + '"><i class="fa fa-trash"></i></button>'

                valTbl['strAgentRequestCodeView'] = '<a class="viewQuestion" style="cursor:pointer" data="' + keyTbl + '">' + valTbl['strAgentRequestCode'] + '</a>'
                valTbl['dtmCreateDateView'] = $.pngFormatDateTime(valTbl['dtmCreateDate'], "Do MMMM YYYY")
                valTbl['dtmLastUpdatedDateView'] = $.pngFormatDateTime(valTbl['dtmLastUpdatedDate'], "Do MMMM YYYY")

                valTbl['strHtmlAction'] = ''
                valTbl['strHtmlAction'] += '<a class="btn btn-default viewQuestion" data="' + keyTbl + '"><span>View Detail</span></a>'

            }
            , objCols: {

                No: { name: '<span langkey="pg_Main_TC_mdCl_No"></span>' }
                , strAgentRequestCodeView: { name: '<span langkey="pg_RP_QuestionCode"></span>' }
                , strTitle: { name: '<span langkey="pg_Main_TC_mdLR_RequestTitle"></span>' }
                , strAgentRequestFrom: { name: '<span langkey="pg_RP_CreateBy"></span>' }
                , dtmCreateDateView: { name: '<span langkey="pg_RP_CreateDate"></span>' }
                , dtmLastUpdatedDateView: { name: '<span langkey="pg_RP_CloseDay"></span>' }
                //, IsShowMenu: { name: "IsShowMenu", input: { type: 'checkbox', classEx: '', attr: '' } }
                , strHtmlAction: { name: '<span langkey="sys_Txt_Action"></span>' }

            }
            // ,editTableInput:function(){}
            , changeCkbMaster: function (IsChecked, intRowID, arrList) {

                ArrListTbl = arrList
            }
            , customEvent: function () {
                $(IdOrClass_Main + ' .viewQuestion').click(function () {
                    var data = $(this).attr('data')
                    $.ModulePage_BookingDetailMain_PopUpSendRequest_ViewReply({
                        strUserGUID: options.strUserGUID,
                        strBookingGUID: options.strBookingGUID,
                        strAgentHostBookingGUID: options.strAgentHostBookingGUID,
                        isDone: 1,
                        objDetail: ArrListTbl[data]
                        , OnSuccess: function () {
                            Obj_FN_Main.pnMain('pnTable')
                        }
                    })

                })
            }
            // ,changeInput:function(){}
            , IsViewCheckBoxMain: false
            , idOrClass: IdOrClass_Pn
        })
    }


}


$.ModulePage_BookingDetailMain_PopUpSendRequest_ViewReply = function (options) {
    var defaults = {
        strUserGUID: null
        , strCompanyGUID: null
        , strBookingGUID: null
        , strAgentHostBookingGUID: null
        , isDone: null
        , objDetail: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX
    var Obj_DetailCom = JSON.parse(png.ArrLS.UserDetail.get())


    var ObjList_Api = {
        AddRequestReply: {
            strApiLink: 'api/request/AddRequestReply'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strAgentRequestGUID: options.objDetail.strAgentRequestGUID
                , strMemberPartnerGUID: (Obj_DetailCom.strCompanyGUID != null ? null : Obj_DetailCom.strUserGUID)
                , strCompanyOwnerGUID: null
                , strCompanyPartnerGUID: (Obj_DetailCom.strCompanyGUID != null ? Obj_DetailCom.strCompanyGUID : null)
                , strPassengerGUID: null
                , strContent: null
            }
        },
        GetListAgentRequest: {
            strApiLink: 'api/request/GetListAgentRequest'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strAgentRequestGUID: options.objDetail.strAgentRequestGUID
                , strBookingGUID: options.strBookingGUID
                , strAgentHostBookingGUID: options.strAgentHostBookingGUID
                , strCompanyGUID: null
                , strMemberGUID: null
                , strPartnerCompanyGUID: null
                , strPassengerGUID: null
                , isDone: options.isDone
                , intCurPage: 1
                , intPageSize: 10
                , strOrder: null
                , tblsReturn: '[1]'
            }
        },
        UpdAgentRequestForDone: {
            strApiLink: 'api/request/UpdAgentRequestForDone'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strAgentRequestGUID: options.objDetail.strAgentRequestGUID
            }
        }
    }

    var Obj_FN_Main = {}
    var strHtml = ""

    pngPn.getPopUp({
        strTitle: '<span langkey="pg_RP_DetailContent"></span>'
        , intTypeSize: 2
        , OnPanel: GetMainPanel
        , OnClosePopUp: function () {

        }
    })


    function GetMainPanel(_idOrClassPp, _OnClosePp) {

        IdOrClass_Main = _idOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        strHtml += '<div class="container" style="border: 1px solid #f7ec21;border-radius: 8px;background: white;" >'
        strHtml += '    <div style="font-size: large;margin: 5px 0;"><b><span style="color: red;">' + options.objDetail.strTitle + ' </span><span style=" font-size: 12px; ">(' + options.objDetail.strAgentRequestFrom + ' [ ' + $.pngFormatDateTime(options.objDetail.dtmCreateDate, "h:mm:ss a , Do MMMM YYYY") + ' ])</span></b>';
        strHtml += '<a style="display: none; float: right; background-color: #d3e874; color: #0c0b0b; font-size: 11px; padding: 7px; font-weight: bold; border-radius: 6px; " id="closeQuestion"><span langkey="pg_RP_CloseQuestion"></span></a> </div><hr style=" margin: 5px 0 15px 0; ">' //<span langkey="pg_RP_QuestionContent"></span> - 
        strHtml += '    <div style=" margin: 15px 0; "><span>' + options.objDetail.strContent + '</span> </div>'
        strHtml += '</div>'

        strHtml += '<div id="ContentQuestion"></div>'

        strHtml += '<div class="content">'
        strHtml += '    <div class="row">'
        strHtml += '        <div class="col-md-12" style="margin-top: 25px;">'
        strHtml += '            <textarea placeholder="Reply here..." rows="3" class="form-control" id="contentReply"></textarea>'
        strHtml += '            <button class="btn btn-primary" id="btnReply" style="float: right;margin-top: 2px;"><i class="fa fa-paper-plane"></i><span langkey="pg_RP_Reply"></span></button></div>'
        strHtml += '    </div>'
        strHtml += '</div>'

        $(IdOrClass_Main).html(strHtml);
        if (options.objDetail.strCreatedBy == options.strUserGUID && options.isDone == 0) {
            $(IdOrClass_Main + " #closeQuestion").show()
        }
        if (options.isDone == 1) {
            $(IdOrClass_Main + " .content").hide();
        }
        GetDetailReply()

        $(IdOrClass_Main + " #btnReply").click(function () {
            if ($(IdOrClass_Main + " #contentReply").val() != "") {
                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    , objListApi_RtnVal: {
                        'AddRequestReply': {
                            objParams_Cus: {
                                strContent: $(IdOrClass_Main + " #contentReply").val()
                            }
                            , OnSuccess: function (data) {
                                $(IdOrClass_Main + " #contentReply").val('')
                                GetDetailReply()

                            }
                        }
                    }
                })
            }

        });

        $(IdOrClass_Main + " #closeQuestion").click(function () {
            $.Confirm({
                strContent: '<span langkey="pg_RP_AreYouSure"></span>'
                , OnSuccess: function () {
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        , objListApi_RtnVal: {
                            'UpdAgentRequestForDone': {
                                objParams_Cus: {}
                                , OnSuccess: function (data) {
                                    Obj_FN_Main.OnClosePp(false, true);
                                    options.OnSuccess.call();
                                }
                            }
                        }
                    })
                }
            })


        });


    }

    function GetDetailReply() {

        png.postListApiGetValue({
            objList_Api: ObjList_Api
            , objListApi_RtnVal: {
                'GetListAgentRequest': {
                    objParams_Cus: {}
                    , OnSuccess: function (data) {
                        data = JSON.parse(data)[1]
                        console.log(data);
                        $("#ContentQuestion").html("")
                        var temp = ""
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                temp += '<div style="margin-top: 20px;">'
                                temp += '    <div style="margin-bottom: 3px;">'
                                temp += '        <span style="font-size: revert;border: 1px solid ' + data[i].strColorCode + ';padding: 10px 5px;border-radius: 6px;background:' + data[i].strColorCode + ';"><b>' + data[i].strRequestReplyFrom + ' [ ' + $.pngFormatDateTime(data[i].dtmCreatedDate, "h:mm:ss a , Do MMMM YYYY") + ' ]</b> </span></div>'
                                temp += '    <div class="container" style="border: 1px solid ' + data[i].strColorCode + ';background:' + data[i].strColorCode + '; border-radius: 6px;">'
                                temp += '        <div style=" margin: 15px 0; "><span>' + data[i].strContent + '</span> </div>'
                                temp += '    </div>'
                                temp += '</div>'
                                if (i == data.length - 1) {
                                    $("#ContentQuestion").html(temp)
                                }
                            }
                        }


                    }
                }
            }
        })



    }


}

$.ModulePage_BookingDetailMain_PopUpTourDetail = function (options) {
    var defaults = {
        strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID,
        strTourGUID: null,
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);


    var ObjList_Api = {
        GetListTourDetailByPtn: {
            strApiLink: 'api/tour/GetListTourDetailByPtn'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourGUID: options.strTourGUID

                , intCurPage: 1
                , intPageSize: 1
                , strOrder: null
                , tblsReturn: '[0]'
            }
        }
        , GetListTourDayByPtn: {
            strApiLink: 'api/tour/GetListTourDayByPtn'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourDayGUID: null
                , strTourGUID: options.strTourGUID
                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: null
                , tblsReturn: '[0]'
            }
        }
    }

    var ObjList_ComboValue = {
        ArrCountry: {
            getValCode: { strCombocode: "185" }
            , OnSuccessItem: function (data) {
                // data.unshift({'':'Select...'})
                return data
            }
        }
    }


    // $(idOrClass).html(strHtmlMain)

    // pngPn.getListArrOrObjValue({
    //     setListValue: ObjList_ComboValue,
    //     OnSuccessList:function(ObjListCombo){
    // GetMain()
    //     }
    // })


    //---------
    var Obj_Detail = {}
    var Arr_ListTbl = []
    var Obj_FormInput = {}
    var Obj_FN_Main = {}
    //---------

    png.postListApiGetValue({
        objList_Api: ObjList_Api
        // objList_ComboValue: ObjList_ComboValue
        , objListApi_RtnVal: {
            'GetListTourDetailByPtn': {
                objParams_Cus: {},
                OnSuccess: function (data) {
                    Obj_Detail = JSON.parse(data)[0][0]   // Dữ liệu trả về từ dropdownlist trên
                }
            },
            'GetListTourDayByPtn': {
                objParams_Cus: {},
                OnSuccess: function (data) {
                    Arr_ListTbl = JSON.parse(data)[0]
                }
            },
        }
        , OnSuccessList: function (data) {
            GetPopUp()
        }
    })

    // GetPopUp()
    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: 'Tour Detail'
            , intTypeSize: 3//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class="panel-itl"'
                , childTags: [{ div: 'class="row"' }]
                , pnListBtn: { tag: 'div', attr: 'class="col-md-12"' }
                , pnCnt: {
                    tag: 'div', attr: 'class="col-md-12"'
                    , childTags: [{ div: 'class="row" style="overflow:auto;max-height:80vh"' }]
                    , pnInfo: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnDes: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnItinerary: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnIn_ExClude: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnTerms_Conditions: { tag: 'div', attr: 'class="col-md-12"' }
                }


            }
        }


        var objEvtPanel = {}


        objEvtPanel.pnListBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''

            strHtml += '<div>'
            strHtml += '<button id="btnExportToWord" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-file-word-o"></i><span>Export to Word</span></button>'
            strHtml += '</div>'

            $(IdOrClass_Pn).html(strHtml)


            $('#btnExportToWord', IdOrClass_Pn).click(function () {

                window.open(png.getServerURL('Page/Export.aspx?type=GetExportTourDetail&strUserGUID=' + options.strUserGUID + '&strTourGUID=' + options.strTourGUID + ''))
            })


        }


        objEvtPanel.pnInfo = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += '        <h1 class="pn-margin-t-b-15" style="line-height: 35px;font-size: 25px;"><b>' + Obj_Detail.strServiceName + '</b></h1>'
            strHtml += '         <div class="pn-margin-b-15"><b>Company Name: </b>' + Obj_Detail.strCompanyName + '</div>'
            strHtml += '        <div style="color:#257EF8;font-weight:bold;text-transform: uppercase;margin-bottom: 25px;"><span>' + Obj_Detail.intNoOfDay + ' ' + pngElm.getLangKey({ langkey: 'sys_Txt-Days' }) + '/' + (Obj_Detail.intNoOfDay - 1) + ' ' + pngElm.getLangKey({ langkey: 'pg_Main_Tour_MdDtl_Nights' }) + '</span></div>'
            strHtml += '        <div style="background:url(\'' + (Obj_Detail.strTourImageUrl ? png.getServerImgURL(Obj_Detail.strTourImageUrl) : 'assets/images/img-noimage.png') + '\') no-repeat center;width: 100%;background-size: cover;height:300px"></div>'

            $(IdOrClass_Pn).html(strHtml)
        }

        objEvtPanel.pnDes = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtmlMain = ''

            strHtmlMain += '    <div class="col-md-6">'
            strHtmlMain += '         <h4 class="pn-margin-t-b-15"><b><span langkey="pg_Main_Tour_MdDtl_MainAttractions"></span></b></h4>'
            Obj_Detail.strListTourMainAttractionName.split(',').forEach(function (value) {
                strHtmlMain += '<div><i class="fa fa-check-square" style="color: #257ef8"></i> ' + value + '</div>'
            })
            strHtmlMain += '    </div>'
            strHtmlMain += '    <div class="col-md-6">'
            strHtmlMain += '        <h4 class="pn-margin-t-b-15"><b><span langkey="pg_Main_Tour_MdDtl_Citiescovered"></span></b></h4>'
            Obj_Detail.strListTourDestinationName.split(',').forEach(function (value) {
                strHtmlMain += '<div><i class="fa fa-check-square" style="color: #257ef8"></i> ' + value + '</div>'
            })
            strHtmlMain += '    </div>'
            $(IdOrClass_Pn).html(strHtmlMain)
        }


        objEvtPanel.pnItinerary = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            Arr_ListTbl.forEach(function (value) {
                strHtml += '<div>'
                strHtml += '    <div style="display: flow-root;padding: 20px 0;border-bottom: 1px #bdbdbd solid;">'
                strHtml += '        <div style="float:left;background:#257EF8;color:white;padding: 10px 40px;border-top-right-radius: 10em;border-bottom-right-radius: 10em;margin-right: 20px;">'
                strHtml += '            <strong>DAY ' + value.intDayOrder + '</strong>'
                strHtml += '        </div>'
                strHtml += '        <div style="display: flow-root">'
                strHtml += '            <strong style="font-size:18px;line-height: 40px;">'
                strHtml += '                ' + value.strDayTitleAndMeals
                strHtml += '            </strong>'
                strHtml += '        </div>'
                strHtml += '     </div>'
                strHtml += '</div>'
                strHtml += '<div><div class="pn-margin-t-15" style="padding:0 20px">' + value.strDayContent + '</div></div>'
            })
            $(IdOrClass_Pn).html(strHtml)

        }



        objEvtPanel.pnIn_ExClude = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''

            strHtml += '<div class="row" style="display: flex;">'
            strHtml += '<div class="col-md-6" style="display: flex;">'
            strHtml += '<div style="background:#fff;padding:15px;border-radius:1em;width: 100%;">'
            strHtml += '    <div class="tour_include_exclude">'
            strHtml += '        <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Include"></b></h3>  '
            strHtml += Obj_Detail.strIncluded
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '<div class="col-md-6" style="display: flex;">'
            strHtml += '<div style="background:#fff;padding:15px;border-radius:1em;width: 100%;">'
            strHtml += '    <div class="tour_include_exclude">'
            strHtml += '        <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Exclude"></b></h3>'
            strHtml += '        </div>     '
            strHtml += Obj_Detail.strExcluded
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '</div>'
            $(IdOrClass_Pn).html(strHtml)
        }


        objEvtPanel.pnTerms_Conditions = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn
            var strHtml = ''
            strHtml += '<div style="margin: 15px 0;">'
            strHtml += '<div style="background:#fff;padding:15px;border-radius:1em">'
            strHtml += '    <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Terms_Conditions"></b></h3>'
            strHtml += '    <div class="tours-terms-conditions">'
            strHtml += Obj_Detail.strTermAndCondition
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'

            $(IdOrClass_Pn).html(strHtml)

        }


        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })


    }




}


$.ModulePage_BookingDetailMain_PopUpViewSendQuote = function (options) {
    var defaults = {
        strUserGUID: null
        , arrListAgentBookingItemDetail: null
        , arrCustomerList: null
        , objBookingDetail: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''

    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX


    Obj_BookingDetail = options.objBookingDetail

    var Arr_ListAgentBookingItemDetail = options.arrListAgentBookingItemDetail

    var Obj_DetailProfile = JSON.parse(png.ArrLS.UserDetail.get())
    var Obj_DetailLeader = options.arrCustomerList.filter(function (item) { return item.IsLeader })[0]

    var Arr_ListCustomer = options.arrCustomerList

    var ObjList_Api = {

        GetEmailPricePassenger: {
            strApiLink: 'api/public/GetEmailPricePassenger'
            , objParams: {
                strOrderItemCode: Obj_BookingDetail.strOrderBookingCode
                , FullName: Obj_DetailLeader.strSaluteName + '. ' + Obj_DetailLeader.strPassengerName
                , strAdminEmail: Obj_DetailLeader.strPassengerEmail
                , PhoneNumber: Obj_DetailProfile.strMobile
                , strTemplateCode: "SQE"
                , intLangID: $.pngGetLangID()
            }
        },
    }
    var ObjList_ComboValue = {
        ArrValCode: {
            strCombocode: ""
        }
    }

    var Obj_DetailEmailTemplate = {}

    var Obj_FN_Main = {}


    png.postListApiGetValue({
        objList_Api: ObjList_Api
        , objListApi_RtnVal: {
            'GetEmailPricePassenger': {
                objParams_Cus: {}
                , OnSuccess: function (data) {
                    Obj_DetailEmailTemplate = JSON.parse(data)[0][0];
                }
            },
        }
        , OnSuccessList: function (data) {
            GetPopUp()
        }
    })

    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: Obj_DetailEmailTemplate.strEmailTemplateTitle
            , intTypeSize: 2//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }


    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class=""'
                , childTags: [{ div: 'class="row"' }]
                //--------------GETLIST     // Khai báo các tên thẻ con và thuôc tính của chúng
                , pnListBtn: { tag: 'div', attr: 'class="col-md-12"' }
                , pnContent: { tag: 'div', attr: 'class="col-md-12"' }
                //--------------END - GETLIST
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnListBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            strHtml += '<div class="panel-itl">'
            strHtml += '<button class="btn btn-texticon btn-default" id="btnPrint" style=""><i class="fa fa-print"></i><span>Print</span></button>'
            if (Obj_DetailLeader.strPassengerEmail)
                strHtml += '<button class="btn btn-texticon bg-primary" id="btnSendEmailToLeader" style=""><i class="fa fa-envelope"></i><span>Send To <b>' + Obj_DetailLeader.strPassengerEmail + '</b></span></button>'
            strHtml += '</div>'

            $(IdOrClass_Pn).html(strHtml)
            $(IdOrClass_Pn + ' #btnSendEmailToLeader').click(function () {
                if (Obj_DetailEmailTemplate.strEmailTo && Obj_DetailEmailTemplate.strEmailTemplateTitle) {
                    $.Confirm({
                        strContent: '<span langkey="sys_Cfm_AYS"> </span>'
                        , OnSuccess: function () {

                            png.postSendEmail({
                                strUserGUID: null
                                , strEmailsSendTo: Obj_DetailEmailTemplate.strEmailTo
                                , strEmailsCC: ""
                                , strEmailsBCC: Obj_DetailEmailTemplate.strEmailBcc
                                , strEmailTemplateSubject: Obj_DetailEmailTemplate.strEmailTemplateTitle
                                , IsBodyHtml: 1
                                , strEmailTemplateContent: $(IdOrClass_Main + ' #pnContent').html()
                                , strTempApiUrl: ""
                                , objTempPar: {
                                }
                                , OnSuccess: function (data) {
                                    if (data == "1") {
                                        $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailSuccess"></span>' })
                                        Obj_FN_Main.OnClosePp(true, true)
                                    } else {
                                        $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailFail"></span>' })
                                    }

                                }
                            })

                        }
                    })
                } else {
                    $.Confirm({ strContent: '<span langkey="sys_Txt_InputEmailLeader"> </span>' });
                }



            })

            $(IdOrClass_Pn + ' #btnPrint').click(function () {
                pngPn.getPopUpPrint({
                    idOrClass: IdOrClass_Main + ' #pnContent'
                    , strHtml: null
                })
            })

        }

        objEvtPanel.pnContent = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += '<div id="pnForm"></div>'
            strHtml += '<h4 style="text-align:center;margin:30px 0 15px"> <span langkey="sys_Txt_PriceList"></span></h4>'
            strHtml += '<div id="pnTablePrice"></div>'
            strHtml += '<div id="pnTotalPrice" align="right" style="color: red;margin-top:15px"></div>'
            strHtml += '<h4 style="text-align:center;margin:30px 0 15px"><span langkey="sys_Txt_MemberList"></span></h4>'
            strHtml += '<div id="pnTableCus"></div>'

            strHtml += '<div style="text-align: right;margin-top:20px"><b>Người gửi: </b>' + Obj_DetailProfile.strFullName + '</div>'
            strHtml += '<div style="text-align: right;"><b>SĐT: </b>' + Obj_DetailProfile.strMobile + '</div>'
            strHtml += '<div style="text-align: right;"><b>Email: </b>' + Obj_DetailProfile.strEmailWorking + '</div>'

            $(IdOrClass_Pn).html(strHtml)


            $(IdOrClass_Pn + ' #pnForm').html(Obj_DetailEmailTemplate.strEmailTemplateContent);

            console.log(Arr_ListAgentBookingItemDetail)
            pngPn.getTable2({
                objApi: null
                , objParams_Cus: null
                , editRltArr: function (arr) {
                    return Arr_ListAgentBookingItemDetail
                }
                , editRlt: function (value, key) {

                    if (!value.IsMaster)
                        value['dblPriceUnitAgent_View'] = $.pngFormatPrice(value.dblPriceUnitAgent)
                    value['dblPriceTotalAgent_View'] = $.pngFormatPrice(value.dblPriceTotalAgent)
                    value['dtmDateFrom_View'] = $.pngFormatDateTime(value.dtmDateFrom)
                    value['dtmDateTo_View'] = $.pngFormatDateTime(value.dtmDateTo)


                }
                , objCols: {

                    No: { name: pngElm.getLangKey({ langkey: 'sys_Txt_Tbl-No' }) }
                    , strServiceName_View: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_ServiceName' }) }
                    , dtmDateFrom_View: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_DateFrom' }) }
                    , dtmDateTo_View: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_DateTo' }) }
                    , intQuantity: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_TotalPax' }), strAttrTD: 'style="text-align:right"' }
                    , dblPriceUnitAgent_View: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_PriceUnit' }), strAttrTD: ' style="text-align: right"' }
                    , dblPriceTotalAgent_View: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_PriceTotal' }), strAttrTD: ' style="text-align: right"' }
                    , intOrderStatusID: { IsColSpecial: true, strStyle: { '4': '', '6': 'text-decoration: line-through;' } }
                }
                // ,editTableInput:function(){}
                , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                }
                , customEvent: function (_iOrClass_Pn) {


                }
                // ,changeInput:function(){}
                , IsViewCheckBoxMain: false
                , idOrClass: IdOrClass_Pn + ' #pnTablePrice'
            })



            var dblPriceTotalAgent = 0
            Arr_ListAgentBookingItemDetail.forEach(function (value) {
                if (value.intOrderStatusID != 6 && !value.IsMaster)
                    dblPriceTotalAgent += value.dblPriceTotalAgent
            })

            $(IdOrClass_Pn + ' #pnTotalPrice').html('<b>Total Price: ' + $.pngFormatPrice(dblPriceTotalAgent) + '</b>')


            pngPn.getTable2({
                objApi: null
                , objParams_Cus: null
                , editRltArr: function (arr) {
                    return Arr_ListCustomer
                }
                , editRlt: function (value, key) {
                    value.No = (key + 1)

                    value['dblPriceUnitAgent_View'] = $.pngFormatPrice(value.dblPriceUnitAgent)
                    value['dblPriceTotalAgent_View'] = $.pngFormatPrice(value.dblPriceTotalAgent)
                }
                , objCols: {

                    No: { name: pngElm.getLangKey({ langkey: 'sys_Txt_Tbl-No' }) }
                    , strSaluteName: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_Salute' }) }
                    , strPassengerName: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_CustomerName' }) }
                    , strAgeName: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_Age' }) }
                    , dtmPassengerBirthday: { name: pngElm.getLangKey({ langkey: 'pg_Dft_TC_OrDtl_DateOfBirth' }) }

                }
                // ,editTableInput:function(){}
                , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                }
                , customEvent: function (_iOrClass_Pn) {


                }
                // ,changeInput:function(){}
                , IsViewCheckBoxMain: false
                , idOrClass: IdOrClass_Pn + ' #pnTableCus'
            })

            $(IdOrClass_Pn + ' table').attr('border', '1').attr('cellspacing', '0').attr('cellpadding', '5').attr('width', '100%')


        }


        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })
    }

}



$.ModulePage_BookingDetailMain_PopUpPayable = function (options) {
    var defaults = {
        strUserGUID: null
        , strCompanyGUID: null
        , objBookingDetail: null
        , OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var IdOrClass_Main = ''


    var Obj_BookingDetail = JSON.parse(JSON.stringify(options.objBookingDetail))

    Obj_BookingDetail['dblPriceTotalView'] = $.pngFormatPrice(Obj_BookingDetail['dblPriceTotal'])
    Obj_BookingDetail['dblPricePaidView'] = $.pngFormatPrice(Obj_BookingDetail['dblPricePaid'])
    Obj_BookingDetail['dblPriceBalanceView'] = $.pngFormatPrice(Obj_BookingDetail['dblPriceBalance'])


    var Str_ReturnUrl = png.ObjClnUrl.APPB2B_Agent
    Str_ReturnUrl = $.pngGetQSVal('cname', $.pngGetQSVal('cname'), Str_ReturnUrl)
    Str_ReturnUrl = $.pngGetQSVal('page', 'payonline-return', Str_ReturnUrl)
    Str_ReturnUrl = $.pngGetQSVal('IsBooking', 'Book', Str_ReturnUrl)


    var ObjList_Api = {
        GetListPayableBookingItemByAgent: {
            strApiLink: 'api/payrcvbooking/GetListPayableBookingItemByAgent'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: Obj_BookingDetail.strBookingGUID
                , strBookingByAgentHostGUID: null
                , tblsReturn: null
            }
        },
        GetFilterCompanyBankAccount: {
            strApiLink: 'api/user/GetFilterCompanyBankAccount'
            , objParams: {
                strAgentCode: null
                , strWhere: null
                , strOrder: null
                , strCompanyGUID: null
                , intCurPage: null
                , intPageSize: null
                , tblsReturn: null
            }
        },
        AddOrUpdBookingToPayable: {
            strApiLink: 'api/payrcvbooking/AddOrUpdBookingToPayable'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingGUID: Obj_BookingDetail.strBookingGUID
                , intPaymentMethodID: null
                , strListCompanyBankAccountGUID: null
                , strPaidRemark: null
            }
        },
        UpdPaymentBookingPeriodForBankCheckingIsPaidByAgent: {
            strApiLink: 'api/payrcvbooking/UpdPaymentBookingPeriodForBankCheckingIsPaidByAgent'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strPaymentBookingPeriodGUID: null
                , intPayableStatusID: null
            }
        },
        GetCheckRemainCreditForPaymentBookingByAgent: {
            strApiLink: 'api/booking/GetCheckRemainCreditForPaymentBookingByAgent'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strCompanyGUID: options.strCompanyGUID
                , strBookingGUID: Obj_BookingDetail.strBookingGUID
            }
        },

        GetUrlPayOnline: {
            strApiLink: 'api/payonline/GetUrlPayOnline'
            , objParams: {
                strOrderBeforePaymentCode: null
                , strReturnUrl: Str_ReturnUrl
                , dblAmount: 0
                , strDescription: "payment online"
            }
        },

        AddPaymentTransactionByAgent: {
            strApiLink: 'api/booking/AddPaymentTransactionByAgent'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strOrderBookingCode: Obj_BookingDetail.strOrderBookingCode
                , intOrderStatusID: 4
                , strAgentCode: JSON.parse(png.ArrLS.UserDetail.get()).strAgentCode
                , dblPaymentTransactionAmount: null
                , strRemark: null
            }
        },
    }

    var ObjList_ComboValue = {
        Arr_ValCode: {
            strCombocode: ''
        }
        , Arr_PaymentMethod: {
            strTableName: 'OB12'
            , strFeildSelect: 'OB12_PaymentMethodID AS intID,OB12_PaymentMethodName AS strName'
            , strWhere: 'WHERE IsActive=1 ORDER BY OB12_Order'
        }
    }

    var Arr_PaymentMethod = []
    var Arr_PayableBookingItem = []
    var Arr_PaymentBookingPeriod = []
    var Arr_AgentHostBooking = []

    var Obj_FormBooking = {
        dblPriceCharge: 0
    }
    //---------
    var Obj_FN_Main = {}
    //---------

    png.postListApiGetValue({
        // objList_Api: ObjList_Api
        objList_ComboValue: ObjList_ComboValue
        // ,objListApi_RtnVal: {
        //     'GetListPayableBookingItemByAgent':{
        //         objParams_Cus:{
        //             tblsReturn: '[0][1][2]'
        //         }, OnSuccess: function(data){ 

        //             Arr_PayableBookingItem = JSON.parse(data)[0]
        //             Arr_PaymentBookingPeriod = JSON.parse(data)[1]
        //             Arr_AgentHostBooking = JSON.parse(data)[2]
        //         }
        //     }
        // }
        , objListComboValue_RtnVal: {
            'Arr_PaymentMethod': {
                objParams_Cus: {},
                OnSuccess: function (data) {
                    Arr_PaymentMethod = data   // Dữ liệu trả về từ dropdownlist trên
                }
            }
        }
        , OnSuccessList: function (data) {
            GetPopUp()

        }
    })


    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: 'List Payable'
            , intTypeSize: 2//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
                options.OnSuccess.call()
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class="panel-itl"'
                , childTags: [{ div: 'class="row"' }]
                , pnForm: { tag: 'div', attr: 'class="col-md-12 pn-margin-b-30"' }
                , pnContent: { tag: 'div', attr: 'class="col-md-12"' }
                //--------------END - GETLIST
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnForm = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            pngPn.getForm({
                action: 1,
                objInput: {
                    strGroupName: {
                        title: 'Group Name', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , intGroupSize: {
                        title: '<span langkey="pg_Dft_TC_LtBk_GroupSize"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    // ,strCompanyName:{title:'<span langkey="pg_Dft_TC_LtBk_CompanyName"></span>',attr:"class='col-md-3'"
                    //     ,input:{IsNoInput:true,IsViewDtl:true}
                    // }
                    , dtmDateFromTo: {
                        title: '<span langkey="pg_Dft_TC_LtBk_DateFrom-DateTo"></span>', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , ________________0: { title: '', attr: "class='col-md-12' style='margin:0'", input: { IsNoInput: true, IsViewDtl: true } }
                    , strOrderStatusName: {
                        title: 'Booking Status', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceTotalView: {
                        title: 'Total Price', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPricePaidView: {
                        title: 'Paid', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                    , dblPriceBalanceView: {
                        title: 'Balance', attr: "class='col-md-3'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    }
                },
                idOrClass: IdOrClass_Pn,
                objDetail: Obj_BookingDetail,
                OnChkSuccess: function () { }
            })


        }

        objEvtPanel.pnContent = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            png.postListApiGetValue({
                objList_Api: ObjList_Api
                , objListApi_RtnVal: {
                    'GetListPayableBookingItemByAgent': {
                        objParams_Cus: {
                            tblsReturn: '[0][1][2]'
                        }, OnSuccess: function (data) {

                            Arr_PayableBookingItem = JSON.parse(data)[0]
                            Arr_PaymentBookingPeriod = JSON.parse(data)[1]
                            Arr_AgentHostBooking = JSON.parse(data)[2]
                        }
                    }
                }
                , OnSuccessList: function (data) {

                    GetMain()

                }
            })

            function GetMain() {
                var strHtml = ''
                strHtml += '<div class="row pn-padding-t-15" style="background:#EBEDEE">'
                strHtml += '<div class="col-md-12">'
                strHtml += '<div id="pnTabList"></div>'
                strHtml += '</div>'
                strHtml += '</div>'
                strHtml += '<div id="pnTabCnt" class="pn-margin-t-b-15"></div>'
                $(IdOrClass_Pn).html(strHtml)

                var ObjListTab = {}


                ObjListTab['BankChecking'] = {
                    name: 'Bank Checking(' + Arr_PaymentBookingPeriod.length + ')', isDefault: true,
                    OnClick: function () {

                        pnContent_TabBankChecking({
                            idOrClass: IdOrClass_Pn + ' #pnTabCnt'
                            , OnSuccess: function () {
                                Obj_FN_Main.pnMain('pnContent')
                                Obj_FN_Main.OnClosePp(true)
                            }
                        })
                    }
                }

                ObjListTab['Payable'] = {
                    name: 'Payable(' + Arr_PayableBookingItem.length + ')', isDefault: false,
                    OnClick: function () {

                        // if(Arr_PayableBookingItem.length!=0)
                        pnContent_TabPayable({
                            idOrClass: IdOrClass_Pn + ' #pnTabCnt'
                            , OnSuccess: function () {
                                Obj_FN_Main.pnMain('pnContent')
                                Obj_FN_Main.OnClosePp(true)
                            }
                        })
                        // else
                        //     $(IdOrClass_Pn+' #pnTabCnt').html('')

                    }
                }

                pngElm.getTabs({
                    idOrClassPnTab: IdOrClass_Pn + ' #pnTabList'
                    , arrTab: ObjListTab
                    // ,IsPushUrl: true//-------Cho hiện Query String trên URL
                    // ,strQueryName:'tab'//--------Trên Query String của Tab(mặc định 'Tab')
                })

            }

        }

        function pnContent_TabBankChecking(_Opt) {

            var Dft = {
                idOrClass: ''
                , OnSuccess: function () { }
            }
            _Opt = $.extend(Dft, _Opt);

            var IdOrClass_Pn = _Opt.idOrClass

            var strHtml = ''
            strHtml += '<div class="pnBtn pn-padding-t-b-15"></div>'
            strHtml += '<div class="pnTblList"></div>'
            strHtml += '<div class="pnTblList_Print" style="display:none"></div>'
            $(IdOrClass_Pn).html(strHtml)


            pngPn.getTable2({
                objApi: null
                , objParams_Cus: null
                , objCols: {
                    'No': { name: '<span langkey="sys_Txt_No"></span>' }
                    , strCompanyName: { name: 'Company Name' }
                    , dblPayableAmount_View: { name: 'Payable' }
                    , dblPayablePaid_View: { name: 'Payable Paid' }
                    , dblPayableBalance_View: { name: 'Payable Balance' }
                    , dtmDateDeadline_View: { name: 'Deadline' }
                    , strHtmlBankInfo: { name: 'Bank Info' }
                    , dtmCreatedDate_View: { name: 'Create Date' }
                    , strHtmlAction: {
                        name: 'Action',
                        // input:{
                        //     title:'',attr:"class='col-md-12' style='margin:0'",isRequire:false,IsRtn:true
                        //     ,input:{type:'select',classEx:'form-control',attr:' style="width: 100px;" '}
                        //     ,dropDown:{arrList:[{1:'Not Paid'},{2:'Paid'}]}
                        // }
                    }
                }
                , editRltArr: function (arr) {
                    return Arr_PaymentBookingPeriod
                }
                , editRlt: function (value, key) {

                    value['No'] = (key + 1)

                    var strHtml = ''
                    strHtml += '<b>Account Name:</b> ' + value.strCompanyBankAccountName
                    strHtml += '<br><b>Account Code:</b> ' + value.strCompanyBankAccountCode
                    strHtml += '<br><b>Bank Name:</b> ' + value.strCompanyBankAccountInfo
                    strHtml += '<br><b>Bank Add:</b> ' + value.strBankAddress
                    strHtml += '<br><b>SwiftCode:</b> ' + value.strSwiftCode
                    value['strHtmlBankInfo'] = strHtml

                    value['dblPayableAmount_View'] = $.pngFormatPrice(value['dblPayableAmount'])
                    value['dblPayablePaid_View'] = $.pngFormatPrice(value['dblPayablePaid'])
                    value['dblPayableBalance_View'] = $.pngFormatPrice(value['dblPayableBalance'])
                    value['dtmDateDeadline_View'] = $.pngFormatDateTime(value['dtmDateDeadline'])
                    value['dtmCreatedDate_View'] = $.pngFormatDateTime(value['dtmCreatedDate'])
                    // value['strHtmlIsPaid'] = (value['IsPaid']? 1:0)

                    value.strHtmlAction = ''
                    if (value.intPayableStatusID == 1) {
                        value.strHtmlAction += 'Chưa chuyển khoản'
                        value.strHtmlAction += '<button class="btn bg-primary" action="Payment">Đã chuyển khoản</button>'
                    }
                    else
                        value.strHtmlAction += 'Đang chờ xác nhận chuyển khoản'
                }
                , customEvent: function (_idOrClassPn) {


                    $('button', _idOrClassPn).click(function (e) {
                        var action = $(this).attr('action')

                        if (action == 'Payment') {
                            var data = $(this).parents('tr').attr('row')

                            // var valOld = JSON.parse(JSON.stringify(Arr_PaymentBookingPeriod))[data].intPayableStatusID
                            // console.log(valOld)
                            pnContent_TabBankChecking_PopUpCheckPaid({
                                objDetail: $.pngExtendObj(Arr_PaymentBookingPeriod[data], {
                                    intPayableStatusID: 2
                                })
                                , OnSuccess: function () {
                                    _Opt.OnSuccess.call()
                                }
                            })
                        }
                    })
                    $('.intPayableStatusID', _idOrClassPn).change(function (e) {

                        if (typeof e.originalEvent != 'undefined') {
                            var data = $(this).parents('tr').attr('row')

                            var valOld = JSON.parse(JSON.stringify(Arr_PaymentBookingPeriod))[data].intPayableStatusID
                            console.log(valOld)
                            pnContent_TabBankChecking_PopUpCheckPaid({
                                objDetail: Arr_PaymentBookingPeriod[data]
                                , OnSuccess: function () {
                                    _Opt.OnSuccess.call()
                                }
                                , OnNoSave: function () {
                                    console.log(valOld)
                                    $('[row=' + data + '] .intPayableStatusID', _idOrClassPn).val(valOld).change()
                                }
                            })
                        }

                    })

                }
                , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                    // if (_IsChecked)
                    //     $(IdOrClass_Pn + ' tr[row=' + _intRowID + '] td').css('background', '#c4c400')
                    // else
                    //     $(IdOrClass_Pn + ' tr[row=' + _intRowID + '] td').removeAttr('style')


                    // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text('')
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit").hide()
                    // }else{
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ' item(s))')
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit").show()
                    // }

                    // Arr_ListTbl = _arrList
                }
                , IsViewCheckBoxMain: false
                , idOrClass: IdOrClass_Pn + ' .pnTblList'
            })

            if (Arr_PaymentBookingPeriod.length) {

                $(IdOrClass_Pn + ' .pnTblList_Print').html($(IdOrClass_Pn + ' .pnTblList').html())
                $(IdOrClass_Pn + ' .pnTblList_Print').find('tr th:last-child,tr td:last-child').remove()
                $(IdOrClass_Pn + ' .pnTblList_Print').find('table').attr('border', '1').attr('cellspacing', '0').attr('cellpadding', '5')


                strHtml = ''
                strHtml += '<button class="btn btn-default btn-texticon bg-white btnPrint"><i class="fa fa-print"></i><span>Print</span></button>'
                $(IdOrClass_Pn + ' .pnBtn').html(strHtml)

                $(IdOrClass_Pn + ' .btnPrint').click(function () {
                    pngPn.getPopUpPrint({
                        idOrClass: IdOrClass_Pn + ' .pnTblList_Print'
                    })
                })
            }

        }

        function pnContent_TabBankChecking_PopUpCheckPaid(_Opt) {
            var Dft = {
                objDetail: {}
                , OnSuccess: function () { }
                , OnNoSave: function () { }
            }
            _Opt = $.extend(Dft, _Opt);

            var IdOrClass_Pn = ''
            var ObjDetail = _Opt.objDetail
            var IsNoSave = true

            Obj_FN_Main.ppCheckPaid = {}

            GetPopUp()
            function GetPopUp() {
                pngPn.getPopUp({
                    strTitle: 'Check Paid'
                    , intTypeSize: 2//------------1 small ---2 medium ---3 large
                    , OnPanel: GetMainPanel
                    , OnClosePopUp: function () {
                        if (IsNoSave) {
                            _Opt.OnNoSave.call()
                        }
                        //------Chọn sự kiện khi Đóng PopUP
                    }
                })
            }

            function GetMainPanel(_IdOrClassPp, _OnClosePp) {

                IdOrClass_Pn = _IdOrClassPp
                Obj_FN_Main.ppCheckPaid.OnClosePp = _OnClosePp

                Obj_FN_Main.ppCheckPaid.OnClosePp(true)//----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
                // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}


                var objPanel = {                 // Khai báo các thành phần của panel
                    pnMain: {
                        tag: 'div', attr: 'class="panel-itl"'
                        , childTags: [{ div: 'class="row"' }]
                        , pnContent: { tag: 'div', attr: 'class="col-md-12"' }
                        , pnBtn: { tag: 'div', attr: 'class="col-md-12"' }
                        //--------------END - GETLIST
                    }
                }


                var objEvtPanel = {}
                objEvtPanel.pnContent = function (_idOrClassPn) {
                    var IdOrClass_Pn = _idOrClassPn


                    pngPn.getForm({
                        action: 1,
                        objInput: {
                            strCompanyName: {
                                title: 'Company Name', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , ________________0: { title: '', attr: "class='col-md-12' style='margin:0'", input: { IsNoInput: true, IsViewDtl: true } }
                            , dblPayableAmount_View: {
                                title: 'Payable', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , dblPayablePaid_View: {
                                title: 'Payable Paid', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , dblPayableBalance_View: {
                                title: 'Payable Balance', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , dtmDateDeadline_View: {
                                title: 'Deadline', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , ________________1: { title: '', attr: "class='col-md-12' style='margin:0'", input: { IsNoInput: true, IsViewDtl: true } }

                            , strCompanyBankAccountName: {
                                title: 'Account Name', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , strCompanyBankAccountCode: {
                                title: 'Bank Account Code', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , strCompanyBankAccountInfo: {
                                title: 'Bank Account Info', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , strBankAddress: {
                                title: 'strBankAddress', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                            , ________________2: { title: '', attr: "class='col-md-12' style='margin:0'", input: { IsNoInput: true, IsViewDtl: true } }
                            , strSwiftCode: {
                                title: 'strSwiftCode', attr: "class='col-md-3'"
                                , input: { IsNoInput: true, IsViewDtl: true }
                            }
                        },
                        idOrClass: IdOrClass_Pn,
                        objDetail: ObjDetail,
                        OnChkSuccess: function () { }
                    })


                }

                objEvtPanel.pnBtn = function (_idOrClassPn) {
                    var IdOrClass_Pn = _idOrClassPn

                    var strHtml = ''

                    strHtml += '<button class="btn btn-texticon bg-primary"  id="btnCheckPaid"><span>Payment Confirm</span></button> '
                    $(IdOrClass_Pn).html(strHtml)

                    $('#btnCheckPaid', IdOrClass_Pn).click(function () {
                        $.Confirm({
                            strContent: '<span langkey="sys_Cfm_AYS"></span>'
                            , OnSuccess: function () {
                                IsNoSave = false
                                png.postListApiGetValue({
                                    objList_Api: ObjList_Api
                                    , objListApi_RtnVal: {
                                        'UpdPaymentBookingPeriodForBankCheckingIsPaidByAgent': {
                                            objParams_Cus: {
                                                strPaymentBookingPeriodGUID: ObjDetail.strPaymentBookingPeriodGUID
                                                , intPayableStatusID: ObjDetail.intPayableStatusID
                                            }
                                            , OnSuccess: function (data) {
                                                _Opt.OnSuccess.call()
                                                Obj_FN_Main.ppCheckPaid.OnClosePp(true, true)
                                                $.Confirm({ strContent: 'Check Paid Successfully!' })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    })
                }

                // ===================================

                pngPn.getPanelHtml({            // Get ra panel dạng html
                    objPanel: objPanel
                    , objEvtPanel: objEvtPanel
                    , idOrClass: IdOrClass_Pn  // Id or class chính
                    , OnChangeIdPn: function (_Fn) {
                        Obj_FN_Main.ppCheckPaid.pnMain = _Fn    // Hàm đổi trang
                    }
                })


            }

        }


        function pnContent_TabPayable(_Opt) {
            var Dft = {
                idOrClass: ''
                , OnSuccess: function () { }
            }
            _Opt = $.extend(Dft, _Opt);

            var IdOrClass_Pn = _Opt.idOrClass

            var IsViewPayment = false

            var strHtml = ''
            // if(Obj_BookingDetail.intOrderStatusID != 3){
            //     strHtml+= '<div class="pn-margin-t-b-30">'
            //         strHtml += '<button class="btn btn-texticon bg-success txt-white" id="btnAddNextPay"><i class="fa fa-plus"></i><span>Add Next Payment Term</span></button> '
            //     strHtml+= '</div>'
            // }
            strHtml += '<div class="pnTable"></div>'
            strHtml += '<div class="pnForm"></div>'

            $(IdOrClass_Pn).html(strHtml)


            if (Arr_PayableBookingItem.length != 0) {
                Arr_AgentHostBooking.forEach(function (value, key) {
                    strHtml = ''
                    strHtml += '<div class="pn-margin-t-b-15"><b>' + (key + 1) + '. </b>' + value.strCompanyName + (value.strCompanyPhone ? ' - <b>Phone:</b> ' + value.strCompanyPhone : '') + (value.strCompanyEmail ? ' - <b>Email:</b> ' + value.strCompanyEmail : '') + '</div>'
                    strHtml += '<div class="' + value.strAgentHostBookingGUID + '"></div>'
                    $(IdOrClass_Pn + ' .pnTable').append(strHtml)

                    var arr = Arr_PayableBookingItem.filter(function (item) { return item.strAgentHostBookingGUID == value.strAgentHostBookingGUID })

                    GetListPriceForCompany(arr, IdOrClass_Pn + ' .' + value.strAgentHostBookingGUID)
                })

                if (Obj_BookingDetail.intOrderStatusID != 3) {
                    $(IdOrClass_Pn + ' .pnForm').html('<button class="btn btn-default txt-primary" id="btnPayment">View Payment</button> ')
                }
            }


            $('#btnPayment').click(function () {
                GetForm(IdOrClass_Pn + ' .pnForm')
            })


            function GetListPriceForCompany(_arrPriceTable, _idOrClass) {

                var IdOrClass_Pn_Item = _idOrClass
                var ArrPriceTableItem = _arrPriceTable


                pngPn.getTable2({
                    objApi: null
                    , objParams_Cus: null
                    , editRltArr: function (arr) {
                        return ArrPriceTableItem
                    }
                    , editRlt: function (value, key) {
                        value['No'] = (key + 1)

                        value['IsEnableInput'] = 1

                        value['dtmDateFrom_View'] = $.pngFormatDateTime(value['dtmDateFrom'])
                        value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])
                        value['dblPayableAmount_View'] = $.pngFormatPrice(value['dblPayableAmount'])


                    }
                    , objCols: {
                        'No': { name: 'No' }
                        , strServiceName: { name: 'Service Name' }
                        , strPayableTypeName: { name: 'Payable Type' }
                        , dtmDateFrom_View: { name: 'Date From' }
                        , dtmDateTo_View: { name: 'Date To' }
                        , dblPayableAmount_View: { name: 'Price Payable' }
                    }
                    // ,editTableInput:function(){}
                    , changeCkbMaster: function (IsChecked, intRowID, arrList) {

                        ArrPriceTableItem = arrList

                        // if(IsViewPayment){
                        //     GetForm(IdOrClass_Pn+' .pnForm')
                        // }
                    }
                    , customEvent: function (_idOrClassPn) {



                    }
                    // ,changeInput:function(){}
                    , IsViewCheckBoxMain: false
                    , idOrClass: IdOrClass_Pn_Item
                })


            }

            function GetForm(_idOrClass) {
                var IdOrClass_Pn_Item = _idOrClass

                IsViewPayment = true

                var DblCreditRemain = 0

                var Obj_ListArrListAcount = {}

                coreLoadPage.getCredit({
                    OnSuccess: function (obj) {
                        DblCreditRemain = obj.dblCreditRemain
                    }
                })

                Obj_FormBooking.dblPriceCharge = 0
                Arr_PayableBookingItem.forEach(function (value) {
                    Obj_FormBooking.dblPriceCharge += value.dblPayableAmount
                })

                var strHtml = ''
                strHtml += '<hr class="pn-margiin-t-b-15">'
                strHtml += '<div class="form"></div>'
                strHtml += '<button class="btn btn-texticon bg-primary" id="btnPayment2"><i class="fa fa-usd"></i><span>Payment</span></button> '

                $(IdOrClass_Pn_Item).html(strHtml)

                var Obj_FormInput = {
                    intPaymentMethodID: {
                        title: 'Phương thức thanh toán', attr: "class='col-md-4'", isRequire: false, IsRtn: true
                        , input: { type: 'select', classEx: 'form-control', attr: '' }
                        , dropDown: { arrList: $.pngGetArrComboValue(Arr_PaymentMethod, 'intID', 'strName') }
                    },
                    dblPriceTotal_View: {
                        title: 'Total Payable', attr: "class='col-md-4'"
                        , input: { IsNoInput: true, IsViewDtl: true }
                    },
                    pnPayEx: {
                        title: '', attr: "class='col-md-12'"
                        , input: { IsNoInput: true }
                    },
                    strPaidRemark: {
                        title: 'Remark', isRequire: false, attr: "class='col-md-12'", IsRtn: true
                        , input: { type: 'textarea', classEx: 'form-control', attr: 'rows="5" ' }//====> Có Attr ckeditor sẽ hiển thị CK Editor
                    }
                }

                pngPn.getForm({
                    action: 1,
                    objInput: Obj_FormInput,
                    idOrClass: IdOrClass_Pn_Item + ' .form',
                    objDetail: {
                        dblPriceTotal_View: $.pngFormatPrice(Obj_FormBooking.dblPriceCharge)
                    },
                })



                $(".intPaymentMethodID", IdOrClass_Pn_Item).change(function () {
                    $('#btnPayment2', IdOrClass_Pn_Item).attr('disabled', false)
                    // Obj_Payment['strCompanyBankAccountGUID'] = null
                    var strHtml = ''

                    if (this.value == 11) {
                        strHtml += pngElm.getLangKey({ langkey: 'sys_Txt_Creditbalance' }) + ': <b>' + $.pngFormatPrice(DblCreditRemain) + '</b>'
                        $('.pnElm-pnPayEx').html(strHtml)

                        if (Obj_FormBooking.dblPriceCharge > DblCreditRemain) {
                            $('#btnPayment2', IdOrClass_Pn).attr('disabled', true)
                        }
                    }

                    if (this.value == 1) {


                        if (Object.keys(Obj_ListArrListAcount).length == 0) {
                            png.postList({
                                objApi: ObjList_Api['GetFilterCompanyBankAccount'],
                                arrInput: Arr_AgentHostBooking,
                                intCallApiPerTime: 1,
                                OnSuccessItem: function (objParam, data) {
                                    Obj_ListArrListAcount[objParam.strCompanyGUID] = JSON.parse(data)[0]
                                },
                                //GEN
                                OnSuccess: function (data) {
                                    GetPanelAccount()
                                }
                            })
                        } else {
                            GetPanelAccount()
                        }


                        function GetPanelAccount() {


                            pngPn.getTable2({
                                objApi: null
                                , objParams_Cus: null
                                , editRltArr: function (arr) {
                                    return Arr_AgentHostBooking
                                }
                                , editRlt: function (value, key) {
                                    value['No'] = (key + 1)

                                }
                                , objCols: {
                                    'No': { name: '<span langkey="sys_Txt_Tbl-No"></span>' }
                                    , strCompanyName: { name: 'Company Name' }
                                    , pnAccount: { name: 'Account' }
                                    , strDescription: { name: 'Description' }
                                }
                                // ,editTableInput:function(){}
                                , changeCkbMaster: function (IsChecked, intRowID, arrList) {


                                    // ArrPriceTableItem = arrList
                                }
                                , customEvent: function (_idOrClassPn) {
                                    Arr_AgentHostBooking.forEach(function (value, key) {
                                        pngPn.getForm({
                                            action: 1,
                                            objInput: {
                                                strListCompanyBankAccountGUID: {
                                                    title: '', attr: "class='col-md-12' style='margin:0'", isRequire: false, IsRtn: true
                                                    , input: { type: 'select', classEx: 'form-control', attr: ' guid="' + value.strCompanyGUID + '" ' }

                                                    , dropDown: { arrList: $.pngGetArrComboValue(Obj_ListArrListAcount[value.strCompanyGUID.toLowerCase()], 'strCompanyBankAccountGUID', 'strNameDisplay') }
                                                }
                                            },
                                            idOrClass: 'tr[row=' + key + '] .pn-pnAccount', _idOrClassPn,
                                            objDetail: {}
                                        })
                                    })

                                    $(_idOrClassPn).find('select').change(function () {
                                        var data = $(this).parents('tr').attr('row')
                                        var strCompanyGUID = $(this).attr('guid')
                                        var Arr = Obj_ListArrListAcount[strCompanyGUID]
                                        var self = this
                                        // Obj_Payment['strCompanyBankAccountGUID'] = this.value
                                        var obj = Arr.filter(function (item) { return item.strCompanyBankAccountGUID == self.value })[0]

                                        strHtml = ''
                                        strHtml += '<b>Account Name:</b> ' + obj.strCompanyBankAccountName
                                        strHtml += '<br><b>Account Code:</b> ' + obj.strCompanyBankAccountCode
                                        strHtml += '<br><b>Bank Name:</b> ' + obj.strCompanyBankAccountInfo
                                        strHtml += '<br><b>Bank Add:</b> ' + obj.strBankAddress
                                        strHtml += '<br><b>SwiftCode:</b> ' + obj.strSwiftCode
                                        $(_idOrClassPn + ' tr[row=' + data + '] .pn-strDescription').html(strHtml)

                                    })



                                }
                                // ,changeInput:function(){}
                                , IsViewCheckBoxMain: false
                                , idOrClass: '.pnElm-pnPayEx'
                            })


                        }




                    }

                    if (this.value == 3) {
                        // strHtml+= '<img src="https://logos-world.net/wp-content/uploads/2020/04/PayPal-Logo.png" style="height: 35px;">'
                        // strHtml+= '<img src="https://thietkelogo.com/wp-content/uploads/2017/10/logo-mastercard.jpg" style="height: 35px;">'
                        strHtml += 'Thanh toán qua <b>VN Pay</b>'
                        $('.pnElm-pnPayEx').html(strHtml)

                    }
                }).change()



                var ObjPayment = {}

                $('#btnPayment2').click(function () {

                    $.Confirm({
                        strContent: '<span langkey="sys_Cfm_AYS"></span>'
                        , OnSuccess: function () {
                            var strListCompanyBankAccountGUID = ''

                            ObjPayment = pngPn.getForm({
                                action: 2,
                                objInput: Obj_FormInput,
                                idOrClass: IdOrClass_Pn_Item + ' .form'
                            })

                            if (ObjPayment.intPaymentMethodID == 11) {
                                ObjPayment.strListCompanyBankAccountGUID = null
                                png.postListApiGetValue({
                                    objList_Api: ObjList_Api
                                    , objListApi_RtnVal: {
                                        'GetCheckRemainCreditForPaymentBookingByAgent': {
                                            objParams_Cus: {}
                                            , OnSuccess: function (data) {
                                                var obj = JSON.parse(data)[0][0]
                                                if (obj.IsCheckCredit) {

                                                    coreLoadPage.getCredit({
                                                        OnSuccess: function (obj) {
                                                        }
                                                    })
                                                    GetPayment()
                                                } else {
                                                    $.Confirm({ strContent: 'You do not have enough Credit Limit. Your current credit amount is ' + $.pngFormatPrice(obj.dblCreditRemain) });
                                                }
                                            }
                                        }
                                    }
                                })
                            }

                            if (ObjPayment.intPaymentMethodID == 1) {
                                Arr_AgentHostBooking.forEach(function (value) {
                                    strListCompanyBankAccountGUID += value.strAgentHostBookingCode + '!' + value.strListCompanyBankAccountGUID + '#'
                                })

                                ObjPayment.strListCompanyBankAccountGUID = strListCompanyBankAccountGUID

                                GetPayment()
                            }


                            if (ObjPayment.intPaymentMethodID == 3) {
                                GetPayOnline()
                            }


                        }
                    })

                })


                function GetPayment() {
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        , objListApi_RtnVal: {
                            'AddOrUpdBookingToPayable': {
                                objParams_Cus: ObjPayment
                                , OnSuccess: function (data) {
                                    _Opt.OnSuccess.call()
                                    $.Confirm({ strContent: 'Payment Successfully!' })
                                }
                            }
                        }
                    })
                }

                function GetPayOnline() {

                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        , objListApi_RtnVal: {
                            'AddPaymentTransactionByAgent': {
                                objParams_Cus: {
                                    dblPaymentTransactionAmount: Obj_FormBooking.dblPriceCharge
                                    , strRemark: (ObjPayment.strPaidRemark || "payment online")
                                }
                                , OnSuccess: function (data) {
                                    var obj = JSON.parse(data)[0][0]
                                    png.postListApiGetValue({
                                        objList_Api: ObjList_Api
                                        , objListApi_RtnVal: {
                                            'GetUrlPayOnline': {
                                                objParams_Cus: {
                                                    strOrderBeforePaymentCode: obj['strPaymentTransactionCode']
                                                    , dblAmount: Obj_FormBooking.dblPriceCharge
                                                    , strDescription: (ObjPayment.strPaidRemark || "payment online")
                                                }
                                                , OnSuccess: function (data) {
                                                    window.location.href = JSON.parse(data).strPaymentUrl
                                                }
                                            },
                                        }
                                    })
                                }
                            },
                        }
                    })
                }


            }




        }

        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })

    }

}


$.ModulePage_BookingDetailMain_PopUpVoucherForTour = function (options) {
    var defaults = {
        strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID,
        objBookingServiceDetail: {},
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var Obj_Detail = options.objBookingServiceDetail

    var ObjList_Api = {
        GetListTourDetailByPtn: {
            strApiLink: 'api/tour/GetListTourDetailByPtn'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourGUID: null

                , intCurPage: 1
                , intPageSize: 1
                , strOrder: null
                , tblsReturn: '[0]'
            }
        },
        GetListBookingServiceForTour: {
            strApiLink: 'api/booking/GetListBookingServiceForTour'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strBookingServiceGUID: null
                , strBookingItemGUID: null
                , intBookingStatusID: 4
                , intDayOrder: null
                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        },
        GetListTourDayByPtn: {
            strApiLink: 'api/tour/GetListTourDayByPtn'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strTourDayGUID: null
                , strTourGUID: null
                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: null
                , tblsReturn: '[0]'
            }
        },
        GetBookingItemForConfirmedCode: {
            strApiLink: 'api/booking/GetBookingItemForConfirmedCode'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strConfirmedCode: Obj_Detail.strConfirmedCode,
            }
        },
    }

    var ObjList_ComboValue = {
        ArrCountry: {
            getValCode: { strCombocode: "185" }
            , OnSuccessItem: function (data) {
                // data.unshift({'':'Select...'})
                return data
            }
        },
        Arr_CateID_Ddl: {
            strTableName: 'SP02'             // Bảng sử dụng để get dữ liệu
            , strFeildSelect: 'SP02_CateID AS intID,SP02_LangCode AS strName' // Trường cần lựa chọn
            , strWhere: 'WHERE IsActive = 1'      // Điều kiện
        },
    }


    // $(idOrClass).html(strHtmlMain)

    // pngPn.getListArrOrObjValue({
    //     setListValue: ObjList_ComboValue,
    //     OnSuccessList:function(ObjListCombo){
    // GetMain()
    //     }
    // })


    var Arr_CateID_Ddl = []

    var Obj_BookingDetail = {}
    var Obj_DetailLeader = {}


    //---------
    var Arr_ListTbl = []
    var Arr_ListTbl_BookingService = []
    var Obj_FormInput = {}
    var Obj_FN_Main = {}
    //---------

    png.postListApiGetValue({
        objList_Api: ObjList_Api
        // ,objList_ComboValue: ObjList_ComboValue
        , objListApi_RtnVal: {
            'GetBookingItemForConfirmedCode': {
                objParams_Cus: {},
                OnSuccess: function (data) {
                    Obj_BookingDetail = JSON.parse(data)[0][0]   // Dữ liệu trả về từ dropdownlist trên
                }
            },
        }
        , OnSuccessList: function (data) {

            png.postListApiGetValue({
                objList_Api: ObjList_Api
                , objList_ComboValue: ObjList_ComboValue
                , objListApi_RtnVal: {
                    'GetListTourDetailByPtn': {
                        objParams_Cus: {
                            strTourGUID: Obj_BookingDetail["strTourGUID"]
                        },
                        OnSuccess: function (data) {
                            Obj_Detail = JSON.parse(data)[0][0]   // Dữ liệu trả về từ dropdownlist trên
                            Obj_DetailLeader = Obj_BookingDetail   // Dữ liệu trả về từ dropdownlist trên
                        }
                    },
                    'GetListTourDayByPtn': {
                        objParams_Cus: {
                            strTourGUID: Obj_BookingDetail["strTourGUID"]
                        },
                        OnSuccess: function (data) {
                            Arr_ListTbl = JSON.parse(data)[0]
                        }
                    },
                    'GetListBookingServiceForTour': {
                        objParams_Cus: {
                            strBookingItemGUID: Obj_BookingDetail["strBookingItemGUID"]
                        },
                        OnSuccess: function (data) {
                            Arr_ListTbl_BookingService = JSON.parse(data)[0]
                        }
                    },
                }
                , objListComboValue_RtnVal: {    // Giá trị nhận về từ dropdownlist
                    'Arr_CateID_Ddl': {
                        objParams_Cus: {},
                        OnSuccess: function (data) {
                            Arr_CateID_Ddl = data   // Dữ liệu trả về từ dropdownlist trên

                            Arr_CateID_Ddl.forEach(function (value) {
                                value['strName'] = pngElm.getLangKeyDB({ langkey: value['strName'] })
                            })
                        }
                    },
                }
                , OnSuccessList: function (data) {
                    GetPopUp()
                }
            })


        }
    })



    // GetPopUp()
    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: 'Voucher Tour'
            , intTypeSize: 3//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: ''
                , childTags: [{ div: 'class="row"' }]
                , pnListBtn: { tag: 'div', attr: 'class="col-md-12 pn-margin-b-15"' }
                , pnCnt: {
                    tag: 'div', attr: 'class="col-md-12"'
                    , childTags: [{ div: 'class="row" style="overflow:auto;max-height:80vh"' }, { div: 'class="pnContent"' }]
                    , pnInfo: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnDes: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnItinerary: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnIn_ExClude: { tag: 'div', attr: 'class="col-md-12"' }
                    , pnTerms_Conditions: { tag: 'div', attr: 'class="col-md-12"' }
                }


            }
        }


        var objEvtPanel = {}


        objEvtPanel.pnListBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''

            strHtml += '<div>'
            // strHtml+= '<button id="btnExportToWord" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-file-word-o"></i><span>Export to Word</span></button>'

            strHtml += '<button class="btn btn-texticon btn-default" id="btnPrint" style=""><i class="fa fa-print"></i><span>Print</span></button>'
            if (Obj_DetailLeader.strPassengerEmail)
                strHtml += '<button class="btn btn-texticon bg-primary" id="btnSendEmailToLeader" style=""><i class="fa fa-envelope"></i><span>Send To <b>' + Obj_DetailLeader.strPassengerEmail + '</b></span></button>'
            strHtml += '</div>'
            strHtml += '<div class="pnContent_Print" style="display:none"></div>'

            $(IdOrClass_Pn).html(strHtml)


            $('#btnExportToWord', IdOrClass_Pn).click(function () {
                window.open(png.getServerURL('Page/Export.aspx?type=GetExportTourDetail&strUserGUID=' + options.strUserGUID + '&strTourGUID=' + options.strTourGUID + ''))
            })

            var strHtnl_Pr

            $(IdOrClass_Pn + ' #btnSendEmailToLeader').click(function () {
                $.Confirm({
                    strContent: '<span langkey="sys_Cfm_AYS"> </span>'
                    , OnSuccess: function () {

                        png.postSendEmail({
                            strUserGUID: null
                            , strEmailsSendTo: ""
                            , strEmailsCC: ""
                            , strEmailsBCC: ""
                            , strEmailTemplateSubject: ""
                            , IsBodyHtml: 1
                            , strEmailTemplateContent: ""
                            , strTempApiUrl: 'api/public/GetEmailSendConfirmToPax'
                            , objTempPar: {
                                strUserGUID: options.strUserGUID
                                , intLangID: $.pngGetLangID()
                                , strConfirmedCode: Obj_BookingDetail.strConfirmedCode
                            }
                            , OnSuccess: function (data) {
                                if (data == "1") {
                                    $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailSuccess"></span>' })
                                } else {
                                    $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailFail"></span>' })
                                }

                            }
                        })

                    }
                })



            })


            setTimeout(function () {
                var strHtml = $(IdOrClass_Main + ' .pnContent').html()
                $(IdOrClass_Pn + ' .pnContent_Print').html(strHtml)

                $(IdOrClass_Pn + ' .pnContent_Print').find('table').attr('border', '1').attr('cellspacing', '0').attr('cellpadding', '5').css('width', '100%')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.row').css('margin-left', '-5px').css('margin-right', '-5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-6').css('width', '48%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-8').css('width', '65%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-4').css('width', '32%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pn-margin-b-15').css('margin-bottom', '15px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pn-margin-t-b-15').css('margin-top', '15px').css('margin-bottom', '15px')

                $(IdOrClass_Pn + ' .pnContent_Print').find('.pnImg').attr('style', '')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pnImg').html('<img src="' + (Obj_Detail.strTourImageUrl ? png.getServerImgURL(Obj_Detail.strTourImageUrl) : 'assets/images/img-noimage.png') + '" style="width:100%">')
                // $(IdOrClass_Pn+' .pnContent_Print').find('#pnQrCode').attr('id','pnQrCode2')

                strHtnl_Pr = $(IdOrClass_Main + ' .pnContent_Print').html()
                $(IdOrClass_Pn + ' #btnPrint').click(function () {
                    pngPn.getPopUpPrint({
                        idOrClass: null
                        , strHtml: strHtnl_Pr
                    })
                })
            }, 100)





        }


        objEvtPanel.pnInfo = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += `
            `
            strHtml += '<div class="row">'
            strHtml += '<div class="col-md-8">'
            strHtml += '        <div class="pn-margin-b-15"><b>Group Name: </b>' + (Obj_BookingDetail.strGroupName || '') + '</div>'
            strHtml += '        <h1 class="pn-margin-t-b-15" style="line-height: 35px;font-size: 25px;"><b>' + Obj_Detail.strServiceName + '</b></h1>'
            strHtml += '        <div class="pn-margin-b-15"><b>' + pngElm.getLangKey({ langkey: 'sys_Txt_CompanyName' }) + ': </b>' + Obj_Detail.strCompanyName + (Obj_Detail.strCompanyEmail ? ' - ' + Obj_Detail.strCompanyEmail : '') + (Obj_Detail.strCompanyPhone ? ' - ' + Obj_Detail.strCompanyPhone : '') + '</div>'
            strHtml += '        <div class="pn-margin-b-15"><b>' + pngElm.getLangKey({ langkey: 'sys_Txt_Addr' }) + ': </b>' + Obj_Detail.strCompanyAddr + '</div>'
            strHtml += '        <div style="color:#257EF8;font-weight:bold;text-transform: uppercase;margin-bottom: 25px;"><span>' + Obj_Detail.intNoOfDay + ' ' + pngElm.getLangKey({ langkey: 'sys_Txt_days' }) + '/' + (Obj_Detail.intNoOfDay - 1) + ' ' + pngElm.getLangKey({ langkey: 'sys_Txt_nights' }) + '</span></div>'
            strHtml += '</div>'

            strHtml += '<div class="col-md-4" style="text-align: right">'
            strHtml += '        <div class="pn-margin-b-15"><b>Confirm Code: </b>' + (Obj_BookingDetail.strConfirmedCode || '') + '</div>'
            strHtml += '        <div class="pn-margin-b-15 pnQrCode" style="width: 130px;height: 130px;display: inline-block;"></div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '<div class="pnImg" style="background:url(\'' + (Obj_Detail.strTourImageUrl ? png.getServerImgURL(Obj_Detail.strTourImageUrl) : 'assets/images/img-noimage.png') + '\') no-repeat center;width: 100%;background-size: cover;height:300px"></div>'

            $(IdOrClass_Pn).html(strHtml)

            if (!$('body #pnQrCode').length)
                $('body').append('<div id="pnQrCode" style="display:none"></div>')

            var qrcode = new QRCode("pnQrCode", {
                width: 130,
                height: 130,
            });
            qrcode.makeCode(png.ObjClnUrl.APPB2B + 'confirmation/' + Obj_BookingDetail.strConfirmedCode);

            setTimeout(function () {

                $(IdOrClass_Pn + ' .pnQrCode').html($('#pnQrCode').html())

                $('body #pnQrCode').remove()
                    , 100
            })
        }

        objEvtPanel.pnDes = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtmlMain = ''

            strHtmlMain += '<div class="row">'
            strHtmlMain += '    <div class="col-md-6">'
            strHtmlMain += '         <h4 class="pn-margin-t-b-15"><b><span langkey="pg_Main_Tour_MdDtl_MainAttractions"></span></b></h4>'
            Obj_Detail.strListTourMainAttractionName.split(',').forEach(function (value) {
                strHtmlMain += '<div><i class="fa fa-check-square" style="color: #257ef8"></i> ' + value + '</div>'
            })
            strHtmlMain += '    </div>'
            strHtmlMain += '    <div class="col-md-6">'
            strHtmlMain += '        <h4 class="pn-margin-t-b-15"><b><span langkey="pg_Main_Tour_MdDtl_Citiescovered"></span></b></h4>'
            Obj_Detail.strListTourDestinationName.split(',').forEach(function (value) {
                strHtmlMain += '<div><i class="fa fa-check-square" style="color: #257ef8"></i> ' + value + '</div>'
            })
            strHtmlMain += '    </div>'
            strHtmlMain += '</div>'
            $(IdOrClass_Pn).html(strHtmlMain)
        }


        objEvtPanel.pnItinerary = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            Arr_ListTbl.forEach(function (value) {
                strHtml += '<div>'
                strHtml += '    <div style="display: flow-root;padding: 20px 0;border-bottom: 1px #bdbdbd solid;">'
                strHtml += '        <div style="float:left;background:#257EF8;color:white;padding: 10px 40px;border-top-right-radius: 10em;border-bottom-right-radius: 10em;margin-right: 20px;">'
                strHtml += '            <strong style="text-transform: uppercase;">' + pngElm.getLangKey({ langkey: 'sys_Txt_Day' }) + ' ' + value.intDayOrder + '</strong>'
                strHtml += '        </div>'
                strHtml += '        <div style="display: flow-root">'
                strHtml += '            <strong style="font-size:18px;line-height: 40px;">'
                strHtml += '                ' + value.strDayTitleAndMeals
                strHtml += '            </strong>'
                strHtml += '        </div>'
                strHtml += '     </div>'
                strHtml += '</div>'
                strHtml += '<div class="pn-margin-t-15 pn-padding-l-r-15">'
                strHtml += '<div >' + value.strDayContent + '</div>'
                strHtml += '<div class="pnTableService_' + value.intDayOrder + '"></div>'
                strHtml += '</div>'

            })
            $(IdOrClass_Pn).html(strHtml)

            Arr_ListTbl.forEach(function (value) {
                var arr = Arr_ListTbl_BookingService.filter(function (item) { return item.intDayOrder == value.intDayOrder })

                if (arr.length) {

                    var strHtml = ''
                    strHtml += `
                        <h3 style="margin-top:15px"><b>Danh sách Dịch vụ</b></h3>
                        <div><div class="pnList pn-margin-t-15"></div></div>
                    `
                    $(IdOrClass_Pn + ' .pnTableService_' + value.intDayOrder).html(strHtml)

                    pngPn.getTable2({
                        objApi: null
                        , objParams_Cus: null
                        , editRltArr: function () {
                            return arr
                        }
                        , editRlt: function (value, key) {
                            value['No'] = (key + 1)
                            value['strSupplierName_View'] = ''
                            value['strSupplierName_View'] += '<div><b>' + value['strSupplierName'] + '</b></div>'
                            if (value['strAddress'])
                                value['strSupplierName_View'] += '<div><b>Address: </b>' + value['strAddress'] + '</div>'
                            value['strSupplierName_View'] += (value['strEmail'] ? '<div><b>Email: </b>' + value['strEmail'] : '') + (value['strPhone'] ? ' - <b>Phone: </b>' + value['strPhone'] : '') + '</div>'
                            if (value['strWebsite'])
                                value['strSupplierName_View'] += '<div><b>Website: </b>' + value['strWebsite'] + '</div>'
                            value['strCateName'] = Arr_CateID_Ddl.filter(function (item) { return item.intID == value.intCateID })[0].strName
                        }
                        , objCols: {

                            No: { name: pngElm.getLangKey({ langkey: 'sys_Txt_No' }) }
                            , strCateName: { name: 'Loại dịch vụ' }
                            , strSupplierName_View: { name: pngElm.getLangKey({ langkey: 'sys_Txt_SupplierName' }) }
                            , strItemName: { name: pngElm.getLangKey({ langkey: 'sys_Txt_ItemTypeName' }) }

                        }
                        , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {

                            arr = _arrList
                        }
                        , customEvent: function (_iOrClass_Pn) {
                        }
                        // ,changeInput:function(){}
                        , IsViewCheckBoxMain: false
                        , idOrClass: IdOrClass_Pn + ' .pnTableService_' + value.intDayOrder + ' .pnList'
                    })
                }


            })

        }



        objEvtPanel.pnIn_ExClude = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''

            strHtml += '<div class="row" style="display: flex;">'
            strHtml += '<div class="col-md-6" style="display: flex;">'
            strHtml += '<div style="width: 100%;">'
            strHtml += '    <div class="tour_include_exclude">'
            strHtml += '        <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Include"></b></h3>  '
            strHtml += '<div class="pn-padding-l-15">' + (Obj_Detail.strIncluded || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>') + '</div>'
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '<div class="col-md-6" style="display: flex;">'
            strHtml += '<div style="width: 100%;">'
            strHtml += '    <div class="tour_include_exclude">'
            strHtml += '        <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Exclude"></b></h3>'
            strHtml += '        </div>     '
            strHtml += '<div class="pn-padding-l-15">' + (Obj_Detail.strExcluded || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>') + '</div>'
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '</div>'
            $(IdOrClass_Pn).html(strHtml)
        }


        objEvtPanel.pnTerms_Conditions = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn
            var strHtml = ''
            strHtml += '<div style="margin: 15px 0;">'
            strHtml += '<div>'
            strHtml += '    <h3 class="pn-margin-t-b-15"><b langkey="pg_Main_Tour_MdDtl_Terms_Conditions"></b></h3>'
            strHtml += '    <div class="tours-terms-conditions">'
            strHtml += '<div class="pn-padding-l-15">' + (Obj_Detail.strTermAndCondition || '<i>' + pngElm.getLangKey({ langkey: 'sys_Txt_NoData' }) + '</i>') + '</div>'
            strHtml += '    </div>'
            strHtml += '</div>'
            strHtml += '</div>'

            $(IdOrClass_Pn).html(strHtml)

        }


        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })


    }




}


$.ModulePage_BookingDetailMain_PopUpVoucherForSupp = function (options) {
    var defaults = {
        strUserGUID: JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID,
        objBookingServiceDetail: {},
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);


    var Obj_Detail = options.objBookingServiceDetail


    var ObjList_Api = {
        GetListBooking: {
            strApiLink: 'api/public/GetListBooking'
            , objParams: {
                strUserGUID: null
                , strBookingGUID: null
                , strBookingCode: null
                , strFilterDateFrom: null
                , strFilterDateTo: null
                , intOrderStatusID: null
                , intPaymentStatusID: null
                , intBookingStatusID: null
                , intCurPage: null
                , intPageSize: null
                , isPartner: 1
                , tblsReturn: "[3][4][5][9]"
            }
        },
        GetListSupplierForAgentHost: {
            strApiLink: 'api/public/GetListSupplierForAgentHost'
            , objParams: {
                strUserGUID: null
                , strCompanyGUID: null
                , intCateID: null
                , IsOwner: null
                , strSupplierGUID: null
                , strFilterSupplierName: null
                , strFilterSupplierEmail: null
                , intEasiaCateID: null
                , intCurPage: 1
                , intPageSize: 10
                , strOrder: null
                , tblsReturn: '[0]'
            }
        },

        GetListBookingService: {
            strApiLink: 'api/public/GetListBookingService'
            , objParams: {
                strUserGUID: null
                , strBookingGUID: null
                , strBookingItemGUID: null
                , strParentBookingItemGUID: null
                , strBookingServiceGUID: null
                , intBookingStatusID: 4

                , intCurPage: null
                , intPageSize: null
                , strOrder: null
                , tblsReturn: '[0]'
            }
        },

        GetBookingItemForConfirmedCode: {
            strApiLink: 'api/booking/GetBookingItemForConfirmedCode'
            , objParams: {
                strUserGUID: options.strUserGUID
                , strConfirmedCode: Obj_Detail.strConfirmedCode,
            }
        },
    }

    var ObjList_ComboValue = {
        ArrCountry: {
            getValCode: { strCombocode: "185" }
            , OnSuccessItem: function (data) {
                // data.unshift({'':'Select...'})
                return data
            }
        },
        Arr_CateID_Ddl: {
            strTableName: 'SP02'             // Bảng sử dụng để get dữ liệu
            , strFeildSelect: 'SP02_CateID AS intID,SP02_LangCode AS strName' // Trường cần lựa chọn
            , strWhere: 'WHERE IsActive = 1'      // Điều kiện
        },
    }


    // $(idOrClass).html(strHtmlMain)

    // pngPn.getListArrOrObjValue({
    //     setListValue: ObjList_ComboValue,
    //     OnSuccessList:function(ObjListCombo){
    // GetMain()
    //     }
    // })


    var objDetailPost = {}

    var Obj_BookingServiceDetail = {}
    var Arr_PriceTableItem = []
    var Arr_CustomerList = []
    var Obj_AgentHostDetail = {}
    var Obj_DetailLeader = []


    //---------
    var Arr_ListTbl = []
    var Obj_FormInput = {}
    var Obj_FN_Main = {}
    //---------

    png.postListApiGetValue({
        objList_Api: ObjList_Api
        // ,objList_ComboValue: ObjList_ComboValue
        , objListApi_RtnVal: {
            'GetBookingItemForConfirmedCode': {
                objParams_Cus: {},
                OnSuccess: function (data) {
                    objDetailPost = JSON.parse(data)[0][0]   // Dữ liệu trả về từ dropdownlist trên
                }
            },
        }
        , OnSuccessList: function (data) {

            png.postListApiGetValue({
                objList_Api: ObjList_Api
                //, objList_ComboValue: ObjList_ComboValue
                , objListApi_RtnVal: {
                    'GetListBooking': {
                        objParams_Cus: {
                            strBookingGUID: objDetailPost.strBookingGUID
                        }
                        , OnSuccess: function (data) {
                            Arr_CustomerList = JSON.parse(data)[3]
                            Arr_PriceTableItem = JSON.parse(data)[4]
                            Obj_BookingServiceDetail = Arr_PriceTableItem.filter(function (item) { return (item.strParentBookingItemGUID || '').toUpperCase() == (objDetailPost["strBookingItemGUID"]).toUpperCase() })[0]

                            Arr_ListBookingItem = JSON.parse(data)[5]
                            Obj_AgentHostDetail = JSON.parse(data)[9].filter(function (item) { return item.strAgentHostBookingGUID.toUpperCase() == Obj_BookingServiceDetail.strBookingByAgentHostGUID.toUpperCase() })[0]

                            Obj_DetailLeader = Arr_CustomerList.filter(function (item) { return item.IsLeader })[0]
                        }
                    },
                }
                , OnSuccessList: function (data) {

                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        // ,objList_ComboValue: ObjList_ComboValue
                        , objListApi_RtnVal: {
                            'GetListSupplierForAgentHost': {
                                objParams_Cus: {
                                    intCateID: objDetailPost.intCateID,
                                    strSupplierGUID: objDetailPost.strSupplierGUID,
                                },
                                OnSuccess: function (data) {
                                    Obj_Detail = JSON.parse(data)[0][0]   // Dữ liệu trả về từ dropdownlist trên
                                }
                            },
                            'GetListBookingService': {
                                objParams_Cus: {
                                    strBookingGUID: Obj_BookingServiceDetail.strBookingGUID,
                                    strParentBookingItemGUID: Obj_BookingServiceDetail.strParentBookingItemGUID,
                                },
                                OnSuccess: function (data) {
                                    Arr_ListTbl = JSON.parse(data)[0]  // Dữ liệu trả về từ dropdownlist trên
                                }
                            },
                        }
                        , OnSuccessList: function (data) {

                            GetPopUp()
                        }
                    })


                }
            })
        }
    })

    // GetPopUp()
    function GetPopUp() {
        pngPn.getPopUp({
            strTitle: 'Voucher Detail'
            , intTypeSize: 1//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp, _OnClosePp) {

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}

        var objPanel = {                 // Khai báo các thành phần của panel
            pnMain: {
                tag: 'div', attr: 'class=""'
                , childTags: [{ div: 'class="row"' }]
                , pnListBtn: { tag: 'div', attr: 'class="col-md-12"' }
                , pnCnt: {
                    tag: 'div', attr: 'class="col-md-12"'
                    , childTags: [{ div: 'class="row" ' }, { div: 'class="pnContent"' }]
                    , pnInfo: { tag: 'div', attr: 'class="col-md-12"' }
                    // ,pnDes:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnItinerary:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnIn_ExClude:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnTerms_Conditions:{tag:'div',attr:'class="col-md-12"'}
                }


            }
        }


        var objEvtPanel = {}


        objEvtPanel.pnListBtn = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''

            // strHtml+= '<div>'
            //     strHtml+= '<button id="btnExportToWord" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-file-word-o"></i><span>Export to Word</span></button>'
            // strHtml+= '</div>'

            // $(IdOrClass_Pn).html(strHtml)


            // $('#btnExportToWord',IdOrClass_Pn).click(function(){
            //     window.open(png.getServerURL('Page/Export.aspx?type=GetExportTourDetail&strUserGUID='+options.strUserGUID+'&strTourGUID='+options.strTourGUID+''))
            // })

            var strHtml = ''

            strHtml += '<div class="pn-margin-b-15">'
            // strHtml+= '<button id="btnExportToWord" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-file-word-o"></i><span>Export to Word</span></button>'

            strHtml += '<button class="btn btn-texticon btn-default" id="btnPrint" style=""><i class="fa fa-print"></i><span>Print</span></button>'
            if (Obj_DetailLeader.strPassengerEmail)
                strHtml += '<button class="btn btn-texticon bg-primary" id="btnSendEmailToLeader" style=""><i class="fa fa-envelope"></i><span>Send To <b>' + Obj_DetailLeader.strPassengerEmail + '</b></span></button>'
            strHtml += '</div>'
            strHtml += '<div class="pnContent_Print" style="display:none"></div>'

            $(IdOrClass_Pn).html(strHtml)


            $('#btnExportToWord', IdOrClass_Pn).click(function () {
                window.open(png.getServerURL('Page/Export.aspx?type=GetExportTourDetail&strUserGUID=' + options.strUserGUID + '&strTourGUID=' + options.strTourGUID + ''))
            })

            var strHtnl_Pr

            $(IdOrClass_Pn + ' #btnSendEmailToLeader').click(function () {
                $.Confirm({
                    strContent: '<span langkey="sys_Cfm_AYS"> </span>'
                    , OnSuccess: function () {

                        png.postSendEmail({
                            strUserGUID: null
                            , strEmailsSendTo: ""
                            , strEmailsCC: ""
                            , strEmailsBCC: ""
                            , strEmailTemplateSubject: ""
                            , IsBodyHtml: 1
                            , strEmailTemplateContent: ""
                            , strTempApiUrl: 'api/public/GetEmailSendConfirmToPax'
                            , objTempPar: {
                                strUserGUID: options.strUserGUID
                                , intLangID: $.pngGetLangID()
                                , strConfirmedCode: Obj_BookingServiceDetail.strConfirmedCode
                            }
                            , OnSuccess: function (data) {
                                if (data == "1") {
                                    $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailSuccess"></span>' })
                                } else {
                                    $.Confirm({ strContent: '<span langkey="sys_Txt_SendEmailFail"></span>' })
                                }

                            }
                        })
                    }
                })



            })


            setTimeout(function () {
                var strHtml = $(IdOrClass_Main + ' .pnContent').html()
                $(IdOrClass_Pn + ' .pnContent_Print').html(strHtml)

                $(IdOrClass_Pn + ' .pnContent_Print').find('table').attr('border', '1').attr('cellspacing', '0').attr('cellpadding', '5').css('width', '100%')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.row').css('margin-left', '-5px').css('margin-right', '-5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-6').css('width', '48%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-8').css('width', '65%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.col-md-4').css('width', '32%').css('display', 'inline-table').css('padding', '0 5px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pn-margin-b-15').css('margin-bottom', '15px')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pn-margin-t-b-15').css('margin-top', '15px').css('margin-bottom', '15px')

                $(IdOrClass_Pn + ' .pnContent_Print').find('.pnImg').attr('style', '')
                $(IdOrClass_Pn + ' .pnContent_Print').find('.pnImg').html('<img src="' + (Obj_Detail.strTourImageUrl ? png.getServerImgURL(Obj_Detail.strTourImageUrl) : 'assets/images/img-noimage.png') + '" style="width:100%">')
                // $(IdOrClass_Pn+' .pnContent_Print').find('#pnQrCode').attr('id','pnQrCode2')

                strHtnl_Pr = $(IdOrClass_Main + ' .pnContent_Print').html()
                $(IdOrClass_Pn + ' #btnPrint').click(function () {
                    pngPn.getPopUpPrint({
                        idOrClass: null
                        , strHtml: strHtnl_Pr
                    })
                })
            }, 600)
        }


        objEvtPanel.pnInfo = function (_idOrClassPn) {
            var IdOrClass_Pn = _idOrClassPn


            var strHtml = ''
            strHtml += '<div class="row">'
            strHtml += '<div class="col-md-8">'
            strHtml += '<h4 class="pn-margin-b-15" style="text-decoration: underline;margin-top:0"><b>Nơi nhận:</b></h4>'
            strHtml += '<p><b style="font-size: 20px;">' + Obj_Detail.strSupplierName + '</b></p>'
            if (Obj_Detail.strSupplierAddr)
                strHtml += '<p><b>Địa chỉ: </b>' + Obj_Detail.strSupplierAddr + '</p>'
            if (Obj_Detail.strSupplierEmail)
                strHtml += '<p><b>Email: </b>' + Obj_Detail.strSupplierEmail + '</p>'
            if (Obj_Detail.strSupplierPhone)
                strHtml += '<p><b>Điện thoại: </b>' + Obj_Detail.strSupplierPhone + '</p>'
            strHtml += '</div>'
            strHtml += '<div class="col-md-4 mobile-txt-left" style="text-align: right">'
            strHtml += '        <div class="pn-margin-b-15"><b>Confirm Code: </b>' + (Obj_BookingServiceDetail.strConfirmedCode || '') + '</div>'
            strHtml += '        <div class="pn-margin-b-15 pnQrCode" style="width: 130px;height: 130px;display: inline-block;"></div>'
            strHtml += '</div>'
            strHtml += '</div>'

            strHtml += '<h4 class="pn-margin-b-15" style="text-decoration: underline;margin-top:30px"><b>Thông tin phòng:</b></h4>'
            Arr_ListTbl.forEach(function (value) {

                var arr = Arr_PriceTableItem.filter(function (item) { return item.strBookingItemGUID.toUpperCase() == value.strBookingItemGUID.toUpperCase() && item.intQuantityTypeID != 27 && item.intQuantityTypeID != 2 })

                var strRoom = ''
                arr.forEach(function (val) {
                    if (val.strQuantityTypeName.indexOf('paxs room') == -1)
                        strRoom += val.intQuantity + ' ' + val.strQuantityTypeName
                    else
                        strRoom = val.intQuantity
                })

                strHtml += '<p><b>Tên phòng: </b>' + (value.strItemName || '') + '</p>'

                strHtml += '<p><b>Người xác nhận: </b>' + (value.strMemberInfo || '') + '</p>'
                strHtml += '<p><b>Ngày xác nhận: </b>' + ($.pngFormatDateTime(value.dtmConfirmedDate) || '') + '</p>'

                strHtml += '<p><b>Check In - Check Out: </b>' + $.pngFormatDateTime(value.dtmCheckInDate) + ' - ' + $.pngFormatDateTime(value.dtmCheckOutDate) + '</p>'
                strHtml += '<p><b>Số lượng phòng: </b>' + (strRoom || '') + '</p>'
                strHtml += '<p>&nbsp;</p>'

                // var arr = Arr_PriceTableItem.filter(function(item){ item.strParentBookingItemGUID.toUpperCase() == value.strBookingItemGUID.toUpperCase() })


            })
            // strHtml+= '<p><b>Mã đặt phòng: </b>'+('' || '')+'</p>'
            // strHtml+= '<p><b>Người xác nhận: </b>'+('' || '')+'</p>'
            // strHtml+= '<p><b>Ngày xác nhận: </b>'+('' || '')+'</p>'
            // strHtml+= '<p><b>Check In - Check Out: </b>'+('' || '')+'</p>'
            // strHtml+= '<p><b>Số lượng phòng: </b>'+('' || '')+'</p>'

            var intAdults = Arr_CustomerList.filter(function (item) { return item.intAgeID == 3 }).length
            var intChild = Arr_CustomerList.filter(function (item) { return item.intAgeID == 4 }).length
            strHtml += '<h4 class="pn-margin-b-15" style="text-decoration: underline;margin-top:15px"><b>Thông tin khách:</b></h4>'
            strHtml += '<p><b>Số lượng khách: </b>' + Arr_CustomerList.length + ' (' + intAdults + ' người lớn' + (intChild ? ' - ' + intChild + ' trẻ em' : '') + ')</p>'
            strHtml += '<p><b>Tên khách : </b>' + Obj_DetailLeader.strPassengerName + '</p>'

            // strHtml+= '<h4 class="pn-margin-b-15" style="text-decoration: underline;margin-top:30px"><b>Thanh toán:</b></h4>'
            // strHtml+= '<p>Tiền phòng được Công ty TNHH Việt Nam Khám Phá thanh toán bằng chuyển khoản. Các chi phí khác do khách hàng trả (nếu có). </p>'

            strHtml += '<h4 class="pn-margin-b-15" style="text-decoration: underline;margin-top:30px"><b>Liên hệ:</b></h4>'
            strHtml += '<p><b>' + Obj_AgentHostDetail.strCompanyName + '</b></p>'
            if (Obj_AgentHostDetail.strCompanyAddr)
                strHtml += '<p><b>' + pngElm.getLangKey({ langkey: 'sys_Txt_Addr' }) + '</b> ' + Obj_AgentHostDetail.strCompanyAddr + '</p>'
            if (Obj_AgentHostDetail.strCompanyEmail)
                strHtml += '<p><b>' + pngElm.getLangKey({ langkey: 'sys_Txt_Email' }) + ':</b> ' + Obj_AgentHostDetail.strCompanyEmail + '</p>'
            if (Obj_AgentHostDetail.strCompanyPhone)
                strHtml += '<p><b>' + pngElm.getLangKey({ langkey: 'sys_Txt_PhoneNumber' }) + ':</b> ' + Obj_AgentHostDetail.strCompanyPhone + '</p>'


            $(IdOrClass_Pn).html(strHtml)


            if (!$('body #pnQrCode').length)
                $('body').append('<div id="pnQrCode" style="display:none"></div>')

            var qrcode = new QRCode("pnQrCode", {
                width: 130,
                height: 130,
            });
            qrcode.makeCode(png.ObjClnUrl.APPB2B + 'confirmation/' + Obj_BookingServiceDetail.strConfirmedCode);

            setTimeout(function () {
                $(IdOrClass_Pn + ' .pnQrCode').html($('#pnQrCode').html())

                $('body #pnQrCode').remove()
                    , 100
            })

        }



        // ===================================

        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            , objEvtPanel: objEvtPanel
            , idOrClass: IdOrClass_Main  // Id or class chính
            , OnChangeIdPn: function (_Fn) {
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }
        })


    }




}
