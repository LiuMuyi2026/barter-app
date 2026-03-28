
import prisma from '@/lib/prisma';
import { addComment, upvoteComment } from '@/lib/actions';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { CommentsSection } from '@/components/comments-section';

async function getPost(postId: string) {
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: true,
            comments: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}

export default async function PostPage(
    props: {
        params: Promise<{ id: string; postId: string }>
    }
) {
    const params = await props.params;
    const { id, postId } = params;
    const post = await getPost(postId);
    const session = await auth();

    if (!post) return <div className="p-10 text-center">Post not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white sticky top-0 z-10 p-4 shadow-sm flex items-center gap-4">
                <a href={`/community/${id}`} className="text-gray-500">← Back</a>
                <h1 className="font-bold truncate">{post.title || 'Post'}</h1>
            </header>

            <div className="p-4 space-y-4">
                {/* Post Content */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                            {post.user.name?.[0] || '?'}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold">{post.user.name}</h3>
                            <span className="text-xs text-gray-400">{post.type}</span>
                        </div>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Comments Section */}
                <div>
                    <CommentsSection
                        postId={postId}
                        initialComments={post.comments}
                        currentUserName={session?.user?.name || 'Anonymous'}
                    />
                </div>
            </div>
        </div>
    );
}

