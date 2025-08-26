import { User } from "lucide-react";
import { Button } from "~/components/ui/button";
import SagerLogo from "~assets/Icon/SagerLogo.svg";
import captureIcon from "~assets/Icon/capture-svgrepo-com.svg";
import languageIcon from "~assets/Icon/language-svgrepo-com.svg";
import notificationIcon from "~assets/Icon/bell.svg";

export default function Header() {
  return (
    <header className="bg-[#0B0B0B] text-white w-full border-b border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={SagerLogo} alt="SAGER Logo" className="h-7 sm:h-8" />
          </div>

          {/* Action Icons - Responsive Layout */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Capture Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800 transition-colors p-1.5 sm:p-2 lg:p-2.5"
              title="Capture"
            >
              <img
                src={captureIcon}
                alt="Capture"
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
              />
            </Button>

            {/* Language Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800 transition-colors p-1.5 sm:p-2 lg:p-2.5"
              title="Language"
            >
              <img
                src={languageIcon}
                alt="Language"
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
              />
            </Button>

            {/* Notification Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800 transition-colors p-1.5 sm:p-2 lg:p-2.5"
              title="Notifications"
            >
              <img
                src={notificationIcon}
                alt="Notification"
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
              />
            </Button>

            {/* Divider - Hidden on very small screens */}
            <div className="hidden sm:block w-px h-8 bg-zinc-700 mx-2 lg:mx-4" />

            {/* User Profile - Responsive Text */}
            <div className="hidden sm:block text-sm">
              <p className="text-white">
                Hello, <span className="font-semibold">Ahmad Al-Tamimi</span>
              </p>
              <p className="text-zinc-400 text-xs lg:text-sm">
                Front-end Developer
              </p>
            </div>

            {/* User Avatar - Always visible */}
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-zinc-700 rounded-full border border-zinc-600">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-zinc-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
