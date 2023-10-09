var pngPn = function () {
    var _getForm = function (options) {
        var defaults = {
            objInput:{
                strDefault:{title:'Default',isRequire:false,attr:"class='col-md-12'",IsRtn:true
                    ,validate:{confirmRequire:'<span langkey="sys_Cfm_IpErr_FieldRequired"></span>',format:"",confirmFormat:'<span langkey="sys_Cfm_IpErr_FieldIncorrect"></span>'}
                    ,arrValidateEx:[{IsCheckSS:function(){},IsCheckSSAjax:function(){}, strConfirm:'' }]
                    ,input:{IsNoInput:false,IsViewDtl:false,type:'text',classEx:'form-control',attr:''}
                    //,input:{type:'checkbox',classEx:'',attr:'style="float: left;margin-right: 5px;margin-top: 2px;"'}
                    //,input:{type:'textarea',classEx:'form-control',attr:'rows="5"'}
                    ,inputRange:{IsNoInput:true,step: 1,min:0,max:100,value:'0,100',format:'{0} day'}
                    ,dateRange:{firstDay:1,format: 'DD/MM/YYYY',minDate:moment()}
                    ,datePicker:{todayHighlight: true,format: 'dd/mm/yyyy',weekStart:1,startDate: moment(),endDate: null}
                    ,datePickerRange:{IsNoInput:true,todayHighlight: true,format: 'dd/mm/yyyy',weekStart: 1,startDate: null,endDate: null,diffmin:null,diffmax:null,placeholderFrom:pngElm.getLangKey({langkey:'sys_Txt_FromDate'}),placeholderTo: pngElm.getLangKey({langkey:'sys_Txt_ToDate'})}
                    ,listCheckbox:{IsNoInput:true,arrList:[{'key':'value'}],formatItem:'<span style="margin-right:15px">{chk}{tit}</span>',IsCheckAll: false,splitReturn:','}
                    ,dropDown:{
                        Select2:{IsMultiple:false}
                        ,arrList:[{'key':'value'}]}
                        ,query: null
                    ,inputImage:{
                        IsNoInput:true,attr:'style="width: 300px; height: 192px;cursor:pointer"',urlImgDft: coreSystem.getLib_CommonURL('assets/images/img-noimage.png')
                        , objLibMedia:{}
                    }
                    ,comboBoxesDes:{IsNoInput:true,IsComboBoxesDes:true}
                }
            },
            idOrClass:'#Default',
            action:1,//1-viewInput,2-return,
            objDetail:{},
            OnChkSuccess: function(){}
        }
        var objDefaultInput = defaults.objInput.strDefault

        var objReturn = {}

        options = $.extend(defaults, options);

        var strHtml = '<div class="row">'
        Object.keys(options.objInput).forEach(function(key){
            if(options.objInput[key].input)
                options.objInput[key].input.class = key

            strHtml+= "<div"+(options.objInput[key].attr? " "+options.objInput[key].attr : "") +" style='margin-bottom: 15px;'>"
                if(options.objInput[key].title)
                    strHtml+= "<label>"+options.objInput[key].title+(options.objInput[key].isRequire?" <span style='color:red'>*</span>":"")+"</label>"
                
                var IsNoInput = false

                Object.keys(options.objInput[key]).forEach(function(key2){
                    if( typeof options.objInput[key][key2] === "object"){
                        var objInput = $.pngExtendObj(objDefaultInput[key2],options.objInput[key][key2])
                        
                        if(objInput.IsNoInput){
                            IsNoInput = true
                        }
                    }
                })

                Object.keys(objDefaultInput).forEach(function(key2){
                    if( typeof objDefaultInput[key2] !== "object"){
                        if( typeof options.objInput[key][key2] == 'undefined')
                            options.objInput[key][key2] = objDefaultInput[key2]
                    }
                })

                if(!IsNoInput)
                    strHtml+= pngElm.getInputs(options.objInput[key].input)
                else
                    strHtml+= "<div class='pnElm-"+key+"'></div>"
            strHtml+= "</div>"
        })
        strHtml += '</div>'

        InsertHtml(options.idOrClass,strHtml)

        Object.keys(options.objInput).forEach(function(key){
            // objReturn[key] = $(options.idOrClass+' .'+options.objInput[key].class).val()
            var IsInputVal = true

            if(options.objInput[key].inputRange){
                IsInputVal=false
                // options.objInput[key].input = {IsNoInput:false}
                if(!options.objInput[key].input)
                    options.objInput[key].input = {}
                options.objInput[key].input.IsNoInput = false

                if(options.action == 1){
                    var objInputRange = $.pngExtendObj(objDefaultInput.inputRange,options.objInput[key].inputRange)
                    var strHtmlInputRange = ""

                    if (options.objDetail[key]){
                        objInputRange.value = options.objDetail[key]
                    }

                    strHtmlInputRange += pngElm.getInputs({
                        type:'text',class: key
                        ,classEx:'input-range'
                        ,attr:'style="width:100%" data-slider-step="'+objInputRange.step+'" data-slider-value="'+objInputRange.value+'" data-slider-min="'+objInputRange.min+'" data-slider-max="'+objInputRange.max+'" '+(objInputRange.value.toString().indexOf(',')!==-1?'data-slider-range="true"':'')+' data-slider-tooltip_split="true" data-slider-tooltip="hide"'
                    })
                    strHtmlInputRange += objInputRange.format.replace(/\{0\}/,'<span class="range from"></span>')
                    if(objInputRange.value.toString().indexOf(',')!==-1)
                        strHtmlInputRange += '<div style="float: right">'+objInputRange.format.replace(/\{0\}/,'<span class="range to"></span>')+'</div>'

                    InsertHtml(options.idOrClass+" .pnElm-"+key,strHtmlInputRange)
                }
                if(options.action == 2){
                    objReturn[key] = ($(options.idOrClass+' .pnElm-'+key+' input').val() || null)
                }
                // objReturn[key] = $(options.idOrClass+' .'+options.objInput[key].class).val()
            }
            if(options.objInput[key].dateRange){
                if(options.action != 2){
                    $(options.idOrClass+' .'+options.objInput[key].input.class).daterangepicker({
                        locale: {
                            "firstDay": options.objInput[key].dateRange.firstDay,
                            "format": options.objInput[key].dateRange.format
                        },
                        "showCustomRangeLabel": false,
                        "alwaysShowCalendars": true,
                        "opens": "center",
                        "showDropdowns": true,
                        "minDate": options.objInput[key].dateRange.minDate,
                        autoUpdateInput: false,
                    });
                    $(options.idOrClass+' .'+options.objInput[key].input.class).on('apply.daterangepicker', function(ev, picker) {
                        $(this).val(picker.startDate.format(options.objInput[key].dateRange.format) + ' - ' + picker.endDate.format(options.objInput[key].dateRange.format));
                    });
                    //------------MrHieu(26/06/2019)
                    $(options.idOrClass+' .'+options.objInput[key].input.class).on('hide.daterangepicker', function(ev, picker) {
                        if($(this).val())
                            $(this).val(picker.startDate.format(options.objInput[key].dateRange.format) + ' - ' + picker.endDate.format(options.objInput[key].dateRange.format));
                    });
                    //------------END(26/06/2019)
                    $(options.idOrClass+' .'+options.objInput[key].input.class).on('cancel.daterangepicker', function(ev, picker) {
                        $(this).val('');
                    });
                }
                IsInputVal=false
                var arrDateRange = $(options.idOrClass+' .'+options.objInput[key].input.class).val().split(' - ')
                if(key.indexOf('_')!=-1){
                    objReturn[key.split('_')[0]] = (arrDateRange && arrDateRange.length >1)? moment(arrDateRange[0],options.objInput[key].dateRange.format).format('l'): null
                    objReturn[key.split('_')[1]] = (arrDateRange && arrDateRange.length >1)? moment(arrDateRange[1],options.objInput[key].dateRange.format).format('l'): null

                    if (options.action!=2 && options.objDetail[key.split('_')[0]]){
                        var dtmDateFrom = moment(options.objDetail[key.split('_')[0]]).format(options.objInput[key].dateRange.format)
                        var dtmDateTo = moment(options.objDetail[key.split('_')[1]]).format(options.objInput[key].dateRange.format)
                        
                        $(options.idOrClass+' .'+options.objInput[key].input.class).data('daterangepicker').setStartDate(dtmDateFrom);
                        $(options.idOrClass+' .'+options.objInput[key].input.class).data('daterangepicker').setEndDate(dtmDateTo);   
                        $(options.idOrClass+' .'+options.objInput[key].input.class).val(dtmDateFrom+' - '+dtmDateTo)
                    }
                }else{

                    if (options.objInput[key].IsRtn)
                        objReturn[key] = $(options.idOrClass+' .'+options.objInput[key].input.class).val()

                    if (options.action!=2 && options.objDetail[key]){
                        $(options.idOrClass+' .'+options.objInput[key].input.class).data('daterangepicker').setStartDate(moment(options.objDetail[key].split(' - ')[0]).format(options.objInput[key].dateRange.format));
                        $(options.idOrClass+' .'+options.objInput[key].input.class).data('daterangepicker').setEndDate(moment(options.objDetail[key].split(' - ')[1]).format(options.objInput[key].dateRange.format));
                    
                    }
                }
            }
            if(options.objInput[key].datePicker){
                var objDatePicker = $.pngExtendObj(objDefaultInput.datePicker,options.objInput[key].datePicker)

                if(options.action != 2){
                    
                    $.fn.datepicker = $.fn.datepickerOld
                    $(options.idOrClass+' .'+options.objInput[key].input.class).datepicker({
                        todayHighlight: objDatePicker.todayHighlight,
                        weekStart: objDatePicker.weekStart,
                        format: objDatePicker.format,
                        startDate: new Date(moment(objDatePicker.startDate)),
                        endDate: new Date(moment(objDatePicker.endDate)),
                    }).addClass('hasDatepicker');
                }
                IsInputVal=false
                var classInput = options.idOrClass+' .'+options.objInput[key].input.class

                if (options.objInput[key].IsRtn)
                    objReturn[key] = $(classInput).val()? moment($(classInput).datepicker('getDate')).format('l'): null
                
                if (options.action!=2 && options.objDetail[key]){
                    var dtmDate = options.objDetail[key]

                    if(dtmDate.indexOf('Date')>-1){
                        dtmDate = parseInt(dtmDate.substr(6))
                    }
                    $(classInput).datepicker("setDate", new Date(dtmDate));
                }
            }
            if(options.objInput[key].datePickerRange){
                
                var classInput = options.idOrClass+" .pnElm-"+key

                
                var objDatePickerRange = $.pngExtendObj(objDefaultInput.datePickerRange,options.objInput[key].datePickerRange)


                if(options.action == 1 && (key.indexOf('_')!=-1)){
                    var strHtmlMain = ''
                    strHtmlMain+='<div class="input-daterange input-group">'
                    strHtmlMain+='    <input type="text" class="'+key.split('_')[0]+' form-control" name="from" placeholder="'+objDatePickerRange.placeholderFrom+'" autocomplete="off"/>'
                    strHtmlMain+='    <span class="input-group-addon">-</span>'
                    strHtmlMain+='    <input type="text" class="'+key.split('_')[1]+' form-control" name="to" placeholder="'+objDatePickerRange.placeholderTo+'" autocomplete="off"/>'
                    strHtmlMain+='</div>'

                    InsertHtml(classInput,strHtmlMain)
                    $.fn.datepicker = $.fn.datepickerOld
                    $(classInput+' .input-daterange').datepicker({
                        todayHighlight: objDatePickerRange.todayHighlight,
                        weekStart: objDatePickerRange.weekStart,
                        format: objDatePickerRange.format,
                        startDate: new Date(moment(objDatePickerRange.startDate)),
                        endDate: new Date(moment(objDatePickerRange.endDate))
                    });

                    $(classInput+' [name="from"]').datepicker("setDate",null).addClass('hasDatepicker');

                    $(classInput+' [name="to"]').datepicker("setDate", null).addClass('hasDatepicker');

                    var dtmDateFrom = options.objDetail[key.split('_')[0]]
                    var dtmDateTo = options.objDetail[key.split('_')[1]]

                    if(dtmDateFrom){
                        if(dtmDateFrom.indexOf('Date')>-1){
                            dtmDateFrom = parseInt(dtmDateFrom.substr(6))
                        }
                        $(classInput+' [name="from"]').datepicker("setDate",new Date(dtmDateFrom))
                    }
                    if(dtmDateTo){
                        if(dtmDateTo.indexOf('Date')>-1){
                            dtmDateTo = parseInt(dtmDateTo.substr(6))
                        }
                        $(classInput+' [name="to"]').datepicker("setDate", new Date(dtmDateTo))
                    }

                    var diffmin = objDatePickerRange.diffmin
                    var diffmax = objDatePickerRange.diffmax
                    if(diffmin==null){
                        diffmin = 0
                    }
                    if(diffmax!=null){
                        if(diffmin>diffmax){
                            diffmax = diffmin
                        }
                    }

                    var IsChangeDateFrom = null

                    $(classInput+' [name="from"]').on('changeDate', function(e) {

                        if(IsChangeDateFrom==null){
                            IsChangeDateFrom = true
                        }

                        if(IsChangeDateFrom==true){

                            if($(classInput+' [name="from"]').val()){
                                if(!$(classInput+' [name="to"]').val() || moment($(this).datepicker('getDate')).add("days", diffmin) > moment($(classInput+' [name="to"]').datepicker('getDate'))){
                                    var dtm = moment($(this).datepicker('getDate')).add("days", diffmin)
                                    
                                    $(classInput+' [name="to"]').datepicker("setDate",new Date(dtm));
                                }
    
                                if(diffmax!=null){
                                    if($(classInput+' [name="to"]').val() && moment($(this).datepicker('getDate')).add("days", diffmax) < moment($(classInput+' [name="to"]').datepicker('getDate'))){
                                        var dtm = moment($(this).datepicker('getDate')).add("days", diffmax)
                                        
                                        $(classInput+' [name="to"]').datepicker("setDate",new Date(dtm));
                                    }
                                }
                                
                                // $('body .datepicker-dropdown').remove()
                            }
                            $(this).datepicker('hide');
                            setTimeout(function(){$(classInput+' [name="to"]').focus()},10)
                        }
                        setTimeout(function(){IsChangeDateFrom = null},10)

                    });


                    $(classInput+' [name="to"]').on('changeDate', function(e) {
                        
                        if(IsChangeDateFrom==null){
                            IsChangeDateFrom = false
                        }

                        if(IsChangeDateFrom==false){

                            if($(classInput+' [name="from"]').val()){
                                if(moment($(classInput+' [name="from"]').datepicker('getDate')).add("days", diffmin) > moment($(this).datepicker('getDate'))){
                                    var dtm = moment($(this).datepicker('getDate')).add("days", 0 - diffmin)
                                    
                                    $(classInput+' [name="from"]').datepicker("setDate",new Date(dtm));
                                }
                            }

                            if(diffmax!=null){
                                if($(classInput+' [name="from"]').val()){
                                    if(moment($(classInput+' [name="from"]').datepicker('getDate')).add("days", diffmax) < moment($(this).datepicker('getDate'))){
                                        var dtm = moment($(this).datepicker('getDate')).add("days", 0 - diffmax)
                                        
                                        $(classInput+' [name="from"]').datepicker("setDate",new Date(dtm));
                                    }
                                }
                            }
                        }
                        
                        setTimeout(function(){IsChangeDateFrom = null},10)
                    });
                }
                if(options.action == 2){
                    
                    IsInputVal=false

                    if (options.objInput[key].IsRtn){
                        if(key.indexOf('_')!=-1){
                            objReturn[key.split('_')[0]] = $(classInput+' [name="from"]').val()? moment($(classInput+' [name="from"]').datepicker('getDate')).format('l'): null
                            objReturn[key.split('_')[1]] = $(classInput+' [name="to"]').val()? moment($(classInput+' [name="to"]').datepicker('getDate')).format('l'): null        
                        }
                    }
                    
                    options.objInput[key].idOrClassCheck = options.idOrClass+" .pnElm-"+key
                    options.objInput[key].idOrClassCheckFocus = options.idOrClass+" .pnElm-"+key+ " [name='from']"
                }
            }
            if(options.objInput[key].dropDown){
                var objDropDown = options.objInput[key].dropDown//$.pngExtendObj(objDefaultInput.dropDown,options.objInput[key].dropDown)
                IsInputVal=false
                if(objDropDown.Select2){

                    if (options.action==1){
                        
                        if(objDropDown.OnLoadData){
                            objDropDown.OnLoadData(function (_arrList) {
                                objDropDown.arrList = _arrList
                                GetLoad()
                            },options.idOrClass+' input.'+options.objInput[key].input.class)
                        }else{
                            GetLoad()
                        }
                        function GetLoad() {
                            var objSl2 = objDropDown.Select2

                            objSl2.multiple = objSl2.IsMultiple

                            if(!objSl2.IsMultiple){
                                objSl2.allowClear= true
                            }

                            if(objDropDown.query || (objDropDown.Select2 && objDropDown.Select2.query)){
                                if(objDropDown.query)
                                    objSl2.query = objDropDown.query

                                if(!objDropDown.Select2.formatSelection){
                                    objSl2.formatSelection = function(object, container){
                                        return object.text
                                    }
                                }
                                

                            }else{
                                var arrData =[]
                                objDropDown.arrList.forEach(function(value){
                                    arrData.push({
                                        id : Object.keys(value)[0].toUpperCase()
                                        ,text : value[Object.keys(value)]
                                    })
                                })
                                objSl2.data = arrData
                            }
        
                            $(options.idOrClass+' .'+options.objInput[key].input.class).select2(objSl2);
    
                            if(!$(options.idOrClass+' input.'+options.objInput[key].input.class).attr('placeholder') && !objDropDown.Select2.IsMultiple && objDropDown.arrList.length){
                                $(options.idOrClass+' .'+options.objInput[key].input.class).select2("val",[Object.keys(objDropDown.arrList[0])[0].toString().toUpperCase()]) 
                            }
    
                            if (options.objDetail[key]){
                                if(objDropDown.query || (objDropDown.Select2 && objDropDown.Select2.query) ){
                                    var arr = []
                                    var arrStr_View = options.objDetail[key+'_View'].split(',')
                                    options.objDetail[key].split(',').forEach(function(val,key){
                                        arr.push({id: val.toUpperCase(),text: arrStr_View[key]})
                                    })
                                    if(arr.length==1){
                                        $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data",arr[0]) 
                                    }else if (arr.length > 1){
                                        $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data",arr) 
                                    }
                                }else{
                                    $(options.idOrClass+' .'+options.objInput[key].input.class).select2("val",[options.objDetail[key].toString().toUpperCase()]) 
                                }
                            }
                            if(objDropDown.query || (objDropDown.Select2 && objDropDown.Select2.query)){
                                $(options.idOrClass+' .'+options.objInput[key].input.class).change(function(){
                                    var strRtn = ''
                                    var strArr =  $(options.idOrClass+' .'+options.objInput[key].input.class).select2("val")
                                    if(!objDropDown.Select2.IsMultiple){
                                        if(strArr)
                                            strArr = [strArr]
                                    }
                                    if(strArr){
                                        if(strArr.length==1){
                                            var obj = $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data")
                                            strRtn = obj.id
                                            // objReturn[key+'_View'] = obj.text
                                        }else if(strArr.length > 1){
                                            var arr = $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data")
    
                                            var arr_ID = []
                                            var arr_Text = []
                                            arr.forEach(function(val){
                                                arr_ID.push(val.id)
                                                arr_Text.push(val.text)
                                            })
                                            strRtn = arr_ID.join(',')
                                        }
    
                                    }
                                    $(options.idOrClass+' .'+options.objInput[key].input.class).val(strRtn)
                                }).change()
                            }
                        }
                        
                    }

                    if (options.action==2){
                        if (options.objInput[key].IsRtn){
                            if(objDropDown.query || (objDropDown.Select2 && objDropDown.Select2.query)){
                                
                                var strArr =  $('.'+options.objInput[key].input.class,options.idOrClass).select2("val")
                                if(!objDropDown.Select2.IsMultiple){
                                    if(strArr)
                                        strArr = [strArr]
                                }
                                if(strArr){
                                    if(strArr.length==1){
                                        var obj = $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data")
                                        objReturn[key] = obj.id
                                        objReturn[key+'_View'] = obj.text
                                    }else{
                                        var arr = $(options.idOrClass+' .'+options.objInput[key].input.class).select2("data")

                                        var arr_ID = []
                                        var arr_Text = []
                                        arr.forEach(function(val){
                                            arr_ID.push(val.id)
                                            arr_Text.push(val.text)
                                        })
                                        objReturn[key] = arr_ID.join(',')
                                        objReturn[key+'_View'] = arr_Text.join(',')
                                    }

                                }else{
                                    objReturn[key] = null
                                }
                            }else{
                                objReturn[key] =  $(options.idOrClass+' .'+options.objInput[key].input.class).select2("val")
                                if(objDropDown.Select2.IsMultiple)
                                    objReturn[key] = objReturn[key].join(',')
                                objReturn[key] = (objReturn[key] || null)
                            }
                        }
                        
                        options.objInput[key].idOrClassCheck = options.idOrClass+" ."+key
                        options.objInput[key].idOrClassCheckFocus = options.idOrClass+" ."+key+" input"
                    }

                }else{
                    
                    if (options.action==1){

                        if(objDropDown.OnLoadData){
                            objDropDown.OnLoadData(function (_arrList) {
                                objDropDown.arrList = _arrList
                                GetLoad()
                            },options.idOrClass+' .'+options.objInput[key].input.class)
                        }else{
                            GetLoad()
                        }

                        function GetLoad() {
                            var strHtmlOption = ""
                            if(objDropDown.IsViewSlcOpt){
                                strHtmlOption += "<option value=''>"+pngElm.getLangKey({langkey:'sys_Txt_DdlSelectVal'})+"</option>"
                            }
    
                            objDropDown.arrList.forEach(function(value){
                                strHtmlOption += "<option value='"+Object.keys(value)+"'>"+value[Object.keys(value)]+"</option>"
                            })
        
                            // $(options.idOrClass+' .'+options.objInput[key].input.class).html(strHtmlOption);
                            InsertHtml(options.idOrClass+' .'+options.objInput[key].input.class,strHtmlOption)
                        
                            if (options.objDetail[key]!=null && options.objDetail[key]!=undefined)
                                $(options.idOrClass+" ."+options.objInput[key].input.class).val(options.objDetail[key])
                        }
                    }
                    
                    if (options.action==2){
                       
                        if (options.objInput[key].IsRtn){
                            var strVal = $(options.idOrClass+" ."+options.objInput[key].input.class).val()
                            objReturn[key] = (strVal == '' ? null : strVal )
                        }

                        options.objInput[key].idOrClassCheck = options.idOrClass+" ."+key
                        options.objInput[key].idOrClassCheckFocus = options.idOrClass+" ."+key
                    }
                }
            }

            if(options.objInput[key].listCheckbox){
                var objListCheckbox = $.pngExtendObj(objDefaultInput.listCheckbox,options.objInput[key].listCheckbox)
                IsInputVal=false
                if (options.action==1){

                    if(objListCheckbox.OnLoadData){
                        objListCheckbox.OnLoadData(function (_arrList) {
                            objListCheckbox.arrList = _arrList
                            options.objInput[key].listCheckbox.arrList = _arrList
                            GetLoad()
                        },options.idOrClass+' .pnElm-'+key)
                    }else{
                        GetLoad()
                    }

                    function GetLoad() {
                        var strHtmlListCheckbox = ""
                        if(objListCheckbox.IsCheckAll)
                            strHtmlListCheckbox += objListCheckbox.formatItem.replace(/\{chk\}/,pngElm.getInputs({type:'checkbox',class:'chkAll',classEx:''})).replace(/\{tit\}/, pngElm.getLangKey({langkey:'sys_Txt_SelectAll'}))
                        
                        objListCheckbox.arrList.forEach(function(valueLC){

                            strHtmlListCheckbox += objListCheckbox.formatItem.replace(/\{chk\}/,pngElm.getInputs({type:'checkbox',class:'chkItem',classEx:'',attr:'data='+Object.keys(valueLC)})).replace(/\{tit\}/,valueLC[Object.keys(valueLC)])
                            
                        })
                        
                        InsertHtml(options.idOrClass+" .pnElm-"+key,strHtmlListCheckbox)
                        if(objListCheckbox.IsCheckAll)
                            pngElm.CheckboxItemAndAll({idOrClass: options.idOrClass+" .pnElm-"+key,
                                idOrClassChkItem:'input.chkItem',
                                idOrClassChkAll:'input.chkAll'
                            })

                        objListCheckbox.arrList.forEach(function(valueLC){
                            var IsCheckbox = false

                            if(objListCheckbox.splitReturn){
                                if (options.objDetail[key]){
                                    options.objDetail[key].split(objListCheckbox.splitReturn).forEach(function(valueLC2){
                                        if(!IsCheckbox)
                                            IsCheckbox = (valueLC2 == Object.keys(valueLC))
                                    })
                                    setTimeout(function(){
                                        $(options.idOrClass+" .pnElm-"+key+" input[data="+Object.keys(valueLC)+"]").prop('checked',IsCheckbox).change()
                                    },0)
                                }
                            }else{
                                if (options.objDetail[Object.keys(valueLC)])
                                    $(options.idOrClass+" .pnElm-"+key+" input[data="+Object.keys(valueLC)+"]").prop('checked',options.objDetail[Object.keys(valueLC)]).change()
                            }
                        })
                    }
                    
                }
                
                if (options.action==2){
                    
                    // if(objListCheckbox.splitReturn)
                    objReturn[key] = ''

                    objListCheckbox.arrList.forEach(function(valueLC){

                        if(objListCheckbox.splitReturn){
                            if($(options.idOrClass+" .pnElm-"+key+" input[data="+Object.keys(valueLC)+"]").is(':checked'))
                                objReturn[key]+= objListCheckbox.splitReturn+Object.keys(valueLC)
                        }else{
                            var IsCheck = $(options.idOrClass+" .pnElm-"+key+" input[data="+Object.keys(valueLC)+"]").is(':checked')
                            objReturn[Object.keys(valueLC)] = IsCheck
                            if(IsCheck){
                                objReturn[key] = '0'
                            }
                        }

                    })
                    
                    if(objListCheckbox.splitReturn)
                        objReturn[key] = objReturn[key].replace(objListCheckbox.splitReturn,'')

                    options.objInput[key].idOrClassCheck = options.idOrClass+" .pnElm-"+key
                    options.objInput[key].idOrClassCheckFocus = options.idOrClass+" .pnElm-"+key+ " input"
                }


                
                
            }

            if(options.objInput[key].inputImage){
                var objInputImage = $.pngExtendObj(objDefaultInput.inputImage,options.objInput[key].inputImage)
                IsInputVal=false

                if (options.action==1){

                    var strHtmlInputImage = "<a class='btnDelete' style='position: absolute;left: 14px;background: #ffffffd4;padding: 0 6px;cursor:pointer'><i class='fa fa-times'></i></a>"
                    strHtmlInputImage += "<img class='"+key+"' "+objInputImage.attr+" src='"+objInputImage.urlImgDft+"'>"
                    InsertHtml(options.idOrClass+" .pnElm-"+key,strHtmlInputImage)

                    if(options.objDetail[key]){
                        $(options.idOrClass+" .pnElm-"+key+' .btnDelete').css('display','inline-block')
                        $(options.idOrClass+" .pnElm-"+key+' img').attr('src',png.getServerImgURL(options.objDetail[key]))
                    }else
                        $(options.idOrClass+" .pnElm-"+key+' .btnDelete').css('display','none')

                    $(options.idOrClass+" .pnElm-"+key+' .btnDelete').click(function(){
                        $(options.idOrClass+" .pnElm-"+key+' .btnDelete').css('display','none')
                        $(options.idOrClass+" .pnElm-"+key+' img').attr('src',objInputImage.urlImgDft)
                    })
                    $(options.idOrClass+" .pnElm-"+key+' img').click(function(){

                        if(objInputImage.objLibMedia){

                            objInputImage.objLibMedia.OnSuccess = function(arrUrlImg){
                                if(arrUrlImg && arrUrlImg.length!=0){
                                    arrUrlImg.forEach(function(val){
                                        $(options.idOrClass+" .pnElm-"+key+' .btnDelete').css('display','inline-block')
                                        $(options.idOrClass+" .pnElm-"+key+' img').attr('src',val)
                                    })
                                }
                            }

                            
                            pngPn.getPopUpLibMedia(objInputImage.objLibMedia)

                        }
                    })
                }
                if(options.action==2){
                    if (options.objInput[key].IsRtn){
                        var linkImg = $(options.idOrClass+" .pnElm-"+key+' img').attr('src')
                        linkImg = linkImg.replace(png.getServerImgURL(''),'')
                        if(linkImg!=objInputImage.urlImgDft)
                            objReturn[key] = linkImg
                        else
                            objReturn[key] = null
                    }
                }
            }
            
            if(options.objInput[key].comboBoxesDes){
                var objcomboBoxesDes = $.pngExtendObj(objDefaultInput.comboBoxesDes,options.objInput[key].comboBoxesDes)
                IsInputVal = false
                if (options.action==1){
                    pngElm.ComboboxesDes({
                        idOrClassPn: options.idOrClass+" .pnElm-"+key
                        , action:1
                        , strDataInput: (options.objDetail[key] || '')
                    })
                }

                if (options.action==2){
                    pngElm.ComboboxesDes({
                        idOrClassPn: options.idOrClass+" .pnElm-"+key
                        , action:2
                        , OnRtn: function(strRtn){
                            if (options.objInput[key].IsRtn)
                                objReturn[key] = strRtn
                        }
                    })

                    options.objInput[key].idOrClassCheck = options.idOrClass+" .pnElm-"+key
                    options.objInput[key].idOrClassCheckFocus = options.idOrClass+" .pnElm-"+key+ " .txtCountry"
                }

            }

            if(options.objInput[key].input){
                if(options.objInput[key].input.type == "text" && $(options.idOrClass+" ."+options.objInput[key].input.class).attr('input-fn')){
                    
                    IsInputVal = false
                    if (options.action==1){
                        if (options.objDetail[key]!=null){
                            $(options.idOrClass+" ."+options.objInput[key].input.class).val(options.objDetail[key])
                        }
                            
                        var IsRequire = true
                        var strIsReq = $(options.idOrClass+" ."+options.objInput[key].input.class).attr('IsRequire')
                        if(strIsReq){
                            if(strIsReq == 'true'){
                                IsRequire = true
                            }else if( strIsReq == 'false'){
                                IsRequire = false
                            }
                        }

                        $(options.idOrClass+" ."+options.objInput[key].input.class).getFormatNumberInput(($(options.idOrClass+" ."+options.objInput[key].input.class).attr('IsDecimal')=='true'),IsRequire)
                    }

                    if (options.action==2){
                        if (options.objInput[key].IsRtn){
                            var strVal = $(options.idOrClass+" ."+options.objInput[key].input.class).val().replace(/,/g,'')
                            objReturn[key] = (strVal == '' ? null : strVal )
                        }
                    }
                }

                if(options.objInput[key].input.type == "checkbox"){
                    IsInputVal=false
                    if (options.action==1){
                        if (options.objDetail[key])
                            $(options.idOrClass+" ."+options.objInput[key].input.class).attr('checked',options.objDetail[key])
                    }
                    if (options.action==2){
                        if (options.objInput[key].IsRtn)
                            objReturn[key] = $(options.idOrClass+" ."+options.objInput[key].input.class).is(':checked')
                    }
                    
                    
                }

                if(options.objInput[key].input.type == "textarea"){
                    var Isckeditor = $(options.idOrClass+" ."+options.objInput[key].input.class).attr('ckeditor')
                    
                    if(Isckeditor){
                        IsInputVal=false
                        var idTextArea = ''
                        if (options.action==1){
                            
                            $(options.idOrClass+" ."+options.objInput[key].input.class).attr('id',options.idOrClass.replace(/[#.\s]/g,'')+'_'+options.objInput[key].input.class)

                            idTextArea = $(options.idOrClass+" ."+options.objInput[key].input.class).attr('id')

                            if (options.objDetail[key]){
                                $(options.idOrClass+" ."+options.objInput[key].input.class).val(options.objDetail[key])
                            }
                            if (CKEDITOR.instances[idTextArea] != undefined) {
                                CKEDITOR.remove(CKEDITOR.instances[idTextArea]);
                            }
                            
                            CKEDITOR.replace(idTextArea, {
                                language: png.ArrLS.Language.get()
                            });
                            
                        }
                        if (options.action==2){
                            idTextArea = $(options.idOrClass+" ."+options.objInput[key].input.class).attr('id')

                            if (options.objInput[key].IsRtn)
                                objReturn[key] = CKEDITOR.instances[idTextArea].getData()
                        }
                    }
                }
                if (options.action==2){
                    options.objInput[key].idOrClassCheck = options.idOrClass+" ."+key
                    options.objInput[key].idOrClassCheckFocus = options.idOrClass+" ."+key
                }
            }

            if(IsInputVal){
                if (options.action==1){
                    if (options.objDetail[key]!=null && options.objDetail[key]!=undefined)
                        $(options.idOrClass+" ."+options.objInput[key].input.class).val(options.objDetail[key])

                    if(options.objDetail[key] && options.objInput[key].input.IsNoInput && options.objInput[key].input.IsViewDtl)
                        $(options.idOrClass+" .pnElm-"+options.objInput[key].input.class).html(options.objDetail[key])

                    if( options.objInput[key].input && options.objInput[key].input.IsNoInput && !options.objInput[key].input.IsViewDtl){
                        if(options.objInput[key].OnLoadHtml){
                            options.objInput[key].OnLoadHtml(options.idOrClass+" .pnElm-"+options.objInput[key].input.class)
                        }
                    }
                }

                if (options.action==2){
                    if (options.objInput[key].input && !options.objInput[key].input.IsNoInput && options.objInput[key].IsRtn){
                        objReturn[key] = $(options.idOrClass+" ."+options.objInput[key].input.class).val()
                        if(objReturn[key])
                            objReturn[key] = objReturn[key].replace(/  +/g, ' ').trim()

                        options.objInput[key].idOrClassCheck = options.idOrClass+" ."+key
                        options.objInput[key].idOrClassCheckFocus = options.idOrClass+" ."+key
                    }else{
                        options.objInput[key].idOrClassCheck = options.idOrClass+" .pnElm-"+key
                        options.objInput[key].idOrClassCheckFocus = ''
                    }
                }
            }
        })
        //-------------------------CHECK VALUE-------------------------------
        if (options.action==2){
            var IsCheckSs = true

            var idOrClassFocus = ''
            var keyInputFocus = ''
            var intChkInputAjax = 0
            var intChkInputAjaxSs = 0
            Object.keys(options.objInput).reverse().forEach(function(val,key){
                var IsCheckInputSs = true

                if(options.objInput[val].idOrClassCheckFocus)
                    pngElm.ChangeSttInput({
                        idOrClassInput: options.objInput[val].idOrClassCheck,
                        IsHasStt: false
                    })

                var objValidate = $.pngExtendObj(objDefaultInput.validate,options.objInput[val].validate)
                
                var valRtn = null

                if(val.indexOf('_')!=-1){
                    if(objReturn[val.split('_')[0]] && objReturn[val.split('_')[1]] ){

                        valRtn = objReturn[val.split('_')[0]]+'-'+objReturn[val.split('_')[1]]
                    }
                    
                }else if(options.objInput[val].input && options.objInput[val].input.IsNoInput && !options.objInput[val].idOrClassCheckFocus){
                    if(options.objInput[val].OnRtn ){
                        valRtn = options.objInput[val].OnRtn()
                        options.objInput[val].idOrClassCheckFocus = options.idOrClass+" .pnElm-"+val
                    }else{
                        valRtn = 0
                    }
                }else{
                    valRtn = objReturn[val]
                }

                if(options.objInput[val].isRequire && options.objInput[val].idOrClassCheckFocus){
                    if(!valRtn){
                        ErrorValidation(objValidate.confirmRequire)
                        
                        keyInputFocus = key
                        IsCheckInputSs = false
                        idOrClassFocus = options.objInput[val].idOrClassCheckFocus
                    }
                }
                if(objValidate.format && valRtn){
                    if( !objValidate.format.test(valRtn) ) {
                        ErrorValidation(objValidate.confirmFormat)
                            
                        keyInputFocus = key
                        IsCheckInputSs = false
                        idOrClassFocus = options.objInput[val].idOrClassCheckFocus
                    }
                }

                
                var arrValidateEx = null
                if(options.objInput[val].arrValidateEx){
                    arrValidateEx = options.objInput[val].arrValidateEx
                    arrValidateEx.forEach(function(valValidateEx,keyValidateEx){
                        arrValidateEx[keyValidateEx] = $.pngExtendObj(objDefaultInput.arrValidateEx[0],valValidateEx)
                    })
                }
                if(IsCheckInputSs && arrValidateEx){

                    var intTotal = arrValidateEx.length

                    if(intTotal){
                        GetCheckValue(arrValidateEx[0],0)
                    }

                    function GetCheckValue(_ObjVal,_intKey){
                        if(_ObjVal.IsCheckSS && _ObjVal.IsCheckSS.toString().replace(/\s+/g,'')!="function(){}"){
                            if(!_ObjVal.IsCheckSS.call(this,valRtn)){

                                ErrorValidation(_ObjVal.strConfirm)
                                
                                keyInputFocus = key
                                idOrClassFocus = options.objInput[val].idOrClassCheckFocus
                            }else{
                                if((_intKey+1) < intTotal)
                                    GetCheckValue(arrValidateEx[_intKey+1],_intKey+1)
                            }
                        }else if(_ObjVal.IsCheckSSAjax && _ObjVal.IsCheckSSAjax.toString().replace(/\s+/g,'')!="function(){}"){
                            
                            intChkInputAjax++
                            _ObjVal.IsCheckSSAjax.call(this,valRtn
                                ,function(_IsSuccess,_strCfm){
                                    intChkInputAjaxSs++
                                    if(!_IsSuccess){
                                        var strCfm = _ObjVal.strConfirm
                                        if(_strCfm)
                                            strCfm = _strCfm

                                        ErrorValidation(strCfm)

                                        if(keyInputFocus < key){
                                            idOrClassFocus = options.objInput[val].idOrClassCheckFocus
                                            keyInputFocus = key
                                        }
                                        
                                        fctSsAll()
                                    }else{
                                        if((_intKey+1) < intTotal)
                                            GetCheckValue(arrValidateEx[_intKey+1],_intKey+1)
                                        else
                                            fctSsAll()
                                    }
                                    function fctSsAll(){
                                        if(intChkInputAjax==intChkInputAjaxSs){
                                            fctSs()
                                        }
                                    }
                                }
                            )

                        }
                    }

                }

                
                function ErrorValidation(strConfirm){
                    IsCheckSs = false
                    pngElm.ChangeSttInput({
                        idOrClassInput: options.objInput[val].idOrClassCheck,
                        strConfirm: strConfirm,
                        IsHasStt: true
                    })
                }



                
                
            })

            if(!intChkInputAjax)
                return fctSs()
            
            function fctSs(){
                if(idOrClassFocus){
                    if($.modal.popup.count())
                        $("#pnModalsPopup_" + ($.modal.popup.count())).scrollTop($(idOrClassFocus).offset().top-$("#pnModalsPopup_" + ($.modal.popup.count())+' .modal-body').height()/2);
                    else
                        $(window).scrollTop($(idOrClassFocus).offset().top-$(window).height()/2);
                    $(idOrClassFocus).focus()
                }
                
                if(IsCheckSs){
                    options.OnChkSuccess.call(this,objReturn)
                    if(!intChkInputAjax)
                        return objReturn
                
                }else{
                    options.OnChkSuccess.call(this,null)
                    return null
                }
                
                pngElm.ChangeLanguage()
            }
        }
        
        if (options.action==1){
            $(options.idOrClass + ' .input-range').each(function(){
                var value = $(this).attr('data-slider-value');
                var separator = value.indexOf(',');
                if( separator !== -1 ){
                    value = value.split(',');
                    value.forEach(function(item, i, arr) {
                        arr[ i ] = parseFloat( item );
                    });
                } else {
                    value = parseFloat( value );
                }
                $(this).slider({
                    min: parseFloat($(this).attr('data-slider-min')),
                    max: parseFloat($(this).attr('data-slider-max')), 
                    range: $(this).attr('data-slider-range'),
                    value: value,
                    tooltip_split: $(this).attr('data-slider-tooltip_split'),
                    tooltip: $(this).attr('data-slider-tooltip')
                });
                if(parseFloat($(this).attr('data-slider-max')) - value[1] > 0 && separator !== -1 ){
                    value[1] = value[1]+parseFloat($(this).attr('data-slider-step'))
                    $(this).val(value)
                    $(this).slider({max:value[1]})
                }
            });
            $(options.idOrClass + ' .input-range').change(function(){
                var className = '.' + $(this).parent().attr('class')
                if($(this).attr('data-slider-value').indexOf(',') !== -1){
                    $(className+' span.range.from').text($.pngFormatNumber(this.value.split(',')[0]))
                    $(className+' span.range.to').text($.pngFormatNumber(this.value.split(',')[1]))
                }else{
                    $(className+' span.range.from').text($.pngFormatNumber(this.value))
                    
                }
            }).change()

        }
        function InsertHtml(idOrClass,strHtml){
            if (options.action==1){
                $(idOrClass).html(strHtml);
            }
        }

    }


    var _getTable = function (options) {
        var defaults = {
            objCols: {
                strDefault: {name:'Default'
                    ,input:{type:'text',classEx:'form-control',attr:''}
                    ,dropDown:{IsSelect2:false,arrList:[{'key':'value'}]}
                    ,datePicker:{todayHighlight: true,format: 'dd/mm/yyyy'}
                    // ,listButton:[]
                    // ,evtChange:function(){}
                    // ,evtClick:function(){}
                }
            }
            ,IsTDInput:true
            ,editTableInput:function(){}
            ,changeCkbMaster:function(){}
            ,changeInput:function(){}
            ,arrTbl: []
            ,page:{
                intCurPage:1,intPageSize:10,strColTotal:'intTotalRecords'
                ,changePage:function(){

                }
            }
            ,idOrClass:'#Default'
        }
        var objDefaultInput = defaults.objCols.strDefault
        options = $.extend(defaults, options);

        var arrReturnTable = JSON.parse(JSON.stringify(options.arrTbl))

        if(options.IsTDInput){
            var objCheckEdit = {IsEnableInput:{name:'<input type="checkbox" class="IsEnableInputAll">'
            ,input:{type:'checkbox',classEx:'',attr:'chkboxMaster="true"'}}
            }
            objCheckEdit = ("{"+JSON.stringify(objCheckEdit)+"}").replace("{{","").replace("}}","")

            options.objCols = JSON.parse(JSON.stringify(options.objCols).replace("{","{"+objCheckEdit+","))

            Object.keys(options.objCols).forEach(function(value){
                if(options.objCols[value].input){
                    var objInput = $.pngExtendObj(objDefaultInput.input,options.objCols[value].input)
                    objInput.class = value
                    var Attr =objInput.attr
                    arrReturnTable.forEach(function(valArrTbl,keyArrTbl){
                        objInput.attr = Attr +" data='"+keyArrTbl+"'"
                        valArrTbl[value] = pngElm.getInputs(objInput)
                    })
                }

            })
        }else{
            Object.keys(options.objCols).forEach(function(value){
                
                if(('@'+value).indexOf('@Is') >= 0 ){
                    arrReturnTable.forEach(function(valArrTbl){
                        valArrTbl[value] = (valArrTbl[value]? '<i class="fa fa-check-circle" style="color:#656565;font-size:20px"></i>' : '<i class="fa fa-times-circle-o" style="color:#a2a2a2;font-size:20px"></i>')
                    })
                }
                if(options.objCols[value].input){
                    var objInput = $.pngExtendObj(objDefaultInput.input,options.objCols[value].input)


                    if(value == "IsEnableInput"){
                        objInput.class = value
                        var Attr =objInput.attr
                        arrReturnTable.forEach(function(valArrTbl,keyArrTbl){
                            objInput.attr = Attr +" data='"+keyArrTbl+"'"
                            valArrTbl[value] = pngElm.getInputs(objInput)
                        })
                    }

                }

            })
        }

        var strHtmlTable = ""

        strHtmlTable+= pngElm.getTable({arrCols: options.objCols,arrTbl: arrReturnTable});

        $(options.idOrClass).html("<div class='table'>"+strHtmlTable+"</div>")

        if(options.page){
            $(options.idOrClass).append("<div id='pnPadding' style='margin-bottom: 20px;display:flow-root'></div>")
            if(options.page.intCurPage != 1 || arrReturnTable.length)
                $.WebPaging({
                    intCurrentPage: options.page.intCurPage,
                    intPageSize: options.page.intPageSize,
                    intTotalRecode: (arrReturnTable.length? arrReturnTable[0][options.page.strColTotal] : 0),
                    strControlID: options.idOrClass+" #pnPadding",
                    ChangePages: function (intCurrPage, intPageSize) {
                        options.page.changePage.call(this,intCurrPage, intPageSize)
                    }
                });
        }


        if(options.IsTDInput){

            Object.keys(options.objCols).forEach(function(value){

                if(options.objCols[value].dropDown){
                    var objDropDown = $.pngExtendObj(objDefaultInput.dropDown,options.objCols[value].dropDown)
                    var strHtmlOption = ""
                    objDropDown.arrList.forEach(function(value){
                        strHtmlOption += "<option value='"+Object.keys(value)+"'>"+value[Object.keys(value)]+"</option>"
                    })
                    $(options.idOrClass + ' .' +value).html(strHtmlOption)
                }
    
                if(options.objCols[value].input){
                    options.arrTbl.forEach(function(valArrTbl,keyArrTbl){
                        if(options.objCols[value].input.type == "checkbox"){
                            $(options.idOrClass + ' .' +value+'[data='+keyArrTbl+']').attr('checked',valArrTbl[value])
                            
                        }else if(options.objCols[value].datePicker){
                            var objDatePicker = $.pngExtendObj(objDefaultInput.datePicker,options.objCols[value].datePicker)
                            
                            $(options.idOrClass+' .'+value).datepicker({
                                todayHighlight: objDatePicker.todayHighlight,
                                format: objDatePicker.format
                            });
                            var classInput = options.idOrClass+' .'+value+'[data='+keyArrTbl+']'
    
                            if(valArrTbl[value]){
                                var dtmDate = valArrTbl[value]
    
                                if(dtmDate.indexOf('Date')>-1){
                                    dtmDate = parseInt(dtmDate.substr(6))
                                    valArrTbl[value] = moment(dtmDate).format('l')
                                }
                                
                                $(classInput).datepicker('setDate',new Date(dtmDate))
                            }
                
                        }
                        else{
                            $(options.idOrClass + ' .' +value+'[data='+keyArrTbl+']').val(valArrTbl[value])
                        }
                        if(options.objCols[value].input.type == "text"){
                            
                            if($(options.idOrClass + ' .' +value+'[data='+keyArrTbl+']').attr('input-fn')){
                                $(options.idOrClass + ' .' +value+'[data='+keyArrTbl+']').getFormatNumberInput($(options.idOrClass + ' .' +value+'[data='+keyArrTbl+']').attr('IsDecimal'))
                            }
                            
                        }
    
    
                    })
                }
            })



            options.editTableInput.call()

            pngElm.CheckboxItemAndAll({idOrClass: options.idOrClass,
                idOrClassChkItem:'.IsEnableInput',
                idOrClassChkAll:'.IsEnableInputAll'
            })

            if(options.changeInput.toString().replace(/\s+/g,'')!="function(){}" || options.changeCkbMaster.toString().replace(/\s+/g,'')!="function(){}")
                $(options.idOrClass+' .table tbody').find('input,select,textarea').change(function(){
                    var chkboxMaster = $(this).attr('chkboxMaster')
                    var data = $(this).attr('data')
                    
                    var strClass = $(this).attr('class')
                    strClass = strClass.substr(0,strClass.indexOf(" "))

                    if(chkboxMaster){
                        options.arrTbl[data][strClass] = this.checked
                        $(options.idOrClass).find('input[chkboxMaster!="true"][data='+data+'],select[data='+data+'],textarea[data='+data+']').attr('disabled',!this.checked)
                        options.changeCkbMaster.call(this,this.checked,data)

                    }else if(strClass != ''){
                        options.arrTbl[data][strClass] = this.value

                        if($(this).attr('input-fn')){
                            options.arrTbl[data][strClass] = this.value.replace(/,/g,'')
                        }
                        if(options.objCols[strClass] && options.objCols[strClass].datePicker){
                            options.arrTbl[data][strClass] = this.value? moment($(this).datepicker('getDate')).format('l'): null
                        }
                        if(options.objCols[strClass] && options.objCols[strClass].input.type == 'checkbox'){
                            options.arrTbl[data][strClass] = this.checked
                        }

                        options.changeInput.call(this,strClass,data)
                    }
                }).change()


        }
        pngElm.ChangeLanguage()
    }

    var _getListArrOrObjValue = function (options) {
        var defaults = {
            setListValue:{
                arrOrObjDefault: {
                    getPost:{url: "",data: {}}
                    ,getSQL:{strTableName: "",strFeildSelect: "",strWhere: ""}
                    ,getValCode:{strCombocode: "",strWhere: ""}
                    ,OnSuccessItem:function(){}
                }
            },
            strListKeyArr:null,
            OnSuccessList:function(){}
        }
        var objDefault = defaults.setListValue.arrOrObjDefault

        options = $.extend(defaults, options);

        var ObjListValue = {}
        if(options.strListKeyArr){
            options.strListKeyArr.split(',').forEach(function(value){
                ObjListValue[value] = options.setListValue[value]
            })
        }else{
            ObjListValue = options.setListValue
        }

        var checkGetListValue = 0
        var ObjListArr = {}

        if(options.strListKeyArr!=''){

            Object.keys(ObjListValue).forEach(function(value){
                var objItem = ObjListValue[value]
                if(JSON.stringify(objItem.getPost)!='{}' && objItem.getPost){
                    var objPost = $.pngExtendObj(objDefault.getPost,objItem.getPost)
                    png.post({
                        url: objPost.url,
                        data: objPost.data,
                        OnSuccess: function (data) {
                            ObjListArr[value] = objItem.OnSuccessItem.call(this,data)
                            OnSuccessList()
                        }
                    })
                }
                if(JSON.stringify(objItem.getSQL)!='{}' && objItem.getSQL){
                    var objSQL = $.pngExtendObj(objDefault.getSQL,objItem.getSQL)
                    $.GetServerDataBySQL({
                        strTableName: objSQL.strTableName
                        ,strFeildSelect: objSQL.strFeildSelect
                        ,strWhere: objSQL.strWhere
                        ,OnSuccess: function (data) {
                            ObjListArr[value] = objItem.OnSuccessItem.call(this,data)
                            OnSuccessList()
                        }
                    })
                }
                if(JSON.stringify(objItem.getValCode)!='{}' && objItem.getValCode){
                    var objValCode = $.pngExtendObj(objDefault.getValCode,objItem.getValCode)
                    png.postValCode({
                        strCombocode: objValCode.strCombocode,
                        strWhere: objValCode.strWhere,
                        OnSuccess: function (data) {
                            ObjListArr[value] = objItem.OnSuccessItem.call(this,data)
                            OnSuccessList()
                        }
                    })
                }
            })
        }else{
            options.OnSuccessList()
        }

        function OnSuccessList(){
            checkGetListValue ++

            if(checkGetListValue == Object.keys(ObjListValue).length){
                options.OnSuccessList.call(this,ObjListArr)
            }
        }

    }
    
    var _getPanelHtml = function (options) {
        var defaults = {
            objPanel: {}
            ,objEvtPanel: {
                pnDefault: function(){}
            }
            ,strListIdUpd:''
            ,idOrClass: ''
            ,OnChangeIdPn: function(){}
        }

        options = $.extend(defaults, options);

        var IdOrClass = options.idOrClass
        var Obj_Panel = options.objPanel 

        var Obj_All = {}

        var strHtml = ""

        GenHtml(Obj_Panel,false)
        function GenHtml(_objPanel,_IsCallFn){
            Object.keys(_objPanel).forEach(function(value){
                
                if(value!='tag' && value!='attr' && value!='childTags'){
                    var dtlPn = _objPanel[value]
                    if(!_IsCallFn){
                        strHtml+='<'+dtlPn.tag+' id="'+value+'" '+dtlPn.attr+'>'
                        
                        if(dtlPn.childTags){
                            dtlPn.childTags.forEach(function(valChildTag){
                                strHtml+='<'+Object.keys(valChildTag)[0]+' '+valChildTag[Object.keys(valChildTag)]+'>'
                            })
                            GenHtml(dtlPn,_IsCallFn)
                            JSON.parse(JSON.stringify(dtlPn.childTags)).reverse().forEach(function(valChildTag){
                                strHtml+='</'+Object.keys(valChildTag)[0]+'>'
                            })
                        }else{
                            GenHtml(dtlPn,_IsCallFn)
                        }
                        strHtml+='</'+dtlPn.tag+'>'
                    }else{
                        if (typeof options.objEvtPanel[value] != 'undefined'){
                            options.objEvtPanel[value].call(this,IdOrClass + ' #' + value,Obj_All,function(obj){
                            })
                        }
                        GenHtml(dtlPn,_IsCallFn)

                    }
                }
            })
        }
        $(IdOrClass).html(strHtml)
        GenHtml(Obj_Panel,true)
        
        options.OnChangeIdPn.call(this, function(_strListIdUpd){
            GenPanel(Obj_Panel)
            function GenPanel(_objPanel){
                Object.keys(_objPanel).forEach(function(value){
                    if(value!='tag' && value!='attr' && value!='childTags'){
                        var dtlPn = _objPanel[value]
                        if(value == _strListIdUpd){
                            // strHtml = ''
                            // if(dtlPn.childTags){
                            //     dtlPn.childTags.forEach(function(valChildTag){
                            //         strHtml+='<'+Object.keys(valChildTag)[0]+' '+valChildTag[Object.keys(valChildTag)]+'>'
                            //     })
                            //     GenHtml(dtlPn,false)
                            //     JSON.parse(JSON.stringify(dtlPn.childTags)).reverse().forEach(function(valChildTag){
                            //         strHtml+='</'+Object.keys(valChildTag)[0]+'>'
                            //     })
                            // }else{
                            //     GenHtml(dtlPn,false)
                            // }
                            // $(IdOrClass + ' #' + value).html(strHtml)

                            var obj = {}
                            obj[value] = dtlPn
                            GenHtml(obj,true)
                        }else{
                            GenPanel(dtlPn)
                        }
    
                    }
                })
            }

            
            
        })
    }



    var _getTable2 = function (options) {
        var defaults = {
            objApi:{
                strApiLink: ''
                ,objParams:{

                }
            }
            ,objParams_Cus:{}
            ,editRltArr: function(){}
            ,editRlt: function(){}
            ,objCols: {
                strDefault: {name:'Default',IsViewInputWhenCheck:true
                    ,input:{}
                    ,list_input:{}
                }
            }
            ,customEvent:function(){}
            ,changeCkbMaster:function(){}
            ,changeInput:function(){}
            ,IsViewCheckBoxMain:true
            ,idOrClass:'#Default'
        }
        options = $.extend(defaults, options);

        var ObjParams = null
        if(options.objApi)
            ObjParams = $.pngReplaceObj(options.objApi.objParams,options.objParams_Cus) 
        
        var ArrTblAll = []
        var ArrTblList_OLD = []
        var ArrTblList = []

        var intCurPage = null
        var intPageSize = null
        if(ObjParams){
            intCurPage = ObjParams.intCurPage
            intPageSize = ObjParams.intPageSize
        }

        var IsTDInput = false

        
        GetMain()
        function GetMain(){

            if(ObjParams){
                ObjParams.intCurPage = intCurPage
                ObjParams.intPageSize = intPageSize
    
                png.postListApiGetValue({           // Post list các Api phía trên và lấy về dữ liệu
                    objList_Api: {
                        Arr_API:{   // Tên api
                            strApiLink: options.objApi.strApiLink // api/eeeeeeee: route Prefix
                            ,objParams: ObjParams
                        }
                    }            // Tên các Object api đã khai báo phía trên 
                    ,objListApi_RtnVal: {           // Giá trị nhận về từ API
                        'Arr_API':{               // Tên api tương ứng với giá trị trả về
                            objParams_Cus:{}
                            ,OnSuccess: function(data){
                                ArrTblAll = JSON.parse(data)
                                if(ObjParams.tblsReturn && ObjParams.tblsReturn.indexOf('][')==-1 ){
                                    ArrTblList = eval('JSON.parse(data)'+ (ObjParams.tblsReturn))
                                    ArrTblList_OLD = eval('JSON.parse(data)'+(ObjParams.tblsReturn))
                                }else{
                                    ArrTblList = eval('JSON.parse(data)[0]')
                                    ArrTblList_OLD = eval('JSON.parse(data)[0]')
                                }
                                GetList()
                            }
                        }
                    }
                })
            }else{
                GetList()
            }
            
            function GetList(){

                if(options.editRltArr.toString().replace(/\s+/g,'')!="function(){}"){
                    ArrTblList = options.editRltArr(ArrTblList,ArrTblAll)
                }
                            
                if(options.IsViewCheckBoxMain){
                    var objCheckEdit = {IsEnableInput:{name:'<input type="checkbox" class="IsEnableInputAll">'
                        ,input:{type:'checkbox',classEx:'',attr:'chkboxMaster="true"'}}
                    }
                    // objCheckEdit = ("{"+JSON.stringify(objCheckEdit)+"}").replace("{{","").replace("}}","")
            

                    objCheckEdit = $.pngExtendObj(objCheckEdit,options.objCols,true)

                    options.objCols = objCheckEdit
                }

                if(options.editRlt){
                    if(!options.objApi)
                        console.log(( options.objApi? options.objApi.strApiLink : '' ),ArrTblList)
                    if(ArrTblList.length){
                        var obj = {}
                        Object.keys(ArrTblList[0]).forEach(function (val) {
                            obj[val] = { name: val.replace(/str/g,'').replace(/int/g,'').replace(/dbl/g,'') }
                        })
                        console.log({'cols':JSON.stringify(obj,null,2)})
                    }

                    ArrTblList.forEach(function (valTbl, keyTbl) {

                        Object.keys(options.objCols).forEach(function(val_Col){
                            if(val_Col != 'IsEnableInput' && options.objCols[val_Col].OnGetVal){
                                valTbl[val_Col] = options.objCols[val_Col].OnGetVal(valTbl)
                            }
                        })

                        options.editRlt(valTbl,keyTbl)
                    })
                }
                
                ArrTblList_OLD = JSON.parse(JSON.stringify(ArrTblList))


                var Page = null
                if(intCurPage && intPageSize){
                    Page = {
                        intCurPage:intCurPage,intPageSize:intPageSize,strColTotal:'intTotalRecords'
                        ,changePage:function(intCur,intPs){
                            intCurPage = intCur
                            intPageSize = intPs
                            GetMain()
                        }
                    }
                }
                GetTable()
                function GetTable(){
                    pngPn.getTable({
                        objCols: options.objCols
                        , IsTDInput: false
                        , arrTbl: ArrTblList
                        , page: Page
                        , idOrClass: options.idOrClass
                    })

                    ArrTblList.forEach(function(value,key){

                        Object.keys(options.objCols).forEach(function(val_Col){
                            if(val_Col != 'IsEnableInput'){
                                
                                if( (!IsTDInput && !options.objCols[val_Col].IsViewInputWhenCheck)
                                    || (IsTDInput)
                                ){
                                    var ObjDtl = options.objCols[val_Col]
                                    var objInput = {}

                                    if(ObjDtl.input && Object.keys(ObjDtl.input).length){
                                        objInput[val_Col] = ObjDtl.input
                                    }else if(ObjDtl.list_input && Object.keys(ObjDtl.list_input).length){
                                        objInput = ObjDtl.list_input
                                    }

                                    if(objInput && Object.keys(objInput).length)
                                        pngPn.getForm({
                                            action: 1,
                                            objInput: objInput,
                                            idOrClass: options.idOrClass + ' .pn-'+val_Col+'[row='+key+']',
                                            objDetail: value
                                        })

                                }
                                
                            }else{
                                $(options.idOrClass).find('.'+val_Col+'[data='+key+']').attr('checked',value[val_Col])
                            }
                        })
                        
                    })


                    


                    if( options.changeCkbMaster.toString().replace(/\s+/g,'')!="function(){}"){
                        if(options.IsViewCheckBoxMain){

                            $(options.idOrClass+' .table thead .IsEnableInputAll').change(function(){
                                if(!IsTDInput && this.checked){
                                    ArrTblList.forEach(function(value){
                                        value['IsEnableInput'] = true
                                    })
                                    IsTDInput = true
                                    GetTable()
                                    // $(this).change()
                                }
                                if(IsTDInput && !this.checked){
                                    ArrTblList.forEach(function(value){
                                        value['IsEnableInput'] = false
                                    })
                                    IsTDInput = false
                                    GetTable()
                                    $(this).focus()
                                }else if(IsTDInput && this.checked){
                                    ArrTblList.forEach(function(value){
                                        value['IsEnableInput'] = true
                                    })
                                }
        
        
                            })
                            $(options.idOrClass+' .table tbody').find('input[chkboxMaster="true"]').change(function(e){
                                var data = $(this).attr('data')
                                var strClass = $(this).attr('class')
                                strClass = strClass.substr(0,strClass.indexOf(" ")).trim()
                                var IsFocus = false
        
                                $(options.idOrClass + ' tr[row='+data+']').find('input[chkboxMaster!="true"],select,textarea').attr('disabled',!this.checked)
                                
                                if(typeof e.originalEvent != 'undefined'){
                                    
                                    ArrTblList[data][strClass] = this.checked
                                    
                                    if(IsTDInput != ($(options.idOrClass+' .table tbody input[chkboxMaster="true"]:checked').length? true: false)){
                                        IsTDInput = ($(options.idOrClass+' .table tbody input[chkboxMaster="true"]:checked').length? true: false)
                                        if(!IsTDInput){
                                            // ArrTblList[data] = JSON.parse(JSON.stringify(ArrTblList_OLD[data]))
                                            ArrTblList = JSON.parse(JSON.stringify(ArrTblList_OLD))
                                            ArrTblList.forEach(function(value){
                                                value.IsEnableInput = false
                                            })
                                        }else{
                                            IsFocus = true
                                        }
                                        GetTable()
                                    }
                                    if(IsFocus){
                                        $(options.idOrClass+' .table tbody').find('input[chkboxMaster="true"][data='+data+']').focus()
                                    }
                                }else{
                                    IsTDInput = ($(options.idOrClass+' .table tbody input[chkboxMaster="true"]:checked').length? true: false)    
                                }
                                options.changeCkbMaster.call(this,this.checked,data,ArrTblList,e)
                                    
                            }).change()
                        }else{
                            options.changeCkbMaster.call(this,undefined,undefined,ArrTblList,undefined)
                        }


                    }

                    
                    options.customEvent(options.idOrClass,{
                        intCurPage : intCurPage,
                        intPageSize : intPageSize,
                    })


                    pngElm.CheckboxItemAndAll({idOrClass: options.idOrClass,
                        idOrClassChkItem:'.IsEnableInput',
                        idOrClassChkAll:'.IsEnableInputAll'
                    })
                    


                    $(options.idOrClass+' .table tbody').find('input[chkboxMaster!=true],select,textarea').change(function(){
                        var chkboxMaster = $(this).attr('chkboxMaster')
                        var data = $(this).parents('tr').attr('row')
                        var type = $(this).attr('type')
                        
                        var strClass = $(this).attr('class')
                        strClass = strClass.substr(0,strClass.indexOf(" "))

                        if(!chkboxMaster && strClass != ''){
                            ArrTblList[data][strClass] = this.value

                            if($(this).attr('input-fn')){
                                ArrTblList[data][strClass] = this.value.replace(/,/g,'')
                            }
                            if($(this).attr('class').indexOf("hasDatepicker") >= 0){
                                ArrTblList[data][strClass] = this.value? moment($(this).datepicker('getDate')).format('l'): null
                            }
                            if($(this).attr('input-fn')=="true"){
                                ArrTblList[data][strClass] = this.value.replace(/,/g,'')
                            }

                            if(type == 'checkbox'){
                                ArrTblList[data][strClass] = this.checked
                            }
                        }
                    }).change()
                } 
            }
        }
    }




    var _getOutputApi = function (options) {
        var defaults = {
            objApi:{}
            ,objParams_Cus:{}
            ,customEvent:function(){}
        }
        options = $.extend(defaults, options);

        var objRtn = JSON.parse(JSON.stringify(options.objApi.objParams))

        Object.keys(options.objParams_Cus).forEach(function (valCol) {
            if (typeof objRtn[valCol] != 'undefined')
                objRtn[valCol] = options.objParams_Cus[valCol]
        })
        png.post({
            url: options.objApi.strApiLink, data: { strJson: JSON.stringify(objRtn) }
            , OnSuccess: function (data) {
                options.customEvent(JSON.parse(data))
            }
        })


    }

    var _getListHtmlForArr = function (options) {
        var defaults = {
            idOrClass:''
            ,ArrList:[]
            ,OnHtmlItem: function () {
    
            }
            ,customEvent:function(){}
        }
        options = $.extend(defaults, options);

        var strHtml = ''
        if(options.idOrClass){
            options.ArrList.forEach(function(value){
                strHtml+= options.OnHtmlItem(value)
            })
            $(options.idOrClass).html(strHtml)
        }
        options.customEvent(options.ArrList)
    }


    var _getPopUp = function (options) {
        var defaults = {
            strTitle: ''
            , intTypeSize:2
            , OnPanel: function(){

            }
            , OnClosePopUp: function () {
            }
        }

        options = $.extend(defaults, options);

        var idOrClass = Math.random().toString(36).substring(4).toUpperCase()

        var IsChange = false

        var strHtml = ""
        strHtml += "<div id='" + idOrClass + "'>"
        strHtml += "</div>"
        $.modal.popup({
            title: options.strTitle
            , content: strHtml, size: options.intTypeSize
            , OnClose: function () {
                if (IsChange) {
                    options.OnClosePopUp.call()
                }
            }
        });
        idOrClass = '#' + idOrClass

        options.OnPanel.call(this,idOrClass,OnClosePp = function(_IsChange = false,_IsClosePp = false){
            IsChange = _IsChange
            if(_IsClosePp){
                $.modal.popup.remover()
            }
        })


    }

    var _getPopUpPrint = function (options) {
        var defaults = {
            idOrClass: ''
            ,strHtml: ''
        }

        options = $.extend(defaults, options);

        var myframe = document.createElement('IFRAME');
        myframe.domain = document.domain;
        myframe.style.position = "absolute";
        myframe.style.top = "-10000px";
        document.body.appendChild(myframe);
        setTimeout(function(){
            if(options.strHtml)
                myframe.contentDocument.write(options.strHtml) ;
            else
                myframe.contentDocument.write($(options.idOrClass).html()) ;
            myframe.focus();
            myframe.contentWindow.print();
            myframe.parentNode.removeChild(myframe) ;// remove frame
        },100); // wait for images to load inside iframe
        window.focus();
    }


    var _getPopUpLibMedia = function (options) {
        var defaults = {
            strUserGUID:null,
            objSupplierDetail:null,
            objTourDetail:null,
            IsSelectOne:null,
            IsSelectAll:null,
            OnClose: function(){

            },
            OnSuccess:function(){

            },
        }
        options = $.extend(defaults, options);

        var IdOrClass_Main = ''

        var Str_pathRoot = ''
        
        if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_Management) >= 0)
        {
            Str_pathRoot = 'PNG-Admin'
        }
        else if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_Guide) >= 0)
        {
            Str_pathRoot = 'Guide/'+JSON.parse(png.ArrLS.UserDetail.get()).strGDUserGUID
        }
        else if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_Pub) >= 0)
        {
            Str_pathRoot = 'Traveller/'+JSON.parse(png.ArrLS.UserDetail.get()).strTLUserGUID
        }
        // else if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_Traveller) >= 0)
        // {
        //     Str_pathRoot = 'Traveller/'+JSON.parse(png.ArrLS.UserDetail.get()).strTLUserGUID
        // }
        else if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_Agent) >= 0)
        {
            if(JSON.parse(png.ArrLS.UserDetail.get()).strCompanyGUID){
                Str_pathRoot = 'Agent/'+JSON.parse(png.ArrLS.UserDetail.get()).strCompanyCode
            }else{
                Str_pathRoot = 'Member/'+JSON.parse(png.ArrLS.UserDetail.get()).strUserGUID
            }
        }
        else if(window.location.href.indexOf(png.ObjClnUrl.APPB2B_AgentHost) >= 0)
        {
            Str_pathRoot = 'AgentHost/'+JSON.parse(png.ArrLS.UserDetail.get()).strCompanyCode
        }


        if(options.objSupplierDetail){
            Str_pathRoot = 'Supplier/'+options.objSupplierDetail.strCateName+'/'+options.objSupplierDetail.strLocationCode.substr(0,2)+'/'+options.objSupplierDetail.strSupplierCode
        }

        //---------Obj_XXX
        //---------Arr_XXX
        //---------Is_XXX
        //---------Int_XXX
        //---------Str_XXX


        var ObjList_Api = {
            GetListMedia:{
                strApiLink: png.getServerImgURL('api/system/GetListMedia')
                ,objParams:{
                    pathRoot:Str_pathRoot
                    ,path: null
                }
            }
            ,AddFolderMedia:{
                strApiLink:png.getServerImgURL('api/system/AddFolderMedia')
                ,objParams:{
                    pathRoot:Str_pathRoot
                    ,path: null
                    ,newName:null
                }
            }
            ,UpdRenameFolderOrFileMedia:{
                strApiLink:png.getServerImgURL('api/system/UpdRenameFolderOrFileMedia')
                ,objParams:{
                    pathRoot:Str_pathRoot
                    ,path: null
                    ,fileName: null
                    ,newName:null
                }
            }
            ,DelFolderOrFileMedia:{
                strApiLink:png.getServerImgURL('api/system/DelFolderOrFileMedia')
                ,objParams:{
                    pathRoot:Str_pathRoot
                    ,path: null
                    ,fileName: null
                }
            },

            //--------Supplier
            GetListSupplierImageFile:{  
                strApiLink:'api/supplier/GetListSupplierImageFile' 
                ,objParams:{
                    strUserGUID : options.strUserGUID
                    ,strSupplierImageFileGUID: null
                    ,strSupplierGUID: null
                    ,strItemTypeGUID: null
                    ,strSupplierImageFileLink: null
                
                    ,intCurPage: null
                    ,intPageSize: null
                    ,strOrder: null
                    ,tblsReturn:'[0]'
                }
            },
            
            GetListItemType:{
                strApiLink:'api/supplier/GetListItemType'
                ,objParams:{
                    strUserGUID: options.strUserGUID
                    ,strItemTypeGUID: null
                    ,strSupplierGUID: null
                    ,strFilterItemTypeName: null
                    ,intCurPage: null
                    ,intPageSize: null
                    ,strOrder: null
                    ,tblsReturn: '[0]'
                }
            },
            AddSupplierImageFile:{  
                strApiLink:'api/supplier/AddSupplierImageFile' 
                ,objParams:{
                    strUserGUID : options.strUserGUID
                    ,strSupplierGUID: null
                    ,strItemTypeGUID: null
                    ,strSupplierImageFileLink: null
                }
            },

            UpdSupplierImageFile:{  
                strApiLink:'api/supplier/UpdSupplierImageFile' 
                ,objParams:{
                    strUserGUID : options.strUserGUID
                    ,strSupplierImageFileGUID: null
                    ,strSupplierImageFileLink: null
                    ,IsActive: null
                }
            },
            
            DelSupplierImageFile:{  
                strApiLink:'api/supplier/DelSupplierImageFile' 
                ,objParams:{
                    strUserGUID : options.strUserGUID
                    ,strSupplierImageFileGUID: null
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

        
        var Arr_ListFolder = []
        var Arr_ListFile = []

        var Str_Brdcum = ''

        var Obj_FN_Main = {}
        
        GetPopUp()

        function GetPopUp(){
            pngPn.getPopUp({
                strTitle: 'Media Library'
                , intTypeSize:3
                , OnPanel: GetMainPanel
                , OnClosePopUp: function () {
                    options.OnClose.call()
                }
            })
        }

        function GetMainPanel(_IdOrClassPp,_OnClosePp){

            IdOrClass_Main = _IdOrClassPp
            Obj_FN_Main.OnClosePp = _OnClosePp

            // Obj_FN_Main.OnClosePp(true,true)
            
            if(!options.objSupplierDetail && !options.objTourDetail){
                GetPanelDefault()
            }else{

                if(options.objSupplierDetail){

                    // if(options.objSupplierDetail.strItemTypeCode != null){
                    //     GetPanelSupplierOne()
                    // }else{
                        GetPanelSupplierAll()
                    // }

                }

            }

        }

        function GetPanelDefault(){

            var objPanel = {
                pnMain:{tag:'div',attr:'',childTags:[{div:'class="row"'}]
                    ,pnAction:{tag:'div',attr:'class="col-md-12"'}
                    ,pnBrc:{tag:'div',attr:'class="col-md-12"'}
                    ,pnGetList:{tag:'div',attr:'class="col-md-12"  style="max-height:calc(100vh - 200px);overflow:auto"'}
                    ,pnListBtn:{tag:'div',attr:'class="col-md-12 pn-margin-t-b-15"'}
                }
            }

            var objEvtPanel={}
            objEvtPanel.pnAction = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn

                var strHtmlBtn = ''
                strHtmlBtn += '<button class="btn btn-texticon bg-success txt-white"  id="btnUpload"><i class="fa fa-upload"></i><span>Upload Files</span></button> '
                strHtmlBtn += '<input type="file" id="fileUpload" style="display:none" accept="image/*" multiple/> '
                strHtmlBtn += '<button class="btn btn-texticon bg-primary txt-white" id="btnCreateFolder"><i class="fa fa-plus"></i><span>Create New Folder</span></button> '
                $(IdOrClass_Pn).html(strHtmlBtn)

                $('#btnCreateFolder',IdOrClass_Pn).click(function(){

                    pnPopUp_Actionfile({
                        path:Str_Brdcum
                        ,fileName: null
                    })
                })

                $('#btnUpload').click(function(){
                    $('#fileUpload').click()
                })
                $('#fileUpload').on('change',function(e){
                    var files =  e.target.files;
                    var data = new FormData();
                    for (var i = 0; i < files.length; i++) {
                        data.append(files[i].name, files[i]);
                        
                    }
                    png.postFiles({
                        url:png.getServerImgURL('api/system/UploadFiles?path='+Str_pathRoot+'/'+Str_Brdcum),
                        data:data,
                        OnSuccess: function(data){
                            $('#fileUpload').val('') 
                            Obj_FN_Main.pnMain('pnGetList')
                        }
                    })
                })
            }
            
            objEvtPanel.pnBrc = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn


                var strHtmlBrdcum = ''
                strHtmlBrdcum+='                <style>'
                strHtmlBrdcum+='                    #pnBrc{'
                strHtmlBrdcum+='                        padding-top: 10px;'
                strHtmlBrdcum+='                        padding-bottom: 10px;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab{'
                strHtmlBrdcum+='                        width: 33%;'
                strHtmlBrdcum+='                        border-right: 5px #fff solid;'
                strHtmlBrdcum+='                        position: relative;'
                strHtmlBrdcum+='                        color: #fff;'
                strHtmlBrdcum+='                        padding: 5px 5px 5px 15px !important;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab:not(.active){'
                strHtmlBrdcum+='                        background: #137b84 !important;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab::before,#pnBrc .tab::after{'
                strHtmlBrdcum+='                        content: "";'
                strHtmlBrdcum+='                        border-left: 10px solid #fff;'
                strHtmlBrdcum+='                        border-top: 14px solid transparent;'
                strHtmlBrdcum+='                        border-bottom: 15px solid transparent;'
                strHtmlBrdcum+='                        position: absolute;'
                strHtmlBrdcum+='                        left: 0;'
                strHtmlBrdcum+='                        top: 0;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab::after{'
                strHtmlBrdcum+='                        border-left-color: #137b84;'
                strHtmlBrdcum+='                        left: 100%;'
                strHtmlBrdcum+='                        z-index: 1;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab.active::after{'
                strHtmlBrdcum+='                        border-left-color: #09838e;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                    #pnBrc .tab:last-child{'
                strHtmlBrdcum+='                        width: 33%;'
                strHtmlBrdcum+='                        border-right: none;'
                strHtmlBrdcum+='                    }'
                strHtmlBrdcum+='                </style>'

                strHtmlBrdcum+= '<a action="" class="tab">Root</a>'
                var intNoSplitBrdcum = Str_Brdcum.split('/').length
                Str_Brdcum+="/"
                var intIndexOf = 1
                for(var i = 1;i<=intNoSplitBrdcum;i++){
                    var strPath = ""
                    var strName = ""
                    strPath = Str_Brdcum.substr(0,Str_Brdcum.indexOf("/",intIndexOf))
                    if(i==1)
                        strName = Str_Brdcum.substr(0,Str_Brdcum.indexOf("/",1))
                    else
                        strName = Str_Brdcum.substr(Str_Brdcum.indexOf("/",intIndexOf-1)+1,Str_Brdcum.indexOf("/",intIndexOf)-Str_Brdcum.indexOf("/",intIndexOf-1)-1)
                    
                    intIndexOf = Str_Brdcum.indexOf("/",intIndexOf)+1

                    if(strName)
                        strHtmlBrdcum+='<a action="'+strPath+'" class="tab">'+strName+'</a>'
                }
                // .forEach(function(val){
                //     intIndexOfBrdcum = strBrdcum.indexOf(val)
                //     strHtmlBrdcum+='<a action="'+strBrdcum.substr()+'">'+val+'</a>'
                // })

                
                $(IdOrClass_Pn).html(strHtmlBrdcum)
                $("a",IdOrClass_Pn).click(function(){
                    Str_Brdcum = $(this).attr('action')
                    Obj_FN_Main.pnMain('pnBrc')
                    Obj_FN_Main.pnMain('pnGetList')
                })

            }
            
            
            objEvtPanel.pnGetList = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn

                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetListMedia':{
                            objParams_Cus: {
                                path: Str_Brdcum
                            }
                            , OnSuccess: function(data){ 
                                
                                Arr_ListFolder = JSON.parse(data).folder
                                Arr_ListFile = JSON.parse(data).file
    
                                var strHtml = ""
                                strHtml+='<div class="row" style="height:100%" id="DropPanel">'
                                if(Arr_ListFolder){
                                    Arr_ListFolder.forEach(function(val,key){
                                        strHtml+='<div class="col-md-3 folder" style="margin-bottom:20px" action="'+val.path+'">'
                                        strHtml+='  <div style="display:flex;padding:5px;cursor:pointer">'
                                        strHtml+="      <div style='padding: 5px;height: 80px;width: 80px;border: 1px solid #f3f3f3;margin-right: 5px;'>"
                                        strHtml+='          <div style="color: #ebba16;font-size: 70px;margin-top: -15px;text-align: center;"><i class="fa fa-folder"></i></div>'
                                        strHtml+="      </div>"
                                        strHtml+='      <div style="word-break: break-all;width: calc(100% - 80px);display: inline-block">'
                                        strHtml+='          <div>'+val.name+'</div>'
                                        strHtml+='          <div><a style="cursor" fileName="'+val.name+'" class="btnRename"><i class="fa fa-pencil"></i></a> <a style="cursor" fileName="'+val.name+'" class="btnDel"><i class="fa fa-trash"></i></a></div>'
                                        strHtml+='      </div>'
                                        strHtml+='  </div>'
                                        strHtml+='</div>'
                                        if((key+1)%4==0){
                                            strHtml+='<div class="col-md-12"></div>'
                                        }
                                    })
                                }
                                if(Arr_ListFile){
                                    var intAdd = 0
                                    if(Arr_ListFolder){
                                        intAdd = Arr_ListFolder.length%4
                                    }
                                    var intKey = 0
                                    Arr_ListFile.forEach(function(val,key){
                                        var strValName = ""
                                        strValName = (val.name || '').toLowerCase()
                                        if(strValName.indexOf('.jpg')!=-1 || strValName.indexOf('.png')!=-1 || strValName.indexOf('.jpeg')!=-1){
                                            intKey++
                                            strHtml+="<div class='col-md-3 file img"+val.name.replace(/\.|\s|\(|\)/g,'')+"' style='margin-bottom:20px'>"
                                                strHtml+='<div style="display:flex;padding:5px;" path="'+val.path+'">'
                                                strHtml+="  <input type='checkbox' class='img"+val.name.replace(/\.|\s|\(|\)/g,'')+"' style='position:absolute;margin:0'>"
                                                strHtml+="  <div style='padding: 5px;height: 80px;width: 80px;border: 1px solid #f3f3f3;margin-right: 5px;'>"
                                                strHtml+='      <div class="pnImg" style="background: url(\''+png.getServerImgURL(val.path)+'\') no-repeat center;cursor:pointer;height: 100%;width: 100%;background-size: contain;"></div>'
                                                strHtml+="  </div>"
                                                strHtml+='      <div style="word-break: break-all;width: calc(100% - 80px);display: inline-block">'
                                                strHtml+='          <div title="'+val.name+'">'+val.name+'</div>'
                                                strHtml+=`          <div>
                                                                        <a style="cursor" fileName="${val.name}" pathToFile="${val.path}" class="btnCustom"><i class="fa fa-crop"></i></a> 
                                                                        <a style="cursor" fileName="${val.name}" pathToFile="${val.path}" class="btnRename"><i class="fa fa-pencil"></i></a> 
                                                                        <a style="cursor" fileName="${val.name}" class="btnDel"><i class="fa fa-trash"></i></a></div>`
                                                strHtml+='      </div>'
                                                strHtml+="</div>"
                                            strHtml+="</div>"
                                            
                                            if((intKey+intAdd)%4==0){
                                                strHtml+='<div class="col-md-12"></div>'
                                            }
                                        }
    
                                    })
                                }
                                strHtml+="</div>"
                                $(IdOrClass_Pn).html(strHtml)
                                
                                $(".folder",IdOrClass_Pn).dblclick(function(){
                                    Str_Brdcum = $(this).attr('action')
                                    Obj_FN_Main.pnMain('pnBrc')
                                    Obj_FN_Main.pnMain('pnGetList')
                                })
    
                                $(IdOrClass_Pn+" .col-md-3 .pnImg").click(function(event){
                                    if ( $(this).find('input[type=checkbox]').has(event.target).length == 0 && !$(this).find('input[type=checkbox]').is(event.target) ){
                                        $(this).parents('.col-md-3').find('input[type=checkbox]').click()
                                    }
                                })
                                $(IdOrClass_Pn+" .col-md-3 input[type=checkbox]").click(function(){
                                    var strClass = $(this).attr('class')
                                    if(this.checked)
                                        $(IdOrClass_Pn+" .col-md-3."+strClass + ">div").attr('style','display:flex;padding:5px;background:#238af5')
                                    else
                                        $(IdOrClass_Pn+" .col-md-3."+strClass+">div").attr('style','display:flex;padding:5px;')
                                })
    
                                $(IdOrClass_Pn+" .btnRename").click(function(){
    
                                    pnPopUp_Actionfile({
                                        path:Str_Brdcum
                                        ,fileName: $(this).attr('fileName')
                                        ,pathToFile: $(this).attr('pathToFile')
                                    })
    
                                })
                                
                                $(IdOrClass_Pn+" .btnCustom").click(function(){
                                    var filename=  $(this).attr('fileName')
                                    var pathToFile=  $(this).attr('pathToFile')
                                    pnPopUp_CustomImg({
                                        path:Str_Brdcum
                                        ,fileName: $(this).attr('fileName')
                                        ,pathToFile: $(this).attr('pathToFile')
                                        ,OnSuccess: function () {
                                            $(IdOrClass_Pn+" .img"+filename.replace(/\.|\s|\(|\)/g,'')+' .pnImg').attr('style','background: url(\''+png.getServerImgURL(pathToFile)+'\') no-repeat center;cursor:pointer;height: 100%;width: 100%;background-size: contain;')
                                        }
                                    })
    
                                })

                                
                                $(IdOrClass_Pn+" .btnDel").click(function(){
    
                                    var self = this
                                    $.Confirm({
                                        strContent: '<span langkey="sys_Cfm_AYS"></span>',
                                        OnSuccess: function () {
                                            png.postListApiGetValue({
                                                objList_Api: ObjList_Api
                                                ,objListApi_RtnVal: {
                                                    'DelFolderOrFileMedia':{
                                                        objParams_Cus: {
                                                            path: Str_Brdcum
                                                            ,fileName: $(self).attr('fileName')
                                                        }
                                                        , OnSuccess: function(data){ 
                                                            Obj_FN_Main.pnMain('pnGetList')
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    })
                                })
    
                                $('#DropPanel').on('dragenter', function(e) {
                                    e.preventDefault();
                                    $(this).css('border', '#39b311 2px dashed');
                                    $(this).css('background', '#f1ffef');
                                });
                        
                                $('#DropPanel').on('dragover', function(e) {
                                    e.preventDefault();
                                });
                                $('#DropPanel').mouseover( function(e) {
                                //     // if ( e.target.className == "grid-lib" ) {
                                        // $(this).removeAttr('style');
                                //     // }
                                
                                    $(this).css('border', 'none');
                                    $(this).css('background', 'none');
                                });
                        
                                $('#DropPanel').on('drop', function(e) {
                                    $(this).css('border', 'none');
                                    $(this).css('background', 'none');
                                    e.preventDefault();
                                    var files = e.originalEvent.dataTransfer.files;
                                
                                    var data = new FormData();
                                    for (var i = 0; i < files.length; i++) {
                                        data.append(files[i].name, files[i]);
                                        
                                    }
                                    png.postFiles({
                                        url:png.getServerImgURL("api/system/UploadFiles?path="+Str_pathRoot+"/"+Str_Brdcum),
                                        data:data,
                                        OnSuccess: function(data){
                                            Obj_FN_Main.pnMain('pnGetList')
                                        }
                                    })
                                    
                                    // $.ajax({
                                    //     url: "system/UploadFile.ashx?path="+JSON.parse(png.ArrLS.UserDetail.get()).strCompanyCode+"/"+strBrdcum,
                                    //     type: "POST",
                                    //     data: data,
                                    //     contentType: false,
                                    //     processData: false,
                                    //     success: function (data) { 
                                    //         GetPanel()
                                    //     },
                                    //     error: function (err) { 
                                    //         alert("Fail !!!")
                                    //     }
                                    // });
                                });
    
    
    
    
                            }
                        }
                    }
                })


            }

            
            objEvtPanel.pnListBtn = function(_idOrClassPn){
                var IdOrClass_Pn = _idOrClassPn

                var strHtml = ''
                strHtml+= '<div align="right"><button id="Done" class="btn btn-texticon bg-primary txt-white">Done</button></div>'
                $(IdOrClass_Pn).html(strHtml)


                $("#Done",IdOrClass_Pn).click(function(){
                    var arrUrlImg = []
                    $("#pnGetList .col-md-3.file").each(function(key,val){
                        if($(val).find('input').is(':checked'))
                            arrUrlImg.push(png.getServerImgURL($(val).find('div').attr('path')))
                    })
                    options.OnSuccess.call(this,arrUrlImg)
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

        function GetPanelSupplierAll(){

            var ArrListItemType = []
            var StrPath = 'GeneralImages'
            var StrItemTypeGUID = ''

            if(options.objSupplierDetail.strItemTypeGUID == null){
                
                png.postListApiGetValue({
                    objList_Api: ObjList_Api
                    ,objListApi_RtnVal: {
                        'GetListItemType':{
                            objParams_Cus: {
                                strSupplierGUID: options.objSupplierDetail.strSupplierGUID
                            }
                            , OnSuccess: function(data){ 

                                ArrListItemType = JSON.parse(data)[0]
                                GetMain()
                            }
                        }
                    }
                })

            }else{
                
                if(options.objSupplierDetail.strItemTypeGUID != ''){
                    StrPath = options.objSupplierDetail.strItemTypeCode
                    StrItemTypeGUID = options.objSupplierDetail.strItemTypeGUID
                }

                GetMain()
            }


            function GetMain(){
                
                var objPanel = {}
                if(options.objSupplierDetail.strItemTypeGUID == null){

                    objPanel = {
                        pnMain:{tag:'div',attr:'',childTags:[{div:'class="row"'}]
                            ,pnAction:{tag:'div',attr:'class="col-md-12 pn-padding-b-15 pn-margin-b-15" style="border-bottom:1px solid #cecece"'}
                            ,pnColLeft:{tag:'div',attr:'class="col-md-2"  '}
                            ,pnCnt:{tag:'div',attr:'class="col-md-10"',childTags:[{div:'class="row"'}]
                                // ,pnBrc:{tag:'div',attr:'class="col-md-12"'}
                                ,pnGetList:{tag:'div',attr:'class="col-md-12"  style="max-height:calc(100vh - 200px);overflow:auto"'}
                                // ,pnListBtn:{tag:'div',attr:'class="col-md-12 pn-margin-t-b-15"'}
                            }
                        }
                    }
                }else{

                    objPanel = {
                        pnMain:{tag:'div',attr:'',childTags:[{div:'class="row"'}]
                            ,pnAction:{tag:'div',attr:'class="col-md-12 pn-padding-b-15 pn-margin-b-15" style="border-bottom:1px solid #cecece"'}
                            ,pnCnt:{tag:'div',attr:'class="col-md-12"',childTags:[{div:'class="row"'}]
                                // ,pnBrc:{tag:'div',attr:'class="col-md-12"'}
                                ,pnGetList:{tag:'div',attr:'class="col-md-12"  style="max-height:calc(100vh - 200px);overflow:auto"'}
                                ,pnListBtn:{tag:'div',attr:'class="col-md-12 pn-margin-t-b-15"'}
                            }
                        }
                    }

                }

                var objEvtPanel = {}
                
                objEvtPanel.pnColLeft = function(_idOrClassPn){
                    var IdOrClass_Pn = _idOrClassPn


                    var strHtml = ''
                    strHtml+= '<div><a class="bg-primary txt-white" data="" strItemTypeCode="GeneralImages" style="padding: 9px; display:block">General Images</a></div>'
                    ArrListItemType.forEach(function(value,key){
                        strHtml+= '<div><a data="'+value.strItemTypeGUID+'" strItemTypeCode="'+value.strItemTypeCode+'" style="padding: 9px;display:block ">'+value.strItemTypeName+'</a></div>'
                    })
                    $(IdOrClass_Pn).html(strHtml)

                    $('a',IdOrClass_Pn).click(function(){

                        StrItemTypeGUID = $(this).attr('data')
                        StrPath = $(this).attr('strItemTypeCode')

                        $('a',IdOrClass_Pn).attr('class','txt-primary bg-white')
                        $(this).attr('class','bg-primary txt-white')
                        Obj_FN_Main.pnMain('pnGetList')
                    })



                }
                objEvtPanel.pnAction = function(_idOrClassPn){
                    var IdOrClass_Pn = _idOrClassPn

                    var strHtml = ''
                    strHtml += '<div class="titDtl pn-margin-b-30"></div> '
                    strHtml += '<button class="btn btn-texticon bg-success txt-white"  id="btnUpload"><i class="fa fa-upload"></i><span>Upload Files</span></button> '
                    // strHtml+='<button id="btnSorting" class="btn btn-texticon"><i class="fa fa-sort"></i><span>'+pngElm.getLangKey({langkey:'sys_Btn_UpdateSortOrder'})+'</span></button>'
                    // strHtml+='<button id="btnSave" class="btn btn-texticon bg-primary txt-white viewedit"><i class="fa fa-floppy-o"></i><span>Lưu</span></button>'
                    // strHtml+='<button id="btnCancel" class="btn btn-default viewedit"><span>Thoát</span></button>'
                    strHtml += '<input type="file" id="fileUpload" style="display:none" accept="image/*" multiple/> '
                    // strHtml += '<button class="btn btn-texticon bg-primary txt-white" id="btnCreateFolder"><i class="fa fa-plus"></i><span>Create New Folder</span></button> '
                    $(IdOrClass_Pn).html(strHtml)


                    strHtml = ''
                    
                    if(!options.objSupplierDetail.strItemTypeGUID){
                        strHtml+='<div><b>Supplier: </b> '+options.objSupplierDetail.strSupplierName+'</div>'
                    }else{

                        strHtml+='<div><b>Supplier: </b> '+options.objSupplierDetail.strSupplierName+'</div>'
                        strHtml+='<div><b>Item Type: </b> '+options.objSupplierDetail.strItemTypeName+'</div>'
                    }


                    $('.titDtl',IdOrClass_Pn).html(strHtml)

                    $('#btnUpload').click(function(){
                        $('#fileUpload').click()
                    })
                    $('#fileUpload').on('change',function(e){
                        var files =  e.target.files;
                        var data = new FormData();
                        for (var i = 0; i < files.length; i++) {
                            if(check_multifile_image(files[i].name))
                                data.append(files[i].name, files[i]);
                            
                        }
                        png.postFiles({
                            url:png.getServerImgURL('api/system/UploadFiles?path='+Str_pathRoot+'/'+StrPath),
                            data:data,
                            OnSuccess: function(data){
                                console.log(JSON.parse(data))
                                var arrUrlImg = JSON.parse(data)
                                if(arrUrlImg && arrUrlImg.length!=0){

                                    var ArrInput = []
                                    arrUrlImg.forEach(function(val){
                                        ArrInput.push({
                                            strSupplierGUID: options.objSupplierDetail.strSupplierGUID,
                                            strItemTypeGUID: (StrItemTypeGUID || null),
                                            strSupplierImageFileLink:val.replace('//','/'),
                                        })
                                        // Arr_ListTbl.push({strSupplierImageFileLink:val.replace(png.getServerImgURL(''),'')})
                                    }) 

                                    png.postList({          // Post dữ liệu lên api
                                        objApi: ObjList_Api.AddSupplierImageFile, // Ten api can thực hiện
                                        arrInput: ArrInput,     // dữ liệu truyền lên
                                        intCallApiPerTime:1,    // số lần gọi api trên 1 lần
                                        OnSuccess: function (data) {    // Sự kiện sau khi post thành công
                                            Obj_FN_Main.OnClosePp(true)
                                            $.Confirm({ strContent: pngElm.getLangKey({langkey:'sys_Cfm_UploadSuccess'}) });
                                            
                                            Obj_FN_Main.pnMain('pnGetList')
                                        }
                                    })
                                    

                                }   
                            }
                        })


                        function check_multifile_image(file) {
                            var extension = file.substr((file.lastIndexOf('.') + 1))
                            if (extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'png' || extension === 'bmp') {
                                return true;
                            } else {
                                return false;
                            }
                        }

                    })
                }


                objEvtPanel.pnGetList = function(_idOrClassPn){
                    var IdOrClass_Pn = _idOrClassPn


                    png.postListApiGetValue({
                        objList_Api: ObjList_Api
                        ,objListApi_RtnVal: {
                            'GetListSupplierImageFile':{
                                objParams_Cus: $.pngExtendObj(options.objSupplierDetail,{
                                    strItemTypeGUID: StrItemTypeGUID
                                })
                                , OnSuccess: function(data){ 
                                    
                                    // Arr_ListFolder = JSON.parse(data).folder
                                    Arr_ListFile = JSON.parse(data)[0]
        
                                    var strHtml = ""
                                    strHtml+='<div class="row" style="height:100%" id="DropPanel">'
                                    // if(Arr_ListFolder){
                                    //     Arr_ListFolder.forEach(function(val,key){
                                    //         strHtml+='<div class="col-md-3 folder" style="margin-bottom:20px" action="'+val.path+'">'
                                    //         strHtml+='  <div style="display:flex;padding:5px;cursor:pointer">'
                                    //         strHtml+="      <div style='padding: 5px;height: 80px;width: 80px;border: 1px solid #f3f3f3;margin-right: 5px;'>"
                                    //         strHtml+='          <div style="color: #ebba16;font-size: 70px;margin-top: -15px;text-align: center;"><i class="fa fa-folder"></i></div>'
                                    //         strHtml+="      </div>"
                                    //         strHtml+='      <div style="word-break: break-all;width: calc(100% - 80px);display: inline-block">'
                                    //         strHtml+='          <div>'+val.name+'</div>'
                                    //         strHtml+='          <div><a style="cursor" fileName="'+val.name+'" class="btnRename"><i class="fa fa-pencil"></i></a> <a style="cursor" fileName="'+val.name+'" class="btnDel"><i class="fa fa-trash"></i></a></div>'
                                    //         strHtml+='      </div>'
                                    //         strHtml+='  </div>'
                                    //         strHtml+='</div>'
                                    //         if((key+1)%4==0){
                                    //             strHtml+='<div class="col-md-12"></div>'
                                    //         }
                                    //     })
                                    // }
                                    if(Arr_ListFile){
                                        var intAdd = 0
                                        // if(Arr_ListFolder){
                                        //     intAdd = Arr_ListFolder.length%4
                                        // }
                                        var intKey = 0
                                        Arr_ListFile.forEach(function(val,key){
                                            var strFileName = val.strSupplierImageFileLink.substr((val.strSupplierImageFileLink.lastIndexOf('/') + 1))
                                            if(strFileName.indexOf('.jpg')!=-1 || strFileName.indexOf('.png')!=-1 || strFileName.indexOf('.jpeg')!=-1){
                                                intKey++
                                                strHtml+="<div class='col-md-3 file img"+strFileName.replace(/\.|\s|\(|\)/g,'')+"' style='margin-bottom:20px'>"
                                                    strHtml+='<div style="display:flex;padding:5px;" path="'+val.strSupplierImageFileLink+'">'
                                                    
                                                    if(options.IsSelectOne){
                                                        strHtml+="  <input type='radio' name='chkImg' class='chkItem img"+strFileName.replace(/\.|\s|\(|\)/g,'')+"' style='position:absolute;margin:0'>"
                                                    }
                                                    if(options.IsSelectAll){
                                                        strHtml+="  <input type='checkbox' class='chkItem img"+strFileName.replace(/\.|\s|\(|\)/g,'')+"' style='position:absolute;margin:0'>"
                                                    }
                                                    strHtml+="  <div style='padding: 5px;height: 80px;width: 80px;border: 1px solid #f3f3f3;margin-right: 5px;'>"
                                                    strHtml+='      <div class="pnImg" style="background: url(\''+png.getServerImgURL(val.strSupplierImageFileLink)+'\') no-repeat center;cursor:pointer;height: 100%;width: 100%;background-size: contain;"></div>'
                                                    strHtml+="  </div>"
                                                    strHtml+='      <div style="word-break: break-all;width: calc(100% - 80px);display: inline-block">'
                                                    strHtml+='          <div title="'+strFileName+'">'+strFileName+'</div>'
                                                    strHtml+='          <div>'
                                                                    strHtml+='<a style="cursor" data="'+key+'" fileName="'+strFileName+'" pathToFile="'+val.strSupplierImageFileLink+'" class="btnCustom"><i class="fa fa-crop"></i></a> '
                                                                    strHtml+='<a style="cursor" data="'+key+'" fileName="'+strFileName+'" pathToFile="'+val.strSupplierImageFileLink+'" class="btnRename"><i class="fa fa-pencil"></i></a> '
                                                                    strHtml+='<a style="cursor" strSupplierImageFileGUID="'+val.strSupplierImageFileGUID+'" fileName="'+strFileName+'" class="btnDel"><i class="fa fa-trash"></i></a>'
                                                                strHtml+='</div>'
                                                    strHtml+='      </div>'
                                                    strHtml+="</div>"
                                                strHtml+="</div>"
                                                
                                                if((intKey+intAdd)%4==0){
                                                    strHtml+='<div class="col-md-12"></div>'
                                                }
                                            }
        
                                        })
                                    }
                                    strHtml+="</div>"
                                    $(IdOrClass_Pn).html(strHtml)


                                    if(options.IsSelectOne ){
                                        
                                        $('input[type=radio]',IdOrClass_Pn).change(function(){
                                            $('#Done').show()
                                        })

                                    }
                
                                    if(options.IsSelectAll ){
                                        var strHtml = ''
                                        strHtml+= '<div align="right"><button id="Done" class="btn btn-texticon bg-primary txt-white">Done</button></div>'
                                        $(IdOrClass_Pn).html(strHtml)
                                    }
                                    
                                    // $(".folder",IdOrClass_Pn).dblclick(function(){
                                    //     Str_Brdcum = $(this).attr('action')
                                    //     Obj_FN_Main.pnMain('pnBrc')
                                    //     Obj_FN_Main.pnMain('pnGetList')
                                    // })
        
                                    $(IdOrClass_Pn+" .col-md-3 .pnImg").click(function(event){
                                        if ( $(this).find('input.chkItem').has(event.target).length == 0 && !$(this).find('input.chkItem').is(event.target) ){
                                            $(this).parents('.col-md-3').find('input.chkItem').click()
                                        }
                                    })
                                    $(IdOrClass_Pn+" .col-md-3 input.chkItem").click(function(){
                                        var strClass = $(this).attr('class')
                                        if(this.checked)
                                            $(IdOrClass_Pn+" .col-md-3."+strClass + ">div").attr('style','display:flex;padding:5px;background:#238af5')
                                        else
                                            $(IdOrClass_Pn+" .col-md-3."+strClass+">div").attr('style','display:flex;padding:5px;')
                                    })
        
                                    $(IdOrClass_Pn+" .btnRename").click(function(){
        
                                        pnPopUp_Actionfile({
                                            path:StrPath
                                            ,fileName: $(this).attr('fileName')
                                            ,pathToFile: $(this).attr('pathToFile')
                                            ,objDetail: Arr_ListFile[$(this).attr('data')]
                                        })
        
                                    })

                                    
                                    $(IdOrClass_Pn+" .btnCustom").click(function(){
                                        var filename=  $(this).attr('fileName')
                                        var pathToFile=  $(this).attr('pathToFile')
                                        pnPopUp_CustomImg({
                                            path:StrPath
                                            ,fileName: $(this).attr('fileName')
                                            ,pathToFile: $(this).attr('pathToFile')
                                            ,OnSuccess: function () {
                                                $(IdOrClass_Pn+" .img"+filename.replace(/\.|\s|\(|\)/g,'')+' .pnImg').attr('style','background: url(\''+png.getServerImgURL(pathToFile)+'\') no-repeat center;cursor:pointer;height: 100%;width: 100%;background-size: contain;')
                                            }
                                        })
        
                                    })
                                    $(IdOrClass_Pn+" .btnDel").click(function(){
        
                                        var self = this
                                        $.Confirm({
                                            strContent: '<span langkey="sys_Cfm_AYS"></span>',
                                            OnSuccess: function () {
                                                png.postListApiGetValue({
                                                    objList_Api: ObjList_Api
                                                    ,objListApi_RtnVal: {
                                                        'DelFolderOrFileMedia':{
                                                            objParams_Cus: {
                                                                path: StrPath
                                                                ,fileName: $(self).attr('fileName')
                                                            }
                                                            , OnSuccess: function(data){ 

                                                                png.postListApiGetValue({           // Post list các Api phía trên và lấy về dữ liệu
                                                                    objList_Api: ObjList_Api            // Tên các Object api đã khai báo phía trên 
                                                                    ,objListApi_RtnVal: {           // Giá trị nhận về từ API
                                                                        'DelSupplierImageFile':{               // Tên api tương ứng với giá trị trả về
                                                                            objParams_Cus: {
                                                                                strSupplierImageFileGUID :  $(self).attr('strSupplierImageFileGUID')
                                                                            }
                                                                            ,OnSuccess: function(data){
                                                                                Obj_FN_Main.pnMain('pnGetList')
                                                                                Obj_FN_Main.OnClosePp(true)
                                                                                
                                                                                $.Confirm({ strContent: '<span langkey="sys_Cfm_DelSuccess"></span>' });
                                                                            }
                                                                        }
                                                                    }
                                                                })


                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    })
        
                                    // $('#DropPanel').on('dragenter', function(e) {
                                    //     e.preventDefault();
                                    //     $(this).css('border', '#39b311 2px dashed');
                                    //     $(this).css('background', '#f1ffef');
                                    // });
                            
                                    // $('#DropPanel').on('dragover', function(e) {
                                    //     e.preventDefault();
                                    // });
                                    // $('#DropPanel').mouseover( function(e) {
                                    // //     // if ( e.target.className == "grid-lib" ) {
                                    //         // $(this).removeAttr('style');
                                    // //     // }
                                    
                                    //     $(this).css('border', 'none');
                                    //     $(this).css('background', 'none');
                                    // });
                            
                                    // $('#DropPanel').on('drop', function(e) {
                                    //     $(this).css('border', 'none');
                                    //     $(this).css('background', 'none');
                                    //     e.preventDefault();
                                    //     var files = e.originalEvent.dataTransfer.files;
                                    
                                    //     var data = new FormData();
                                    //     for (var i = 0; i < files.length; i++) {
                                    //         data.append(files[i].name, files[i]);
                                            
                                    //     }
                                    //     png.postFiles({
                                    //         url:png.getServerImgURL("api/system/UploadFiles?path="+Str_pathRoot+"/"+Str_Brdcum),
                                    //         data:data,
                                    //         OnSuccess: function(data){
                                    //             Obj_FN_Main.pnMain('pnGetList')
                                    //         }
                                    //     })
                                        
                                    //     // $.ajax({
                                    //     //     url: "system/UploadFile.ashx?path="+JSON.parse(png.ArrLS.UserDetail.get()).strCompanyCode+"/"+strBrdcum,
                                    //     //     type: "POST",
                                    //     //     data: data,
                                    //     //     contentType: false,
                                    //     //     processData: false,
                                    //     //     success: function (data) { 
                                    //     //         GetPanel()
                                    //     //     },
                                    //     //     error: function (err) { 
                                    //     //         alert("Fail !!!")
                                    //     //     }
                                    //     // });
                                    // });
        
        
        
        
                                }
                            }
                        }
                    })


                }

                
                objEvtPanel.pnListBtn = function(_idOrClassPn){
                    var IdOrClass_Pn = _idOrClassPn

                    if(options.IsSelectOne || options.IsSelectAll){
                        var strHtml = ''
                        strHtml+= '<div align="right"><button id="Done" class="btn btn-texticon bg-primary txt-white">Done</button></div>'
                        $(IdOrClass_Pn).html(strHtml)
                        
                        $('#Done').hide()
                    }


                    $("#Done",IdOrClass_Pn).click(function(){
                        var arrUrlImg = []
                        $("#pnGetList .col-md-3.file").each(function(key,val){
                            if($(val).find('input').is(':checked'))
                                arrUrlImg.push(png.getServerImgURL($(val).find('div').attr('path')))
                        })
                        options.OnSuccess.call(this,arrUrlImg)
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
            
            function pnPopUp_Actionfile(_Opt){
                var Dft = {
                    path:''
                    ,fileName: null
                    ,pathToFile:null
                    ,objDetail:{}
                    , OnSuccess: function () {}
                }
                _Opt = $.extend(Dft, _Opt);
                
                var IdOrClass_Pn = _Opt.idOrClass
    
                var IsRename = (_Opt.fileName? true : false)
                
                var NewName = (_Opt.fileName || '')

                var StrExt = NewName.substr(NewName.lastIndexOf('.'),NewName.length)
                if(NewName.lastIndexOf('.') >= 0)
                    NewName = NewName.substr(0,NewName.lastIndexOf('.'))
    
                pngPn.getPopUp({
                    strTitle: (IsRename? 'Rename':"Create Folder")
                    , intTypeSize:1
                    , OnPanel: GetPanelMain_PopUpAct
                    , OnClosePopUp: function () {
    
                    }
                })
    
                function GetPanelMain_PopUpAct(_IdOrClassPp,_OnClosePp){
    
                    IdOrClass_Pn = _IdOrClassPp
                    Obj_FN_Main.OnClosePp_ActFile = _OnClosePp
    
                    var objInput = {
                        newName:{title: IsRename && (_Opt.fileName || '').lastIndexOf('.') >= 0?'File Name':'Folder Name',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                            ,input:{type:'text',classEx:'form-control',attr:''}
                        }
                    }
    
                    var ObjDetail = {
                        newName:NewName
                    }
                    
                    pngPn.getPanelHtml({
                        objPanel: {
                            pnMain:{tag:'div',attr:'class="panel-itl"',childTags:[{div:'class="row"'}]
                                ,pnImg:{tag:'div',attr:'class="col-md-12"'}
                                ,pnForm:{tag:'div',attr:'class="col-md-12"'}
                                ,pnBtn:{tag:'div',attr:'class="col-md-12"'}
            
                                // ,pnAAA:{tag:'div',attr:'class="col-md-12"'}
                            }
                        }
                        ,objEvtPanel: {
                            pnImg: function(_IdOrClassPn,_objAll,_OnRtn){
                                if(IsRename && (_Opt.fileName || '').lastIndexOf('.') >= 0){
    
                                    var strHtml = ''
                                    strHtml+='<img src="'+png.getServerImgURL(_Opt.pathToFile)+'" style="max-width: 100%; max-height: 50vh;margin-bottom: 15px;">'
                                    $(_IdOrClassPn).html(strHtml)
    
                                }
                                _OnRtn('')
                            }
                            ,pnForm: function(_IdOrClassPn,_objAll,_OnRtn){
                                
                                pngPn.getForm({
                                    action: 1,
                                    objInput: objInput,
                                    idOrClass: _IdOrClassPn,
                                    objDetail: ObjDetail,
                                })
            
                                _OnRtn('')
                            }
                            , pnBtn: function(_IdOrClassPn,_objAll,_OnRtn){

                                var strHtml = '<button id="btnSave" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-floppy-o"></i><span>'+pngElm.getLangKey({langkey:'sys_Btn_Save'})+'</span></button>'
                                $(_IdOrClassPn).html(strHtml)
            
                                $(_IdOrClassPn+ ' #btnSave').click(function(){
                                    pngPn.getForm({
                                        action: 2,
                                        objInput: objInput,
                                        idOrClass: IdOrClass_Pn + ' #pnForm',
                                        OnChkSuccess: function(objRtn){
                                            if(objRtn){

                                                var strSupplierImageFileLink_New = _Opt.objDetail.strSupplierImageFileLink.replace(_Opt.fileName,objRtn.newName+StrExt)

                                                png.postListApiGetValue({
                                                    objList_Api: ObjList_Api
                                                    ,objListApi_RtnVal: {
                                                        'GetListSupplierImageFile':{
                                                            objParams_Cus: {
                                                                strSupplierImageFileLink: strSupplierImageFileLink_New
                                                                ,intCurPage: 1
                                                                ,intPageSize: 1
                                                            }
                                                            , OnSuccess: function(data){ 

                                                                var arr = JSON.parse(data)[0]
                                                                
                                                                if(arr.length){

                                                                    objRtn.newName = objRtn.newName+' (1)'
                                                                    strSupplierImageFileLink_New = _Opt.objDetail.strSupplierImageFileLink.replace(_Opt.fileName,objRtn.newName+StrExt)
                                                                }

                                                                GetUpd()
                                                            }
                                                        }
                                                    }
                                                })

                                                function GetUpd(){
                                                    objRtn.path = _Opt.path
                                                    objRtn.fileName = _Opt.fileName 
                                                    png.postListApiGetValue({
                                                        objList_Api: ObjList_Api
                                                        ,objListApi_RtnVal: {
                                                            'UpdRenameFolderOrFileMedia':{
                                                                objParams_Cus: objRtn
                                                                , OnSuccess: function(data){ 
    
                                                                    png.postListApiGetValue({
                                                                        objList_Api: ObjList_Api
                                                                        ,objListApi_RtnVal: {
                                                                            'UpdSupplierImageFile':{
                                                                                objParams_Cus: $.pngExtendObj( _Opt.objDetail,{
                                                                                        strSupplierImageFileLink: strSupplierImageFileLink_New
                                                                                    }
                                                                                )
                                                                                , OnSuccess: function(data){ 
                                                                                    Obj_FN_Main.OnClosePp_ActFile(false,true)
                                                                                    $.Confirm({ strContent: '<span langkey="sys_Cfm_UpdSuccess"></span>' });
                                                                                    Obj_FN_Main.pnMain('pnGetList')
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                
                                            }
                                        }
                                    })
                                    
                                })
            
                                _OnRtn('')
                            }

                        }
                        ,idOrClass: IdOrClass_Pn
                        ,OnChangeIdPn: function(_Fn){
                            Obj_FN_Main.pnMain_ActFile = _Fn
                        }   
                    })
    
                }
    
    
            }

        }


        function pnPopUp_Actionfile(_Opt){
            var Dft = {
                path:''
                ,fileName: null
                ,pathToFile:null
                , OnSuccess: function () {}
            }
            _Opt = $.extend(Dft, _Opt);
            
            var IdOrClass_Pn = _Opt.idOrClass

            var IsRename = (_Opt.fileName? true : false)
            
            var NewName = (_Opt.fileName || '')
            if(NewName.lastIndexOf('.') >= 0)
                NewName = NewName.substr(0,NewName.lastIndexOf('.'))

            pngPn.getPopUp({
                strTitle: (IsRename? 'Rename':"Create Folder")
                , intTypeSize:1
                , OnPanel: GetPanelMain_PopUpAct
                , OnClosePopUp: function () {

                }
            })

            function GetPanelMain_PopUpAct(_IdOrClassPp,_OnClosePp){

                IdOrClass_Pn = _IdOrClassPp
                Obj_FN_Main.OnClosePp_ActFile = _OnClosePp

                var objInput = {
                    newName:{title: IsRename && (_Opt.fileName || '').lastIndexOf('.') >= 0?'File Name':'Folder Name',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                        ,input:{type:'text',classEx:'form-control',attr:''}
                    }
                }

                var ObjDetail = {
                    newName:NewName
                }
                
                pngPn.getPanelHtml({
                    objPanel: {
                        pnMain:{tag:'div',attr:'class="panel-itl"',childTags:[{div:'class="container"'},{div:'class="row"'}]
                            ,pnImg:{tag:'div',attr:'class="col-md-12"'}
                            ,pnForm:{tag:'div',attr:'class="col-md-12"'}
                            ,pnBtn:{tag:'div',attr:'class="col-md-12"'}
        
                        }
                    }
                    ,objEvtPanel: {
                        pnImg: function(_IdOrClassPn,_objAll,_OnRtn){

                            if(IsRename && (_Opt.fileName || '').lastIndexOf('.') >= 0){

                                var strHtml = ''
                                strHtml+='<img src="'+png.getServerImgURL(_Opt.pathToFile)+'" style="max-width: 100%; max-height: 50vh;margin-bottom: 15px;">'
                                $(_IdOrClassPn).html(strHtml)

                            }
                            _OnRtn('')
                        }
                        ,pnForm: function(_IdOrClassPn,_objAll,_OnRtn){
                            
                            pngPn.getForm({
                                action: 1,
                                objInput: objInput,
                                idOrClass: _IdOrClassPn,
                                objDetail: ObjDetail,
                            })
        
                            _OnRtn('')
                        }
                        , pnBtn: function(_IdOrClassPn,_objAll,_OnRtn){

                            var strHtml = '<button id="btnSave" class="btn btn-texticon bg-primary txt-white"><i class="fa fa-floppy-o"></i><span>'+pngElm.getLangKey({langkey:'sys_Btn_Save'})+'</span></button>'
                            $(_IdOrClassPn).html(strHtml)
        
                            $(_IdOrClassPn+ ' #btnSave').click(function(){
                                pngPn.getForm({
                                    action: 2,
                                    objInput: objInput,
                                    idOrClass: IdOrClass_Pn + ' #pnForm',
                                    OnChkSuccess: function(objRtn){
                                        if(objRtn){
                                            objRtn.path = _Opt.path

                                            if(IsRename){
                                                objRtn.fileName = _Opt.fileName 
                                                png.postListApiGetValue({
                                                    objList_Api: ObjList_Api
                                                    ,objListApi_RtnVal: {
                                                        'UpdRenameFolderOrFileMedia':{
                                                            objParams_Cus: objRtn
                                                            , OnSuccess: function(data){ 
                                                                Obj_FN_Main.OnClosePp_ActFile(true,true)
                                                                Obj_FN_Main.pnMain('pnGetList')
                                                            }
                                                        }
                                                    }
                                                })
                                            }else{
                                                png.postListApiGetValue({
                                                    objList_Api: ObjList_Api
                                                    ,objListApi_RtnVal: {
                                                        'AddFolderMedia':{
                                                            objParams_Cus: objRtn
                                                            , OnSuccess: function(data){ 
                                                                Obj_FN_Main.OnClosePp_ActFile(true,true)
                                                                Obj_FN_Main.pnMain('pnGetList')
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            
                                        }
                                    }
                                })
                            })
        
                            _OnRtn('')
                        }
                    }
                    ,idOrClass: IdOrClass_Pn
                    ,OnChangeIdPn: function(_Fn){
                        Obj_FN_Main.pnMain_ActFile = _Fn
                    }   
                })

            }


        }

        function pnPopUp_CustomImg(_Opt){
            var Dft = {
                path:''
                ,fileName: null
                ,pathToFile:null
                , OnSuccess: function () {}
            }
            _Opt = $.extend(Dft, _Opt);
            
            var IdOrClass_Pn = _Opt.idOrClass

            // var IsRename = (_Opt.fileName? true : false)
            
            // var NewName = (_Opt.fileName || '')
            // if(NewName.lastIndexOf('.') >= 0)
            //     NewName = NewName.substr(0,NewName.lastIndexOf('.'))
            
            var strExt = _Opt.fileName.substring((_Opt.fileName || '').lastIndexOf('.')+1, (_Opt.fileName || '').length)

            pngPn.getPopUp({
                strTitle: 'Sửa ảnh'
                , intTypeSize:3
                , OnPanel: GetPanelMain_PopUpAct
                , OnClosePopUp: function () {

                }
            })

            function GetPanelMain_PopUpAct(_IdOrClassPp,_OnClosePp){

                IdOrClass_Pn = _IdOrClassPp
                Obj_FN_Main.OnClosePp_CustomImg = _OnClosePp

                // var objInput = {
                //     newName:{title: IsRename && (_Opt.fileName || '').lastIndexOf('.') >= 0?'File Name':'Folder Name',isRequire:true,attr:"class='col-md-12'",IsRtn:true
                //         ,input:{type:'text',classEx:'form-control',attr:''}
                //     }
                // }

                // var ObjDetail = {
                //     newName:NewName
                // }
                
                pngPn.getPanelHtml({
                    objPanel: {
                        pnMain:{tag:'div',attr:'class="panel-itl"',childTags:[{div:'class="row"'}]
                            ,pnContent:{tag:'div',attr:'class="col-md-12"'}
                        }
                    }
                    ,objEvtPanel: {
                        pnContent: function(_IdOrClassPn,_objAll,_OnRtn){

                                var strHtml = ''
                                var strUrlImg = png.getServerImgURL(_Opt.pathToFile)

                                png.postListApiGetValue({
                                    objList_Api: {
                                        GetByteImage:{
                                            strApiLink:'api/system/GetByteImage'
                                            ,objParams:{
                                                strUrlImg: strUrlImg
                                            }
                                        }
                                    }
                                    ,objListApi_RtnVal: {
                                        'GetByteImage':{
                                            objParams_Cus: {}
                                            , OnSuccess: function(data){ 
                                                strUrlImg='data:image/'+strExt+';base64,'+data
                                                GetMain()
                                            }
                                        }
                                    }
                                })

                                function GetMain(){
                                    strHtml += `
                                        <div class="row">
                                            <div class="col-md-10" style="">
                                                <img id="Image" src="${strUrlImg}" style="width:100%" >
                                            </div>
                                            <div class="col-md-2">
                                                <p><b>Preview</b></p>
                                                <div class="preview pn-margin-b-15"></div>
                                                <button class="btn bg-primary" id="btnSave">Save</button>
                                            </div>
                                        </div>
                                    
                                    `
                                    $(_IdOrClassPn).html(strHtml)

                                    var $image = $(_IdOrClassPn+' #Image')
                                    $('.preview').css({ 
                                        width: '100%', //width,  sets the starting size to the same as orig image  
                                        overflow: 'hidden',
                                        // maxWidth:  $image.width(),
                                        height: 300,
                                        maxHeight: 300
                                    });
                                    $image.cropper({
                                        preview: '.preview',
                                        aspectRatio: 16 / 9,
                                        // zoomOnWheel: false,
                                        // checkCrossOrigin: false,
                                        // crossOrigin:'anonymous',
                                        // checkOrientation: false,
                                        minCropBoxWidth:"960",
                                        minCropBoxHeight:"960",
                                        cropBoxResizable    : true,
                                        x:      0,
                                        y:      0,
                                        autoCropArea: 1,
                                        ready: function (e) { 
                                            // console.log(getComputedStyle(this.canvas)['width'])
                                            // console.log($image.naturalHeight)
                                            //     var scaledCropBox = {
                                            //         x: (parseFloat($('.cropper-container',_IdOrClassPn).width()) / $image.naturalWidth) * 960,
                                            //         y: (parseFloat($('.cropper-container',_IdOrClassPn).height()) / $image.naturalHeight) * 960
                                            //     }

                                            //     var options = {}
                                            //     options.minCropBoxWidth = scaledCropBox.x;
                                            //     options.minCropBoxHeight = scaledCropBox.y;
                                            //     $image.cropper('setData', options)
                                        } 
                                    });

                                                                    

                                    $('#btnSave',_IdOrClassPn).click(function(){

                                        var croppedimage = $image.cropper('getCroppedCanvas').toDataURL("image/png");

                                        $.Confirm({
                                            strContent: '<span langkey="sys_Cfm_AYS"></span>'
                                            , OnSuccess: function () {
                                                png.postListApiGetValue({
                                                    objList_Api: {
                                                        UploadFilesForBytesOverwrite:{
                                                            strApiLink:png.getServerImgURL('api/system/UploadFilesForBytesOverwrite')
                                                            ,objParams:{
                                                                strPathRoot: Str_pathRoot,
                                                                strPath: _Opt.path,
                                                                strFileName:  _Opt.fileName,
                                                                strData: croppedimage.split(',')[1],
                                                            }
                                                        }
                                                    }
                                                    ,objListApi_RtnVal: {
                                                        'UploadFilesForBytesOverwrite':{
                                                            objParams_Cus: {}
                                                            , OnSuccess: function(data){ 
                                                                Obj_FN_Main.OnClosePp_CustomImg(false,true)
                                                                _Opt.OnSuccess.call()
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                        
                                    })
                                }


                            // }
                            _OnRtn('')
                        }
                    }
                    ,idOrClass: IdOrClass_Pn
                    ,OnChangeIdPn: function(_Fn){
                        Obj_FN_Main.pnMain_CustomImg = _Fn
                    }   
                })

            }


        }

    }


    var _getFormHorizontal = function (options) {
        var defaults = {
            objInput:{
                strDefault:{title:'Default',isRequire:false,attr:"class='col-md-12'",IsRtn:true
                    ,validate:{confirmRequire:'<span langkey="sys_Cfm_IpErr_FieldRequired"></span>',format:"",confirmFormat:'<span langkey="sys_Cfm_IpErr_FieldIncorrect"></span>'}
                    ,arrValidateEx:[{IsCheckSS:function(){},IsCheckSSAjax:function(){}, strConfirm:'' }]
                    ,input:{IsNoInput:false,IsViewDtl:false,type:'text',classEx:'form-control',attr:''}
                    //,input:{type:'checkbox',classEx:'',attr:'style="float: left;margin-right: 5px;margin-top: 2px;"'}
                    //,input:{type:'textarea',classEx:'form-control',attr:'rows="5"'}
                    ,inputRange:{IsNoInput:true,step: 1,min:0,max:100,value:'0,100',format:'{0} day'}
                    ,dateRange:{firstDay:1,format: 'DD/MM/YYYY',minDate:moment()}
                    ,datePicker:{todayHighlight: true,format: 'dd/mm/yyyy',startDate: new Date()}
                    ,datePickerRange:{IsNoInput:true,todayHighlight: true,format: 'dd/mm/yyyy',weekStart: 1,startDate: null,endDate: null,diffmin:0}
                    ,listCheckbox:{IsNoInput:true,arrList:[{'key':'value'}],formatItem:'<span style="margin-right:15px">{chk}{tit}</span>',splitReturn:','}
                    ,dropDown:{
                        Select2:{IsMultiple:false}
                        ,arrList:[{'key':'value'}]}
                    ,inputImage:{IsNoInput:true,attr:'style="width: 300px; height: 192px;cursor:pointer"',urlImgDft: coreSystem.getLib_CommonURL('assets/images/img-noimage.png')}
                    ,comboBoxesDes:{IsNoInput:true,IsComboBoxesDes:true}
                }
            },
            idOrClass:'#Default',
            objDetail:{},
            classEx:'',
            attr:'',
            strHtmlBtn:'',
            OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        if ($(window).width() >= 767){
            var strHtml = ''
            strHtml += '<div class="form-horizontal '+options.classEx+'" '+options.attr+'>'
                strHtml += '<div class="item" style="z-index: 2;">'
                strHtml += '    '+options.strHtmlBtn
                strHtml += '</div>'
            strHtml += '</div>'
            strHtml += '<style> '+options.idOrClass+' .row{ margin: 0 }  '+options.idOrClass+' .col-md-12{ padding: 0 } ' 
            strHtml += '</style>'

            $(options.idOrClass).html(strHtml)

            var ObjInput = JSON.parse(JSON.stringify(options.objInput))
            
            Object.keys(ObjInput).reverse().forEach(function(value){
                strHtml = ''
                strHtml += '<div class="item pn-display-inline-flex" '+options.objInput[value].attr+'>'
                    if(options.objInput[value].title)
                        strHtml += '<span>'+options.objInput[value].title+'</span>'
                        strHtml += '<span class="pn-'+value+'"></span>'
                strHtml += '</div>'
                $(options.idOrClass+'>div.form-horizontal').prepend(strHtml)

                var objItem = JSON.parse(JSON.stringify(options.objInput[value]))
                objItem.title = ''
                objItem.attr = 'class="col-md-12" style="margin: 0;"'
                var objItem2 = {}
                objItem2[value] = objItem

                pngPn.getForm({
                    action: 1,
                    objInput: objItem2,
                    idOrClass: options.idOrClass+' .pn-'+value,
                    objDetail: options.objDetail
                })
            })
        }else{

            var idFrom = Math.random().toString(36).substring(4).toUpperCase()

            var strHtml=''
            strHtml+='<div >'
                strHtml+= '<a id="btnViewFilter2" class="btn btn-link" data-toggle="collapse" href="#'+idFrom+'">'
                strHtml+= '    <i class="fa fa-chevron-down"></i>'
                strHtml+= '    <span></span>'
                strHtml+= '</a>'
            strHtml+='</div>'
    
            strHtml+= '<div id="'+idFrom+'" class="panel-collapse collapse in bg-white pn-padding-l-r-15">'
                strHtml+='<div class="pnFrom"></div>'
                strHtml+= '<div class="row">'+options.strHtmlBtn+'</div>'
            strHtml+= '</div>'
    
            $(options.idOrClass).html(strHtml)
    
            pngPn.getForm({
                action: 1,
                objInput: options.objInput,
                idOrClass: options.idOrClass+' .pnFrom',
                objDetail: options.objDetail
            })

            $('.input-daterange',options.idOrClass).css('width','100%')
            setTimeout(function(){
                $('.input-daterange input',options.idOrClass).css('width','inherit')
            },500)
            $('button',options.idOrClass).css('width','100%')
            $('button',options.idOrClass).css('border-radius','0')
            $('button',options.idOrClass).css('border-bottom-left-radius','3px')
            $('button',options.idOrClass).css('border-bottom-right-radius','3px')

            $('.row>div',options.idOrClass+' .pnFrom').attr('style','border-bottom: 1px solid #D6D6D6;padding: 0;')
            $('.row>div label',options.idOrClass+' .pnFrom').addClass('pn-padding-l-r-15')


            $('#btnViewFilter2',options.idOrClass).click(function(e){
                setTimeout(function(){
                    GetViewHideTxt(options.idOrClass)
                },500)
            })
            GetViewHideTxt(options.idOrClass)
    
    
        }

       

        function GetViewHideTxt(_idOrClassPn){
            if($(_idOrClassPn).find('.panel-collapse').hasClass('in')){
                $(_idOrClassPn).find('#btnViewFilter2 span').text(pngElm.getLangKey({langkey:'sys_Txt_HideLess'}))
                $(_idOrClassPn).find('#btnViewFilter2 i').attr('class','fa fa-chevron-up')
            }else{
                $(_idOrClassPn).find('#btnViewFilter2 span').text(pngElm.getLangKey({langkey:'sys_Txt_ViewMore'}))
                $(_idOrClassPn).find('#btnViewFilter2 i').attr('class','fa fa-chevron-down')
            }
        }

    }


    var _getCalendar = function (options) {
        var defaults = {
            intMonth: null,
            intYear: null,
            intStartWkDay:1,
            getData: function(){},
            getInsertData: function(){},
            idOrClass:'',
            // OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        var IdOrClass_Main = options.idOrClass
        
        var Int_Month = options.intMonth
        var Int_Year = options.intYear
        
        if(!Int_Month || !Int_Year){
            Int_Month = moment().month() +1
            Int_Year = moment().year()
        }
        
        var intStartwkDay = options.intStartWkDay//--------Monday
        var Arr_ListTbl = []
        var Arr_ListDays = []
        var Obj_Cols = {}

        GetMainPanel()
        function GetMainPanel(){
            Arr_ListTbl = []
            Arr_ListDays = []
            
            var strHtml=''
            strHtml+='<div class="pnChangeTime" style="text-align: center;margin-bottom: 10px;">'
                strHtml+='<button class="btn btn-default" action="PrevMonth" style="float:left"><i class="fa fa-angle-double-left"></i><span class="mobile-pn-display-none" style="margin-left:7px">Tháng Trước</span></button>'
                strHtml+='<span style="display:inline-block">'
                
                        strHtml += '<span class="dropdown mobile-pn-display-block">'
                        strHtml += '    <b>Tháng: </b>'+Int_Month+' <button class="btn" action="ChangeMonth" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-repeat"></i></button>'
                    
                        strHtml += '    <ul class="dropdown-menu open-right" style="top: 30px;">'
                        strHtml += '        <form role="form" class="pnMonth" style="width:200px">'
                        
                        strHtml += '        </form>'
                        strHtml += '    </ul>'
                        strHtml += '</span>'
                        
                        strHtml += '<span class="dropdown">'
    
                            strHtml += ' - <b>Năm: </b>'+Int_Year+' <button class="btn" action="ChangYear" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-repeat"></i></button>'
                            strHtml += '    <ul class="dropdown-menu open-right" style="top: 30px;">'
                            strHtml += '        <form role="form"  class="pnYear" style="width:200px">'
                            
                            strHtml += '        </form>'
                            strHtml += '    </ul>'
                        strHtml += '</span>'
                strHtml+='</span>'
                strHtml+='<button class="btn btn-default" action="NextMonth" style="float:right"><span class="mobile-pn-display-none" style="margin-right:7px">Tháng Sau</span><i class="fa fa-angle-double-right"></i></button>'
            strHtml+='</div>'
            strHtml+='<div class="pnCalendar"></div>'
            $(IdOrClass_Main).html(strHtml)
    
            $('button',IdOrClass_Main+' .pnChangeTime').click(function(){
                var action = $(this).attr('action')
                
    
                if(action=="PrevMonth"){
                    var dtm = moment(Int_Year+'-'+Get_ValZeroFirst(Int_Month)+'-01').add(-1, 'M')
                    Int_Month = moment(dtm).month()+1
                    Int_Year = moment(dtm).year()
                    GetMainPanel()
                }
                if(action=="NextMonth"){
                    var dtm = moment(Int_Year+'-'+Get_ValZeroFirst(Int_Month)+'-01').add(1, 'M')
                    Int_Month = moment(dtm).month()+1
                    Int_Year = moment(dtm).year()
                    GetMainPanel()
                }
            })

            strHtml=''
            for(var i = 1;i<=12;i++){
                strHtml+='<div class="item" style="width:33%;display: inline-block;padding:10px;border: 1px solid #ccc;cursor:pointer;'+(Int_Month==i?'background: #cccccc;':'')+'" align="center" data="'+i+'">'+i+'</div>'
            }
            $(IdOrClass_Main+' .pnMonth').html(strHtml)

            $('.item',IdOrClass_Main+' .pnMonth').click(function(){
                Int_Month = $(this).attr('data')
                GetMainPanel()
            })

            var intYearMin =  Int_Year-4
            var intYearMax =  Int_Year+4
            
            strHtml=''
            strHtml+='<div style="display:flow-root;text-align:center;padding:5px">'
                strHtml+='<a style="float:left" class="btnPrev"><i class="fa fa-chevron-left"></i></a>'
                strHtml+='<b class="pnYearRange"></b>'
                strHtml+='<a style="float:right" class="btnNext"><i class="fa fa-chevron-right"></i></a>'
            strHtml+='</div>'
            strHtml+='<div class="pnListYear"></div>'
            $(IdOrClass_Main+' .pnYear').html(strHtml)
            
            $('.btnPrev',IdOrClass_Main+' .pnYear').click(function(){
                intYearMax = intYearMin - 1
                intYearMin = intYearMax - 8
                GetUpdateYear()
            })
            $('.btnNext',IdOrClass_Main+' .pnYear').click(function(){
                intYearMin = intYearMax + 1
                intYearMax = intYearMin + 8
                GetUpdateYear()
            })
            GetUpdateYear()
            function GetUpdateYear(){
                var strHtml = ''
                for(var i = intYearMin;i<=intYearMax;i++){
                    strHtml+='<div class="item" style="width:33%;display: inline-block;padding:10px;border: 1px solid #ccc;cursor:pointer;'+(Int_Year==i?'background: #cccccc;':'')+'" align="center" data="'+i+'">'+i+'</div>'
                }
                $(IdOrClass_Main+' .pnListYear').html(strHtml)
                $(IdOrClass_Main+' .pnYearRange').html(intYearMin+' - '+intYearMax)
                
                $('.item',IdOrClass_Main+' .pnListYear').click(function(){
                    Int_Year = $(this).attr('data').getNumber()
                    GetMainPanel()
                })
            }
    
            var dayStartMonth = moment(Int_Year+'-'+Get_ValZeroFirst(Int_Month)+'-01').format()
            var dayEndMonth = moment(Int_Year+'-'+Get_ValZeroFirst(Int_Month)+'-01').endOf('M').format()
    
            for(var i = 6;i>0;i--){
                var day = moment(dayStartMonth).add(0-i,'days').format()
                Arr_ListDays.push({day:day,wkDay:moment(day).isoWeekday(),isCurMth:0})
            }
            for(var i = 1;i<=moment(dayEndMonth).endOf('M').format('D');i++){
                var day = moment(Int_Year+'-'+Get_ValZeroFirst(Int_Month)+'-'+Get_ValZeroFirst(i)).format()
                Arr_ListDays.push({day:day,wkDay:moment(day).isoWeekday(),isCurMth:1})
            }
            for(var i = 1;i<=6;i++){
                var day = moment(dayEndMonth).add(i,'days').format()
                Arr_ListDays.push({day:day,wkDay:moment(day).isoWeekday(),isCurMth:0})
            }
            
            
            for(var i = 0;i<=6;i++){
                var wkDay = intStartwkDay + i
                if(wkDay>7)
                    wkDay = wkDay - 7
                Obj_Cols['v'+wkDay] = {}
            }
            
            var objWeekDays = {}
            var IsView = false
            Arr_ListDays.forEach(function(value,key){
    
                if(value.wkDay == Object.keys(Obj_Cols)[0].replace('v','')){
                    IsView = true
                }
                if(IsView){
                    objWeekDays[value.wkDay] = value
                    if(!Arr_ListTbl.length){
                        Obj_Cols['v'+value.wkDay] = {name: moment(value.day).format('ddd'),strAttrTH:'style="width:14.3%"'}
                    }   
    
                    if(value.wkDay == Object.keys(Obj_Cols)[6].replace('v','')){
                        Arr_ListTbl.push(JSON.parse(JSON.stringify(objWeekDays)))
                        objWeekDays = {}
                    }
                }
            })
    
    
            if( options.getData.toString().replace(/\s+/g,'')!="function(){}"){
                options.getData.call(this,{
                        intMonth: Int_Month,
                        intYear: Int_Year,
                        dtmDateFrom: moment(Arr_ListDays[0].day).format('l'),
                        dtmDateTo: moment(Arr_ListDays[Arr_ListDays.length-1].day).format('l'),
                    }
                    ,function (){
                        GetMain()
                    }
                )
            }else{
                GetMain()
            }
    
    
            function GetMain(){
    
                pngPn.getTable2({
                    objApi:null
                    ,objParams_Cus:null
                    ,objCols: Obj_Cols
                    ,editRltArr: function(arr){
                        return Arr_ListTbl
                    }
                    ,editRlt: function(value,key){
    
                        Object.keys(Obj_Cols).forEach(function(valueCol,keyCol){
                            var dayWk = valueCol.replace('v','')
                            var objDtl = value[dayWk]
    
                            value[valueCol] = '<div IsView="'+(objDtl.isCurMth? "true" : "false")+'" intKey="'+(key*7+keyCol+1)+'" date="'+moment(objDtl.day).format('l')+'" day="'+moment(objDtl.day).format('D')+'" month="'+moment(objDtl.day).format('M')+'">'
                            value[valueCol]+= '<b style="font-size:20px">'+moment(objDtl.day).format('D')+'</b>'
                                value[valueCol]+= '<div class="pnCellCnt"></div>'
                            value[valueCol]+= '</div>'
    
                        })
    
                    }
                    ,customEvent:function(idOrClassPn){
                        $(idOrClassPn).find('tbody td').css('background','white').css('vertical-align','top')
                        $(idOrClassPn).find('tbody td [IsView=false]').parents('td').css('opacity','0.5')
                        $(idOrClassPn).find('tbody td [date="'+moment().format('l')+'"]').parents('td').css('background','#ccc')
                        options.getInsertData.call(this,idOrClassPn)

    
                    }
                    ,changeCkbMaster: function (IsChecked, intRowID, arrList) {
    
                        Arr_ListTbl = arrList;
                    }
                    ,IsViewCheckBoxMain:false
                    ,idOrClass: IdOrClass_Main+ ' .pnCalendar'
                })
    
            }

        }

        function Get_ValZeroFirst(_int){
            if(_int){
                if(_int < 10){
                    _int = '0'+_int
                }
            }
            return _int
        }

    }

    var StrHtml_Support = ''
    var _getSupport = function (options) {
        var defaults = {
            idOrClass:'',
            // OnSuccess: function(){}
        }
        options = $.extend(defaults, options);

        var IdOrClass_Main = options.idOrClass


        var ObjList_Api = {
            GetDetailSupport:{
                strApiLink:'api/public/GetDetailSupport'
                ,objParams:{
                    intLangID: $.pngGetLangID()
                }
            }
        }

        if(!StrHtml_Support){
            png.postListApiGetValue({
                objList_Api: ObjList_Api 
                ,objListApi_RtnVal: {           // Giá trị nhận về từ API
                    'GetDetailSupport':{               // Tên api tương ứng với giá trị trả về
                        objParams_Cus:{}
                        ,OnSuccess: function(data){
                            var obj = JSON.parse(data)[0][0]
    
                            
                            var strHtml = ''
                            strHtml+='<div><b>Zalo: </b><a href="https://zalo.me'+('/'+obj.strZalo).replace('/0','/84')+'" target="_blank">'+obj.strZalo+'</a></div>'
                            strHtml+='<div><b>Skype: </b><a href="skype:'+obj.strSkype+'">'+obj.strSkype+'</a></div>'
                            strHtml+='<div><b>Email: </b><a href="mailto:'+obj.strEmail+'">'+obj.strEmail+'</a></div>'
                            strHtml+='<div><b>Messenger: </b><a href="https://m.me/'+obj.strMessenger+'" target="_blank">'+obj.strMessenger+'</a></div>'
                            StrHtml_Support = strHtml
                            GetMainPanel()
                        }
                    }
                }
            })
        }else{
            GetMainPanel()
        }

        function GetMainPanel(){
            var strHtml = ''
            strHtml = '<h3 class="pn-margin-b-15">'+pngElm.getLangKey({langkey:'sys_Txt_SupportInfor'})+'</h3>' + StrHtml_Support

            $(IdOrClass_Main).html(strHtml)
        }


    }


    return {
        getForm: function (options){return _getForm(options)}
        ,getTable: function (options){return _getTable(options)}
        ,getListArrOrObjValue: function (options){return _getListArrOrObjValue(options)}//getListArrOrObjValue
        ,getPanelHtml: function (options){return _getPanelHtml(options)}
        ,getTable2: function (options){return _getTable2(options)}
        ,getOutputApi: function (options){return _getOutputApi(options)}
        ,getListHtmlForArr: function (options){return _getListHtmlForArr(options)}
        ,getPopUp: function (options){return _getPopUp(options)}
        ,getPopUpPrint: function (options){_getPopUpPrint(options)}
        ,getPopUpLibMedia: function (options){_getPopUpLibMedia(options)}
        ,getFormHorizontal: function (options){_getFormHorizontal(options)}
        ,getCalendar: function (options){_getCalendar(options)}
        ,getSupport: function (options){_getSupport(options)}
    }
}();