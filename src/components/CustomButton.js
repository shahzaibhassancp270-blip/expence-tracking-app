import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

const CustomButton = ({ title, onPress, loading, style, textStyle, type = 'primary', disabled }) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textSecondary;
    return type === 'primary' ? COLORS.primary : 'transparent';
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.textSecondary;
    return type === 'secondary' ? COLORS.primary : 'transparent';
  };

  const getTextColor = () => {
    return type === 'primary' ? '#FFFFFF' : COLORS.primary;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.button, 
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: type === 'secondary' ? 1.5 : 0
        }, 
        style
      ]}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? '#FFFFFF' : COLORS.primary} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CustomButton;
