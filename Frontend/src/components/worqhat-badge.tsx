import { Button } from "@/components/ui/button";
import icon from "@/assets/icon/worqhat-icon.png";
import { getUserDetails } from "@/database/getUserDetails";
import { useEffect, useState } from "react";
import { auth } from "@/database/firebaseConfig";
import Intercom from "@intercom/messenger-js-sdk";
import { UserData } from "@/types/participant";

export function BrandingBadge() {
  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("auth");
        getUserDetails(authUser.uid || "", (userData) => {
          setUser(userData);
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      Intercom({
        app_id: "or2gpwjd",
        user_id: user.uid,
        name: user.name, // Use displayName if available, otherwise fallback to name
        email: user.email,
        created_at: auth.currentUser?.metadata.creationTime
          ? new Date(auth.currentUser.metadata.creationTime).getTime() / 1000
          : undefined,
      });
    }
  }, [user]);

  return (
    <div className="w-full z-[99]">
      <Button
        onClick={() => window.open("https://worqhat.com", "_blank")}
        className="bg-white text-gray-600 text-xs rounded-b-none px-2 hover:bg-gray-200 border border-gray-200 border-b-0
                      dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:border-neutral-700 z-99"
      >
        <img src={icon} alt="WorqHat" className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Made with WorqHat</span>{" "}
      </Button>
    </div>
  );
}
