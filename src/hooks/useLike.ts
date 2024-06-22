import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';

import useCurrentUser from "./useCurrentUser";
import usePost from "./usePost";
import usePosts from "./usePosts";
import useLoginModal from "./useLoginModal";
import axios from "axios";

const useLike = ({ postId, userId }: {postId: string, userId?: string}) => {
    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);

    const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
    const { mutate: mutateFetchedPosts } = usePosts(userId);

    const loginModal = useLoginModal();

    const hasLiked = useMemo(() => {
        const list = fetchedPost?.likedIds || [];

        return list.includes(currentUser?.currentUser?.id)
    }, [currentUser?.currentUser?.id, fetchedPost?.likedIds]);

    const toggleLike = useCallback(async() => {
        if(!currentUser) 
            return loginModal.onOpen();

        try {
            let request;

            if(hasLiked) {
                request = () => axios.delete('/api/like', { data: { postId} });
            } else {
                request = () => axios.post('/api/like', { postId });
            }

            await request();
            mutateFetchedPost();
            mutateFetchedPosts();

            toast.success('Success!')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [
        currentUser,
        hasLiked,
        postId,
        mutateFetchedPost,
        mutateFetchedPosts,
        loginModal
    ]);

    return {
        hasLiked,
        toggleLike
    }
};

export default useLike;