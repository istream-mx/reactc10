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
import {
  BellDotIcon,
  BookMarkedIcon,
  ChevronRightIcon,
  InfoIcon,
} from 'lucide-react-native';
import {openSettings} from 'react-native-permissions';

export const MoreDetailsScreen = ({navigation}) => {
  const handlePress = () => {
    Linking.openURL('https://noticias.canal10.tv/politica-app');
  };

  const handlePressNotification = () => {
    openSettings().catch(() => console.warn('cannot open settings'));
  };
  return (
    <VStack flex={1} space="sm">
      <AppBar navigation={navigation} title={'Más+'} />
      <ScrollView paddingHorizontal={'$2'}>
        <MenuItems
          title={'Políticas de privacidad'}
          icon={BookMarkedIcon}
          onPress={handlePress}
        />
        <MenuItems
          title={'Permisos de notificaciones'}
          icon={BellDotIcon}
          onPress={handlePressNotification}
        />
      </ScrollView>
    </VStack>
  );
};

const MenuItems = props => {
  const {onPress = () => {}, title = '', icon = InfoIcon} = props;
  return (
    <Box paddingVertical={'$1'}>
      <Box sx={{bg: '$backgroundLight0', _dark: {bg: '$backgroundDark700'}}}>
        <TouchableHighlight underlayColor={'#ddd'} onPress={() => onPress()}>
          <HStack justifyContent="space-between" padding={'$3'}>
            <HStack space="lg">
              <Icon as={icon} alignSelf="center" p="$3" opacity={'$70'} />
              <Text size="md" alignSelf="center">
                {title}
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
    </Box>
  );
};
