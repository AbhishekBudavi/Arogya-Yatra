"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Bot,
  Send,
  Loader2,
  Check,
  X,
  Database,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";

const DoctorNoteAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [approve, setApprove] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [blockedMessageId, setBlockedMessageId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (doctorInput) => {
    // Simulate AI response based on doctor input
    const responses = [
      `**PATIENT NOTE**\n\n**Chief Complaint:** ${doctorInput.substring(0, 50)}...\n\n**Assessment:** Patient presents with symptoms as described. Vital signs within normal limits. Recommend follow-up care and monitoring.\n\n**Plan:**\n- Continue current treatment protocol\n- Schedule follow-up in 2 weeks\n- Patient education provided\n\n**Disposition:** Stable for discharge with instructions.`,

      `**CLINICAL DOCUMENTATION**\n\n**History of Present Illness:** ${doctorInput.substring(0, 40)}...\n\n**Physical Examination:** Unremarkable findings on general examination. Patient appears comfortable and alert.\n\n**Assessment & Plan:**\n- Diagnosis consistent with clinical presentation\n- Prescribed appropriate medication\n- Return if symptoms worsen\n\n**Provider:** Dr. [Name], MD`,

      `**PROGRESS NOTE**\n\n**Subjective:** Patient reports ${doctorInput.substring(0, 30)}...\n\n**Objective:** Vital signs stable. Physical exam notable for described findings.\n\n**Assessment:** Clinical impression supports initial diagnosis.\n\n**Plan:**\n- Continue current management\n- Lab work as indicated\n- Follow-up as scheduled\n\n**Electronically signed by:** Dr. [Name]`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "doctor",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(
      () => {
        const aiResponse = {
          id: Date.now() + 1,
          role: "ai",
          content: generateAIResponse(inputValue),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "pending", // pending, approved, rejected
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      },
      1500 + Math.random() * 1000
    );
  };

  const handleApprove = (messageId) => {
    const alreadyApproved = messages.some((msg) => msg.status === "approved");

    if (alreadyApproved) {
      setBlockedMessageId(messageId); // mark the blocked one
      setTimeout(() => setBlockedMessageId(null),2000); // reset after 2 seconds
      alert("Only one AI-generated note can be approved at a time.");
      return;
    }

    setApprove(true);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "approved" } : msg
      )
    );

    const approvedMessage = messages.find((msg) => msg.id === messageId);
    if (approvedMessage) {
      const noteToSave = {
        id: messageId,
        content: approvedMessage.content,
        timestamp: new Date().toISOString(),
        savedAt: new Date().toLocaleString(),
      };

      setSavedNotes((prev) => [...prev, noteToSave]);
      console.log("Saving to database:", noteToSave);
    }
  };

  const handleReject = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "rejected" } : msg
      )
    );
  };

  const handleRegenerate = (messageId) => {
    const originalInput = messages.find(
      (msg) => msg.role === "doctor" && msg.id === messageId - 1
    );
    if (originalInput) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "regenerating" } : msg
        )
      );

      setIsLoading(true);

      setTimeout(
        () => {
          const newResponse = {
            ...messages.find((msg) => msg.id === messageId),
            content: generateAIResponse(originalInput.content),
            status: "pending",
          };

          setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? newResponse : msg))
          );
          setIsLoading(false);
        },
        1000 + Math.random() * 500
      );
    }
  };

  const handleBack = () => {
    console.log("Going back...");
  };

  const LoadingMessage = () => (
    <div className="flex justify-end mb-4">
      <Card className="max-w-[85%] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 text-xs"
            >
              AI Assistant
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs sm:text-sm">Generating note...</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-6 px-4">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-bold text-sm sm:text-base">Go back</span>
        </button>
      </div>
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 rounded-3xl p-3 sm:p-4 shadow-sm mx-2 sm:mx-0">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              AI Doctor Note Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              Transform your clinical observations into professional documentation
            </p>
            <p className="text-xs text-slate-600 sm:hidden">
              Clinical AI Assistant
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-2 sm:p-4 flex flex-col bg-gradient-to-br from-slate-50 via-gray-100 to-indigo-50">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-2 sm:pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
                  Ready to assist with your documentation
                </h3>
                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto tracking-wide">
                  Share your clinical observations, patient symptoms, or examination findings, and I'll help generate a professional doctor's note.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "doctor" ? "justify-start" : "justify-end"} mb-4`}
              >
                <Card
                  className={`max-w-[90%] sm:max-w-[85%] transition-all duration-500 ${
                    message.role === "doctor"
                      ? "bg-white border-slate-200 shadow-md"
                      : message.status === "approved"
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg ring-2 ring-green-100"
                        : message.status === "rejected"
                          ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-md opacity-75 blur-[0.5px]"
                          : message.status === "regenerating"
                            ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md"
                            : `bg-gradient-to-br from-blue-50 to-indigo-50 ${blockedMessageId === message.id ? "border-red-500 ring-4 ring-red-600" : "border-blue-200"} shadow-lg`
                  }`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {message.role === "doctor" ? (
                        <Stethoscope className="w-4 h-4 text-slate-600 tracking-wide" />
                      ) : (
                        <Bot
                          className={`w-4 h-4 ${
                            message.status === "approved"
                              ? "text-green-600"
                              : message.status === "rejected"
                                ? "text-red-600"
                                : message.status === "regenerating"
                                  ? "text-amber-600"
                                  : "text-blue-600"
                          }`}
                        />
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          message.role === "doctor"
                            ? "bg-slate-100 text-slate-700"
                            : message.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : message.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : message.status === "regenerating"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {message.role === "doctor" ? "Doctor" : "AI Assistant"}
                      </Badge>

                      {/* Status badges */}
                      {message.role === "ai" &&
                        message.status === "approved" && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Approved</span>
                            <span className="sm:hidden">✓</span>
                          </Badge>
                        )}
                      {message.role === "ai" &&
                        message.status === "rejected" && (
                          <Badge variant="destructive" className="text-xs">
                            <X className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Rejected</span>
                            <span className="sm:hidden">✗</span>
                          </Badge>
                        )}
                      {message.role === "ai" &&
                        message.status === "regenerating" && (
                          <Badge className="bg-amber-500 text-white text-xs">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            <span className="hidden sm:inline">Regenerating</span>
                            <span className="sm:hidden">↻</span>
                          </Badge>
                        )}

                      <span className="text-xs text-slate-500 ml-auto">
                        {message.timestamp}
                      </span>
                    </div>

                    <div
                      className={`prose prose-sm max-w-none transition-all duration-300 ${
                        message.role === "doctor"
                          ? "text-slate-700"
                          : message.status === "rejected"
                            ? "text-slate-500"
                            : "text-slate-800"
                      }`}
                    >
                      {message.content.split("\n").map((line, index) => (
                        <p
                          key={index}
                          className={`${line.startsWith("**") ? "font-semibold" : ""} mb-1 text-sm break-words`}
                        >
                          {line.replace(/\*\*/g, "")}
                        </p>
                      ))}
                    </div>

                    {/* Rejection overlay */}
                    {message.role === "ai" && message.status === "rejected" && (
                      <div className="absolute inset-0 bg-red-500/5 rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="bg-red-500/20 px-2 sm:px-3 py-1 rounded-full">
                          <span className="text-red-700 font-medium text-xs sm:text-sm">
                            Content Rejected
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Confirmation buttons for AI responses */}
                    {message.role === "ai" && message.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-blue-100">
                        <Button
                          onClick={() => handleApprove(message.id)}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Approve & Save</span>
                          <span className="sm:hidden">Approve</span>
                        </Button>
                        <Button
                          onClick={() => handleReject(message.id)}
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {/* Actions for rejected content */}
                    {message.role === "ai" && message.status === "rejected" && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-red-100">
                        <Button
                          onClick={() => handleRegenerate(message.id)}
                          size="sm"
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button
                          onClick={() => handleApprove(message.id)}
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 flex-1 text-xs sm:text-sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Approve Anyway</span>
                          <span className="sm:hidden">Approve</span>
                        </Button>
                      </div>
                    )}

                    {/* Status indicators */}
                    {message.role === "ai" && message.status === "approved" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <Database className="w-4 h-4 text-green-600" />
                          <span className="text-xs sm:text-sm text-green-700 font-medium">
                            <span className="hidden sm:inline">Successfully saved to database</span>
                            <span className="sm:hidden">Saved to database</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {message.role === "ai" &&
                      message.status === "regenerating" && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100">
                          <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                          <span className="text-xs sm:text-sm text-amber-700 font-medium">
                            <span className="hidden sm:inline">Generating improved version...</span>
                            <span className="sm:hidden">Regenerating...</span>
                          </span>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            ))}

            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="mt-4 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe patient symptoms, examination findings, or clinical observations..."
              className="flex-1 min-h-[60px] resize-none border-slate-200 focus:border-blue-300 focus:ring-blue-300 rounded-xl text-sm sm:text-base"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-3 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-200 sm:self-end text-sm sm:text-base"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Generate Note</span>
                  <span className="sm:hidden">Generate</span>
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-slate-500 mt-2 text-center px-2">
            <span className="hidden sm:inline">AI-generated content should be reviewed and verified before use in clinical practice</span>
            <span className="sm:hidden">Review AI content before clinical use</span>
          </div>

          {/* Database status */}
          {savedNotes.length > 0 && (
            <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-green-800 text-sm sm:text-base">
                    {savedNotes.length} Medical Note
                    {savedNotes.length > 1 ? "s" : ""} Saved
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">
                    <span className="hidden sm:inline">Successfully stored in database</span>
                    <span className="sm:hidden">Stored in database</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorNoteAssistant;