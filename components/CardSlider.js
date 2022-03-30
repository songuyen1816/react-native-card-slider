import { View, PanResponder } from 'react-native'
import React, { useRef, useState } from 'react'
import Card from './Card'

/**
 * @param {{
 * data: Array, 
 * style: StyleSheet, 
 * containerStyle: StyleSheet,
 * renderItem: Function, 
 * onItemSnapped: Func,
 * }} props 
 */
const CardSlider = (props) => {

    const data = []

    data.splice(0, data.length)
    data.push(...props.data)

    const [scrollY, setScrollY] = useState({
        dy: 0,
        velocity: 0
    })
    const [onRelease, setOnRelease] = useState({
        release: false,
        velocity: 0
    })
    const [indexInfo, setindexInfo] = useState({
        currentIndex: 0,
        prevIndex: -1,
        nextIndex: 1,
        isIncrease: false,
        isDecrease: false
    })

    const [position, setPosition] = useState({
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined
    })

    var ignore = useRef(false).current

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderStart: (evt, gestureState) => {
                setOnRelease({ release: false, velocity: 0 })
            },
            onPanResponderMove: (evt, gestureState) => {
                setScrollY({
                    dy: gestureState.dy,
                    velocity: gestureState.vy
                })
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (!ignore) {
                    firstScroll = true
                    setOnRelease({ release: true, velocity: Math.abs(gestureState.vy) })
                }
            }
        })
    ).current

    const onIndexIncease = () => {
        // Vibration.vibrate(50)
        setindexInfo({
            currentIndex: indexInfo.currentIndex + 1,
            nextIndex: indexInfo.currentIndex + 2,
            prevIndex: indexInfo.currentIndex,
            isIncrease: true,
            isDecrease: false
        })
    }

    const onIndexDecrease = () => {
        // Vibration.vibrate(50)
        setindexInfo({
            currentIndex: indexInfo.currentIndex - 1,
            nextIndex: indexInfo.currentIndex,
            prevIndex: indexInfo.currentIndex - 2,
            isIncrease: false,
            isDecrease: true
        })
    }

    const renderCardItems = (parentPosition) => {
        if (parentPosition.x != undefined) {
            return <View style={{ width: '100%', flex: 1 }} >
                {
                    data.reverse().map((item, index) => {
                        return <Card containerStyle={props.containerStyle}
                            key={data.length - 1 - index}
                            itemView={props.renderItem(item, data.length - 1 - index)}
                            parentPosition={parentPosition}
                            scrollY={scrollY}
                            index={data.length - 1 - index}
                            total={data.length}
                            indexInfo={indexInfo} onRelease={onRelease}
                            onIndexIncease={onIndexIncease}
                            onIndexDecrease={onIndexDecrease}
                        />
                    })
                }
            </View>
        } else {
            return null
        }
    }

    return (
        <View  {...panResponder.panHandlers} style={[props.style, {}]} onLayout={(e) => {
            setPosition({
                x: e.nativeEvent.layout.x,
                y: e.nativeEvent.layout.y,
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height
            })
        }}>
            {renderCardItems(position)}
        </View>
    )
}




export default CardSlider
