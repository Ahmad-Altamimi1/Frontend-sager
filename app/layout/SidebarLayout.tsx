import { Link, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Gauge, Menu, X } from "lucide-react";
import { cn } from "~/lib/utils";
import DashboardIcon from "~assets/Icon/dashboard-svgrepo-com-2.svg";
import MapIcon from "~assets/Icon/MAPLight.svg";
import { useState } from "react";

export default function SidebarLayout() {
  const location = useLocation();
  const isMap = location.pathname.startsWith("/map");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-90px)] overflow-hidden bg-[#0A0A0A]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#111111] border-b border-zinc-800 p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <Menu size={20} className="text-zinc-300" />
        </button>
        <h1 className="text-lg font-semibold text-white">
          {isMap ? "Map" : "Dashboard"}
        </h1>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar - No full overlay, just the sidebar itself */}
      <aside
        className={cn(
          "bg-[#111111] backdrop-blur border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-in-out",
          // Mobile: slide in from left, fixed positioning
          "lg:hidden fixed top-0 left-0 h-full w-72 transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, 2 columns
          "lg:relative lg:col-span-2 lg:transform-none lg:h-[calc(100vh-90px)]"
        )}
      >
        {/* Mobile Sidebar Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Navigation</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X size={18} className="text-zinc-300" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 pt-3">
          <Link
            to="/"
            className="group"
            aria-label="Dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={cn(
                "relative flex flex-col gap-2 p-2 w-full items-center justify-center hover:bg-[#272727] transition-colors",
                !isMap && "bg-[#272727] text-white"
              )}
            >
              {!isMap && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600 transition-all duration-200" />
              )}

              <Gauge
                size={26}
                className={cn(
                  "transition-colors duration-100",
                  isMap ? "text-[#65717C]" : "text-white"
                )}
              />
              <span
                className={cn(
                  "text-[15px] transition-colors duration-100 lg:hidden ",
                  isMap ? "text-[#65717C]" : "text-white"
                )}
              >
                DASHBOARD
              </span>
            </div>
          </Link>
          <Link
            to="/map"
            className="group"
            aria-label="Map"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={cn(
                "relative flex flex-col gap-2 p-2 w-full items-center justify-center hover:bg-[#272727] transition-colors",
                isMap && "bg-[#272727]"
              )}
            >
              <img src={MapIcon} alt="Map" className="h-6 w-6" />
              <span
                className={cn(
                  "text-[15px] transition-colors duration-100 lg:hidden",
                  !isMap ? "text-[#65717C]" : "text-white"
                )}
              >
                MAP
              </span>
              {isMap && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600" />
              )}
            </div>
          </Link>
        </nav>
      </aside>

      <div className="lg:grid lg:grid-cols-[repeat(14,minmax(0,1fr))]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:col-span-2 lg:h-[calc(100vh-90px)] bg-[#111111] backdrop-blur border-r border-zinc-800 z-40  flex-col">
          <nav className="flex-1 flex flex-col gap-2 pt-3">
            <Link to="/" className="group" aria-label="Dashboard">
              <div
                className={cn(
                  "relative flex flex-col gap-2 p-2 w-full items-center justify-center hover:bg-[#272727] transition-colors",
                  !isMap && "bg-[#272727] text-white"
                )}
              >
                {!isMap && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-red-600 transition-all duration-200" />
                )}

                <Gauge
                  size={26}
                  className={cn(
                    "transition-colors duration-100",
                    isMap ? "text-[#65717C]" : "text-white"
                  )}
                />
                <span
                  className={cn(
                    "text-[15px] transition-colors duration-100 hidden lg:block",
                    isMap ? "text-[#65717C]" : "text-white"
                  )}
                >
                  DASHBOARD
                </span>
              </div>
            </Link>
            <Link to="/map" className="group" aria-label="Map">
              <div
                className={cn(
                  "relative flex flex-col gap-2 p-2 w-full items-center justify-center hover:bg-[#272727] transition-colors",
                  isMap && "bg-[#272727]"
                )}
              >
                <img src={MapIcon} alt="Map" className="h-6 w-6" />
                <span
                  className={cn(
                    "text-[15px] transition-colors duration-100 hidden lg:block",
                    !isMap ? "text-[#65717C]" : "text-white"
                  )}
                >
                  MAP
                </span>
                {isMap && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-red-600" />
                )}
              </div>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
