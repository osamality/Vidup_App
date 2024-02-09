import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: '#fff',
    },
    container: {
        marginLeft: 40,
        marginRight: 40,
        height: '100%',
    },
    logoContainer: {
        marginTop: 100,
        alignItems: 'center'
    },
    signIntext: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        marginTop: 66
    },
    loginButton: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    whiteColor: {
        color: '#fff'
    },
    buttonMargin: {
        marginTop: 10,
        marginBottom: 10
    },
    bottomText: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column-reverse',
        marginBottom: 20
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#D0D0D0',
        borderWidth: 1,
        marginTop: 7,
        borderRadius: 5,
        marginBottom: 30,
        paddingLeft: 20
    }
});