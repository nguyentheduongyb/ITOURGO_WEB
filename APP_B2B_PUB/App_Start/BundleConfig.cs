using System.Web;
using System.Web.Optimization;

namespace APP_B2B_PUB
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            //// Use the development version of Modernizr to develop with and learn from. Then, when you're
            //// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //          "~/Scripts/bootstrap.js",
            //          "~/Scripts/respond.js"));

            //bundles.Add(new StyleBundle("~/Content/css").Include(
            //          "~/Content/site.css",
            //          "~/Content/bootstrap.css"));

            var ver = "0.0";

            bundles.Add(new StyleBundle("~/css/vendor").Include(
                        "~/Lib_Common/vendor/font-awesome/css/font-awesome.min.css",
                        "~/Lib_Common/vendor/simple-line-icons/simple-line-icons.min.css",
                        "~/Lib_Common/vendor/bootstrap/css/bootstrap.min.css",
                        "~/Lib_Common/vendor/bootstrap/css/bootstrap-slider.min.css",
                        "~/Lib_Common/vendor/select2/select2.min.css",
                        "~/Lib_Common/vendor/daterangepicker/daterangepicker.css",
                        "~/Lib_Common/vendor/owl-carousel/ver-1/owl.carousel.css",
                        "~/Lib_Common/vendor/owl-carousel/ver-1/owl.theme.css",
                        "~/Lib_Common/vendor/owl-carousel/ver-1/owl.transitions.css"));


            bundles.Add(new StyleBundle("~/css/itl-theme-1").Include(
                        "~/Lib_Common/itl-theme-1/style-general.css",
                        "~/Lib_Common/itl-theme-1/public/css/default.css",
                        "~/Lib_Common/itl-theme-1/public/css/style1.css"));

            bundles.Add(new ScriptBundle("~/js/jquery").Include(
                        "~/Lib_Common/assets/js/jquery.min.js"));


            bundles.Add(new ScriptBundle("~/js/assets").Include(
                        "~/Lib_Common/assets/js/moment.min.js",
                        "~/Lib_Common/assets/js/cookie.js"));


            bundles.Add(new ScriptBundle("~/js/vendor").Include(
                        "~/Lib_Common/vendor/bootstrap/js/bootstrap.min.js",
                        "~/Lib_Common/vendor/bootstrap/js/bootstrap-slider.min.js",
                        "~/Lib_Common/vendor/bootstrap/js/datepicker.js",
                        "~/Lib_Common/vendor/select2/select2.min.js",
                        "~/Lib_Common/vendor/daterangepicker/daterangepicker.min.js",
                        "~/Lib_Common/vendor/owl-carousel/ver-1/owl.carousel.old.js"));

            bundles.Add(new ScriptBundle("~/js/core").Include(
                        "~/Lib_Common/core/core.js",
                        "~/Lib_Common/core/coreElm.js",
                        "~/Lib_Common/core/corePn.js",
                        "~/Lib_Common/core/WebLiberary.js",
                        "~/Lib_Common/core/B2B_ConnectTMS.js"));


            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
