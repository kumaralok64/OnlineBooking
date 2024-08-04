import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

 interface User{
    Username:string,
    image:string
 }
  interface SheetDemoProps {
    user: User;
    handleSignOut: () => void;
  }

export function SheetDemo({ user, handleSignOut }:SheetDemoProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex-center gap-2">
          <img src={user.image} className="h-8 w-8 rounded-full" alt="User" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-gray-400 text-pretty flex flex-center gap-4 roboto-slab text-[15px] sm:text-[20px]">
            <img src={user.image} className="h-8 w-8 rounded-full" alt="User" />
            {user.Username}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 base-medium font-semibold py-8 px-2">
          <Link to="/history" className="flex leftsidebar-link flex-row items-center gap-3">
            Your Orders
          </Link>
          <div className="flex flex-row leftsidebar-link items-center gap-3">
            Help & Support
          </div>
          <div className="flex flex-row leftsidebar-link items-center gap-3">
            Account & Settings
          </div>
          <div className="flex flex-row leftsidebar-link items-center gap-3">
            Play Credit Card
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" variant="ghost" className="shad-button_ghost gap-4" onClick={handleSignOut}>
              <img src="/icons/logout.svg" alt="Logout" />
              <p className="text-light-3 font-semibold hover:text-white">Sign Out</p>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
