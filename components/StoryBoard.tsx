
import React, { useState } from 'react';
import { User, Post, Comment } from '../types';

interface StoryBoardProps {
  currentUser: User | null;
  posts: Post[];
  users: User[]; 
  onPostCreate?: (content: string, image?: string, video?: string, location?: string, feeling?: string) => void;
  onLike: (postOwnerId: string, postId: string) => void;
  onComment: (postOwnerId: string, postId: string, text: string) => void;
  onShare: (postOwnerId: string, postId: string) => void; 
  showCreateBox?: boolean;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({
  currentUser,
  posts,
  users,
  onPostCreate,
  onLike,
  onComment,
  onShare,
  showCreateBox = false
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  
  // Tagging State (Simplified mock)
  const [isTagging, setIsTagging] = useState(false);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim() && onPostCreate) {
      onPostCreate(newPostContent, mediaType === 'image' ? mediaUrl : undefined, mediaType === 'video' ? mediaUrl : undefined, location, feeling);
      setNewPostContent('');
      setMediaUrl('');
      setMediaType(null);
      setLocation('');
      setFeeling('');
      setShowExtras(false);
    }
  };

  const handleMediaUpload = (type: 'image' | 'video') => {
      const url = prompt(`Enter ${type} URL (e.g. https://example.com/image.jpg):`);
      if (url) {
          setMediaType(type);
          setMediaUrl(url);
          setShowExtras(true);
      }
  };

  const insertTag = (username: string) => {
      setNewPostContent(prev => prev + `@${username} `);
      setIsTagging(false);
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const submitComment = (post: Post) => {
    const text = commentInputs[post.id];
    if (text?.trim()) {
      onComment(post.authorId, post.id, text);
      setCommentInputs(prev => ({ ...prev, [post.id]: '' }));
      setVisibleComments(prev => ({ ...prev, [post.id]: true })); 
    }
  };

  const toggleComments = (postId: string) => {
    setVisibleComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getAuthor = (userId: string) => users.find(u => u.id === userId) || { name: 'Unknown', avatar: 'https://via.placeholder.com/150' } as User;

  // Highlight hashtags and mentions in text
  const renderRichText = (text: string) => {
      const parts = text.split(/(\s+)/);
      return parts.map((part, i) => {
          if (part.startsWith('#')) return <span key={i} className="text-primary-teal font-bold">{part}</span>;
          if (part.startsWith('@')) return <span key={i} className="text-accent-sky font-bold cursor-pointer">{part}</span>;
          return part;
      });
  };

  return (
    <div className="space-y-8">
      {/* 1. Create Post Box */}
      {showCreateBox && currentUser && (
        <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex gap-4">
            <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary-teal"
            />
            <div className="flex-grow">
                <form onSubmit={handleCreatePost}>
                    <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder={`Share your story, ${currentUser.name.split(' ')[0]}...`}
                        className="w-full bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary-teal/20 outline-none text-gray-800 dark:text-white resize-none h-24 mb-3 transition-all"
                    ></textarea>
                    
                    {isTagging && (
                        <div className="flex flex-wrap gap-2 mb-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                            <span className="text-xs text-gray-500 w-full mb-1">Tag a friend:</span>
                            {users.filter(u => u.id !== currentUser.id).slice(0,5).map(u => (
                                <button key={u.id} type="button" onClick={() => insertTag(u.name.replace(' ',''))} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded shadow-sm hover:bg-primary-teal hover:text-white">
                                    @{u.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Extra Inputs */}
                    {showExtras && (
                        <div className="mb-4 space-y-3 animate-fade-in">
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Add Location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="flex-1 p-2 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none text-sm dark:text-white"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Feeling..."
                                    value={feeling}
                                    onChange={e => setFeeling(e.target.value)}
                                    className="flex-1 p-2 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none text-sm dark:text-white"
                                />
                            </div>
                            {mediaUrl && (
                                <div className="relative rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 mt-2">
                                    {mediaType === 'image' ? <img src={mediaUrl} alt="Preview" className="w-full h-48 object-cover" /> : <video src={mediaUrl} className="w-full h-48 object-cover" controls />}
                                    <button type="button" onClick={() => { setMediaUrl(''); setMediaType(null); }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-500"><i className="fas fa-times text-xs"></i></button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                            <button type="button" onClick={() => handleMediaUpload('image')} className="hover:text-primary-teal transition-colors"><i className="fas fa-image text-lg"></i></button>
                            <button type="button" onClick={() => handleMediaUpload('video')} className="hover:text-secondary-mint transition-colors"><i className="fas fa-video text-lg"></i></button>
                            <button type="button" onClick={() => setShowExtras(!showExtras)} className="hover:text-yellow-500 transition-colors"><i className="fas fa-map-marker-alt text-lg"></i></button>
                            <button type="button" onClick={() => setIsTagging(!isTagging)} className="hover:text-accent-sky transition-colors"><i className="fas fa-user-tag text-lg"></i></button>
                        </div>
                        <button type="submit" disabled={!newPostContent.trim()} className="bg-primary-teal text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-secondary-mint transition-all disabled:opacity-50">Post</button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Feed Stream */}
      {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-dark-mode-input-bg rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No stories yet.</p>
          </div>
      ) : (
          posts.map(post => {
              const author = getAuthor(post.authorId);
              const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
              
              return (
                  <div key={post.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="p-5 flex items-center gap-3">
                          <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm" />
                          <div className="flex-grow">
                              <h4 className="font-bold text-gray-900 dark:text-white leading-tight text-base">{author.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  <span>{new Date(post.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                  {post.location && <span>• <span className="text-primary-teal">{post.location}</span></span>}
                                  {post.feeling && <span>• <span className="text-yellow-500">feeling {post.feeling}</span></span>}
                              </div>
                          </div>
                      </div>

                      <div className="px-5 pb-4">
                          <p className="text-gray-800 dark:text-gray-200 text-base whitespace-pre-wrap leading-relaxed mb-4">{renderRichText(post.text)}</p>
                      </div>

                      {post.image && <img src={post.image} alt="Story" className="w-full max-h-[500px] object-cover" />}
                      {post.video && <video src={post.video} controls className="w-full max-h-[500px]" />}

                      <div className="px-5 py-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                          <span>{post.likes.length} Likes</span>
                          <div className="flex gap-3">
                              <span>{post.comments.length} Comments</span>
                              <span>{post.shares} Shares</span>
                          </div>
                      </div>

                      <div className="px-2 py-1 flex items-center justify-between">
                          <button onClick={() => onLike(post.authorId, post.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-colors ${isLiked ? 'text-brand-pink' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                              <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-lg`}></i> Like
                          </button>
                          <button onClick={() => toggleComments(post.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <i className="far fa-comment-alt text-lg"></i> Comment
                          </button>
                          <button onClick={() => onShare(post.authorId, post.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <i className="fas fa-share text-lg"></i> Share
                          </button>
                      </div>

                      {visibleComments[post.id] && (
                          <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-5 border-t border-gray-100 dark:border-gray-700">
                              {post.comments.length > 0 && (
                                  <div className="space-y-4 mb-5 max-h-60 overflow-y-auto">
                                      {post.comments.map(comment => (
                                          <div key={comment.id} className="flex gap-3">
                                              <img src={comment.userAvatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                                              <div className="bg-white dark:bg-dark-mode-card-bg px-3 py-2 rounded-2xl shadow-sm flex-grow">
                                                  <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{comment.userName}</p>
                                                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              
                              <div className="flex gap-2 items-center">
                                  <img src={currentUser?.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                                  <div className="flex-grow relative">
                                      <input 
                                        type="text" 
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                        placeholder="Write a comment..." 
                                        className="w-full bg-white dark:bg-dark-mode-card-bg rounded-full pl-4 pr-12 py-2.5 text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-teal/20 dark:text-white"
                                        onKeyDown={(e) => e.key === 'Enter' && submitComment(post)}
                                      />
                                      <button onClick={() => submitComment(post)} className="absolute right-1 top-1 w-8 h-8 rounded-full bg-primary-teal text-white flex items-center justify-center hover:bg-secondary-mint transition-colors shadow-sm" disabled={!commentInputs[post.id]?.trim()}>
                                          <i className="fas fa-paper-plane text-xs"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              );
          })
      )}
    </div>
  );
};
