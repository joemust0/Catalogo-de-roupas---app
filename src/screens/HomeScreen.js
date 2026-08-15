import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

// Dicionário atualizado com os títulos exatos retornados pela API DummyJSON
const traducoes = {
  // Masculino - Camisas (mens-shirts)
  "Blue & Black Check Shirt": "Camisa Xadrez Azul e Preta",
  "Gigabyte Aorus Men Tshirt": "Camiseta Masculina Gigabyte Aorus",
  "Man Plaid Shirt": "Camisa Xadrez Masculina",
  "Man Short Sleeve Shirt": "Camisa Masculina de Manga Curta",
  "Men Check Shirt": "Camisa Xadrez Masculina",
  
  // Outros genéricos caso mudem
  "Classic Long Sleeve Shirt": "Camisa clássica de manga longa",
  "Casual Slim Fit Shirt": "Camisa casual slim fit",
  "Skinosaur Graphic T-Shirt": "Camiseta estampada Skinosaur",
  "Man's Leather Watch": "Relógio de couro masculino",
  "Sports Watch": "Relógio esportivo",
  "Black Leather Shoes": "Sapato social de couro preto",
  "Sports Sneakers": "Tênis esportivo masculino",
  
  // Feminino
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

const traduzirTexto = (texto) => {
  return traducoes[texto] || texto;
};

export default function HomeScreen({ navigation }) {
  const categoriasMasculinas = ['mens-shirts', 'mens-shoes', 'mens-watches'];
  const categoriasFemininas = ['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'];

  const [tipoGenero, setTipoGenero] = useState('masculino');
  const [categoriaAtual, setCategoriaAtual] = useState('mens-shirts');
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarProdutos(categoriaAtual);
  }, [categoriaAtual]);

  const carregarProdutos = (cat) => {
    setCarregando(true);
    setErro(null);
    axios.get(`https://dummyjson.com/products/category/${cat}`)
      .then(resposta => {
        setProdutos(resposta.data.products);
        setCarregando(false);
      })
      .catch(err => {
        console.error(err);
        setErro('Não foi possível carregar os produtos. Verifique sua conexão.');
        setCarregando(false);
      });
  };

  const mudarGenero = (genero) => {
    setTipoGenero(genero);
    if (genero === 'masculino') {
      setCategoriaAtual('mens-shirts');
    } else {
      setCategoriaAtual('womens-bags');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tituloCabecalho}>Catálogo de Produtos</Text>

      {/* Abas de Gênero */}
      <View style={styles.abasContainer}>
        <TouchableOpacity 
          style={[styles.botaoAba, tipoGenero === 'masculino' && styles.abaAtiva]} 
          onPress={() => mudarGenero('masculino')}
        >
          <Text style={[styles.textoAba, tipoGenero === 'masculino' && styles.textoAbaAtivo]}>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.botaoAba, tipoGenero === 'feminino' && styles.abaAtiva]} 
          onPress={() => mudarGenero('feminino')}
        >
          <Text style={[styles.textoAba, tipoGenero === 'feminino' && styles.textoAbaAtivo]}>Feminino</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-categorias (Scroll horizontal) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subCategoriasContainer}>
        {(tipoGenero === 'masculino' ? categoriasMasculinas : categoriasFemininas).map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.chipCategoria, categoriaAtual === cat && styles.chipAtivo]}
            onPress={() => setCategoriaAtual(cat)}
          >
            <Text style={[styles.textoChip, categoriaAtual === cat && styles.textoChipAtivo]}>
              {cat.replace('mens-', '').replace('womens-', '').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {carregando ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.textoCarregando}>Carregando produtos...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centralizado}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const precoOriginal = item.price;
            const desconto = item.discountPercentage || 0;
            const precoComDesconto = precoOriginal * (1 - desconto / 100);

            return (
              <TouchableOpacity 
                style={styles.cartao}
                onPress={() => navigation.navigate('Details', { produtoId: item.id })}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.imagem} />
                <View style={styles.informacoes}>
                  <Text style={styles.tituloProduto} numberOfLines={2}>{traduzirTexto(item.title)}</Text>
                  <View style={styles.precoContainer}>
                    <Text style={styles.precoProduto}>R$ {precoComDesconto.toFixed(2)}</Text>
                    {desconto > 0 && (
                      <Text style={styles.descontoTag}>-{desconto}%</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  tituloCabecalho: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  abasContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
  },
  botaoAba: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  abaAtiva: {
    backgroundColor: '#007bff',
  },
  textoAba: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  textoAbaAtivo: {
    color: '#fff',
  },
  subCategoriasContainer: {
    maxHeight: 45,
    marginBottom: 12,
  },
  chipCategoria: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 36,
    justifyContent: 'center',
  },
  chipAtivo: {
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },
  textoChip: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  textoChipAtivo: {
    color: '#fff',
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
  cartao: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagem: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 12,
  },
  informacoes: {
    flex: 1,
  },
  tituloProduto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precoProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginRight: 8,
  },
  descontoTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#e03131',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});