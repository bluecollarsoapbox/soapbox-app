import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';


export default function PizzaParty() {
  const [hostCompany, setHostCompany] = useState('');
  const [hostTime, setHostTime] = useState('');
  const [hostAttendance, setHostAttendance] = useState('');
  const [hostBosses, setHostBosses] = useState('');
  const [code, setCode] = useState('');
  const [roast, setRoast] = useState('');
  const [count, setCount] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0d12', padding: 16 }}>
      <Text style={{ color: '#e6edf3', fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Pizza Party</Text>

      {/* Request to Host */}
      <View style={{ backgroundColor: '#0f141b', borderColor: '#1e2630', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: '#e6edf3', fontWeight: '700', marginBottom: 6 }}>Request to Host</Text>
        <Text style={{ color: '#8b98a5', marginBottom: 6 }}>By submitting, you agree to the filming disclaimer/permission.</Text>
        <TextInput placeholder="Company / Crew" placeholderTextColor="#7a8592" value={hostCompany} onChangeText={setHostCompany}
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 }} />
        <TextInput placeholder="Date & Time" placeholderTextColor="#7a8592" value={hostTime} onChangeText={setHostTime}
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 }} />
        <TextInput placeholder="Approx attendance" placeholderTextColor="#7a8592" value={hostAttendance} onChangeText={setHostAttendance}
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 }} />
        <TextInput placeholder="Bosses attending? (yes/no)" placeholderTextColor="#7a8592" value={hostBosses} onChangeText={setHostBosses}
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 }} />
        <Pressable onPress={() => Alert.alert('Request received', 'We’ll review your Pizza Party request.')}
          style={{ backgroundColor: '#1f6feb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginTop: 10 }}>
          <Text style={{ color: '#e6edf3', fontWeight: '700' }}>Request to Host</Text>
        </Pressable>
      </View>

      {/* Find Your Party */}
      <View style={{ backgroundColor: '#0f141b', borderColor: '#1e2630', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: '#e6edf3', fontWeight: '700', marginBottom: 6 }}>Find Your Party</Text>
        <TextInput placeholder="Enter 6-digit code" maxLength={6} placeholderTextColor="#7a8592" value={code} onChangeText={setCode}
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 }} />
        <Pressable onPress={() => (code.trim() ? Alert.alert('Party found', `Code ${code}: details visible to everyone with the code.`) : Alert.alert('Enter code', '6-digit party code required.'))}
          style={{ backgroundColor: '#1f6feb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginTop: 10 }}>
          <Text style={{ color: '#e6edf3', fontWeight: '700' }}>Find</Text>
        </Pressable>
      </View>

      {/* Submit Roast */}
      <View style={{ backgroundColor: '#0f141b', borderColor: '#1e2630', borderWidth: 1, borderRadius: 14, padding: 14 }}>
        <Text style={{ color: '#e6edf3', fontWeight: '700', marginBottom: 6 }}>Submit Roast</Text>
        <Text style={{ color: '#8b98a5', marginBottom: 6 }}>Private: only the host sees these. Limit 5 per device. Submitted: {count}/5</Text>
        <TextInput placeholder="Roast them." placeholderTextColor="#7a8592" value={roast} onChangeText={setRoast} multiline
          style={{ backgroundColor: '#0a0f15', color: '#e6edf3', borderColor: '#1e2630', borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 100 }} />
        <Pressable
          onPress={() => {
            if (!roast.trim()) return Alert.alert('Empty roast', 'Say something spicy.');
            if (count >= 5) return Alert.alert('Limit reached', 'You’ve submitted 5 roasts.');
            setRoast('');
            setCount(count + 1);
            Alert.alert('Roast saved', 'Totally private. Only the host can see these.');
          }}
          style={{ backgroundColor: '#1f6feb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginTop: 10 }}
        >
          <Text style={{ color: '#e6edf3', fontWeight: '700' }}>Submit Roast</Text>
        </Pressable>
      </View>
    </View>
  );
}
