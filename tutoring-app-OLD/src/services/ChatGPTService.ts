import axios, { AxiosResponse } from 'axios';
import { QuestionSetModel } from "../models/QuestionSetModel";

interface Message {
    role: string;
    content: string;
}

interface ResponseData {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{ message: Message }>;
}

interface ChatMessage {
    role: string;
    content: string;
}

interface ChatResponse {
    data: {
        data: {
            messages: ChatMessage[];
        };
    };
}

class ChatGPTService {
    async sendQuestionSetData(questionSet: QuestionSetModel): Promise<ResponseData | undefined> {
        const data = {
            "messages": [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": `Test Question` }
            ]
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            }
        };

        try {
            const response: AxiosResponse<ResponseData> = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
            return response.data;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async sendMessageToGPT3(message: string): Promise<ResponseData | undefined> {
        const data = {
            "prompt": message,
            "max_tokens": 60
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            }
        };

        try {
            const response: AxiosResponse<ResponseData> = await axios.post('https://api.openai.com/v1/engines/davinci/completions', data, config);
            return response.data;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}

export default new ChatGPTService();