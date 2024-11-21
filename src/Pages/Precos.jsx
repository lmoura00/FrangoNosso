import React,{useState, useEffect} from "react";
import {View, ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import {
    getDatabase,
    ref,
    set,
    child,
    get,
    onValue,
    remove,
    update,
  } from "firebase/database";
export function Precos(){
    const [frango, setFrango] = useState('')
    const [bode, setBode] = useState('')
    const [tambaqui, setTambaqui] = useState('')
    const [tilapia, setTilapia] = useState('')
    const [cxMole, setCxMole] = useState('')
    const [picanha, setPicanha] = useState('')
    const [acem, setAcem] = useState('')
    const [lombo, setLombo] = useState('')
    const [leitao, setLeitao] = useState('')
    const [rodilan, setRodilan] = useState('')
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    useEffect(()=>{
        get(child(dbRef,"Precos/"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                setFrango(snapshot.val().frango);
                setBode(snapshot.val().bode);
                setTambaqui(snapshot.val().tambaqui);
                setTilapia(snapshot.val().tilapia);
                setCxMole(snapshot.val().cxMole);
                setPicanha(snapshot.val().picanha);
                setAcem(snapshot.val().acem);
                setLombo(snapshot.val().lombo);
                setRodilan(snapshot.val().rodilan);
                setLeitao(snapshot.val().leitao);
              } else {
                console.log("No data available");
                alert("No data available");
              }
          })
          .catch((error) => {
            console.error(error);
          });
    },[])
    
    function sendData(frango, bode, tambaqui, tilapia, cxMole, picanha, acem, lombo, leitao, rodilan) {
        set(ref(db, 'Precos/'), {
          frango: frango,
          bode: bode,
          tambaqui: tambaqui,
          tilapia: tilapia,
          cxMole:cxMole,
          picanha: picanha,
          acem: acem,
          lombo: lombo,
          leitao: leitao,
          rodilan:rodilan,
        })
        .then(()=>{
            console.log("enviado")
        })
        ;
      }

    return(
        <ScrollView style={{}}>
        <View style={styles.container}>
            <Text style={styles.titulo}>Preços</Text>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>FRANGO: </Text>
                </View>
                <View style={{width:250}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={frango}
                        onChangeText={value => setFrango(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>BODE: </Text>
                </View>
                <View style={{width:250}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={bode}
                        onChangeText={value => setBode(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>TAMBAQUI: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={tambaqui}
                        onChangeText={value => setTambaqui(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>TILAPIA: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={tilapia}
                        onChangeText={value => setTilapia(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>CX. MOLE: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={cxMole}
                        onChangeText={value => setCxMole(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>PICANHA: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={picanha}
                        onChangeText={value => setPicanha(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>ACÉM: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={acem}
                        onChangeText={value => setAcem(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>LOMBO: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/kg'
                        value={lombo}
                        onChangeText={value => setLombo(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>RODILAN: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='Unidade'
                        value={rodilan}
                        onChangeText={value => setRodilan(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', marginTop:20, alignSelf:'center'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.item}>LEITÃO: </Text>
                </View>
                <View style={{width:200}}>
                    <FloatingLabelInput
                        label='R$/Kg'
                        value={leitao}
                        onChangeText={value => setLeitao(value)}
                        containerStyles={styles.inputFloat}
                        customLabelStyles={{
                            colorFocused:'#ffbc43',
                            colorBlurred:'#ffbc43'
                        }}
                        inputStyles={{color:'#ffbc43'}}
                        inputMode="numeric"
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.butaoSalvar} onPress={()=>sendData(frango, bode, tambaqui, tilapia, cxMole, picanha, acem, lombo, leitao, rodilan)}>
                <Text style={styles.textButton}>SALVAR</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#111111',
        paddingTop:35,
    },
    titulo:{
        fontSize:35,
        textAlign:'center',
        textTransform:'uppercase',
        fontWeight:'bold',
        marginTop:5,
        color:'#ffbc43',
        fontFamily:'Inter_400Regular', 
        textDecorationLine:'underline',
    },
    inputFloat: {
        backgroundColor: "#2f2f2f",
        width: 60,
        height: 65,
        paddingHorizontal: 5,
        borderRadius: 8,
        borderColor: "#ffcb74",
        borderWidth:1
    },
    item:{
        fontSize:25,
        color:'#ffbc43',
        
    },
    butaoSalvar:{
        width:150,
        height:60,
        elevation:10,
        shadowColor:'#ffbc43',
        backgroundColor:'green',
        alignSelf:'center',
        marginTop:20,
        marginBottom:35,
        borderRadius:12,
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#ffbc43'
    },
    textButton:{
        fontSize:15,
        color:'#fff',
        fontWeight:'500'
    },

})