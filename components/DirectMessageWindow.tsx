
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { ChatMessage, User, ChatAttachment } from '../types';
import { mockChallenges, mockEvents, mockGroups, mockTravelPlans } from '../constants';

// Mock Data for New Features
const mockGifs = [
  { id: 'gif1', url: 'https://picsum.photos/seed/gif1/300/200', title: 'Excited' },
  { id: 'gif2', url: 'https://picsum.photos/seed/gif2/300/200', title: 'Funny' },
  { id: 'gif3', url: 'https://picsum.photos/seed/gif3/300/200', title: 'Wow' },
  { id: 'gif4', url: 'https://picsum.photos/seed/gif4/300/200', title: 'High Five' },
];

const mockMusic = [
  { id: 'm1', title: 'Healing Sounds', subtitle: 'Nature Vibes', imageUrl: 'https://picsum.photos/seed/music1/100/100' },
  { id: 'm2', title: 'Morning Flow', subtitle: 'Yoga Beats', imageUrl: 'https://picsum.photos/seed/music2/100/100' },
  { id: 'm3', title: 'Deep Focus', subtitle: 'Lo-Fi Study', imageUrl: 'https://picsum.photos/seed/music3/100/100' },
];

const mockMovies = [
  { id: 'mov1', title: 'The Peaceful Warrior', subtitle: '2006', imageUrl: 'https://picsum.photos/seed/movie1/100/150' },
  { id: 'mov2', title: 'Into the Wild', subtitle: '2007', imageUrl: 'https://picsum.photos/seed/movie2/100/150' },
  { id: 'mov3', title: 'Eat Pray Love', subtitle: '2010', imageUrl: 'https://picsum.photos/seed/movie3/100/150' },
];

const mockBooks = [
  { id: 'bk1', title: 'The Power of Now', subtitle: 'Eckhart Tolle', imageUrl: 'https://picsum.photos/seed/book1/100/150' },
  { id: 'bk2', title: 'Atomic Habits', subtitle: 'James Clear', imageUrl: 'https://picsum.photos/seed/book2/100/150' },
  { id: 'bk3', title: 'Think Like a Monk', subtitle: 'Jay Shetty', imageUrl: 'https://picsum.photos/seed/book3/100/150' },
];

export const DirectMessageWindow: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  // Action Menu State
  const [showActions, setShowActions] = useState(false);
  const [activeActionTab, setActiveActionTab] = useState<'games' | 'travel' | 'events' | 'groups' | 'gif' | 'music' | 'movie' | 'book' | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { currentUser, allUsers, allConversations, sendDirectMessage, updateMessageStatus } = context;

  const conversation = allConversations.find(conv => conv.id === conversationId);
  const otherParticipantId = conversation?.participants.find(id => id !== currentUser?.id);
  const otherUser = allUsers.find(user => user.id === otherParticipantId);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, scrollToBottom, isTyping]);

  // Simulation Effect for Read Receipts and Typing
  useEffect(() => {
    if (!conversation || !currentUser || !updateMessageStatus) return;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    // Only simulate if the last message was sent by current user and isn't read yet
    if (lastMessage && lastMessage.senderId === currentUser.id && lastMessage.status !== 'read') {
        // 1. Simulate Delivered
        const deliverTimer = setTimeout(() => {
            updateMessageStatus(conversation.id, lastMessage.id, 'delivered');
        }, 1000);

        // 2. Simulate Read (after delivery)
        const readTimer = setTimeout(() => {
            updateMessageStatus(conversation.id, lastMessage.id, 'read');
        }, 2500);

        // 3. Simulate Typing Reply (after read)
        const typingStartTimer = setTimeout(() => {
            setIsTyping(true);
        }, 3500);

        // 4. Stop Typing (simulation ends)
        const typingStopTimer = setTimeout(() => {
            setIsTyping(false);
        }, 6500);

        return () => {
            clearTimeout(deliverTimer);
            clearTimeout(readTimer);
            clearTimeout(typingStartTimer);
            clearTimeout(typingStopTimer);
        };
    }
  }, [conversation?.messages, currentUser, updateMessageStatus]);


  if (!currentUser) {
    return <p className="text-center text-xl text-dark-text dark:text-dark-mode-text">Please log in.</p>;
  }

  if (!conversation || !otherUser) {
    return (
      <div className="text-center text-xl text-dark-text dark:text-dark-mode-text p-6">
        Conversation not found. <button onClick={() => navigate('/dm')} className="text-accent-sky hover:underline">Go back</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && conversationId && sendDirectMessage) {
      sendDirectMessage(conversationId, inputText);
      setInputText('');
    }
  };

  const handleSendAttachment = (type: ChatAttachment['type'], item: any) => {
    if (!conversationId || !sendDirectMessage) return;

    let attachment: ChatAttachment;
    let fallbackText = '';

    switch (type) {
      case 'game':
        attachment = { type, id: item.id, title: item.name, subtitle: item.reward, imageUrl: item.image };
        fallbackText = `Challenged you to: ${item.name}`;
        break;
      case 'travel':
        attachment = { type, id: item.id, title: item.name, subtitle: item.location, imageUrl: item.image };
        fallbackText = `Shared a travel plan: ${item.name}`;
        break;
      case 'event':
        attachment = { type, id: item.id, title: item.name, subtitle: new Date(item.date).toLocaleDateString(), imageUrl: item.image };
        fallbackText = `Invited you to event: ${item.name}`;
        break;
      case 'group':
        attachment = { type, id: item.id, title: item.name, subtitle: `${item.members.length} members`, imageUrl: item.image };
        fallbackText = `Shared group: ${item.name}`;
        break;
      case 'gif':
        attachment = { type, id: item.id, title: 'GIF', imageUrl: item.url };
        fallbackText = 'Sent a GIF';
        break;
      case 'music':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Shared song: ${item.title}`;
        break;
      case 'movie':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Recommended movie: ${item.title}`;
        break;
      case 'book':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Recommended book: ${item.title}`;
        break;
      default:
        return;
    }

    sendDirectMessage(conversationId, fallbackText, attachment);
    setShowActions(false);
    setActiveActionTab(null);
  };

  const StatusIcon = ({ status }: { status?: 'sent' | 'delivered' | 'read' | 'unread' }) => {
      if (!status) return null;
      let icon = 'fa-check';
      let color = 'text-gray-400 dark:text-gray-500';
      if (status === 'delivered') icon = 'fa-check-double';
      else if (status === 'read') { icon = 'fa-check-double'; color = 'text-blue-500 dark:text-blue-400'; }
      return <i className={`fas ${icon} ${color} text-[10px] transition-colors duration-300 ml-1`} title={status}></i>;
  };

  const AttachmentCard = ({ attachment, isMe }: { attachment: ChatAttachment; isMe: boolean }) => {
    const iconMap: any = { game: 'fas fa-gamepad', travel: 'fas fa-plane', event: 'fas fa-calendar-alt', group: 'fas fa-users', gif: 'fas fa-image', music: 'fas fa-music', movie: 'fas fa-film', book: 'fas fa-book' };
    const colorMap: any = {
      game: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50',
      travel: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50',
      event: 'text-orange-600 bg-orange-100 dark:bg-orange-900/50',
      group: 'text-green-600 bg-green-100 dark:bg-green-900/50',
      gif: 'text-pink-600 bg-pink-100 dark:bg-pink-900/50',
      music: 'text-red-600 bg-red-100 dark:bg-red-900/50',
      movie: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50',
      book: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50'
    };

    if (attachment.type === 'gif') {
        return (
            <div className="mt-2 rounded-xl overflow-hidden shadow-sm">
                <img src={attachment.imageUrl} alt="GIF" className="w-full h-auto max-h-48 object-cover" />
            </div>
        );
    }

    return (
      <div className={`mt-3 rounded-xl overflow-hidden border shadow-sm ${isMe ? 'border-white/20 bg-white/10' : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-dark-mode-card-bg'}`}>
        {attachment.imageUrl && (
          <div className="h-28 w-full relative group cursor-pointer">
            <img src={attachment.imageUrl} alt={attachment.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm backdrop-blur-md ${colorMap[attachment.type]}`}>
               <i className={iconMap[attachment.type]}></i>
               <span>{attachment.type}</span>
            </div>
          </div>
        )}
        <div className="p-3.5">
          <h4 className={`font-bold text-sm leading-tight mb-1 ${isMe ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{attachment.title}</h4>
          {attachment.subtitle && (
            <p className={`text-xs mb-3 ${isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>{attachment.subtitle}</p>
          )}
          <button className={`w-full py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            isMe 
            ? 'bg-white/20 text-white hover:bg-white/30' 
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}>
            View
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] bg-[#ffffff] dark:bg-dark-mode-bg rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto relative border border-gray-200 dark:border-gray-700">
      
      {/* 1. Modern Header */}
      <div className="px-6 py-4 bg-white/90 dark:bg-dark-mode-card-bg/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dm')} className="md:hidden text-gray-500 hover:text-brand-teal transition-colors">
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <div className="relative cursor-pointer" onClick={() => navigate(`/users/${otherUser.id}`)}>
            <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white dark:border-gray-600" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-mode-card-bg rounded-full"></div>
          </div>
          <div className="cursor-pointer" onClick={() => navigate(`/users/${otherUser.id}`)}>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{otherUser.name}</h2>
            <p className="text-xs text-brand-teal font-semibold flex items-center gap-1.5 mt-0.5">
              Active Now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
           <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-teal transition-all" title="Call">
             <i className="fas fa-phone-alt text-lg"></i>
           </button>
           <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-teal transition-all" title="Video">
             <i className="fas fa-video text-lg"></i>
           </button>
           <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-teal transition-all" onClick={() => navigate(`/users/${otherUser.id}`)} title="Info">
             <i className="fas fa-info-circle text-xl"></i>
           </button>
        </div>
      </div>

      {/* 2. Message Area */}
      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6 bg-[#F8FAFC] dark:bg-dark-mode-bg scroll-smooth">
        {conversation.messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">👋</div>
              <p className="text-lg font-medium">Say hello to start the conversation!</p>
           </div>
        ) : (
          conversation.messages.map((message) => {
            const isMe = message.senderId === currentUser.id;
            return (
              <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-fade-in-up items-end`}>
                {!isMe && (
                   <img 
                    src={otherUser.avatar} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full object-cover mr-3 mb-4 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/users/${otherUser.id}`)}
                   />
                )}
                
                <div className={`max-w-[85%] md:max-w-[65%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`px-5 py-3.5 text-sm md:text-[15px] shadow-sm leading-relaxed ${
                     isMe 
                     ? 'bg-gradient-to-br from-brand-teal to-brand-blue text-white rounded-2xl rounded-tr-none shadow-brand-teal/20' 
                     : 'bg-white dark:bg-dark-mode-input-bg text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none'
                   }`}>
                     {message.text && <p>{message.text}</p>}
                     {message.attachment && <AttachmentCard attachment={message.attachment} isMe={isMe} />}
                   </div>
                   
                   <div className={`text-[10px] font-medium text-gray-400 mt-1.5 px-1 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                     <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     {isMe && message.status && <StatusIcon status={message.status} />}
                   </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
            <div className="flex justify-start animate-fade-in-up mb-2 items-end">
                <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name} 
                    className="w-9 h-9 rounded-full object-cover mr-3 mb-1 shadow-sm opacity-90 border border-gray-100 dark:border-gray-700"
                />
                <div className="bg-white dark:bg-dark-mode-input-bg border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none py-3 px-4 shadow-sm flex items-center gap-1 h-10">
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Action Menu (Slide Up) */}
      {showActions && (
        <div className="absolute bottom-24 left-4 right-4 md:left-12 md:right-12 bg-white/95 dark:bg-dark-mode-card-bg/95 backdrop-blur-xl rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 overflow-hidden z-30 animate-fade-in-up transform transition-all">
           
           {/* Tab Headers */}
           {!activeActionTab ? (
              <div className="p-6">
                 <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Fun Stuff</h3>
                 <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                       { id: 'gif', label: 'GIFs', icon: 'fas fa-bolt', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40' },
                       { id: 'music', label: 'Music', icon: 'fas fa-music', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40' },
                       { id: 'movie', label: 'Movies', icon: 'fas fa-film', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' },
                       { id: 'book', label: 'Books', icon: 'fas fa-book', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40' }
                    ].map(action => (
                        <button 
                          key={action.id}
                          onClick={() => setActiveActionTab(action.id as any)}
                          className="flex flex-col items-center gap-2 group"
                        >
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 ${action.color}`}>
                              <i className={action.icon}></i>
                           </div>
                           <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{action.label}</span>
                        </button>
                    ))}
                 </div>

                 <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Share Activity</h3>
                 <div className="grid grid-cols-4 gap-4">
                 {[
                   { id: 'games', label: 'Game', icon: 'fas fa-gamepad', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40' },
                   { id: 'travel', label: 'Travel', icon: 'fas fa-plane', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40' },
                   { id: 'events', label: 'Event', icon: 'fas fa-calendar-alt', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40' },
                   { id: 'groups', label: 'Group', icon: 'fas fa-users', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40' }
                 ].map(action => (
                    <button 
                      key={action.id}
                      onClick={() => setActiveActionTab(action.id as any)}
                      className="flex flex-col items-center gap-2 group"
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 ${action.color}`}>
                          <i className={action.icon}></i>
                       </div>
                       <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{action.label}</span>
                    </button>
                 ))}
                 </div>
              </div>
           ) : (
              <div className="flex flex-col h-72">
                 <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-mode-input-bg/50">
                    <button onClick={() => setActiveActionTab(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white px-2 flex items-center gap-1 text-sm font-bold transition-colors">
                       <i className="fas fa-chevron-left"></i> Back
                    </button>
                    <span className="font-bold text-gray-800 dark:text-white capitalize flex items-center gap-2">
                       Select {activeActionTab}
                    </span>
                    <div className="w-12"></div>
                 </div>
                 
                 <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {activeActionTab === 'games' && mockChallenges.map(c => (
                       <div key={c.id} onClick={() => handleSendAttachment('game', c)} className="flex items-center gap-4 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-purple-100 dark:hover:border-purple-900/30">
                          <img src={c.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-sm font-bold text-gray-800 dark:text-white">{c.name}</p>
                             <p className="text-xs text-gray-500 flex items-center gap-1"><i className="fas fa-trophy text-purple-400 text-[10px]"></i> {c.reward}</p>
                          </div>
                          <i className="fas fa-paper-plane text-purple-400 opacity-0 group-hover:opacity-100"></i>
                       </div>
                    ))}
                    
                    {activeActionTab === 'gif' && (
                        <div className="grid grid-cols-2 gap-2">
                            {mockGifs.map(g => (
                                <div key={g.id} onClick={() => handleSendAttachment('gif', g)} className="cursor-pointer overflow-hidden rounded-lg border border-transparent hover:border-pink-300 transition-all">
                                    <img src={g.url} alt={g.title} className="w-full h-24 object-cover hover:scale-110 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add other tab contents here as previously implemented (music, movie, book, travel, events, groups) - Condensed for brevity but functional */}
                    {activeActionTab === 'music' && mockMusic.map(m => (
                       <div key={m.id} onClick={() => handleSendAttachment('music', m)} className="flex items-center gap-4 p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-red-100">
                          <img src={m.imageUrl} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{m.title}</p></div>
                       </div>
                    ))}
                    {activeActionTab === 'movie' && mockMovies.map(m => (
                       <div key={m.id} onClick={() => handleSendAttachment('movie', m)} className="flex items-center gap-4 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-indigo-100">
                          <img src={m.imageUrl} className="w-12 h-16 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{m.title}</p></div>
                       </div>
                    ))}
                    {activeActionTab === 'book' && mockBooks.map(b => (
                       <div key={b.id} onClick={() => handleSendAttachment('book', b)} className="flex items-center gap-4 p-3 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-yellow-100">
                          <img src={b.imageUrl} className="w-12 h-16 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{b.title}</p></div>
                       </div>
                    ))}
                    {activeActionTab === 'travel' && mockTravelPlans.map(t => (
                       <div key={t.id} onClick={() => handleSendAttachment('travel', t)} className="flex items-center gap-4 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-100">
                          <img src={t.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{t.name}</p></div>
                       </div>
                    ))}
                    {activeActionTab === 'events' && mockEvents.map(e => (
                       <div key={e.id} onClick={() => handleSendAttachment('event', e)} className="flex items-center gap-4 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-orange-100">
                          <img src={e.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{e.name}</p></div>
                       </div>
                    ))}
                    {activeActionTab === 'groups' && mockGroups.map(g => (
                       <div key={g.id} onClick={() => handleSendAttachment('group', g)} className="flex items-center gap-4 p-3 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-green-100">
                          <img src={g.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div className="flex-grow"><p className="text-sm font-bold">{g.name}</p></div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      )}

      {/* 4. Enhanced Action Bar Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-dark-mode-card-bg border-t border-gray-100 dark:border-gray-700 flex items-center gap-3 relative z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
           type="button"
           onClick={() => setShowActions(!showActions)}
           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
             showActions 
             ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rotate-45' 
             : 'bg-gradient-to-br from-brand-mint to-brand-teal text-white hover:shadow-md hover:scale-105'
           }`}
        >
           <i className="fas fa-plus text-xl"></i>
        </button>
        
        <div className="flex-grow relative">
           <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-6 pr-12 py-3.5 rounded-full bg-gray-100 dark:bg-dark-mode-input-bg border-2 border-transparent focus:bg-white dark:focus:bg-dark-mode-input-bg focus:border-brand-teal/30 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 transition-all text-base"
           />
           <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-teal transition-colors">
              <i className="far fa-smile text-xl"></i>
           </button>
        </div>
        
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-blue text-white rounded-full shadow-lg hover:shadow-brand-teal/30 hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
        >
          <i className="fas fa-paper-plane text-lg ml-0.5"></i>
        </button>
      </form>
    </div>
  );
};