using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(APP_B2B_PUB.Startup))]
namespace APP_B2B_PUB
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
