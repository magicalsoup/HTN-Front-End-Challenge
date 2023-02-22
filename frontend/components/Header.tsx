import fetchJson from "@/lib/fetchJson";
import useUser from "@/lib/useUser"
import Link from "next/link";
export default function Header() {

    const { user, mutateUser } = useUser();
    
    async function logOut(event: { preventDefault: () => void; }) {
        event.preventDefault();
        mutateUser(
          await fetchJson("/api/logout", {method: "POST"}),
          false,
        );
        location.reload();
      }

    return (
        <div className="bg-slate-900 py-6 px-2 sm:px-12 w-screen fixed flex justify-between text-gray-100 text-xl">
            <h1 className="font-bold text-sm sm:text-xl">Hack the North but from wish</h1>
            {user?.isLoggedIn && 
                <a className="text-sm sm:text-xl hover:cursor-pointer" onClick={logOut}>Log out</a>
            }
            {!user?.isLoggedIn &&
                <a href="/login" className="text-sm sm:text-xl hover:cursor-pointer">Log in</a>
            }
            
        </div>
    )
}