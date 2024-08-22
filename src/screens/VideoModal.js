import {
  Box,
  Button,
  ButtonIcon,
  HStack,
  VStack,
  Text,
} from '@gluestack-ui/themed';
import {X} from 'lucide-react-native';
import * as React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

export const VideoModal = ({route, navigation}) => {
  const {video = {}} = route.params;

  return (
    <Box flex={1} backgroundColor="$black">
      <HStack justifyContent="flex-start" flex={2} padding={'$3'}>
        <Button onPress={() => navigation.goBack()} variant="link">
          <ButtonIcon as={X} color="$white" p={'$4'} />
        </Button>
      </HStack>
      <VStack flex={2}>
        <YoutubePlayer height="100%" videoId={video.id} play={false} />
        {/* <Text color={'$white'}>{video.meta.title}</Text> */}
      </VStack>
      <Box flex={2} />
    </Box>
  );
};
