import {
  VStack,
  Text,
  ScrollView,
  HStack,
  Box,
  Icon,
} from '@gluestack-ui/themed';
import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {Linking, TouchableHighlight} from 'react-native';
import {BookMarkedIcon, ChevronRightIcon} from 'lucide-react-native';

export const MoreDetailsScreen = ({navigation}) => {
  const handlePress = () => {
    Linking.openURL('https://noticias.canal10.tv/politica-app');
  };
  return (
    <VStack flex={1} space="sm">
      <AppBar navigation={navigation} title={'Más+'} />
      <ScrollView paddingHorizontal={'$2'}>
        <Box sx={{bg: '$backgroundLight0', _dark: {bg: '$backgroundDark700'}}}>
          <TouchableHighlight
            underlayColor={'#ddd'}
            onPress={() => handlePress()}>
            <HStack justifyContent="space-between" padding={'$3'}>
              <HStack space="lg">
                <Icon
                  as={BookMarkedIcon}
                  alignSelf="center"
                  p="$3"
                  opacity={'$70'}
                />
                <Text size="md" alignSelf="center">
                  {'Políticas de privacidad'}
                </Text>
              </HStack>
              <Icon
                as={ChevronRightIcon}
                alignSelf="center"
                p="$3"
                opacity={'$70'}
              />
            </HStack>
          </TouchableHighlight>
        </Box>
      </ScrollView>
    </VStack>
  );
};
