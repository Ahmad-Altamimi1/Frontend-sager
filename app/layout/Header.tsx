import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import SagerLogo from "~assets/Icon/SagerLogo.svg";
import captureIcon from "~assets/Icon/capture-svgrepo-com.svg";
import languageIcon from "~assets/Icon/language-svgrepo-com.svg";
import notificationIcon from "~assets/Icon/bell.svg";

export default function Header() {
  return (
    <header className="bg-[#0B0B0B] text-white w-full ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={SagerLogo} alt="SAGER Logo" className="h-6" />
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden sm:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <img src={captureIcon} alt="Capture" className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <img src={languageIcon} alt="Language" className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <img
                src={notificationIcon}
                alt="Notification"
                className="h-6 w-6"
              />
            </Button>
            <div className="hidden sm:block w-px h-7 bg-[#3C4248] mx-4" />
            <div className="text-sm">
              <p>
                Hello,
                <span className="font-bold"> Ahmad Al-Tamimi</span>
              </p>
              <p className="text-[#748AA1]">Front-end Developer</p>
            </div>
          </div>
          {/* Horizontal Line */}
          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu (hidden by default, can be toggled) */}
        <div className="sm:hidden border-t border-gray-800 pt-4 pb-4 hidden">
          <div className="flex justify-center space-x-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User Account</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
