import { StyleSheet, View, TextInput, Image, TouchableOpacity, Text, ImageBackground, ScrollView, Alert, Button, Switch} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import theme from "../../Inventory/Themes/Theme";
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useContact } from '../../Context/ContactContext';
import DateTimePicker from "@react-native-community/datetimepicker"
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from "expo-image-picker"
import { storage } from '../../NewProducts/Components/firebaseconfig';
import {ref,uploadBytesResumable,getDownloadURL} from "firebase/storage"


const image = require("../Assets/Fondo.png");

const NewContact = () => {
  const [cont_tipo_documento, setContTipoDocumento] = useState('');
  const [cont_id_fiscal, setContIdFiscal] = useState('');
  const [nombre, setNombre] = useState('');
  const [fecha_nacimiento, setFechaNacimiento] = useState(new Date());
  const [cod_telefono, setCodTelefono] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contribuyente, setContribuyente] = useState(false);
  const [condicion_venta, setCondicionVenta] = useState('');
  const [credito_total, setCreditoTotal] = useState(0);
  const [credito_vence, setCreditoVence] = useState(new Date());
  const [vendedor, setVendedor] = useState(false);
  const [fecha_ingreso, setFechaIngreso] = useState(new Date());
  const [cliente, setCliente] = useState(false);
  const [empleado, setEmpleado] = useState(false);
  const [proveedor, setProveedor] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [Contacto_pkey, setContactoPkey] = useState('');
  const navigation = useNavigation()
  const { createContact } = useContact()

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setFechaNacimiento(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [mode1, setMode1] = useState('date');
  const [show1, setShow1] = useState(false);

  const onChange1 = (event, selectedDate1) => {
    const currentDate1 = selectedDate1;
    setShow1(false);
    setFechaIngreso(currentDate1);
  };

  const showMode1 = (currentMode1) => {
    setShow1(true);
    setMode1(currentMode1);
  };

  const showDatepicker1 = () => {
    showMode1('date');
  };
  const [mode2, setMode2] = useState('date');
  const [show2, setShow2] = useState(false);

  const onChange2 = (event, selectedDate2) => {
    const currentDate2 = selectedDate2;
    setShow2(false);
    setCreditoVence(currentDate2);
  };

  const showMode2 = (currentMode2) => {
    setShow2(true);
    setMode2(currentMode2);
  };

  const showDatepicker2 = () => {
    showMode2('date');
  };

  const opciones_ID =[
    { label: 'V', value: "V" },
    { label: 'E', value: "E"},
    { label: 'J', value: "J"}
  ]

  const opciones = [
    { label: 'C', value: "C" },
    { label: 'Co', value:"Co" },
  ]

  const opciones_telefono = [
    { label: "+58", value: "+58"},
    { label: "+1", value: "+1"},
    { label: "+52", value: "+52"},
    { label: "+55", value: "+55"},
    { label: "+54", value: "+54"},
    { label: "+57", value: "+57"},
    { label: "+34", value: "+34"},
    { label: "+44", value: "+44"},
    { label: "+48", value: "+48"},
    { label: "+86", value: "+86"},
  ]

  const opciones_cargo = [
    { label: 'Empleado' },
    { label: 'Cliente' },
    { label: 'Proveedor' },
    { label: 'Contribuyente' },
    { label: 'Vendedor' },
  ]

  const [value, setValue] = useState(null);
  const [value_phone, setValue_phone] = useState(null);
  const [value_venta, setValue_venta] = useState(null);
  
  const [isEnabled_empleado, setIsEnabled_empleado] = useState(false);
  const toggleSwitch_empleado = (new_value) => {
    setIsEnabled_empleado(new_value)
    setEmpleado(new_value)
  }
   
  

  const [isEnabled_cliente, setIsEnabled_cliente] = useState(false);
  const toggleSwitch_cliente = (new_value) => {
    setIsEnabled_cliente(new_value)
    setCliente(new_value)
  }
    
  

  const [isEnabled_proveedor, setIsEnabled_proveedor] = useState(false);
  const toggleSwitch_proveedor = (new_value) => {
    setIsEnabled_proveedor(new_value)
    setProveedor(new_value)
    
  }

  const [isEnabled_contribuyente, setIsEnabled_contribuyente] = useState(false);
  const toggleSwitch_contribuyente = (new_value) => {
    setIsEnabled_contribuyente(new_value)
    setContribuyente(new_value)
  }
    
  

  const [isEnabled_vendedor, setIsEnabled_vendedor] = useState(false);
  const toggleSwitch_vendedor = (new_value) => {
    setIsEnabled_vendedor(new_value)
    setVendedor(new_value)
  }



  const [imgUrl, setimgUrl] = useState("https://ktwhvzmmaqaumjvobuqn.supabase.co/storage/v1/object/public/imagenes/Component%2012.png?t=2024-03-05T23%3A36%3A47.376Z")
  const [showView, setShowView] = useState(false);
    const handlePress = () => {
      setShowView(!showView);
    };

    

    const openCameraLib = async() =>{
      let result = await ImagePicker.launchCameraAsync({cameraType: ImagePicker.CameraType.front});
      if (!result.canceled) {
        setimgUrl(result.assets[0].uri);
        await uploadImage(result.assets[0].uri, "image");
      }
      async function uploadImage(uri, fileType){
        const response = await fetch(uri)
        const blob =  await response.blob()
    
        const storageRef = ref(storage,"Imagenes/"+new Date().getTime())
        const uploadTask = uploadBytesResumable(storageRef,blob)
    
        uploadTask.on("state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log("Upload is" + progress + "% done")
          },
          (error) =>{
    
          },
          () =>{
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) =>{
              console.log("File available at", downloadURL)
              setImagen(downloadURL)
            })
          }
          )
      }
  }

  

 
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setimgUrl(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image");
    }

    
    async function uploadImage(uri, fileType){
      const response = await fetch(uri)
      const blob =  await response.blob()
  
      const storageRef = ref(storage,"Perfiles/"+new Date().getTime())
      const uploadTask = uploadBytesResumable(storageRef,blob)
  
      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log("Upload is" + progress + "% done")
          if(progress === 100){
            Alert.alert("Imagen cargada")
          }
        },
        (error) =>{
  
        },
        () =>{
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) =>{
            console.log("File available at", downloadURL)
            setImagen(downloadURL)
          })
        }
        )
    }
  }


  
    const isValidNumber = (value) => {
      const numberValue = parseFloat(value);
      return !isNaN(numberValue) && numberValue >= 0;
    }

    function isValidString(str) {
      // Verificar si el string no está vacío ni es null ni undefined
      if (str && typeof str === 'string') {
        // Puedes agregar más criterios de validación según tus necesidades
        return true;
      }
      return false;
    }

    const formatFecha = (date) =>{
      const options = {year: "numeric", month: "numeric", day: "numeric"}
      return date.toLocaleDateString(undefined,options)
    }
  
    const img = 'https://ktwhvzmmaqaumjvobuqn.supabase.co/storage/v1/object/public/imagenes/perfil_01%20(1).png?t=2024-03-01T15%3A47%3A27.894Z'

    const handleSubmit = async () => {

      if(imagen === null){
        setImagen(img)
      }

      if (cont_tipo_documento === null || cont_id_fiscal === null || nombre === null || fecha_nacimiento === null || cod_telefono === null || telefono === null || direccion === null) {
        Alert.alert('Error', 'Por favor, completa todos los campos obligatorios');
        return;
      }

      else if (!isValidString(cont_tipo_documento) || !isValidNumber(cont_id_fiscal) || !isValidString(nombre) ||  !isValidNumber(cod_telefono) || !isValidNumber(telefono) || !isValidString(direccion)) {
        Alert.alert('Error', 'Por favor, ingresa valores válidos');
        console.log("Aqui para abajo")
        console.log(cont_tipo_documento,cont_id_fiscal,nombre,cod_telefono,telefono,direccion)
        console.log(typeof cont_tipo_documento)
        console.log(typeof cont_id_fiscal)
        console.log(typeof nombre)
        console.log(typeof cod_telefono)
        console.log(typeof telefono)
        console.log(typeof direccion)
        return;
      }

      else {
      createContact(
        cont_tipo_documento,
        cont_id_fiscal,
        nombre,
        fecha_nacimiento,
        cod_telefono,
        telefono,
        correo,
        direccion,
        contribuyente,
        condicion_venta,
        credito_total,
        credito_vence,
        vendedor,
        fecha_ingreso,
        cliente,
        empleado,
        proveedor,
        imagen
      )
        Alert.alert('El contacto se agregó de manera exitosa');
        navigation.navigate('VistaContactos')
      };
    }

    

    return(
      <LinearGradient
        colors={[
          "#7227a6",
          "#431b6a",
          "#000000"
        ]}
        style={styles.contenedorPrincipal}
      >
        
        <ScrollView>
        <View>
          <TouchableOpacity style={styles.buttonImage} onPress={handlePress} >
          <Image style = {styles.img} source = {{uri: imgUrl}}/>
          </TouchableOpacity>
            {showView && (
              <View style={{flexDirection: "row", justifyContent: "center"}}>
              <TouchableOpacity onPress = {openCameraLib}>
              <Image style = {{width: 100, height:100}} source={require('./ImagenesContacts/Camara.png')} />
              </TouchableOpacity>
              <TouchableOpacity  onPress = {pickImage}>
              <Image style = {{width: 100, height:100}} source={require('./ImagenesContacts/Image.png')}  />
              </TouchableOpacity>
              </View>
            )}
            <View style = {styles.view_informacion}>
            <View style = {{flexDirection: "row"}}>
            <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/User.png')} />
            <TextInput
            style={styles.textinput}
            placeholder='Nombre y Apellido'
            placeholderTextColor='black'
            onChangeText={(texto0) => setNombre(texto0)}
            />
            </View>
            <View style = {{flexDirection: "row"}}>
            <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/Cake.png')} />
            <TextInput
            style={styles.textinputFecha}
            value = {fecha_nacimiento.toLocaleDateString()}
            title='Fecha de Nacimiento'
            />
            {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fecha_nacimiento}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
            <TouchableOpacity style={styles.botonfecha} onPress={showDatepicker}>
            <Image style = {{width: 30, height:30}} source={require('../Components/ImagenesContacts/Calendario.png')}  />
            </TouchableOpacity>
            </View>
            <View style = {{flexDirection: "row"}}>
            <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/ID.png')} />
            <Dropdown
            style={styles.dropdownID}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={opciones_ID}
            search
            labelField="label"
            valueField="value"
            placeholder='Select Item'
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              setValue(item.value);
              setContTipoDocumento(item.value)
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            />
            <TextInput
            style={styles.textinputID}
            placeholder='123456789'
            placeholderTextColor='black'

            onChangeText={(texto2) => {

              const numeroEntero = parseInt(texto2, 10)
              setContIdFiscal(numeroEntero)}}
            />
            </View>
            <View style = {{flexDirection: "row"}}>
            <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/Location.png')} />
            <TextInput
            style={styles.textinput}
            placeholder='Dirección'
            placeholderTextColor='black'
            onChangeText={(texto3) => setDireccion(texto3)}
            />
            </View>
            <View style = {{flexDirection: "row"}}>
            <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/Phone.png')} />
            <Dropdown
            style={styles.dropdownID}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={opciones_telefono}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder='Select Item'
            searchPlaceholder="Search..."
            value={value_phone}
            onChange={item => {
              setValue_phone(item.value);
              setCodTelefono(item.value)
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            />
            <TextInput
            style={styles.textinputtelefono}
            placeholder='Número de Teléfono'
            placeholderTextColor='black'
            onChangeText={(texto4) =>{
              const numeroEntero = parseInt(texto4, 10)
              setTelefono(numeroEntero)
            }} 
            />
            </View>
        </View>
        </View>
        <View style = {{flexDirection: "row"}}>
        <Image style = {{width: 50, height:50, marginTop: 30, marginLeft: 15}} source={require('../Components/ImagenesContacts/Email.png')} />
            <TextInput
            style={styles.textinput}
            placeholder='Correo Electrónico'
            placeholderTextColor='black'
            onChangeText={(texto5) => setCorreo(texto5)}
            />
        </View>
          <Text  style = {styles.titulos}>Fecha de Ingreso</Text>
        <View style = {{flexDirection: "row"}}>
            <TextInput
            style={styles.textinputFecha}
            value = {fecha_ingreso.toLocaleDateString()}
            onChangeText={(value) => setFechaIngreso(fecha_ingreso)}
            />
            {show1 && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fecha_ingreso}
              mode={mode1}
              is24Hour={true}
              onChange={onChange1}
            />
          )}
            <TouchableOpacity style={styles.botonfecha} onPress={showDatepicker1}>
            <Image style = {{width: 30, height:30}} source={require('../Components/ImagenesContacts/Calendario.png')}  />
            </TouchableOpacity>
            </View>

        <Text style = {styles.titulos}>Condicion de Venta</Text>
        <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={opciones}
        search
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value_venta}
        onChange={item => {
          setValue_venta(item.value);
          setCondicionVenta(item.value)
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />

      <View>
      <Text style = {styles.titulos}>Tipo de Cargo</Text>
      <View style = {{flexDirection: "row"}}>
        <Text>Empleado</Text>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch_empleado}
        value={isEnabled_empleado}
      />
      </View>
      <View style = {{flexDirection: "row"}}>
        <Text>Cliente</Text>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch_cliente}
        value={isEnabled_cliente}
      />
      
      </View>
      <View style = {{flexDirection: "row"}}>
        <Text>Proveedor</Text>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch_proveedor}
        value={isEnabled_proveedor}
      />
      </View>
      <View style = {{flexDirection: "row"}}>
        <Text>Contribuyente</Text>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch_contribuyente}
        value={isEnabled_contribuyente}
      />
      </View>
      <View style = {{flexDirection: "row"}}>
        <Text>Vendedor</Text>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch_vendedor}
        value={isEnabled_vendedor}
      />
      </View>
      </View>
      <View style={{flexDirection: 'row' }}>
        <Text style = {styles.titulos}>Crédito Total</Text>
        <TextInput
            style={styles.textinputFecha}
            onChangeText={(texto7) => setCreditoTotal(texto7)}
            />
      </View>
      <Text style = {styles.titulos}>Crédito Vence</Text>
      <View style={{flexDirection: 'row' }}>
            <TextInput
            style={styles.textinputFecha}
            value = {credito_vence.toLocaleDateString()}
            title='Credito Vence'
            placeholderTextColor='#FFFFFF'
            onChangeText={(value) => setCreditoVence(credito_vence)}
            />
            {show2 && (
            <DateTimePicker
              testID="dateTimePicker"
              value={credito_vence}
              mode={mode2}
              is24Hour={true}
              onChange={onChange2}
            />
          )}
            <TouchableOpacity style={styles.botonfecha} onPress={showDatepicker2}>
            <Image style = {{width: 30, height:30}} source={require('../Components/ImagenesContacts/Calendario.png')}  />
            </TouchableOpacity>
            

      </View>
      <View style={styles.countContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} >
          <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
           
        </View>
        </ScrollView>
        </LinearGradient>
        
    )
}

const styles = StyleSheet.create({
  countContainer: {
    flexDirection: 'row',
    justifyContent: "space-around",
    marginBottom: 50
  },
  view_informacion:{
    backgroundColor: "rgba(0,0,0,0.4)", 
    borderRadius: 18, 
    marginTop: 20
  },
    fondo:{
      backgroundColor: "#86CDF9",
      flex: 1
    },
    titulos:{
      color:"black", 
      fontWeight: "bold",
      fontSize: 20
    },
    buttonText:{
      color:"green",
      fontSize: 30,
      fontWeight: "bold"
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    },
    textinput:{
        padding: 10,
        borderWidth: 2,
        borderColor: "",
        backgroundColor: "rgba(82,209,38,18)",
        textAlign: "center",
        paddingStart: 30, /*Aqui cambio la posicion del texto dentro del input*/
        width: "75%",
        height: 60,
        marginTop: 20,
        marginLeft: 25,
        borderRadius: 25,
    },
    textinputID:{
        padding: 10,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "white",
        textAlign: "center",
        paddingStart: 30, /*Aqui cambio la posicion del texto dentro del input*/
        flex: 1,
        height: 60,
        marginTop: 20,
        marginLeft: 25,
        borderRadius: 25,
    },
    textinputtelefono:{
        padding: 10,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "white",
        textAlign: "center",
        paddingStart: 30, /*Aqui cambio la posicion del texto dentro del input*/
        flex: 1,
        height: 60,
        marginTop: 20,
        marginLeft: 25,
        borderRadius: 25,
    },
    textinputFecha:{
        padding: 10,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "white",
        textAlign: "center",
        paddingStart: 30, /*Aqui cambio la posicion del texto dentro del input*/
        width: 215,
        height: 60,
        marginTop: 20,
        marginLeft: 25,
        borderRadius: 25,
    },
    botonfecha:{
        padding: 10,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "white",
        alignItems: "center",
        width: 60,
        height: 60,
        marginTop: 20,
        marginLeft: 25,
        borderRadius: 25,
    },
    text:{
        color: "black",
        marginTop: 20,
        marginLeft:50
    },
    button: {
        alignItems: 'center',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    countContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        marginBottom: 50
      },
      button: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 10,
      marginTop: 20,
      borderRadius: 5,
      
      },
      buttonText:{
          color:"#000000",
          fontSize: 30,
          fontWeight: "bold"
      },
      container:{
        flex: 1
      },
      image: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
      },
      contenedorPrincipal: {
        flex: 1,
        justifyContent:"flex-start"
      },
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
      TextoModificar: {
        width:  30, 
        height: 27
      },
      img: {
        width: 300,
        height: 300,
        alignSelf: "center",
        borderRadius: 600
      },
      BotonModificar: {
        position: 'absolute',
        left: Constants.statusBarHeight * 0.1,
        padding: 10,
        alignSelf: 'flex-end'
      },
      dropdownID: {
        marginTop: 30,
        marginLeft: 15,
        height: 50,
        flex: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        backgroundColor: "white"
      },
      dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        backgroundColor: "white"
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
        color: "black"
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "black"

      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
  });

export default NewContact