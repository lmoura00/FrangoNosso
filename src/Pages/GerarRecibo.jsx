import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export function GerarRecibo() {
  const [nomeCliente, setNomeCliente] = useState(""); 
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [items, setItems] = useState([]);

  const arredondarParaMultiploMaisProximo = (valor, multiplo) => {
    return Math.ceil(valor / multiplo) * multiplo;
  };

  const generatePDF = async () => {
    if (!nomeCliente) {
      Alert.alert("Atenção...", "Por favor, insira o nome do cliente.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Atenção...", "Sem elementos na nota fiscal");
      return;
    }

    const total = arredondarParaMultiploMaisProximo(
      items.reduce((sum, item) => sum + item.quantidade * item.preco, 0),
      0.05
    );

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString();
    const horarioFormatado = dataAtual.toLocaleTimeString();

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .logo { text-align: center; margin-bottom: 20px; position: absolute; right: auto; }
            .pix{text-align: center; margin-bottom: 20px; position: absolute; right: auto;}
            .logo img { max-width: 180px; }
            .pixImg{max-width: 180px;}
            .header { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; }
            .cliente { margin-bottom: 20px; font-size: larger; font-weight: 800; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .table th { background-color: #f4f4f4; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; font-size: x-large; margin-bottom:20px }
          </style>
        </head>
        <body>
          <div >
            <div class="logo">
              <img src="https://i.ibb.co/c8q65ct/fran.png" alt="Logo" />
            </div>
            <div class="header">
              <h1>Recibo de Venda</h1>
              <p>Data: ${dataFormatada}</p>
              <p>Horário: ${horarioFormatado}</p>
            </div>
          </div>
          <hr>
          <div class="cliente">
            <p><strong>Cliente:</strong> ${nomeCliente}</p>
          </div>
          <hr>
          <table class="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) =>
                    `<tr>
                      <td>${item.descricao}</td>
                      <td>${item.quantidade}</td>
                      <td>R$ ${item.preco.toFixed(2)}</td>
                      <td>R$ ${(item.quantidade * item.preco).toFixed(2)}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <hr>
          <div class="total">
            Valor Final: R$ ${total.toFixed(2)}
          </div>
        </body>
        <hr>
        <footer>
          <div style="display: flex; justify-content: space-evenly;">

            <div style="font-size: larger; margin: 10px; margin-top: 25;">
              <div style="font-weight: bold; margin-bottom: 10;">
                Chave PIX: 86 9 8834 - 1700
              </div>
              <div style="font-weight: bold; margin-bottom: 10;">
                Banco: PagBank
              </div>
              <div style="font-weight: bold; margin-bottom: 10;">
                Nome: João de Castro Moura Neto
              </div>
            </div>
            <div class="pixImg">
              <img src="https://i.ibb.co/80j0K69/1000167281-ea2f31157394ad2bd0c097b371f3f146-07-01-2024-09-56-59.png" alt="pix" style="width: 150px; height: 150;" />
            </div>
          </div>
        </footer>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      Alert.alert("Sucesso", `PDF gerado em: ${uri}`);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        setItems([]);
        setNomeCliente(""); 
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível no dispositivo.");
      }
    } catch (err) {
      Alert.alert("Erro", `Falha ao gerar recibo: ${err.message}`);
    }
  };

  const adicionarProduto = () => {
    if (!descricao || isNaN(preco) || isNaN(quantidade)) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente.");
      return;
    }

    const novoItem = {
      descricao,
      quantidade: parseFloat(quantidade),
      preco: parseFloat(preco),
    };

    setItems((prevItems) => [...prevItems, novoItem]);
    setDescricao("");
    setQuantidade("");
    setPreco("");

    Alert.alert(
      "Produto Adicionado",
      `Item adicionado com sucesso.`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.Title}>Gerar recibo</Text>

        <TextInput
          placeholder="Nome do Cliente"
          value={nomeCliente}
          onChangeText={(text) => setNomeCliente(text)}
          placeholderTextColor={"#ffbc43"}
          style={styles.input}
        />
        <TextInput
          placeholder="Qual o produto?"
          value={descricao}
          onChangeText={(i) => setDescricao(i)}
          placeholderTextColor={"#ffbc43"}
          style={styles.input}
        />
        <TextInput
          placeholder="Qual o valor?"
          value={preco}
          onChangeText={(i) => setPreco(i)}
          keyboardType="decimal-pad"
          placeholderTextColor={"#ffbc43"}
          style={styles.input}
        />
        <TextInput
          placeholder="Quantas unidades?"
          value={quantidade}
          onChangeText={(i) => setQuantidade(i)}
          keyboardType="decimal-pad"
          placeholderTextColor={"#ffbc43"}
          style={styles.input}
        />
        <TouchableOpacity style={styles.btSalvar} onPress={adicionarProduto}>
          <Text style={styles.textBtSalvar}>Adicionar produto</Text>
        </TouchableOpacity>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.descricao}</Text>
              <Text style={styles.itemText}>{item.quantidade}</Text>
              <Text style={styles.itemText}>R$ {item.preco.toFixed(2)}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.btSalvar} onPress={generatePDF}>
          <Text style={styles.textBtSalvar}>Gerar Recibo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Mantendo os mesmos estilos anteriores
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingTop: 35,
    paddingHorizontal: 10,
  },
  Title: {
    color: "#ffbc43",
    fontSize: 35,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ffbc43",
    color: "#ffbc43",
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffbc43",
  },
  itemText: {
    color: "#ffbc43",
  },
  btSalvar: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  textBtSalvar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
});
