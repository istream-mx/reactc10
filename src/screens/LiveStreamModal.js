import {Box, Text, VStack} from '@gluestack-ui/themed';
import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {VideoPlayer} from '../lib/components/VideoPlayer';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchLiveStream,
  fetchScheduleEvents,
} from '../app/reducers/liveStreamStore';
import {ListScheduleEvents} from '../lib/components/ListScheduleEvents';

export const LiveStreamModal = ({navigation}) => {
  const liveStreams = useSelector(state => state.liveStreamStore.liveStreams);
  const scheduleEvents = useSelector(
    state => state.liveStreamStore.scheduleEvents,
  );

  const dispatch = useDispatch();

  const liveStream = React.useMemo(() => {
    if (liveStreams.length > 0) {
      return liveStreams[0];
    } else {
      return {};
    }
  }, [liveStreams]);

  React.useEffect(() => {
    dispatch(fetchLiveStream());
    dispatch(fetchScheduleEvents());
  }, [dispatch]);

  return (
    <Box flex={1}>
      <AppBar navigation={navigation}>
        <Text color="$white">{'TV en Vivo'}</Text>
      </AppBar>
      <VStack justifyContent="center" flex={1} backgroundColor="$black">
        {liveStream?.url && <VideoPlayer url={liveStream.url} />}
      </VStack>
      <ListScheduleEvents scheduleEvents={scheduleEvents} />
    </Box>
  );
};
