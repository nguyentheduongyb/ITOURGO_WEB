// $.fn.loadJS(coreSystem.getLinkVer('Lib_Custom/_MdCm_All.js'))
$.ModuleCommon_All_PopUpPaymentBooking = function (options) {
    var defaults = {
        strUserGUID: ''
        ,strCompanyPartnerGUID: ''
        ,arrListAgentHost: []
        ,arrListService: []
        ,objTourDetail:{}
        ,objSuppDetail:{}
        ,OnSuccess: function () {
        }
    }
    options = $.extend(defaults, options);


    var IdOrClass_Main = ''

    
    //---------Obj_XXX
    //---------Arr_XXX
    //---------Is_XXX
    //---------Int_XXX
    //---------Str_XXX
    var Arr_ListAgentHost = options.arrListAgentHost
    var Arr_ListService = options.arrListService

    var Obj_PaymentAmountAndPeriod = {}//options.objPaymentAmountAndPeriod
    var Obj_OrderDetail = {}//options.objOrderDetail
    var Obj_TourDetail = options.objTourDetail
    var Obj_SuppDetail = options.objSuppDetail
    
    var Str_ReturnUrl = png.ObjClnUrl.APPB2B_Agent
    Str_ReturnUrl = $.pngGetQSVal('cname', $.pngGetQSVal('cname'),Str_ReturnUrl)
    Str_ReturnUrl = $.pngGetQSVal('page', 'payonline-return', Str_ReturnUrl)

    var ObjList_Api = {
        GetFilterCompanyBankAccount:{
            strApiLink:'api/user/GetFilterCompanyBankAccount'
            ,objParams:{
                strAgentCode: null
                ,strWhere : null
                ,strOrder : null
                ,strCompanyGUID :  null
                ,intCurPage : null
                ,intPageSize : null
                ,tblsReturn : null
            }
        },
        GetReportCommissionByAgentHost:{
            strApiLink:'api/booking/GetReportCommissionByAgentHost'
            ,objParams:{
                strUserGUID : options.strUserGUID
                ,strCompanyGUID : null
                ,strPayableBookingItemGUID: ''
                ,strFilterAgentName: null
                ,strFilterBookingCode: null
                ,strFilterGroupName: null
                ,dtmFilterDateFrom: null
                ,dtmFilterDateTo: null
                ,intPaymentStatusID: 3
                ,strPartnerCompanyGUID: options.strCompanyPartnerGUID
                ,strPartnerMemberGUID: (options.strCompanyPartnerGUID? null : options.strUserGUID)
                ,strPaidBookingItemGUID: ''
                ,intAgentHostPaymentTypeID: 2
                ,intCurPage : 1
                ,intPageSize : 10
                ,strOrder : null
                ,tblsReturn : '[0]'
            }
        },
        GetTourServiceXMLForTMS:{
            strApiLink:'api/booking/GetTourServiceXMLForTMS'
            ,objParams:{
                strUserGUID:options.strUserGUID
                ,strBookingGUID: null
            }
        },
        GetUrlPayOnline:{
            strApiLink:'api/payonline/GetUrlPayOnline' 
            ,objParams:{ 
                strOrderBeforePaymentCode : null
                ,strReturnUrl : Str_ReturnUrl
                ,dblAmount: 0
                ,strDescription:"payment online"
            }
        },
        GetCheckRemainCreditByAgent:{
            strApiLink:'api/booking/GetCheckRemainCreditByAgent' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID
                ,strOrderBookingGUID: null
                ,strCompanyGUID: options.strCompanyPartnerGUID
            }
        },
        
        GetCheckRemainForServicesBooking:{
            strApiLink:'api/booking/GetCheckRemainForServicesBooking' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID
                ,strOrderBookingGUID: null
                ,strCompanyOwnerGUID: null
            }
        },
        
        AddPaymentTransactionByAgent:{
            strApiLink:'api/booking/AddPaymentTransactionByAgent' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID
                ,strOrderBookingCode : Obj_OrderDetail.strOrderBookingCode
                ,intOrderStatusID:1
                ,strAgentCode: JSON.parse(png.ArrLS.UserDetail.get()).strAgentCode
                ,dblPaymentTransactionAmount : null
                ,strRemark: null
            }
        },

        AddPayableBookingUsed:{
            strApiLink:'api/booking/AddPayableBookingUsed' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID
                , strListPayableBookingItemGUID: null
            }
        },

        GetListPaymentAmountForOrderItem:{
            strApiLink:'api/booking/GetListPaymentAmountForOrderItem' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID
                ,strListOrderBookingItemGUID: null
                ,intMemberTypeID: 5
            }
        },

        AddBookingFromOrderByTraveller:{
            strApiLink:'api/traveller/AddBookingFromOrderByTraveller' 
            ,objParams:{ 
                strPassengerGUID: options.strUserGUID,
                strListOrderBookingItemGUID : null,
                strListCompanyOwnerGUID : null,
                intOrderStatusID : 4,
                intSaluteID : null,
                intAgeID : null,
                intPassengerAges : null,
                strPassengerFirstName : null,
                strPassengerLastName : null,
                dtmPassengerBirthday : null,
                dtmPasspostExpirationDate : null,
                strPassengerEmail : null,
                strPassengerPhone : null,
                strPassengerRemark : null,
                strPassport : null,
                strCountryGUID : null,
                IsTraveller: null,
            }
        },

        //---------------Tour-----------
        
        GetListTourPaymentTerm:{
            strApiLink:'api/tour/GetListTourPaymentTerm'
            ,objParams:{
                strUserGUID: options.strUserGUID
                ,strTourPaymentTermGUID: null
                ,strTourGUID: Obj_TourDetail.strTourGUID
                ,IsActive: null
                ,intCurPage: null
                ,intPageSize: null
                ,strOrder: 'IsDepositOnBook desc,intDayTo desc'
                ,tblsReturn:'[0]'
            }
        },

        AddBookingFromTourByPassenger:{
            strApiLink:'api/traveller/AddBookingFromTourByPassenger' 
            ,objParams:{ 
                strPassengerGUID: options.strUserGUID,
                strListCompanyOwnerGUID : null,
                intOrderStatusID : 4,
                intSaluteID : null,
                intAgeID : null,
                intPassengerAges : null,
                strPassengerFirstName : null,
                strPassengerLastName : null,
                dtmPassengerBirthday : null,
                dtmPasspostExpirationDate : null,
                strPassengerEmail : null,
                strPassengerPhone : null,
                strPassengerRemark: null,
                strPassport : null,
                strCountryGUID : null,
                IsTraveller: null,
	            strPaidRemark: null,

                strTourGUID : Obj_TourDetail.strTourGUID,
                strTourPriceItemGUID : Obj_TourDetail.strTourPriceItemGUID,
                strDepartureTourGUID : Obj_TourDetail.strDepartureTourGUID,
                dtmDateFrom : Obj_TourDetail.dtmDateFrom,
                intAdult : Obj_TourDetail.intAdult,
                strListChildAge : Obj_TourDetail.strListChildAge,
                intSGL : Obj_TourDetail.intSGL,
                intDBL : Obj_TourDetail.intDBL,
                intTWN : Obj_TourDetail.intTWN,
                intTPL : Obj_TourDetail.intTPL,
            }
        },

        
        //---------------Hotel-----------

        GetListLinkSupplierChildAge:{
            strApiLink:'api/supplier/GetListLinkSupplierChildAge'
            ,objParams:{
                strUserGUID : options.strUserGUID,
                strLinkSupplierChildAgeGUID : null,
                strItemTypeGUID : null,
                intCurPage : null,
                intPageSize : null,
                strOrder : null,
                tblsReturn : '[0]',
            }
        },
        GetListSurchargeDateForAgent:{
            strApiLink:'api/supplier/GetListSurchargeDateForAgent'
            ,objParams:{
                strUserGUID : options.strUserGUID
                ,strSupplierGUID : Obj_SuppDetail.strSupplierGUID
                ,strCompanyOwnerGUID : null
                ,dtmFilterDateFrom : null
                ,dtmFilterDateTo : null
                ,intCurPage : null
                ,intPageSize : null
                ,strOrder : null
                ,tblsReturn : '[0]'
            }
        },
        GetListSupplierPaymentTerm:{
            strApiLink:'api/supplier/GetListSupplierPaymentTerm'
            ,objParams:{
                strUserGUID: options.strUserGUID
                ,strSupplierPaymentTermGUID: null
                ,strCompanyGUID: null
                ,strSupplierGUID:  Obj_SuppDetail.strSupplierGUID
                ,dtmCheckInDate: null
                ,intProductIDForBook: null
                ,intCurPage: null
                ,intPageSize: null
                ,strOrder: 'IsDepositOnBook desc,intDayTo desc'
                ,tblsReturn:'[0]'
            }
        },

        AddBookingFromHotelByTraveller:{
            strApiLink:'api/traveller/AddBookingFromHotelByTraveller' 
            ,objParams:{ 
                strUserGUID: options.strUserGUID,
                strSupplierGUID: Obj_SuppDetail.strSupplierGUID,
                strCompanyOwnerGUID : Obj_SuppDetail.strCompanyGUID,
                strPriceListGUID: null,

                intSaluteID : null,
                intAgeID : null,
                intPassengerAges : null,
                strPassengerFirstName : null,
                strPassengerLastName : null,
                dtmPassengerBirthday : null,
                dtmPasspostExpirationDate : null,
                strPassengerEmail : null,
                strPassengerPhone : null,
                strPassport : null,
                strPassengerRemark: null,
                strCountryGUID : null,
                IsTraveller: null,

                intAdult : null,
                strListChildAge : null,
                strListItemTypeGUID: null,
                strListSupplierChildAgeGUID: null,
                strListSurchargeDateGUID: null,
                IsBookNotMinstay: null,
                intPaymentMethodID: null,
                strCompanyBankAccountGUID: null,
                dtmDateFrom:null,
                dtmDateTo :null,
                strRemark: null,
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
        },
        
        arrCountry:{
            strTableName:'MC02'
            ,strFeildSelect:'MC02_CountryGUID AS intID,MC02_CountryName AS strName'
            ,strWhere:' WHERE IsActive=1 ORDER BY MC02_CountryName'
        },
        arrSalute:{
            strTableName:'MC16'
            ,strFeildSelect:'MC16_SaluteID AS intID, MC16_SaluteName AS strName'
            ,strWhere:'WHERE IsActive = 1 ORDER BY MC16_SaluteID'
        },
        arrAge:{
            strTableName:'MC23'
            ,strFeildSelect:'MC23_AgeID AS intID,MC23_AgeName AS strName'
            ,strWhere:'WHERE IsEnableB2B=1 ORDER BY MC23_Order'
        }
    }

    var Arr_OrderPaymentTerm = []
    var Arr_PaymentMethod = []
    var Obj_Payment = {}

    var Arr_ListChild = []
    var Arr_ListChildAge = []
    var Arr_Surcharge = []
    var Arr_ListFOCUse = []
    var IsBookNotMinstay = null

    var Arr_Salute_Ddl = []
    var Arr_Country_Ddl = []
    var Arr_Age_Ddl = []

    //---------
    var Obj_FormInput = {}
    var Obj_FN_Main = {}
    //---------

    png.postListApiGetValue({
        objList_ComboValue: ObjList_ComboValue
        ,objListComboValue_RtnVal: {
            'Arr_SQL':{
                objParams_Cus:{
                    strTableName:'OB12'
                    ,strFeildSelect:'OB12_PaymentMethodID AS intID,OB12_PaymentMethodName AS strName'
                    ,strWhere:'WHERE IsActive=1 AND OB12_PaymentMethodID = 1 ORDER BY OB12_Order'
                }, 
                OnSuccess: function(data){ 
                    Arr_PaymentMethod = data   // Dữ liệu trả về từ dropdownlist trên
                }
            },
            
            'arrCountry':{
                objParams_Cus:{}, OnSuccess: function(data){ 
                    Arr_Country_Ddl = $.pngGetArrComboValue(data,'intID','strName')
                }
            }
            ,'arrSalute':{
                objParams_Cus:{}, OnSuccess: function(data){ 
                    Arr_Salute_Ddl = $.pngGetArrComboValue(data,'intID','strName')
                }
            }
            ,'arrAge':{
                objParams_Cus:{}, OnSuccess: function(data){ 
                    Arr_Age_Ddl = $.pngGetArrComboValue(data,'intID','strName')
                }
            }
        }
        ,OnSuccessList:function(data){

            if(Obj_TourDetail && Object.keys(Obj_TourDetail).length){

                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetListTourPaymentTerm':{
                            objParams_Cus:{
                            }
                            ,OnSuccess: function(data){
                                Arr_OrderPaymentTerm = JSON.parse(data)[0]
                                
                                GetPopUp()
                            }
                        }
                    }
                })

            }else if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length){
                
                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetListLinkSupplierChildAge':{
                            objParams_Cus:{
                                strItemTypeGUID: Obj_SuppDetail.strItemTypeGUID
                            }
                            , OnSuccess: function(data){ 
                                Arr_ListChild = JSON.parse(data)[0]
        
                                Arr_ListChildAge = Obj_SuppDetail.objSearchDtl.arrChildren.filter(function(item){ return (Arr_ListChild.filter(function(item2){ return item >= item2.dblAgeFrom && item <= item2.dblAgeTo }).length)  })
        
        
                            }
                        },
                        'GetListSupplierPaymentTerm':{
                            objParams_Cus:{
                                strCompanyGUID: Obj_SuppDetail.strCompanyGUID
                            }
                            , OnSuccess: function(data){ 
                                Arr_OrderPaymentTerm = JSON.parse(data)[0]
                            }
                        },
                        'GetListSurchargeDateForAgent':{
                            objParams_Cus:{
                                dtmFilterDateFrom: Obj_SuppDetail.objSearchDtl.dtmDateCheckIn
                                ,dtmFilterDateTo: Obj_SuppDetail.objSearchDtl.dtmDateCheckOut
                                ,strCompanyOwnerGUID: Obj_SuppDetail.strCompanyGUID
                                ,tblsReturn:'[0][1]'
                            }
                            ,OnSuccess: function(data){
                                Arr_Surcharge = JSON.parse(data)[0]
                                var ArrSurchargePrice = JSON.parse(data)[1]
        
                                Arr_Surcharge.forEach(function(value,key){
                                    if(value.intPerPaxID == 1){
                                        value.intQuantity = Obj_SuppDetail.objSearchDtl.intNoAdult// + Obj_SearchDtl.arrChildren.length
                                    }else if(value.intPerPaxID == 2){
                                        value.intQuantity = 1
                                    }

                                    value.arrSurchargePrice = ArrSurchargePrice

                                    // var arr = ArrSurchargePrice.filter(function(item){ return item.strSurchargeDateGUID.toUpperCase() == value.strSurchargeDateGUID.toUpperCase() && item.intPaxFrom <=value.intQuantity  && item.intPaxTo >= value.intQuantity })
        
                                    // value.dblUnitPrice = arr[0].dblPrice
                                })
        
                            }
                        }
                    }
                    ,OnSuccessList:function(data){

                        Arr_ListFOCUse = Obj_SuppDetail.arrListFOCUse

                        GetPopUp()
                    }
                })
            }
            else{
                
                var strListOrderBookingItemGUID = ''
                Arr_ListService.forEach(function(value){
                    strListOrderBookingItemGUID+=value.strPassengerOrderItemGUID+','
                })
                
                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetListPaymentAmountForOrderItem':{
                            objParams_Cus:{
                                strListOrderBookingItemGUID: strListOrderBookingItemGUID
                            }
                            ,OnSuccess: function(data){
                                Arr_OrderPaymentTerm = JSON.parse(data)[0]
                                
                                GetPopUp()
                            }
                        }
                    }
                })

            }

            
        }
    })

    // GetPopUp()
    function GetPopUp(){
        pngPn.getPopUp({
            strTitle: 'Payment'
            , intTypeSize:2//------------1 small ---2 medium ---3 large
            , OnPanel: GetMainPanel
            , OnClosePopUp: function () {
                //------Chọn sự kiện khi Đóng PopUP
            }
        })
    }

    function GetMainPanel(_IdOrClassPp,_OnClosePp){

        IdOrClass_Main = _IdOrClassPp
        Obj_FN_Main.OnClosePp = _OnClosePp

        // Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
        // Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}

        var objPanel= {
            pnMain:{tag:'div',attr:'class=""',childTags:[{div:'class="row"'}]
                ,pnContent:{tag:'div',attr:'class="col-md-12"'}
                ,pnCustomer:{tag:'div',attr:'class="col-md-12" '}
                ,pnBtn:{tag:'div',attr:'class="col-md-12" '}
            }
        }

        var objEvtPanel = {}
        objEvtPanel.pnContent = function(_idOrClassPn){
            var IdOrClass_Pn = _idOrClassPn

            // if(options.strCompanyOwnerGUID){
            //     Obj_Payment = JSON.parse(JSON.stringify(Arr_OrderBookingByAgentHost[0]))
            // }else{
            //     Obj_Payment = JSON.parse(JSON.stringify(Obj_OrderDetail))
            // }

            // Obj_Payment['IsPayment'] = Obj_PaymentAmountAndPeriod['IsPayment']

            // Obj_Payment['dtmInvoiceDeadline'] = $.pngFormatDateTime(Obj_PaymentAmountAndPeriod['dtmDateDeadline'],'l')
            // Obj_Payment['dtmInvoiceDeadline_View'] = $.pngFormatDateTime(Obj_Payment['dtmInvoiceDeadline'])
            // Obj_Payment['dblPricePayment'] = Obj_PaymentAmountAndPeriod['dblPriceCharge']
            // Obj_Payment['dblPriceTotal_View'] = $.pngFormatPrice(Obj_Payment['dblPriceTotal'])
            // Obj_Payment['dblPricePayment_View'] = '<a action="ViewListTerm">'+$.pngFormatPrice(Obj_Payment['dblPricePayment'])+"</a>"


            // Obj_Payment['intPaymentMethodID'] = 1  

            var DblPriceCharge = Obj_Payment['dblPricePayment']
            var DblCreditRemain = 0
            
            // coreLoadPage.getCredit({
            //     OnSuccess:function(obj){
            //         DblCreditRemain = obj.dblCreditRemain
            //     }
            // })


            Obj_FormInput = {
                // dblPriceTotal_View:{title:'Total Price',attr:"class='col-md-4'"
                //     ,input:{IsNoInput:true,IsViewDtl:true}
                // },
                // // dtmInvoiceDeadline_View:{title:'Deadline',attr:"class='col-md-4'"
                // //     ,input:{IsNoInput:true,IsViewDtl:true}
                // // },
                // dblPricePayment_View:{title:'Price Payment',attr:"class='col-md-4'"
                //     ,input:{IsNoInput:true,IsViewDtl:true}
                // },
                
                // IsUseCommisssion:{title:'Use Commission</label> <span class="txtTotalComPrice"></span>',isRequire:false,attr:"class='col-md-12 '",IsRtn:true
                //     ,input:{type:'checkbox',classEx:'chkCustom-1',attr:'style="float: left;margin-right: 5px;margin-top: 2px;"'}
                // },
                
                // intPaymentMethodID:{title:'Phương thức thanh toán',attr:"class='col-md-4'",isRequire:false,IsRtn:true
                //     ,input:{type:'select',classEx:'form-control',attr:''}
                //     ,dropDown:{arrList:$.pngGetArrComboValue(Arr_PaymentMethod,'intID','strName')}
                // },
                pnTotalPayment:{title:'',attr:"class='col-md-12' style=''"
                    ,input:{IsNoInput:true}
                },
                // IsPayment:{title:'Các dịch vụ chưa đến thời hạn trả tiền. Bạn có muốn đặt luôn không?',isRequire:false,attr:"class='col-md-12' ",IsRtn:false
                //     ,input:{IsNoInput:true}
                // },
                pnPayment:{title:'',attr:"class='col-md-12'"
                    ,input:{IsNoInput:true}
                },
                
                // _______1:{title:'',attr:"class='col-md-12' style='margin:0'"
                //     ,input:{IsNoInput:true}
                // },
                // pnPayEx:{title:'',attr:"class='col-md-12'"
                //     ,input:{IsNoInput:true}
                // },
                // strPaidRemark:{title:'Remark',isRequire:false,attr:"class='col-md-12'",IsRtn:true
                //     ,input:{type:'textarea',classEx:'form-control',attr:'rows="5" '}//====> Có Attr ckeditor sẽ hiển thị CK Editor
                // }
            }
    
            pngPn.getForm({
                action: 1,
                objInput: Obj_FormInput,
                idOrClass: IdOrClass_Pn,
                objDetail: Obj_Payment,
            })

            // Arr_OrderBookingByAgentHost.forEach(function(value,key){
            //     $('.pnElm-pnTotalPayment',IdOrClass_Pn).append(`
            //         <div class="${value.strPassengerOrderByAgentHostGUID}"></div>
            //     `)
            //     GetAgentHostItem(value,IdOrClass_Pn+' .pnElm-pnTotalPayment .'+value.strPassengerOrderByAgentHostGUID)
            // })

            Arr_ListAgentHost.forEach(function(value){
                $('.pnElm-pnTotalPayment',IdOrClass_Pn).append(`
                    <div class="${value.strCompanyGUID}"></div>
                `)
                GetAgentHostItem(value,IdOrClass_Pn+' .pnElm-pnTotalPayment .'+value.strCompanyGUID)
            })


            function GetAgentHostItem(_objDetail,_idOrClass){
                var IdOrClass_Pn = _idOrClass

                _objDetail['dblPricePayment'] = 0
                // Arr_PaymentTerm.forEach(function(value){
                //     if(value.strPassengerOrderByAgentHostGUID.toLowerCase() == _objDetail.strPassengerOrderByAgentHostGUID.toLowerCase()){
                //         _objDetail['dblPricePayment']+= value['dblPriceCharge']
                //     }
                // })
                

                // png.postListApiGetValue({
                //     objList_Api: ObjList_Api
                //     ,objListApi_RtnVal: {
                //         'GetReportCommissionByAgentHost':{
                //             objParams_Cus:{
                //                 strCompanyGUID: _objDetail.strCompanyGUID
                //                 ,strOrder:'dblPayableBalance desc'
                //             }
                //             ,OnSuccess: function(data){
                //                 _objDetail['arrListCom'] = JSON.parse(data)[0]

                //                 var dblTotalPricePayment = 0
                //                 _objDetail['arrListCom'].forEach(function(value) {
                //                     dblTotalPricePayment+= value['dblPayableBalance']
                //                     if( _objDetail['dblPricePayment'] >=  (dblTotalPricePayment - value['dblPayableBalance']))
                //                         value.IsEnableInput = 1
                //                 })

                //             }
                //         }
                //     }
                //     ,OnSuccessList:function(data){
                //     }
                // })

                var strHtml = ''
                if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length)
                    strHtml = `
                        <div class="pn-padding-b-15">
                            <b>Tổng số Pax:</b> ${Obj_SuppDetail.objSearchDtl.intNoAdult+Obj_SuppDetail.objSearchDtl.arrChildren.length} (<b><i class="fa fa-male"></i></b> ${Obj_SuppDetail.objSearchDtl.intNoAdult} - <b style="font-size:12px"><i class="fa fa-child"></i></b> ${Obj_SuppDetail.objSearchDtl.arrChildren.length})
                        </div>
                    `
                strHtml+= `
                
                    <div class="pn-padding-15" style="border: 1px solid #ccc; border-radius: 1em; padding: 15px; margin-bottom: 15px;">
                        <h4 class="pn-margin-b-15"><i class="fa fa-briefcase"></i> ${_objDetail.strCompanyName}</h4>
                        <div class="pnTable_Ser"></div>
                        <div class="pnListChildAge"></div>
                        <div class="pnListSurcharge"></div>
                        <div class="pnListFOC"></div>
                        <div class="row">
                            <div class="col-md-12">
                            `
                            // strHtml+=`
                            //     <p style="display: flex;align-items: center;justify-content: space-between;">   
                            //         <span>
                            //             <input type="checkbox" class="IsUseCommission chkCustom-1" style="float: left;margin-right: 5px;margin-top: 2px;"> <b>Sử dụng tiền hoa hồng</b> (${$.pngFormatPrice(_objDetail.dblSumPayableBalance)})
                            //         </span>   
                            //         <span class="txtComPricePay"></span>
                            //     </p>
                            //     `
                                strHtml+=`
                                <p style="display: flex;align-items: center;justify-content: space-between;">   
                                    <b>Số tiền dịch vụ còn lại (<a class="intPaymentMethod"></a>)<span class="pnPayNot"></span></b>    
                                    <span class="dblSumRemain"></span>
                                </p>
                                `
                                strHtml+=`
                            </div>
                        </div>

                        <div class="pnForm"></div>
                    </div>
`
                $(IdOrClass_Pn).html(strHtml)

                _objDetail.intPaymentMethodID = Arr_PaymentMethod[0].intID

                var ArrListAccount = []
                $('.intPaymentMethod',IdOrClass_Pn).click(function(){
                    GetPopUp_PayMethod({
                        objDetail:{
                            intPaymentMethodID: _objDetail.intPaymentMethodID,
                            strCompanyBankAccountGUID: _objDetail.strCompanyBankAccountGUID,
                        },
                        ArrListAccount: ArrListAccount,
                        OnSuccess: function(_objRtn){
                            _objDetail = $.pngExtendObj(_objDetail,_objRtn)
                            GetPanelAccount()
                        }
                    })
                })
                
                
                $('.strBankAcc',IdOrClass_Pn).click(function(){
                    GetPopUp_PayMethod({
                        IsBankAcc: true
                    })
                })

                var arr_2 = Arr_ListService.filter(function(item){ return item.strPassengerOrderByAgentHostGUID.toUpperCase() == _objDetail.strPassengerOrderByAgentHostGUID.toUpperCase() })
                
                var objCols = {}

                if(Obj_TourDetail && Object.keys(Obj_TourDetail).length){

                    objCols = {
                        No: { name: '<span langkey="sys_Txt_No"></span>' },
                        strServiceName_View: { name: 'Service name' },
                        // strType: { name: 'Type' },
                        intTotalPax:{name:'Total Pax',strAttrTD:' style="text-align:right"'},
                        // dblTotalCommission_View:{name:'Hoa hồng nhận được',strAttrTD:' style="text-align:right"'},
                        dblPriceTotal_View:{name:'Total price',strAttrTD:' style="text-align:right"'},
                        dblPriceCharge_View:{name:'Tổng giá trả trước',strAttrTD:' style="text-align:right"'},
                    }
                }else if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length){

                    objCols = {
                        No: { name: '<span langkey="sys_Txt_No"></span>' },
                        strServiceName_View: { name: 'Service name' },
                        // strType: { name: 'Type' },
                        intQuantity: { name: 'Quantity' },
                        // dblTotalCommission_View:{name:'Hoa hồng nhận được',strAttrTD:' style="text-align:right"'},
                        dblPriceTotal_View:{name:'Total price',strAttrTD:' style="text-align:right"'},
                        // dblPriceCharge_View:{name:'Tổng giá trả trước',strAttrTD:' style="text-align:right"'},
                    }

                        

                    GetPanel_pnListChildAge(IdOrClass_Pn+' .pnListChildAge',function(){
                        GetUpdTotalPrice()
                        GetUpdTotalPriceAll()
                    })
                    GetPanel_pnListSurcharge(IdOrClass_Pn+' .pnListSurcharge',function(){
                        GetUpdTotalPrice()
                        GetUpdTotalPriceAll()
                    })
                    GetPanel_pnListFOC(IdOrClass_Pn+' .pnListFOC',function(){
                        GetUpdTotalPrice()
                        GetUpdTotalPriceAll()
                    })
                }else{

                    objCols = {
                        No: { name: '<span langkey="sys_Txt_No"></span>' },
                        strServiceName_View: { name: 'Service name' },
                        strType: { name: 'Type' },
                        intQuantity:{name:'Quantity',strAttrTD:' style="text-align:right"'},
                        // dblTotalCommission_View:{name:'Hoa hồng nhận được',strAttrTD:' style="text-align:right"'},
                        dblPriceTotal_View:{name:'Total price',strAttrTD:' style="text-align:right"'},
                        dblPriceCharge_View:{name:'Tổng giá trả trước',strAttrTD:' style="text-align:right"'},
                    }
                }

                pngPn.getTable2({
                    objApi:null
                    ,objParams_Cus:null
    
                    ,editRltArr: function(_arr,_arrAll){
                        return arr_2
                    }
                    ,editRlt: function(value,key){
                        value['No'] = (key+1)
                        // value['strIsPassengerBooked_View'] = (value['IsPassengerBooked']?1:0)
                        
                        // value['strGroupName_View'] = (value['strGroupName'] || '')+(value['IsPassengerBooked']? '<div><i>(Book from Traveller)</i></div>':'')
    
                        // value['strDtmDateFromDateTo'] = $.pngFormatDateTime(value.dtmDateFrom) + ' - ' + $.pngFormatDateTime(value.dtmDateTo)
                        // value['dblPriceTotal_View'] = $.pngFormatPrice(value.dblPriceTotal)
                    
                        // var strUrl = coreLoadPage.getUrlHost()
                        // strUrl = $.pngGetQSVal('cname', $.pngGetQSVal('cname'),strUrl)
                        // strUrl = $.pngGetQSVal('page', 'order',strUrl)
                        // strUrl = $.pngGetQSVal('GUID', value.strOrderBookingGUID,strUrl)
                        // value['strHtmlAction'] = ''
                        // value['strHtmlAction']+= '<div><a class="btn btn-texticon" href="'+strUrl+'"><i class="fa fa-eye"></i><span>'+pngElm.getLangKey({langkey:'sys_Txt_ViewDetail'})+'</span></a></div>'
                        
                        var dblPriceCharge=null
                        _objDetail['dtmDateLine'] = null

                        if(Obj_TourDetail && Object.keys(Obj_TourDetail).length){
                            Arr_OrderPaymentTerm.forEach(function(value_2){
                        
                                var strFromDate = moment(Obj_TourDetail.dtmDateFrom).add('days', 0 - value_2.intDayTo).format('l')
                                var strToDate = moment(Obj_TourDetail.dtmDateFrom).add('days', 0 - value_2.intDayFrom).format('l')
                                var dblPriceChargeIItem = Obj_TourDetail.dblTotalPrice/100 * value_2['dblPaymentPercentage']
        
                                if(value_2.IsDepositOnBook){
                                    strFromDate = moment().format('l')
                                    strToDate = moment().add(value_2.intHourInHold,'h').format('l')
                                }
                                
                                value_2['strFromDate'] = $.pngFormatDateTime(strFromDate)
                                value_2['strToDate'] = $.pngFormatDateTime(strToDate)
                                value_2['dblPaymentPrice'] = $.pngFormatPrice( dblPriceChargeIItem ) +(value_2.IsDepositOnBook? ' (Deposit)' : '')
                                
                                
                                if( (new Date(moment(strFromDate)) <= new Date(moment().format('l')) && new Date(moment(strToDate)) >= new Date(moment().format('l')) )
                                    || new Date(moment(strToDate)) <= new Date(moment().format('l'))
                                ){
                                    value_2['IsPayment'] = true
                                    dblPriceCharge+= dblPriceChargeIItem
                                    _objDetail['dtmDateLine'] = strToDate
                                }
                            })
                            

                        }else if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length){
                            
                            

                        }else{
                            Arr_OrderPaymentTerm.forEach(function(value_2){
                                if(value_2.strOrderBookingItemGUID.toUpperCase() == value.strPassengerOrderItemGUID.toUpperCase()){
                                    if(dblPriceCharge==null)
                                        dblPriceCharge = 0
                                    dblPriceCharge+=value_2.dblPriceCharge
                                    value['dblPriceTotal_View'] = $.pngFormatPrice(value_2.dblTotalPrice)
                                    _objDetail['dtmDateLine'] = $.pngFormatDateTime(value_2.dtmDateTo,'l')
                                }
                            })
                        }

                        if(dblPriceCharge == null){
                            value['dblPriceCharge'] = 0
                            value['dblPriceCharge_View'] = ''
                        }else{
                                
                            value['dblPriceCharge'] = dblPriceCharge
                            value['dblPriceCharge_View'] = $.pngFormatPrice(dblPriceCharge)
                        }

                    }
                    ,objCols: objCols
                    // ,editTableInput:function(){}
                    , changeCkbMaster: function (IsChecked, intRowID,arrList) {
    
    
                        arr_2 = arrList
                    }
                    ,customEvent: function(_idOrClass_Pn){
    
                    }
                    // ,changeInput:function(){}
                    ,IsViewCheckBoxMain:false
                    ,idOrClass: IdOrClass_Pn+' .pnTable_Ser'
                })


                // $('a',IdOrClass_Pn).click(function(){
                //     var action = $(this).attr('action')

                //     if(action=="ViewListTerm"){
                //         $.ModulePage_OrderStep1_PopUpViewListTerm({
                //             strUserGUID: options.strUserGUID
                //             ,arrPaymentTerm: Arr_PaymentTerm.filter(function(item){ return item.strPassengerOrderByAgentHostGUID.toLowerCase() == _objDetail.strPassengerOrderByAgentHostGUID.toLowerCase() })
                //             ,arrOrderBookingByAgentHost: Arr_OrderBookingByAgentHost.filter(function(item){ return item.strPassengerOrderByAgentHostGUID.toLowerCase() == _objDetail.strPassengerOrderByAgentHostGUID.toLowerCase() })
                //             ,OnSuccess: function () {}
                //         })
                //     }
                // })



                $('.txtTotalCredit',IdOrClass_Pn).html($.pngFormatPrice(DblPriceCharge))
                // $('.txtRemain',IdOrClass_Pn).html($.pngFormatPrice(_objDetail.dblSumPayableBalance))

                _objDetail.dblComPricePay = 0
                $('.txtComPricePay',IdOrClass_Pn).html($.pngFormatPrice(_objDetail.dblComPricePay))
                // $('.txtCreditPricePay',IdOrClass_Pn).html($.pngFormatPrice(0))

                $('.IsUseCommission',IdOrClass_Pn).change(function(){
                    _objDetail.IsUseCommission = this.checked
                    if(this.checked){
                        GetPriceCommission()
                    }else{
                        
                        _objDetail.dblComPricePay = 0
                        $('.txtComPricePay',IdOrClass_Pn).html($.pngFormatPrice(0))
                        // $('.txtRemain',IdOrClass_Pn).html($.pngFormatPrice(_objDetail.dblSumPayableBalance))
                    }




                    GetUpdTotalPrice()
                })

                function GetPriceCommission(){

                    var dblSumPayableBalance = 0
                    _objDetail['arrListCom'].forEach(function(value) {
                        if(value.IsEnableInput == 1){
                            dblSumPayableBalance+=value.dblPayableBalance
                        }
                    });

                    if(dblSumPayableBalance){
                        _objDetail.dblComPricePay = (dblSumPayableBalance > _objDetail.dblPricePayment? _objDetail.dblPricePayment:  dblSumPayableBalance)
    
                        // $('.txtRemain',IdOrClass_Pn).html($.pngFormatPrice(0))
                        $('.txtComPricePay',IdOrClass_Pn).html('<a action="ViewListCom">-'+$.pngFormatPrice(_objDetail.dblComPricePay)+'</a>')
                        $('.txtComPricePay a',IdOrClass_Pn).click(function(){
    
                            GetPopUp_ListCommission({
                                strCompanyGUID: _objDetail.strCompanyGUID,
                                arrListCom: _objDetail.arrListCom,
                                OnSuccess: function(_arr){
                                    _objDetail['arrListCom'] = _arr
                                    GetPriceCommission()
                                    GetUpdTotalPrice()
                                }
                            })
                        })
                    }else{
                        $('.IsUseCommission',IdOrClass_Pn).prop('checked',false).change()
                    }
                }

                setTimeout(function(){
                    GetUpdTotalPrice()
                },100)
                
        
                pngPn.getForm({
                    action: 1,
                    objInput: {
                        pnPayEx2:{title:'',attr:"class='col-md-12' "
                            ,input:{IsNoInput:true}
                        },
                        strPaidRemark:{title:'Lời nhắn riêng',isRequire:false,attr:"class='col-md-12' style=''",IsRtn:true
                            ,input:{type:'text',classEx:'form-control',attr:' '}//====> Có Attr ckeditor sẽ hiển thị CK Editor
                        }
                    },
                    idOrClass: IdOrClass_Pn+' .pnForm',
                    objDetail: {},
                })

                $('.strPaidRemark', IdOrClass_Pn+' .pnForm').change(function(){
                    _objDetail['strPaidRemark'] = this.value
                })

                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetFilterCompanyBankAccount':{
                            objParams_Cus:{
                                strCompanyGUID:_objDetail.strCompanyGUID
                            }
                            , OnSuccess: function(data){
                                ArrListAccount = JSON.parse(data)[0]
                                if(ArrListAccount.length)
                                    _objDetail.strCompanyBankAccountGUID = ArrListAccount[0].strCompanyBankAccountGUID
                                GetPanelAccount()
                            }
                        }
                    }
                })

                function GetPanelAccount(){
                    var strHtml = ''

                    var obj = Arr_PaymentMethod.filter(function(item){ return item.intID == _objDetail.intPaymentMethodID })[0]
                    var arr_2 = ArrListAccount.filter(function(item){ return item.strCompanyBankAccountGUID.toUpperCase() == _objDetail.strCompanyBankAccountGUID.toUpperCase() })
                    if(arr_2.length)
                        strHtml+=obj.strName+'-'+arr_2[0].strNameDisplay
                    $('.intPaymentMethod',IdOrClass_Pn).html(strHtml)


                    $('.pnPayNot',IdOrClass_Pn).html('<div style="font-size: 12px;color: red;">Bạn sẽ thanh toán trước '+$.pngFormatDateTime(moment().add(1,'days').format('l'))+' 23:59:59 để hoàn thành quá trình book đặt</div>')

                    

                    // strHtml=''
                    // strHtml+='<b>Chọn tài khoản:</b> '
                    // strHtml+= '<select class="form-control" style="width:inherit; display:inline-block">'
                    // ArrListAccount.forEach(function(value){
                    //     strHtml+= '<option value="'+value.strCompanyBankAccountGUID+'">'+value.strNameDisplay+'</option>'
                    // })
                    // strHtml+='</select>'
                    // strHtml+='<div id="pnCnt" class="pn-margin-t-15"></div>'
                    // $('.pnElm-pnPayEx2', IdOrClass_Pn+' .pnForm').html(strHtml)


                    // $('.pnElm-pnPayEx2', IdOrClass_Pn+' .pnForm').find('select').change(function(){
                    //     var self = this
                    //     _objDetail['strCompanyBankAccountGUID'] = this.value
                    //     var obj = ArrListAccount.filter(function(item){ return item.strCompanyBankAccountGUID == self.value })[0]

                    //     strHtml =''
                    //     strHtml+='<b>Account Name:</b> '+obj.strCompanyBankAccountName
                    //     strHtml+='<br><b>Account Code:</b> '+obj.strCompanyBankAccountCode
                    //     strHtml+='<br><b>Bank Name:</b> '+obj.strCompanyBankAccountInfo
                    //     strHtml+='<br><b>Bank Add:</b> '+obj.strBankAddress
                    //     strHtml+='<br><b>SwiftCode:</b> '+obj.strSwiftCode
                    //     $('.pnElm-pnPayEx2 #pnCnt', IdOrClass_Pn+' .pnForm').html(strHtml)

                    // }).change()
                }

                    
                function GetUpdTotalPrice(){
                    var dblPricePayment = 0
                    var dblPriceCom = 0
                    var dblComPricePay = 0
                    if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length){

                        var dblTotalPrice_All = Obj_SuppDetail.dblTotalPrice
                        dblPriceCom = Obj_SuppDetail.dblTotalComPrice
    
                        if(Arr_Surcharge && Arr_Surcharge.length){
                            var arr = Arr_Surcharge.filter(function(item) { return item.IsEnableInput })
            
                            
                            Obj_SuppDetail['arrSurcharge'] = arr
            
                            arr.forEach(function(value){
                                dblTotalPrice_All+=value.dblTotalPrice
                            })
                        }
                        
                        if(Arr_ListChild && Arr_ListChild.length){
                            
                            var arr = Arr_ListChild.filter(function(item) { return item.IsEnableInput })
            
                            
                            Obj_SuppDetail['arrChildAge'] = arr
            
                            arr.forEach(function(value){
                                dblTotalPrice_All+=(value.dblTotalPrice || 0)
                                dblPriceCom+=(value.dblTotalComPrice || 0)
                            })
                        }
            
                        if(Arr_ListFOCUse && Arr_ListFOCUse.length){
                            
                            Arr_ListFOCUse.forEach(function(value){
                                if(value.IsActive)
                                    dblTotalPrice_All+=(value.dblTotalPrice || 0)
                            })
                        }
    
    
                        Arr_OrderPaymentTerm.forEach(function(value_2){
                    
                            var strFromDate = moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckIn).add('days', 0 - value_2.intDayTo).format('l')
                            var strToDate = moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckIn).add('days', 0 - value_2.intDayFrom).format('l')
                            var dblPriceChargeIItem = dblTotalPrice_All/100 * value_2['dblPaymentPercentage']
    
                            if(value_2.IsDepositOnBook){
                                strFromDate = moment().format('l')
                                strToDate = moment().add(value_2.intHourInHold,'h').format('l')
                            }
                            
                            value_2['strFromDate'] = $.pngFormatDateTime(strFromDate)
                            value_2['strToDate'] = $.pngFormatDateTime(strToDate)
                            value_2['dblPaymentPrice'] = $.pngFormatPrice( dblPriceChargeIItem ) +(value_2.IsDepositOnBook? ' (Deposit)' : '')
                            
                            // if(dblPriceCharge==null)
                            //         dblPriceCharge = 0
                            
                            if( (
                                    (new Date(moment(strFromDate)) <= new Date(moment().format('l')) && new Date(moment(strToDate)) >= new Date(moment().format('l')) )
                                    || new Date(moment(strToDate)) <= new Date(moment().format('l'))
                                )
                                && value_2.IsInstantTerm
                            ){
                                value_2['IsPayment'] = true
                                dblPricePayment+= dblPriceChargeIItem
                                // _objDetail['dtmDateLine'] = strToDate
                            }
                        })
                        
    
                    }else{

                        arr_2.forEach(function(value){
                            dblPricePayment+=value.dblPriceCharge
                            
                            if( (value.strSupplierGUID && value.IsMaster) || !value.strSupplierGUID )
                                dblPriceCom+=value.dblPriceTotalAgentCom
                        })
                    }

                    _objDetail.dblPricePayment = dblPricePayment
                    _objDetail.dblPriceCom = dblPriceCom
                    // Arr_OrderBookingByAgentHost.forEach(function(value,key){
                    //     dblPricePayment+= value.dblPricePayment
                    //     dblComPricePay+= value.dblComPricePay

                    //     $('.txtRemain',IdOrClass_Pn+' .pnElm-pnTotalPayment .'+value.strPassengerOrderByAgentHostGUID).html($.pngFormatPrice(value.dblPricePayment - value.dblComPricePay))
                    // })

                    $('.dblSumComPay',IdOrClass_Pn).html('<b>'+(dblComPricePay? '-'+$.pngFormatPrice(dblComPricePay): $.pngFormatPrice(0) ) + '</b>' )
                    $('.dblSumRemain',IdOrClass_Pn).html('<a id="btnViewListPay"><b>'+$.pngFormatPrice(dblPricePayment-dblComPricePay) +'</b></a>' )

                    $('#btnViewListPay',IdOrClass_Pn).click(function(){
                        GetPopUp_ListPayment()
                    })
                }

            }

            


            if(Obj_PaymentAmountAndPeriod['IsPayment']){
                $('.pnElm-IsPayment',IdOrClass_Pn).parent().hide()
            }else{
                $('.pnElm-IsPayment',IdOrClass_Pn).parent().show()

                Obj_Payment['dtmInvoiceDeadline'] = null
                Obj_Payment['dblPricePayment'] = null

                $('#btnPayment',IdOrClass_Main).attr('disabled',false)
                $('.intPaymentMethodID,.pnElm-pnPayEx2',IdOrClass_Pn).parent().hide()
                // $('.IsPayment',IdOrClass_Pn).change(function(){
                    
                //     if(this.checked){
                //         Obj_Payment['dtmInvoiceDeadline'] = $.pngFormatDateTime(Obj_PaymentAmountAndPeriod['dtmDateDeadline'],'l')
                //         Obj_Payment['dblPricePayment'] = Obj_PaymentAmountAndPeriod['dblPriceCharge']

                //         $('.intPaymentMethodID,.pnElm-pnPayEx',IdOrClass_Pn).parent().show()
                //         $(".intPaymentMethodID",IdOrClass_Pn).change()
                //     }else{
                        
                //         Obj_Payment['dtmInvoiceDeadline'] = null
                //         Obj_Payment['dblPricePayment'] = null

                //         $('#btnPayment',IdOrClass_Main).attr('disabled',false)
                //         $('.intPaymentMethodID,.pnElm-pnPayEx',IdOrClass_Pn).parent().hide()
                //     }
                // }).change()
            }
            strHtml = '<div class="pn-padding-15" style="border: 1px solid #ccc; border-radius: 1em; padding: 15px; ">'
            strHtml+= '<h3 style="margin: 0 0 20px; ">Payment</h3>'
            // if(Obj_PaymentAmountAndPeriod['IsPayment']){
                //  strHtml+=`
                //     <p style="display: flex;align-items: center;justify-content: space-between;">   
                //         <b class="pn">
                //             Tổng tiền các dịch vụ phải trả:
                //         </b>   
                //         <b class="dblSumTotalPrice">${$.pngFormatPrice(100000)}</b>
                //     </p>
                //     `
                    strHtml+=`
                    <p style="display: flex;align-items: center;justify-content: space-between;">   
                        <b class="pn">
                            Tổng tiền cấn trừ
                        </b>   
                        <b class="dblSumClearing">${$.pngFormatPrice(0)}</b>
                    </p>
                    
                    <p style="display: flex;align-items: center;justify-content: space-between;">   
                        <b class="pn">
                            Tổng thanh toán
                        </b>   
                        <b class="dblTotalPayment">${$.pngFormatPrice(100000)}</b>
                    </p>
                    
                
        `
            // }else{
            //     strHtml+=`Các dịch vụ chưa đến thời hạn trả tiền.`// Bạn có muốn đặt luôn không?`
            // }
            strHtml+= '</div>'

            $('.pnElm-pnPayment',IdOrClass_Pn).html(strHtml)


            setTimeout(function(){
                GetUpdTotalPriceAll()
            },100)
            function GetUpdTotalPriceAll(){
                var dblPricePayment = 0
                var dblSumClearing = 0
                var dblSumComPay = 0

                Arr_ListAgentHost.forEach(function(value){
                    dblPricePayment+=value.dblPricePayment
                    // if( (value.strSupplierGUID && value.IsMaster) || !value.strSupplierGUID )
                        dblSumComPay+=value.dblPriceCom
                })

                $('.pnElm-pnPayment .dblSumTotalPrice',IdOrClass_Pn).html($.pngFormatPrice(dblPricePayment))

                if(dblSumClearing){
                    $('.pnElm-pnPayment .dblSumClearing',IdOrClass_Pn).parent().show()
                    $('.pnElm-pnPayment .dblSumClearing',IdOrClass_Pn).html($.pngFormatPrice(dblSumClearing))
                }else{
                    $('.pnElm-pnPayment .dblSumClearing',IdOrClass_Pn).parent().hide()
                }

                $('.pnElm-pnPayment .dblSumComPay',IdOrClass_Pn).html($.pngFormatPrice(dblSumComPay))
                
                $('.pnElm-pnPayment .dblTotalPayment',IdOrClass_Pn).html($.pngFormatPrice(dblPricePayment-dblSumClearing))

                // Arr_OrderBookingByAgentHost.forEach(function(value,key){
                //     dblPricePayment+= value.dblPricePayment
                //     dblComPricePay+= value.dblComPricePay

                //     $('.txtRemain',IdOrClass_Pn+' .pnElm-pnTotalPayment .'+value.strPassengerOrderByAgentHostGUID).html($.pngFormatPrice(value.dblPricePayment - value.dblComPricePay))
                // })

                // $('.pnElm-pnPayment .dblSumComPay',IdOrClass_Pn).html((dblComPricePay? '-'+$.pngFormatPrice(dblComPricePay): $.pngFormatPrice(0) ))
                // $('.pnElm-pnPayment .dblSumRemain',IdOrClass_Pn).html($.pngFormatPrice(dblPricePayment-dblComPricePay))

            }


        }

        objEvtPanel.pnCustomer =  function(_idOrClassPn){
            var IdOrClass_Pn = _idOrClassPn

            Obj_FormInput =  {
                intSaluteID:{title:'<span langkey="pg_Dft_TC_OrDtl_Salute"></span>',isRequire:true,attr:"class='col-md-3'",IsRtn:true
                    ,input:{type:'select',classEx:'form-control',attr:''}
                    ,dropDown:{arrList:Arr_Salute_Ddl}
                }
                ,strPassengerFirstName: {title: pngElm.getLangKey({langkey:'sys_Txt_FirstName'}),isRequire:true,attr:"class='col-md-3'",IsRtn:true
                    ,input:{type:'text',classEx:'form-control',attr:''}
                }
                ,strPassengerLastName: {title: pngElm.getLangKey({langkey:'sys_Txt_LastName'}),isRequire:true,attr:"class='col-md-3'",IsRtn:true
                    ,input:{type:'text',classEx:'form-control',attr:''}
                }
                ,strCountryGUID:{title:'<span langkey="pg_Dft_TC_OrDtl_Country"></span>',isRequire:true,attr:"class='col-md-3'",IsRtn:true
                        ,input:{type:'text',classEx:'require',attr:' style="width:100%" placeholder="'+pngElm.getLangKey({langkey:'sys_Txt_DdlSelectVal-Country'})+'"'}
                        ,dropDown:{Select2:{IsMultiple:false}, arrList:Arr_Country_Ddl}
                }
                ,intAgeID:{title:'<span langkey="pg_Dft_TC_OrDtl_Age"></span>',isRequire:true,attr:"class='col-md-3'",IsRtn:true
                        ,input:{type:'select',classEx:'form-control',attr:''}
                        ,dropDown:{arrList: Arr_Age_Ddl}
                }
                ,dtmPassengerBirthday: {title:'<span langkey="pg_Dft_TC_OrDtl_DateOfBirth"></span>',isRequire:false,attr:"class='col-md-3'",IsRtn:true
                        ,input:{type:'text',classEx:'form-control',attr:''}
                        ,datePicker:{todayHighlight: true,format: 'dd/mm/yyyy',startDate: null, endDate: moment().add('years', -18).format('DD/MM/YYYY')}
                }
                ,strPassengerEmail:{title:'Email',isRequire:false,attr:"class='col-md-3'",IsRtn:true
                        ,input:{type:'text',classEx:'form-control',attr:''}
                        ,validate:{format:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/}
                }
                ,strPassengerPhone: {title: pngElm.getLangKey({langkey:'sys_Txt_PhoneNumber'}),isRequire:false,attr:"class='col-md-3'",IsRtn:true
                        ,input:{type:'text',classEx:'form-control',attr:''}
                        ,validate:{format: /^([+]\d{2})?\d{9,15}$/}
                }
                ,strPassengerRemark: {title:'<span langkey="pg_Dft_TC_OrDtl_Remark"></span>',isRequire:false,attr:"class='col-md-12'",IsRtn:true
                        ,input:{type:'textarea',classEx:'form-control',attr:'rows="3" cols="30"'}
                }
            }


                
            var strHtml = ''
            
            // strHtml+='<h3 class="pn-margin-t-30 pn-margin-b-15"><b>Danh sách khách hàng</b></h3>'
            strHtml+='<div class="pn-padding-15" style="border: 1px solid #ccc; border-radius: 1em; padding: 15px; margin-bottom: 15px;">'
                strHtml+='<div class="pnCus" data="0" style="">'
                    strHtml+='<h3 style="margin: 0 0 20px; display:inline-block;">Liên lạc chính</h3>'
                    strHtml+='<div style="display: inline-flex; margin-left: 15px;">'
                    strHtml+='<input id="chkIsTraveller" type="checkbox" class="chkCustom-1"> <span style="padding: 4px;">Là khách du lịch</span>'
                    strHtml+='</div>'
                    strHtml+='<div class="pnForm"></div>'
                strHtml+='</div>'
                // strHtml+='<div id="pnCusNoMain" class="pn-margin-b-15"></div>'
                // strHtml+='<div>'
                // strHtml+='    <button class="btn btn-texticon bg-success txt-white" id="btnAddCustomer"><i class="fa fa-plus"></i><span langkey="pg_Dft_TC_OrDtl_btn-AddCustomer"></span></button>'
                // strHtml+='    <button class="btn btn-texticon bg-primary txt-white" id="btnSaveCustomer"><i class="fa fa-floppy-o"></i><span langkey="sys_Btn_Save"></span></button>'
                // strHtml+='</div>'
            strHtml+='</div>'

            $(IdOrClass_Pn).html(strHtml)

            $('#chkIsTraveller',IdOrClass_Pn).prop('checked',true)
                
            pngPn.getForm({
                action: 1,
                objInput: Obj_FormInput,
                idOrClass: IdOrClass_Pn + ' .pnCus[data="0"] .pnForm',
                objDetail: {},
            })
            $(IdOrClass_Pn + ' .pnCus[data="0"]').find('.intAgeID').attr('disabled',true)

            var Dtm_OrderBkDateFrom = moment().format('l')

            $(IdOrClass_Pn).find('.intAgeID').change(function(){
                var data = $(this).parents('.pnCus').attr('data')     
                var idOrClassPn = IdOrClass_Pn + " .pnCus[data="+data+"]"
                
                var self = this
                $(idOrClassPn+' .intPassengerAges').change(function(){
                    var data = $(this).attr('data')
                    if(self.value == 4){
                        var dtmStartDate = moment(Dtm_OrderBkDateFrom).add('years', -this.value-1).add('days', 1).format('DD/MM/YYYY')
                        var dtmEndDate = moment(Dtm_OrderBkDateFrom).add('years', -this.value).format('DD/MM/YYYY')
            
                        // if(Arr_ListTbl[data]['intPassengerAges'] != this.value){
                            
                        //     Arr_ListTbl[data]['intPassengerAges'] = this.value
                            
                        //     $(idOrClassPn+" .dtmPassengerBirthday").val('').change()
                        // }
                        $(idOrClassPn+" .dtmPassengerBirthday").datepicker('setStartDate',dtmStartDate)
                        $(idOrClassPn+" .dtmPassengerBirthday").datepicker('setEndDate',dtmEndDate)
    
                    }
                })
    
                var dtmStartDate,dtmEndDate
    
                var intPassengerAges = null
                // intPassengerAges = Arr_ListTbl[data].intPassengerAges
                // if(intPassengerAges==null)
                //     intPassengerAges=9
    
                if(this.value == 4){
                    $(idOrClassPn+' .intPassengerAges').parent().find('label').css('display','block')
                    $(idOrClassPn+' .intPassengerAges').css('display','inline-block').css('width','50%')
                    $(idOrClassPn+' .intAgeID').css('display','inline-block').css('width','50%')
                    $(idOrClassPn+' .intPassengerAges').show()
                    $(idOrClassPn+' .intPassengerAges').val(intPassengerAges).change()
    
    
                }else{
                    $(idOrClassPn+' .intAgeID').css('width','100%')
                    $(idOrClassPn+' .intPassengerAges').hide()
    
                    dtmStartDate = ''
                    dtmEndDate = moment(Dtm_OrderBkDateFrom).add('years', -18).format('DD/MM/YYYY')
                    // ArrCustomerList[ArrCustomerListNoDelete[data].intKey]['intPassengerAges'] = null
                    
                    $(idOrClassPn+" .dtmPassengerBirthday").datepicker('setStartDate',dtmStartDate)
                    $(idOrClassPn+" .dtmPassengerBirthday").datepicker('setEndDate',dtmEndDate)
    
                }
    
                // if(Arr_ListTbl[data]['intAgeID'] != this.value){
    
                //     $(idOrClassPn+" .dtmPassengerBirthday").val('').change()
                // }
    
            }).change()

        }

        objEvtPanel.pnBtn = function(_idOrClassPn){
            var IdOrClass_Pn = _idOrClassPn

            var strHtml = ''
            // if(Obj_PaymentAmountAndPeriod['IsPayment']){
            //     strHtml+= '<button id="btnPayment" class="btn bg-primary txt-white">Thanh toán</button>'
            // }else{
                strHtml+= '<button id="btnPayment" class="btn bg-primary txt-white" style="float: right">Đặt luôn</button>'
                strHtml+= '<b style="color:red; float: right;line-height: 35px;margin-right: 10px;">Time remaining: <span class="pnTimeRemain"></span></b>'
                // strHtml+= '<button id="btnHold" class="btn bg-warning txt-white">Giữ chỗ</button>'
            // }
            $(IdOrClass_Pn).html(strHtml)

            clearInterval(x);
            
            var distance = 1000*60*10;
            var x = setInterval(function() {
                // Get today's date and time

                // Find the distance between now and the count down date

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element with id="demo"
                $('.pnTimeRemain').html( minutes + "m " + seconds + "s ");

                distance-=1000
                // If the count down is finished, write some text


                if (distance < 0) {
                    location.reload()
                }else{
                }
            }, 1000);

            $('#btnPayment').click(function(){

                
                pngPn.getForm({
                    action: 2,
                    objInput: Obj_FormInput,
                    idOrClass: IdOrClass_Main + ' #pnCustomer',
                    OnChkSuccess: function(objRtn){
                        
                        if(objRtn){
                            $.Confirm({ 
                                strContent: '<span langkey="sys_Cfm_AYS"></span>' 
                                ,OnSuccess: function(){
                                    
                                        Obj_Payment = $.pngExtendObj(Obj_Payment,objRtn)

                                        // png.postListApiGetValue({
                                        //     objList_Api: ObjList_Api
                                        //     ,objListApi_RtnVal: {
                                        //         'GetCheckRemainForServicesBooking':{
                                        //             objParams_Cus: {}
                                        //             , OnSuccess: function(data){ 
                                                        
                                        //                 var obj = JSON.parse(data)[0][0]

                                        //                 // Obj_Payment.strOrderBeforePaymentCode = obj.strOrderBeforePaymentCode
                                        //                 if(obj.IsCheckBooking){
                                        //                     if(Obj_PaymentAmountAndPeriod['IsPayment']){
                                        //                         if(Obj_Payment.intPaymentMethodID == 1){
                                        //                             // if(!options.strCompanyOwnerGUID){
                                        //                                 Obj_Payment['strCompanyBankAccountGUID'] = ''
                                        //                                 Arr_OrderBookingByAgentHost.forEach(function(value){
                                        //                                     Obj_Payment['strCompanyBankAccountGUID']+= value.strOrderAgentHostCode+'!'+value.strCompanyBankAccountGUID+'#'
                                        //                                 })
                                        //                             // }
                                        //                             if(strListPayableBookingItemGUID)
                                        //                                 png.postListApiGetValue({
                                        //                                     objList_Api: ObjList_Api
                                        //                                     ,objListApi_RtnVal: {
                                        //                                         'AddPayableBookingUsed':{
                                        //                                             objParams_Cus: {
                                        //                                                 strListPayableBookingItemGUID: strListPayableBookingItemGUID
                                        //                                             }
                                        //                                             , OnSuccess: function(data){ 

                                        //                                                 var obj = JSON.parse(data)[0][0]
                                        //                                                 if(obj.IsCheckSucc){
                                        //                                                     GetAddBooking()
                                        //                                                 }else{
                                        //                                                     $.Confirm({ strContent: 'You do not have enough Commission.'});
                                        //                                                 }

                                        //                                             }
                                        //                                         }
                                        //                                     }
                                        //                                 })
                                        //                             else{
                                        //                                 GetAddBooking()
                                        //                             }
                                        //                             // GetAddBooking()
                                        //                         }

                                        //                         if(Obj_Payment.intPaymentMethodID == 3){
                                        //                             GetPayOnline()
                                        //                         }

                                        //                         if(Obj_Payment.intPaymentMethodID == 11){
                                                                    
                                        //                             png.postListApiGetValue({
                                        //                                 objList_Api: ObjList_Api
                                        //                                 ,objListApi_RtnVal: {
                                        //                                     'GetCheckRemainCreditByAgent':{
                                        //                                         objParams_Cus: {}
                                        //                                         , OnSuccess: function(data){ 

                                        //                                             var obj = JSON.parse(data)[0][0]
                                        //                                             if(obj.IsCheckCredit){
                                        //                                                 GetAddBooking()
                                        //                                             }else{
                                        //                                                 $.Confirm({ strContent: 'You do not have enough Credit Limit. Your current credit amount is '+$.pngFormatPrice(obj.dblCreditRemain) });
                                        //                                             }

                                        //                                         }
                                        //                                     }
                                        //                                 }
                                        //                             })
                                        //                         }
                                        //                     }else{
                                        //                         Obj_Payment.intPaymentMethodID=null
                                        //                         GetAddBooking()
                                        //                     }
                                        //                 }else{
                                        //                     $.Confirm({ strContent: 'Service: '+obj.strServiceName+' > '+obj.intTotalPaxRemain+' Pax' });
                                        //                 }

                                        //             }
                                        //         }
                                        //     }
                                        // })
                                        GetAddBooking(objRtn)
                                        
                                    }
                                
                                
                            })
                        }
                    }
                })

                function GetAddBooking(_objRtn){
                    
                    if(Obj_TourDetail && Object.keys(Obj_TourDetail).length){
                        GetBookingForTour(_objRtn,OnRtn)
                    }else if(Obj_SuppDetail && Object.keys(Obj_SuppDetail).length){
                        GetBookingForSupp(_objRtn,OnRtn)
                    }else{
                        GetBookingForOrder(_objRtn,OnRtn)
                    }

                    function OnRtn(obj){
                        // png.postSendEmail({
                        //     strUserGUID: null
                        //     ,strEmailsSendTo: null
                        //     ,strEmailsCC: null
                        //     ,strEmailTemplateSubject: null
                        //     ,IsBodyHtml: 1
                        //     ,strEmailTemplateContent: null
                        //     ,strTempApiUrl:'api/system/GetEmailSendAgentHostByAgentBook'
                        //     ,objTempPar:{   
                        //         strUserGUID: options.strUserGUID
                        //         ,strBookingGUID: obj.strBookingGUID
                        //         ,intLangID: $.pngGetLangID()
                        //         ,strEmailTemplateCode:'BKK'
                        //     }
                        //     ,OnSuccess: function (data) {
                                GetLinkBooking()
                        //     }
                        // })

                        function GetLinkBooking(){
                            // if(JSON.parse(png.ArrLS.CompanyFriend.get()).IsTMSConnected){

                            //     png.postListApiGetValue({
                            //         objList_Api: ObjList_Api
                            //         ,objListApi_RtnVal: {
                            //             'GetTourServiceXMLForTMS':{
                            //                 objParams_Cus: {
                            //                     strBookingGUID: obj.strBookingGUID
                            //                 }
                            //                 , OnSuccess: function(data){

                            //                     var arrTbl = JSON.parse(data);
                            //                     var arrXml = {};
                            //                     arrTbl.forEach(function(value,key) {
                            //                         arrXml['strXML'+(key+1)] = '';
                            //                         value.forEach(function(value2) {
                            //                             arrXml['strXML'+(key+1)]+=value2[Object.keys(value2)].replace(/\"/g,'"');
                            //                         });
                            //                     });
                            //                     arrXml['strCompanyGUID'] = options.strCompanyOwnerGUID;
                            //                     //console.log(arrXml)
                            //                     ConnectToTMS.post({
                            //                         strCompanyGUID: options.strCompanyOwnerGUID
                            //                         ,url:'api/b2btransfer/tour/AddOrUpdTourServiceToTMS'
                            //                         ,data:{strJson : JSON.stringify(arrXml)}
                            //                         ,OnSuccess:function(){
                            //                             window.location.href = coreLoadPage.getUrlHost() +'?page=listbooking&status=0'
                            //                         }
                            //                     });
                            //                 }

                            //             }
                            //         }
                            //     })
                            // }else{

                                var strUrl = '/user/'+JSON.parse(png.ArrLS.UserDetail.get()).strUserName+'?strKey=ListBooking&status=0'

                                window.location.href = strUrl
                            // }
                        }
                    }
                }
                
                function GetBookingForOrder(_objRtn, _OnRtn){
                    
                    var strListOrderBookingItemGUID=''
                    var strListCompanyOwnerGUID=''

                    Arr_ListService.forEach(function(value){
                        strListOrderBookingItemGUID+=value.strPassengerOrderItemGUID+','
                    })

                    
                    Arr_ListAgentHost.forEach(function(value){
                        strListCompanyOwnerGUID+=value.strCompanyGUID+'!'+value.intPaymentMethodID+'!'+value.strCompanyBankAccountGUID+'#'
                    })

                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        ,objListApi_RtnVal: {
                            'AddBookingFromOrderByTraveller':{
                                objParams_Cus: $.pngExtendObj(_objRtn,{
                                    intOrderStatusID: 4,
                                    IsTraveller: $('#chkIsTraveller',IdOrClass_Main).is(':checked'),
                                    strListOrderBookingItemGUID: strListOrderBookingItemGUID,
                                    strListCompanyOwnerGUID: strListCompanyOwnerGUID,
                                })
                                , OnSuccess: function(data){ 
                                    var obj = JSON.parse(data)[0][0]

                                    
                                    // png.postSendEmail({
                                    //     strUserGUID: null
                                    //     ,strEmailsSendTo: null
                                    //     ,strEmailsCC: null
                                    //     ,strEmailTemplateSubject: null
                                    //     ,IsBodyHtml: 1
                                    //     ,strEmailTemplateContent: null
                                    //     ,strTempApiUrl:'api/system/GetEmailSendAgentHostByAgentBook'
                                    //     ,objTempPar:{   
                                    //         strUserGUID: options.strUserGUID
                                    //         ,strBookingGUID: obj.strBookingGUID
                                    //         ,intLangID: $.pngGetLangID()
                                    //         ,strEmailTemplateCode:'BKK'
                                    //     }
                                    //     ,OnSuccess: function (data) {
                                            GetLinkBooking()
                                    //     }
                                    // })

                                    function GetLinkBooking(){

                                        var strUrl = '/user/'+JSON.parse(png.ArrLS.UserDetail.get()).strUserName+'?strKey=ListBooking&status=0'

                                        window.location.href = strUrl
                                    }
                                    
                                }
                            }
                        }
                    })
                
                }

                
                function GetBookingForSupp(_objRtn, _OnRtn){
                    
                    var arrSurcharge = []
                    var arrChildAge = []
                    if(Arr_Surcharge && Arr_Surcharge.length){
                        var arr = Arr_Surcharge.filter(function(item) { return item.IsEnableInput })
                        arrSurcharge = arr
                    }
                    
                    if(Arr_ListChild && Arr_ListChild.length){
                        var arr = Arr_ListChild.filter(function(item) { return item.IsEnableInput })
                        arrChildAge = arr
                    }
    
                    
                    var strListItemTypeGUID = ''
                    var strListSupplierChildAgeGUID = ''
                    var strListSurchargeDateGUID = ''

                    strListItemTypeGUID+=Obj_SuppDetail.strItemTypeGUID+'!'+Obj_SuppDetail.intSglDblID+'!'+Obj_SuppDetail.intQuantity+'!'+Obj_SuppDetail.intMealIncludedTypeID+'!'+Obj_SuppDetail.strItemTypeDetailGUID+'!'+Obj_SuppDetail.intChildOptionID+'#'

                    if(arrChildAge && arrChildAge.length){
                        arrChildAge.forEach(function(val){
                            strListSupplierChildAgeGUID+=Obj_SuppDetail.strItemTypeGUID+'!'+val.strSupplierChildAgeGUID+'!'+Obj_SuppDetail.intSglDblID+'!'+val.intQuantity+'#'
                        })

                    }
                    
                    if(arrSurcharge && arrSurcharge.length){
                        arrSurcharge.forEach(function(val){
                            strListSurchargeDateGUID+=Obj_SuppDetail.strItemTypeGUID+'!'+val.strSurchargeDateGUID+'!'+Obj_SuppDetail.intSglDblID+'!'+val.intQuantity+'#'
                        })

                    }

                    var strListChildAge = ''
                    Obj_SuppDetail.objSearchDtl.arrChildren.forEach(function(value){
                        strListChildAge+=value+','
                    })

                    
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        //,objList_ComboValue: ObjList_ComboValue
                        ,objListApi_RtnVal: {
                            'AddBookingFromHotelByTraveller':{
                                objParams_Cus: $.pngExtendObj(_objRtn,{
                                    strPriceLevelGUID: Obj_SuppDetail.strPriceLevelGUID
                                    ,strPriceListGUID: Obj_SuppDetail.strPriceListGUID
                                    ,IsTraveller: $('#chkIsTraveller',IdOrClass_Main).is(':checked')
                                    ,strListItemTypeGUID: strListItemTypeGUID
                                    ,strListSupplierChildAgeGUID: strListSupplierChildAgeGUID
                                    ,strListSurchargeDateGUID: strListSurchargeDateGUID
                                    // ,strListFocGUID: strListFocGUID
                                    ,IsBookNotMinstay: IsBookNotMinstay
                                    ,intAdult: Obj_SuppDetail.objSearchDtl.intNoAdult
                                    ,strListChildAge: strListChildAge
                                    ,dtmDateFrom: Obj_SuppDetail.objSearchDtl.dtmDateCheckIn
                                    ,dtmDateTo : Obj_SuppDetail.objSearchDtl.dtmDateCheckOut

                                    ,intPaymentMethodID: Arr_ListAgentHost[0].intPaymentMethodID
                                    ,strCompanyBankAccountGUID: Arr_ListAgentHost[0].strCompanyBankAccountGUID
                                    ,strRemark : Arr_ListAgentHost[0].strPaidRemark
                                    
                                })
                                ,OnSuccess: function(data){
                                    var obj = JSON.parse(data)[0][0]
                                    
                                    _OnRtn(obj)
                                    

                                    var strUrl = '/user/'+JSON.parse(png.ArrLS.UserDetail.get()).strUserName+'?strKey=ListBooking&status=0'

                                    window.location.href = strUrl
                                }
                            }
                        }
                    })
                
                }

                
                
                function GetBookingForTour(_objRtn, _OnRtn){
                    var strListCompanyOwnerGUID=''
                    
                    Arr_ListAgentHost.forEach(function(value){
                        strListCompanyOwnerGUID+=value.strCompanyGUID+'!'+value.intPaymentMethodID+'!'+value.strCompanyBankAccountGUID+'#'
                    })

                    
                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        //,objList_ComboValue: ObjList_ComboValue
                        ,objListApi_RtnVal: {
                            'AddBookingFromTourByPassenger':{
                                objParams_Cus: $.pngExtendObj(_objRtn,{
                                    intOrderStatusID: 4,
                                    IsTraveller: $('#chkIsTraveller',IdOrClass_Main).is(':checked'),
                                    strListCompanyOwnerGUID: strListCompanyOwnerGUID,
                                    strPaidRemark: Arr_ListAgentHost[0].strPaidRemark
                                })
                                ,OnSuccess: function(data){
                                    var obj = JSON.parse(data)[0][0]
                                    
                                    _OnRtn(obj)
                                    
                                }
                            }
                        }
                    })
                
                }


                function GetPayOnline(){
                    
                    png.postListApiGetValue({           
                        objList_Api: ObjList_Api          
                        ,objListApi_RtnVal: {           
                            'AddPaymentTransactionByAgent':{               
                                objParams_Cus:{
                                    dblPaymentTransactionAmount: Obj_PaymentAmountAndPeriod['dblPriceCharge']
                                    ,strRemark: (Obj_Payment.strPaidRemark || "payment online")
                                }
                                ,OnSuccess: function(data){
                                    var obj = JSON.parse(data)[0][0]
                                    png.postListApiGetValue({           
                                        objList_Api: ObjList_Api           
                                        ,objListApi_RtnVal: {           
                                            'GetUrlPayOnline':{               
                                                objParams_Cus:{
                                                    strOrderBeforePaymentCode: obj['strPaymentTransactionCode']
                                                    ,dblAmount: Obj_PaymentAmountAndPeriod['dblPriceCharge']
                                                    ,strDescription: (Obj_Payment.strPaidRemark || "payment online")
                                                }
                                                ,OnSuccess: function(data){
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
            })

        }

        // ===================================
        
        pngPn.getPanelHtml({            // Get ra panel dạng html
            objPanel: objPanel
            ,objEvtPanel: objEvtPanel
            ,idOrClass: IdOrClass_Main  // Id or class chính
            ,OnChangeIdPn: function(_Fn){
                Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
            }   
        })

    }

    
    function GetPopUp_PayMethod(_Opt){
        var Dft = {
            objDetail: {},
            ArrListAccount: [],
            IsBankAcc:null,
            //IsDuplicate:null,
            OnSuccess: function () {
    
            }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Main = ''

        var Obj_Detail = _Opt.objDetail
        //---------Obj_XXX      // Khai báo các biến dùng chung cho cả hàm
        //---------Arr_XXX
        //---------Is_XXX
        //---------Int_XXX
        //---------Str_XXX

        // if(Object.keys(Obj_Detail).length){
        //     Is_Edit = true
        // }else{
        //     Is_Create = true
        // }
        // if(options.IsDuplicate){
        //     Is_Edit = false
        //     Is_Duplicate = true
        // }
        var Arr_BankAccountGUID = _Opt.ArrListAccount


        //------------------- Khái báo biển chính của giao diện
        var Obj_Filter_Dtl = {}
        var Obj_Filter = {}

        var Obj_FormInput = {}
        var Arr_ListTbl = []

        var Obj_FN_Main = {}
        //---------------
        GetPopUp()
        function GetPopUp(){
            var strTitle = 'Config Payment method'
            // if(Is_Create){
            //     strTitle = pngElm.getLangKey({langkey:'sys_Btn_Create'})
            // }
            
            // if(Is_Edit){
            //     strTitle = pngElm.getLangKey({langkey:'sys_Btn_Edit'})
            // }
            // if(Is_Duplicate){
            //     strTitle = pngElm.getLangKey({langkey:'sys_Btn_Duplicate'})
            // }
            pngPn.getPopUp({
                strTitle: strTitle
                , intTypeSize:1//------------1 small ---2 medium ---3 large
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {
                    //------Chọn sự kiện khi Đóng PopUP
                    // options.OnSuccess.call()
                    // _Opt.OnSuccess.call()
                }
            })
        }
    
        function GetMainPanel(_IdOrClassPp,_OnClosePp){
    
            IdOrClass_Main = _IdOrClassPp
            Obj_FN_Main.OnClosePp = _OnClosePp
    
            //Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
            //Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}
    
    
            var objPanel = {
                pnMain:{tag:'div',attr:'class=""'
                        ,childTags:[{div:'class="row"'}]
                    // ,pnListBtn:{tag:'div',attr:'class="col-md-12"'} 
                    // ,pnFormFilter:{tag:'div',attr:'class="col-md-12"'}
                    // ,pnTable:{tag:'div',attr:'class="col-md-12"'}
                    
                    ,pnForm:{tag:'div',attr:'class="col-md-12"'}
                    ,pnBtn:{tag:'div',attr:'class="col-md-12"'}
                }
            }
            var objEvtPanel = {}
            objEvtPanel.pnForm = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn
                Obj_FormInput = {
                    ///-----------INSERT INPUT
                    intPaymentMethodID:{title:'Payment Method',isRequire:false,attr:"class='col-md-6'",IsRtn:true
                        ,input:{type:'select',classEx:'form-control',attr:''}
                        ,dropDown:{arrList: $.pngGetArrComboValue(Arr_PaymentMethod,'intID','strName') }
                    },

                    strCompanyBankAccountGUID:{title:'Bank Account',isRequire:false,attr:"class='col-md-6'",IsRtn:true
                        ,input:{type:'select',classEx:'form-control',attr:''}
                        ,dropDown:{arrList: $.pngGetArrComboValue(Arr_BankAccountGUID,'strCompanyBankAccountGUID','strNameDisplay') }
                    },
                    pnPayEx2:{title:'',attr:"class='col-md-12' style=''"
                        ,input:{IsNoInput:true}
                    },
                }
        
                pngPn.getForm({
                    action: 1,
                    objInput: Obj_FormInput,
                    idOrClass: IdOrClass_Pn,
                    objDetail: Obj_Detail,
                })

                if(_Opt.IsBankAcc){
                    $('.intPaymentMethodID',IdOrClass_Pn).parent().hide()
                }

                // $('.pnElm-pnAmount',IdOrClass_Pn).html(Dbl_VATAmount)

                // $('input',IdOrClass_Pn).change(function(){
                //     Dbl_VATAmount = Obj_Detail.dblTotalPrice/100*this.value
                //     $('.pnElm-pnAmount',IdOrClass_Pn).html(Dbl_VATAmount)
                // })
                $('.intPaymentMethodID',IdOrClass_Pn).change(function(){
                    if(this.value != 1){
                        $('.strCompanyBankAccountGUID',IdOrClass_Pn).parent().hide()
                    }else{
                        $('.strCompanyBankAccountGUID',IdOrClass_Pn).parent().show()
                    }

                    // $('input',IdOrClass_Pn).attr('disabled',(this.value == 1))
                }).change()

                $('.strCompanyBankAccountGUID',IdOrClass_Pn).change(function(){
                    GetPanelAccount(this.value)
                }).change()
                
                function GetPanelAccount(_strCompanyBankAccountGUID){
                        var obj = Arr_BankAccountGUID.filter(function(item){ return item.strCompanyBankAccountGUID.toUpperCase() == _strCompanyBankAccountGUID.toUpperCase() })[0]

                        strHtml =''
                        strHtml+='<div class="pn-margin-b-15"> '
                        strHtml+='<b>Account Name:</b> '+obj.strCompanyBankAccountName
                        strHtml+='<br><b>Account Code:</b> '+obj.strCompanyBankAccountCode
                        strHtml+='<br><b>Bank Name:</b> '+obj.strCompanyBankAccountInfo
                        strHtml+='<br><b>Bank Add:</b> '+obj.strBankAddress
                        strHtml+='<br><b>SwiftCode:</b> '+obj.strSwiftCode
                        strHtml+='</div> '

                        $('.pnElm-pnPayEx2 ', IdOrClass_Pn).html(strHtml)

                }
    
            }
            objEvtPanel.pnBtn = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn
    
                var strHtml = ''
                    strHtml+='<button id="btnSave" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-floppy-o"></i><span>'+pngElm.getLangKey({langkey:'sys_Btn_Save'})+'</span></button>'
                $(IdOrClass_Pn).html(strHtml)
    
                $(IdOrClass_Pn+ ' #btnSave').click(function(){
                    pngPn.getForm({
                        action: 2,
                        objInput: Obj_FormInput,
                        idOrClass: IdOrClass_Main + ' #pnForm',
                        OnChkSuccess: function(objRtn){
                            if (objRtn) {
    
                                // objRtn = $.pngExtendObj(Obj_Detail,objRtn)
                                
                                if(objRtn.intPaymentMethodID != 1)
                                    objRtn.strCompanyBankAccountGUID = null
                                
                                Obj_FN_Main.OnClosePp(false,true)
                                _Opt.OnSuccess.call(this,objRtn)
                            }
                            
                            
                        }
                    })
                })
            }
            // ===================================
            
            pngPn.getPanelHtml({            // Get ra panel dạng html
                objPanel: objPanel
                ,objEvtPanel: objEvtPanel
                ,idOrClass: IdOrClass_Main  // Id or class chính
                ,OnChangeIdPn: function(_Fn){
                    Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
                }   
            })
            
            
    
        }
    }

    
    function GetPopUp_ListCommission(_Opt){
        var Dft = {
            strCompanyGUID: null,
            arrListCom: null,
            OnSuccess: function () {
    
            }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Main = ''

            
        //---------Obj_XXX      // Khai báo các biến dùng chung cho cả hàm
        //---------Arr_XXX
        //---------Is_XXX
        //---------Int_XXX
        //---------Str_XXX

        

        //------------------- Khái báo biển chính của giao diện
        var Obj_Filter_Dtl = {}
        var Obj_Filter = {}

        // var Obj_FormInput = {}
        var Arr_ListTbl = JSON.parse(JSON.stringify(_Opt.arrListCom))

        var Obj_FN_Main = {}
        //-------------------
        

        GetPopUp()

        function GetPopUp(){
            var strTitle = 'Danh sách hoa hồng'
            pngPn.getPopUp({
                strTitle: strTitle
                , intTypeSize:1//------------1 small ---2 medium ---3 large
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {
                    //------Chọn sự kiện khi Đóng PopUP
                }
            })
        }
    
        function GetMainPanel(_IdOrClassPp,_OnClosePp){
    
            IdOrClass_Main = _IdOrClassPp
            Obj_FN_Main.OnClosePp = _OnClosePp
    
            // _Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
            // _Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}
    
    
            var objPanel = {
                pnMain:{tag:'div',attr:'class=""'
                        ,childTags:[{div:'class="row"'}]
                    ,pnTable:{tag:'div',attr:'class="col-md-12"'}
                    ,pnBtn:{tag:'div',attr: 'class="col-md-12"'}
                }
            }
            var objEvtPanel = {}
            objEvtPanel.pnTable = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn
                
                // setTimeout(function(){
                //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',true)
                // },100)
                
                pngPn.getTable2({
                    objApi:null
                    ,objParams_Cus:null
                    ,objCols:  {
                        No:{name:'No.',IsViewInputWhenCheck:true
                        }
                        // , strAgentName: { name: 'Tên Đại lý' }
                        , strOrderAgentHostCode_View: { name: 'Mã Booking/Group Name' }
                        , strServiceName: { name: 'Tên dịch vụ'}
                        // , strGroupName: { name: 'Group Name' }
                        , dtmDateFromTo_View: { name: 'Ngày bắt đầu - Ngày kết thúc' }
                        // , dtmDateTo_View: { name: 'Ngày kết thúc' }
                        , intTotalPax: { name: 'Tổng số Pax'}
                        , dblPayableBalance_View: { name: 'Số tiền còn lại', strAttrTD:' style="text-align:right"'}
                    }
                    ,editRltArr: function(arr){
                    	return Arr_ListTbl
                    }
                    ,editRlt: function(value,key){

                        value['No']=(key+1)
                        value['strOrderAgentHostCode_View'] = '<a href="/?page=bookingdetail&BKID='+value['strBookingGUID']+'" target="_Booking">'+value['strOrderAgentHostCode']+'/'+value['strGroupName']+'</a>'
    
                        value['dtmDateFromTo_View'] = $.pngFormatDateTime(value['dtmDateFrom'],'DD MMM YYYY') + ' - ' +  $.pngFormatDateTime(value['dtmDateTo'],'DD MMM YYYY')
                        // value['dtmDateTo_View'] = $.pngFormatDateTime(value['dtmDateTo'])
                        value['dblPriceTotal_View'] = $.pngFormatPrice(value['dblPriceTotal'])
                        value['dblPayableBalance_View'] = $.pngFormatPrice(value['dblPayableBalance'])
                        value['dblPaid_View'] = $.pngFormatPrice(value['dblPaid'])
                    }
                    ,customEvent:function(idOrClassPn){
                        
                    }
                    ,changeCkbMaster: function (IsChecked, intRowID, arrList) {
                        // if (IsChecked)
                        //     $(IdOrClass_Pn + ' tr[row=' + intRowID + '] td').css('background', '#e7eefb')
                        // else
                        //     $(IdOrClass_Pn + ' tr[row=' + intRowID + '] td').removeAttr('style')
            
            
                        // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                        //     $(IdOrClass_MainItem+ " .viewSave>span.intITs").text('')
                        //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',true)
                        // }else{
                        //     $(IdOrClass_MainItem+ " .viewSave>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ')')
                        //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',false)
                        // }
        
                        Arr_ListTbl = arrList;
                    }
                    ,IsViewCheckBoxMain:true
                    ,idOrClass:IdOrClass_Pn 
                })


    
            }
            objEvtPanel.pnBtn = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn
    
                var strHtml = ''
                    strHtml+='<button id="btnSave" class="viewSave btn btn-texticon bg-primary txt-white"><i class="fa fa-floppy-o"></i><span>Save</span><span class="intITs"></span></button>'
                $(IdOrClass_Pn).html(strHtml)
    
                $('#btnSave').click(function(){
                    _Opt.OnSuccess.call(this,Arr_ListTbl)
                    Obj_FN_Main.OnClosePp(false,true)
                })
            }
            // ===================================
            
            pngPn.getPanelHtml({            // Get ra panel dạng html
                objPanel: objPanel
                ,objEvtPanel: objEvtPanel
                ,idOrClass: IdOrClass_Main  // Id or class chính
                ,OnChangeIdPn: function(_Fn){
                    Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
                }   
            })
            
            
    
        }
    }

    
    function GetPopUp_ListPayment(_Opt){
        var Dft = {
            OnSuccess: function () {
    
            }
        }
        _Opt = $.extend(Dft, _Opt);

        var IdOrClass_Main = ''

            
        //---------Obj_XXX      // Khai báo các biến dùng chung cho cả hàm
        //---------Arr_XXX
        //---------Is_XXX
        //---------Int_XXX
        //---------Str_XXX

        

        //------------------- Khái báo biển chính của giao diện
        var Obj_Filter_Dtl = {}
        var Obj_Filter = {}

        // var Obj_FormInput = {}

        var Obj_FN_Main = {}
        //-------------------
        

        GetPopUp()

        function GetPopUp(){
            var strTitle = 'List payment term'
            pngPn.getPopUp({
                strTitle: strTitle
                , intTypeSize:1//------------1 small ---2 medium ---3 large
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {
                    //------Chọn sự kiện khi Đóng PopUP
                }
            })
        }
    
        function GetMainPanel(_IdOrClassPp,_OnClosePp){
    
            IdOrClass_Main = _IdOrClassPp
            Obj_FN_Main.OnClosePp = _OnClosePp
    
            // _Obj_FN_Main.OnClosePp(true)----------- chạy câu lệnh trong OnClosePopUp: function (){} khi tắt PopUp
            // _Obj_FN_Main.OnClosePp(true,true)-----------Đóng Pop Up + chạy câu lệnh trong OnClosePopUp: function (){}
    
    
            var objPanel = {
                pnMain:{tag:'div',attr:'class=""'
                        ,childTags:[{div:'class="row"'}]
                    ,pnTable:{tag:'div',attr:'class="col-md-12"'}
                }
            }
            var objEvtPanel = {}
            objEvtPanel.pnTable = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn
                
                // setTimeout(function(){
                //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',true)
                // },100)
                
                pngPn.getTable2({
                    objApi:null
                    ,objParams_Cus:null
                    ,objCols:  {
                        No:{name:'No.',IsViewInputWhenCheck:true
                        }
                        , strServiceName: { name: 'Service name'}
                        // , strGroupName: { name: 'Group Name' }
                        , dtmDateFromTo_View: { name: 'Date from - Date To' }
                        // , dtmDateTo_View: { name: 'Ngày kết thúc' }
                        , dblPriceCharge_View: { name: 'Price Charge ', strAttrTD:' style="text-align:right"'}
                    }
                    ,editRltArr: function(arr){
                    	return Arr_OrderPaymentTerm
                    }
                    ,editRlt: function(value,key){

                        value['No']=(key+1)
                        value['dtmDateFromTo_View'] = $.pngFormatDateTime(value['dtmDateFrom'],'DD MMM YYYY') + ' - ' +  $.pngFormatDateTime(value['dtmDateTo'],'DD MMM YYYY')
                       
                        value['dblPriceCharge_View'] = $.pngFormatPrice(value['dblPriceCharge'])
                    }
                    ,customEvent:function(idOrClassPn){
                        
                    }
                    ,changeCkbMaster: function (IsChecked, intRowID, arrList) {
                        // if (IsChecked)
                        //     $(IdOrClass_Pn + ' tr[row=' + intRowID + '] td').css('background', '#e7eefb')
                        // else
                        //     $(IdOrClass_Pn + ' tr[row=' + intRowID + '] td').removeAttr('style')
            
            
                        // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                        //     $(IdOrClass_MainItem+ " .viewSave>span.intITs").text('')
                        //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',true)
                        // }else{
                        //     $(IdOrClass_MainItem+ " .viewSave>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ')')
                        //     $(IdOrClass_MainItem+ " .viewSave").attr('disabled',false)
                        // }
        
                        // Arr_ListTbl = arrList;
                    }
                    ,IsViewCheckBoxMain:false
                    ,idOrClass:IdOrClass_Pn 
                })


    
            }
            // ===================================
            
            pngPn.getPanelHtml({            // Get ra panel dạng html
                objPanel: objPanel
                ,objEvtPanel: objEvtPanel
                ,idOrClass: IdOrClass_Main  // Id or class chính
                ,OnChangeIdPn: function(_Fn){
                    Obj_FN_Main.pnMain = _Fn    // Hàm đổi trang
                }   
            })
            
            
    
        }
    }

    
    function GetPanel_pnListChildAge(_idOrClassPn,_OnUpdTotalPrice){
        var IdOrClass_Pn = _idOrClassPn

        var IntNoOfNight = moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckOut).diff(moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckIn),'days')
        



        if(  Arr_ListChild.length){

            var strIn = ''
            if(Obj_SuppDetail.objSearchDtl.arrChildren.length){
                strIn = ' in'
            }
            var strHtml_Age = ''
            Arr_ListChildAge.forEach(function(value){
                strHtml_Age+=value+' tuổi, '
            })

            strHtml_Age = (strHtml_Age+'|').replace(', |','').replace('|','')

            var strHtml=''
            strHtml+='<div>'
                strHtml+=`<h3 class="pn-margin-b-15" style="display: inline-block;">
                        <b>Trẻ em</b> 
                    </h3>
                    (<b style="font-size:12px"><i class="fa fa-child"></i></b> ${Arr_ListChildAge.length} ${(strHtml_Age? '['+strHtml_Age+']': '')})    
                `
                
                strHtml+= '<a id="btnViewFilter" class="btn btn-link" data-toggle="collapse" href="#pnForm1">'
                strHtml+= '    <i class="fa fa-chevron-down"></i>'
                strHtml+= '    <span></span>'
                strHtml+= '</a>'
            strHtml+='</div>'
            
            strHtml+= '<div id="pnForm1" class="panel-collapse collapse'+strIn+'">'
                strHtml+='<div class="pnListPrice"></div>'
            strHtml+= '</div>'

            $(IdOrClass_Pn).html(strHtml)

            $('#btnViewFilter').click(function(e){
                setTimeout(function(){
                    GetViewHideTxt(IdOrClass_Pn)
                },500)
            })
            GetViewHideTxt(IdOrClass_Pn)

            var IsFirst = true


            var objCols = {
                No: { name: '<span langkey="sys_Txt_No"></span>' }
                    ,strChildAge:{name:'Child Age'}
                    ,intQuantity:{name:'Quantity'
                        ,input:{title: '',attr:"class='col-md-12' style='margin:0'",isRequire:false,IsRtn:true
                            ,input:{type:'text',classEx:'form-control',attr:'input-fn="true" style="width: 100px;"'}
                        }
                    }
                    ,dblUnitPrice_View:{name:'<span langkey="sys_Txt_Unitprice"></span> <span style="font-weight: normal;"<Cho '+IntNoOfNight+' Đêm</span>', strAttrTD:'style="text-align:right"'}
                    ,dblTotalPrice:{name: '<span langkey="pg_Main_Supp_PPbook_TotalPrice"></span>' ,strAttrTD:'style="text-align:right"'}
                    ,dblTotalComPrice:{name:'Tổng hoa hồng',strAttrTD:' style="text-align:right"'},
            }

            if ($(window).width() < 767){
                objCols = {
                    No: { name: '<span langkey="sys_Txt_No"></span>' }
                    ,strChildAge:{name:'Child Age', strAttrTD: "style='vertical-align: top' " }
                    ,intQuantity:{name:'Quantity', strAttrTD: "style='vertical-align: top' "
                        ,list_input:{
                            intQuantity:{title: '',attr:"class='col-md-12' style='margin:0'",isRequire:false,IsRtn:true
                                ,input:{type:'text',classEx:'form-control',attr:'input-fn="true" style="width: 100px;"'}
                            },
                            dblUnitPrice_View:{title: '<span langkey="sys_Txt_Unitprice"></span> <span style="font-weight: normal;"<Cho '+IntNoOfNight+' Đêm</span>',attr:"class='col-md-12' style='margin:0'"
                                ,input:{IsNoInput:true,IsViewDtl:true}
                            },
                            dblTotalPrice:{title: '<span langkey="pg_Main_Supp_PPbook_TotalPrice"></span>',attr:"class='col-md-12' style='margin:0'"
                                ,input:{IsNoInput:true,IsViewDtl:true}
                            },
                        }
                    }
                }

            }



            pngPn.getTable2({
                objApi: null
                ,objParams_Cus: null
                ,objCols: objCols
                ,editRltArr: function(arr){
                    return Arr_ListChild
                }
                ,editRlt: function(value,key){

                    value['No'] = (key + 1)

                    value['strChildAge'] = value.strAgeName //'['+value.dblAgeFrom+' - '+value.dblAgeTo+']'

                    value['intQuantity'] = Obj_SuppDetail.objSearchDtl.arrChildren.filter( function(item){ return item >= value.dblAgeFrom && item <= value.dblAgeTo }).length
                    
                    var dblUnitPrice = 0
                    var dblUnitComPrice = 0

                    Obj_SuppDetail.arrListDate.forEach(function(_val){

                        var arr = Obj_SuppDetail.arrPriceRoom.filter(function(item){ return item.strPriceSeasonGUID.toUpperCase() == (_val.strPriceSeasonGUID || '').toUpperCase() && item.intMealIncludedTypeID == Obj_SuppDetail.intMealIncludedTypeID })
                        if( arr.length ){

                            val = arr[0]

                            var dblUnitPriceItem = 0
                            var dblUnitComPriceItem = 0
                            
                            dblUnitPriceItem = val['dblPriceChild'+value.intSupplierChildAgeKeyID]
                            dblUnitComPriceItem = 0
                            
                            dblUnitPrice+= dblUnitPriceItem
                            dblUnitComPrice+= dblUnitComPriceItem
                        }

                    })
                    value['dblUnitPrice'] = dblUnitPrice
                    value['dblUnitComPrice'] = dblUnitComPrice
                    value['dblTotalComPrice'] = dblUnitComPrice * value.intQuantity

                    if(dblUnitPrice)
                        value['dblUnitPrice_View'] = '<a action="ViewUnitPrice" intRowID="'+key+'" style="cursor: inherit;">'+$.pngFormatPrice(dblUnitPrice)+'</a>'
                    else
                        value['dblUnitPrice_View'] = 'N/A'
                    // if(IsFirst){
                    //     if(value.intIncludeTypeID == 2 || value.intIncludeTypeID == 3)
                    //         value.IsEnableInput = 1
                    // }

                    
                    
                    // }else{

                    //     // value.strItemTypeGUID
                    //     value['dblUnitPrice'] = 0
                    //     value['dblUnitComPrice'] = 0
                    // }
                    // value['strMarkupHtml'] = ''
                    // value['strMarkupHtml']+= value.dblMarkup+'('+value.strMakupName+')'
                }
                ,customEvent:function(_idOrClassPnTbl){
                    
                    Arr_ListChild.forEach(function(value,key){

                        if(IsFirst){
                            if(value['intQuantity']){
                                $('[row='+key+'] .IsEnableInput',_idOrClassPnTbl).prop('checked',true).change()
                                value.IsEnableInput = 1
                            }
                        }


                        var intMaxNoOfChild = Obj_SuppDetail.intMaxNoOfChild
                        if(Obj_SuppDetail.intChildOptionID && Obj_SuppDetail.intChildOptionID != '0'){
                            var arr = Obj_SuppDetail.arrOptionsChild.filter(function(item){ return item.intChildOptionID == Obj_SuppDetail.intChildOptionID && (item.strSupplierChildAgeGUID || '').toUpperCase() == (value.strSupplierChildAgeGUID || '').toUpperCase() })
                            intMaxNoOfChild = arr[0].intNoOfChild
                        }

                        $( '[row='+key+'] .intQuantity',_idOrClassPnTbl ).parent().append('<div>(Max: '+intMaxNoOfChild*Obj_SuppDetail.intQuantity+')</div>')
                        

                        $( '[row='+key+'] a[action=ViewUnitPrice]',_idOrClassPnTbl ).hover(function() {

                    
                            var strHtml = ''
                            strHtml+='<div id="pnSeeMore" class="bg-white pn-padding-15" style="position:absolute;z-index: 2;line-height: 25px;box-shadow: 0px 0px 18px -7px;text-align:left">'
                            
                            var dblUnitPrice = 0
                            var intQuantity = 1
                            var dtmDateFrom
                            var dtmDateTo
                            var strHtmlItem = ''

                            Obj_SuppDetail.arrListDate.forEach(function(_val){

                                var arr = Obj_SuppDetail.arrPriceRoom.filter(function(item){ return item.strPriceSeasonGUID.toUpperCase() == (_val.strPriceSeasonGUID || '').toUpperCase() && item.intMealIncludedTypeID == Obj_SuppDetail.intMealIncludedTypeID })
                                
                                if( arr.length ){

                                    val = arr[0]

                                        
                                    var dblUnitPriceItem = 0

                                    dblUnitPriceItem = val['dblPriceChild'+value.intSupplierChildAgeKeyID]


                                    if(dblUnitPrice!=dblUnitPriceItem){
                                        intQuantity = 1
                                        dblUnitPrice=dblUnitPriceItem
                                        dtmDateFrom = $.pngFormatDateTime(_val.dtmDate,'l')

                                        strHtml+=strHtmlItem
                                    }else{
                                        intQuantity++
                                    }

                                    dtmDateTo = moment($.pngFormatDateTime(_val.dtmDate,'l')).add('days',1).format('l')
                                    
                                    strHtmlItem = ''
                                    strHtmlItem+='<div><b>'+$.pngFormatDateTime(dtmDateFrom)+' - '+$.pngFormatDateTime(dtmDateTo)+'</b></div>'
                                    strHtmlItem+='<div> '+intQuantity+' x '+$.pngFormatPrice(dblUnitPriceItem)+'</div>'

                                    
                                }
                            })

                            strHtml+=strHtmlItem

                            strHtml+='</div>'

                            $( this ).append( strHtml );
                        }, function() {
                            $( this ).find( "#pnSeeMore" ).remove();
                        }
                        
                        );
                    })

                    IsFirst = false



                    // IsFirst = false



                    $('tbody input',_idOrClassPnTbl).change(function(){
                        var intRowID = $(this).parents('tr').attr('row')

                        Arr_ListChild[intRowID].intQuantity = $('[row='+intRowID+'] .intQuantity',_idOrClassPnTbl).val().getNumber()//parseFloat(this.value)
                        Arr_ListChild[intRowID].IsEnableInput = $('[row='+intRowID+'] .IsEnableInput',_idOrClassPnTbl).is(':checked')
        


                        var dblTotalPrice = Arr_ListChild[intRowID].dblUnitPrice *Arr_ListChild[intRowID].intQuantity
                        
                        Arr_ListChild[intRowID].dblTotalPrice = dblTotalPrice
                        Arr_ListChild[intRowID].dblTotalComPrice = Arr_ListChild[intRowID].dblUnitComPrice * Arr_ListChild[intRowID].intQuantity

                        // $('.pn-dblUnitPrice_View[row='+intRowID+']',_idOrClassPnTbl).html($.pngFormatPrice((Arr_Surcharge[intRowID].dblUnitPrice)))
                        
                        if(dblTotalPrice){
                            $('.pn-dblTotalPrice[row='+intRowID+']',_idOrClassPnTbl).html($.pngFormatPrice((dblTotalPrice)))
                            $('[row='+intRowID+'] .pnElm-dblTotalPrice',_idOrClassPnTbl).html($.pngFormatPrice((dblTotalPrice)))
                        }else{
                            $('.pn-dblTotalPrice[row='+intRowID+']',_idOrClassPnTbl).html('N/A')
                            $('[row='+intRowID+'] .pnElm-dblTotalPrice',_idOrClassPnTbl).html('N/A')
                        }
                        if(Arr_ListChild[intRowID].dblTotalComPrice)
                            $('[row='+intRowID+'] .pn-dblTotalComPrice',_idOrClassPnTbl).html($.pngFormatPrice(Arr_ListChild[intRowID].dblTotalComPrice))
                        else
                            $('[row='+intRowID+'] .pn-dblTotalComPrice',_idOrClassPnTbl).html('N/A')

                        _OnUpdTotalPrice()
                        // if(Obj_FN_Main.pnMain)
                        //     Obj_FN_Main.pnMain('pnBtn')
                            // GetPanel_TotalPrice()
                    })
                    setTimeout(function(){

                        // GetPanel_TotalPrice()
                    },100)
                    // GetTotalAllPrice()
                    // if(Obj_FN_Main.pnMain)
                    //     Obj_FN_Main.pnMain('pnBtn')
                    
                }
                , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                    
        
        
                    // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text('')
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit").hide()
                    // }else{
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ')')
                    //     $(IdOrClass_Main+ " #pnListBtn .viewedit").show()
                    // }

                    return Arr_ListChild  = _arrList;

                }
                ,IsViewCheckBoxMain: true
                ,idOrClass: IdOrClass_Pn+' .pnListPrice'
            })
        }
    }

    
    function GetPanel_pnListSurcharge(_idOrClassPn,_OnUpdTotalPrice){
        var IdOrClass_Pn = _idOrClassPn


    // if(Arr_Surcharge.length){

        
        var strHtml=''
        strHtml+='<div >'
            strHtml+='<h3 class="pn-margin-t-30 pn-margin-b-15" style="display: inline-block;" ><b>Phụ thu</b> </h3>'
            strHtml+= '<a id="btnViewFilter2" class="btn btn-link" data-toggle="collapse" href="#pnForm2">'
            strHtml+= '    <i class="fa fa-chevron-down"></i>'
            strHtml+= '    <span></span>'
            strHtml+= '</a>'
        strHtml+='</div>'

        strHtml+= '<div id="pnForm2" class="panel-collapse collapse in">'
            strHtml+='<div class="pnListPrice"></div>'
        strHtml+= '</div>'

        $(IdOrClass_Pn).html(strHtml)

        
        $('#btnViewFilter2').click(function(e){
            setTimeout(function(){
                GetViewHideTxt(IdOrClass_Pn)
            },500)
        })
        GetViewHideTxt(IdOrClass_Pn)
        
        var IsFirst = true

        var objCols =  {
            No: { name: '<span langkey="sys_Txt_No"></span>' }
            ,strSurchargeName_View:{name:'Surcharge Name'}
            // ,strPerPaxName:{name:'Per Service Name'}
            ,intNoOfDay:{name:'No Of Days'}
            ,intQuantity:{name:'Quantity'
                ,input:{title: '',attr:"class='col-md-12' style='margin:0'",isRequire:false,IsRtn:true
                    ,input:{type:'text',classEx:'form-control',attr:'input-fn="true" style="width: 100px;"'}
                }
            }
            ,dblUnitPrice_View:{name:'Unit Price', strAttrTD:'style="text-align:right"'}
            ,dblTotalPrice:{name: '<span langkey="pg_Main_Supp_PPbook_TotalPrice"></span>', strAttrTD:'style="text-align:right"'}
        }

        if ($(window).width() < 767){
            objCols = {
                No: { name: '<span langkey="sys_Txt_No"></span>' }
                ,strSurchargeName:{name:'Surcharge Name', strAttrTD: "style='vertical-align: top' "
                    ,list_input:{
            
                        strSurchargeName:{title:'',attr:"class='col-md-12' "
                            ,input:{IsNoInput:true,IsViewDtl:true}
                        },
                        strPerPaxName:{title:'Per Service Name',attr:"class='col-md-12' style='margin-bottom:5px'"
                            ,input:{IsNoInput:true,IsViewDtl:true}
                        },
                        dtmDateFromTo:{title:'Date',attr:"class='col-md-12' style='margin-bottom:5px'"
                            ,input:{IsNoInput:true,IsViewDtl:true}
                        },
                    }
                }
                ,intQuantity:{name:'Quantity', strAttrTD: "style='vertical-align: top' "
                    ,list_input:{
            
                        intQuantity:{title:'',attr:"class='col-md-12' "
                            ,input:{type:'text',classEx:'form-control',attr:'input-fn="true" style="width: 100px;"'}
                        },
                        dblUnitPrice_View:{title:'Unit Price',attr:"class='col-md-12' style='margin-bottom:5px'"
                            ,input:{IsNoInput:true,IsViewDtl:true}
                        },
                        dblTotalPrice:{title:'<span langkey="pg_Main_Supp_PPbook_TotalPrice"></span>',attr:"class='col-md-12' style='margin-bottom:5px'"
                            ,input:{IsNoInput:true,IsViewDtl:true}
                        },
                    }
                }

            }

        }
        
        pngPn.getTable2({
            objApi: null
            ,objParams_Cus: null
            ,objCols: objCols
            ,editRltArr: function(arr){
                return Arr_Surcharge
            }
            ,editRlt: function(value,key){
                // value['strSglDblName'] = 'Child Age ['+value.dblAgeFrom+' - '+value.dblAgeTo+']'

                value['strSurchargeName_View'] = value['strSurchargeName']+' - '+value['strPerPaxName'] 

                value.dtmDateFrom = $.pngFormatDateTime(value.dtmDateFrom,'l')
                value.dtmDateTo = $.pngFormatDateTime(value.dtmDateTo,'l')
                var dtmDateFrom, dtmDateTo
                if(moment(value.dtmDateFrom) < moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckIn) ){
                    dtmDateFrom = Obj_SuppDetail.objSearchDtl.dtmDateCheckIn
                }else{
                    dtmDateFrom = value.dtmDateFrom
                }
                if(moment(value.dtmDateTo) > moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckOut).add(-1,'days') ){
                    dtmDateTo = moment(Obj_SuppDetail.objSearchDtl.dtmDateCheckOut).add(-1,'days')
                }else{
                    dtmDateTo = value.dtmDateTo
                }

                value['intNoOfDay'] = moment(dtmDateTo).diff(moment(dtmDateFrom), 'days')+1
                
                value['dtmDateFromTo'] = $.pngFormatDateTime(moment(dtmDateFrom).format('l'))+' - '+$.pngFormatDateTime(moment(dtmDateTo).format('l'))

                // if(IsFirst){
                //     if(value.intIncludeTypeID == 2 || value.intIncludeTypeID == 3)
                //         value.IsEnableInput = 1
                // }

                value['dblUnitPrice_View'] = $.pngFormatPrice(value['dblUnitPrice'])
                
                // }else{

                //     // value.strItemTypeGUID
                //     value['dblUnitPrice'] = 0
                //     value['dblUnitComPrice'] = 0
                // }
                // value['strMarkupHtml'] = ''
                // value['strMarkupHtml']+= value.dblMarkup+'('+value.strMakupName+')'
            }
            ,customEvent:function(_idOrClassPnTbl){
                
                Arr_Surcharge.forEach(function(value,key){
                    if(IsFirst){
                        if(value.intIncludeTypeID == 2 || value.intIncludeTypeID == 3)
                            $('[row='+key+'] .IsEnableInput',_idOrClassPnTbl).prop('checked',true).change()
                            value.IsEnableInput = 1
                    }
                })

                IsFirst = false



                $('tbody input.intQuantity',_idOrClassPnTbl).change(function(){
                    var intRowID = $(this).parents('tr').attr('row')

                    Arr_Surcharge[intRowID].IsEnableInput = $('[row='+intRowID+'] .IsEnableInput',_idOrClassPnTbl).is(':checked')//parseFloat(this.value)
                    Arr_Surcharge[intRowID].intQuantity = $('[row='+intRowID+'] .intQuantity',_idOrClassPnTbl).val().getNumber()//parseFloat(this.value)

                    
                    var arr = Arr_Surcharge[intRowID].arrSurchargePrice.filter(function(item){ return item.strSurchargeDateGUID.toUpperCase() == Arr_Surcharge[intRowID].strSurchargeDateGUID.toUpperCase() && item.intPaxFrom <=Arr_Surcharge[intRowID].intQuantity  && item.intPaxTo >= Arr_Surcharge[intRowID].intQuantity })

                    if(arr.length)
                        Arr_Surcharge[intRowID].dblUnitPrice = arr[0].dblPrice
                    else
                        Arr_Surcharge[intRowID].dblUnitPrice = null


                    var dblTotalPrice = Arr_Surcharge[intRowID].dblUnitPrice *Arr_Surcharge[intRowID].intQuantity
                    
                    Arr_Surcharge[intRowID].dblTotalPrice = dblTotalPrice
                    if(Arr_Surcharge[intRowID].dblUnitPrice == null){
                        $('.pn-dblUnitPrice_View[row='+intRowID+']',_idOrClassPnTbl).html('N/A')
                        $('.pn-dblTotalPrice[row='+intRowID+']',_idOrClassPnTbl).html('N/A')
                        $('[row='+intRowID+'] .pnElm-dblTotalPrice',_idOrClassPnTbl).html('N/A')
                        $(_idOrClassPnTbl+' tr[row=' + intRowID + '] .IsEnableInput').attr('disabled',true).prop('checked',false).change()
                    }else{
                        if(Arr_Surcharge[intRowID].intIncludeTypeID != 3)
                            $(_idOrClassPnTbl+' tr[row=' + intRowID + '] .IsEnableInput').attr('disabled',false )
                        $('.pn-dblUnitPrice_View[row='+intRowID+']',_idOrClassPnTbl).html($.pngFormatPrice((Arr_Surcharge[intRowID].dblUnitPrice)))
                        $('.pn-dblTotalPrice[row='+intRowID+']',_idOrClassPnTbl).html($.pngFormatPrice((dblTotalPrice)))
                        $('[row='+intRowID+'] .pnElm-dblTotalPrice',_idOrClassPnTbl).html($.pngFormatPrice((dblTotalPrice)))
                    }
                    _OnUpdTotalPrice()
                    // GetTotalAllPrice()
                    // if(Obj_FN_Main.pnMain)
                    //     Obj_FN_Main.pnMain('pnBtn')
                    // GetPanel_TotalPrice()
                })
                // GetTotalAllPrice()
                // if(Obj_FN_Main.pnMain)
                //     Obj_FN_Main.pnMain('pnBtn')
                
            }
            , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                if(Arr_Surcharge[_intRowID].intIncludeTypeID == 3)
                    $(IdOrClass_Pn+' .pnListPrice tr[row=' + _intRowID + '] .IsEnableInput').attr('disabled',true).prop('checked',true)

                if (_IsChecked){
                    setTimeout(function(){
                        if(Arr_Surcharge[_intRowID].dblUnitPrice == null){
                            $(IdOrClass_Pn+' .pnListPrice tr[row=' + _intRowID + '] .IsEnableInput').prop('checked',false)
                            Arr_Surcharge[_intRowID].IsEnableInput = false
                        }
                    },100)
                    // $(IdOrClass_Pn + ' tr[row=' + _intRowID + '] td').css('background', '#E7EEFB')
                }
                else{
                        $(IdOrClass_Pn+' .pnListPrice tr[row=' + _intRowID + '] .intQuantity').attr('disabled',false)
                    // $(IdOrClass_Pn + ' tr[row=' + _intRowID + '] td').removeAttr('style')
                }
    
    
                // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text('')
                //     $(IdOrClass_Main+ " #pnListBtn .viewedit").hide()
                // }else{
                //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ')')
                //     $(IdOrClass_Main+ " #pnListBtn .viewedit").show()
                // }

                Arr_Surcharge = _arrList;

                _OnUpdTotalPrice()
            }
            ,IsViewCheckBoxMain:true
            ,idOrClass: IdOrClass_Pn+' .pnListPrice'
        })


    // }

    }


    function GetPanel_pnListFOC(_idOrClassPn,_OnUpdTotalPrice){
        var IdOrClass_Pn = _idOrClassPn

        // Is_BookNotMinstay = null

        // GetArr_ListFOC({
        //     Arr_ListBook: Arr_ListBook,
        //     Arr_ListFoc: Arr_ListFoc,
        //     Obj_SearchDtl: Obj_SearchDtl,
        //     Is_BookNotMinstay: IsBookNotMinstay,
        //     OnSuccess: function (_arr) {
        //         Arr_ListFOCUse = _arr
        //     }
        // })

        // if(Arr_ListFOCUse.length){


            var strHtml=''
            strHtml+='<div style="border-top: 1px solid #ccc">'
                strHtml+='<h3 class=" pn-margin-t-b-15" style="display: inline-block;"><b>FOC</b> </h3>'
                strHtml+= '<a id="btnViewFilter3" class="btn btn-link" data-toggle="collapse" href="#pnForm3">'
                strHtml+= '    <i class="fa fa-chevron-down"></i>'
                strHtml+= '    <span></span>'
                strHtml+= '</a>'
                strHtml+= '<div class="pnChkFOC" style="display:inline-flex;float: right;margin-top: 15px;">'
                strHtml+= '</div>'
            strHtml+='</div>'
            strHtml+= '<div id="pnForm3" class="panel-collapse collapse in">'
                strHtml+='<div class="pnListPrice"></div>'
            strHtml+= '</div>'

            $(IdOrClass_Pn).html(strHtml)

            var arrFOC = Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==1 && item.IsNotCombinedFOC })
            var arrMinstay = Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID == 2 })

            var IsFOCCombine=false

            if(arrFOC.length && arrMinstay.length){
                IsFOCCombine = true

                strHtml = ''
                strHtml+= '    <input type="checkbox" class="chkFOC chkCustom-1">'
                strHtml+= '    <span style="line-height: 28px; margin-left: 5px;">(Chọn: <b>FOC</b>/Bỏ chọn: <b>Min-stay</b>)</span>'
                $(IdOrClass_Pn+' .pnChkFOC').html(strHtml)
                $('.chkFOC',IdOrClass_Pn+' .pnChkFOC').prop('checked',true)
                $('.chkFOC',IdOrClass_Pn+' .pnChkFOC').change(function(){
                    GetTableFOCBook()
                })


            }else{
                IsFOCCombine = false
            }


            
            $('#btnViewFilter3').click(function(e){
                setTimeout(function(){
                    GetViewHideTxt(IdOrClass_Pn)
                },500)
            })
            GetViewHideTxt(IdOrClass_Pn)

            GetTableFOCBook()
            function GetTableFOCBook(){

                if(IsFOCCombine){

                    IsBookNotMinstay = $('.chkFOC',IdOrClass_Pn).is(':checked')

                    Arr_ListFOCUse.forEach(function(value){
                        if(value.intFOCTypeID==1 && IsBookNotMinstay)
                            value.IsActive = 1
                        else if(value.intFOCTypeID==2 && !IsBookNotMinstay)
                            value.IsActive = 1
                        else
                            value.IsActive = 0
                    })
                    // GetArr_ListFOC({
                    //     Arr_ListBook: Arr_ListBook,
                    //     Arr_ListFoc: Arr_ListFoc,
                    //     Obj_SearchDtl: Obj_SearchDtl,
                    //     Is_BookNotMinstay: IsBookNotMinstay,
                    //     OnSuccess: function (_arr) {
                    //         Arr_ListFOCUse = _arr
                    //         GetPanel_TotalPrice()
                    //     }
                    // })
                    _OnUpdTotalPrice()
                }else{
                    Arr_ListFOCUse.forEach(function(value){
                        value.IsActive = 1
                    })
                }

                // var arr =  Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==1 || (item.intFOCTypeID==2 && item.strItemTypeGUID.toUpperCase() == Obj_Detail.strItemTypeGUID.toUpperCase() ) })
                var arr = Arr_ListFOCUse.filter(function(item){ return item.IsActive })
                if(arr && arr.length)
                    pngPn.getTable2({
                        objApi: null
                        ,objParams_Cus: null
                        ,editRltArr: function(_arr){
                            return arr
                        }
                        ,editRlt: function(value,key){
    
                            value['No'] = (key + 1)
    
                            value['dblUnitPrice_View'] = $.pngFormatPrice(value.dblUnitPrice)
                            value['dblTotalPrice'] = value.dblUnitPrice*value.intQuantity
                            value['dblTotalPrice_View'] = $.pngFormatPrice(value.dblTotalPrice)
    

                        }
                        ,objCols: {
                            No: { name: '<span langkey="sys_Txt_No"></span>' }
                            ,strName:{name: pngElm.getLangKey({langkey:'sys_Txt_Description'})}
                            ,intQuantity:{name: pngElm.getLangKey({langkey:'sys_Txt_Quantity'})}
                            ,dblUnitPrice_View:{name:'<span langkey="sys_Txt_Unitprice"></span>', strAttrTD:'style="text-align:right"'}
                            ,dblTotalPrice_View:{name: '<span langkey="pg_Main_Supp_PPbook_TotalPrice"></span>', strAttrTD:'style="text-align:right"'}
                        }
                        
                        ,customEvent:function(_idOrClassPnTbl){
                            // $(_idOrClassPnTbl) 
                            // if( Arr_ListFOCUse.length > 1 && Arr_ListFOCUse.filter(function(item){ return item.IsNotCombinedFOC && item.intFOCTypeID == 1 }).length){

                            //     $(_idOrClassPnTbl).find('tr th:first-child input').hide()
                                
                            //     $(_idOrClassPnTbl).find('tr td:first-child input').attr('type','radio').attr('name','intFOC')

                            //     if(Arr_ListFOCUse.filter(function(item){ return item.IsEnableInput }).length==0){
                            //         $('[row=0] .IsEnableInput',_idOrClassPnTbl).prop('checked',true).change()
                            //     }


                            // }else{
                            
                            //     $(_idOrClassPnTbl).find('tr th:first-child,tr td:first-child').remove()
                            //     Arr_ListFOCUse.forEach(function(value){
                            //         value.IsEnableInput = true
                            //     })
                            // }

                            arr.forEach(function(value,key){
                                if( value.strItemTypeGUID ){
                                    if( value.strItemTypeGUID.toUpperCase() == Obj_SuppDetail.strItemTypeGUID.toUpperCase() ){
                                        $('[row='+key+']', _idOrClassPnTbl).css('font-weight','bold')
                                    }else{
                                        // $('[row='+key+']', _idOrClassPnTbl).css('color','#909090')
                                    }
                                }
                            })

                            
                        }
                        , changeCkbMaster: function (_IsChecked, _intRowID, _arrList) {
                            
                
                
                            // if($(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length == 0){
                            //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text('')
                            //     $(IdOrClass_Main+ " #pnListBtn .viewedit").hide()
                            // }else{
                            //     $(IdOrClass_Main+ " #pnListBtn .viewedit>span.intITs").text(' (' + $(IdOrClass_Pn+' input[chkboxMaster="true"]:checked').length + ')')
                            //     $(IdOrClass_Main+ " #pnListBtn .viewedit").show()
                            // }

                            // _arrList.forEach(function(value,key){
                            //     if(key == _intRowID && _IsChecked){
                            //         value.IsEnableInput = true
                            //     }else{
                            //         value.IsEnableInput = false
                            //     }
                            // })

                            arr  = _arrList;

                        }
                        ,IsViewCheckBoxMain: false
                        ,idOrClass: IdOrClass_Pn+' .pnListPrice'
                    })
                else{
                    $(IdOrClass_Pn+' .pnListPrice').html('')
                    if(!IsFOCCombine){
                        $(IdOrClass_Pn).html('')
                    }
                }
                    

                // var arrTbl = []



                // if(IsFOCCombine){
                //     Arr_ListFOCUse.forEach(function(value){
                //         value.IsEnableInput = 0
                //     })
                //     if($('.chkFOC',IdOrClass_Pn).is(':checked')){
                //         arrTbl = Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==1 }) 

                //         arrTbl.forEach(function(value){
                //             value.IsEnableInput = 1
                //         })

                //     }else{
                //         arrTbl = Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==2 && item.strItemTypeGUID.toUpperCase() == Obj_Detail.strItemTypeGUID.toUpperCase() }) 
                //         Arr_ListFOCUse.forEach(function(value){
                //             if(value.intFOCTypeID==2)
                //                 value.IsEnableInput = 1
                //         })
                //     }
                // }else{
                //     arrTbl = arrTbl.concat( Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==1 }) ) 
                //     arrTbl = arrTbl.concat( Arr_ListFOCUse.filter(function(item){ return item.intFOCTypeID==2 }) ) 
                //     arrTbl.forEach(function(value){
                //         value.IsEnableInput = 1
                //     })
                // }
            }



        // }
    }

    function GetViewHideTxt(_idOrClassPn){
        if($(_idOrClassPn).find('.panel-collapse').hasClass('in')){
            // $(_idOrClassPn).find('a span').text(pngElm.getLangKey({langkey:'sys_Txt_HideLess'}))
            $(_idOrClassPn).find('a i').attr('class','fa fa-chevron-up')
        }else{
            // $(_idOrClassPn).find('a span').text(pngElm.getLangKey({langkey:'sys_Txt_ViewMore'}))
            $(_idOrClassPn).find('a i').attr('class','fa fa-chevron-down')
        }
    }

    
        
}