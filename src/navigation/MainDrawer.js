import {createDrawerNavigator} from '@react-navigation/drawer';
import * as React from 'react';
import {LiveStreamModal} from '../screens/LiveStreamModal';
import {SideBar} from '../lib/components/SideBar';
import {MoreDetailsScreen} from '../screens/MoreDetailsScreen';
import {ListNewsScreen} from '../screens/ListNewsScreen';
import {Dimensions} from 'react-native';

const Drawer = createDrawerNavigator();

const MainDrawer = ({navigation}) => {
  const renderSideBar = React.useCallback(
    _props => <SideBar navigation={navigation} />,
    [navigation],
  );

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent',
        },
        overlayColor: 'rgba(0,0,0,0.5)',
        drawerType: 'front',
      }}
      drawerContent={renderSideBar}
      initialRouteName="ListNewsScreen">
      <Drawer.Screen
        name="LiveStreamModal"
        component={LiveStreamModal}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ListNewsScreen"
        component={ListNewsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MoreDetailsScreen"
        component={MoreDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
