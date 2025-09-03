import React, { useState, useRef, useEffect } from 'react';
import { callGeminiAPI } from '../utils/chatbotApi';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isReservationQuestion?: boolean;
}

interface ChatbotPageProps {
  onLoginClick: () => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 라온아띠 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date(),
      isReservationQuestion: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Gemini API 호출
      const response = await callGeminiAPI(inputText);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.result,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('챗봇 응답 처리 중 오류:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 헤더 */}
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 600,
          margin: 0
        }}>
          🤖 라온아띠 AI 챗봇
        </h1>
        <p style={{
          fontSize: 14,
          color: '#ccc',
          margin: '8px 0 0 0'
        }}>
          실시간으로 문의사항을 해결해 드립니다
        </p>
        <div style={{
          marginTop: 12,
          display: 'flex',
          justifyContent: 'center',
          gap: 16
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#ff9800'
          }}>
            <span>🏨</span>
            <span>예약 관련 질문</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#4caf50'
          }}>
            <span>💬</span>
            <span>자유 질문</span>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 800,
        margin: '0 auto',
        width: '100%',
        padding: '20px'
      }}>
        {/* 메시지 목록 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 20,
          padding: '0 10px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                marginBottom: 16
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: 18,
                backgroundColor: message.isUser ? '#2196f3' : '#f1f1f1',
                color: message.isUser ? '#fff' : '#333',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: message.isUser ? 0 : 8
                }}>
                  {!message.isUser && (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: message.isReservationQuestion ? '#ff9800' : '#2196f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8,
                      fontSize: 16
                    }}>
                      {message.isReservationQuestion ? '🏨' : '🤖'}
                    </div>
                  )}
                  <div style={{
                    fontSize: 12,
                    color: message.isUser ? 'rgba(255,255,255,0.7)' : '#666',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {message.isUser ? '나' : '라온아띠 AI'}
                    {!message.isUser && message.isReservationQuestion && (
                      <span style={{
                        fontSize: 10,
                        backgroundColor: '#ff9800',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: 8,
                        fontWeight: 500
                      }}>
                        예약
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  fontSize: 14,
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line'
                }}>
                  {message.text}
                </div>
                <div style={{
                  fontSize: 11,
                  color: message.isUser ? 'rgba(255,255,255,0.7)' : '#999',
                  marginTop: 4,
                  textAlign: 'right'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* 타이핑 표시 */}
          {isTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 16
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: 18,
                backgroundColor: '#f1f1f1',
                color: '#333'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#2196f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    fontSize: 16
                  }}>
                    🤖
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#666',
                    marginBottom: 4
                  }}>
                    라온아띠 AI
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'typing 1.4s infinite ease-in-out'
                  }} />
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'typing 1.4s infinite ease-in-out 0.2s'
                  }} />
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'typing 1.4s infinite ease-in-out 0.4s'
                  }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: 12,
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flex: 1
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 24,
                border: '1px solid #ddd',
                fontSize: 14,
                resize: 'none',
                minHeight: 48,
                maxHeight: 120,
                fontFamily: 'inherit',
                outline: 'none'
              }}
              rows={1}
            />
            <div style={{
              fontSize: 11,
              color: '#666',
              padding: '0 4px'
            }}>
              💡 예약 관련 질문은 🏨 아이콘으로, 자유 질문은 💬 아이콘으로 구분됩니다
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            style={{
              padding: '12px 20px',
              borderRadius: 24,
              border: 'none',
              backgroundColor: inputText.trim() && !isTyping ? '#2196f3' : '#ccc',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>전송</span>
            <span style={{ fontSize: 16 }}>📤</span>
          </button>
        </div>

        {/* 빠른 질문 버튼들 */}
        <div style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {/* 예약 관련 빠른 질문 */}
          <div>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#333',
              margin: '0 0 8px 0',
              padding: '0 4px'
            }}>
              🏨 예약 관련 질문
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}>
              {[
                '예약 문의',
                '가격 안내',
                '체크인/아웃',
                '인원 문의',
                '날짜 확인'
              ].map((quickQuestion) => (
                <button
                  key={quickQuestion}
                  onClick={() => {
                    setInputText(quickQuestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  disabled={isTyping}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 16,
                    border: '1px solid #2196f3',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: 12,
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    if (!isTyping) {
                      e.currentTarget.style.backgroundColor = '#bbdefb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isTyping) {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }
                  }}
                >
                  {quickQuestion}
                </button>
              ))}
            </div>
          </div>

          {/* 자유 질문 */}
          <div>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#333',
              margin: '0 0 8px 0',
              padding: '0 4px'
            }}>
              💬 자유 질문
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}>
              {[
                '위치/교통',
                '시설 정보',
                '주변 관광',
                '추천 코스',
                '기타 문의'
              ].map((quickQuestion) => (
                <button
                  key={quickQuestion}
                  onClick={() => {
                    setInputText(quickQuestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  disabled={isTyping}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 16,
                    border: '1px solid #4caf50',
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontSize: 12,
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    if (!isTyping) {
                      e.currentTarget.style.backgroundColor = '#c8e6c9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isTyping) {
                      e.currentTarget.style.backgroundColor = '#e8f5e8';
                    }
                  }}
                >
                  {quickQuestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatbotPage; 