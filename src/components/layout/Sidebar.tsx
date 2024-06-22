import { BsBellFill, BsHouseFill } from "react-icons/bs"
import { signOut, useSession } from "next-auth/react"
import { BiLogOut } from "react-icons/bi"
import { FaUser } from "react-icons/fa"

import useCurrentUser from "@/hooks/useCurrentUser"

import SidebarLogo from "./SidebarLogo"
import SidebarItem from "./SidebarItem"
import SidebarTweetButton from "./SidebarTweetButton"

const Sidebar = () => {
    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);

    const items = [
        {
            label: 'Home',
            href: '/',
            icon: BsHouseFill
        },
        {
            label: 'Notifications',
            href: '/notifications',
            icon: BsBellFill,
            auth: true,
            alert: currentUser?.currentUser?.hasNotification
        },
        {
            label: 'Profile',
            href: `/users/${currentUser?.currentUser?.id}`,
            icon: FaUser,
            auth: true
        }
    ]

    return (
        <div className="col-span-1 h-full pr-4 md:pr-6">
            <div className="flex flex-col items-end">
                <div className="space-y-2 lg:w-[230px]">
                    <SidebarLogo />
                    {items.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            auth={item.auth}
                            alert={item.alert}
                        />
                    ))}
                    {currentUser && (
                        <SidebarItem
                            onClick={() => signOut()}
                            icon={BiLogOut}
                            label="Logout"
                        />
                    )}

                    <SidebarTweetButton />
                </div>
            </div>
        </div>
    )
}

export default Sidebar