import { format } from 'date-fns';
import useCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useMemo } from 'react';
import Button from '../Button';

interface UserBioProps {
    userId: string;
}

const UserBio: React.FC<UserBioProps> = ({ userId }) => {
    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);
    const { data: fetchedUser } = useUser(userId);

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
                {currentUser.currentUser.id === userId ? (
                    <Button secondary label="Edit" onClick={() => {}} />
                ) : (
                    <Button
                        onClick={() => {}}
                        label="Follow"
                        secondary
                    />
                )}
            </div>
        </div>
    );
}

export default UserBio;
