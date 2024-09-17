"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface ChatInterfaceProps {
  initialMessage: string;
  onBack: () => void;
}

export default function ChatInterface({
  initialMessage,
  onBack,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string }[]
  >([
    { type: "user", content: initialMessage },
    {
      type: "bot",
      content:
        "Thank you for your question about biogas. I'm processing your inquiry and will respond shortly.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsSpeaking(false);
      };
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prev) => [...prev, { type: "user", content: inputText }]);
      // Here you would typically send the message to your AI backend
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content:
              "I'm processing your question about biogas and will provide more information shortly.",
          },
        ]);
      }, 1000);
      setInputText("");
    }
  };

  const toggleSpeechRecognition = () => {
    if (recognitionRef.current) {
      if (isSpeaking) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Left static section */}
      <div className="w-[30%] bg-white p-6 flex flex-col shadow-lg rounded-r-3xl">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biosarthi-logo-2sEzrkSriSDGPLl9DwFUDoGep5VCwn.png"
          alt="BioSarthi Logo"
          width={128} // Set explicit width in pixels
          height={128} // Set explicit height in pixels (adjust as needed)
          className="w-32 h-auto mb-8" // Use Tailwind for responsive behavior
        />

        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-4 text-green-600 tracking-tight">
            BioSarthi: Your Biogas Expert
          </h1>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Explore the world of biogas with BioSarthi. Ask questions, get
            insights, and learn about sustainable energy solutions that can
            transform our future.
          </p>
        </div>
        <div className="mt-auto">
          {["About", "Marketplace", "Patent", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="block text-sm font-medium text-gray-600 hover:text-green-600 transition-colors mb-2 hover:translate-x-1 duration-200"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Right dynamic section */}
      <div className="w-[70%] flex flex-col bg-white bg-opacity-75 backdrop-blur-sm">
        {/* Back arrow */}
        <div className="p-4 border-b border-gray-200">
          <Button
            onClick={onBack}
            variant="ghost"
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-grow p-6 overflow-y-auto space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {message.type === "user" ? "You" : "BioSarthi"}
                </p>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow mr-2 border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={toggleSpeechRecognition}
              className={`mr-2 ${
                isSpeaking
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors duration-200`}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
