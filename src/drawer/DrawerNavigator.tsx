
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
 
import Main19 from './Main19';
import { Screen } from 'react-native-screens';
import Home from './Home';
import EntranceAnimation from './EntranceAnimation';
import FeedbackAnimation from './FeedbackAnimation';
import InteractiveStyleSwitcher from './InteractiveStyleSwitcher';
import LoopingAnimations from './LoopingAnimations';
import ProgressAnimation from './ProgressAnimation';
import SkeletonLoader from './SkeletonLoader';
import { SlideInDown } from 'react-native-reanimated';
import SlideTransition from './SlideTransition';
import SwipeToDelete from './SwipeToDelete';
import AvengersSlider from './AvengersSlider';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator  >
      <Drawer.Screen
        name="one pease"
        component={Home}
        options={{headerShown: false}}
      />

       <Drawer.Screen
        name="Solo Leveling"
        component={Main}
        options={{headerShown: true}}
      />
       <Drawer.Screen
        name="Main19"
        component={Main19}
        options={{headerShown: true}}
      />
       <Drawer.Screen
        name="EntranceAnimation"
        component={EntranceAnimation}
        options={{headerShown: true}}
      />
       <Drawer.Screen
        name="FeedbackAnimation"
        component={FeedbackAnimation}
        options={{headerShown: true}}
      />
       <Drawer.Screen
        name="InteractiveStyleSwitcher"
        component={InteractiveStyleSwitcher}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="LoopingAnimations"
        component={LoopingAnimations}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="ProgressAnimation"
        component={ProgressAnimation}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="SkeletonLoader"
        component={SkeletonLoader}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="SlideTransition"
        component={SlideTransition}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="SwipeToDelete"
        component={SwipeToDelete}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="AvengersSlider"
        component={AvengersSlider}
        options={{headerShown: false}}
      />

       
       
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
