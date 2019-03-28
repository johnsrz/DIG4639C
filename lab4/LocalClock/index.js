import React, { Component } from "react";

import { Text, View, StyleSheet } from "react-native";

class LocalClock extends Component {

  constructor(props){
    super(props);
    this.state = {time: {hours: 0, minutes: 0, seconds: 0}};
  }

  getTime(){
    this.setState({time: {
      hours: new Date().getHours(), 
      minutes: new Date().getMinutes(), 
      seconds: new Date().getSeconds}});
  }

  componentDidMount(){
    this.interval = setInterval(() => this.getTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
   
    this.state = {time: {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds()
    }}
    return (
      <View style={styles.forecast}>
        <Text style={{ color: "#FFFFFF", fontSize: 72 }}>
          {this.state.time.hours}:{this.state.time.minutes}:{this.state.time.seconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({ forecast: { alignItems: "center" } });

export default LocalClock;
