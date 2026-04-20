// src/screens/AuthScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TextInput, 
  Pressable, 
  Animated, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Home, ChevronRight, Check, Mail, Smartphone } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITIES, UNIVERSITY_LIST, UniversityKey } from '../constants/universities';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type AuthStep = 'method' | 'phone' | 'otp' | 'email' | 'university' | 'role';

export const AuthScreen: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('method');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityKey | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | 'agent' | null>(null);
  const [useEmailOtp, setUseEmailOtp] = useState(false);
  
  const { 
    signInWithPhone, 
    verifyOTP, 
    signInWithEmail, 
    signInWithEmailOtp,
    signUpWithEmail, 
    updateProfile, 
    isLoading 
  } = useAuthStore();
  
  const cardAnim = useRef(new Animated.Value(SCREEN_HEIGHT * 0.4)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) return;
    try {
      await signInWithPhone(`+234${phone}`);
      setStep('otp');
    } catch (error: any) {
      alert(error.message || 'Phone sign in failed');
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) return;
    console.log('Auth: Submitting email:', email, 'isSignUp:', isSignUp);
    try {
      if (useEmailOtp) {
        await signInWithEmailOtp(email);
        alert('Check your email for the magic link!');
        return;
      }

      if (!password) return;

      if (isSignUp) {
        await signUpWithEmail(email, password, {});
        setStep('university');
      } else {
        await signInWithEmail(email, password);
        const session = useAuthStore.getState().session;
        if (session?.user) {
          console.log('Auth: Login success, checking profile');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.log('Auth: Profile fetch error (expected if new user):', profileError.message);
          }

          if (profile?.university && profile?.role) {
            console.log('Auth: Profile complete, navigating...');
          } else {
            console.log('Auth: Profile incomplete, going to university step');
            setStep('university');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth: Email authentication error details:', error);
      alert(error.message || 'Authentication failed');
    }
  };

  const handleOtpInput = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleOtpVerify = async () => {
    if (otp.join('').length < 6) return;
    try {
      await verifyOTP(`+234${phone}`, otp.join(''));
      
      const session = useAuthStore.getState().session;
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.university && profile?.role) {
          // Profile complete
        } else {
          setStep('university');
        }
      }
    } catch (error: any) {
      alert(error.message || 'OTP verification failed');
    }
  };

  const handleUniversitySelect = (key: UniversityKey) => {
    setSelectedUniversity(key);
  };

  const handleRoleSelect = (role: 'student' | 'landlord' | 'agent') => {
    setSelectedRole(role);
  };

  const handleFinalSubmit = async () => {
    if (!selectedUniversity || !selectedRole) return;
    try {
      await updateProfile({
        university: selectedUniversity,
        role: selectedRole,
      });
    } catch (error: any) {
      alert(error.message || 'Profile update failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>Welcome to LafiaNest</Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>Choose your preferred sign in method</Text>
            
            <View style={styles.socialButtons}>
              <Pressable style={styles.socialButton} onPress={() => alert('Google Sign In coming soon')}>
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>
              <Pressable style={styles.socialButton} onPress={() => alert('Apple Sign In coming soon')}>
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.methodButton} onPress={() => setStep('phone')}>
              <Smartphone size={20} color={COLORS.white} />
              <Text style={styles.methodButtonText}>Continue with Phone</Text>
            </Pressable>
            
            <View style={styles.fallbackContainer}>
              <Mail size={16} color={COLORS.inkLight} style={{ marginRight: 6 }} />
              <Text style={styles.fallbackText}>Having trouble? </Text>
              <Pressable onPress={() => setStep('email')}>
                <Text style={styles.fallbackLink}>Use Email as fallback</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'phone':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>Enter Phone</Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>We'll send a code to verify your number</Text>
            
            <View style={styles.inputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryText}>🇳🇬 +234</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="803 000 0000"
                placeholderTextColor={COLORS.inkFaint}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={11}
              />
            </View>
            
            <Pressable 
              style={[styles.ctaButton, phone.length < 10 && styles.disabledButton]} 
              onPress={handlePhoneSubmit}
              disabled={isLoading || phone.length < 10}
            >
              <Text style={styles.ctaText}>{isLoading ? 'Sending...' : 'Send Code'}</Text>
            </Pressable>
            
            <Pressable style={styles.backLink} onPress={() => setStep('method')}>
              <Text style={styles.backLinkText}>Change method</Text>
            </Pressable>
          </View>
        );
      case 'email':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>
              {useEmailOtp ? 'Magic Link' : isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>
              {useEmailOtp 
                ? "We'll send a login link to your inbox" 
                : `Sign ${isSignUp ? 'up' : 'in'} with your email and password`}
            </Text>
            
            <View style={styles.emailForm}>
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.inkFaint}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {!useEmailOtp && (
                <TextInput
                  style={[styles.textInput, { marginTop: 12 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.inkFaint}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              )}
            </View>
            
            <Pressable 
              style={[styles.ctaButton, (!email || (!useEmailOtp && !password)) && styles.disabledButton]} 
              onPress={handleEmailSubmit}
              disabled={isLoading || !email || (!useEmailOtp && !password)}
            >
              <Text style={styles.ctaText}>
                {isLoading ? 'Processing...' : useEmailOtp ? 'Send Magic Link' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>

            {!isSignUp && (
              <Pressable style={styles.toggleLink} onPress={() => setUseEmailOtp(!useEmailOtp)}>
                <Text style={styles.toggleLinkText}>
                  {useEmailOtp ? 'Use Password instead' : 'Email me a Magic Link instead'}
                </Text>
              </Pressable>
            )}

            <Pressable style={styles.toggleLink} onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleLinkText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </Pressable>
            
            <Pressable style={styles.backLink} onPress={() => setStep('method')}>
              <Text style={styles.backLinkText}>Change method</Text>
            </Pressable>
          </View>
        );
      case 'otp':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>Verify Phone</Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>Enter the 6-digit code sent to +234{phone}</Text>
            
            <View style={styles.otpWrapper}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  style={styles.otpBox}
                  value={digit}
                  onChangeText={(text) => handleOtpInput(text, i)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
            
            <Pressable 
              style={[styles.ctaButton, otp.join('').length < 6 && styles.disabledButton]} 
              onPress={handleOtpVerify}
              disabled={isLoading || otp.join('').length < 6}
            >
              <Text style={styles.ctaText}>{isLoading ? 'Verifying...' : 'Verify & Continue'}</Text>
            </Pressable>

            <View style={styles.otpFallback}>
              <Text style={styles.otpFallbackText}>Didn't get the code?</Text>
              <Pressable onPress={() => setStep('email')}>
                <Text style={styles.otpFallbackLink}>Try Email instead</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'university':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>Your Campus</Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>Which university are you from?</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
              {UNIVERSITY_LIST.map((uni) => (
                <Pressable
                  key={uni.id}
                  style={[
                    styles.uniCard,
                    selectedUniversity === uni.id && styles.activeCard
                  ]}
                  onPress={() => handleUniversitySelect(uni.id)}
                >
                  <Text style={[
                    styles.uniText,
                    selectedUniversity === uni.id && styles.activeCardText
                  ]}>
                    {uni.shortName}
                  </Text>
                  {selectedUniversity === uni.id && <Check size={16} color={COLORS.white} />}
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable 
              style={[styles.ctaButton, !selectedUniversity && styles.disabledButton]} 
              onPress={() => setStep('role')}
              disabled={!selectedUniversity}
            >
              <Text style={styles.ctaText}>Continue</Text>
            </Pressable>
          </View>
        );
      case 'role':
        return (
          <View style={styles.stepContainer}>
            <Text style={[TEXT.h2, styles.stepTitle]}>I am a...</Text>
            <Text style={[TEXT.body, styles.stepSubtitle]}>Select your role in LafiaNest</Text>
            
            <View style={styles.roleGrid}>
              {(['student', 'landlord', 'agent'] as const).map((role) => (
                <Pressable
                  key={role}
                  style={[
                    styles.roleCard,
                    selectedRole === role && styles.activeCard
                  ]}
                  onPress={() => handleRoleSelect(role)}
                >
                  <Text style={[
                    styles.roleEmoji,
                    selectedRole === role && styles.activeCardText
                  ]}>
                    {role === 'student' ? '🎓' : role === 'landlord' ? '🏠' : '🤝'}
                  </Text>
                  <Text style={[
                    styles.roleText,
                    selectedRole === role && styles.activeCardText
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <Pressable 
              style={[styles.ctaButton, !selectedRole && styles.disabledButton]} 
              onPress={handleFinalSubmit}
              disabled={isLoading || !selectedRole}
            >
              <Text style={styles.ctaText}>{isLoading ? 'Setting up...' : 'Get Started'}</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80' }}
        style={styles.heroArea}
      >
        <View style={styles.overlay} />
        <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
          <View style={styles.logomark}>
            <Home size={32} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>LafiaNest</Text>
          <Text style={styles.appTagline}>Safe Homes. Every Campus. Nasarawa.</Text>
        </Animated.View>
      </ImageBackground>

      <Animated.View style={[styles.bottomCard, { transform: [{ translateY: cardAnim }] }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {renderStep()}
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  heroArea: {
    height: SCREEN_HEIGHT * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 37, 87, 0.65)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logomark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.navyLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOW.float,
  },
  appName: {
    fontFamily: FONTS.displayBold,
    fontSize: 36,
    color: COLORS.white,
    marginBottom: 8,
  },
  appTagline: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: SPACING.lg,
    ...SHADOW.float,
  },
  stepContainer: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  stepTitle: {
    color: COLORS.navy,
    marginBottom: 8,
  },
  stepSubtitle: {
    color: COLORS.inkLight,
    marginBottom: 32,
  },
  methodButton: {
    height: 56,
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  methodButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.navy,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.inkFaint,
  },
  fallbackContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  fallbackText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkLight,
  },
  fallbackLink: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.terracotta,
    textDecorationLine: 'underline',
  },
  secondaryMethod: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  secondaryMethodText: {
    color: COLORS.navy,
  },
  inputWrapper: {
    flexDirection: 'row',
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 32,
  },
  countryCode: {
    paddingHorizontal: 16,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  countryText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.ink,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: FONTS.bodySemi,
    fontSize: 16,
    color: COLORS.navy,
  },
  emailForm: {
    marginBottom: 32,
  },
  textInput: {
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.navy,
  },
  toggleLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleLinkText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.terracotta,
  },
  backLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLinkText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkLight,
    textDecorationLine: 'underline',
  },
  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: (Dimensions.get('window').width - SPACING.lg * 2 - 40) / 6,
    height: 54,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FONTS.bodyBold,
    color: COLORS.navy,
  },
  otpFallback: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  otpFallbackText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkLight,
  },
  otpFallbackLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.terracotta,
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: 32,
    maxHeight: 50,
  },
  uniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.pill,
    marginRight: 10,
    gap: 8,
  },
  uniText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkMid,
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  roleCard: {
    flex: 1,
    height: 100,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  activeCard: {
    backgroundColor: COLORS.navy,
    ...SHADOW.subtle,
  },
  roleEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.inkMid,
  },
  activeCardText: {
    color: COLORS.white,
  },
  ctaButton: {
    height: 54,
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledButton: {
    opacity: 0.5,
  },
  ctaText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },
});
