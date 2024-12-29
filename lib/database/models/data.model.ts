import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IData extends Document {
  document_id: string;
  address: string;
  change: string;
  market_cap: string;
  name: string;
  price: string;
  timestamp: Date;
  volume: string;
}

const DataSchema = new Schema<IData>({
  document_id: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  change: { type: String, required: true },
  market_cap: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  timestamp: { type: Date, required: true },
  volume: { type: String, required: true },
});

// Check if the model exists before creating a new one
const Data = (mongoose.models.Data as Model<IData>) || mongoose.model<IData>('Data', DataSchema);

export default Data;