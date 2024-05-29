import {Box, Text, VStack} from '@gluestack-ui/themed';
import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {VideoPlayer} from '../lib/components/VideoPlayer';

export const LiveStreamModal = ({navigation}) => {
  return (
    <Box flex={1} backgroundColor="$black">
      <AppBar navigation={navigation}>
        <Text color="$white">{'TV en Vivo'}</Text>
      </AppBar>
      <VStack justifyContent="center" flex={1}>
        <VideoPlayer />
      </VStack>
    </Box>
  );
};
