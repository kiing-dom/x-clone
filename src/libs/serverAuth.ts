import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prisma from '@/libs/prismadb'

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session) {
    throw new Error('Unauthorized: No valid session found'); // Use 401 for unauthorized
  }

  if (!session.user?.email) {
    throw new Error('Invalid Session: Missing email in session data');
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  });

  if (!currentUser) {
    throw new Error('User Not Found: User not found in database');
  }

  return { currentUser }
};

export default serverAuth;
