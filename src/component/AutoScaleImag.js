import React from "react";
import { Image as RNImage } from "react-native";

export default class Image extends React.Component {

  state = {
    aspectRatio: 0
  }

  setAspectRatio(ratio) {
    this.setState({
      aspectRatio: ratio
    });
  }

  componentWillMount() {
    if (Array.isArray(this.props.source)) {
      console.warn("ScaledImage received an array as source instead of local file resource or ImageURISource.")
    } else if(typeof this.props.source === "number") {
      // Resolve local file resource
      const resolved = RNImage.resolveAssetSource(this.props.source);

      // We assume 100% width, so we set the aspect ratio we want for it's height
      this.setAspectRatio(resolved.width / resolved.height);

    } else if (this.props.source.uri) {
      // Resolve remote resource
      RNImage.getSize(this.props.source.uri, (width, height) => {
         this.setAspectRatio( width / height);
      }, (err) => {
        console.error(err);
      });

    } else {
      console.warn("ScaledImage did not receive a valid source uri.");
    }
  }

  render() {
    if(!this.state.aspectRatio) return null;

    const props = {
      ...this.props,
      style: [this.props.style, {
        aspectRatio: this.state.aspectRatio
      }]
    };

    return (
      <RNImage {...props} />
    )
  }
}