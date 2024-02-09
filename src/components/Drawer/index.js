import React, {Component} from 'react';
import {Drawer,View,Text} from 'native-base';

const SideBar = ()=>{
    return(
        <View>
            <Text>hello</Text>
        </View>
    )
}
export default class DrawerExample extends Component {

    constructor(props) {
        super(props);
        this.drawer = React.createRef();
    }

    closeDrawer = () => {
        this.drawer._root.close()
    }

    openDrawer = ()=>{
        this.drawer._root.open()
    }

    componentDidMount() {
        this.openDrawer()
    }

    render() {
        return (
            <Drawer
                ref={this.drawer}
                content={<SideBar navigator={this.navigator}/>} onClose={() => this.closeDrawer()}>
                <Text>
                    hei
                </Text>
            </Drawer>
        );
    }
};