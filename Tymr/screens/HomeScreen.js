import React from 'react';
import {
  Image,
  Button,
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
import WorkoutItem from '../items/WorkoutItem';

const db = SQLite.openDatabase("db2.db");

export default class HomeScreen extends React.Component {

  state = {
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    workoutsDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    markedDates: {},
  };

  static navigationOptions = {
    header: null,
    title: 'Tymr: Your Daily Workout',
  };

  componentDidMount = () => {
    //this.getListOfExercisesForToday();
    this.getListOfWorkoutsForToday();
  }

  loadTestDataSet = () => {
    console.log("Loading Test Data for Development");
    //Load Workouts for Today's Date in the Home Screen

    // Create Workout Tables INE
    // Create Table INE
    db.transaction(tx => {
      tx.executeSql(
        this.queryCreateWorkoutsTables()
        );
      }, ()=>{console.log("Error creating Workout Tables")}, 
         ()=>{console.log("Success creating Workout Tables")});

    // Create Exercises Table INE
    db.transaction(tx => {
      tx.executeSql(
        this.queryCreateExercisesTables()
        );
      }, ()=>{console.log("Error creating Exercises Tables")}, 
         ()=>{console.log("Success creating Exercises Tables")});

    //Create 2 workouts, add them to Table Workouts/
    let workouts = this.testWorkoutsData();
    for (let i=0; i < workouts.length; i++){
      console.log("Workouts[0].name: " + workouts[i].name);
      let query = this.queryRecordToWorkoutsTable(workouts[i]);
      this.addWorkoutToDataBase(query);
    }

    //Create 6 exercises, add them to Table Exercises/
    let exercises = this.testExercisesData();
    for (let i=0; i < exercises.length; i++){
      console.log("exercises[0].name: " + exercises[i].name);
      let query = this.queryRecordToExercisesTable(exercises[i]);
      this.addExerciseToDataBase(query);
    }
    
  }

  testWorkoutsData = () => {
    let workouts = [{name: 'W1: Cardio 1',
                    description: 'Break a sweat 1',
                    category: 'cardio',
                    children: '1,2',
                    days: 'Sun',
                  },
                  {name: 'W2: Cardio 2',
                    description: 'Break a sweat 2',
                    category: 'cardio',
                    children: '3,4,5,6',
                    days: 'Mon',
                  }
                  ];
    return workouts;
  }

  testExercisesData = () => {
    console.log("Loading Exercises Data");
    let exercises = [{name: 'W1:E1: Sample Exercise',
                      description: 'Description W1:E2',
                      type: 'time',
                      time: 30,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 1
                      },
                      {name: 'W1:E2: Sample Exercise',
                      description: 'Description W1:E2',
                      type: 'time',
                      time: 30,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 1
                      },
                      {name: 'W2:E1: Sample Exercise',
                      description: 'Description W2:E1',
                      type: 'time',
                      time: 15,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 2
                      },
                      {name: 'W2:E2: Sample Exercise',
                      description: 'Description W2:E2',
                      type: 'time',
                      time: 15,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 2
                      },
                      {name: 'W2:E3: Sample Exercise',
                      description: 'Description W2:E3',
                      type: 'time',
                      time: 45,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 2
                      },
                      {name: 'W2:E4:: Sample Exercise',
                      description: 'Description W2:E4',
                      type: 'time',
                      time: 30,
                      reps: '?',
                      weight: '?',
                      days: '?',
                      parent: 2
                      },
                      

                    ];

    console.log("Exercises: " + exercises.length);
    //for (let i=0; i < exercises.length; i++)
    //  console.log(exercises[i].name);

    return exercises;
  }



  // Create Tables INE Functions
  queryCreateExercisesTables(){
    let query = 'CREATE TABLE IF NOT EXISTS EXERCISES(' + 
                'id integer primary key not null' + ',' +  
                'name text not null' + ',' +  
                'description text' + ',' +  
                'type text not null' + ',' +   
                'time integer' + ',' +  
                'reps integer' + ',' +  
                'weight integer' + ',' + 
                'days text' + ',' +  
                'parent integer' + 
                ');';

    console.log('Exercise Table Query: ' + query);
    return query;
  }


  queryCreateWorkoutsTables(){
    let query = 'CREATE TABLE IF NOT EXISTS WORKOUTS(' + 
                'id integer primary key not null' + ',' +  
                'name text not null' + ',' +  
                'description text' + ',' + 
                'children text' + ',' +  // list of ids from Exercises
                'days text' + ',' +
                'category text' + ',' +  // Strength or Cardio
                'parent integer' + 
                ');';
                
    console.log('Workouts Table Query: ' + query);
    return query;
  }


  addWorkoutToDataBase = (record_query) => {  
    //let record_query = this.queryRecordToWorkoutsTable(record);
    db.transaction(tx => {
      tx.executeSql(
        record_query
        );
      }, ()=>{console.log("Error on INSERT (Workout)")}, 
      ()=>{console.log("Success on INSERT (Workout)")});
  }
    
    queryRecordToWorkoutsTable(record){
      console.log("2: record.name: " + record.name);
      let name = (record.name)? record.name: '?';
      let description = (record.description)? record.description: '?';
      let children = (record.children)? record.children: '?';
      let category = (record.category)? record.category:'?';
      let parent = (record.parent)? record.parent:'?';
      let days = (record.days)? record.days: '?';
  
      let query = 'INSERT INTO WORKOUTS(name, description, children, days, category, parent) values(\"' + 
              name   + '\", \"' + description + '\", \"' + children + '\", \"' + 
              days   + '\", \"'  + category    + '\", \"' + parent   + '\"'    + ');';
      console.log("INSERT QUERY:" + query);
      return query;
    }

    addExerciseToDataBase = (record_query) => {  
      //let record_query = this.queryRecordToWorkoutsTable(record);
      db.transaction(tx => {
        tx.executeSql(
          record_query
          );
        }, ()=>{console.log("Error on INSERT (Exercise)")}, 
        ()=>{console.log("Success on INSERT (Exercise)")});
    }

    queryRecordToExercisesTable(record){
      let name = (record.name)? record.name: '?';
      let description = (record.description)? record.description: '?';
      let type = (record.type)? record.type:'?';
      let time = (record.time)? record.time:'45'; // default
      let reps = (record.reps)? record.reps:'?';
      let weight = (record.weight)? record.weight:'?';
      let parent = (record.parent)? record.parent:'?';
      let days = (record.day)? record.day: '?';
  
      let query = 'INSERT INTO EXERCISES(name, description, type, time, reps, weight, days, parent) values(\"' + 
              name   + '\", \"' + description + '\", \"' + type + '\", ' + time + ', ' + reps + ', ' + 
              weight + ', \"'   + days        + '\", '   + parent        + ');';
      console.log("INSERT QUERY:" + query);
      return query;
    }

  /***************************************************************************/

  queryListWorkoutsByDate = (dt) => {
    let tempDate = new Date(dt.dateString);
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let day = days[tempDate.getDay()];
    console.log(dt.dateString + ":" + tempDate.getDay() + ":" + day);
    let query = 'SELECT * FROM WORKOUTS WHERE days LIKE \'%' + day + '%\';'; // %' + today + '%;'
    console.log("QueryByDate: " + query);
    return query;
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
        <Calendar
          markedDates = {this.state.markedDates}
          onDayPress={(day) => {this.getListOfWorkoutsForDate(day)}}
        />
        <ScrollView style={styles.container}>
          <ListView
           enableEmptySections={true}
            style={styles.container}
            dataSource={this.state.workoutsDS}
            renderRow={(data) => <WorkoutItem name={data.name} time={data.days}/>}
          />
        </ScrollView>
        <Button title='Load Test Data' onPress={()=>{this.loadTestDataSet()}}/>
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

  getListOfWorkoutsForToday = () => {
    db.transaction((tx)=>{
      tx.executeSql(
        this.queryListOfWorkoutsTableRecords(),  [], (_, { rows }) => {
        console.log(JSON.stringify(rows));
        let items = JSON.stringify(rows);
        console.log("Rows: " + ((rows.length)?rows.length:-1) + " -- ");
        this.setState({items: rows._array});
        this.setState({workoutsDS: this.state.workoutsDS.cloneWithRows(rows._array)});
        }
      )}
    , ()=>{console.log("Error loading Today's Workouts")}
    , ()=>{console.log("Success loading Today's Workouts")}
    );
  }

  getListOfWorkoutsForDate = (dt) => {
    db.transaction((tx)=>{
      tx.executeSql(
        this.queryListWorkoutsByDate(dt),  [], (_, { rows }) => {
        console.log(JSON.stringify(rows));
        let items = JSON.stringify(rows);
        console.log("Rows: " + ((rows.length)?rows.length:-1) + " -- ");
        this.setState({items: rows._array});
        this.setState({workoutsDS: this.state.workoutsDS.cloneWithRows(rows._array)});
        }
      )}
    , ()=>{console.log("Error loading Selected Workouts")}
    , ()=>{console.log("Success loading Selected Workouts")}
    );
  }

  // TODO: Update to get Workouts List
  queryListOfExercisesTableRecords(){
    let date = new Date();
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let today = days[date.getDay()];

    let query = 'SELECT * FROM EXERCISES WHERE days LIKE \'%' + today + '%\';'; // %' + today + '%;'
    console.log("DAY SELECT QUERY: " + query);
    //return 'SELECT * FROM EXERCISES4';
    return query;
  }


  queryListOfWorkoutsTableRecords(){
    let date = new Date();
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let today = days[date.getDay()];

    let query = 'SELECT * FROM WORKOUTS WHERE days LIKE \'%' + today + '%\';'; // %' + today + '%;'
    //let query = 'SELECT * FROM WORKOUTS';
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
