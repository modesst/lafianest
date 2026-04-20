// src/components/ViewingScheduler.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Calendar, Clock, Users, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, SHADOW } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface ViewingSchedulerProps {
  onConfirm: (data: { date: Date; friendName?: string; friendPhone?: string }) => void;
  onCancel: () => void;
}

export const ViewingScheduler: React.FC<ViewingSchedulerProps> = ({ onConfirm, onCancel }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');

  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={[TEXT.h2, styles.title]}>Pick a Viewing Time</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Available Dates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
            {next14Days.map((date) => (
              <Pressable
                key={date.toISOString()}
                onPress={() => setSelectedDate(date)}
                style={[
                  styles.dateCard,
                  selectedDate?.toDateString() === date.toDateString() && styles.activeDateCard
                ]}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate?.toDateString() === date.toDateString() && styles.activeDateText
                ]}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text style={[
                  styles.dateNum,
                  selectedDate?.toDateString() === date.toDateString() && styles.activeDateText
                ]}>
                  {date.getDate()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>Time Slots</Text>
          <View style={styles.slotsGrid}>
            {timeSlots.map((slot) => (
              <Pressable key={slot} style={styles.slotCard}>
                <Clock size={14} color={COLORS.inkMid} />
                <Text style={styles.slotText}>{slot}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.friendSection}>
            <View style={styles.row}>
              <Users size={18} color={COLORS.navy} />
              <Text style={styles.friendTitle}>Add a friend to notify (Optional)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Friend's Name"
              value={friendName}
              onChangeText={setFriendName}
            />
            <TextInput
              style={styles.input}
              placeholder="Friend's Phone"
              value={friendPhone}
              onChangeText={setFriendPhone}
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.ghostButton} onPress={onCancel}>
            <Text style={styles.ghostButtonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={[styles.primaryButton, !selectedDate && styles.disabledButton]} 
            onPress={() => selectedDate && setStep(2)}
            disabled={!selectedDate}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
            <ChevronRight size={18} color={COLORS.white} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[TEXT.h2, styles.title]}>Safety Brief</Text>
      
      <View style={styles.safetyCard}>
        <View style={styles.row}>
          <AlertTriangle size={24} color={COLORS.warning} />
          <Text style={styles.safetyHeading}>Before you go:</Text>
        </View>
        
        <View style={styles.safetyList}>
          <Text style={styles.safetyItem}>• Tell someone where you're going</Text>
          <Text style={styles.safetyItem}>• Bring a friend if possible</Text>
          <Text style={styles.safetyItem}>• Go during daylight hours</Text>
          <Text style={styles.safetyItem}>• Do NOT pay any money at the viewing</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.ghostButton} onPress={() => setStep(1)}>
          <Text style={styles.ghostButtonText}>Back</Text>
        </Pressable>
        <Pressable 
          style={styles.confirmButton} 
          onPress={() => selectedDate && onConfirm({ date: selectedDate, friendName, friendPhone })}
        >
          <Text style={styles.primaryButtonText}>I understand — Confirm Viewing</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    height: '100%',
  },
  title: {
    marginBottom: SPACING.xl,
    color: COLORS.navy,
  },
  sectionLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  dateList: {
    marginBottom: SPACING.xl,
  },
  dateCard: {
    width: 60,
    height: 70,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeDateCard: {
    backgroundColor: COLORS.navy,
    ...SHADOW.subtle,
  },
  dateDay: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkMid,
  },
  dateNum: {
    fontFamily: FONTS.bodyBold,
    fontSize: 18,
    color: COLORS.navy,
  },
  activeDateText: {
    color: COLORS.white,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slotText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.ink,
  },
  friendSection: {
    backgroundColor: COLORS.bg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  friendTitle: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.navy,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 44,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ghostButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostButtonText: {
    fontFamily: FONTS.bodySemi,
    color: COLORS.inkLight,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
  },
  safetyCard: {
    backgroundColor: COLORS.terracottaLight,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xxl,
  },
  safetyHeading: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    color: COLORS.warning,
  },
  safetyList: {
    marginTop: SPACING.md,
    gap: 8,
  },
  safetyItem: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.inkMid,
  },
  confirmButton: {
    flex: 3,
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
