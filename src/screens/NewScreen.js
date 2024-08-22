import * as React from 'react';
// import {AppBar} from '../lib/components/AppBar';
import {
  Box,
  Text,
  FlatList,
  HStack,
  VStack,
  ButtonIcon,
  Button,
  ButtonText,
  ShareIcon,
  Image,
  ScrollView,
} from '@gluestack-ui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {fetchNewById, fetchNewsData} from '../app/reducers/newStore';
import {CardNew} from '../lib/components/CardNew';
import {SingleHeader} from '../lib/components/SingleHeader';
import {InfoIcon, MinusIcon, PlusIcon} from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import {get} from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import RenderHtml from 'react-native-render-html';
import {ActivityIndicator, Share, useWindowDimensions} from 'react-native';
import {ImageNew, ImageNewComponent} from '../lib/components/ImageNew';
import {youtube_parser} from '../utils/common';
import {getYoutubeMeta} from 'react-native-youtube-iframe';
import { URL_SHARE_NOTES } from '../environments';

export const NewScreen = ({navigation}) => {
  const currentId = useSelector(state => state.newStore.newCurrentId);
  //   const currentId = 2;

  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [handlingData, setHandlingData] = React.useState(true);
  const [listNews, setListNews] = React.useState([]);
  const [textSize, setTextSize] = React.useState(16);
  const [indexNote, setIndexNote] = React.useState(0);

  const fetchNewsBySlugSource = React.useCallback(
    async currentNew => {
      await dispatch(
        fetchNewsData({
          filter: {
            source_slug: currentNew.source.slug,
            publish_movil: true,
            publish_date_movil: true,
            pagination: {
              size: '10',
              page: '1',
            },
          },
        }),
      )
        .then(response => {
          let unique_notes = [];
          response.payload.forEach(note => {
            if (note.id != currentNew.id) {
              unique_notes.push(note);
            }
          });
          unique_notes.splice(0, 0, currentNew);
          setListNews(unique_notes);

          setHandlingData(false);
        })
        .catch(error => {
          console.log({error});

          setHandlingData(false);
        });
    },
    [dispatch],
  );

  const fetchData = React.useCallback(async () => {
    await dispatch(
      fetchNewById({
        id: currentId,
      }),
    )
      .then(response => {
        // console.log(response);
        fetchNewsBySlugSource(response.payload);
      })
      .catch(_error => {
        setHandlingData(false);
      });
  }, [dispatch]);

  const biggerText = () => {
    if (textSize < 32) {
      setTextSize(textSize + 2.0);
    }
  };

  const smallerText = () => {
    if (textSize > 16) {
      setTextSize(textSize - 2.0);
    }
  };

  React.useEffect(() => {
    setHandlingData(true);
    fetchData();
  }, []);

  return (
    <Box flex={1}>
      <SingleHeader navigation={navigation} title={'Detalles'} />
      {handlingData ? (
        <VStack justifyContent="center" flex={1}>
          <ActivityIndicator size="large" color={'#c80000'} />
        </VStack>
      ) : (
        <PageContent
          listNews={listNews}
          fontSizeTexts={textSize}
          navigation={navigation}
          setIndexNote={setIndexNote}
          biggerText={biggerText}
          smallerText={smallerText}
        />
      )}
    </Box>
  );
};

const SizeTextButton = props => {
  const {onPress = () => {}, icon = InfoIcon} = props;

  return (
    <Button onPress={onPress} variant="link" size="xl">
      <ButtonIcon as={icon} color="$white" size="xl" />
      <ButtonText color="$white">A</ButtonText>
    </Button>
  );
};

const PageContent = props => {
  const {
    listNews = [],
    fontSizeTexts = 16,
    navigation = {},
    biggerText = () => {},
    smallerText = () => {},
  } = props;
  return (
    <PagerView
      style={{
        flex: 1,
      }}
      scrollEnabled={true}
      initialPage={0}>
      {listNews.map((note, index) => (
        <VStack key={index} flex={1}>
          <CardView
            note={note}
            fontSizeTexts={fontSizeTexts}
            navigation={navigation}
          />
          <BottomMenuNote
            item={note}
            biggerText={biggerText}
            smallerText={smallerText}
          />
        </VStack>
      ))}
    </PagerView>
  );
};

const CardView = props => {
  const {note = {}, fontSizeTexts = 16, navigation = {}} = props;
  const {width, height} = useWindowDimensions();
  const [videoMetadata, setVideoMetadata] = React.useState({});

  React.useEffect(() => {
    let videos = get(note, 'videos', []);
    if (videos.length > 0) {
      let videoUrls = videos.map(v => youtube_parser(v.url));
      fetchMetadataYoutube(videoUrls[0]);
      //   console.log(videoMetadata);
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
  const tagsStyles = {
    body: {
      fontSize: fontSizeTexts,
    },
    p: {
      fontSize: fontSizeTexts,
    },
  };

  const firstImage = () => {
    let images = get(note, 'images', []);
    if (images.length > 0) {
      return images[0].url;
    } else {
      return '';
    }
  };
  const hasVideo = () => {
    let videos = get(note, 'videos', []);
    if (videos.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const numberImages = () => {
    let images = get(note, 'images', []);
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
    let images = get(note, 'images', []);
    let videos = get(note, 'videos', []);
    if (videos.length == 0) {
      navigation.navigate('GalleryModal', {images: images});
    } else {
      navigation.navigate('VideoModal', {video: videoMetadata});
    }
  };

  return (
    <VStack
      flex={1}
      space="sm"
      shadowColor="#00000070"
      elevation={5}
      borderRadius={'$lg'}
      padding={'$1'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          size="2xl"
          bold
          borderLeftColor="#c80000"
          borderLeftWidth={'$8'}
          paddingHorizontal={'$3'}
          paddingTop={'$2'}>
          {note.title}
        </Text>
        <VStack>
          <Text
            fontSize={fontSizeTexts}
            paddingHorizontal={'$3'}
            paddingTop={'$2'}>
            {sourceName(note.source)}
          </Text>
          <Text
            fontSize={fontSizeTexts}
            paddingHorizontal={'$3'}
            paddingVertical={'$2'}>
            {formatScheduleDate(note.publish_date)}
          </Text>
        </VStack>

        {firstImage() != '' && (
          <ImageNewComponent
            url={firstImage()}
            showVideoIcon={hasVideo()}
            collageMode={true}
            numberImages={numberImages()}
            onPress={onPressImageByHasVideo}
          />
        )}

        {/* <FlatList
          data={note.images}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <Image
              key={index}
              source={{uri: item.url}}
              alt="newImg"
              width={width}
              height={height / 3}
              resizeMode="cover"
            />
          )}
          keyExtractor={(_item, index) => `${index}-img`}
        /> */}

        <Box paddingHorizontal={'$3'}>
          <RenderHtml
            contentWidth={width}
            source={{html: `${note.body}`}}
            tagsStyles={tagsStyles}
          />
        </Box>
      </ScrollView>
    </VStack>
  );
};

const BottomMenuNote = props => {
  const {biggerText = () => {}, smallerText = () => {}, item = {}} = props;

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
      console.log(error);
    }
  };

  return (
    <HStack
      justifyContent="space-around"
      paddingHorizontal={'$4'}
      backgroundColor="$black"
      paddingBottom={'$2'}>
      <SizeTextButton icon={PlusIcon} onPress={biggerText} />
      <SizeTextButton icon={MinusIcon} onPress={smallerText} />
      <Button onPress={shareNew} variant="link" size="xl">
        <ButtonIcon as={ShareIcon} color="$white" size="xl" />
      </Button>
    </HStack>
  );
};
