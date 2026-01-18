import { motion } from 'framer-motion';
import { MessageCircle, Users, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/hooks/useMessages';
import { ChatInterface } from '@/components/messages/ChatInterface';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TrainerMessages() {
  const { conversations, conversationsLoading } = useMessages();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const unreadCount = conversations.reduce((total, conv) => total + conv.unread_count, 0);

  const handleChatSelect = (conversationId: string) => {
    setSelectedChat(conversationId);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (conversationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 pt-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Mensagens</h1>
              <p className="text-muted-foreground">Comunicação com seus alunos</p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {unreadCount} novas
              </Badge>
            )}
          </div>
        </motion.div>
      </div>

      <div className="-mt-2 px-5">
        {!selectedChat ? (
          <>
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 grid grid-cols-3 gap-3"
            >
              {[
                { 
                  icon: Users, 
                  label: 'Conversas', 
                  value: conversations.length.toString(), 
                  color: 'text-primary' 
                },
                { 
                  icon: MessageCircle, 
                  label: 'Novas', 
                  value: unreadCount.toString(), 
                  color: 'text-warning' 
                },
                { 
                  icon: TrendingUp, 
                  label: 'Ativas', 
                  value: conversations.filter(c => c.unread_count > 0).length.toString(), 
                  color: 'text-success' 
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card variant="stat">
                    <CardContent className="p-3 text-center">
                      <div className={`mb-2 flex justify-center ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Conversations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Conversas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Nenhuma conversa ainda</p>
                      <p className="text-sm">Seus alunos podrán enviar mensagens após completar treinos.</p>
                      <Button asChild className="mt-4">
                        <Link to="/trainer/students">
                          Ver Alunos
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.map((conversation, index) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                          onClick={() => handleChatSelect(conversation.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                              {conversation.unread_count > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {conversation.unread_count}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                Aluno #{conversation.id.slice(-8)}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.last_message?.content || 'Nova conversa'}
                              </p>
                              {conversation.last_message && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(conversation.last_message.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {conversation.unread_count > 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            ) : (
                              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChatInterface 
              otherUserId={selectedChat}
              onBack={handleBackToList}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}