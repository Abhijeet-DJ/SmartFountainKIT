import mongoose from 'mongoose';

const fountainSchema = new mongoose.Schema({
    fountainId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    PH: { type: Number, required: true },
    TDS: { type: Number, required: true },
    Turbidity: { type: Number, required: true },
    waterTemperature: { type: Number, required: true },
    waterLevel: { type: Number, required: true },
    RGB: {
        R: { type: Number, required: true },
        G: { type: Number, required: true },
        B: { type: Number, required: true }
    },
    pumpStatus: { type: Boolean, required: true },
    RGBStatus: { type: Boolean, required: true },
    weeklyData: {
        type: Map,
        of: new mongoose.Schema({
            Turbidity: { type: Number, required: true },
            Temperature: { type: Number, required: true }
        }, { _id: false })
    },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Fountain', fountainSchema);