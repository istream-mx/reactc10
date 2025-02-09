import {
  Box,
  Button,
  ButtonIcon,
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
import {Share2Icon, ShareIcon} from 'lucide-react-native';
import {Share} from 'react-native';
import {URL_SHARE_NOTES} from '../../environments';

export const CardNew = props => {
  const {item = {}, onPress = () => {}, navigation = {}} = props;

  const [videoMetadata, setVideoMetadata] = React.useState({});

  React.useEffect(() => {
    let video = get(item, 'url_video', '');
    if (video != '' && video != null) {
      let videoUrl = youtube_parser(video);
      fetchMetadataYoutube(videoUrl);
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

  const formatDate = date => {
    if (date !== '' && date != null) {
      let format = 'dddd D MMMM yyyy';
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
    let video = get(item, 'url_video', '');
    if (video != '' && video != null) {
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
    let video = get(item, 'url_video', '');
    if (video != '' && video != null) {
      navigation.navigate('VideoModal', {video: videoMetadata});
    } else {
      onPress();
    }
  };

  const shareNew = async () => {
    let noteInfo = `${item.source.slug}/${item.slug_name}`;
    try {
      const result = await Share.share({
        message: `${URL_SHARE_NOTES}${noteInfo}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <VStack
      space="sm"
      // shadowColor="#00000070"
      // elevation={8}
      borderRadius={'$lg'}
      // padding={'$1'}
      sx={{
        _light: {bg: '$white'},
        _dark: {bg: '$backgroundDark800'},
      }}>
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
          <VStack borderLeftColor="#c80000" borderLeftWidth={'$8'}>
            <Text flex={1} size="xl" bold paddingHorizontal={'$3'}>
              {item.title}
            </Text>
          </VStack>

          <Text
            flex={1}
            size="sm"
            paddingHorizontal={'$3'}
            paddingTop={'$1'}
            opacity={'$60'}>
            {sourceName(item.source)}
          </Text>
          <Text
            flex={1}
            size="sm"
            paddingHorizontal={'$3'}
            paddingTop={'$1'}
            fontStyle="italic">
            {formatDate(item.date)}
          </Text>
          <HStack justifyContent="flex-end" paddingHorizontal={'$4'}>
            <Button onPress={shareNew} variant="link" size="xl">
              <ButtonIcon as={Share2Icon} p={'$4'} color="$red700" />
            </Button>
          </HStack>
        </VStack>
      </Pressable>
    </VStack>
  );
};
