import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import Icon from './ui/icon';
import { generateFingerprint } from '@/utils/fingerprint';

const ENGAGEMENT_API = 'https://functions.poehali.dev/b0c2e78c-b573-4db0-92cb-651315fd35c8';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

interface ArticleCommentsProps {
  articleId: number;
  isAdmin: boolean;
}

export const ArticleComments = ({ articleId, isAdmin }: ArticleCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState({ total: 0, userLiked: false });
  const [newComment, setNewComment] = useState({ name: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitorFingerprint] = useState(() => generateFingerprint());

  useEffect(() => {
    loadComments();
    loadLikes();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const response = await fetch(
        `${ENGAGEMENT_API}?action=comments&article_id=${articleId}`
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const loadLikes = async () => {
    try {
      const response = await fetch(
        `${ENGAGEMENT_API}?action=likes&article_id=${articleId}&visitor_fingerprint=${visitorFingerprint}`
      );
      const data = await response.json();
      setLikes({ total: data.total_likes || 0, userLiked: data.user_liked || false });
    } catch (error) {
      console.error('Failed to load likes:', error);
    }
  };

  const handleLike = async () => {
    try {
      const action = likes.userLiked ? 'unlike' : 'like';
      const method = likes.userLiked ? 'DELETE' : 'POST';
      
      await fetch(`${ENGAGEMENT_API}?action=${action}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          visitor_fingerprint: visitorFingerprint
        })
      });

      loadLikes();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch(`${ENGAGEMENT_API}?action=comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          author_name: newComment.name.trim() || 'Аноним',
          content: newComment.content,
          visitor_fingerprint: visitorFingerprint
        })
      });

      setNewComment({ name: '', content: '' });
      loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Удалить комментарий?')) return;

    try {
      await fetch(`${ENGAGEMENT_API}?action=comment`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId })
      });

      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Лайки */}
      <div className="flex items-center gap-4">
        <Button
          variant={likes.userLiked ? 'default' : 'outline'}
          size="lg"
          onClick={handleLike}
          className="gap-2"
        >
          <Icon name={likes.userLiked ? 'Heart' : 'Heart'} size={20} />
          <span>{likes.total}</span>
        </Button>
        <span className="text-muted-foreground">
          {likes.total === 0 && 'Будьте первым, кто поставит лайк!'}
          {likes.total === 1 && '1 человек оценил статью'}
          {likes.total > 1 && likes.total < 5 && `${likes.total} человека оценили статью`}
          {likes.total >= 5 && `${likes.total} человек оценили статью`}
        </span>
      </div>

      {/* Комментарии */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" size={24} />
            Комментарии ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Форма добавления комментария */}
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Input
              placeholder="Ваше имя (необязательно)"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              maxLength={100}
            />
            <Textarea
              placeholder="Напишите комментарий..."
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              required
            />
            <Button type="submit" disabled={isSubmitting || !newComment.content.trim()}>
              {isSubmitting ? 'Отправка...' : 'Отправить комментарий'}
            </Button>
          </form>

          {/* Список комментариев */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Комментариев пока нет. Будьте первым!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{comment.author_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleComments;
