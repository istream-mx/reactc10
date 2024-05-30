import {Box, Text, VStack} from '@gluestack-ui/themed';
import Video, {VideoRef} from 'react-native-video';
import {Dimensions, StyleSheet} from 'react-native';
import * as React from 'react';

export const VideoPlayer = props => {
  const {url = ''} = props;
  const videoRef = React.useRef(null);
  const [width, setwidth] = React.useState(0);
  const [height, setheight] = React.useState(0);

  React.useEffect(() => {
    if (width > height) {
      videoRef.current.presentFullscreenPlayer();
    } else {
      videoRef.current.dismissFullscreenPlayer();
    }
  }, [height, width]);

  React.useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      setwidth(width);
      setheight(height);
    });
  }, []);
  return (
    <Video
      source={{
        uri: url,
      }} // the video file
      paused={false} // make it start
      repeat={false}
      controls={true}
      ref={videoRef}
      controlsStyles={{
        hideSeekBar: true,
      }}
      fullscreenAutorotate={true}
      style={styles.vid}
    />
  );
};

const styles = StyleSheet.create({
  vid: {
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});
