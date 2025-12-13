import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface DeadlinePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const DeadlinePicker: React.FC<DeadlinePickerProps> = ({ visible, onClose, onSelect }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  const handleConfirm = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const dayNum = parseInt(day) || now.getDate();
    const monthNum = parseInt(month) || (currentMonth + 1);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);

    if (dayNum < 1 || dayNum > 31) {
      alert('Día inválido (1-31)');
      return;
    }
    if (monthNum < 1 || monthNum > 12) {
      alert('Mes inválido (1-12)');
      return;
    }
    if (hourNum < 0 || hourNum > 23) {
      alert('Hora inválida (0-23)');
      return;
    }
    if (minuteNum < 0 || minuteNum > 59) {
      alert('Minutos inválidos (0-59)');
      return;
    }

    const selectedDate = new Date(currentYear, monthNum - 1, dayNum, hourNum, minuteNum);
    
    if (selectedDate <= now) {
      alert('La fecha debe ser futura');
      return;
    }

    onSelect(selectedDate);
    onClose();
    
    setDay('');
    setMonth('');
    setHour('');
    setMinute('');
  };

  const handleCancel = () => {
    setDay('');
    setMonth('');
    setHour('');
    setMinute('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <FontAwesome name="clock-o" size={24} color="#00FFAA" />
            <Text style={styles.title}>Fecha límite</Text>
          </View>

          <Text style={styles.label}>Fecha (DD/MM)</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="DD"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={2}
              value={day}
              onChangeText={setDay}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={2}
              value={month}
              onChangeText={setMonth}
            />
          </View>

          <Text style={styles.label}>Hora (HH:MM)</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="HH"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={2}
              value={hour}
              onChangeText={setHour}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={2}
              value={minute}
              onChangeText={setMinute}
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  separator: {
    color: '#666',
    fontSize: 24,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  confirmButton: {
    backgroundColor: '#00FFAA',
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DeadlinePicker;