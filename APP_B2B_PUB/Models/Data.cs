using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace APP_B2B_PUB.Models
{
    public class Data
    {
        public class entDataReturn
        {
            public int intTotalRecode { get; set; }
            public System.Data.DataSet dataSet { get; set; }
        }
        public static string ConvertTableToJsonObject(DataTable dt)
        {

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row = default(Dictionary<string, object>);
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                rows.Add(row);
            }
            //Javascript convert call: var ArrData=JSON.parse(strDataReturn); //Convert to json object
            return serializer.Serialize(rows);
        }
    }
}