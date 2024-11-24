import React,{useRef, useEffect} from "react";
import {View, StyleSheet, Text, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, TextInput} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import logo from '../Images/fran.png'
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons   } from '@expo/vector-icons';
export function Home(){
    const navigation = useNavigation()
    const animation = useRef(null);
    useEffect(()=>{
        
    },[])
    return(
        <KeyboardAvoidingView>
        <ScrollView>
            <View style={styles.container}>
                <Image source={logo} style={{width:'100%', height:250}}/>
                <Text style={styles.title}> BASE CLIENTES</Text>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Cadastrar")}>
                        <AntDesign name="addusergroup" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>CADASTRAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Clientes")}>
                        <FontAwesome name="list" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>VER CLIENTES</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Precos")}>
                        <FontAwesome5 name="money-bill-alt" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>VER PREÇOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Devedores")}>
                        <MaterialCommunityIcons name="account-cash-outline" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>DEVEDORES</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.lastButton} onPress={()=>navigation.navigate("GerarRecibo")}>
                    <AntDesign name="calendar" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>GERAR RECIBO</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.lastButton} onPress={()=>navigation.navigate("Vendas")}>
                    <AntDesign name="calendar" size={40} color="#f6f6f6" />
                        <Text style={styles.text}>VENDAS</Text>
                </TouchableOpacity> 
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:25,
        backgroundColor:"#111111",
        justifyContent:'center',
        alignItems:'center'

    },
    button:{
        backgroundColor:'#ffcb74',
        width:'40%',
        elevation:10, 
        height:145,
        margin:10, 
        borderRadius:8,
        justifyContent:'center',
        shadowColor:'#f6f6f6',
        alignItems:"center"
    },  
    lastButton:{
        backgroundColor:'#ffcb74',
        alignItems:'center',
        width:'80%',
        elevation:10, 
        height:145,
        margin:10, 
        borderRadius:8,
        justifyContent:'center',
        shadowColor:'#f6f6f6'
    },  
    text:{
        fontSize:25,
        color:'#f6f6f6',
        textAlign:'center',
        fontFamily:'Inter_600SemiBold'
    },
    title:{
        fontSize:25,
        marginBottom:85,
        color:'#ffcb74',
        borderRadius:10,
        elevation:10,
        width:'70%',
        height:65,
        textAlignVertical:'center',
        shadowColor:'#fff',
        backgroundColor:'#2f2f2f',
        textAlign:'center',
        fontFamily:'Inter_700Bold'
    }
})