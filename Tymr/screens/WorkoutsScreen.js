import React from 'react';
import { ScrollView, 
         ListView,
         StyleSheet, 
         Text,
         TextInput,
         Picker,
         Button, 
         View, 
         Modal,
         TouchableOpacity,
         TouchableHighlight } from 'react-native';
import ExerciseItem from '../items/ExerciseItem';
import WorkoutItem from '../items/WorkoutItem';
import { SQLite } from 'expo';

const db = SQLite.openDatabase("db2.db");

export default class WorkoutsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      workoutDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      render: 0,
      text: "Hello World",
      time: 0,
      clock: -1,
      activeRow: -1,
      isClockRunning: false,
      currentTick: 0,
      activeWorkoutModal: false,
      selectExercisesModal: false,
      wName: '',
      wDescription: '',
      wCategory: '',
      wDays: '',
      wExercises: '',
    };
    this.tick = this.tick.bind(this); // bind to the component
  }

  static navigationOptions = {
    title: 'Workouts',
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  /*state = {
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    render: 0,
    text: "Hello World",
    time: 0,
  };*/


  componentDidMount(){
    //console.log(this.queryCreateExercisesTables());
    
    // Create Table INE
    db.transaction(tx => {
      tx.executeSql(
        this.queryCreateWorkoutsTables()
        );
      }, ()=>{console.log("Error")}, 
      ()=>{console.log("Success")});
         
      // Get List of Records from DB
      this.getListOfWorkoutTableRecords();

      /*let time = 0;
      let timeInterval = setInterval(
        (time)=>{
          if (this.state.time < time){
            this.setState({time: this.state.time + 1});
            console.log("Clock is ticking... " + this.state.time);
          }
          else if (this.state.time == time){
            this.setState({time: 0});
            console.log("Boom, time not ticking anymore. " + this.state.time);
            clearInterval(timeInterval);
          }
        }
        , 1000, time)*/
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

  getListOfExercisesTableRecords = () => {
    db.transaction((tx)=>{
      console.log("Workout Executing query");
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

  getListOfExercisesTableRecordsByID = (children) => {
    db.transaction((tx)=>{
      console.log("Workout Executing query");
      tx.executeSql(
        this.queryListOfExercisesTableRecordsById(children),  [], (_, { rows }) => {
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

  getListOfWorkoutTableRecords = () => {
    db.transaction((tx)=>{
      console.log("Workout Executing query");
      tx.executeSql(
        this.queryListOfWorkoutTableRecords(),  [], (_, { rows }) => {
        console.log(JSON.stringify(rows));
        let items = JSON.stringify(rows);
        console.log("Rows: " + ((rows.length)?rows.length:-1) + " -- ");
        this.setState({items: rows._array});
        this.setState({workoutDS: this.state.workoutDS.cloneWithRows(rows._array)});
        }
      )}
    , ()=>{console.log("Error on SELECT")}
    , ()=>{console.log('Success on SELECT')}
    );
  }
  


  // TODO: Load Sample Data
  // TODO: Update to select by Parent ID
  queryListOfExercisesTableRecords = () => {
    console.log("Workout Get Query");
    return 'SELECT * FROM EXERCISES';
  }


  queryListOfExercisesTableRecordsById = (id) => {
    console.log("ID passed:" + id);

    let children = id.split(',');
    console.log("Children: " + children.length);

    let condition = '';
    for (let i=0; i<children.length; i++){
      if (i < children.length -1)
        condition += "id == " + children[i] + " OR ";
      else 
        condition += "id == " + children[i];
    }
    console.log("Condition: " + condition);
    console.log('SELECT * FROM EXERCISES WHERE ' + condition + ';');
    console.log("Workout Get Query");
    return 'SELECT * FROM EXERCISES WHERE ' + condition + ';';
    //return 'SELECT * FROM EXERCISES WHERE id == ' + id + ';';
  }


  queryListOfWorkoutTableRecords = () => {
    console.log("Workout Get Query");
    return 'SELECT * FROM WORKOUTS';
  }

 
  // NOT-IN-USE
  startWorkout = () => {
    let ds = [];
    ds = this.state.dataSource._dataBlob.s1.slice(0);


    ds[0] = {
      id: ds[0].id,
      name: ds[0].name,
      description: ds[0].description,
      type: ds[0].type,
      time: ds[0].time + 1,
      reps: ds[0].reps,
      weight: ds[0].weight,
      days: ds[0].days,
      parent: ds[0].parent
    };

    this.setState({dataSource: this.state.dataSource.cloneWithRows(ds)});
  }

  // NOT-IN-USE
  tick2 = () => {
    let clockInterval = setInterval(()=>{
      if (this.state.clock == 10){
        clearInterval(clockInterval);
      } else {
        this.setState({clock: this.state.clock + 1});
      }
    },1000
    );
  }


  tick = () => {
    if (this.state.activeRow == -1) this.setState({activeRow: 0});
    console.log("ActiveRow: " + this.state.activeRow);
    this.setState({isClockRunning: !this.state.isClockRunning});    
    console.log("isRunning? " + this.state.isClockRunning);

    let clockInterval = setInterval(()=>{

      this.setState({clockIntervalID: clockInterval});

      // TODO: activeRow < dataSource.getRowCount
      if (this.state.activeRow >= this.state.dataSource._dataBlob.s1.length){
        this.setState({activeRow: -1, isClockRunning: false});
        clearInterval(this.state.clockIntervalID);
      } else if (this.state.currentTick == this.state.dataSource._dataBlob.s1[this.state.activeRow].time){
        this.setState({activeRow: this.state.activeRow + 1});
        this.setState({currentTick: 0});
        //console.log("Clear IntervalID (TimedOut): " + this.state.clockIntervalID);
        //clearInterval(this.state.clockIntervalID);
        console.log("Moving on item#: " + this.state.activeRow);
      } else if (!this.state.isClockRunning) {
        console.log("Clear IntervalID (PAUSED): " + this.state.clockIntervalID);
        clearInterval(this.state.clockIntervalID);
      } else {
        this.setState({currentTick: this.state.currentTick + 1});
      } 
    },1000
    );
  }

  addNewWorkout = () => {
    // Open Modal
    // Display
  }

  queryRecordToWorkoutsTable(){
    let name = (this.state.wName)? this.state.wName: '?';
    let description = (this.state.wDescription)? this.state.wDescription: '?';
    let parent = '?'; //not in use
    let category = (this.state.wCategory)? this.state.wCategory:'?';
    let children = (this.state.wExercises)? this.state.wExercises:'?';
    let days = (this.state.wDays)? this.state.wDays: '?';

    let query = 'INSERT INTO WORKOUTS(name, description, children, days, category, parent) values(\"' + 
                  name   + '\", \"' + description + '\", \"' + children + '\", \"' + 
                  days   + '\", \"'  + category    + '\", \"' + parent   + '\"'    + ');';
    console.log("INSERT WORKOUTS QUERY:" + query);
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
  
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
      <ScrollView style={styles.container}>
        <ListView
          enableEmptySections={true}
          style={styles.container}
          dataSource={this.state.workoutDS}
          renderRow={(data, sectionID, rowID, highlightRow) => 
            <TouchableOpacity
              onPress={()=>{
                console.log("data.children: " + data.children);
                this.getListOfExercisesTableRecordsByID(data.children);
                this.setState({activeWorkoutModal: true});
              }}>
              <WorkoutItem name={data.name}/>
            </TouchableOpacity>}
        />
      </ScrollView>
      <Button onPress={()=>{this.setModalVisible(true)}} title="New Workout"/>


      {/* Active Workout Modal */}
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.activeWorkoutModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
        <View style={{marginTop: 40, marginBottom: 40, flex: 1, flexDirection: 'column',}}>
          <Button onPress={()=>{
          this.tick()
          //setInterval(this.startWorkout(), 1000)
          }} title={(this.state.isClockRunning)?'PAUSE':'START'}/>
          <ScrollView style={styles.container}>
            <ListView
              enableEmptySections={true}
              style={styles.container}
              dataSource={this.state.dataSource}
              renderRow={(data, sectionID, rowID, highlightRow) => 
                <TouchableOpacity>
                  <ExerciseItem name={data.name} time={(rowID == this.state.activeRow)?this.state.currentTick:data.time}/>
                </TouchableOpacity>}
            />
          </ScrollView>
          <Button onPress={()=>{
            this.setState({isClockRunning: false});
            this.setState({activeRow: -1});
            clearInterval(this.state.clockIntervalID);
            this.setState({activeWorkoutModal: false});
          }} title='Cancel'/>
        </View>
      </Modal>


      {/* Add Exercises to Workout Modal */}
      <Modal 
          animationType="slide"
          transparent={false}
          visible={this.state.selectExercisesModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
        <View style={{marginTop: 40, flex: 1, flexDirection: 'row',}}>
          <View style={{padding: 20, flex: 1, flexDirection: 'column',}}>
            <View style={styles.modalRow}>
              <ScrollView style={styles.container}>
                  <ListView
                    enableEmptySections={true}
                    style={styles.container}
                    dataSource={this.state.workoutDS}
                    renderRow={(data, sectionID, rowID, highlightRow) => 
                      <TouchableOpacity>
                        <ExerciseItem name={data.name} time={(rowID == this.state.activeRow)?this.state.currentTick:data.time}/>
                      </TouchableOpacity>}
                  />
                </ScrollView>
            </View>
          
            <View style={styles.modalRow}>
              <View style={styles.buttonView}>
                <TouchableHighlight
                onPress={() => {
                  console.log("Name: " + this.state.wName);
                  let wExercises = '1';
                  this.setState({wExercises});
                  console.log(wExercises + ":" + this.state.wExercises);
                  let query = this.queryRecordToWorkoutsTable();
                  this.addWorkoutToDataBase(query);

                  this.setState({selectExercisesModal: false});
                  //this.addExercise('New Book');
                }}>
                  <Text style={styles.buttonText}>Add Workout</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.buttonView}>
                <TouchableHighlight
                onPress={() => {
                  this.setState({selectExercisesModal: false});
                }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>   
          </View>
        </View>
      </Modal>

      {/*  New Workout Info Modal */}
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 40, flex: 1, flexDirection: 'row',}}>
            <View style={{padding: 20, flex: 1, flexDirection: 'column',}}>
              
              
              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(wName)=>{this.setState({wName})}} 
                    text={this.state.wName}
                    placeholder='Name'/>
                </View>
              </View>

              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(wDescription)=>{this.setState({wDescription})}} 
                    text={this.state.wDescription}
                    placeholder='Description'/>
                </View>
              </View>

              <Picker 
                selectedValue={this.state.wDays}
                onValueChange={(wDays, itemIndex) => this.setState({wDays})}
                >
                <Picker.Item label='Sunday' value='Sun'/>
                <Picker.Item label='Monday' value='Mon'/>
                <Picker.Item label='Tuesday' value='Tue'/>
                <Picker.Item label='Wednesday' value='Wed'/>
                <Picker.Item label='Thursday' value='Thu'/>
                <Picker.Item label='Friday' value='Fri'/>
                <Picker.Item label='Saturday' value='Sat'/>
              </Picker>

              <Picker 
                selectedValue={this.state.wCategory}
                onValueChange={(wCategory, itemIndex) => this.setState({wCategory})}
                >
                <Picker.Item label='Cardio' value='cardio'/>
                <Picker.Item label='Strength' value='strength'/>
              </Picker>
              

              <View style={styles.modalRow}>
                <View style={styles.buttonView}>
                    <TouchableHighlight
                      onPress={() => {
                        console.log("Name: " + this.state.wName + " Description: " + this.state.wDescription);
                        this.setState({selectExercisesModal: true});
                        this.setState({modalVisible: false});
                        //this.addExercise('New Book');
                      }}>
                      <Text style={styles.buttonText}>Add Exercises</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableHighlight
                      onPress={() => {
                        this.setState({modalVisible: false});
                      }}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>

            </View>
          </View>
        </Modal>
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
  buttonsBox: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 0.5,
  },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  textView: {
      backgroundColor: '#C2C2C2',
  },
  inputView: {
      backgroundColor: '#FFFFFF',
      flex: 1,
  },
  buttonView: {
      backgroundColor: '#CDCDCD',
      flex: 0.5,
      height: 50,
      width: 150,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
  },
  titleTex: {
    fontSize: 16,
    fontWeight: 'bold',
    //placeholderTextColor: '#C1C1C1',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    textAlign: 'left',
    textAlignVertical: 'center'
  },
  dayText: {
    fontSize: 14, 
    fontWeight: 'bold',
    textAlignVertical: 'center',
  }, 
  dayBox: {
    flex: 0.15,
    height: 30, 
    padding: 5,
  },
  buttonText: {
    shadowColor: '#C1C1C1',
    textAlign: 'center', 
    textAlignVertical: 'center',
  }
});
