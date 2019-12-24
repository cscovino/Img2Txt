import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native'
import { Input } from 'react-native-elements'
import ImageView from 'react-native-image-view'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'

const App = () => {

  const [ imageSrc, setImageSrc ] = useState('')
  const [ imageURL, setImageURL ] = useState('')
  const [ api, setApi ] = useState('http://192.168.0.137:5000')
  const [ modalVisible, setmodalVisible ] = useState(false)
  const [ imageVisible, setImageVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ loadingBack, setLoadingBack ] = useState(false)
  const [ converted, setConverted ] = useState(false)
  const [ preds, setPreds ] = useState([])

  selectPhoto = () => {
    const options = {
        quality: 1.0,
        storageOptions: {
            skipBackup: true,
        },
    }

    ImagePicker.showImagePicker(options, (response) => {
        
        if (response.didCancel) {
            console.log('User cancelled photo picker')
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton)
        } else {
            const source = { 
              uri: response.uri,
              type: response.type,
              name: response.fileName
            };
            setImageSrc(source)
        }   
    })
  }

  again = () => {
    setLoadingBack(true)
    setImageURL('')
    setPreds([])
    setConverted(false)
    setImageSrc('')
    setTimeout(() => setLoadingBack(false), 500)
  }

  openImageVisible = () => setImageVisible(true)

  closeImageVisible = () => setImageVisible(false)

  openSettings = () => setmodalVisible(true)

  closeSettings = () => setmodalVisible(false)

  async function sendPhoto() {
    try {
      setLoading(true)
      const bodyFile = new FormData()
      bodyFile.append('file', imageSrc)
      let response = await fetch(api+'/file-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: bodyFile
      })
      let responseJson = await response.json();
      setImageURL(responseJson['localizacion_url'])
      setPreds(preds.concat(responseJson.pred))
      setConverted(true)
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  function Item({text,score,header}) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row'
        }}
      >
        <Text style={header?[styles.itemText,{fontSize:25,fontWeight:'bold'}]:styles.itemText}>
          {text}
        </Text>
        <Text style={header?[styles.itemText,{fontSize:25,fontWeight:'bold'}]:styles.itemText}>
          {score}
        </Text>
      </View>
    )
  }

  return (
    <LinearGradient 
      colors={['#041523','#052643']} 
      style={styles.body}>

      <ImageView 
        images={[{source:{uri:api+imageURL}}]} 
        style={styles.imgBack} 
        imageIndex={0}
        isVisible={imageVisible}
        onClose={this.closeImageVisible}/>

      <Spinner
        visible={loading}
        textContent={'Buscando palabras...'}
        textStyle={{color: '#48ffd5', fontSize: 35}}
        color='#48ffd5'
        animation='fade'
        size='large'
        overlayColor='rgba(0,0,0,0.8)'
      />

      <Spinner
        visible={loadingBack}
        textContent={'Refrescando...'}
        textStyle={{color: '#48ffd5', fontSize: 35}}
        color='#48ffd5'
        animation='fade'
        size='large'
        overlayColor='rgba(0,0,0,0.8)'
      />

      <Modal 
        style={styles.modal} 
        isVisible={modalVisible}
        onBackdropPress={this.closeSettings}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Dirección de la API:</Text>   
          <Input
            value={api}
            onChangeText={text => setApi(text)}
            label='API'
            labelStyle={{marginHorizontal:20}}
            inputContainerStyle={{marginHorizontal:20}}
            placeholder='http://0.0.0.0:5000/'
            rightIconContainerStyle={{marginStart:5}}
            rightIcon={
              <Icon
                name='sign-direction'
                size={24}
                color='black'
              />
            }
          />
          <View 
            style={{
              flexDirection:'row', 
              justifyContent:'flex-end', 
              alignItems:'center',
              marginTop:30,
              marginEnd:25}}>
            <TouchableOpacity 
              style={{
                marginStart:5,
                paddingHorizontal:20,
                paddingVertical:10,  
                backgroundColor:'#000',
                borderRadius:4
              }}
              onPress={this.closeSettings}>
              <Text 
                style={{
                  color:'#fff', 
                  fontSize:15
                }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <StatusBar backgroundColor="#041523" barStyle="light-content"/>
      <View style={{flex: 1}}>
        <View style={{width:'100%', flexDirection: 'row', marginBottom: 10}}>
          <View style={{width:'33%'}}></View>
          <View style={styles.title}>
            <Text style={styles.text}>i2</Text>
            <Icon name={'format-textbox'} size={60} color='#48ffd5' style={styles.iconRight}/>
          </View>
          <View style={styles.settings}>
            <TouchableOpacity onPress={this.openSettings}>
              <Icon name={'settings'} size={20} color='#48ffd5' style={styles.iconRight}/>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.subtext}>Elegí o sacá un foto para obtener el texto</Text>
        </View>
      </View>
      <View style={{flex: 4, width: '100%', justifyContent: 'flex-start', alignItems: 'center'}}>
        {!converted ?
          <TouchableOpacity style={styles.picture} onPress={this.selectPhoto}>
            <ImageBackground source={{uri:imageSrc.uri}} style={styles.imgBack}>
              <Icon name={'camera'} size={60} color='#48ffd5' style={styles.iconLeft}/>
            </ImageBackground>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.picture} onPress={this.openImageVisible}>
            <Image source={{uri:api+imageURL}} style={styles.imgBack}/>
          </TouchableOpacity>
        }
        {!converted ?  
          <TouchableOpacity style={styles.button} onPress={() => sendPhoto()}>
            <Icon name={'image-search-outline'} size={40} color='#041523' style={styles.iconLeft}/>
            <Icon name={'chevron-double-right'} size={40} color='#041523' style={styles.iconMid}/>
            <Icon name={'format-textbox'} size={40} color='#041523' style={styles.iconRight}/>
          </TouchableOpacity>
          :
          <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={this.again}>
            <Icon name={'refresh'} size={40} color='#041523' style={styles.iconMid}/>
          </TouchableOpacity>
        }
        {converted ?  
          <FlatList
            style={{marginTop:10,width:'70%',height:150}}
            data={preds}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => <Item text='Palabra' score='Certeza' header={true}/>}
            ListHeaderComponentStyle={{borderBottomColor:'#48ffd5', borderBottomWidth:2, marginBottom:5}}
            renderItem={ ({item}) => <Item text={item.pred} score={item['confidence_score']} header={false}/>}
          />
          :
          null
        }
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0
  },
  modal: {
    justifyContent: 'flex-start', 
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: '#fff',
    width: '80%',
    height: '30%',
    borderRadius: 10,
    marginTop: '40%',
    paddingVertical: 20,
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 25, 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: "33%"
  },
  settings: {
    width: '33%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  text: {
    color: '#48ffd5',
    fontSize: 50,
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  subtext: {
    color: '#48ffd5',
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginHorizontal: 20
  },
  picture: {
    height: '40%',
    width:'85%',
    backgroundColor: '#fff',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  imgBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#48ffd5'
  },
  itemText: {
    color: '#48ffd5',
    fontSize: 20,
    width:'50%', 
    justifyContent:'center', 
    alignItems: 'center', 
    textAlign: 'center'
  }
});

export default App;