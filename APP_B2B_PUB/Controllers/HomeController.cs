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
    public class HomeController : Controller
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
        public static int GetLangID(string strLangCode)
        {
            var intLangID = 0;
            if (strLangCode == "vi")
            {
                intLangID = 18;
            }
            if (strLangCode == "en")
            {
                intLangID = 1;
            }
            return intLangID;

        }

        public static Dictionary<string, object> GetHomepageByLangID(int intLangID,int intPageID = 1)
        {
            string strConnect = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            System.Data.SqlClient.SqlParameter p_1 = new System.Data.SqlClient.SqlParameter("@strUserGUID", null);
            System.Data.SqlClient.SqlParameter p_2 = new System.Data.SqlClient.SqlParameter("@intLangID", intLangID);
            System.Data.SqlClient.SqlParameter p_3 = new System.Data.SqlClient.SqlParameter("@intPageID", intPageID);
            System.Data.DataSet ds = new System.Data.DataSet();
            ds = SqlHelper.ExecuteDataset(strConnect, System.Data.CommandType.StoredProcedure, "SPCM_GetHomepageByLangID", p_1,p_2,p_3);

            var data = new Dictionary<string, object>();


            foreach (DataRow dtRow in ds.Tables[0].Rows)
            {
                data.Add(dtRow["strLableNameName"].ToString(), dtRow["strLangLableContent"].ToString());
            }

            return data;

        }
        public static System.Data.DataSet GetListNewsForHomePage(int intLangID)
        {
            string strConnect = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            System.Data.SqlClient.SqlParameter p_1 = new System.Data.SqlClient.SqlParameter("@intLangID", intLangID);
            System.Data.SqlClient.SqlParameter p_2 = new System.Data.SqlClient.SqlParameter("@tblsReturn", null);
            System.Data.DataSet ds = new System.Data.DataSet();
            ds = SqlHelper.ExecuteDataset(strConnect, System.Data.CommandType.StoredProcedure, "SPIN_GetListNewsForHomePage", p_1, p_2);

            return ds;

        }

        public static System.Data.DataSet GetNewsOnWeb(string strJson)
        {
            return GetActionSP(strJson, "SPIN_GetNewsOnWeb");
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

        public static string GetUrlLang(string strUrl,string strLang)
        {
            var strNewUrl = "";
            var httpValueCollection = HttpUtility.ParseQueryString(new Uri(strUrl).Query);
            if (httpValueCollection.Get("lang")==null)
            {
                httpValueCollection.Add("lang", strLang);

                var ub = new UriBuilder(new Uri(strUrl));
                ub.Query = httpValueCollection.ToString();
                strNewUrl = ub.Uri.ToString();
            }
            else
            {
                strNewUrl = null;
            }
            return strNewUrl;
        }

        public static string GetFormatDateTime(string dtmDate)
        {
            var dtm = Convert.ToDateTime(dtmDate).ToString("dd/MM/yyyy");
            return dtm;
        }

        public static string GetUrl(string strText)
        {
            var data = new Dictionary<string, object>();
            data.Add("strImgURL", "https://b2bapi.itourlink.com/");
            data.Add("APPB2B", "https://itourlink.com/");
            data.Add("APPB2B_Agent", "https://agent.itourlink.com/");
            data.Add("APPB2B_AgentHost", "https://agenthost.itourlink.com/");
            data.Add("APPB2B_Guide", "https://guide.itourlink.com/");
            data.Add("APPB2B_Pub", "https://pub.itourlink.com/");

            return data[strText].ToString();
        }

    }
}