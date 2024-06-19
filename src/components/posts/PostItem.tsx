import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import { formatDistanceToNowStrict } from "date-fns";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import Avatar from "../Avatar";

interface PostItemProps {
    userId?: string;
    data: Record<string, any>;
}

const PostItem: React.FC<PostItemProps> = ({ userId, data }) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);

    const goToUser = useCallback((event: any) => {
        event.stopPropagation();

        router.push(`/users/${data.user.id}`);
    }, [router, data.user.id]);

    const goToPost = useCallback(() => {
        router.push(`/posts/${data.id}`)
    }, [router, data.id]);

    const onLike = useCallback((event: any) => {
        event.stopPropagation();

        loginModal.onOpen();
    }, [loginModal]);

    const createdAt = useMemo(() => {
        if (!data?.createdAt) {
            return null;
        }

        return formatDistanceToNowStrict(new Date(data.createdAt))
    }, [data?.createdAt])


    return (
        <div
            onClick={goToPost}
            className="
                border-b-[1px]
                border-neutral-800
                p-5
                cursor-pointer
                hover:bg-neutral-900
                transition
            "
        >
            <div className="flex flex-row items-start gap-3">
                <Avatar userId={data.user.id} />
                <div>
                    <div className="
                        flex flex-row items-center gap-2
                    ">
                        <p
                            onClick={goToUser}
                            className="
                            text-white 
                            font-semibold 
                            cursor-pointer 
                            hover:underline"
                        >
                            {data.user.name}
                        </p>
                        <span
                            onClick={goToUser}
                            className="
                            text-neutral-500 
                            cursor-pointer 
                            hover:underline 
                            hidden md:block"
                        >
                            @{data.user.username}
                        </span>
                        <span className="text-neutral-500 text-sm">
                            {createdAt}
                        </span>
                    </div>
                    <div className="text-white mt-1">
                        {data.body}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;