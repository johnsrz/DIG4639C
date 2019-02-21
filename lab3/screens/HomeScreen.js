import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  _gotoScreen = (key) => {
    console.log("Going to " + key);
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Books and/on Coffee</Text>
            <FlatList
             data={[
              {key: 'CRR-GREY-12',image: require('../assets/images/product/CRR-GREY-12.jpg'),title: 'The Broadsheet Melbourne Cookbook'},
              {key: 'CRR-GREY-13',image: require('../assets/images/product/CRR-GREY-13.jpg'),title: 'The Professional Barista\'s Handbook'},
              {key: 'CRR-GREY-16',image: require('../assets/images/product/CRR-GREY-16.jpg'),title: 'The Little Coffee Know-It-All'},
              {key: 'CRR-GREY-17',image: require('../assets/images/product/CRR-GREY-17.jpg'),title: 'Brew Better Coffee at Home'},
              {key: 'CRR-GREY-97',image: require('../assets/images/product/CRR-GREY-97.jpg'),title: 'Drift Mag. SAN FRANSICSO'},
              {key: 'CRR-GREY-98',image: require('../assets/images/product/CRR-GREY-98.jpg'),title: 'Everything But Espresso'},
              {key: 'CRR-GREY-99',image: require('../assets/images/product/CRR-GREY-99.jpg'),title: 'The Coffee Roaster\'s Companion'},]}
             keyExtractor={this._keyExtractor}
              renderItem={({item}) => 
               <TouchableOpacity onPress={() => {this.props.navigation.navigate('Detail', 
                {itemImage: item.image,
                 itemTitle: item.title,
                 itemKey:   item.key
                })}}>
                <Image source={item.image} style={{width:200,height:200}} />
              </TouchableOpacity>}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

}

//<TouchableOpacity onPress={(event) => { console.log(item.title) }}>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
