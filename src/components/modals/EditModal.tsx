import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";

interface EditModalProps {

}

const EditModal = () => {
    const editModal = useEditModal();

    const { data: session } = useSession();
    const { data: currentUser } = useCurrentUser(session);
    const { mutate: mutateFetchedUser } = useUser(currentUser?.currentUser.id);

    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        setProfileImage(currentUser?.currentUser?.profileImage);
        setCoverImage(currentUser?.currentUser?.coverImage);
        setName(currentUser?.currentUser?.name);
        setUsername(currentUser?.currentUser?.username);
        setBio(currentUser?.currentUser?.bio);
    }, [
        currentUser?.currentUser?.profileImage,
        currentUser?.currentUser?.coverImage,
        currentUser?.currentUser?.name,
        currentUser?.currentUser?.username,
        currentUser?.currentUser?.bio
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            await axios.patch('/api/edit', {
                name,
                username,
                bio,
                profileImage,
                coverImage
            });
            mutateFetchedUser();

            toast.success('Updated Successfully')

            editModal.onClose();
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong!')
        } finally {
            setIsLoading(false);
        }
    }, [bio, coverImage, name, profileImage, username, editModal, mutateFetchedUser]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload
                value={profileImage}
                disabled={isLoading}
                onChange={(image) => setProfileImage(image)}
                label='Upload Profile Image'
            />
            <ImageUpload
                value={coverImage}
                disabled={isLoading}
                onChange={(image) => setCoverImage(image)}
                label='Upload Cover Image'
            />
            <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            /> 
            <Input
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                disabled={isLoading}
            />  
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={editModal.isOpen}
            title="Edit Your Profile"
            actionLabel="Save"
            onClose={editModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
        />
    )
}

export default EditModal;