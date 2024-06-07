import {
  Box,
  FlatList,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import moment from 'moment';
import * as React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const ListScheduleEvents = props => {
  const {scheduleEvents = []} = props;
  const insets = useSafeAreaInsets();

  const firstItem = React.useMemo(() => {
    if (scheduleEvents.length > 0) {
      return scheduleEvents[0];
    } else {
      return {};
    }
  }, [scheduleEvents]);

  const filterScheduleList = React.useMemo(() => {
    if (scheduleEvents.length > 0) {
      return scheduleEvents.slice(1);
    } else {
      return [];
    }
  }, [scheduleEvents]);

  const formatScheduleDate = date => {
    if (date !== '' && date != null) {
      var mom = moment(date, 'hh:mm a');
      return mom.format('hh:mm A');
    } else {
      return '';
    }
  };

  return (
    <Box flex={1} paddingBottom={insets.bottom || '$4'}>
      <HStack space="md" paddingHorizontal={'$3'} paddingVertical={2}>
        <Image
          source={require('../../ui-images/Logo_app.png')}
          alt="logo"
          size="sm"
        />
        <HStack justifyContent="center" flex={1}>
          <VStack alignItems="center">
            <Text bold size="md">
              {'Estás Viendo...'}
            </Text>
            {firstItem?.schedule_event?.name && (
              <Text size="md">{firstItem.schedule_event.name}</Text>
            )}
          </VStack>
        </HStack>
      </HStack>
      <FlatList
        data={filterScheduleList}
        ListEmptyComponent={
          <HStack justifyContent="center">
            <Text bold opacity={'$60'}>
              {'Sin programas disponibles'}
            </Text>
          </HStack>
        }
        renderItem={({item}) => (
          <Box flex={1} paddingHorizontal={'$2'} paddingVertical={3}>
            <VStack
              sx={{bg: '$backgroundLight0', _dark: {bg: '$backgroundDark700'}}}
              space="xs"
              padding={'$2'}>
              <Text flex={1} size="sm">
                {item.schedule_event.name}
              </Text>
              <HStack space="sm">
                <Text opacity={'$60'} size="sm">
                  {formatScheduleDate(item.begin_time)}
                </Text>
                <Text size="sm">-</Text>
                <Text opacity={'$60'} size="sm">
                  {formatScheduleDate(item.end_time)}
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}
        keyExtractor={(_item, index) => `${index}-schedule`}
      />
    </Box>
  );
};
