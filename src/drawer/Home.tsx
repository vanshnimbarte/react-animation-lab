import React, { useState } from 'react';
import { Dimensions, View, FlatList, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  FadeIn,
  FadeOut,
  SharedValue,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const images = [
  'https://i.pinimg.com/1200x/cc/83/61/cc8361baf1a039d1eb00e0032dea345b.jpg',
  'https://i.pinimg.com/236x/a8/60/e2/a860e2afe804e8e3448b4980c6ef1a1a.jpg',
  'https://i.pinimg.com/1200x/85/04/2e/85042eed7f1e3e1449b00a3549588a78.jpg',
  'https://i.pinimg.com/736x/dd/23/ba/dd23ba93dd9cbb9d80d9819bd15c5df5.jpg',
  'https://i.pinimg.com/736x/b7/a1/5a/b7a15adeaeda931195d8a3aafe38782f.jpg',
  'https://i.pinimg.com/736x/5d/fd/93/5dfd93255da6853c977a355e17029dc5.jpg',
  'https://i.pinimg.com/736x/4b/14/21/4b14218a67db0b7601d82d8e3892c780.jpg',
  'https://i.pinimg.com/736x/57/fe/35/57fe35367fb86ab4c159a8b0f673f74c.jpg',
];

const { width } = Dimensions.get('screen');
const _itemSize = width * 0.24;
const _spacing = 12;
const _itemTotalSize = _itemSize + _spacing;

function CarouselItem({
  imageUri,
  index,
  scrollX,
}: {
  imageUri: string;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    return {
      borderWidth: 4,
      borderColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        ['transparent', 'white', 'transparent']
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [_itemSize / 3, 0, _itemSize / 3]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={{ flex: 1, borderRadius: _itemSize / 2 }}
      />
    </Animated.View>
  );
}

export default function Home() {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x / _itemTotalSize;
    const newActiveIndex = Math.round(scrollX.value);

    if (activeIndex !== newActiveIndex) {
      runOnJS(setActiveIndex)(newActiveIndex);
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}>
      
      {/* Background Image */}
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.Image
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          key={`image-${activeIndex}`}
          source={{ uri: images[activeIndex] }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Carousel */}
      <Animated.FlatList
        style={{ flexGrow: 0, height: _itemSize * 2 }}
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (width - _itemSize) / 2,
        }}
        data={images}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <CarouselItem imageUri={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={_itemTotalSize}
        decelerationRate="fast"
      />
    </View>
  );
}