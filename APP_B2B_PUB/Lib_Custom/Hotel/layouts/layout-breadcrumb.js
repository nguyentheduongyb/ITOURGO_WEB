//Copyright by PNGSOFT CORP. 2007-2018.
//File: APP\front-end\main-page\tour\main-lead.js
//Created:	MrHieu
//Edit:
//Description: 


$.ModuleLayouts_BreadCrumb = function (options) {
    var defaults = {
        arrBrcbItems: [],
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);


    var arrBrcbItems = []

    arrBrcbItems.push({id:'',title:'<i class="fa fa-home" style="font-size:18px"></i>',attr:'module="home"'})
    // arrBrcbItems.push({id:'',title:'Home',attr:'module="home"'})

    if(options.arrBrcbItems.length)
        options.arrBrcbItems.forEach(function(value) {
            arrBrcbItems.push(value)
        });


    $.ModuleSystemBreadcrumb({arrBrcbItems:arrBrcbItems})

    $('app-breadcrumb-root').find('a').click(function(){
        var module = $(this).attr('module')
        if(module){
            
            if (module != 'home') {
                var ObjSearchDtl = {}
                ObjSearchDtl['objDestination'] = {}
                ObjSearchDtl['objDestination'][$(this).attr('idmdit')] = $(this).text()

                $.ModuleLayouts_Searchbar_GetValue(ObjSearchDtl)
                window.location.href = '/hotel/search?idmdit=' + $(this).attr('idmdit')
            } else {
                window.location.href = '/hotel'
            }
            //window.history.pushState("", "", $.pngGetQSVal('module',module));
            
            //window.history.replaceState("", "", $.pngGetQSVal('idmdit',($(this).attr('idmdit')) || null));
            //coreLoadPage.init()
        }
    })

}

$.ModuleLayouts_BreadCrumb_ParAndChildDestination = function (options) {
    var defaults = {
        strLocation: '',
        OnSuccess: function () {

        }
    }
    options = $.extend(defaults, options);

    var ObjList_ComboValue = {
        ArrCountry:{
            getValCode:{strCombocode: "185"}
            ,OnSuccessItem:function(data){
                // data.unshift({'':'Select...'})
                return data
            }
        }
        ,ArrDepartment:{
            getValCode:{strCombocode: "217"}
            ,OnSuccessItem:function(data){
                // data.unshift({'':'Select...'})
                return data
            }
        }
        ,ArrCity:{
            getValCode:{strCombocode: "186"}
            ,OnSuccessItem:function(data){
                // data.unshift({'':'Select...'})
                return data
            }
        }
    }
    if(options.strLocation){

    //getListArrOrObjValue
        pngPn.getListArrOrObjValue({
            setListValue: ObjList_ComboValue,
            OnSuccessList:function(ObjListCombo){
                GetMain(ObjListCombo)
            }
        })
    }else{
        options.OnSuccess([])
    }
    function GetMain(ObjListCombo){

        var arrBrcbItems = []
        ObjListCombo.ArrCountry.forEach(function(value){
            if(options.strLocation.indexOf(Object.keys(value)[0])>=0)
                arrBrcbItems.push({id:'',title:value[Object.keys(value)],attr:'module="src-rtl" idmdit="'+Object.keys(value)[0]+'" '})
        })
        console.log(ObjListCombo.ArrDepartment)
        ObjListCombo.ArrDepartment.forEach(function(value){
            if(options.strLocation.indexOf(Object.keys(value)[0])>=0){
                arrBrcbItems.push({id:'',title:value[Object.keys(value)],attr:'module="src-rtl" idmdit="'+Object.keys(value)[0]+'" '})
            }
        })

        ObjListCombo.ArrCity.forEach(function(value){
            if(options.strLocation.indexOf(Object.keys(value)[0])>=0 && arrBrcbItems[arrBrcbItems.length - 1].title != value[Object.keys(value)] )
                arrBrcbItems.push({id:'',title:value[Object.keys(value)],attr:'module="src-rtl" idmdit="'+Object.keys(value)[0]+'" '})
        })
        
        options.OnSuccess(arrBrcbItems)
    }
    

}