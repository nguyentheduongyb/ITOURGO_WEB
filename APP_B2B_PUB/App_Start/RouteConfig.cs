using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace APP_B2B_PUB
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "about-us",
            //    url: "page/about-us",
            //    defaults: new { controller = "Home", action = "AboutUs", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-client",
            //    url: "page/client",
            //    defaults: new { controller = "Home", action = "Client", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-client-detail",
            //    url: "client/{strTitleURL}",
            //    defaults: new { controller = "Home", action = "ClientDetail", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-contact-us",
            //    url: "page/contact-us",
            //    defaults: new { controller = "Home", action = "ContactUs", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-dispute",
            //    url: "page/dispute",
            //    defaults: new { controller = "Home", action = "Dispute", id = UrlParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "page-faq",
            //    url: "page/faq",
            //    defaults: new { controller = "Home", action = "Faq", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-news-detail",
            //    url: "post/{strTitleURL}",
            //    defaults: new { controller = "Home", action = "NewsDetail", id = UrlParameter.Optional }
            //);



            //routes.MapRoute(
            //    name: "page-news-events",
            //    url: "page/news-events",
            //    defaults: new { controller = "Home", action = "NewsEvents", id = UrlParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "page-operation-regulation",
            //    url: "page/operation-regulation",
            //    defaults: new { controller = "Home", action = "OperationRegulation", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-privacy-policy",
            //    url: "page/privacy-policy",
            //    defaults: new { controller = "Home", action = "PrivacyPolicy", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-programs",
            //    url: "page/programs",
            //    defaults: new { controller = "Home", action = "Programs", id = UrlParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "page-recruitment",
            //    url: "page/recruitment",
            //    defaults: new { controller = "Home", action = "Recruitment", id = UrlParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "page-site-map",
            //    url: "page/site-map",
            //    defaults: new { controller = "Home", action = "SiteMap", id = UrlParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "page-terms-conditions",
            //    url: "page/terms-conditions",
            //    defaults: new { controller = "Home", action = "TermsConditions", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-tourdetail",
            //    url: "tour/{strTitleURL}",
            //    defaults: new { controller = "Home", action = "TourDetail", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-touraffiliate",
            //    url: "touraffiliate/{strTitleURL}",
            //    defaults: new { controller = "Home", action = "TourAffiliate", id = UrlParameter.Optional }
            //);


            //routes.MapRoute(
            //    name: "page-confirmation",
            //    url: "confirmation/{strConfirmedCode}",
            //    defaults: new { controller = "Home", action = "ConfirmationService", id = UrlParameter.Optional }
            //);

            routes.MapRoute(
                name: "user-login",
                url: "user/login",
                defaults: new { controller = "User", action = "UserLogin", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-signup",
                url: "user/signup",
                defaults: new { controller = "User", action = "UserSignup", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-cfmpass",
                url: "user/cfmpass",
                defaults: new { controller = "User", action = "UserCfmPass", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-orders",
                url: "user/orders",
                defaults: new { controller = "User", action = "UserOrders", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-orderdetail",
                url: "user/orderdetail",
                defaults: new { controller = "User", action = "UserOrderDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-bookings",
                url: "user/bookings",
                defaults: new { controller = "User", action = "UserBookings", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-requests",
                url: "user/requests",
                defaults: new { controller = "User", action = "UserRequests", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-requestdetail",
                url: "user/requestdetail",
                defaults: new { controller = "User", action = "UserRequestDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "user-bookingdetail",
                url: "user/bookingdetail",
                defaults: new { controller = "User", action = "UserBookingDetail", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "user-userdetail",
                url: "user/{strUserName}",
                defaults: new { controller = "User", action = "UserDetail", id = UrlParameter.Optional }
            );



            routes.MapRoute(
                name: "com-detail",
                url: "com/{strTitleURL}",
                defaults: new { controller = "Com", action = "ComDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "com-detail-tours",
                url: "com/{strTitleURL}/tours",
                defaults: new { controller = "Com", action = "ComDetailTour", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "com-detail-agents",
                url: "com/{strTitleURL}/agents",
                defaults: new { controller = "Com", action = "ComDetailAgents", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "com-detail-hotels",
                url: "com/{strTitleURL}/hotels",
                defaults: new { controller = "Com", action = "ComDetailHotels", id = UrlParameter.Optional }
            );



            routes.MapRoute(
                name: "hotel-home",
                url: "hotel",
                defaults: new { controller = "Hotel", action = "HotelHome", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "hotel-search",
                url: "hotel/search",
                defaults: new { controller = "Hotel", action = "HotelSearch", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "hotel-detail",
                url: "hotel/{strTitleURL}",
                defaults: new { controller = "Hotel", action = "HotelDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "tour-home",
                url: "tour",
                defaults: new { controller = "Tour", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "tour-search",
                url: "tour/search",
                defaults: new { controller = "Tour", action = "Search", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "tour-detail",
                url: "tour/{strTitleURL}",
                defaults: new { controller = "Tour", action = "Detail", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Tour", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
