import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from '@/libs/prismadb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        if(req.method === 'POST') {
            const { currentUser } = await serverAuth(req, res);
            const { body } = req.body;

            console.log('POST Request - Current User:', currentUser);
            console.log('POST Request - Request Body:', req.body);

            const post = await prisma.post.create({
                data:{
                    body,
                    userId: currentUser.id
                }
            });

            console.log('POST Request - Created Post:', post);

            return res.status(200).json(post);
        }

        if (req.method === 'GET') {
            const { userId } = req.query;

            let posts;

            if (userId && typeof userId === 'string') {
                console.log('Finding posts for userId:', userId);

                posts = await prisma.post.findMany({
                    where: {
                        userId
                    },
                    include: {
                        user: true,
                        comments: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

            } else {
                console.log('Finding all posts since no valid userId found.');

                posts = await prisma.post.findMany({
                    include: {
                        user: true,
                        comments: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

            }

            return res.status(200).json(posts);
        }

    } catch (error) {
        console.log('Error:', error);
        return res.status(400).end();
    }
}
