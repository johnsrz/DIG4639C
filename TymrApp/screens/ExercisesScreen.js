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
import { SQLite } from 'expo';

import CustomTextInput from '../components/CustomTextInput';
//import { TextInput } from 'react-native-gesture-handler';

const db = SQLite.openDatabase("db2.db");

export default class ExercisesScreen extends React.Component {
  static navigationOptions = {
    title: 'Exercises',
  };

  state = {
    modalVisible: false,
    selected: 'Timed',
    itemsLoaded: false,
    items: [],
    type: 'time',
    day: 'Sun',
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    time: '45',
    reps: '12',
    weight: '0',
    name: 'Default'
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount(){
    console.log(this.queryCreateExercisesTables());
    
    // Create Table INE
    db.transaction(tx => {
      tx.executeSql(
        this.queryCreateExercisesTables()
        );
      }, ()=>{console.log("Error")}, 
      ()=>{console.log("Success")});
         
      // Get List of Records from DB
      this.getListOfExercisesTableRecords();
  }

  getListOfExercisesTableRecords = () => {
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





  /*addExercise = (name) => {
    db.transaction(tx => {
      tx.executeSql(
        this.sqlAddRecordToTable(name)
        );
      }, 
      ()=>{console.log("Error")}, 
      ()=>{console.log("Success")}
    );
  }*/


  // Basic DB Operations for Testing
  //sqlCreateExercisesTable(){return 'create table if not exists books(id integer primary key not null, name text not null);';}
  //sqlAddRecordToTable(name){return 'insert into books(name) values(\"' + name + '\");'}
  //sqlSelectFromTable(){return 'select * from books;'}

  // Actual DB Operations for Production
  queryListOfExercisesTableRecords(){
    return 'SELECT * FROM EXERCISES4';
  }



addExerciseToTable = () => {
  // Insert Record at Load
  let record = {
    name: this.state.name,
    type: this.state.type,
    time: this.state.time,
    description: this.state.description,
    reps: this.state.reps,
    weight: this.state.weight,
    day: this.state.day,
    parent: 123456
  } 

  let record_query = this.queryRecordToExercisesTable(record);
  db.transaction(tx => {
    tx.executeSql(
      record_query
      );
    }, ()=>{console.log("Error on INSERT")}, 
    ()=>{console.log("Success on INSERT")});
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

    let query = 'INSERT INTO EXERCISES4(name, description, type, time, reps, weight, days, parent) values(\"' + 
            name   + '\", \"' + description + '\", \"' + type + '\", ' + time + ', ' + reps + ', ' + 
            weight + ', \"'   + days        + '\", '   + parent        + ');';
    console.log("INSERT QUERY:" + query);
    return query;
  }

  queryCreateExercisesTables(){
    let query = 'CREATE TABLE IF NOT EXISTS EXERCISES4(' + 
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

  render() {

    let exercises = [];
    for (let i=6; i < 20; i++){
      exercises[i] = {name: "Exercise " + i};
    }


    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    /*this.state = {
      //dataSource: ds.cloneWithRows([{name: "Abs", time: 45}, {name: "Flutters", time: 60}])
    };*/

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <ListView
            enableEmptySections={true}
            style={styles.container}
            dataSource={this.state.dataSource}
            renderRow={(data) => <ExerciseItem name={data.name} time={data.time}/>}
          />
        </ScrollView>
        <Button title="Add Activity" onPress={()=>{this.setModalVisible(true)}} color="#841584"/>

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
                    onChangeText={(name)=>{this.setState({name})}} 
                    text={this.state.name}
                    placeholder='Name'/>
                </View>
              </View>

              {/*<CustomTextInput defaultValue='CustomTextInput'/>*/}

              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(description)=>{this.setState({description})}} 
                    text={this.state.description}
                    placeholder='Description'/>
                </View>
              </View>

              {/*DaysSelector()*/}

              <Picker 
                selectedValue={this.state.day}
                onValueChange={(day, itemIndex) =>
                  this.setState({day})}
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
                selectedValue={this.state.type}
                onValueChange={(type, itemIndex) =>
                  this.setState({type})}
                >
                <Picker.Item label='Timed' value='time'/>
                <Picker.Item label='Weights' value='weight'/>
              </Picker>


              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(time)=>{this.setState({time})}} text={this.state.time}
                    editable={(this.state.type == 'time')}
                    placeholder='Time'/>
                </View>
              </View>
              
              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(reps)=>{this.setState({reps})}} text={this.state.reps}
                    editable={(this.state.type == 'weight')}
                    placeholder='Reps'/>
                </View>
              </View>
              
              <View style={styles.modalRow}>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputTex} 
                    onChangeText={(weight)=>{this.setState({weight})}} text={this.state.weight}
                    editable={(this.state.type == 'weight')}
                    placeholder='Weight (Lb)'/>
                </View>
              </View>


              <View style={styles.modalRow}>
                <View style={styles.buttonView}>
                    <TouchableHighlight
                      onPress={() => {
                        console.log("Name: " + this.state.name);
                        this.addExerciseToTable();
                        this.getListOfExercisesTableRecords();
                        this.setModalVisible(!this.state.modalVisible);
                        //this.addExercise('New Book');
                      }}>
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                        //this.addExercise('New Book');
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

const DaysSelector = () => {
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
          <Text style={styles.dayText}>Sun</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
         <Text style={styles.dayText}>Mon</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
         <Text style={styles.dayText}>Tue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
         <Text style={styles.dayText}>Wed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
          <Text style={styles.dayText}>Thu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
          <Text style={styles.dayText}>Fri</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayBox}>
        <TouchableOpacity onPress={()=>{console.log("Pressed")}}>
          <Text style={styles.dayText}>Sat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  largeText: {
    fontSize: 24,
    paddingTop: 20,
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
