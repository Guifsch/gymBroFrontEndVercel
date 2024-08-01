import React from 'react';
import { SketchPicker } from 'react-color';

// Wrapper for SketchPicker
const SketchPickerWrapper = ({ color = '#fff', onChangeComplete = () => {} }) => {
  return <SketchPicker color={color} onChangeComplete={onChangeComplete} />;
};

export { SketchPickerWrapper };