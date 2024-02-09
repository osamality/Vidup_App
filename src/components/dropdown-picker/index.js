import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDownPickerComponent = ({items, defaultIndex, style, defaultValue, onChangeItem}) => {
    return (
    <DropDownPicker
        items={items}
        defaultIndex={defaultIndex}
        containerStyle={{...style}}
        style={{borderWidth: 0, backgroundColor: 'transparent'}}
        defaultValue={defaultValue}
        onChangeItem={onChangeItem}
    />
    )
}

export default DropDownPickerComponent;