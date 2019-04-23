import React from 'react';
import {Text, View, StyleSheet} from 'react-native';


class WorkoutItem extends React.Component{

    WorkoutItem(){
       this.state = {active: this.props.active};
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.textView}>
                    <Text style={styles.name}>{this.props.name}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        shadowColor: '#C1C1C1',
    },
    textView: {
        backgroundColor: '#C2C2C2',
        height: 50,
        flex: 1,
    },
    valueView: {
        backgroundColor: '#CDCDCD',
        height: 50,
        flex: 0.20,
    },
    name:{
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        textAlign: 'left',
        textAlignVertical: 'center'
    },
    value:{
        fontSize: 24,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
});

export default WorkoutItem;