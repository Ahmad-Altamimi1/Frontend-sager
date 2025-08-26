import { Link, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Gauge } from "lucide-react";
import { cn } from "~/lib/utils";
import DashboardIcon from "~assets/Icon/dashboard-svgrepo-com-2.svg";
import MapIcon from "~assets/Icon/MAPLight.svg";
export default function SidebarLayout() {
  const location = useLocation();
  const isMap = location.pathname.startsWith("/map");

  return (
    <div className="  grid grid-cols-[repeat(14,minmax(0,1fr))]">
      <aside className="h-[calc(100vh-72px)] col-span-2 w-full bg-[#111111] backdrop-blur border-r border-zinc-800 z-40 flex flex-col">
        <nav className="flex-1 flex flex-col gap-2 pt-3">
          <Link to="/" className="group" aria-label="Dashboard">
            <div
              className={cn(
                "relative flex flex-col gap-2 p-2 w-full items-center justify-center  hover:bg-[#272727]",
                !isMap && "bg-[#272727] text-white"
              )}
            >
              {!isMap && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600 transition-all duration-200" />
              )}

              <Gauge
                size={26}
                className={cn(
                  "transition-colors duration-100 ",
                  isMap ? "text-[#65717C]" : "text-white"
                )}
              />
              <span
                className={cn(
                  "text-[15px] transition-colors duration-100 ",
                  isMap ? "text-[#65717C]" : "text-white"
                )}
              >
                {" "}
                DASHBOARD
              </span>
            </div>
          </Link>
          <Link to="/map" className="group" aria-label="Map">
            <div
              className={cn(
                "relative flex flex-col gap-2 p-2 w-full items-center justify-center  hover:bg-[#272727]",

                isMap && "bg-[#272727]"
              )}
            >
              <img src={MapIcon} alt="Map" className="h-6 w-6" />
              <span
                className={cn(
                  "text-[15px] transition-colors duration-100 ",
                  !isMap ? "text-[#65717C]" : "text-white"
                )}
              >
                {" "}
                MAP
              </span>
              {isMap && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600" />
              )}
            </div>
          </Link>
        </nav>
      </aside>

      <div className=" col-span-12">
        <Outlet />
      </div>
    </div>
  );
}
