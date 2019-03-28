import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage
} from "react-native";
import Button from "./Button";
import * as Expo from "expo";
import Forecast from "./Forecast";
import LocalClock from "./LocalClock";
import LocationButton from "./LocationButton";
import textStyles from "./styles/typography.js";

const STORAGE_KEY = "@SmarterWeather:zip";

import OpenWeatherMap from "./open_weather_map";

// This version uses flowers.png from local assets
//import PhotoBackdrop from "./PhotoBackdrop/local_image";

// This version pulls a specified photo from the camera roll
import PhotoBackdrop from './PhotoBackdrop/local_image';
import SettingsButton from "./SettingsButton";
//import { constants } from "os";

class WeatherProject extends Component {
  constructor(props) {
    super(props);
    //this.state = { location: null };
    this.state = { location: null, forecast: null, initialPosition: null, locationFetched: false};
    //this.state = { location: null };
  }

  checkMultiPermissions = async() => {
    const { Permissions, FileSystem } = Expo;
    console.log(FileSystem.documentDirectory);
    let { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
      console.log('Hey! You heve not enabled selected permissions');
      const { newStatus, expires, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      status = newStatus;
    }
    if(status === 'granted') {
        console.log("Granted!");
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
        })

        console.log(result);
          if (!result.cancelled) {
            console.log(this);
            console.log("Accepted!");
            this.setState({ newPostImage:result.uri, createPostModalVisible: true })
            FileSystem.copyAsync({from:result.uri,to:FileSystem.documentDirectory+"myimage.jpg"})
            .then(() => console.log("Moved to location"));
            try {
              await AsyncStorage.setItem('@MySuperStore:key', result.uri)
              .then(() => console.log("Saved selection to disk: " + result.uri))
              .catch(error => console.error("AsyncStorage error: " + error.message))
              .done();
              console.log("saved");
              this._retrieveData();
            } catch (error) {
              // Error saving data
            }
          }
      }
      
  }      
  _retrieveData = async () => {
      console.log("Retrieving Data");
        try {
          const value = await AsyncStorage.getItem('@MySuperStore:key');
          if (value !== null) {
            // We have data!!
            console.log("Got data");
            console.log(value);
            this.setState({ newPostImage:value, createPostModalVisible: true })
          } else {
            console.log("No data");
          }
      } catch (error) {
          console.log(error);
          // Error retrieving data
      }
    }


    _setCoordinatesInState(initialPosition) {
      this.setState({initialPosition});
    } 

    _getCurrentPositionAsync = async () => {
      return navigator.geolocation.getCurrentPosition(initialPosition => {
          this.setState({initialPosition});
          this.setState({locationFetched: true});
          console.log("State Latitude: " + this.state.initialPosition.coords.latitude);
          console.log("State Longitude: " + this.state.initialPosition.coords.longitude);
        }
      );
    }
  

  componentDidMount = async () => {
    AsyncStorage
      .getItem(STORAGE_KEY)
      .then(value => {
        if (value !== null) {
          this._getForecastForZip(value);
        }
      })
      .catch(error => console.error("AsyncStorage error: " + error.message))
      .done();
      this._retrieveData();

      // Get Position at Launch
      console.log("Getting initial position at launch");
      let initPost = this._getCurrentPositionAsync();
      // Get Forecast for Initial Position, async/promise??
      console.log("Getting Forecast for initial position");
      this._getCurrentPositionAsync_1();
  }




  _getCurrentPositionAsync_1(){
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(initialPosition => {
        this.setState({initialPosition});
      });


    })
  }

  _asyncWaitForPosition = async () => {
    result = await _getCurrentPositionAsync_1();
  }







  _getForecastForZip = zip => {
    // Store zip code
    AsyncStorage
      .setItem(STORAGE_KEY, zip)
      .then(() => console.log("Saved selection to disk: " + zip))
      .catch(error => console.error("AsyncStorage error: " + error.message))
      .done();

    OpenWeatherMap.fetchZipForecast(zip).then(forecast => {
      this.setState({ forecast: forecast });
    });
  };

  _getForecastForCoords = (lat, lon) => {
    OpenWeatherMap.fetchLatLonForecast(lat, lon)
      .then(forecast => {
        this.setState({ forecast: forecast });
    });
  };

  _handleTextChange = event => {
    let zip = event.nativeEvent.text;
    this._getForecastForZip(zip);
  };

  render() {
    let content = null;
    console.log("Rendered" + this.state.newPostImage);
    if (this.state.forecast !== null) {
      content = (
        <View style={styles.row}>
          <Forecast
            main={this.state.forecast.main}
            temp={this.state.forecast.temp}
            units='F'
          />
        </View>
      );
    }

    let localTime = null;
    if (this.state.initialPosition !== null) {
      localTime = (
        <View style={styles.row}>
          <LocalClock
            //main={this.state.forecast.main}
            //temp={this.state.forecast.temp}
          />
        </View>
      );
    }



    return (
      <PhotoBackdrop image={this.state.newPostImage} >
        <View style={styles.overlay}>
          <View style={styles.row}>
            <Text style={textStyles.mainText}>
              Forecast for
            </Text>

            <View style={styles.zipContainer}>
              <TextInput
                style={[textStyles.mainText, styles.zipCode]}
                onSubmitEditing={this._handleTextChange}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <View style={styles.row}>
            <LocationButton onGetCoords={this._getForecastForCoords} />
          </View>
          <View style={styles.row}>
            <Button onPress={this.checkMultiPermissions} label="Choose Image"></Button>
          </View>
          {content}
          {localTime}
          

        </View>
        <View style={styles.overlay}>
          <View style={styles.row}>
           <SettingsButton onPress={this.checkMultiPermissions} label="Settings"></SettingsButton>
          </View>
        </View>
      </PhotoBackdrop>
    );
  }
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: "rgba(0,0,0,0.1)" },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  zipContainer: {
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    marginLeft: 5,
    marginTop: 3,
    width: 80,
    height: textStyles.baseFontSize * 2,
    justifyContent: "flex-end"
  },
  zipCode: { flex: 1 }
});

export default WeatherProject;
