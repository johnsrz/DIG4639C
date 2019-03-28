import React, { Component } from "react";

import { Text, View, StyleSheet } from "react-native";

class Forecast extends Component {
  render() {
    let temperature = null;
    if (this.props.units == 'C'){
      temperature = (this.props.temp - 32)*(4/9);
    } else if (this.props.units == 'F'){
      temperature = this.props.temp;
    }
    return (
      <View style={styles.forecast}>
        <Text style={{ color: "#FFFFFF", fontSize: 72 }}>
          {temperature}°{this.props.units}
        </Text>
        <Text style={{ color: "#FFFFFF", fontSize: 32 }}>
          {this.props.main}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({ forecast: { alignItems: "center" } });

export default Forecast;
