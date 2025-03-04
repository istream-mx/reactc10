import * as React from 'react';
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
// import {CardNew} from '../lib/components/CardNew';
import {SingleHeader} from '../lib/components/SingleHeader';
import {InfoIcon, MinusIcon, PlusIcon} from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import {get} from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import {ActivityIndicator, Share, useWindowDimensions} from 'react-native';
import {ImageNew, ImageNewComponent} from '../lib/components/ImageNew';
import {youtube_parser} from '../utils/common';
import {getYoutubeMeta} from 'react-native-youtube-iframe';
import {URL_SHARE_NOTES} from '../environments';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  setCloseNotifiactionModal,
  setIsNotificationMode,
} from '../app/reducers/pushNotificationStore';

export const NewScreen = ({navigation}) => {
  const currentId = useSelector(state => state.newStore.newCurrentId);
  const isNotificationMode = useSelector(
    state => state.pushNotificationStore.isNotificationMode,
  );

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

  const onNotificationBack = async () => {
    await dispatch(setIsNotificationMode(false));
  };

  React.useEffect(() => {
    setHandlingData(true);
    fetchData();
  }, []);
  return (
    <Box flex={1}>
      <SingleHeader
        navigation={navigation}
        title={'Detalles'}
        isNotificationMode={isNotificationMode}
        onPressNotification={onNotificationBack}>
        <HStack
          justifyContent="flex-end"
          paddingHorizontal={'$3'}
          paddingTop={'$2'}>
          {listNews.length > 0 ? (
            <Text bold color="$white">{`${indexNote + 1} / ${
              listNews.length
            }`}</Text>
          ) : (
            <Box />
          )}
        </HStack>
      </SingleHeader>
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
          setCurrentIndexPage={setIndexNote}
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
    setCurrentIndexPage = () => {},
  } = props;

  const onPageScroll = e => {
    setCurrentIndexPage(e.nativeEvent.position);
  };
  return (
    <PagerView
      style={{
        flex: 1,
      }}
      onPageScroll={onPageScroll}
      scrollEnabled={true}
      initialPage={0}>
      {listNews.map((note, index) => (
        <VStack
          key={index}
          flex={1}
          sx={{
            _light: {bg: '$white'},
            _dark: {bg: '$backgroundDark800'},
          }}>
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
    let video = get(note, 'url_video', '');
    if (video != '' && video != null) {
      let videoUrls = youtube_parser(video);
      fetchMetadataYoutube(videoUrls);
      //   console.log(videoMetadata);
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
  const tagsStyles = {
    body: {
      fontSize: fontSizeTexts,
      color: 'black',
      textAlign: 'justify',
    },
    p: {
      fontSize: fontSizeTexts,
      color: 'black',
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
    let video = get(note, 'url_video', '');
    if (video != '' && video != null) {
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

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  return (
    <VStack
      flex={1}
      space="sm"
      paddingHorizontal={'$2'}
      paddingTop={'$2'}
      // shadowColor="#00000070"
      // elevation={5}
      // borderRadius={'$lg'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack borderLeftColor="#c80000" borderLeftWidth={'$8'}>
          <Text size="2xl" bold paddingTop={'$2'} paddingHorizontal={'$3'}>
            {note.title}
          </Text>
        </VStack>
        <VStack paddingVertical={'$2'}>
          <Text
            fontSize={fontSizeTexts}
            paddingHorizontal={'$3'}
            paddingTop={'$2'}
            opacity={'$60'}>
            {sourceName(note.source)}
          </Text>
          <Text
            fontSize={fontSizeTexts}
            paddingHorizontal={'$3'}
            paddingVertical={'$2'}
            fontStyle="italic">
            {formatDate(note.date)}
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

        <Box paddingHorizontal={'$3'}>
          <RenderHtml
            renderers={renderers}
            WebView={WebView}
            customHTMLElementModels={customHTMLElementModels}
            contentWidth={width}
            source={{html: `${note.body}`}}
            tagsStyles={tagsStyles}
            renderersProps={{
              iframe: {
                scalesPageToFit: true,
              },
            }}
          />
        </Box>
      </ScrollView>
    </VStack>
  );
};

const BottomMenuNote = props => {
  const {biggerText = () => {}, smallerText = () => {}, item = {}} = props;
  const insets = useSafeAreaInsets();

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
      paddingBottom={'$2'}
      pb={insets.bottom || '$2'}>
      <SizeTextButton icon={PlusIcon} onPress={biggerText} />
      <SizeTextButton icon={MinusIcon} onPress={smallerText} />
      <Button onPress={shareNew} variant="link" size="xl">
        <ButtonIcon as={ShareIcon} color="$white" size="xl" />
      </Button>
    </HStack>
  );
};
