// app/(tabs)/spotlight/form.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';


const API_KEY = '99dnfneeekdegnrJJSN3JdenrsdnJ';
const AUTH = { 'x-soapbox-key': API_KEY };

const BASE_URL =
  Platform.OS === 'web'
    ? (typeof window !== 'undefined'
        ? window.location.origin.replace(/:\d+$/, ':3030')
        : 'http://localhost:3030')
    : 'http://192.168.1.176:3030';

export default function SpotlightForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateUS, setStateUS] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [companies, setCompanies] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);

  const disabled = useMemo(() => {
    const hasContact = email.trim() || phone.trim();
    return (
      !name.trim() ||
      !city.trim() ||
      !stateUS.trim() ||
      !details.trim() ||
      !hasContact ||
      !consent ||
      sending
    );
  }, [name, city, stateUS, details, email, phone, consent, sending]);

  const onSubmit = async () => {
    if (disabled) return;

    try {
      setSending(true);

      const body = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: stateUS.trim(),
        subject: subject.trim(),
        details: details.trim(),
        companies: companies
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        consent: true,
      };

      const r = await fetch(`${BASE_URL}/spotlight`, {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${r.status}`);
      }

      Alert.alert('Thanks!', 'Your submission was sent to Blue Collar Soapbox.');
      // ✅ Clear everything after success
      setName('');
      setEmail('');
      setPhone('');
      setCity('');
      setStateUS('');
      setSubject('');
      setDetails('');
      setCompanies('');
      setConsent(false);

      // Optional: kick back to landing after a moment
      // setTimeout(() => router.back(), 600);
    } catch (e: any) {
      Alert.alert('Submit failed', String(e?.message || e));
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0b0d10' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        {/* Compact banner to match your headers */}
        <View style={{ alignItems: 'center' }}>
  <Image
  source={require('../../assets/spotlight-banner.png')}
  style={{ width: 380, height: undefined, aspectRatio: 16/9, maxWidth: '90%', transform: [{ scale: 1.8 }] }}
  resizeMode="contain"
/>
</View>

        <View style={styles.card}>
          <Text style={styles.title}>Tell Us Your Story</Text>
          <Text style={styles.body}>
            Goes straight to our team — not public. We won’t move forward without your consent.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Contact</Text>

          <Field label="Full Name *">
            <TextInput value={name} onChangeText={setName} placeholder="Jane Doe" placeholderTextColor="#6b7a89" style={styles.input} />
          </Field>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Field label="Email">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@email.com"
                  placeholderTextColor="#6b7a89"
                  style={styles.input}
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Phone">
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="(555) 555-5555"
                  placeholderTextColor="#6b7a89"
                  style={styles.input}
                />
              </Field>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Field label="City *">
                <TextInput value={city} onChangeText={setCity} placeholder="Orlando" placeholderTextColor="#6b7a89" style={styles.input} />
              </Field>
            </View>
            <View style={{ width: 120 }}>
              <Field label="State *">
                <TextInput
                  value={stateUS}
                  onChangeText={setStateUS}
                  placeholder="FL"
                  placeholderTextColor="#6b7a89"
                  autoCapitalize="characters"
                  style={styles.input}
                  maxLength={20}
                />
              </Field>
            </View>
          </View>

          <Text style={styles.section}>Story</Text>

          <Field label="Subject (optional)">
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Short headline for your story"
              placeholderTextColor="#6b7a89"
              style={styles.input}
            />
          </Field>

          <Field label="Details *">
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="Tell us what happened and why it matters…"
              placeholderTextColor="#6b7a89"
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
              multiline
            />
          </Field>

          <Field label="Companies involved (optional, comma-separated)">
            <TextInput
              value={companies}
              onChangeText={setCompanies}
              placeholder="Acme, RoadCo, …"
              placeholderTextColor="#6b7a89"
              style={styles.input}
            />
          </Field>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <Pressable onPress={() => setConsent(!consent)} hitSlop={8}>
              <Ionicons name={consent ? 'checkbox-outline' : 'square-outline'} size={24} color={consent ? '#1f6feb' : '#9fb0c0'} />
            </Pressable>
            <Text style={styles.consentText}>
              I agree to be contacted. I understand this isn’t public and won’t move forward without my consent.
            </Text>
          </View>

          <Pressable onPress={onSubmit} disabled={disabled} style={[styles.submit, disabled && { opacity: 0.6 }]}>
            <Text style={styles.submitText}>{sending ? 'Sending…' : 'Submit'}</Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
  width: 380,
  height: undefined,
  aspectRatio: 16 / 9,
  maxWidth: '90%',
  transform: [{ scale: 1.8 }],
},
  card: {
    backgroundColor: '#0f141b',
    borderWidth: 1,
    borderColor: '#1e2630',
    borderRadius: 12,
    padding: 12,
  },
  title: { color: '#e8f0ff', fontWeight: '800', fontSize: 20, marginBottom: 6 },
  body: { color: '#9fb0c0' },
  section: { color: '#cfe0ff', fontWeight: '800', marginTop: 6, marginBottom: 8 },
  label: { color: '#9fb0c0', marginBottom: 6, fontSize: 12 },
  input: {
    backgroundColor: '#0b0d10',
    borderWidth: 1,
    borderColor: '#1e2630',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: '#e6edf3',
  },
  consentText: { color: '#b8c7d6', flex: 1 },
  submit: {
    marginTop: 12,
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '800' },
});
