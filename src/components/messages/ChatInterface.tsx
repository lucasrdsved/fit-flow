import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMessages, useConversationMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  otherUserId?: string;
  onBack?: () => void;
}

export function ChatInterface({ otherUserId, onBack }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { conversations, getMessages, sendMessage, markAsRead, isSendingMessage } = useMessages();
  const { toast } = useToast();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(otherUserId || null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: messages, isLoading: messagesLoading } = getMessages(selectedConversation || '');
  
  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv => 
    conv.last_message?.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        receiverId: selectedConversation,
        content: messageText.trim(),
      });
      setMessageText('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar mensagem',
        description: 'Tente novamente.',
      });
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark as read
    markAsRead(conversationId).catch(console.error);
  };

  // Chat Header Component
  const ChatHeader = () => {
    if (!selectedConversationData) return null;

    return (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>
              {selectedConversationData.participants[0]?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{selectedConversationData.participants[1] || 'Usuário'}</h3>
            <p className="text-sm text-muted-foreground">Online agora</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Message Component
  const MessageBubble = ({ message }: { message: any }) => {
    const isOwn = message.sender_id === user?.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && (
            <p className="text-xs text-muted-foreground mb-1">
              {message.sender?.name || 'Usuário'}
            </p>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Conversation List Component
  const ConversationList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4" />
            <p>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    {conversation.id.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium truncate">
                      {conversation.id === user?.id ? 'Você' : 'Usuário'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.last_message && new Date(conversation.last_message.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.content || 'Nova conversa'}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))
        )}
      </ScrollArea>
    </div>
  );

  // Chat View Component
  const ChatView = () => {
    if (!selectedConversation) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg font-medium">Selecione uma conversa</p>
            <p>Escolha uma conversa para começar a mensagens</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <ChatHeader />
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messagesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages && messages.length > 0 ? (
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Nenhuma mensagem ainda. Seja o primeiro a dizer olá!</p>
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1"
              disabled={isSendingMessage}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!messageText.trim() || isSendingMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // Main Component
  return (
    <Card className="h-[600px] flex">
      {/* Conversation List - Hidden on mobile when chat is selected */}
      <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r`}>
        <ConversationList />
      </div>
      
      {/* Chat View - Hidden on mobile when no chat is selected */}
      <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1`}>
        <ChatView />
      </div>
    </Card>
  );
}