using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TMS.Base;
using System.Data;
using System.Text;
using System.Web.Script.Serialization;
using System.Data.SqlClient;

namespace APP_B2B_PUB.Controllers
{
    public class ComController : Controller
    {

        private static SqlConnection sqlConn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);

        public ActionResult Index()
        {
            if (GetChangeUrl())
            {
                return View();
            }
            else
            {
                return null;
            }
        }

        public ActionResult ComDetail()
        {
            if (GetChangeUrl())
            {
                return View();
            }
            else
            {
                return null;
            }
        }
        public ActionResult ComDetailTour()
        {
            if (GetChangeUrl())
            {
                return View();
            }
            else
            {
                return null;
            }
        }

        public ActionResult ComDetailAgents()
        {
            if (GetChangeUrl())
            {
                return View();
            }
            else
            {
                return null;
            }
        }
        public ActionResult ComDetailHotels()
        {
            if (GetChangeUrl())
            {
                return View();
            }
            else
            {
                return null;
            }
        }
        public bool GetChangeUrl(){

            var strUrl = Request.Url.AbsoluteUri;
            if (Request.QueryString["lang"] == null)
            {
                var httpValueCollection = HttpUtility.ParseQueryString(new Uri(strUrl).Query);

                httpValueCollection.Add("lang", "vi");

                var ub = new UriBuilder(new Uri(strUrl));
                ub.Query = httpValueCollection.ToString();

                Response.Redirect(ub.Uri.ToString());
                return false;
            }
            else
            {
                return true;
            }
        }

        public static System.Data.DataSet GetDetailCompanyOwnerByPUB(string strJson)
        {
            return GetActionSP(strJson, "SPMB_GetDetailCompanyOwnerByPUB");
        }




        private static DataSet GetActionSP(string strJson, string strSP)
        {
            SqlCommand sqlComm = new SqlCommand(strSP, sqlConn);

            var json_serializer = new JavaScriptSerializer();
            var routes_list = (IDictionary<string, object>)json_serializer.DeserializeObject(strJson);
            DataTable d = new DataTable();
            foreach (var record in routes_list)
            {
                sqlComm.Parameters.AddWithValue("@" + record.Key, record.Value ?? DBNull.Value);
            }

            sqlComm.CommandType = CommandType.StoredProcedure;

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlComm;

            DataSet ds = new DataSet();
            da.Fill(ds);
            return ds;
        }

    }
}