import {MenuIcon} from 'lucide-react-native';
import {ButtonIcon, Button, HStack, Box} from '@gluestack-ui/themed';
import {StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const AppBar = props => {
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
      <Button onPress={() => navigation.openDrawer()} variant="link" size="xl">
        <ButtonIcon as={MenuIcon} color="$white" size="xl" />
      </Button>
      <Box flex={1} alignItems="center">
        {children}
      </Box>
    </HStack>
  );
};

AppBar.prototype = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  navigation: PropTypes.object.isRequired,
};

AppBar.defaultProps = {
  navigation: {},
};
