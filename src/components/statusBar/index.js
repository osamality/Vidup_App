import { StatusBar } from 'react-native';
import React, { useState } from 'react';

import { useTheme } from "@react-navigation/native";

const Statusbar = (props) => {

  const {colors} = useTheme();

  return (
        <StatusBar translucent={true} backgroundColor="transparent" barStyle={ colors.background == '#fff' ? 'dark-content' : 'light-content'} />
  );
}

export default Statusbar;
