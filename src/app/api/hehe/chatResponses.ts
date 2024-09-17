import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { NextResponse } from "next/server";

// Set maximum duration for the streaming response (30 seconds)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Parse the incoming request to extract messages
    const { messages } = await req.json();

    // Handle invalid or empty messages case
    if (!messages || !messages.length) {
      return new NextResponse(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400 }
      );
    }
    console.log("this is message tanb:", messages);
    // Stream the conversation using GPT-4 Turbo model
    const result = await streamText({
      model: openai("gpt-4-turbo"), // GPT-4 Turbo model specified
      messages: convertToCoreMessages(messages), // Convert messages into core format for AI SDK
    });

    // Return the streamed response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chatbot streaming:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred while processing the chat" }),
      { status: 500 }
    );
  }
}
