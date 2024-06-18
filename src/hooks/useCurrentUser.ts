import useSWR from "swr";
import { Session } from 'next-auth';

import fetcher from "@/libs/fetcher";

const useCurrentUser = ( session: Session | null ) => {
    const { data, error, isLoading, mutate } = useSWR( session ? '/api/current' : null, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useCurrentUser;