import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListView,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { SQLite } from 'expo';
import { MonoText } from '../components/StyledText';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import ExerciseItem from '../items/ExerciseItem';

const db = SQLite.openDatabase("db2.db");

export default class HomeScreen extends React.Component {

  state = {
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  };

  static navigationOptions = {
    header: null,
    title: 'Tymr: Your Daily Workout',
  };

  componentDidMount = () => {
    this.getListOfExercisesForToday();
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    let date = new Date();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let month = date.getMonth() + 1;
    let string_date = days[date.getDay()] + ' | ' + month+ '/' + date.getDate() + '/' + date.getFullYear();

    return (
      <View style={styles.container}>
        <View style={{paddingTop: 60, paddingBottom: 20}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', textAlignVertical: 'center', textAlign: 'center'}}>{string_date}</Text>
        </View>
        <Calendar/>
        <ScrollView style={styles.container}>
          <ListView
           enableEmptySections={true}
            style={styles.container}
            dataSource={this.state.dataSource}
            renderRow={(data) => <ExerciseItem name={data.name} time={data.time}/>}
          />
        </ScrollView>
        <Text>This View currently only updates on App Launch. Working on calling render() when navigating back.</Text>
      </View>
    );
  }

  getListOfExercisesForToday = () => {
    db.transaction((tx)=>{
      tx.executeSql(
        this.queryListOfExercisesTableRecords(),  [], (_, { rows }) => {
        console.log(JSON.stringify(rows));
        let items = JSON.stringify(rows);
        console.log("Rows: " + ((rows.length)?rows.length:-1) + " -- ");
        this.setState({items: rows._array});
        this.setState({dataSource: this.state.dataSource.cloneWithRows(rows._array)});
        }
      )}
    , ()=>{console.log("Error on SELECT")}
    , ()=>{console.log('Success on SELECT')}
    );
  }

  queryListOfExercisesTableRecords(){
    let date = new Date();
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let today = days[date.getDay()];

    let query = 'SELECT * FROM EXERCISES4 WHERE days LIKE \'%Wed%\';'; // %' + today + '%;'
    console.log("DAY SELECT QUERY: " + query);
    //return 'SELECT * FROM EXERCISES4';
    return query;
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

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
