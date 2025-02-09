import * as React from 'react';
import {
  Box,
  Text,
  FlatList,
  HStack,
  Image,
  VStack,
  FormControl,
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from '@gluestack-ui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchNewsData,
  setAddNewSearchItems,
  setListNewSearch,
  setNewCurrentId,
} from '../app/reducers/newStore';
import {CardNew} from '../lib/components/CardNew';
import {SingleHeader} from '../lib/components/SingleHeader';
import {HeaderWithComponent} from '../lib/components/HeaderWithComponent';
import debounce from 'lodash.debounce';
import {SearchIcon} from 'lucide-react-native';
import {ActivityIndicator} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const SearchNewsModal = ({navigation}) => {
  const [page, setPage] = React.useState(1);
  const [handlingData, setHandlingData] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const listNews = useSelector(state => state.newStore.listSearch);

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const fetchData = React.useCallback(
    async (addItems, newPage, title) => {
      setHandlingData(true);
      await dispatch(
        fetchNewsData({
          addItems: addItems,
          filter: {
            title: title,
            publish_movil: true,
            size_items: 10,
            page: `${newPage}`,
          },
        }),
      )
        .then(response => {
          dispatch(setAddNewSearchItems(response.payload));
          setPage(newPage);
          setHandlingData(false);
        })
        .catch(error => {
          console.log(error);
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
      fetchData(true, newPage, query);
    }
  };

  const onRefresh = () => {
    setPage(1);
    dispatch(setListNewSearch([]));
    fetchData(false, 1, query);
  };

  const onPressTo = item => {
    navigation.navigate('NewScreen', {});
    dispatch(setNewCurrentId(item.id));
  };

  React.useEffect(() => {
    dispatch(setListNewSearch([]));
  }, []);

  React.useEffect(() => {
    if (query.length > 2) {
      fetchData(false, 1, query);
    }
  }, [query]);

  const debouncedSetAddText = debounce(setQuery, 250);

  return (
    <Box flex={1} pb={insets.bottom || '$2'}>
      <HeaderWithComponent navigation={navigation}>
        <Input backgroundColor="$white">
          <InputSlot padding={'$1'}>
            <InputIcon as={SearchIcon} p={'$3'} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Buscar..."
            onChangeText={text => debouncedSetAddText(text)}
          />
        </Input>
      </HeaderWithComponent>

      <FlatList
        data={listNews}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={handlingData}
        onRefresh={() => onRefresh()}
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
            <CardNew item={item} onPress={() => onPressTo(item)} />
          </Box>
        )}
        keyExtractor={(_item, index) => `${index}-schedule`}
      />
    </Box>
  );
};
