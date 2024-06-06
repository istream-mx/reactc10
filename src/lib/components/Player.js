import {Box, Text, VStack} from '@gluestack-ui/themed';
import Video, {VideoRef} from 'react-native-video';
import {Dimensions, StyleSheet} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setIsFullScreenVideoPlayer} from '../../app/reducers/liveStreamStore';

export const Player = props => {
  const {url = ''} = props;
  const videoRef = React.useRef(null);
  const [width, setwidth] = React.useState(0);
  const [height, setheight] = React.useState(0);
  const isFullScreenVideoPlayer = useSelector(
    state => state.liveStreamStore.isFullScreenVideoPlayer,
  );
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   setheight(Dimensions.get('window').height);
  // }, []);

  // React.useEffect(() => {
  //   Dimensions.addEventListener('change', ({window: {width, height}}) => {
  //     setwidth(width);
  //     setheight(height);
  //   });
  // }, []);
  // React.useEffect(() => {
  //   if (width > height) {
  //     videoRef.current.presentFullscreenPlayer();
  //   } else {
  //     videoRef.current.dismissFullscreenPlayer();
  //   }
  // }, [height, width]);
  // console.log(videoRef.current?.player.ref);

  const presentFullscreen = () => {
    // videoRef.current.player.ref.presentFullscreenPlayer();
    dispatch(setIsFullScreenVideoPlayer(true));
  };
  const exitFullscreen = () => {
    // videoRef.current.player.ref.dismissFullscreenPlayer();
    dispatch(setIsFullScreenVideoPlayer(false));
  };
  return (
    // <Box width={'$full'} height={isFullScreenVideoPlayer ? height : height / 3}>
    <VideoPlayer
      source={{
        uri: url,
      }} // the video file
      paused={false} // make it start
      repeat={false}
      controls={false}
      ref={videoRef}
      // resizeMode={'contain'}
      disableTimer={true}
      disableBack={true}
      disableVolume={true}
      disableSeekbar={true}
      toggleResizeModeOnFullscreen={false}
      onEnterFullscreen={presentFullscreen}
      onExitFullscreen={exitFullscreen}
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

// const styles = StyleSheet.create({
//   vid: {
//     width: '100%',
//     height: '100%',
//   },
// });
