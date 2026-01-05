'use client';

import { useOptimistic, useRef } from 'react';
import { addComment, upvoteComment } from '@/lib/actions';

type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    upvotes: number;
    user: {
        name: string | null;
    };
};

export function CommentsSection({
    postId,
    initialComments,
    currentUserName
}: {
    postId: string;
    initialComments: Comment[];
    currentUserName: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);

    const [optimisticComments, addOptimisticComment] = useOptimistic(
        initialComments,
        (state, newComment: Comment) => [newComment, ...state]
    );

    const handleAddComment = async (formData: FormData) => {
        const content = formData.get('content') as string;
        if (!content.trim()) return;

        // Optimistic Update
        addOptimisticComment({
            id: Math.random().toString(),
            content,
            createdAt: new Date(),
            upvotes: 0,
            user: { name: currentUserName }
        });

        formRef.current?.reset();
        await addComment(postId, content);
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold text-gray-500 text-xs uppercase mb-2">Comments ({optimisticComments.length})</h3>

            <div className="space-y-3 mb-20">
                {optimisticComments.map(comment => (
                    <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-gray-700">{comment.user.name}</span>
                            <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                        <div className="mt-2 flex items-center gap-2">
                            {/* Upvote is separate action, for now keep simple button or we can make it optimistic too */}
                            <form action={async () => { await upvoteComment(comment.id); }}>
                                <button className="text-[10px] text-gray-500 hover:text-blue-500 font-bold flex items-center gap-1">
                                    <span>▲</span>
                                    <span>{comment.upvotes || 0}</span>
                                    <span>Helpful</span>
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <form
                    ref={formRef}
                    action={handleAddComment}
                    className="flex gap-2 max-w-xl mx-auto"
                >
                    <input
                        name="content"
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-100 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button className="bg-blue-600 text-white px-6 rounded-full font-bold">Post</button>
                </form>
            </div>
        </div>
    );
}
