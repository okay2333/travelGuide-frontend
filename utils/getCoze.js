// Coze API 配置
const COZE_CONFIG = {
  BASE_URL: 'https://api.coze.cn/open_api/v2/chat',
  TOKEN: 'pat_zKSMmTyVG2cQYSf1pQH9nwc1EreViCIQvqzecFUjk1nwDcTcnhFgH7eEvYm7wphj',
  BOT_ID: '7449711608777097254',
};

/**
 * 处理 Coze API 响应
 * @param {Object} response - API 响应数据
 * @returns {Object} 处理后的回复内容和后续提示词
 */
const handleCozeResponse = (response) => {
  if (response.code !== 0 || !response.messages || !Array.isArray(response.messages)) {
    throw new Error('无效的响应数据');
  }

  // 查找助手的回答消息
  const answerMessage = response.messages.find(
    msg => msg.role === 'assistant' && msg.type === 'answer'
  );

  if (!answerMessage || !answerMessage.content) {
    throw new Error('未找到有效的回复内容');
  }

  // 查找后续提示词
  const followUps = response.messages
    .filter(msg => msg.role === 'assistant' && msg.type === 'follow_up')
    .map(msg => msg.content);

  return {
    reply: answerMessage.content,
    followUps: followUps
  };
};

/**
 * 发送消息到 Coze
 * @param {string} query - 用户输入的消息
 * @param {string} conversationId - 会话ID，可选
 * @param {string} userId - 用户ID，可选
 * @returns {Promise<Object>} 返回处理后的 AI 响应内容和后续提示词
 */
export const sendMessageToCoze = async (query, conversationId = '', userId = '') => {
  try {
    const response = await uni.request({
      url: COZE_CONFIG.BASE_URL,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${COZE_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      data: {
        conversation_id: conversationId || String(Date.now()),
        bot_id: COZE_CONFIG.BOT_ID,
        user: userId || '29032201862555',
        query: query,
        stream: false
      }
    });

    // 检查响应状态
    if (response.statusCode === 200) {
      return handleCozeResponse(response.data);
    } else {
      throw new Error(`请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('Coze API 调用错误:', error);
    throw error;
  }
};

/**
 * 创建新的会话ID
 * @returns {string} 新的会话ID
 */
export const createConversationId = () => {
  return String(Date.now());
};
