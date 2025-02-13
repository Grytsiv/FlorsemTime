import React from 'react';
import {ActivityIndicator, Portal} from 'react-native-paper';
import styles from './styles.ts';

const BusyIndicator = () => (
    <Portal>
        <ActivityIndicator
            size="large"
            animating={true}
            style={styles.modalContainerStyle}
        />
    </Portal>
);
export default BusyIndicator;
