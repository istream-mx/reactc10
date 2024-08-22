import {createDrawerNavigator} from '@react-navigation/drawer';
import * as React from 'react';
import {LiveStreamModal} from '../screens/LiveStreamModal';
import {SideBar} from '../lib/components/SideBar';
import {MoreDetailsScreen} from '../screens/MoreDetailsScreen';
import {ListNewsScreen} from '../screens/ListNewsScreen';

const Drawer = createDrawerNavigator();

const MainDrawer = ({navigation}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent',
        },
        drawerType: 'front',
      }}
      drawerContent={_props => <SideBar navigation={navigation} />}>
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
