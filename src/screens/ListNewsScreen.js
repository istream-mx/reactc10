import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {Box, Text, FlatList, HStack, Image, VStack} from '@gluestack-ui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {fetchNews, setNewCurrentId} from '../app/reducers/newStore';
import {CardNew} from '../lib/components/CardNew';

export const ListNewsScreen = ({navigation}) => {
  const listNews = useSelector(state => state.newStore.listNews);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [handlingData, setHandlingData] = React.useState(true);

  const fetchData = React.useCallback(
    async (addItems, newPage) => {
      await dispatch(
        fetchNews({
          addItems: addItems,
          filter: {
            publish_movil: true,
            publish_date_movil: true,
            pagination: {
              size: '10',
              page: `${newPage}`,
            },
          },
        }),
      )
        .then(() => {
          setHandlingData(false);
        })
        .catch(error => {
          setHandlingData(false);
        });
    },
    [dispatch],
  );

  const loadMore = () => {
    let currentPage = page;

    if (currentPage >= listNews.length - 1) {
      return;
    } else {
      let newPage = ++currentPage;
      setPage(newPage);
      fetchData(true, newPage);
    }
  };

  const onRefresh = () => {
    setPage(1);

    fetchData(false, 1);
  };

  const onPressTo = item => {
    navigation.navigate('NewScreen', {});
    dispatch(setNewCurrentId(item.id));
  };

  React.useEffect(() => {
    setHandlingData(true);
    fetchData(false, 1);
  }, []);

  return (
    <Box flex={1}>
      <AppBar navigation={navigation}>
        <Text color="$white">{'Noticias'}</Text>
      </AppBar>
      <FlatList
        data={listNews}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={handlingData}
        onRefresh={() => onRefresh()}
        ListEmptyComponent={
          <HStack justifyContent="center">
            <Text bold opacity={'$60'}>
              {'Sin noticias disponibles'}
            </Text>
          </HStack>
        }
        renderItem={({item}) => (
          <Box paddingHorizontal={'$2'} paddingVertical={'$2'}>
            <CardNew item={item} onPress={() => onPressTo(item)} />
          </Box>
        )}
        keyExtractor={(_item, index) => `${index}-schedule`}
      />
    </Box>
  );
};
