import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, Modal, Alert } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down'
import DialogInput from 'react-native-dialog-input'
import Spinner from 'react-native-loading-spinner-overlay'
import WebView from 'react-native-webview'
import { NavigationContainer, useLinkTo } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

class SwipeMini extends Component{
    render(){
        return(
            <View style={swipemini.parent}>
                <Text style={swipemini.child}>Swipe Me up</Text>
            </View>
        )
    }
}

class SwipeFull extends Component{
constructor(props){
    super(props)

    this.state = {
        ip: "",
        dialog: true,
        loading: false,
        nmap: false
    }
}

dialogGenerate(inputIP){
    const data = inputIP;
    this.setState({ip : data })
    this.setState({dialog: false})
    this.setState({ loading: true })
    
    fetch("http://" + data).then(res => {
        this.setState({ loading: false })
        if(res.status == 200){
            alert('[+] Successfully connected to your raspi')
        }else{
            alert('[-] Connection Error')
        }
    }).catch(err => {
        alert('[!] Connection Error or Wrong IP')
    })
}

modal(){
    this.setState({ modal: true })
}

    reahoneyon(){
    fetch('http://' + this.state.ip + ':5000/honeypot').then(data => data.json()).then(x => {
        alert(x.status)
    }).catch(err => {
        alert("[!] Can't connect to your raspi, please check your raspi ip address")
    })
}

honeylog(){
    fetch('http://' + this.state.ip + ':5000/honeylog').then(data => data.json()).then(x => {
        if(x.result == undefined){
            alert("[!] Log is clear")
        }else{
            alert(x.result)
        }
    }).catch(err => {
        alert("[!] Error can't connect to your raspi, please check your raspi ip address")
    })
}

honeypot(){
    Alert.alert(
        "Honeypot",
        "Security System for raspberry pi",
        [
            {
                text: "Turn on honeypot",
                onPress: () => this.honeyon()
            },
            {
                text: "Check honeypot log",
                onPress: () => this.honeylog()
            },
            {
                text: "Close"
            }
        ]
    )
}

nmap(ip){
    this.setState({ loading: true })
    fetch('http://' + this.state.ip + ":5000/nmap?ip=" + ip).then(data => data.json()).then(x => {
        this.setState({ loading: false })
        alert(x.result)
        this.setState({ nmap: false })
    }).catch(err => {
        this.setState({ loading: false })
        alert("[!] Connection error, please check your raspberry pi ip again")
    })
}

render(){
        return(
            <View style={swipefull.back}>
                <Text style={swipefull.title}>Control Menu</Text>
                <View style={swipefull.menu}>
                    <Spinner visible={this.state.loading} textContent={'Please Wait Dude ....'} />

                    <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.setState({ nmap: true })}>
                        <Image source={require('./assets/menu/nmap.png')} style={swipefull.terminal}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.honeypot()}>
                       <Image source={require('./assets/menu/honeypot.png')} style={swipefull.wifi}/>
                    </TouchableOpacity>
               </View>

                <View style={swipefull.menu2}>
                    <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => {
                        this.setState({ loading: true })
                        fetch("http://" + this.state.ip + ":5000/vnc").then(data => data.json()).then(x => {
                            this.setState({loading: false })
                            alert(x.result)
                        })
                    }}>
                        <Image source={require("./assets/menu/vnc.png")} style={swipefull.vnc}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: 80, height: 80, marginRight: 45 }} onPress={() => { 
                        this.setState({ loading: true})
                        fetch("http://" + this.state.ip + ":5000/temp").then(data => data.json()).then(x => {
                            this.setState({ loading: false })
                            alert(x.hasil)
                        })

                    }}>
                        <Image source={require("./assets/menu/temperature.png")} style={swipefull.temp}/>
                    </TouchableOpacity>
                    
                    <DialogInput isDialogVisible={this.state.nmap} title={"Network Mapper"} message={"Input IP"} submitInput={(data) => this.nmap(data)} closeDialog={() => this.setState({ nmap: false })}/>
                    
                    <DialogInput isDialogVisible={this.state.dialog} title={"Raspi IP"} message={"Plase input your raspberry pi IP"} hintInput={"Your IP"} submitInput={(data) => this.dialogGenerate(data)} closeDialog={() => this.setState({ dialog: false })}>

                    </DialogInput>
                </View>
            </View>
        )
}
}

export default class Default extends Component{
constructor(props){
    super(props)

    this.state = {
        cmd: '',
        modal: false,
        dialog: true,
        ip: "",
        result: "",
        loading: false
    }
}

command(){
    this.setState({ result: "" })
    this.setState({ loading: true })
    fetch("http://" + this.state.ip + ":5000/terminal?command=" + this.state.cmd).then(data => data.json()).then(x => {
        this.setState({ loading: false })
        this.setState({ result: x.hasil })
    }).catch(err => {
        alert("[!] Command error / Connection Error")
    })
}

ip(x){
    var data = x.toString()
    this.setState({ ip: data })
}

render(){
  return (
    <View style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Please wait for a minute.."} textStyle={styles.spinner} />
        <Modal animationType="slide" visible={this.state.modal} transparent={true}>
        <View style={styles.container}>
            <Button title='close' color='red' onPress={() => this.setState({ modal: false })}/>
            <View style={terminal.main}>
                <Text style={terminal.title}>Terminal</Text>
                <Text style={terminal.ip}>{this.state.ip}</Text>
                <Text style={terminal.result}>{this.state.result}</Text>
            </View>
            <TextInput placeholder="Please Input IP " placeholderTextColor="white" style={{ backgroundColor: 'black', color: 'white', paddingLeft: 20, paddingRight: 20}} onChangeText={data => this.ip(data)}/>
        </View>


        <TextInput placeholder="Input Command" placeholderTextColor='white' style={terminal.input} onChangeText={data => this.setState({ cmd: data })}/>
        <Button title='Send' color='green' onPress={() => this.command()}/>
        </Modal>

        <Text style={styles.bannerteks}>Raspi Hungry</Text>
        <Image source={require('./assets/banner.png')} style={styles.banner}/>
        <Text style={{ fontSize: 15 }}>@FajarTheGGman</Text>
          <Text style={{ fontSize: 15 }}>{ "{ Version: '1.0.0' }" }</Text>
        <Button title='Terminal' color='black' onPress={() => this.setState({ modal: true })}/>
        <SwipeUpDown itemMini={<SwipeMini />} itemFull={<SwipeFull/>} style={styles.swipe}/>
      <StatusBar style="auto" />
    </View>
  );
 }
}

const terminal = StyleSheet.create({
    container: {
        backgroundColor: '#b00002',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50
    },

    result: {
        color: 'lime',
        marginLeft: -90,
        marginTop: -50
    },

    ip: {
        color: 'white',
        marginBottom: 55
    },

    close: {
        backgroundColor: 'red'
    },

    title: {
       color: 'black',
       justifyContent: 'center',
       backgroundColor: 'white',
       textAlign: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },

    main: {
        paddingTop: 4,
        padding: 95,
        backgroundColor: 'black',
    },

    input: {
        backgroundColor: 'black',
        textAlign: 'center',
        color: 'white'
    }
})

const swipefull = StyleSheet.create({
    back: {
        marginTop: 25,
        backgroundColor: 'white',
        paddingBottom: 500,
        borderRadius: 20,
    },

    input: {
        flex:1,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 225,
    },

    menu: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between"
    },

    wifi: {
        width: 80,
        height: 80,
        marginLeft: -45,
        marginTop: 30
    },

    menu2: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 185
    },

    vnc: {
        width: 90,
        height: 90,
        marginLeft: 40
    },

    temp: {
        width: 90,
        height: 90,
        marginRight: 45
    },

    terminal: {
        width: 80,
        height: 80,
        marginLeft: 45,
        marginTop: 30
    },

    title: {
        alignItems: "center",
        textAlign: "center",
        fontSize: 25,
        color: 'white',
        backgroundColor: "#1a1a1a",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        
    }
})

const swipemini = StyleSheet.create({
    parent: {
        alignItems: "center"
    },

    child: {
        color: "black",
        backgroundColor: 'red',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 4,
        fontSize: 20
    }
})

const styles = StyleSheet.create({
    swipe:{
        backgroundColor: '#1a1a1a'
    },

    bannerteks: {
        fontSize: 25,
        backgroundColor: 'black',
        color: 'red',
        padding: 10,
        borderRadius: 15
    },

  container: {
    flex: 1,
    backgroundColor: '#b00002',
    alignItems: 'center',
    justifyContent: 'center',
  },

    spinner: {
        color: 'white'
    }
});

