import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Home } from '../Pages/Home'
import { Clientes } from '../Pages/Clientes'
import { Cadastrar } from '../Pages/Cadastrar'
import { Detalhes } from '../Pages/Detalhes'
import { Precos } from '../Pages/Precos'
import { Devedores } from '../Pages/Devedores'
import { GerarRecibo } from '../Pages/GerarRecibo'

export function Routes(){
    const {Navigator, Screen} = createNativeStackNavigator()
    return(
        <NavigationContainer>
            <Navigator>
                <Screen name='Home' component={Home} options={{headerShown:false}}/>
                <Screen name='Clientes' component={Clientes}options={{headerShown:false}}/>
                <Screen name='Cadastrar' component={Cadastrar}options={{headerShown:false}}/>
                <Screen name='Detalhes' component={Detalhes}options={{headerShown:false}}/>
                <Screen name='Precos' component={Precos} options={{headerShown:false}}/>
                <Screen name='Devedores' component={Devedores} options={{headerShown:false}}/>
                <Screen name='GerarRecibo' component={GerarRecibo} options={{headerShown:false}}/>
            </Navigator>
        </NavigationContainer>
    )
}