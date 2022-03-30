import { View, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, memo } from 'react'

const height = Dimensions.get('window').height

const Card = memo(({ itemView,
    scrollY,
    index,
    indexInfo,
    containerStyle,
    parentPosition,
    onRelease,
    total,
    onIndexIncease,
    onIndexDecrease }) => {


    const screenOffPoint = height - parentPosition.y

    const isPreviousIndex = index === indexInfo.prevIndex
    const isNextIndex = index === indexInfo.nextIndex
    const isCurrentIndex = index === indexInfo.currentIndex
    const isAnimatingView = isNextIndex || isPreviousIndex || isCurrentIndex

    const translateY = useRef(new Animated.Value(0)).current
    const scaleX = useRef(new Animated.Value(isCurrentIndex || isPreviousIndex ? 1 : 0.8)).current
    const scaleY = useRef(new Animated.Value(isCurrentIndex || isPreviousIndex ? 1 : 0.8)).current

    const scrollYAnimated = useRef(new Animated.Value(0)).current
    const latestVelocity = useRef(0)


    useEffect(() => {
        if (onRelease.release) {
            if (isCurrentIndex) {
                if (onRelease.velocity > 0.6 && scrollYAnimated.__getValue() > 0 && index < total - 1) {
                    latestVelocity.current = onRelease.velocity
                    onIndexIncease()
                } else if (onRelease.velocity > 0.6 && scrollYAnimated.__getValue() < 0 && index != 0) {
                    latestVelocity.current = onRelease.velocity
                    onIndexDecrease()
                } else {
                    Animated.parallel([
                        Animated.spring(scaleX, {
                            toValue: 1,
                            useNativeDriver: true,
                            bounciness: 0,
                        }),
                        Animated.spring(scaleY, {
                            toValue: 1,
                            useNativeDriver: true,
                            bounciness: 0,
                        }),
                        Animated.spring(translateY, {
                            toValue: 0,
                            velocity: latestVelocity.current,
                            useNativeDriver: true,
                            bounciness: 0,
                            speed: 3,
                        })
                    ]).start()
                }
            } else if (isPreviousIndex) {
                Animated.spring(translateY, {
                    toValue: screenOffPoint,
                    velocity: latestVelocity.current,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 3,
                }).start()
            } else if (isNextIndex) {
                Animated.parallel([
                    Animated.spring(scaleX, {
                        toValue: 0.8,
                        useNativeDriver: true,
                        bounciness: 0,
                    }),
                    Animated.spring(scaleY, {
                        toValue: 0.8,
                        useNativeDriver: true,
                        bounciness: 0,
                    })
                ]).start()
            }
        }
    }, [onRelease])

    useEffect(() => {

        //Animate card when index increase
        if (indexInfo.isIncrease) {
            if (isPreviousIndex) {
                Animated.spring(translateY, {
                    toValue: screenOffPoint,
                    velocity: latestVelocity.current,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 3,
                }).start()
            }
            if (isCurrentIndex) {
                Animated.parallel([
                    Animated.spring(scaleX, {
                        toValue: 1,
                        useNativeDriver: true,
                        bounciness: 0,
                    }),
                    Animated.spring(scaleY, {
                        toValue: 1,
                        useNativeDriver: true,
                        bounciness: 0,
                    }),
                    Animated.spring(translateY, {
                        toValue: 0,
                        velocity: latestVelocity.current,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 3,
                    })
                ]).start()
            }
            if (isNextIndex) {
                scaleX.setValue(0)
                scaleY.setValue(0)
                Animated.spring(translateY, {
                    toValue: 0,
                    velocity: latestVelocity.current,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 3,
                }).start()
            }
            //Animate card when index decrease
        } else if (indexInfo.isDecrease) {
            if (isPreviousIndex) {
                Animated.spring(translateY, {
                    toValue: screenOffPoint,
                    velocity: latestVelocity.current,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 3,
                }).start()
            }
            if (isCurrentIndex) {
                Animated.spring(translateY, {
                    toValue: 0,
                    velocity: latestVelocity.current,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 3,
                }).start()
            }
            if (isNextIndex) {
                Animated.parallel([
                    Animated.spring(scaleX, {
                        toValue: 0.8,
                        useNativeDriver: true,
                        bounciness: 0,
                    }),
                    Animated.spring(scaleY, {
                        toValue: 0.8,
                        useNativeDriver: true,
                        bounciness: 0,
                    }),
                    Animated.spring(translateY, {
                        toValue: 0,
                        velocity: latestVelocity.current,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 3,
                    })
                ]).start()
            }

        }
    }, [indexInfo])

    useEffect(() => {
        if (total > 1) {

            if (isAnimatingView && Math.abs(scrollYAnimated.__getValue() - scrollY.dy) >= 0.05) {
                scrollYAnimated.setValue(scrollY.dy)

                if (isCurrentIndex) {
                    //Translate
                    var multiple = 1.5
                    var translateValue = scrollY.dy > 0 ? scrollY.dy * multiple : 0

                    if (index === total - 1) {
                        translateY.setValue(scrollY.dy < 130 ? translateValue : 130 * multiple)
                    } else if (index === 0) {
                        translateY.setValue(scrollY.dy > 0 ? translateValue : 0)
                    } else {
                        translateY.setValue(translateValue)
                    }

                    //Scaling
                    if (scrollYAnimated.__getValue() < 0 && scrollYAnimated.__getValue() >= -100) {
                        var scalePercent = Math.abs(scrollYAnimated.__getValue()) * 100 / 200
                        var scaleValue = 1 - (0.2 * scalePercent / 100)
                        scaleX.setValue(scaleValue)
                        scaleY.setValue(scaleValue)
                    }
                }

                if (isNextIndex) {
                    //Scaling
                    if (scrollYAnimated.__getValue() >= 0 && scrollYAnimated.__getValue() <= 200) {
                        var scalePercent = scrollYAnimated.__getValue() * 100 / 200
                        var scaleValue = 0.8 + (0.1 * scalePercent / 100)
                        scaleX.setValue(scaleValue)
                        scaleY.setValue(scaleValue)
                    }
                }

                if (isPreviousIndex) {
                    //Translate
                    if (scrollY.dy < -50) {
                        translateY.setValue(screenOffPoint + (scrollY.dy + 50))
                    }
                }

            }
        }
    }, [scrollY])

    return <Animated.View style={[{
        width: isAnimatingView ? '100%' : '0%',
        height: isAnimatingView ? '100%' : '0%',
        position: 'absolute',
        transform: isAnimatingView ? [{ scaleX: scaleX }, { scaleY: scaleY }, { translateY: translateY }] : []
    }]}>
        <View style={[{ width: '100%', height: '100%' }, containerStyle]}>
            {itemView}
        </View>
    </Animated.View>
})

export default Card