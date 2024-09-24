import {ArrowLeftIcon, X, XIcon} from 'lucide-react-native';
import {ButtonIcon, Button, HStack, Box, Text} from '@gluestack-ui/themed';
import {StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const SingleHeader = props => {
  const {children, navigation, title, isNotificationMode, onPressNotification} =
    props;
  const insets = useSafeAreaInsets();
  
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      px="$2"
      pt={insets.top || '$2'}
      bgColor="#c80000"
      space="sm">
      <StatusBar backgroundColor={'#c80000'} barStyle="light-content" />
      {isNotificationMode ? (
        <Button onPress={onPressNotification} variant="link" size="xl">
          <ButtonIcon as={XIcon} color="$white" size="xl" />
        </Button>
      ) : (
        <Button onPress={() => navigation.goBack()} variant="link" size="xl">
          <ButtonIcon as={ArrowLeftIcon} color="$white" size="xl" />
        </Button>
      )}
      <Box flex={1} alignItems="center">
        <Text color="$white" bold>
          {title}
        </Text>
      </Box>
      {children && <Box alignItems="flex-end">{children}</Box>}
    </HStack>
  );
};

SingleHeader.prototype = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  isNotificationMode: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  onPressNotification: PropTypes.func,
};

SingleHeader.defaultProps = {
  navigation: {},
  isNotificationMode: false,
  onPressNotification: () => {},
  title: '',
};
