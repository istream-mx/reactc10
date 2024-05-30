import {
  Box,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {TvIcon} from 'lucide-react-native';
import * as React from 'react';
import {Linking, Pressable, TouchableHighlight} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setSideBarCurrent} from '../../app/reducers/sideBarPathStore';

export const SideBar = ({navigation}) => {
  const currentPath = useSelector(
    state => state.sideBarPathStore.sideBarPathCurrent,
  );
  const dispatch = useDispatch();

  const navigateTo = (routeName, params = {}) => {
    if (routeName !== currentPath) {
      navigation.navigate(routeName, params);
      dispatch(setSideBarCurrent(routeName));
    }
  };
  return (
    <VStack flex={1} style={{backgroundColor: 'rgba(0,0,0,0.6)'}} space="xl">
      <VStack alignItems="center" borderBottomColor="$white" borderWidth={1}>
        <Image
          padding={'$16'}
          source={require('../../ui-images/Logo_app.png')}
          alt="logo"
          size="md"
        />
      </VStack>
      <ScrollView paddingVertical={20}>
        <Box
          backgroundColor={
            currentPath === 'LiveStreamModal' ? '#c80000' : 'transparent'
          }>
          <TouchableHighlight onPress={() => navigateTo('LiveStreamModal')}>
            <HStack space="lg" padding={'$3'}>
              <Icon as={TvIcon} color="$white" alignSelf="center" p="$3" />
              <Text color="$white" size="md" >
                {'Ver TV en Vivo'}
              </Text>
            </HStack>
          </TouchableHighlight>
        </Box>
      </ScrollView>
      <VStack
        alignItems="center"
        borderTopColor="$white"
        borderWidth={1}
        space="md"
        paddingVertical={'$3'}>
        <Text color="$white" size="md">
          {'Contáctanos por'}
        </Text>
        <ScrollView horizontal={true}>
          <SocialMediaButton type={'fb'} />
          <SocialMediaButton type={'wt'} />
          <SocialMediaButton type={'tw'} />
          <SocialMediaButton type={'phone'} />
        </ScrollView>
      </VStack>
    </VStack>
  );
};

const SocialMediaButton = props => {
  const {type = ''} = props;

  const urlByTypeSocialMedia = () => {
    switch (type) {
      case 'fb':
        return require('../../ui-images/fb.png');
      case 'wt':
        return require('../../ui-images/wt.png');
      case 'tw':
        return require('../../ui-images/tw.png');
      case 'phone':
        return require('../../ui-images/call.png');
      default:
        return require('../../ui-images/call.png');
    }
  };

  const onPressSocialMedia = () => {
    switch (type) {
      case 'fb':
        return Linking.openURL('https://www.facebook.com/tucanaldiez');
      case 'wt':
        return Linking.openURL(`whatsapp://send?phone=${'529982148215'}`);
      case 'tw':
        return Linking.openURL('https://twitter.com/Tucanal10');
      case 'phone':
        return Linking.openURL(`tel://${'529988436500 '}`);
      default:
        break;
    }
  };

  return (
    <Box paddingHorizontal={'$3'}>
      <Pressable onPress={() => onPressSocialMedia()}>
        <Image source={urlByTypeSocialMedia()} alt={type} size="2xs" />
      </Pressable>
    </Box>
  );
};
