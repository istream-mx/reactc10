import {Box, Button, ButtonIcon, HStack} from '@gluestack-ui/themed';
import {X} from 'lucide-react-native';

import Gallery from 'react-native-image-gallery';
import * as React from 'react';

export const GalleryModal = ({route, navigation}) => {
  const {images = []} = route.params;

  const listImages = React.useMemo(() => {
    return images.map((item, _index) => {
      return {
        source: {
          uri: item.url,
        },
      };
    });
  }, [images]);

  return (
    <Box flex={1} backgroundColor="$black">
      <HStack justifyContent="flex-start" padding={'$3'}>
        <Button onPress={() => navigation.goBack()} variant="link">
          <ButtonIcon as={X} color="$white"  p={'$4'} />
        </Button>
      </HStack>
      <Gallery images={listImages} />
    </Box>
  );
};
