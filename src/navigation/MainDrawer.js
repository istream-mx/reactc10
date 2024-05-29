import {createDrawerNavigator} from '@react-navigation/drawer';
import * as React from 'react';
import {LiveStreamModal} from '../screens/LiveStreamModal';
import {SideBar} from '../lib/components/SideBar';

const Drawer = createDrawerNavigator();

const MainDrawer = ({navigation}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent',
        },
      }}
      drawerContent={_props => <SideBar navigation={navigation} />}>
      <Drawer.Screen
        name="LiveStreamModal"
        component={LiveStreamModal}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
