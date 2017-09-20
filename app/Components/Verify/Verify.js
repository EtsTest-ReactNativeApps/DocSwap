import React, { Component } from "react";
import {
  AppRegistry,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { NavigationActions } from "react-navigation";

import Camera from "react-native-camera";
import Key from '../../../assets/key/key';
import RNFS from 'react-native-fs'

export default class TakePhoto extends Component {
  static navigationOptions = {
    title: "Verify",
    header: null
  };

  componentWillMount() {
    StatusBar.setHidden(true);
  }

  cleanData(data) {
    const cleanedData = JSON.parse(data._bodyText).responses[0].fullTextAnnotation.text;

    this.props.navigation.navigate('ImageResult', Object.assign({}, { path: cleanedData }, { homeKey: this.props.navigation.state.params.homeKey },{ cameraKey: this.props.navigation.state.key }))
  }

  usePhoto(imgPath) {

    fetch(`https://vision.googleapis.com/v1/images:annotate?key=${Key}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
              "requests": [
                {
              "image": {
                "content": imgPath
              },
              "features": [
              {
                "type": "DOCUMENT_TEXT_DETECTION"
              }
            ]
          }
        ]
      })
    })
    .then(data => this.cleanData(data))
    .catch(err => console.log('error ', err))

  }

  convertImg() {

    //from camera /Users/jbecks/Library/Developer/CoreSimulator/Devices/D9FE59D4-5706-4B0B-98D7-9D7B9519D18A/data/Containers/Data/Application/CCDC4308-F7FA-443A-B9B1-0DEBBDF93C01/Documents/24D6D353-B8FA-414F-ADEC-92B672FD056D.jpg

    //from cameraRoll assets-library://asset/asset.JPG?id=729F50DA-9627-42A9-802D-69B22C9EECD2&ext=JPG


    const imgPath = this.props.navigation.state.params.path

    RNFS.readFile(imgPath, 'base64')
      .then(imgString => this.usePhoto(imgString))
      .catch(err => console.log(err))
  }

  render() {

    const { state, goBack } = this.props.navigation;

    return (
      <View>
        <ImageBackground
          style={ styles.img }
          source={{
            uri: state.params.path
          }}>

          <View style={ styles.topBar } />

          <View style={ styles.bottomBar }> 

            <TouchableOpacity style={ [styles.goBackBtn, styles.Btn] } onPress={ () => goBack() }>
              <Image source={require("../../../assets/left-arrow.png")}
                  style={ styles.icon } />
              <Text style={ styles.btnTxt }>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ [styles.submitBtn, styles.Btn] } onPress={ this.convertImg.bind(this) }>
              <Image source={require("../../../assets/send.png")}
                    style={ styles.icon } />
              <Text style={ styles.btnTxt }>Use Photo</Text>
            </TouchableOpacity>
            
          </View>

        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },

  topBar: {
    backgroundColor: "rgba(0,0,0,1)",
    height: 20,
    width: "100%"
  },

  bottomBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    width: '100%'    
  },
  
  Btn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    marginTop: 10
  },

  goBackBtn: {
    marginLeft: 15
  },

  btnTxt: {
    color: 'white'
  },

  submitBtn: {
    marginRight: 15
  },

  icon: {
    height: 25,
    width: 25
  }
});

AppRegistry.registerComponent("TakePhoto", () => TakePhoto);