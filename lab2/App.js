import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Button } from 'react-native';

function validateName(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 64 && code <  91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) && // lower alpha (a-z)
        !(code == 32)) { // Space
      return false;
    }
  }
  return true;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text:''};
    this.state = {message:''};
    this.state = {style: ''};
    this.state = {valid: false};
    this.onPress = this.onPress.bind(this);
  }
  onChange(event) {
    console.log(event);
  }
  
  onPress() {
    if (validateName(this.state.text)) {
      message = this.state.text;
      this.setState({message});
      this.setState({style: styles.text});
      this.setState({valid: true});
    }
    else {
      message = this.state.text + ' is not a valid name';
      this.setState({message});
      this.setState({style: styles.textError});
    }

    console.log("Pressed");
  }
  render() {
    return (
      <View style={styles.container} flexDirection="column" alignItems='stretch'>
        <View><TextInput style={(this.state.valid)?styles.compHidden:styles.textInput} onChangeText={(text) => this.setState({text})} placeholder="Enter your name"></TextInput></View>
        <Text style = {this.state.style}>{this.state.message}</Text> 
        <TouchableOpacity style={(this.state.valid)?styles.compHidden:styles.buttonStyle} onPress={this.onPress}><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText:
  {
    color:"white",
    fontSize:40
  },
  buttonStyle:
  {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'blue',
    height:75,
    margin:30,
  },
  textInput:
  {
    margin:30,
    height:75,
    fontSize:20
  },
  defaultText:
  {
    fontSize:20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:
  {
    margin:30,
    height:75,
    fontSize:20,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  textError:
  {
    margin:30,
    height:75,
    fontSize:20, 
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  compHidden:
  {
    display: 'none',
  }
});
