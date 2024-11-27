import { StyleSheet, View, Text, Image, Button } from 'react-native';
import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const WelcomeScreen = () => (
  <View style={styles.welcomeContainer}>
    <Image source={require('./ISF_SolucoesEmSeguranca_Logo.png')} style={styles.logo} />
    <Text style={styles.welcomeTitle}>Bem-vindo ao Aplicativo de Orçamentos</Text>
    <Text style={styles.welcomeSubtitle}>Crie propostas comerciais com facilidade</Text>
  </View>
);

interface ProductCheckboxesProps {
  selectedProducts: Record<string, boolean>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  productQuantities: Record<string, number>;
  setProductQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const ProductCheckboxes: React.FC<ProductCheckboxesProps> = ({
  selectedProducts,
  setSelectedProducts,
  productQuantities,
  setProductQuantities,
}) => {
  const products = ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4', 'Produto 5'];

  const handleIncrement = (product: string) => {
    setProductQuantities({
      ...productQuantities,
      [product]: productQuantities[product] + 1,
    });
  };

  const handleDecrement = (product: string) => {
    if (productQuantities[product] > 0) {
      setProductQuantities({
        ...productQuantities,
        [product]: productQuantities[product] - 1,
      });
    }
  };

  const handleToggle = (product: string) => {
    setSelectedProducts({
      ...selectedProducts,
      [product]: !selectedProducts[product],
    });
  };

  return (
    <View>
      {products.map((product) => (
        <View key={product} style={styles.checkboxContainer}>
          <CheckBox
            value={!!selectedProducts[product]}
            onValueChange={() => handleToggle(product)}
          />
          <Text style={styles.productText}>{product}</Text>
          {selectedProducts[product] && (
            <View style={styles.quantityContainer}>
              <Text onPress={() => handleDecrement(product)} style={[styles.quantityButton, {fontSize: 24 as number}]}>-</Text>
              <Text style={styles.quantityText}>{productQuantities[product]}</Text>
              <Text onPress={() => handleIncrement(product)} style={[styles.quantityButton, {fontSize: 24 as number}]}>+</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

interface BudgetButtonProps {
  selectedProducts: Record<string, boolean>;
  productQuantities: Record<string, number>;
}

const BudgetButton: React.FC<BudgetButtonProps> = ({ selectedProducts, productQuantities }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const productPrices: Record<string, number> = {
    'Produto 1': 10,
    'Produto 2': 20,
    'Produto 3': 30,
    'Produto 4': 40,
    'Produto 5': 50,
  };

  const handlePress = () => {
    const selectedProductsList = Object.keys(selectedProducts).filter(
      (product) => selectedProducts[product] && productQuantities[product] > 0
    );
    const selectedProductQuantities = selectedProductsList.map((product) => ({
      product,
      quantity: productQuantities[product],
      price: productPrices[product],
    }));

    navigation.navigate('BudgetScreen', { selectedProductQuantities });
  };

  return (
    <View style={styles.budgetButtonContainer}>
      <Button title="Gerar orçamento" onPress={handlePress} />
    </View>
  );
};

import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  BudgetScreen: { selectedProductQuantities: { product: string; quantity: number; price: number; }[] };
};

const BudgetScreen = ({ route }: { route: RouteProp<RootStackParamList, 'BudgetScreen'> }) => {
  const { selectedProductQuantities } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require('./ISF_SolucoesEmSeguranca_Logo.png')} style={styles.logo} />
      <Text style={styles.welcomeTitle}>Orçamento</Text>
      <TotalProducts products={selectedProductQuantities} />
      <ExportButton products={selectedProductQuantities} />
    </View>
  );
};

const calculateTotalProducts = (products: { product: string; quantity: number; price: number; }[]) => {
  return products.reduce((total, { quantity }) => total + quantity, 0);
};

const calculateTotalPrice = (products: { product: string; quantity: number; price: number; }[]) => {
  return products.reduce((total, { quantity, price }) => total + (quantity * price), 0);
};

const TotalProducts: React.FC<{ products: { product: string; quantity: number; price: number; }[] }> = ({ products }) => {
  const totalQuantity = calculateTotalProducts(products);
  const totalPrice = calculateTotalPrice(products);
  return (
    <View>
      {products.map(({ product, quantity, price }) => (
        <Text key={product} style={{ fontSize: 18 as number }}>{`${quantity}x ${product} - R$${price * quantity}`}</Text>
      ))}

      <Text style={[styles.totalText, { fontWeight: 'bold' as const }]}>Total de Produtos: {totalQuantity}</Text>
      <Text style={{ fontSize: 18 as number, fontWeight: 'bold' as const }}>Total a Pagar: R${totalPrice}</Text>

    </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const initialProducts = ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4', 'Produto 5'];
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>(
    initialProducts.reduce((acc, product) => ({ ...acc, [product]: false }), {})
  );
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>(
    initialProducts.reduce((acc, product) => ({ ...acc, [product]: 0 }), {})
  );

  return (
    <View style={styles.container}>
      <WelcomeScreen />
      <ProductCheckboxes
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        productQuantities={productQuantities}
        setProductQuantities={setProductQuantities}
      />
      <BudgetButton selectedProducts={selectedProducts} productQuantities={productQuantities} />
    </View>
  );
};

const ExportButton: React.FC<{ products: { product: string; quantity: number; price: number; }[] }> = ({ products }) => {
  const createPDF = async () => {
    const totalPrice = calculateTotalPrice(products);
    const totalQuantity = calculateTotalProducts(products);

    const htmlContent = `
         <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #2e78b7;">Orçamento</h1>
        <div style="margin-bottom: 30px;"></div>
            <img src="https://isf.com.br/wp-content/uploads/2020/09/ISF_SolucoesEmSeguranca_Logo.png" style="width: 300px; height: auto;"/>
        </div>
        <div style="font-family: 'Georgia', serif;"></div>
            <p style="margin-top: 20px; font-size: 18px;">Detalhes do Orçamento:</p>
            ${products.map(({ product, quantity, price }) => `
                <p style="font-size: 16px;">${quantity}x ${product} - R$${(price * quantity).toFixed(2)}</p>
            `).join('')}
            <p style="margin-top: 20px; font-size: 18px;">Total de Produtos: ${totalQuantity}</p>
            <p style="font-size: 18px; font-weight: bold;">Total a Pagar: R$${totalPrice.toFixed(2)}</p>
        </div>
    </div> 
    `;

    try {
      const options = {
      html: htmlContent,
      fileName: 'Orcamento',
      directory: 'Documents',
      base64: true, // Option to get the PDF as a base64 string
      padding: 10, // Padding around the content
      quality: 'high', // Quality of the PDF (low, medium, high)
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF created at:', file.filePath);
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };

  return (
    <View style={styles.exportButton}>
      <Button title="Exportar" onPress={createPDF} />
    </View>
  );
};

const RootNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={App} />
          <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  productText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
  },
  budgetButtonContainer: {
    marginTop: 20,
  },
  exportButton: {
    marginTop: 30,
  },
  totalText: {
    marginTop: 15,
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 87,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e78b7',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
});

export default RootNavigator;
