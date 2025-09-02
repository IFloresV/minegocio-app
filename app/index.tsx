import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
   return (
      <>
         <ScrollView className="flex-1 bg-movapp-purple">
            {/* Hero Section */}
            <View className="bg-gradient-to-r from-movapp-blue to-movapp-purple p-6 m-4 rounded-xl mt-48">
               <Text className="text-white text-2xl font-bold text-center mb-2">¡Bienvenido a zermat! 🚀</Text>
            </View>
         </ScrollView>
      </>
   );
}
