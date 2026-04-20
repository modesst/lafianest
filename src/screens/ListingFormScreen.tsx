// src/screens/ListingFormScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Dimensions, 
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Video, 
  MapPin, 
  ShieldCheck,
  Check,
  Home,
  Briefcase,
  Users,
  Building
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITY_LIST, UniversityKey } from '../constants/universities';
import { useListingsStore } from '../store/listingsStore';
import { AnimatedWrapper } from '../components/AnimatedWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FormStep = 1 | 2 | 3 | 4 | 5;

const CHECKLIST_ITEMS = [
  { key: 'roof', label: 'Roof condition' },
  { key: 'water', label: 'Water supply' },
  { key: 'electricity', label: 'Electricity stable' },
  { key: 'toilet', label: 'Toilet functional' },
  { key: 'paint', label: 'Property painted' },
  { key: 'gate', label: 'Gate functional' },
  { key: 'generator', label: 'Generator available' },
  { key: 'borehole', label: 'Borehole/tank' },
];

export const ListingFormScreen: React.FC<any> = ({ navigation }) => {
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchListings } = useListingsStore();

  const [formData, setFormData] = useState({
    title: '',
    university_tags: [] as UniversityKey[],
    property_type: 'self_contain',
    address: '',
    description: '',
    rent: '',
    payment_frequency: 'yearly',
    lease_type: 'standard',
    caution_fee: '',
    no_increment_pledge: false,
    amenities: [] as string[],
    move_in_checklist: {} as Record<string, boolean>,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleUniversity = (key: UniversityKey) => {
    const tags = [...formData.university_tags];
    if (tags.includes(key)) {
      updateField('university_tags', tags.filter(t => t !== key));
    } else {
      updateField('university_tags', [...tags, key]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    const amenities = [...formData.amenities];
    if (amenities.includes(amenity)) {
      updateField('amenities', amenities.filter(a => a !== amenity));
    } else {
      updateField('amenities', [...amenities, amenity]);
    }
  };

  const toggleChecklistItem = (key: string) => {
    const checklist = { ...formData.move_in_checklist };
    checklist[key] = !checklist[key];
    updateField('move_in_checklist', checklist);
  };

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as FormStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as FormStep);
    else navigation.goBack();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate Move-In Ready status
      const allChecked = CHECKLIST_ITEMS.every(item => formData.move_in_checklist[item.key]);
      
      // In a real app, we would call useListingsStore.createListing()
      // For this demo, we simulate success
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          'Listing Published!', 
          allChecked ? 'Your home is marked as Move-In Ready ✓' : 'Listing is live.'
        );
        fetchListings();
        navigation.goBack();
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Could not submit listing.');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      <View style={styles.stepsRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <View key={s} style={[
            styles.stepDot,
            step === s && styles.activeStepDot,
            step > s && styles.completedStepDot
          ]}>
            {step > s ? <Check size={12} color={COLORS.white} /> : (
              <Text style={[styles.stepDotText, step === s && styles.activeStepDotText]}>{s}</Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={COLORS.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>Add New Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
        <AnimatedWrapper key={step}>
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Basic Info</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Spacious Self-contain near FULAFIA"
                value={formData.title}
                onChangeText={(t) => updateField('title', t)}
              />

              <Text style={styles.fieldLabel}>Which students is this close to?</Text>
              <View style={styles.uniGrid}>
                {UNIVERSITY_LIST.map(uni => (
                  <Pressable 
                    key={uni.id}
                    style={[
                      styles.uniChip,
                      formData.university_tags.includes(uni.id) && styles.activeUniChip
                    ]}
                    onPress={() => toggleUniversity(uni.id)}
                  >
                    <Text style={[
                      styles.uniChipText,
                      formData.university_tags.includes(uni.id) && styles.activeUniChipText
                    ]}>
                      {uni.shortName}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Property Type</Text>
              <View style={styles.typeGrid}>
                {[
                  { id: 'self_contain', label: 'Self-contain', icon: <Home size={20} /> },
                  { id: 'room', label: 'Room', icon: <Building size={20} /> },
                  { id: 'flat', label: 'Flat', icon: <Building size={20} /> },
                  { id: 'duplex', label: 'Duplex', icon: <Briefcase size={20} /> },
                ].map(type => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.typeCard,
                      formData.property_type === type.id && styles.activeTypeCard
                    ]}
                    onPress={() => updateField('property_type', type.id)}
                  >
                    {React.cloneElement(type.icon as React.ReactElement<any>, { 
                      color: formData.property_type === type.id ? COLORS.white : COLORS.navy 
                    })}
                    <Text style={[
                      styles.typeLabel,
                      formData.property_type === type.id && styles.activeTypeText
                    ]}>{type.label}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Address</Text>
              <View style={styles.addressWrapper}>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Full address"
                  value={formData.address}
                  onChangeText={(t) => updateField('address', t)}
                  multiline
                />
                <Pressable style={styles.gpsButton}>
                  <MapPin size={18} color={COLORS.teal} />
                  <Text style={styles.gpsButtonText}>Use My GPS</Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Photos & Videos</Text>
              <View style={styles.uploadGrid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Pressable key={i} style={styles.uploadBox}>
                    <Camera size={24} color={COLORS.inkFaint} />
                    {i === 1 && <View style={styles.coverBadge}><Text style={styles.coverText}>Cover</Text></View>}
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.videoUpload}>
                <Video size={24} color={COLORS.navy} />
                <Text style={styles.videoUploadText}>Add Virtual Tour Video</Text>
              </Pressable>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {['Water', 'Electricity', 'Security', 'Kitchen', 'Ensuite Bathroom', 'Furnished', 'Generator', 'Borehole'].map(a => (
                  <Pressable
                    key={a}
                    style={[
                      styles.amenityChip,
                      formData.amenities.includes(a) && styles.activeAmenityChip
                    ]}
                    onPress={() => toggleAmenity(a)}
                  >
                    {formData.amenities.includes(a) && <Check size={14} color={COLORS.white} style={{ marginRight: 6 }} />}
                    <Text style={[
                      styles.amenityChipText,
                      formData.amenities.includes(a) && styles.activeAmenityText
                    ]}>{a}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Terms & Pricing</Text>
              <View style={styles.rentInputRow}>
                <Text style={styles.naira}>₦</Text>
                <TextInput
                  style={styles.rentInput}
                  placeholder="45,000"
                  keyboardType="numeric"
                  value={formData.rent}
                  onChangeText={(t) => updateField('rent', t)}
                />
              </View>

              <Text style={styles.fieldLabel}>Payment Frequency</Text>
              <View style={styles.segmentControl}>
                {['yearly', '6monthly', 'monthly'].map(f => (
                  <Pressable
                    key={f}
                    style={[
                      styles.segmentButton,
                      formData.payment_frequency === f && styles.activeSegment
                    ]}
                    onPress={() => updateField('payment_frequency', f)}
                  >
                    <Text style={[
                      styles.segmentText,
                      formData.payment_frequency === f && styles.activeSegmentText
                    ]}>{f}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable 
                style={[styles.pledgeCard, formData.no_increment_pledge && styles.activePledge]}
                onPress={() => updateField('no_increment_pledge', !formData.no_increment_pledge)}
              >
                <View style={styles.pledgeHeader}>
                  <ShieldCheck size={24} color={formData.no_increment_pledge ? COLORS.teal : COLORS.navy} />
                  <Text style={styles.pledgeTitle}>I pledge no sudden rent increases</Text>
                </View>
                <Text style={styles.pledgeSub}>Earn 3× more student inquiries with this badge</Text>
              </Pressable>
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Move-In Checklist</Text>
              <Text style={styles.stepSub}>Help students know exactly what to expect</Text>
              
              <View style={styles.checklistGrid}>
                {CHECKLIST_ITEMS.map(item => (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.checklistItem,
                      formData.move_in_checklist[item.key] && styles.activeChecklistItem
                    ]}
                    onPress={() => toggleChecklistItem(item.key)}
                  >
                    <View style={[
                      styles.checkCircle,
                      formData.move_in_checklist[item.key] && styles.activeCheckCircle
                    ]}>
                      {formData.move_in_checklist[item.key] && <Check size={14} color={COLORS.white} />}
                    </View>
                    <Text style={styles.checklistLabel}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </AnimatedWrapper>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.ghostButton} onPress={handleBack} disabled={isSubmitting}>
          <Text style={styles.ghostButtonText}>{step === 1 ? 'Cancel' : '← Previous'}</Text>
        </Pressable>
        <Pressable 
          style={styles.primaryButton} 
          onPress={step === 5 ? handleSubmit : handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryButtonText}>{step === 5 ? 'Submit Listing' : 'Next →'}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.navy,
  },
  stepperContainer: {
    paddingHorizontal: SPACING.page,
    paddingVertical: SPACING.md,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  activeStepDot: {
    borderColor: COLORS.terracotta,
    backgroundColor: COLORS.white,
  },
  completedStepDot: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  stepDotText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.inkLight,
  },
  activeStepDotText: {
    color: COLORS.terracotta,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.terracotta,
  },
  formContent: {
    padding: SPACING.page,
    paddingBottom: 100,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: COLORS.navy,
    marginBottom: 4,
  },
  stepSub: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkLight,
    marginBottom: 24,
  },
  fieldLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.ink,
    marginTop: 24,
    marginBottom: 12,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.navy,
  },
  uniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  uniChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeUniChip: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  uniChipText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.inkMid,
  },
  activeUniChipText: {
    color: COLORS.white,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: (SCREEN_WIDTH - SPACING.page * 2 - 12) / 2,
    height: 80,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  activeTypeCard: {
    backgroundColor: COLORS.navy,
    ...SHADOW.subtle,
  },
  typeLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.navy,
  },
  activeTypeText: {
    color: COLORS.white,
  },
  addressWrapper: {
    gap: 12,
  },
  addressInput: {
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.navy,
    textAlignVertical: 'top',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  gpsButtonText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.teal,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  uploadBox: {
    width: (SCREEN_WIDTH - SPACING.page * 2 - 20) / 3,
    height: 100,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coverBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  videoUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 12,
    marginTop: 24,
  },
  videoUploadText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.navy,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.pill,
  },
  activeAmenityChip: {
    backgroundColor: COLORS.navy,
  },
  amenityChipText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkMid,
  },
  activeAmenityText: {
    color: COLORS.white,
  },
  rentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  naira: {
    fontSize: 32,
    fontFamily: FONTS.displayBold,
    color: COLORS.navy,
  },
  rentInput: {
    flex: 1,
    fontSize: 32,
    fontFamily: FONTS.displayBold,
    color: COLORS.navy,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgDeep,
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSegment: {
    backgroundColor: COLORS.white,
    ...SHADOW.subtle,
  },
  segmentText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.inkMid,
    textTransform: 'capitalize',
  },
  activeSegmentText: {
    color: COLORS.navy,
  },
  pledgeCard: {
    marginTop: 32,
    padding: 20,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activePledge: {
    borderColor: COLORS.teal,
    backgroundColor: COLORS.white,
    ...SHADOW.subtle,
  },
  pledgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  pledgeTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.navy,
  },
  pledgeSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.inkLight,
    paddingLeft: 36,
  },
  checklistGrid: {
    gap: 12,
    marginTop: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: COLORS.bgDeep,
    borderRadius: 12,
  },
  activeChecklistItem: {
    backgroundColor: COLORS.teal + '10',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckCircle: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  checklistLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.inkMid,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
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
    fontSize: 15,
  },
  primaryButton: {
    flex: 2,
    height: 50,
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.white,
    fontSize: 16,
  },
});
