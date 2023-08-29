import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform
 } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import PropTypes from 'prop-types';

 
class ImageLoaderBase64 extends Component {
  static propTypes = {
    isShowActivity: PropTypes.bool,
  };

  static defaultProps = {
    isShowActivity: true,
	};

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isError: false,
      image:""
    };
  }

  componentDidMount(){
    this.fetchImage(this.props.source);
  }

  componentWillReceiveProps(props){
    if(this.props.source!=props.source){
      this.fetchImage(props.source);
    }
  }

  fetchImage(uri){
    RNFetchBlob.config({
      fileCache: true
    })
    .fetch("GET", uri)
    // the image is now dowloaded to device's storage
    .then(resp => {
      // the image path you can use it directly with Image component
      imagePath = resp.path();
      // console.log(imagePath);
      // return resp.readFile("base64");
      this.setState({
        isLoaded: true,
        image:{ uri : Platform.OS === 'android' ? 'file://' + resp.path() : '' + resp.path() }
      });
    })
    // .then(base64Data => {
    //   // here's base64 encoded image
    //   console.log(base64Data);
    //   this.setState({
    //     isLoaded: true,
    //     image:'data:image/png;base64,'+ base64Data
    //   });
    //   // remove the file from storage
    //   return fs.unlink(imagePath);
    // })
    .catch((err) => {
      this.setState({
        isError: true
      });
    });
  }

  render() {
    const {
      style, source, resizeMode, borderRadius, backgroundColor, children,
      loadingStyle, placeholderSource, placeholderStyle,
      customImagePlaceholderDefaultStyle, imageStyle
    } = this.props;
    return(
      <View
        // onLoadEnd={this.onLoadEnd.bind(this)}
        // onError={this.onError.bind(this)}
        style={[styles.backgroundImage, style]}
        // source={source}
        // resizeMode={resizeMode}
        // borderRadius={borderRadius}
      >
        {
          (this.state.isLoaded && !this.state.isError)
          ?
            <Image
              style={[imageStyle]}
              source={this.state.image}
              resizeMode={this.props.resizeMode || 'cover'}
            >
            </Image>
          :
          <View 
            style={[styles.viewImageStyles, { borderRadius: borderRadius }, backgroundColor ? { backgroundColor: backgroundColor } : {}]}
          >
            {
              (this.props.isShowActivity && !this.state.isError) &&
              <ActivityIndicator
                style={styles.activityIndicator}
                size={loadingStyle ? loadingStyle.size : 'small'}
                color={loadingStyle ? loadingStyle.color : 'gray'}
              />
            }
            <Image
              style={placeholderStyle ? placeholderStyle : [styles.imagePlaceholderStyles, customImagePlaceholderDefaultStyle]}
              source={placeholderSource}
              resizeMode={this.props.resizeMode || 'cover'}
            >
            </Image>
          </View>
        }
        {
          this.props.children &&
          <View style={styles.viewChildrenStyles}>
          {
            this.props.children
          }
          </View>
        }
      </View>
    );
  }
}

const styles = {
  backgroundImage: {
    position: 'relative',
  },
  activityIndicator: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9,
  },
  viewImageStyles: {
    flex: 1,
    backgroundColor: '#e9eef1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholderStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewChildrenStyles: {
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'transparent'
  }
}
 
export default ImageLoaderBase64;