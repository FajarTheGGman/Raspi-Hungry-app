import { Text, View, StyleSheet, Component } from 'react'
import WebView from 'react-native-webview'

export default class Web extends Component{
    render(){
        return(
            <WebView source={{ uri: "http://localhost:5000" }} />
        )
    }
}

