import React from 'react';
import {Linking, StatusBar} from 'react-native';
import {Button, ButtonText, HStack, Image, VStack} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {Box} from '@gluestack-ui/themed';

export const UpdateAvailableScreen = ({route}) => {
  const {
    currentVersion = '1.0.0',
    latestVersion = '1.0.1',
    storeUrl = '',
  } = route.params;

  const handlePress = () => {
    Linking.openURL(storeUrl);
  };

  return (
    <Box flex={1}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        px="$2"
        py="$1"
        bgColor="#c80000"
        space="sm">
        <StatusBar backgroundColor={'#c80000'} barStyle="light-content" />

        <Box flex={1} alignItems="center">
          <Text>{''}</Text>
        </Box>
      </HStack>
      <VStack flex={1} p="$8" justifyContent="center">
        <Box
          p="$6"
          minHeight="$3/4"
          borderRadius="$2xl"
          bg="$backgroundLight0"
          sx={{_dark: {bg: '$backgroundDark800'}}}>
          <VStack space="2xl">
            <VStack space="xs" alignSelf="center" alignItems="center">
              <Image
                alignSelf="center"
                padding={'$10'}
                source={require('../ui-images/Logo_app.png')}
                alt="logo"
                size="xs"
              />
              <Text size="xl" bold>
                ¡Actualización disponible!
              </Text>
            </VStack>
            <Text size="sm">
              Por favor, actualiza a la nueva versión para continuar
            </Text>
            <Box>
              <HStack space="xs">
                <Text size="xs" fontWeight="$light">
                  Versión actual:
                </Text>
                <Text size="xs" bold>
                  {currentVersion}
                </Text>
              </HStack>
              <HStack space="xs">
                <Text size="xs" fontWeight="$light">
                  Nueva versión:
                </Text>
                <Text size="xs" bold>
                  {latestVersion}
                </Text>
              </HStack>
            </Box>
            <Button onPress={handlePress}>
              <ButtonText>Actualizar</ButtonText>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
