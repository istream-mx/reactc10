import {
  Box,
  FlatList,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import moment from 'moment';
import * as React from 'react';
import {get} from 'lodash';
import 'moment/locale/es';
import {ImageNewComponent} from './ImageNew';
import {getYoutubeMeta} from 'react-native-youtube-iframe';
import {youtube_parser} from '../../utils/common';

export const CardNew = props => {
  const {item = {}, onPress = () => {}} = props;

  const [videoMetadata, setVideoMetadata] = React.useState({});

  React.useEffect(() => {
    let videos = get(item, 'videos', []);
    if (videos.length > 0) {
      let videoUrls = videos.map(v => youtube_parser(v.url));
      fetchMetadataYoutube(videoUrls[0]);
    }
  }, []);

  const firstImage = React.useMemo(() => {
    let images = get(item, 'images', []);
    if (images.length > 0) {
      return images[0].url;
    } else {
      return '';
    }
  }, []);

  const formatScheduleDate = date => {
    if (date !== '' && date != null) {
      let format = 'dddd D MMMM yyyy, h:mm a';
      moment.locale('es');
      return moment(date).format(format);
    } else {
      return '';
    }
  };

  const sourceName = source => {
    let sourceName = get(source, 'name', null);
    if (sourceName) {
      return sourceName;
    } else {
      return '';
    }
  };
  const hasVideo = () => {
    let videos = get(item, 'videos', []);
    if (videos.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const numberImages = () => {
    let images = get(item, 'images', []);
    return images.length;
  };

  const fetchMetadataYoutube = async videoId => {
    try {
      const videoMeta = await getYoutubeMeta(videoId);

      setVideoMetadata({id: videoId, meta: videoMeta});
    } catch (_error) {
      setVideoMetadata({});
    }
  };
  const onPressImageByHasVideo = () => {
    let images = get(item, 'images', []);
    let videos = get(item, 'videos', []);
    if (videos.length > 0) {
      navigation.navigate('VideoModal', {video: videoMetadata});
    } else {
      onPress();
    }
  };
  return (
    <VStack
      space="sm"
      shadowColor="#00000070"
      elevation={5}
      borderRadius={'$lg'}
      padding={'$1'}>
      <Pressable onPress={onPressImageByHasVideo}>
        <ImageNewComponent
          url={firstImage}
          showVideoIcon={hasVideo()}
          numberImages={numberImages()}
          onPress={onPressImageByHasVideo}
        />
      </Pressable>
      <Pressable onPress={onPress}>
        <VStack space="sm">
          <Text
            flex={1}
            size="xl"
            bold
            borderLeftColor="#c80000"
            borderLeftWidth={'$8'}
            paddingHorizontal={'$3'}>
            {item.title}
          </Text>
          <Text flex={1} size="md" paddingHorizontal={'$3'} paddingTop={'$1'}>
            {sourceName(item.source)}
          </Text>
          <Text
            flex={1}
            size="md"
            paddingHorizontal={'$3'}
            paddingVertical={'$2'}>
            {formatScheduleDate(item.publish_date)}
          </Text>
        </VStack>
      </Pressable>
    </VStack>
  );
};
