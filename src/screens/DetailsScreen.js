import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Dicionário de tradução para os detalhes também
const traducoes = {
  "Blue & Black Check Shirt": "Camisa Xadrez Azul e Preta",
  "Gigabyte Aorus Men Tshirt": "Camiseta Masculina Gigabyte Aorus",
  "Man Plaid Shirt": "Camisa Xadrez Masculina",
  "Man Short Sleeve Shirt": "Camisa Masculina de Manga Curta",
  "Men Check Shirt": "Camisa Xadrez Masculina",
  "Classic Long Sleeve Shirt": "Camisa clássica de manga longa",
  "Casual Slim Fit Shirt": "Camisa casual slim fit",
  "Skinosaur Graphic T-Shirt": "Camiseta estampada Skinosaur",
  "Man's Leather Watch": "Relógio de couro masculino",
  "Sports Watch": "Relógio esportivo",
  "Black Leather Shoes": "Sapato social de couro preto",
  "Sports Sneakers": "Tênis esportivo masculino",
  "Hobo Bag": "Bolsa Hobo estilosa",
  "Leather Purse": "Carteira de couro feminina",
  "Mini Crossbody Bag": "Bolsa transversal mini",
  "Red Lipstick": "Batom vermelho elegante",
  "Feminine Maxi Dress": "Vestido longo feminino",
  "Nude Gradient Dress": "Vestido degradê nude",
  "Silver Diamond Bracelet": "Pulseira de prata com zircônia",
  "Golden Necklace": "Colar banhado a ouro",
  "Womens Sandals": "Sandália feminina casual",
  "Pumps Heels": "Sapato de salto alto",
  "Womens Watch": "Relógio feminino elegante"
};

const traduzirTexto = (texto) => traducoes[texto] || texto;

export default function DetailsScreen({ route, navigation }) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${produtoId}`)
      .then(resposta => {
        setProduto(resposta.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error(err);
        setErro('Não foi possível carregar os detalhes do produto.');
        setCarregando(false);
      });
  }, [produtoId]);

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.textoCarregando}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.textoErro}>{erro}</Text>
      </View>
    );
  }

  const precoOriginal = produto.price;
  const desconto = produto.discountPercentage || 0;
  const precoComDesconto = precoOriginal * (1 - desconto / 100);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: produto.thumbnail }} style={styles.imagem} />
      
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{traduzirTexto(produto.title)}</Text>
        
        <View style={styles.precoContainer}>
          <Text style={styles.preco}>R$ {precoComDesconto.toFixed(2)}</Text>
          {desconto > 0 && (
            <Text style={styles.descontoTag}>-{desconto}% de desconto</Text>
          )}
        </View>

        <Text style={styles.secaoTitulo}>Descrição do Produto</Text>
        <Text style={styles.descricao}>{traduzirTexto(produto.description)}</Text>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoVoltarTexto}>Voltar ao Catálogo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  textoErro: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  imagem: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#f8f9fa',
  },
  conteudo: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  preco: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginRight: 12,
  },
  descontoTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#e03131',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 30,
  },
  botaoVoltar: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoVoltarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});