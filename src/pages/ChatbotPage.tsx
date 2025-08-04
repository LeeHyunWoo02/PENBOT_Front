import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotPageProps {
  onLoginClick: () => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ onLoginClick }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 라온아띠 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date()
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // 임시 응답 (실제로는 백엔드 API 호출)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('예약') || input.includes('예약하기')) {
      return '예약에 대해 문의하시는군요! 언제 체크인하실 예정인가요? 몇 명이 투숙하실 예정인가요?';
    }
    
    if (input.includes('가격') || input.includes('요금') || input.includes('비용')) {
      return '라온아띠 독채 풀빌라의 요금은 다음과 같습니다:\n\n평일: 200,000원/박\n주말: 250,000원/박\n성수기: 300,000원/박\n\n정확한 요금은 예약하시는 날짜에 따라 달라질 수 있습니다.';
    }
    
    if (input.includes('위치') || input.includes('주소') || input.includes('찾아오는 길')) {
      return '라온아띠는 강원도 평창군 진부면에 위치해 있습니다. 평창역에서 차로 약 15분 거리이며, 진부면사무소 근처에서 "라온아띠" 간판을 찾으시면 됩니다.';
    }
    
    if (input.includes('시설') || input.includes('편의시설') || input.includes('어떤 시설')) {
      return '라온아띠 독채 풀빌라는 다음과 같은 시설을 제공합니다:\n\n• 완비된 주방\n• BBQ 시설\n• 개인 수영장\n• 넓은 정원\n• 주차 공간\n• 무료 Wi-Fi\n• 에어컨/난방\n\n최대 15명까지 투숙 가능합니다.';
    }
    
    if (input.includes('체크인') || input.includes('체크아웃')) {
      return '체크인 시간: 오후 3시\n체크아웃 시간: 오전 11시\n\n조기 체크인이나 늦은 체크아웃이 필요하시면 사전에 문의해 주세요.';
    }
    
    if (input.includes('취소') || input.includes('환불')) {
      return '예약 취소 정책은 다음과 같습니다:\n\n• 7일 전 취소: 100% 환불\n• 3-7일 전 취소: 50% 환불\n• 3일 이내 취소: 환불 불가\n\n자세한 사항은 고객센터로 문의해 주세요.';
    }
    
    if (input.includes('반려동물') || input.includes('강아지') || input.includes('고양이')) {
      return '죄송합니다. 라온아띠는 반려동물 동반 투숙이 불가능합니다. 편안한 휴식을 위해 다른 고객님들의 이용에 방해가 되지 않도록 협조해 주시기 바랍니다.';
    }
    
    if (input.includes('연락처') || input.includes('전화번호') || input.includes('문의')) {
      return '라온아띠 고객센터 연락처입니다:\n\n📞 전화: (010) 1234-5678\n📧 이메일: info@raonatti.com\n\n평일 오전 9시 ~ 오후 6시까지 문의 가능합니다.';
    }
    
    return '죄송합니다. 질문을 정확히 이해하지 못했습니다. 예약, 가격, 위치, 시설, 체크인/아웃, 취소 정책 등에 대해 문의해 주시면 자세히 안내해 드리겠습니다.';
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
                      backgroundColor: '#2196f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8,
                      fontSize: 16
                    }}>
                      🤖
                    </div>
                  )}
                  <div style={{
                    fontSize: 12,
                    color: message.isUser ? 'rgba(255,255,255,0.7)' : '#666',
                    marginBottom: 4
                  }}>
                    {message.isUser ? '나' : '라온아띠 AI'}
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
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            style={{
              flex: 1,
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
          flexWrap: 'wrap',
          gap: 8
        }}>
          {[
            '예약 문의',
            '가격 안내',
            '위치/교통',
            '시설 정보',
            '체크인/아웃',
            '취소 정책'
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
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: 12,
                cursor: isTyping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {quickQuestion}
            </button>
          ))}
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