import {Box, Text, VStack} from '@gluestack-ui/themed';
import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {Player} from '../lib/components/Player';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchLiveStream,
  fetchScheduleEvents,
} from '../app/reducers/liveStreamStore';
import {ListScheduleEvents} from '../lib/components/ListScheduleEvents';
import {ActivityIndicator, StatusBar, TouchableOpacity} from 'react-native';
import {CloudflareStreamPlayer} from '../lib/components/CloudflareStreamPlayer';

export const LiveStreamModal = ({navigation}) => {
  const liveStreams = useSelector(state => state.liveStreamStore.liveStreams);
  const [isLoadingSchedules, setIsloadingSchedules] = React.useState(false);
  const [isLoadingLive, setIsloadingLive] = React.useState(false);
  const [isLoading, setIsloading] = React.useState(true);

  const scheduleEvents = useSelector(
    state => state.liveStreamStore.scheduleEvents,
  );

  const isFullScreenVideoPlayer = useSelector(
    state => state.liveStreamStore.isFullScreenVideoPlayer,
  );

  const dispatch = useDispatch();

  const liveStream = React.useMemo(() => {
    if (liveStreams.length > 0) {
      return liveStreams[0];
    } else {
      return {};
    }
  }, [liveStreams]);

  const retryLive = () => {
    setIsloadingLive(true);
    dispatch(fetchLiveStream()).finally(() => setIsloadingLive(false));
  };
  const retrySchedule = () => {
    setIsloadingSchedules(true);
    dispatch(fetchScheduleEvents()).finally(() => setIsloadingSchedules(false));
  };

  React.useEffect(() => {
    setIsloading(true);
    dispatch(fetchLiveStream()).finally(() => setIsloading(false));
    dispatch(fetchScheduleEvents());
  }, [dispatch]);

  return (
    <Box flex={1}>
      {!isFullScreenVideoPlayer ? (
        <AppBar navigation={navigation} title={'TV en Vivo'} />
      ) : (
        <StatusBar hidden={true} />
      )}
      <VStack justifyContent="center" flex={1} backgroundColor="$black">
        {liveStream?.url ? (
          <CloudflareStreamPlayer
            videoUrl={liveStream.url || ''}
            maxRetries={5}
            retryDelay={2000}
          />
        ) : (
          <VStack>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <TouchableOpacity
                style={{
                  borderColor: '#fff',
                  borderWidth: 1,
                  alignSelf: 'center',
                  paddingHorizontal: 30,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                onPress={retryLive}>
                {isLoadingLive ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: '600',
                    }}>
                    Reintentar
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </VStack>
        )}
      </VStack>
      {!isFullScreenVideoPlayer && (
        <ListScheduleEvents
          scheduleEvents={scheduleEvents}
          isLoadingSchedules={isLoadingSchedules}
          onPressRefresh={retrySchedule}
        />
      )}
    </Box>
  );
};
