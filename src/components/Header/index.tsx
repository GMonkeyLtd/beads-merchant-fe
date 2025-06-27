import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import signalBars from '../../assets/icons/signal-bars.svg'
import signalRed from '../../assets/icons/signal-red.svg'

interface HeaderProps {
  title?: string
  showSignal?: boolean
}

export default function Header({ title = '商家管理后台', showSignal = true }: HeaderProps) {
  return (
    <View className="header-container">
      {showSignal && (
        <View className="signal-group">
          <Image 
            className="signal-bars" 
            src={signalBars}
            mode="aspectFit"
          />
          <Image 
            className="signal-red" 
            src={signalRed}
            mode="aspectFit"
          />
        </View>
      )}
      
      <View className="separator" />
      
      <Text className="header-title">{title}</Text>
    </View>
  )
} 