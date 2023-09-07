import mongoose from 'mongoose'

const connectDataBase = async (): Promise<void> => {
  try{
    const connect = await mongoose.connect(process.env.MONGO_URI! as string)
    console.log(`MongoDB connected: ${connect.connection.host}`)
  }catch(error){
    console.error("Error:", error)
  }
}

export default connectDataBase