import axios from "axios";

export interface ChatbotResponse {
  result: string;
  error?: string;
}

export const callGeminiAPI = async (text: string): Promise<ChatbotResponse> => {
  try {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const token = localStorage.getItem('jwt');
    
    const response = await axios.post('http://13.125.18.129:8080/api/gemini/ask', 
      {
        text
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('챗봇 API 호출 중 오류 발생:', error);
    
    if (axios.isAxiosError(error)) {
      // axios 에러 처리
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        return {
          result: '죄송합니다. 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
        };
      }
      
      if (error.response) {
        // 서버에서 응답을 받았지만 에러 상태 코드인 경우
        const status = error.response.status;
        if (status === 404) {
          return {
            result: '죄송합니다. 챗봇 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
          };
        }
        if (status === 500) {
          return {
            result: '죄송합니다. 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
          };
        }
        if (status === 401) {
          return {
            result: '인증이 필요합니다. 로그인 후 다시 시도해 주세요.'
          };
        }
        return {
          result: `서버 오류가 발생했습니다. (${status})`
        };
      }
      
      if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        return {
          result: '죄송합니다. 네트워크 연결을 확인해 주세요.'
        };
      }
    }
    
    return {
      result: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
