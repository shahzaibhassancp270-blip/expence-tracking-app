import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const CustomInput = ({ 
  label, 
  icon, 
  error, 
  password, 
  onFocus = () => {}, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
          backgroundColor: isFocused ? '#FFFFFF' : COLORS.background
        }
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={22} 
            color={isFocused ? COLORS.primary : COLORS.textSecondary} 
            style={styles.icon} 
          />
        )}
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, { color: COLORS.text }]}
          placeholderTextColor={COLORS.textSecondary}
          {...props}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons 
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'} 
              size={22} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    height: 55,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default CustomInput;
