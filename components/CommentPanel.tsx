
import React, { useState } from 'react';
import { X, MessageSquare, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  annotationId: string;
  text: string;
  timestamp: Date;
}

interface CommentPanelProps {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  selectedAnnotationId: string | null;
  onClose: () => void;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
  comments,
  setComments,
  selectedAnnotationId,
  onClose,
}) => {
  const [newComment, setNewComment] = useState('');
  
  const selectedComments = comments.filter(
    comment => comment.annotationId === selectedAnnotationId
  );

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedAnnotationId) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      annotationId: selectedAnnotationId,
      text: newComment,
      timestamp: new Date(),
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="w-80 h-full flex flex-col glassmorphism rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-base font-medium flex items-center">
          <MessageSquare size={16} className="mr-2 text-primary" />
          Comments
        </h3>
        <button 
          className="text-muted-foreground hover:text-foreground button-transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      
      <ScrollArea className="flex-grow p-3">
        {selectedComments.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {selectedComments.map((comment) => (
              <div 
                key={comment.id}
                className="bg-white/50 p-3 rounded-lg shadow-subtle border border-border/50"
              >
                <div className="text-sm text-foreground/80">{comment.text}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {/* {formatDistanceToNow(comment.timestamp, { addSuffix: true })} */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 p-4 text-center text-muted-foreground">
            <MessageSquare size={24} className="mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex items-end space-x-2">
          {/* <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="resize-none min-h-24"
          /> */}
          <Button 
            className="bg-primary hover:bg-primary/90 text-white p-2 h-10"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <SendHorizonal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
