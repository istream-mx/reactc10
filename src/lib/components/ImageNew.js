import {
  Box,
  FlatList,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
  Button,
  ButtonIcon,
  Icon,
} from '@gluestack-ui/themed';
import {
  ArrowLeft,
  ExpandIcon,
  ImageIcon,
  MapPin,
  PlayCircleIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {ImageBackground, useWindowDimensions} from 'react-native';

export const ImageNewComponent = props => {
  const {
    url = '',
    collageMode = false,
    showVideoIcon = false,
    numberImages = 0,
    onPress = () => {},
  } = props;

  return (
    <Pressable onPress={onPress}>
      {url != '' ? (
        <ImageComponentByType
          url={url}
          collageMode={collageMode}
          showVideoIcon={showVideoIcon}
          numberImages={numberImages}
          onPress={onPress}
        />
      ) : (
        <Box></Box>
      )}
    </Pressable>
  );
};
const ImageComponentByType = props => {
  const {width, height} = useWindowDimensions();

  const {
    url = '',
    collageMode = false,
    showVideoIcon = false,
    numberImages = 0,
    onPress = () => {},
  } = props;
  return (
    <Box>
      {showVideoIcon ? (
        <ImageBackground
          source={{uri: url}}
          resizeMode="cover"
          style={{height: height / 3, width: '100%'}}>
          <Box
            flex={1}
            justifyContent="center"
            width={'100%'}
            padding={'$3'}
            style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <Icon
              as={PlayCircleIcon}
              color="$white"
              alignSelf="center"
              p={'$10'}
              opacity={'$80'}
            />
          </Box>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={{uri: url}}
          resizeMode="cover"
          style={{height: height / 3, width: '100%'}}>
          <Box
            flex={1}
            justifyContent="flex-end"
            width={'100%'}
            padding={'$3'}
            style={{
              backgroundColor: collageMode
                ? 'rgba(0,0,0,0.3)'
                : 'rgba(0,0,0,0.0)',
            }}>
            <VStack space="md">
              {collageMode ? (
                <HStack
                  space="sm"
                  justifyContent={
                    numberImages > 1 ? 'space-between' : 'flex-end'
                  }>
                  {numberImages > 1 && collageMode && (
                    <HStack space="md">
                      <Icon
                        as={ImageIcon}
                        color="$white"
                        alignSelf="center"
                        p={'$4'}
                      />
                      <Text size="lg" color="$white">
                        {'2'}
                      </Text>
                    </HStack>
                  )}
                  <Icon
                    as={ExpandIcon}
                    color="$white"
                    alignSelf="center"
                    p={'$4'}
                  />
                </HStack>
              ) : (
                <Box />
              )}
            </VStack>
          </Box>
        </ImageBackground>
      )}
    </Box>
  );
};
