// declarations.d.ts
declare module 'expo-notifications';

// Loosen Ionicons name typing so you can use any icon string
declare module '@expo/vector-icons/Ionicons' {
  import { IconProps } from '@expo/vector-icons/build/createIconSet';
    import { Component } from 'react';
  export default class Ionicons extends Component<IconProps<string>> {}
}
