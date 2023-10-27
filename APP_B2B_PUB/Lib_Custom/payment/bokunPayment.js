function include() {
    const scriptTag = document.createElement("script");
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.0.0/flowbite.min.js';
    document.body.appendChild(scriptTag);
}
const pngBokunElement = document.querySelector('.bokun-elm')

window.addEventListener('load', function () {
    runBokun()

})


var counter = 1;
var priceAdult = 120000
var totalPriceAdult = 0
function plus() {
    counter += 1;
    totalPriceAdult = priceAdult * counter
    document.getElementById("counter").innerHTML = counter;
    document.getElementById("pngTotalPriceAdult").innerHTML = `x ${totalPriceAdult}`;
}

function minus() {
    if (counter > 1) {
        counter -= 1;
        totalPriceAdult = priceAdult * counter
    }
    document.getElementById("counter").innerHTML = counter;
    document.getElementById("counter").innerHTML = counter;
    document.getElementById("pngTotalPriceAdult").innerHTML = `x ${totalPriceAdult}`;
}
const runBokun = async () => {
    const ObjList_Api = {
        GetListPriceLevelTour: {
            strApiLink: 'http://localhost:23689/api/tour/GetListPriceLevelTour' // 
            , objParams: 
            {
                strUserGUID: "47ecbd6d-897a-4a41-a061-95d5d3b166b6",
                strTourPriceItemLevelGUID: null,
                strTourGUID: "089936d7-95d6-4fda-8215-0d86c955bfaf",
                strPriceLevelGUID: "43392604-5251-4B75-B2F2-0F40F0F9F7B1",
                intNoOfAdult: 2,
                xmlNoOfChild: "",
                intNoOfSGLSup: 0,
                intNoOfTPLRec: 0,
                dtmFilterDateFrom: "10/26/2023",
                dtmFilterDateTo: null,
                intCurrencyView: 1,
                strCompanyOwnerGUID: "8f620326-9a14-4775-b72a-66f292192807",
                IsHasPriceKid: true,
                intEasiaCateID: "2",
                intCateID: 18,
                intJoinTypeID: "1",
                intTransportOptionID: null,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]"
            }

        }
    }
    const responseUser = await fetch("http://localhost:23689/oauth/token", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Accept": "application/ json, text/ javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "grant_type=password&client_id=APP_USER&username=agent.demo@gmail.com&password=123&intMemberTypeID=1"
    });

    const dataUser = await responseUser.json();

    const apiTour = pngBokunElement.getAttribute('data-src');
    const response = await fetch(ObjList_Api.GetListPriceLevelTour.strApiLink, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${dataUser.access_token}`
        },
        body: JSON.stringify(ObjList_Api.GetListPriceLevelTour.objParams), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    
    if (data !== null) {
        pngBokunElement.innerHTML = `
<div class="w-full bg-white rounded-sm p-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-lg mb-3">
                                                        <h3 class="mb-3 text-[color:var(--primary-color)] text-xl font-bold">Lịch khởi hành & Giá</h3>
                                                        <p class="">Chọn ngày khời hành:</p>
                                                        <div class="flex justify-between mt-3">
                                                                <button class='p-3 border rounded border-teal-500'>28/08</button>
                                                                <button class='p-3 border rounded'>29/08</button>
                                                                <button class='p-3 border rounded'>30/08</button>
                                                                <button class='p-3 border rounded'>Tất cả</button>
                                                        </div>
                                                        <div class='p-3 flex items-center justify-between border rounded-lg mt-3'>
                                                                <span>Người lớn</span>
                                                                <span id="pngTotalPriceAdult" class='text-orange-500 font-medium text-xl'>x ${priceAdult}</span>
                                                                <div class='flex items-center gap-6 text-xl'>
                                                                        <button id="plus" onclick="plus()" class='font-semibold'>+</button>
                                                                        <span id="counter">${counter}</span>
                                                                        <button id="minus" onclick="minus()" class='font-semibold'>-</button>
                                                                </div>
                                                        </div>
                                                        <div class='p-3 flex items-center justify-between border rounded-lg mt-3'>
                                                                <span>Trẻ em</span>
                                                                <span class='text-orange-500 font-medium text-xl'>x 12.000.000</span>
                                                                <div class='flex items-center gap-6 text-xl'>
                                                                        <button class='font-semibold'>+</button>
                                                                        <span>1</span>
                                                                        <button class='font-semibold'>-</button>
                                                                </div>
                                                        </div>
                                                        <p class='flex items-center mt-3 gap-3 text-[color:var(--primary-color)]'><HiOutlineInformationCircle /><span>Liên hệ để xác nhận chỗ</span></p>
                                                        <div class="mt-3">
                                                                <p class="flex justify-between mt-2 items-center">
                                                                        <span>Phụ thu phòng đơn</span>
                                                                        <span class="text-orange-500">+ 2.000.000 VNĐ</span>
                                                                </p>
                                                                <p class="flex justify-between mt-2 items-center">
                                                                        <span>Giá gốc</span>
                                                                        <span class="line-through">2.000.000 VNĐ</span>
                                                                </p>
                                                                <p class="flex justify-between mt-2 items-center">
                                                                        <span>Tổng cộng</span>
                                                                        <span class="font-medium text-2xl text-orange-500">20.000.000 VNĐ</span>
                                                                </p>
                                                        </div>
                                                        <div class="flex grid grid-cols-2 gap-4 mt-5">
                                                                <button id="" class="png-Btn-Payment border border-[color:var(--primary-color)] bg-white p-3 text-center text-[color:var(--primary-color)] rounded font-bold text-lg">Đặt cọc</button>
                                                                <a class="bg-[color:var(--primary-color)] p-3 text-center text-white rounded font-bold text-lg" href="/tour/payment-detail?id=6529781ad74bcb42243b43e1&adult=2&child=1">Yêu cầu đặt</a>

                                                        </div>
                                                </div>


                                                <div class="bg-white rounded-sm p-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-lg mb-3">
                                                        <div class="flex grid grid-cols-2 gap-4">
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Bảo hiểm</span>
                                                                </div>
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Bữa ăn</span>
                                                                </div>
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Hướng dẫn viên</span>
                                                                </div>
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Khách sạn 3-4*</span>
                                                                </div>
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Vé tham quan</span>
                                                                </div>
                                                                <div class="flex items-center gap-2 w-full">
                                                                        <BsCheckLg class="text-[color:var(--primary-color)]" />
                                                                        <span>Xe đưa đón</span>
                                                                </div>
                                                        </div>
                                                </div>
                <div id="pngElementModal"></div>


<div class="relative max-w-sm">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
    </svg>
  </div>
  <input datepicker type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date">
</div>

</div>


`
    }
    const pngButtonPayment = pngBokunElement.querySelector('.png-Btn-Payment')
    pngButtonPayment.addEventListener('click', function () {
        getPopUpPayment({
            idElm: 'pngElementModal',
            _id: '6529781ad74bcb42243b43e1'
        })
    });
}

function getPopUpPayment({ idElm, _id }) {

    const ObjList_Api = {
        GetListPriceLevelTour: {
            strApiLink: 'http://localhost:23689/api/traveller/AddBookingFromTourByPassenger' // 
            , objParams: {
                strPassengerGUID: '47ecbd6d-897a-4a41-a061-95d5d3b166b6',
        strListCompanyOwnerGUID : null,
            intOrderStatusID: 4,

                intSaluteID: '',
                    intAgeID :'',
                        intPassengerAges:'',
                            strPassengerFirstName:'',
                                strPassengerLastName:'',
                                    dtmPassengerBirthday:'',
                                        dtmPasspostExpirationDate:'',
                                            strPassengerEmail:'',
                                                strPassengerPhone:'',
                                                    strPassengerRemark:'',
                                                        strPaidRemark:'',
                                                            strPassport:'',
                                                                strCountryGUID:'',
                                                                    IsTraveller:'',

                                                                        strTourGUID : 'C814E762-5705-441E-9221-149A4C1F1E42',
                                                                            strTourPriceItemGUID: '246AC53C-4AB7-4378-8853-80782E655147',
                                                                                strDepartureTourGUID: null,

                                                                                    dtmDateFrom: '1/11/2021',
                                                                                        intAdult:1,
                                                                                            strListChildAge: '',
                                                                                                intSGL: 0,
                                                                                                    intDBL: 1,
                                                                                                        intTWN: 0,
                                                                                                            intTPL: 0,
            }

        }
    }

    document.querySelector(`#${idElm}`).innerHTML =
        ` <div id="pngPaymentModal" style="position: fixed; z-index: 99999;overflow-y:hidden" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full max-h-full flex justify-center items-center">
                                                        <div style="width: 1000px" class="relative w-full max-w-4xl max-h-full">
                                                                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                                                        Thanh toán đơn hàng của bạn
                                                                                </h3>
                                                                                <button id="pngBtnClosePaymentModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                                                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                                                        </svg>
                                                                                        <span class="sr-only">Close modal</span>
                                                                                </button>
                                                                        </div>
                                                                        <div class="p-4 space-y-6">
                                                                                <div>
                                                                                        <div>
                                                                                                <div class="flex items-center mb-4">
                                                                                                        <p class="flex-1">Sản phẩm</p>
                                                                                                        <p class="w-24 text-center">Số lượng</p>
                                                                                                        <p class="w-40 text-center">Thành tiền</p>
                                                                                                </div>
                                                                                                <div class="flex gap-4 mb-4 items-center">
                                                                                                        <p class="text-[color:var(--primary-color)] text-xl font-medium">PNGSOFT</p>
                                                                                                        <span>|</span>
                                                                                                        <button>Chat ngay</button>
                                                                                                </div>
                                                                                                <div class="flex mb-4 gap-4">
                                                                                                        <div class="flex gap-2 items-center">
                                                                                                                <div class="bg-no-repeat bg-center bg-cover w-24 h-24 rounded" style={{ backgroundImage: 'url("https://cdn2.ivivu.com/2023/04/12/14/ivivu-dali.gif")' }}></div>
                                                                                                                <div class="flex-1">
                                                                                                                        <p class="text-lg">Tour Trung Quốc 6N5Đ : Hà Nội - Hà Khẩu - Đại Lý - Lệ Giang - Shangrila</p>
                                                                                                                        <p class="text-[#ccc] text-sm">Loại: Tour</p>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <div class="h-24 flex flex-col justify-between">
                                                                                                                <div class="flex gap-3">
                                                                                                                        <div class="w-24">Người lớn</div>
                                                                                                                        <div class="flex">
                                                                                                                                <p class="w-24 text-center ">1</p>
                                                                                                                                <p class="w-40 text-center font-semibold">2.000.000đ</p>
                                                                                                                        </div>

                                                                                                                </div>
                                                                                                                <div class="flex gap-3">
                                                                                                                        <div class="w-24">Trẻ em</div>
                                                                                                                        <div class="flex">
                                                                                                                                <p class="w-24 text-center ">2</p>
                                                                                                                                <p class="w-40 text-center font-semibold">1.000.000đ</p>
                                                                                                                        </div>

                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>

                                                                                        </div>
                                                                                        <div class="border-y flex justify-end gap-60 py-4 text-sm">
                                                                                                <div class="flex gap-3">
                                                                                                        <input class="mt-3" type="checkbox" checked
                                                                                                        />
                                                                                                        <div class="w-24">Phụ thu phòng đơn</div>
                                                                                                        <div class="flex">
                                                                                                                <p class="w-40 text-center font-semibold">0</p>
                                                                                                        </div>

                                                                                                </div>

                                                                                        </div>
                                                                                        <div class="border-y flex justify-end gap-60 py-4 text-sm">
                                                                                                <div class="flex gap-3">
                                                                                                        <div class="w-24">Giảm giá</div>
                                                                                                        <div class="flex">

                                                                                                                <p class="w-40 text-center font-semibold">100.000</p>
                                                                                                        </div>

                                                                                                </div>

                                                                                        </div>
                                                                                        <p class="py-3 text-end border-b ">Tổng số tiền:  <span class="font-medium text-2xl text-orange-500 ml-1">1.900.000</span></p>

                                                                                        <div class="flex py-3 justify-between">
                                                                                                <div class="flex items-center w-4/12 gap-4 pr-8 border-r">
                                                                                                        <label>Lời nhắn:</label>
                                                                                                        <input class="flex-1" placeholder="Lưu ý cho người bán" />
                                                                                                </div>
                                                                                                <button id="pngBtnPayment" class="py-2 px-4 bg-[color:var(--primary-color)] text-white font-bold rounded-xl">Thanh toán</button>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>`
    const pngPaymentModal = document.querySelector('#pngPaymentModal')
    const pngBtnClosePaymentModal = document.querySelector('#pngBtnClosePaymentModal')
    console.log(pngBtnClosePaymentModal);
    pngBtnClosePaymentModal.addEventListener('click', function () {
        pngPaymentModal.classList.add('hidden');
        pngPaymentModal.classList.remove('flex');
    });

    const pngBtnPayment = document.querySelector('#pngBtnPayment')
    pngBtnPayment.addEventListener('click', async function () {
        const response = await fetch('http://localhost:23689/api/traveller/AddBookingFromTourByPassenger', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Content-Type": "application/x-www-form-urlencoded",
                // 'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": `Bearer ${dataUser.access_token}`
            },
            body: JSON.stringify(ObjList_Api.GetListPriceLevelTour.objParams), // body data type must match "Content-Type" header
        });
    });

}
