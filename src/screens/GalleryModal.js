import {Box, Button, ButtonIcon, HStack} from '@gluestack-ui/themed';
import {X} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageView from 'react-native-image-viewing';
import * as React from 'react';

export const GalleryModal = ({route, navigation}) => {
  const {images = []} = route.params;
  const insets = useSafeAreaInsets();

  const listImages = React.useMemo(() => {
    return images.map((item, _index) => {
      return {
          uri: item.url,
      };
    });
  }, [images]);

   const [visible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box flex={1} backgroundColor="$black" pt={insets.top || '$2'}>
       <ImageView
        images={listImages}
        visible={visible}
        onRequestClose={() => {
          setIsVisible(false);
          navigation.goBack();
        }}
      />
    </Box>
  );
};
