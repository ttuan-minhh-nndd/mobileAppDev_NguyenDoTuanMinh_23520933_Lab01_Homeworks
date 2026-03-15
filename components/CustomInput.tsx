import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native';
import cn from "clsx"

interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    keyboardType?: "default";
}

const CustomInput = ({
    placeholder = "Enter city (e.g. Saigon)",
    value,
    onChangeText,
    label,
    keyboardType
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false)
    return (
        <View className={'w-full'}>
            <Text className='label'>{label}</Text>

            <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            /**
            * the input field has two visual states:
            *    1. Unfocused - gray border (user not typing)
            *    2. Focused - primary color border (user is typing)
            */
            className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')} // base styles
            onFocus={() => setIsFocused(true)}  // when user taps into the input
            onBlur={() => setIsFocused(false)}  // when user taps away from the input

            placeholder={placeholder}
            placeholderTextColor="#888"
            />
        </View>
    )
}

export default CustomInput