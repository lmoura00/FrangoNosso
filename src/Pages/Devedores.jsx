import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, set, get, child, push } from 'firebase/database';

export function Devedores() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [devedores, setDevedores] = useState([]);
  const [Clientes, SetCliente] = useState([]);
  const [ClientesDados, SetClienteDados] = useState([]);
  const [listKeyDevedores, setListKeyDevedores] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [DadosClientes, setDadosClientes] = useState('');
  const [DadosDevedores, setDadosDevedores] = useState('');
  const pickerRef = useRef();

  const db = getDatabase();
  const dbRef = ref(db);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${day}/${month}/${year}`;

  async function getCliente() {
    const snapshot = await get(child(dbRef, 'Clientes/'));
    const userData = [];

    snapshot.forEach((childItem) => {
      let data = {
        key: childItem.key,
        name: childItem.val().name,
        telefone: childItem.val().telefone,
      };
      userData.push(data);
    });

    userData.sort((a, b) => a.name.localeCompare(b.name));
    const nomesClientes = userData.map((item) => item.name);
    SetCliente(nomesClientes);
    SetClienteDados(userData);
  }

  async function readDataDevedores() {
    const snapshot = await get(child(dbRef, 'Devedores/'));
    const userDataRead = [];

    snapshot.forEach((childItem) => {
      let date = {
        key: childItem.key,
        name: childItem.val().name,
        telefone: childItem.val().telefone,
        valor: childItem.val().valor,
        data: childItem.val().data,
      };
      userDataRead.push(date);
    });

    setDadosDevedores(userDataRead);
    setListKeyDevedores(DadosDevedores.map(item => item.key));
  }

  async function fetchDevedores() {
    try {
      const snapshot = await get(child(dbRef, 'Devedores'));
      const devedoresData = [];

      snapshot.forEach((childSnapshot) => {
        const devedorData = childSnapshot.val();
        const devedor = {
          key: childSnapshot.key,
          name: devedorData.name,
          valor: devedorData.valor,
          timestamp: devedorData.timestamp
        };
        devedoresData.push(devedor);
      });

      setDevedores(devedoresData);
    } catch (error) {
      console.error('Erro ao buscar devedores:', error);
    }
  }

  const handleChangeCliente = (itemValue, itemIndex) => {
    setClienteSelecionado(itemValue);
    const clienteSelecionado = ClientesDados.find(item => item.name === itemValue);
    setDadosClientes(clienteSelecionado);
    console.log(DadosClientes);
  };

  const Day = Date();
  async function sendData() {
    const timestamp = new Date().getTime();
    const key = push(child(ref(db), 'Child')).key;

    try {
      const devedorExistente = listKeyDevedores.find(item => item === DadosClientes.key);
      console.log(listKeyDevedores);
      console.log(DadosClientes);
      if (devedorExistente) {
        await set(ref(db, `Devedores/${DadosClientes.key}/${key}`), {
          valor: valor,
          timestamp: data
        }).then(() => {
          console.log('Novo valor adicionado para o devedor existente');
        }).catch(error => {
          console.log('Erro ao adicionar novo valor:', error);
        });
      } else {
        await set(ref(db, 'Devedores/' + DadosClientes.key + '/'), {
          name: DadosClientes.name,
          dataInsercao: data,
          [key]: {
            valor: valor,
            timestamp: Day
          }
        }).then(() => {
          console.log('Novo devedor adicionado');
        }).catch(error => {
          console.log('Erro ao adicionar novo devedor:', error);
        });
      }
      setModalOpen(false);
      Alert.alert("Atenção", "O cadastro foi efetuado com sucesso!")
    } catch (error) {
      console.log('Erro:', error);
    }
  }

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ color: '#fff' }}>{`Nome: ${item.name}`}</Text>
      <Text style={{ color: '#fff' }}>{`Valor: ${item.valor}`}</Text>
      <Text style={{ color: '#fff' }}>{`Data: ${item.timestamp}`}</Text>
    </View>
  );

  useEffect(() => {
    getCliente();
    readDataDevedores();
    fetchDevedores();
    console.log(devedores);
    console.log(formattedDate);
  }, []);

  return (
    <View style={styles.container}>
      <Modal visible={modalOpen} statusBarTranslucent transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modal}>
            <Text style={styles.Title1}>ADICIONAR</Text>
            <View style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 10, borderWidth: 2, borderColor: '#48658c', borderRadius: 15 }}>
              {Clientes && (
                <Picker
                  ref={pickerRef}
                  style={{ color: '#ffbc43', borderWidth: 2 }}
                  selectedValue={clienteSelecionado}
                  onValueChange={(itemValue, itemIndex) => handleChangeCliente(itemValue, itemIndex)}
                >
                  {Clientes.map((cliente, index) => (
                    <Picker.Item key={index} label={cliente} value={cliente} />
                  ))}
                </Picker>
              )}
            </View>
            <View style={{ marginBottom: 10, paddingHorizontal: 10, marginTop: 10 }}>
              <TextInputMask
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                  suffixUnit: ''
                }}
                value={valor}
                onChangeText={(text) => setValor(text)}
                customTextInput={FloatingLabelInput}
                customTextInputProps={{
                  label: 'VALOR',
                  hint: 'R$00,00',
                  hintTextColor: '#ffbc43',
                  containerStyles: styles.inputFloat,
                  customLabelStyles: { colorFocused: '#ffbc43', colorBlurred: '#ffbc43' },
                  inputStyles: { color: '#ffbc43' }
                }}
              />
            </View>
            <View style={{ marginBottom: 10, paddingHorizontal: 10, marginTop: 10 }}>
              <FloatingLabelInput
                label='DATA'
                value={data}
                onChangeText={(value) => setData(value)}
                containerStyles={styles.inputFloat}
                inputMode='numeric'
                mask='00/00/0000'
                hint={formattedDate}
                hintTextColor='#ffbc43'
                customLabelStyles={{ colorFocused: '#ffbc43', colorBlurred: '#ffbc43' }}
                inputStyles={{ color: '#ffbc43' }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 120 }}>
              <TouchableOpacity style={styles.btSalvar} onPress={() => sendData()}>
                <Text style={styles.textBtSalvar}>SALVAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btFechar} onPress={() => setModalOpen(false)}>
                <Text style={styles.textBtFechar}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Text style={styles.Title}>Devedores</Text>
      <FlatList
        data={devedores}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text style={{ color: '#fff' }}>Nenhum devedor encontrado</Text>}
      />

      <TouchableOpacity
        style={modalOpen !== true ? styles.btAdd : styles.btAddOff}
        onPress={() => setModalOpen(true)}
      >
        <Text style={styles.textBtAdd}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    paddingTop:35
  },
  Title: {
    color: '#ffbc43',
    fontSize: 35,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  Title1: {
    color: '#ffbc43',
    fontSize: 25,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  btAdd: {
    backgroundColor: 'green',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderColor: '#ffbc43',
    borderWidth: 2,
    position: 'absolute',
    right: 20,
    bottom: 30,
    elevation: 10,
  },
  btAddOff: {
    backgroundColor: 'green',
    display: 'none',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderColor: '#ffbc43',
    borderWidth: 2,
    position: 'absolute',
    right: 20,
    bottom: 30,
    elevation: 10,
  },
  textBtAdd:{
    fontSize:40,
    fontWeight:'900'
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#2f2f2f',
    borderRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ffbc43',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  btSalvar: {
    backgroundColor: 'green',
    width: 90,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  textBtSalvar: {
    color: '#ffbc43',
    fontSize: 18,
    fontWeight: '600',
  },
  btFechar: {
    backgroundColor: 'red',
    width: 90,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  textBtFechar: {
    color: '#ffbc43',
    fontSize: 18,
    fontWeight: '600',
  },
  inputFloat: {
    borderWidth: 1,
    borderColor: '#ffbc43',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
});
