import {ArrowLeftIcon} from 'lucide-react-native';
import {ButtonIcon, Button, HStack, Box, Text} from '@gluestack-ui/themed';
import {StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const HeaderWithComponent = props => {
  const {children, navigation} = props;
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
      <Button onPress={() => navigation.goBack()} variant="link" size="xl">
        <ButtonIcon as={ArrowLeftIcon} color="$white" size="xl" />
      </Button>
      <Box flex={1} alignItems="center" padding={'$3'}>
        {children}
      </Box>
    </HStack>
  );
};

HeaderWithComponent.prototype = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  navigation: PropTypes.object.isRequired,
};

HeaderWithComponent.defaultProps = {
  navigation: {},
};
