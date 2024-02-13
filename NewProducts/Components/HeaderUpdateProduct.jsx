import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';



const UpdateHeader = () =>  {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.BotonModificar}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        >
        <Image
        source={require('./Imagenes/image (3).png')}
        style={styles.TextoModificar}
        />
      </TouchableOpacity>
      </View>
      <Text style = {styles.titulo}>Modificar producto
      </Text>
      <Text style = {styles.subtitulo}>Rellena los siguientes campos</Text>
    </View>
  );
  }

const styles = StyleSheet.create({
    titulo: {
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: 'bold',
      marginLeft:15,
      marginTop:70
    },
    subtitulo:{
      fontSize: 13,
      color: "#FFFFFF",
      fontWeight: 'bold',
      marginLeft:15,
    },
    BotonModificar: {
      position: 'absolute',
      left: Constants.statusBarHeight * 0.1,
      padding: 10,
      alignSelf: 'flex-end'
    },
  });

export default UpdateHeader