import { Text, View, Image, FlatList, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardItem, Thumbnail, Badge, Icon, Left, Body, Right } from 'native-base';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import testProps from 'locatorId';

//Redux
import { connect } from 'react-redux';

const ProfileThumb = ({ style, profilePic, loggedInUser, testProp }) => {

    return (
        <Thumbnail style={style}
            {...testProps(testProp)}
            source={{
                uri: profilePic,
                headers: {
                    'Authorization': `jwt ${loggedInUser.token}`
                }
            }} />
    )
}


function mapStateToProps(state) {
    return {
        loggedInUser: state.user.user,
    };
}

export default connect(mapStateToProps, null)(ProfileThumb);