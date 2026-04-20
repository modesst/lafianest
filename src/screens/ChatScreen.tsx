// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { ChevronLeft, Send, Phone, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { TEXT } from '../constants/typography';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';

export const ChatScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { listingId, receiverId, receiverName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    
    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (
            (payload.new.sender_id === user?.id && payload.new.receiver_id === receiverId) ||
            (payload.new.sender_id === receiverId && payload.new.receiver_id === user?.id)
          ) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      listing_id: listingId,
      sender_id: user?.id,
      receiver_id: receiverId,
      content: inputText.trim(),
    };

    const { error } = await supabase.from('messages').insert([newMessage]);
    if (!error) {
      setInputText('');
    }
  };

  const renderMessage = ({ item }: any) => {
    const isMine = item.sender_id === user?.id;
    return (
      <View style={[styles.messageWrapper, isMine ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMine && styles.myText]}>{item.content}</Text>
        </View>
        <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.navy} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={TEXT.h3}>{receiverName || 'Landlord'}</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <Pressable style={styles.callBtn}>
          <Phone size={20} color={COLORS.navy} />
        </Pressable>
      </View>

      {/* SAFETY NOTICE */}
      <View style={styles.safetyNotice}>
        <ShieldCheck size={16} color={COLORS.teal} />
        <Text style={styles.safetyText}>
          Keep chats here for your safety. Phone numbers are hidden until mutual consent.
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendBtn}>
            <Send size={20} color={COLORS.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.inkLight,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  safetyText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.teal,
    marginLeft: 8,
    fontFamily: 'DMSans_500Medium',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: COLORS.navy,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    ...SHADOW.subtle,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
    color: COLORS.ink,
  },
  myText: {
    color: COLORS.white,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.inkLight,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.ink,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
