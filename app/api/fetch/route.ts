// app/api/fetch/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Data, { IData } from '@/lib/database/models/data.model'; // Ensure IData is exported from your model
import mongoose from 'mongoose';

// Define the IData interface if not already defined in your model
// This should match the structure of your documents in the 'scraped_data' collection
/*
export interface IData {
  document_id: string;
  address: string;
  change: string;
  market_cap: string;
  name: string;
  price: string;
  timestamp: Date;
  volume: string;
}
*/

export async function GET() {
  try {
    // Establish database connection
    await connectToDatabase();

    // Ensure that the database connection is established
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }

    // Log the current database and its collections for debugging

    // Attempt to find the document using the Mongoose model with proper typing
    let data: IData | null = await Data.findOne({ document_id: 'scraped_data' }).lean<IData>();

    // If not found, attempt to query the collection directly with proper typing
    if (!data) {
      const collection = mongoose.connection.db.collection<IData>('scraped_data');
      data = await collection.findOne({ document_id: 'single_dataset' });
    }

    // If data is still not found, return a 404 response
    if (!data) {
      console.log('No data found in database');
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    // Log and return the found data
    return NextResponse.json(data);
  } catch (error: unknown) {
    // Log the detailed error for debugging
    console.error('Detailed error:', error);

    // Prepare the error response
    const errorResponse: {
      error: string;
      details?: string;
      stack?: string;
    } = {
      error: 'Failed to fetch data',
    };

    // If the error is an instance of Error, extract its message and stack
    if (error instanceof Error) {
      errorResponse.details = error.message;
      if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
      }
    } else {
      // Handle non-Error exceptions
      errorResponse.details = 'An unknown error occurred';
    }

    // Return a 500 Internal Server Error response with error details
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
