import {Box, Text, VStack} from '@gluestack-ui/themed';
import Video, {VideoRef} from 'react-native-video';
import {Dimensions, StyleSheet} from 'react-native';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setIsFullScreenVideoPlayer} from '../../app/reducers/liveStreamStore';
import {useIsFocused} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';

export const Player = props => {
  const {url = ''} = props;
  const videoRef = React.useRef(null);
  // const [width, setwidth] = React.useState(0);
  const [paused, setPaused] = React.useState(true);
  const isFullScreenVideoPlayer = useSelector(
    state => state.liveStreamStore.isFullScreenVideoPlayer,
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const drawerStatus = useDrawerStatus();

  // React.useEffect(() => {
  //   if (isFocused) {
  //     setPaused(false);
  //   } else {
  //     setPaused(true);
  //   }
  // }, [isFocused]);

  // const pausedVideo = React.useMemo(() => {
  //   const isDrawerOpen = drawerStatus === 'open';
  //   if (isDrawerOpen) return false;
  //   return isFocused;
  // }, [isFocused, drawerStatus]);

  const presentFullscreen = () => {
    console.log('presentFullscreen');
    videoRef.current.player.ref.presentFullscreenPlayer();
    dispatch(setIsFullScreenVideoPlayer(true));
  };
  const exitFullscreen = () => {
    console.log('exitFullscreen');
    videoRef.current.player.ref.dismissFullscreenPlayer();
    dispatch(setIsFullScreenVideoPlayer(false));
  };

  const onError = error => {
    // videoRef.current.player.ref.dismissFullscreenPlayer();
    console.log(error);
  };

  return (
    <Video
      source={{uri: url}}
      style={{flex: 1}}
      onError={onError}
      controls={true}
      paused={!isFocused}
    />
  );
};
