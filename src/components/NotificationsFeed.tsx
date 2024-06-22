import { BsTwitterX } from "react-icons/bs";

import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const NotificationsFeed = () => {

    const { data: session } = useSession();
    const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser(session);
    const { data: fetchedNotifications = [] } = useNotifications(currentUser?.currentUser.id);

    useEffect(() => {
        mutateCurrentUser();
    }, [mutateCurrentUser]);

    if(fetchedNotifications.length === 0) {
        return (
            <div 
                className="
                    text-neutral-500
                    text-center
                    p-6
                    text-xl
                "
            >
                No Notifications
            </div>
        )
    }

    return ( 
        <div className="flex flex-col">
            {fetchedNotifications.map((notification: Record<string, any>) => (
                <div
                    key={notification.id}
                    className="
                        flex
                        flex-row
                        items-center
                        p-6
                        gap-4
                        border-b-[1px]
                        border-neutral-800
                    "
                >
                    <BsTwitterX color="white" size={32} />
                    <p className="text-white">
                        {notification.body}
                    </p>
                </div>
            ))}
        </div>
     );
}
 
export default NotificationsFeed;