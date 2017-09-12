import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  CameraRoll,
  StyleSheet
} from "react-native";

import PhotoList from "../PhotoList/PhotoList";

export default class DocUp extends Component {
  constructor() {
    super();
    this.state = {
      photoArray: null
    };
  }
  static navigationOptions = {
    title: "Document Upload",
    header: null
  };

  componentDidMount() {
    this.getPhotos();
  }

  getPhotos() {
    CameraRoll.getPhotos({ first: 1000 }).then(res => {
      photoArray = res.edges;
      this.setState({
        photoArray
      });
    });
  }

  render() {
    if (this.state.photoArray) {
      const mappedPhotos = this.state.photoArray.map((photo, i) => {
        console.log("in map", photo.node);
        return (
          <PhotoList key={photo.node.timestamp} image={photo.node.image.uri} />
        );
      });

      return <FlatList>{mappedPhotos}</FlatList>;
    }
    return <Text> no photos </Text>;
  }
}

const styles = StyleSheet.create({});

AppRegistry.registerComponent("DocUp", () => DocUp);
