import { format } from 'date-fns';
import { useMemo } from 'react';
import { BiCalendar } from 'react-icons/bi';
import Button from '../Button';

import { useSession } from "next-auth/react";

import useUser from "@/hooks/useUser";
import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from '@/hooks/useEditModal';
import useFollow from '@/hooks/useFollow';

interface UserBioProps {
    userId: string;
}

const UserBio: React.FC<UserBioProps> = ({ userId }) => {
    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);
    const { data: fetchedUser } = useUser(userId);

    const editModal = useEditModal();

    const { isFollowing, toggleFollow } = useFollow(userId);

    const createdAt = useMemo(() => {
        if (!fetchedUser?.createdAt) {
            return null;
        }

        return format(new Date(fetchedUser.createdAt), 'MMMM yyyy');
    }, [fetchedUser?.createdAt]);

    console.log('currentUser:', currentUser); // Check currentUser in console
    console.log('Session:', session);

    return (
        <div className='border-b-[1px] border-neutral-800 pb-4'>
            <div className='flex justify-end p-2'>
                {currentUser?.currentUser?.id === userId ? (
                    <Button secondary label="Edit" onClick={editModal.onOpen} />
                ) : (
                    <Button
                        onClick={toggleFollow}
                        label={isFollowing ? 'Unfollow' : 'Follow'}
                        secondary={!isFollowing}
                        outline={isFollowing}
                    />
                )}
            </div>
            <div className='mt-8 px-4'>
                <div className='flex flex-col'>
                    <p className='text-white text-2xl font-semibold'>{fetchedUser?.name}</p>
                    <p className='text-neutral-500 text-md'>@{fetchedUser?.username}</p>
                </div>
                <div className='flex flex-col mt-4'>
                    <p className='text-white'>{fetchedUser.bio}</p>
                    <div className='flex flex-row items-center gap-2 mt-4 text-neutral-500'>
                        <BiCalendar size={24} />
                        <p className=''>
                            Joined {createdAt}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row items-center mt-4 gap-6'>
                    <div className='flex flex-row items-center gap-1'>
                        <p className='text-white'>{fetchedUser?.followingIds.length}</p>
                        <p className='text-neutral-500'>Following</p>
                    </div>
                    <div className='flex flex-row items-center gap-1'>
                        <p className='text-white'>{fetchedUser?.followersCount || 0}</p>
                        <p className='text-neutral-500'>Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserBio;
