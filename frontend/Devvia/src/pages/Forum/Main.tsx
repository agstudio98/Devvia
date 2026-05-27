import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  MoreVertical, 
  Plus, 
  Send, 
  Trash2, 
  Edit3, 
  X, 
  MessageCircle,
  Clock,
  User as UserIcon,
  Tag,
  AlertCircle,
  CheckCircle2,
  Filter as FilterIcon,
  Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forumService } from '../../services/appServices';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';

/**
 * INTERFACES DE DATOS
 */
interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    nombre: string;
    avatar?: string;
  };
  authorName?: string;
  tags: string[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  post: string;
  user: {
    _id: string;
    nombre: string;
    avatar?: string;
  };
  authorName: string;
  text: string;
  avatar?: string;
  createdAt: string;
}

interface ForumMainProps {
  searchQuery: string;
}

/**
 * COMPONENTE PRINCIPAL DE LA COMUNIDAD (FORO)
 * 
 * Gestiona el listado de posts, la creación, edición, eliminación y comentarios.
 */
export const ForumMain: React.FC<ForumMainProps> = ({ searchQuery }) => {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const { showAlert, showConfirm } = useDialog();

  // ESTADOS
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', content: '', tags: '' });
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // CARGAR POSTS AL INICIAR
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await forumService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error al cargar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async (postId: string) => {
    try {
      const data = await forumService.getPostDetails(postId);
      setSelectedPost(data.post);
      setComments(data.comments);
    } catch (err) {
      console.error("Error al cargar detalles del post:", err);
    }
  };

  // MANEJO DE POSTS
  const handleCreateOrUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return;

    try {
      const payload = {
        title: postForm.title,
        content: postForm.content,
        tags: postForm.tags.split(',').map(tag => tag.trim()).filter(t => t),
        authorName: user?.nombre
      };

      if (isEditing && selectedPost) {
        await forumService.updatePost(selectedPost._id, payload);
        showAlert(t('FORUM.NOTIFICATIONS.POST_UPDATED') || 'Post actualizado');
      } else {
        await forumService.createPost(payload);
        showAlert(t('FORUM.NOTIFICATIONS.POST_CREATED') || 'Post creado');
      }

      setShowPostModal(false);
      setIsEditing(false);
      setPostForm({ title: '', content: '', tags: '' });
      fetchPosts();
    } catch (err) {
      console.error("Error al guardar post:", err);
      showAlert(t('FORUM.ERRORS.POST_SAVE_FAILED') || 'Error al guardar post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = await showConfirm(t('FORUM.CONFIRMATIONS.DELETE_POST') || '¿Eliminar este post?');
    if (!confirmed) return;

    try {
      await forumService.deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
      if (selectedPost?._id === postId) setSelectedPost(null);
      showAlert(t('FORUM.NOTIFICATIONS.POST_DELETED') || 'Post eliminado');
    } catch (err) {
      console.error("Error al eliminar post:", err);
      showAlert(t('FORUM.ERRORS.POST_DELETE_FAILED') || 'Error al eliminar post');
    }
  };

  // MANEJO DE COMENTARIOS
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    try {
      const payload = {
        postId: selectedPost._id,
        text: newComment,
        authorName: user?.nombre,
        avatar: user?.avatar
      };
      await forumService.addComment(payload);
      setNewComment('');
      fetchPostDetails(selectedPost._id);
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await forumService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!commentText.trim()) return;
    try {
      await forumService.updateComment(commentId, commentText);
      setEditingComment(null);
      if (selectedPost) fetchPostDetails(selectedPost._id);
    } catch (err) {
      console.error("Error al actualizar comentario:", err);
    }
  };

  // FILTRADO
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full mb-4 flex items-center justify-center">
          <MessageCircle className="text-blue-500" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando comunidad...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Botón Nueva Publicación */}
      {isLoggedIn && (
        <button 
          onClick={() => {
            setIsEditing(false);
            setPostForm({ title: '', content: '', tags: '' });
            setShowPostModal(true);
          }}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          {t('FORUM.BUTTONS.NEW_POST') || 'Nueva Publicación'}
        </button>
      )}

      {/* Listado de Posts */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.map(post => (
          <div 
            key={post._id}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all group cursor-pointer"
            onClick={() => fetchPostDetails(post._id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10">
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt={post.author.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author?.nombre || post.authorName}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {isLoggedIn && (user?.id === post.author?._id || user?.id === post.author) && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => {
                      setSelectedPost(post);
                      setPostForm({ title: post.title, content: post.content, tags: post.tags.join(', ') });
                      setIsEditing(true);
                      setShowPostModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-xl font-headings font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
            
            <p className="text-slate-500 dark:text-white/60 text-sm line-clamp-3 mb-6 font-body leading-relaxed">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> {post.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} /> {t('FORUM.STATS.COMMENTS') || 'Comentarios'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Post (Crear/Editar) */}
      {showPostModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1a1c2e] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-headings font-bold text-slate-900 dark:text-white">
                  {isEditing ? t('FORUM.MODALS.EDIT_POST') || 'Editar Post' : t('FORUM.MODALS.NEW_POST') || 'Nueva Publicación'}
                </h2>
                <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdatePost} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('FORUM.LABELS.TITLE') || 'Título'}</label>
                  <input 
                    type="text" 
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    placeholder="Escribe un título llamativo..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-blue-500 transition-all dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('FORUM.LABELS.CONTENT') || 'Contenido'}</label>
                  <textarea 
                    rows={6}
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    placeholder="¿Qué quieres compartir con la comunidad?"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-blue-500 transition-all dark:text-white font-medium resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('FORUM.LABELS.TAGS') || 'Etiquetas'}</label>
                  <input 
                    type="text" 
                    value={postForm.tags}
                    onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                    placeholder="React, TypeScript, UI/UX (separados por coma)"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-blue-500 transition-all dark:text-white"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    {isEditing ? t('FORUM.BUTTONS.UPDATE') || 'Actualizar' : t('FORUM.BUTTONS.PUBLISH') || 'Publicar'}
                  </button>
                  <button type="button" onClick={() => setShowPostModal(false)} className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl font-bold hover:bg-slate-200 transition-all">
                    {t('FORUM.BUTTONS.CANCEL') || 'Cancelar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vista Detalle Post + Comentarios */}
      {selectedPost && !showPostModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1a1c2e] border border-slate-200 dark:border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            {/* Cabecera Detalle */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-start bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  {selectedPost.author?.avatar ? (
                    <img src={selectedPost.author.avatar} className="w-full h-full object-cover rounded-2xl" />
                  ) : <UserIcon className="text-blue-500" />}
                </div>
                <div>
                  <h2 className="text-2xl font-headings font-bold text-slate-900 dark:text-white">{selectedPost.title}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {t('FORUM.UI.BY') || 'Por'} <span className="text-blue-500">{selectedPost.author?.nombre || selectedPost.authorName}</span> • {new Date(selectedPost.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-all text-slate-400 hover:rotate-90">
                <X size={28} />
              </button>
            </div>

            {/* Contenido y Comentarios */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-white/70 leading-relaxed font-body">
                  {selectedPost.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Tag size={10} className="inline mr-1" /> {tag}
                  </span>
                ))}
              </div>

              {/* Sección Comentarios */}
              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-headings font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="text-blue-500" /> {t('FORUM.UI.COMMENTS_SECTION') || 'Sección de Comentarios'} ({comments.length})
                </h3>

                {isLoggedIn ? (
                  <form onSubmit={handleAddComment} className="mb-10 relative group">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t('FORUM.PLACEHOLDERS.WRITE_COMMENT') || 'Escribe un comentario...'}
                      className="w-full p-6 pr-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl outline-none focus:border-blue-500 transition-all dark:text-white font-medium resize-none shadow-inner"
                      rows={2}
                    />
                    <button type="submit" className="absolute right-4 bottom-4 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-90">
                      <Send size={20} />
                    </button>
                  </form>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl text-center mb-10">
                    <p className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                      <AlertCircle className="inline mr-2" size={16} /> {t('FORUM.UI.MUST_LOGIN_COMMENT') || 'Debes iniciar sesión para comentar'}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment._id} className="flex gap-4 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/5">
                        {comment.avatar ? (
                          <img src={comment.avatar} className="w-full h-full object-cover" />
                        ) : <UserIcon size={18} className="text-slate-400" />}
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-white/[0.03] p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {editingComment === comment._id ? (
                          <div className="space-y-3">
                            <textarea 
                              className="w-full p-3 bg-white dark:bg-slate-900 border rounded-xl outline-none focus:border-blue-500 dark:text-white text-sm"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateComment(comment._id)} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Guardar</button>
                              <button onClick={() => setEditingComment(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-600 dark:text-white/60 text-sm font-body leading-relaxed">{comment.text}</p>
                        )}

                        {isLoggedIn && (user?.id === comment.user?._id || user?.id === comment.user) && !editingComment && (
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingComment(comment._id);
                                setCommentText(comment.text);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-white/10"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment._id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-white/10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-10">
                      <MessageSquare className="mx-auto text-slate-300 dark:text-white/10 mb-2" size={40} />
                      <p className="text-slate-400 text-sm font-medium">{t('FORUM.UI.NO_COMMENTS') || 'No hay comentarios aún'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
