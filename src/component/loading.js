//import liraries
import React, { Component } from 'react';
import { View, 
         Text, 
         StyleSheet,
         Modal,
         ActivityIndicator,
         Platform
} from 'react-native';
import { Spinner } from 'native-base';

// create a component
class Loading extends Component {
    constructor(props){
        super(props);
        this.state={
            isShow:props.isShow?props.isShow:false,
            text:props.text
        }
    }

    render() {
        if(this.state.isShow)
            return (
                <Modal
                    visible={this.state.isShow} 
                    transparent
                    onRequestClose={() => this.requestClose()}
                    style={styles.container}
                >
                    <View style={styles.view}>
                        <Spinner size={Platform.OS=="ios"?"large":60} color={this.props.Color?this.props.Color:'#fff'} />
                        <Text style={{color:this.props.textColor?this.props.textColor:'#fff', 
                            backgroundColor:this.props.bgColor?this.props.bgColor:'rgba(0,0,0,0)'}}>{this.state.text?this.state.text:""}</Text>
                    </View>
                </Modal>
            );
        else
            return <View/>
    }

    updateText(txt){
        this.setState({
            text:txt
        })
    }

    hide(){
       this.setState({
           isShow:false
       })
    }

    requestClose(){
        this.setState({
            isShow:false
        })
    }
    
    show(){
        this.setState({
            isShow:true
        })
     }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    view:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    }
});

//make this component available to the app
export default Loading;
