import React from 'react';
import { ChromePicker } from 'react-color';

const ChromePickerWrapper = ({ color = '#fff', onChangeComplete = () => {} }) => {
  return <ChromePicker color={color} onChangeComplete={onChangeComplete} />;
};

export default ChromePickerWrapper;