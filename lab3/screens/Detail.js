import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class DetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Detail',
  };

  render() {

    const {navigation} = this.props;
    //const title = navigation.getParam('itemTitle');
    const title = this.props.navigation.state.params.itemTitle;
    const key = navigation.getParam('itemKey');
    //const image_path = "../assets/images/product/" + key + ".jpg";
    const image_path = this.props.navigation.state.params.itemImage;
    
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>{JSON.stringify(title)}</Text>
        <Text/>
        <Image 
            source={image_path}
            style={{width:null, flex:1, height:200}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  textTitle: {
      textAlign: 'center',
      color: '#DDCE27',
      fontWeight: 'bold',
      fontSize: 22
  }
});