// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  TextInput,
  Switch
} from 'react-native';
import { 
  User, 
  Settings, 
  Heart, 
  Calendar, 
  Users, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Bell,
  Wallet,
  Home
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { useAuthStore } from '../store/authStore';
import { UniversityTag } from '../components/UniversityTag';
import { LandlordTrustScore } from '../components/LandlordTrustScore';

export const ProfileScreen: React.FC = () => {
  const { user, signOut, updateProfile } = useAuthStore();
  const [budget, setBudget] = useState(user?.monthly_budget?.toString() || '');
  const [notifyEmergency, setNotifyEmergency] = useState(user?.notify_emergency_on_viewing || false);
  const [emergencyName, setEmergencyName] = useState(user?.emergency_contact_name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergency_contact_phone || '');

  if (!user) return null;

  const isLandlord = user.role === 'landlord' || user.role === 'agent';

  const handleSignOut = () => signOut();

  const renderStudentProfile = () => (
    <View style={styles.profileContent}>
      {/* Budget Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wallet size={20} color={COLORS.navy} />
          <Text style={styles.sectionTitle}>Housing Budget</Text>
        </View>
        <View style={styles.budgetInputWrapper}>
          <Text style={styles.naira}>₦</Text>
          <TextInput
            style={styles.budgetInput}
            value={budget}
            onChangeText={setBudget}
            placeholder="Set monthly budget"
            keyboardType="numeric"
            onBlur={() => updateProfile({ monthly_budget: parseInt(budget) })}
          />
          <Text style={styles.budgetHelper}>Powers your affordability meter</Text>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ShieldCheck size={20} color={COLORS.navy} />
          <Text style={styles.sectionTitle}>Safety & Emergency</Text>
        </View>
        <View style={styles.emergencyCard}>
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Name"
            value={emergencyName}
            onChangeText={setEmergencyName}
            onBlur={() => updateProfile({ emergency_contact_name: emergencyName })}
          />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Phone"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            onBlur={() => updateProfile({ emergency_contact_phone: emergencyPhone })}
            keyboardType="phone-pad"
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Notify when I schedule a viewing</Text>
            <Switch 
              value={notifyEmergency}
              onValueChange={(val) => {
                setNotifyEmergency(val);
                updateProfile({ notify_emergency_on_viewing: val });
              }}
              trackColor={{ false: COLORS.bgDeep, true: COLORS.teal }}
            />
          </View>
        </View>
      </View>

      {/* Menu Links */}
      <View style={styles.menu}>
        <Pressable style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Heart size={20} color={COLORS.inkMid} />
            <Text style={styles.menuItemText}>Saved Listings</Text>
          </View>
          <View style={styles.menuItemRight}>
            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
            <ChevronRight size={18} color={COLORS.inkFaint} />
          </View>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Calendar size={20} color={COLORS.inkMid} />
            <Text style={styles.menuItemText}>My Viewing Schedule</Text>
          </View>
          <ChevronRight size={18} color={COLORS.inkFaint} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Users size={20} color={COLORS.inkMid} />
            <Text style={styles.menuItemText}>My Roommate Post</Text>
          </View>
          <ChevronRight size={18} color={COLORS.inkFaint} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Bell size={20} color={COLORS.inkMid} />
            <Text style={styles.menuItemText}>Notification Settings</Text>
          </View>
          <ChevronRight size={18} color={COLORS.inkFaint} />
        </Pressable>
      </View>
    </View>
  );

  const renderLandlordProfile = () => (
    <View style={styles.profileContent}>
      <View style={styles.section}>
        <View style={styles.menu}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Home size={20} color={COLORS.inkMid} />
              <Text style={styles.menuItemText}>Manage My Listings</Text>
            </View>
            <View style={styles.menuItemRight}>
              <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
              <ChevronRight size={18} color={COLORS.inkFaint} />
            </View>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Calendar size={20} color={COLORS.inkMid} />
              <Text style={styles.menuItemText}>Viewing Requests</Text>
            </View>
            <ChevronRight size={18} color={COLORS.inkFaint} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Pressable style={styles.settingsButton}>
              <Settings size={22} color={COLORS.navy} />
            </Pressable>
          </View>

          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <User size={40} color={COLORS.navy} />
              </View>
              {isLandlord && (
                <View style={styles.trustRing}>
                  <LandlordTrustScore score={88} size={56} showLabel={false} />
                </View>
              )}
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.full_name || 'Set your name'}</Text>
              <View style={styles.tagRow}>
                {user.university && <UniversityTag universityKey={user.university} />}
                <View style={[styles.roleBadge, isLandlord && styles.landlordBadge]}>
                  <Text style={[styles.roleText, isLandlord && styles.landlordRoleText]}>
                    {user.role.toUpperCase()}
                  </Text>
                </View>
              </View>
              {isLandlord && user.agent_license && (
                <View style={styles.licenseRow}>
                  <ShieldCheck size={14} color={COLORS.teal} />
                  <Text style={styles.licenseText}>{user.agent_license} ✓</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {isLandlord ? renderLandlordProfile() : renderStudentProfile()}

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.versionText}>LafiaNest v3.0.0 (Production)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.page,
    paddingTop: 8,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...SHADOW.subtle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    color: COLORS.navy,
  },
  settingsButton: {
    padding: 4,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  trustRing: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 2,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    color: COLORS.ink,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: COLORS.bgDeep,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  landlordBadge: {
    backgroundColor: COLORS.navy,
  },
  roleText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.inkLight,
  },
  landlordRoleText: {
    color: COLORS.white,
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  licenseText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 12,
    color: COLORS.teal,
  },
  profileContent: {
    padding: SPACING.page,
    paddingTop: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.navy,
  },
  budgetInputWrapper: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    ...SHADOW.subtle,
  },
  naira: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: COLORS.navy,
    position: 'absolute',
    top: 16,
    left: 16,
  },
  budgetInput: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: COLORS.navy,
    paddingLeft: 24,
    marginBottom: 4,
  },
  budgetHelper: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkLight,
  },
  emergencyCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    ...SHADOW.subtle,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: FONTS.body,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  switchLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkMid,
  },
  menu: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.ink,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.terracotta,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 32,
  },
  signOutText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkFaint,
    marginBottom: 40,
  },
});
