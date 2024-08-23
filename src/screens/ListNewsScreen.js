import * as React from 'react';
import {AppBar} from '../lib/components/AppBar';
import {
  Box,
  Text,
  FlatList,
  HStack,
  Image,
  VStack,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchNews,
  setListNews,
  setNewCurrentId,
} from '../app/reducers/newStore';
import {CardNew} from '../lib/components/CardNew';
import {SearchIcon} from 'lucide-react-native';
import {ActivityIndicator, TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const ListNewsScreen = ({navigation}) => {
  const listNews = useSelector(state => state.newStore.listNews);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [handlingData, setHandlingData] = React.useState(true);
  const insets = useSafeAreaInsets();

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
          setPage(newPage);
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
      fetchData(true, newPage);
    }
  };

  const onRefresh = () => {
    setPage(1);
    dispatch(setListNews([]));
    setHandlingData(true);
    fetchData(false, 1);
  };

  const onPressTo = item => {
    navigation.navigate('NewScreen', {});
    dispatch(setNewCurrentId(item.id));
  };

  const onPressToSearch = item => {
    navigation.navigate('SearchNewsModal', {});
  };

  React.useEffect(() => {
    setHandlingData(true);
    fetchData(false, 1);
  }, []);

  return (
    <Box flex={1} pb={insets.bottom || '$2'}>
      <AppBar navigation={navigation} title={'Noticias'}>
        <Button
          variant="link"
          size="xl"
          onPress={onPressToSearch}
          paddingHorizontal={'$1'}>
          <ButtonIcon as={SearchIcon} color="$white" />
        </Button>
      </AppBar>
      <FlatList
        data={listNews}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={handlingData}
        onRefresh={() => onRefresh()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent:
            handlingData || listNews.length == 0 ? 'center' : undefined,
        }}
        ListEmptyComponent={
          <VStack justifyContent="center">
            {handlingData == false ? (
              <HStack justifyContent="center">
                <Text bold opacity={'$60'}>
                  {'Sin noticias disponibles'}
                </Text>
              </HStack>
            ) : (
              <HStack justifyContent="center">
                <ActivityIndicator size="large" color={'#c80000'} />
              </HStack>
            )}
          </VStack>
        }
        renderItem={({item}) => (
          <Box paddingHorizontal={'$2'} paddingVertical={'$2'}>
            <CardNew
              item={item}
              onPress={() => onPressTo(item)}
              navigation={navigation}
            />
          </Box>
        )}
        keyExtractor={(_item, index) => `${index}-schedule`}
      />
    </Box>
  );
};
