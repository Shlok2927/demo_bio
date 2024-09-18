"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import ChatInterface from "./chat-interface";
import Image from "next/image";
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the allSuggestions array
  const allSuggestions = useMemo(
    () => [
      "What is biogas?",
      "How is biogas produced?",
      "Benefits of biogas?",
      "Biogas vs natural gas?",
      "Biogas and greenhouse gases?",
      "Materials for biogas production?",
      "Biogas in rural areas?",
      "Biogas plant setup cost?",
      "Biogas energy efficiency?",
      "Biogas in transportation?",
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsSpeaking(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (inputText.trim()) {
        setShowChat(true);
      }
    }
  };

  const handleSpeakClick = () => {
    if (isSpeaking) {
      stopListening();
    } else {
      startListening();
    }
  };
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

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(stopListening, 2000);
      };

      recognitionRef.current.onend = () => {
        setIsSpeaking(false);
      };
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stopListening]);

  useEffect(() => {
    const rotateSuggestions = () => {
      const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
      setCurrentSuggestions(shuffled.slice(0, 3));
    };

    rotateSuggestions();
    const intervalId = setInterval(rotateSuggestions, 50000);

    return () => clearInterval(intervalId);
  }, [allSuggestions]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsSpeaking(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim()) {
      setShowChat(true);
    }
  };

  const handleBack = () => {
    setShowChat(false);
    setInputText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowChat(true);
  };

  if (showChat) {
    return <ChatInterface initialMessage={inputText} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <header className="fixed w-full z-10 bg-white bg-opacity-90 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            BioSarthi
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="pt-16">
        <section className="relative h-screen flex flex-col items-center justify-center px-4">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "50px 50px",
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          <div className="z-10 text-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biosarthi-logo-2sEzrkSriSDGPLl9DwFUDoGep5VCwn.png"
              alt="BioSarthi Logo"
              width={128} // Set explicit width in pixels
              height={128} // Set explicit height in pixels (adjust as needed)
              className="mx-auto w-64 mb-8 h-auto"
            />

            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-green-600">
              Your Gateway to Biogas Innovation
            </h1>
            <div className="w-full max-w-md mx-auto mt-8 space-y-2">
              <Input
                type="text"
                placeholder="Ask me anything about Biogas..."
                className="w-full border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out h-12"
                onClick={handleSpeakClick}
              >
                <div className="flex items-center justify-center w-full">
                  <Mic
                    className={`h-5 w-5 mr-2 ${
                      isSpeaking ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="relative overflow-hidden h-6">
                    <span
                      className={`absolute left-0 transition-transform duration-300 ease-in-out ${
                        isSpeaking ? "-translate-y-full" : "translate-y-0"
                      }`}
                    >
                      Speak your question
                    </span>
                    <span
                      className={`absolute left-0 transition-transform duration-300 ease-in-out ${
                        isSpeaking ? "translate-y-0" : "translate-y-full"
                      }`}
                    >
                      Listening...
                    </span>
                  </span>
                </div>
              </Button>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Try asking about:
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {currentSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-sm bg-white text-green-600 border-green-400 hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {["About", "Marketplace", "Patent", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
